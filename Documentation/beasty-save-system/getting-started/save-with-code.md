# Save with code

The five-minute path: a data class, a `BeastySaveSettings`, `BeastySave.Save`, `BeastySave.Load<T>`. This
page is for people who write C#. If you would rather click, use
[save-without-code.md](save-without-code.md).

## The two namespaces

```csharp
using Beasty_SaveSystem;      // BeastySave, BeastySaveable, BeastySaveManager
using Beasty_SaveSystemCore;  // BeastySaveSettings, SaveResult, LoadResult<T>, BeastySaveError
```

`BeastySave` is a static facade and the only entry point. There is nothing to instantiate and nothing to
initialise.

## 1. A data class

Any plain C# object. Fields are what get written — `public` and `[SerializeField]`, including private ones
inherited from a base class. Properties are ignored.

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class PlayerData
{
    public string playerName = "Hero";
    public int level = 1;
    public float health = 100f;
    public Vector3 position;
    public List<string> inventory = new List<string>();
    public Dictionary<string, int> currencies = new Dictionary<string, int>();
    public DateTime lastPlayed;
}
```

Arrays, `List`, `Dictionary`, `HashSet`, `SortedSet`, `Queue`, `Stack`, enums, nullables, `DateTime` and
the Unity value types all round-trip. What does not: any reference to a `UnityEngine.Object`. Read
[what-gets-saved.md](../guides/what-gets-saved.md) before you design your save class — it is short, and it
will save you a redesign.

## 2. Settings

Every call takes a `BeastySaveSettings`. It carries the location, the encryption flag, the backup flag, the
loading mode and the data version. The defaults are usable as they are.

```csharp
private static readonly BeastySaveSettings Settings = new BeastySaveSettings
{
    Folder = "Saves",   // default
    Extension = "save", // default
    Backup = true,      // default
    Strict = true,      // default
    DataVersion = 1,    // default
};
```

Because settings are passed **per call**, an autosave and a manual save in the same project can behave
differently — different folders, different strictness, one encrypted and one not. See
[settings.md](../guides/settings.md).

## 3. Save

```csharp
using UnityEngine;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;

public class SaveDemo : MonoBehaviour
{
    private static readonly BeastySaveSettings Settings = new BeastySaveSettings();

    public PlayerData Data = new PlayerData();

    public void SaveGame()
    {
        SaveResult result = BeastySave.Save(Data, "slot1", Settings);

        if (!result.Success)
        {
            Debug.LogError($"Could not save: {result}");   // "IoError: ..."
            return;
        }

        Debug.Log("Saved.");
    }
}
```

`BeastySave.Save` returns a `SaveResult`. It does not throw. `result.Success` is the only thing you must
check; `result.Error` is a `BeastySaveError` value and `result.Message` explains it in English.
`result.ToString()` gives you `"OK"` or `"{Error}: {Message}"`, which is what you want in a log line.

### Metadata

The optional fourth argument is a string dictionary written into the file **in plain text, even when the
save is encrypted**. It is how a save-slot screen shows "Chapter 3 — 01:22" without decrypting or
deserialising anything.

```csharp
var meta = new Dictionary<string, string>
{
    ["chapter"] = "3",
    ["playtime"] = "01:22",
};

SaveResult result = BeastySave.Save(Data, "slot1", Settings, meta);
```

Read it back with `BeastySave.ReadMeta`. See
[slots-and-metadata.md](../guides/slots-and-metadata.md).

## 4. Load, and handle failure properly

This is the part that separates a save system from a save bug. A load can fail: the file is missing, the
disk is bad, the player edited it, an antivirus truncated it. **`LoadResult` tells you whether a backup
exists**, and you should offer it.

```csharp
public void LoadGame()
{
    LoadResult<PlayerData> result = BeastySave.Load<PlayerData>("slot1", Settings);

    if (result.Success)
    {
        Data = result.Value;
        return;
    }

    if (result.Error == BeastySaveError.FileNotFound)
    {
        Debug.Log("No save in that slot yet.");
        return;
    }

    Debug.LogError($"Load failed: {result}");

    if (!result.BackupAvailable)
        return;

    // Ask the player first. Then:
    SaveResult restored = BeastySave.RestoreBackup("slot1", Settings);
    if (!restored.Success)
    {
        Debug.LogError($"Backup restore failed: {restored}");
        return;
    }

    LoadResult<PlayerData> retry = BeastySave.Load<PlayerData>("slot1", Settings);
    if (retry.Success)
        Data = retry.Value;
    else
        Debug.LogError($"Backup was unreadable too: {retry}");
}
```

Three things worth naming:

- **`BackupAvailable` is filled in on every load result**, success or failure. You can check it before you
  need it.
- **`RestoreBackup` leaves the `.bak` in place.** Restoring twice is safe.
- **`result.Warnings`** is an `IReadOnlyList<string>` that fills up in tolerant mode
  (`Settings.Strict = false`): fields that were skipped rather than fatal. In strict mode a bad field fails
  the whole load and nothing is applied. See
  [strict-vs-tolerant.md](../guides/strict-vs-tolerant.md).

There are 13 error codes. Each one has a specific meaning and a specific fix; they are listed in
[results-and-errors.md](../reference/results-and-errors.md).

## 5. LoadInto — load onto an object you already have

`Load<T>` builds a new object. `LoadInto` populates one that already exists, which is what you want for a
`MonoBehaviour` or any object other code is already holding a reference to.

```csharp
LoadResult result = BeastySave.LoadInto(Data, "slot1", Settings);
if (!result.Success)
    Debug.LogError($"Load failed: {result}");
// Data has been filled in place. Nobody's reference to it broke.
```

`LoadInto` returns a plain `LoadResult` — there is no `Value`, because the value is the object you passed
in.

## 6. Exists, Delete, ListSlots

```csharp
if (BeastySave.Exists("slot1", Settings))
    Debug.Log("There is a save in slot1.");

BeastySave.Delete("slot1", Settings);   // removes the slot AND its .bak

string[] slots = BeastySave.ListSlots(Settings);  // no .bak, no .tmp
```

`Delete` returns `bool`. `ListSlots` returns slot names, not paths — feed one straight back into `Load`.
For the full paths, `BeastySave.GetFolderPath(Settings)` and `BeastySave.GetSlotPath("slot1", Settings)`.

## 7. Async

```csharp
SaveResult result = await BeastySave.SaveAsync(Data, "slot1", Settings);
LoadResult<PlayerData> loaded = await BeastySave.LoadAsync<PlayerData>("slot1", Settings);
```

Same results, same error codes. The file IO happens asynchronously; serialization and encryption still run
on the calling thread. They keep a large save from stalling the main thread on IO — they are not a
background job. [async-saving.md](../guides/async-saving.md) is precise about it.

## Where to go next

- [what-gets-saved.md](../guides/what-gets-saved.md) — the rules your data class must live by
- [api-beastysave.md](../reference/api-beastysave.md) — every method on the facade
- [results-and-errors.md](../reference/results-and-errors.md) — the 13 error codes, and what to do about each
- [scene-state.md](../guides/scene-state.md) — saving components in the scene instead of your own class
- [versioning-and-migrations.md](../guides/versioning-and-migrations.md) — shipping an update that reads old saves
- [custom-converters.md](../advanced/custom-converters.md) — teaching the system a type it does not know
