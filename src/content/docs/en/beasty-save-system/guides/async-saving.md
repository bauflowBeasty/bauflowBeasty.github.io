---
title: "Async saving and loading"
description: "Save and load without blocking the main thread. What SaveAsync, LoadAsync and LoadIntoAsync move off the main thread, and what stays on it."
---

Three methods let you save and load without blocking the main thread on disk IO. This page shows how to
use them, and is precise about what they do and do not move off the main thread.

## The three methods

```csharp
static Task<SaveResult>    SaveAsync(object data, string slot, BeastySaveSettings settings,
                                     IDictionary<string, string> meta = null)
static Task<LoadResult<T>> LoadAsync<T>(string slot, BeastySaveSettings settings)
static Task<LoadResult>    LoadIntoAsync(object target, string slot, BeastySaveSettings settings)
```

Each is the exact counterpart of the synchronous method of the same name, takes the same arguments, and
comes back with the same result type. Nothing throws; you check the result, as always. See
[Results and errors](/docs/beasty-save-system/reference/results-and-errors/).

## What they actually do

> **Note**
> The **file IO** is asynchronous. **Serialization and encryption are not** — they run on the thread that
> calls the method, which is normally the main thread.

This is the honest description, and it is the one you should plan around.

A save has two costs: turning your object graph into text, and pushing that text to disk. The second cost
is the unpredictable one — a slow hard drive, a phone's flash storage under load, a console certification
requirement — and it is the one these methods remove from the main thread. The first cost stays where it
was.

So:

- A save with a **big object graph** will still cost you main-thread time in `SaveAsync`, before the IO
  even starts. Making the call async does not make the serialization free.
- A save with a **modest object graph on a slow disk** is exactly what these methods are for. The hitch
  you were seeing was the disk, and the disk is now off the main thread.

They are not a background job. There is no worker thread chewing through your save while the game plays
on. If your save is genuinely enormous, the answer is a smaller save, not an async one.

## When to use them

Use the async variants when:

- You save during play — an autosave, a checkpoint, a save on room change — and the player would feel a
  dropped frame.
- You are shipping to console or mobile, where storage is slower and less predictable than a desktop SSD.
- Your save is large enough that the write takes long enough to notice.

Use the synchronous ones when:

- You save from a menu the player is already sitting in, where a few milliseconds do not matter.
- You are loading a save as part of a scene transition, where you are showing a loading screen anyway.

Loading a save at the start of a level does not usually need to be async. You are already blocked on the
level loading.

## Awaiting them

Unity does not need a coroutine for this. Mark your method `async` and `await` the call. The continuation
comes back on Unity's main thread, so you can touch the scene straight after the `await`.

```csharp
using System.Threading.Tasks;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;
using UnityEngine;

public sealed class Autosave : MonoBehaviour
{
    [SerializeField] private BeastySaveSettings _settings;

    public async Task SaveCheckpoint(PlayerData data)
    {
        SaveResult result = await BeastySave.SaveAsync(data, "autosave", _settings);

        if (!result.Success)
        {
            // Back on the main thread here — touching the scene is safe.
            Debug.LogError($"Autosave failed: {result.Error} — {result.Message}");
            return;
        }

        ShowSavedIcon();
    }

    private void ShowSavedIcon() { /* … */ }
}
```

## Disabling the save button while a save is in flight

A player who mashes the save button can start a second write to the same slot before the first has
finished. Do not let them. Guard the call with a flag, and disable the button while it is set.

```csharp
using System.Threading.Tasks;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;
using UnityEngine;
using UnityEngine.UI;

public sealed class SaveButton : MonoBehaviour
{
    [SerializeField] private Button _button;
    [SerializeField] private BeastySaveSettings _settings;

    private bool _saving;

    // Wire this to the Button's OnClick. A UnityEvent cannot await a Task, so the
    // handler itself returns void and forwards to the async method.
    public void OnSaveClicked() => _ = SaveAsync("slot1");

    private async Task SaveAsync(string slot)
    {
        if (_saving) return;

        _saving = true;
        _button.interactable = false;
        try
        {
            SaveResult result = await BeastySave.SaveAsync(CollectData(), slot, _settings);
            if (!result.Success)
                Debug.LogError($"Save failed: {result.Error} — {result.Message}");
        }
        finally
        {
            _saving = false;
            _button.interactable = true;
        }
    }

    private PlayerData CollectData() => new PlayerData();
}
```

The `try`/`finally` matters. If the save fails, the button must come back, or a single bad save locks the
player out of saving for the rest of the session.

One more caution: do not fire an autosave and a manual save at the same slot at the same time. Because
writes are atomic you will not end up with a half-written file, but one of the two writes can fail with
`IoError`, and which of them ends up in the slot is not something you control. One save at a time, per
slot.

## Scene saves are synchronous

`BeastySaveManager.SaveAll`, `SaveAllNow`, `LoadAll` and `LoadAllNow` have no async counterparts. A scene
save walks the registered components and writes the file on the spot. If you need the async behaviour for
a scene-sized save, that is a reason to keep your save data in a plain class of your own and use
`BeastySave.SaveAsync` on it. See [Scene state](/docs/beasty-save-system/guides/scene-state/).

## WebGL

> **Warning**
> WebGL is not supported by Beasty Save System, and the async methods are part of the reason: they are
> `Task`-based, and the browser build does not provide the threading they rely on. (The other reason is
> the atomic file replace used by the write path.) See
> [Platforms and limits](/docs/beasty-save-system/advanced/platforms-and-limits/).

## See also

- [BeastySave API](/docs/beasty-save-system/reference/api-beastysave/) — every method on the facade, sync and async
- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/) — what to check on the result
- [Slots and metadata](/docs/beasty-save-system/guides/slots-and-metadata/) — the `meta` argument `SaveAsync` also takes
- [Platforms and limits](/docs/beasty-save-system/advanced/platforms-and-limits/) — where the package runs, and how fast
