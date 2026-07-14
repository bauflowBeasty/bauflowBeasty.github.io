---
title: "Controllers"
description: "The three MonoBehaviours you call from code: BeastyManager , VNGameController , VisualNovelController . All in Beasty.VN.Runtime."
---

The three MonoBehaviours you call from code: `BeastyManager` (the rig), `VNGameController` (the app state and
the saves), `VisualNovelController` (one running story). All in `Beasty.VN.Runtime`.

## Which one do I call

| Job | Call |
|---|---|
| Reach any manager | `BeastyManager.Instance` |
| Delay the game until my system is ready | `BeastyManager.RegisterBootBarrier` |
| Move between app states | `VNGameController` |
| Save or load a player-facing slot | `VNGameController` |
| Read game state outside a story | `VNGameController.SharedVariables` |
| Start, restore or stop one story | `VisualNovelController` |
| Advance, rewind, read variables inside a story | the static [`VN`](/docs/beasty-visual-novel/scripting/vn-api/) API |

Rule of thumb: `VNGameController` decides WHAT is running, `VisualNovelController` runs it, `VN` talks to it.

## BeastyManager

The single object in the hierarchy. It owns every other manager as a hidden sub-component on its own GameObject,
so there is exactly one of each and nothing to wire.

```csharp
public static BeastyManager Instance { get; }
public event Action Ready;
public bool IsReady { get; }
public void MarkReady();
public void RegisterBootBarrier(Func<bool> isDone);
public void EnsureManagers();
```

Manager accessors, all re-resolved at runtime if a reference goes missing:

```csharp
public VNGameController        Game            { get; }
public VisualNovelController   VN              { get; }
public StageController         Stage           { get; }
public FreeRoamController      FreeRoam        { get; }
public FreeRoamScreenController FreeRoamScreens { get; }
public VNAudioManager          Audio           { get; }
public VNBackgroundMusicController BackgroundMusic { get; }
public VNMenuManager           Menus           { get; }
```

Plus the scene pieces and config it holds: `StageRoot`, `MainCanvas`, `MainCamera`, `Loading`, `InputConfig`,
`TimeConfig`.

> **Note**
> `BeastyManager.VN` is the `VisualNovelController` component. The static `VN` API is a different type in the same
> namespace. Inside a class that uses both, qualify the static one as `Beasty.VN.Runtime.VN`.

### Boot barriers

At startup `BeastyManager` shows the loading screen, waits a frame so every subsystem has woken, and then holds
the overlay up until every registered barrier returns true — or until `maxBootSeconds` elapses, whichever comes
first. Then it hides the overlay, sets `IsReady` and raises `Ready`.

A boot barrier is how you put your own slow startup inside that window: a remote config fetch, a login, a save
migration, a warm-up of your own asset system. Without one, the player sees your systems pop in after the game
has already started. Register it in `Awake` — `Start` on the manager runs after one frame and stops accepting
barriers once boot has finished.

```csharp
using System.Threading.Tasks;
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class RemoteConfig : MonoBehaviour
{
    private bool _loaded;

    private void Awake()
    {
        BeastyManager.Instance?.RegisterBootBarrier(() => _loaded);
        _ = FetchAsync();
    }

    private async Task FetchAsync()
    {
        await Task.Delay(1500);   // your real request
        _loaded = true;           // the loading screen can now go away
    }
}
```

Cap the wait realistically. A barrier that never returns true only delays the game by `maxBootSeconds`; it does
not hang it.

## VNGameController

Owns the app state and the shared variable store. One instance: `VNGameController.Instance`.

```csharp
public static VNGameController Instance { get; }
public VNAppState State { get; }
public event Action<VNAppState> StateChanged;
public event Action<FreeRoamSaveState> EnteredFreeRoam;
public VariableStore SharedVariables { get; }
public VNTimeConfig TimeConfig { get; }
public VNSaveManager Saves { get; }
```

`SharedVariables` is THE game state: your variables, character variables, time, quests, inventory, dictionary
overrides. It is carried across every mode, which is why progress survives a project switch and why everything
in it is saved and rewound for free.

### Moving between modes

```csharp
public void GoToMainMenu();
public void StartNewGame();
public void EnterVisualNovel(string nodeId = null);
public void EnterVisualNovel(DialogueScene project, string nodeId = null);
public void PlayVisualNovelThenReturn(DialogueScene project, string nodeId,
                                      FreeRoamSaveState freeRoamReturn, Sprite roomBackground = null);
public bool PresentTalkMenu(string characterId);
public bool PresentTalkMenuThenReturn(string characterId, FreeRoamSaveState freeRoamReturn,
                                      Sprite roomBackground = null);
public void EnterFreeRoam(FreeRoamSaveState position = null);
public void EnterCustom();
```

- `StartNewGame` clears the playthrough, resets the persistent stage and enters the VN host's project.
- `EnterVisualNovel(project, nodeId)` switches project keeping the shared store, so progress carries over.
- `PlayVisualNovelThenReturn` is the FreeRoam bridge: play a scene, then come back to the room you passed in.
  The optional `roomBackground` seeds the backdrop, so a dialogue with no Backdrop block of its own shows the
  room the player is standing in.
- `PresentTalkMenu` returns false when the character's menu resolves to no visible entries. Handle that — do not
  assume it opened.
- `EnterFreeRoam(null)` enters at the map's entry room.
- `EnterCustom` hands the game to your code. See [Custom mode](/docs/beasty-visual-novel/scripting/custom-mode/).

Rolling back across a mode boundary:

```csharp
public bool RollbackFromFreeRoam();
public bool RollbackFromCustom();
public void PushFreeRoamRoom(FreeRoamSaveState state);
public void PushCustomRollback();
```

Both `Rollback*` methods return false when there is nothing to step back into.

### Saving

```csharp
public bool SaveToSlot(string slot, string saveName = null, Texture2D thumbnail = null);
public bool LoadSlot(string slot);
public VNSlotLoadOutcome LoadSlotDetailed(string slot);
public bool RestoreSlotBackup(string slot);
public Task<bool> SaveToSlotAsync(string slot, string saveName = null, Texture2D thumbnail = null);
public Task<VNSlotLoadOutcome> LoadSlotDetailedAsync(string slot);
public VisualNovelSaveData CaptureCurrent();
public bool RestoreFrom(VisualNovelSaveData data);
```

Slots are named: `manual_0`, `manual_1`, ..., `auto_0`, ... `LoadSlotDetailed` returns `VNSlotLoadOutcome`, one of
`Loaded`, `Failed` or `FailedBackupAvailable` — the third is what lets a save screen offer "restore the backup"
instead of just failing. `RestoreSlotBackup` overwrites a damaged slot with its `.bak` sibling.

`SaveToSlot` works from ANY state: it tags the snapshot with the active `VNAppState` and writes the shared store,
the cross-mode rollback queue, the scene state of your `BeastySaveable` components and your
`customStateJson`. It returns false when the moment cannot be captured — a talk menu being open is one such
moment — and nothing is written.

The async variants do the file I/O off the main thread. They still capture on the main thread, because reading
Unity objects requires it. See [Async saving](/docs/beasty-save-system/guides/async-saving/) for what that
actually buys you.

```csharp
using Beasty.VN.Runtime;

public static class QuickSave
{
    public static bool Save() => VNGameController.Instance.SaveToSlot("manual_0", "Quick save");

    public static bool Load()
    {
        var outcome = VNGameController.Instance.LoadSlotDetailed("manual_0");
        if (outcome == VNSlotLoadOutcome.FailedBackupAvailable)
            return VNGameController.Instance.RestoreSlotBackup("manual_0")
                   && VNGameController.Instance.LoadSlot("manual_0");
        return outcome == VNSlotLoadOutcome.Loaded;
    }
}
```

For the whole picture — autosave policy, thumbnails, what a slot holds — see
[Saving and loading](/docs/beasty-visual-novel/production/saving-and-loading/).

## VisualNovelController

Hosts one story. `VisualNovelController.Instance`, or `BeastyManager.Instance.VN`.

```csharp
public static VisualNovelController Instance { get; }
public VNSession Session { get; }
public bool IsRunning { get; }
public bool EndedNaturally { get; }
public DialogueScene Project { get; }
public VariableStore SharedVariableStore { get; set; }
public StageMemory PersistentStage { get; }
```

Starting and stopping:

```csharp
public void StartVisualNovel(string nodeId = null, Sprite roomBackground = null);
public void StartVisualNovel(DialogueScene overrideProject, string nodeId = null, Sprite roomBackground = null);
public bool RestoreVisualNovel(VisualNovelSaveData data);
public bool RestoreVisualNovel(DialogueScene overrideProject, VisualNovelSaveData data);
public void StartVisualNovelTalkMenu(DialogueScene carrierProject,
                                     IReadOnlyList<ResolvedTalkEntry> entries,
                                     string promptKey = null, string promptSpeakerName = null,
                                     Sprite roomBackground = null, Sprite characterSprite = null);
public void StopVisualNovel();
public void Advance();
public void Back();
public bool Save();
public bool Load();
public void ApplyRoomBackdrop(Sprite roomBackground);
```

`RestoreVisualNovel` returns false when the saved node no longer exists in the story — the slot is from an older
build. Report that; do not treat it as a successful load.

Events, mirrored as UnityEvents in the Inspector (`OnVisualNovelStarted`, `OnVisualNovelEnded`):

```csharp
public event Action Started;
public event Action Ended;
public event Action<string, string> FreeRoamRequested;         // scenarioId, roomId
public event Action FreeRoamReturnRequested;
public event Action<FreeRoamMapGraph, List<string>> ChooseRoomRequested;
public event Action<DialogueScene, string> SwitchProjectRequested;
public event Action<ResolvedTalkEntry> TalkEntryChosen;
public event Action<string, string> TalkMenuRequested;         // characterId, fallbackNodeId
public event Action BackAtStart;
```

`VNGameController` already subscribes to all of these — that is how a Flow block leaves the novel. Subscribe only
if you are replacing the host.

### The shared variable store

`SharedVariableStore` is assigned by `VNGameController` at startup with its own `SharedVariables`. Every session
this controller builds then reads and writes that one store. Leave it alone unless you are running a
`VisualNovelController` outside the normal rig, in which case a null store means each session gets an isolated
one.

### The persistent stage

`PersistentStage` (a `StageMemory`) holds the backdrop, the characters and the props. It lives on the controller,
not on the session, so the stage survives a node switch, a project switch and an excursion into FreeRoam or your
Custom mode: the visuals are cleared while you are away and re-rendered when the VN resumes.
`StartNewGame` on the host calls `PersistentStage.Reset()` for a blank start.

## See also

- [The VN static API](/docs/beasty-visual-novel/scripting/vn-api/)
- [Custom mode](/docs/beasty-visual-novel/scripting/custom-mode/)
- [Gameplay APIs](/docs/beasty-visual-novel/scripting/gameplay-apis/)
- [Saving and loading](/docs/beasty-visual-novel/production/saving-and-loading/)
