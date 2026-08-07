---
title: "Async saving and loading"
description: "Save and load without blocking the main thread. What the async methods move off the main thread, and why cloud backends accept nothing else."
---

Three methods let you save and load without blocking the main thread on disk IO. This page shows how to
use them, and is precise about what they do and do not move off the main thread. It also covers the async
twins of the slot utilities, the async scene save, and the one rule that comes with a cloud backend: on an
asynchronous-only backend, the async API is the only one that works.

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

## The slot utilities have async twins too

Every slot utility has an async counterpart with the same arguments and the same result:

```csharp
static Task<bool>     ExistsAsync(string slot, BeastySaveSettings settings)
static Task<bool>     DeleteAsync(string slot, BeastySaveSettings settings)
static Task<string[]> ListSlotsAsync(BeastySaveSettings settings)
static Task<LoadResult<Dictionary<string, string>>> ReadMetaAsync(string slot, BeastySaveSettings settings)
static Task<SaveResult> RestoreBackupAsync(string slot, BeastySaveSettings settings)
```

On local files these exist for symmetry — the synchronous forms work fine. On a cloud backend they are the
only form that works: a database round-trip cannot answer synchronously. A save-slot screen that probes
slots and reads metadata through the async twins works unchanged whether the game saves to disk or to
[Firebase](/docs/beasty-save-system/guides/firebase/).

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

## Scene saves: SaveAllNowAsync and LoadAllNowAsync

Scene saves have async twins on the manager:

```csharp
Task<SaveResult> BeastySaveManager.SaveAllNowAsync(string slot, IDictionary<string, string> meta = null)
Task<LoadResult> BeastySaveManager.LoadAllNowAsync(string slot)
```

`SaveAllNowAsync` runs the same capture, envelope and logging flow as `SaveAllNow`, awaited through the
pipeline. `LoadAllNowAsync` fetches the data asynchronously and applies it onto the scene objects only
after the await returns to Unity's main thread — so the apply pass is as safe as the synchronous one.
Both update `LastSaveResult`/`LastLoadResult` and fire `SaveCompleted`/`LoadCompleted`, exactly like their
synchronous twins.

The capture itself (walking the registered components) still runs on the main thread; it is the write and
the read that are awaited.

## Async-only backends

A cloud backend — Firestore, Realtime Database, or a custom backend that reports
`SupportsSynchronous = false` — cannot answer a synchronous call. Two different things happen depending on
who calls:

- **From code**, a synchronous call (`Save`, `Load<T>`, `Exists`…) fails immediately with the typed error
  `BackendRequiresAsync` instead of blocking. Nothing is written; switch the call site to the async twin.
- **From the manager's UnityEvent entry points** (`SaveAll`, `LoadAll`, `DeleteSlot` — the ones a uGUI
  button calls), the operation is routed onto the asynchronous path automatically, fire-and-forget, so a
  wired button keeps working and nothing is ever lost. The outcome arrives through
  `SaveCompleted`/`LoadCompleted` and `LastSaveResult`. If the manager's **Save Mode** is still
  `Synchronous`, a warning is logged once per session asking you to set it to `Asynchronous` to
  acknowledge the routing.

See [Storage backends](/docs/beasty-save-system/guides/storage-backends/) for Save Mode and the routing
rules in full.

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
