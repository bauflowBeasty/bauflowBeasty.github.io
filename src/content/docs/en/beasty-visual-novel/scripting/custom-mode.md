---
title: "Custom mode"
description: "VNAppState.Custom hands the screen to your own mode. How to enter it, leave it, and make your minigame save, load and rewind with the rest of the game."
---

`VNAppState.Custom` is the open door. It has no built-in UI: the engine switches to it, hands you the screen, and
stops. Put your minigame, battle system, farming loop or world map in it, and it takes part in everything else the
engine does — the shared variable store, the save, the cross-mode rollback, the clock, the quests, the inventory.

## Entering and leaving

```csharp
VNGameController.Instance.EnterCustom();
```

`EnterCustom` records the mode it is leaving as a rollback boundary, stops any running story, and sets
`State` to `Custom`. It does not create anything. Show your own UI from a `StateChanged` handler:

```csharp
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class MinigameRoot : MonoBehaviour
{
    [SerializeField] private GameObject ui;

    private void OnEnable()
    {
        var game = VNGameController.Instance;
        game.StateChanged += HandleStateChanged;
        HandleStateChanged(game.State);
    }

    private void OnDisable()
    {
        if (VNGameController.Instance != null)
            VNGameController.Instance.StateChanged -= HandleStateChanged;
    }

    private void HandleStateChanged(VNAppState state) => ui.SetActive(state == VNAppState.Custom);
}
```

To leave, call whichever transition matches where the player should go:

| Leave to | Call |
|---|---|
| The room the player came from | `VNGameController.Instance.RollbackFromCustom()` |
| A specific room | `EnterFreeRoam(new FreeRoamSaveState { scenarioId = ..., roomId = ... })` |
| A story | `EnterVisualNovel(project, nodeId)` |
| The main menu | `GoToMainMenu()` |

`RollbackFromCustom` steps back across the most recent boundary — the room, the story, or an earlier Custom
state — and returns false when there is nothing to step back into. Wire it to your Back input and fall back to
`GoToMainMenu()` when it returns false.

## Saving your mode

The engine cannot know what your mode's state is, so it asks you for it, as a string, and stores it verbatim.
Both hooks are fields on `VNGameController`:

```csharp
public Func<string> CaptureCustomStateJson;   // you fill this
public Action<string> RestoreCustomStateJson; // you fill this
```

Assign both once, early. On save, if the app is in `Custom` state, the controller calls `CaptureCustomStateJson`
and writes the result into `VisualNovelSaveData.customStateJson`. On load, it enters `Custom` and hands the string
back to `RestoreCustomStateJson`. The engine never inspects the blob. JSON is the obvious format —
`JsonUtility.ToJson` is enough — but any string works.

The same two hooks power cross-mode rollback: `PushCustomRollback()` captures the current custom state as a back
step. Call it right BEFORE you change something the player should be able to undo, or before you switch modes.
It does nothing if `CaptureCustomStateJson` is not wired.

> **Note**
> Do not put your score in `customStateJson` if it belongs in the world. A number the story reads in a condition,
> a quest checks, or a HUD shows should be a VN variable — `VN.SetInt`, or the shared store — because those are
> already saved, already rewound and already usable from any condition. Keep `customStateJson` for state that is
> genuinely internal to your mode: a board layout, a card hand, a wave counter.

## The FreeRoam hooks

Same pattern — these are fields on `VNGameController` too — but the engine ships an implementation, so you
only touch these if you are replacing FreeRoam:

```csharp
public Func<FreeRoamSaveState> CaptureFreeRoamState;
public Action<FreeRoamSaveState> RestoreFreeRoamState;
public Func<string, Sprite> ResolveRoomBackground;
public Action<FreeRoamMapGraph, List<string>, Action<string>> RoomSelectionRequested;
```

`ResolveRoomBackground` maps a room id to the sprite that room currently shows, conditions resolved. The engine
calls it after a load to repaint the room behind a dialogue that has no Backdrop block of its own. If your mode
owns rooms, wire it or that background comes back empty.

`RoomSelectionRequested` is the hook a room-picker UI registers so a **Choose room** block has somewhere to ask.
With none registered the engine picks a default room and logs a notice.

## The save hooks

```csharp
public static class VNSaveHooks
{
    public static event Action<VisualNovelSaveData> OnCaptureSave;
    public static event Action<VisualNovelSaveData> OnRestoreSave;
    public static event Action<VisualNovelSaveData> OnSceneRestoreFailed;
}
```

- `OnCaptureSave` fires after the engine has filled the snapshot and before it is written. Last chance to append
  to it.
- `OnRestoreSave` fires after a loaded snapshot has been applied to the world.
- `OnSceneRestoreFailed` fires when the scene-object state of a load could not be applied: the story is at the
  saved line, but the world around it is not the one that was saved. Hook it and tell the player. Leaving them in
  a half-restored world that merely looks subtly wrong is worse than saying so.

All three reset their subscribers at `SubsystemRegistration`, so Fast Enter Play Mode does not leak them.

## Persisting your own MonoBehaviour

You do not need the Custom state for this. Put a `BeastySaveable` component on any GameObject in the scene, tick
the components you want stored, and its state rides inside every VN save and every rollback boundary — the engine
captures the scene group as part of `CaptureCurrent()` and applies it a frame after the restored mode has rebuilt
its world.

A capture failure fails the WHOLE save, on purpose: better no save than one silently missing state the player
expects back.

Read [Scene state](/docs/beasty-save-system/guides/scene-state/) before you rely on it — in particular, the save
system does not store references to Unity objects (sprites, prefabs, other components). If your minigame's state
is "which prefab is in slot 3", store the id, not the prefab.

## Worked example: a scored minigame that returns to the room

A complete Custom mode. It keeps a score, saves it, restores it, and goes back where the player came from.

```csharp
using System;
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class ScoreMinigame : MonoBehaviour
{
    [Serializable]
    private struct State
    {
        public int score;
        public int round;
    }

    [SerializeField] private GameObject ui;

    private int _score;
    private int _round;

    private void OnEnable()
    {
        var game = VNGameController.Instance;
        if (game == null) return;

        game.CaptureCustomStateJson = Capture;
        game.RestoreCustomStateJson = Restore;
        game.StateChanged += HandleStateChanged;
        HandleStateChanged(game.State);
    }

    private void OnDisable()
    {
        var game = VNGameController.Instance;
        if (game == null) return;

        game.StateChanged -= HandleStateChanged;
        if (game.CaptureCustomStateJson == (Func<string>)Capture) game.CaptureCustomStateJson = null;
        if (game.RestoreCustomStateJson == (Action<string>)Restore) game.RestoreCustomStateJson = null;
    }

    private void HandleStateChanged(VNAppState state) => ui.SetActive(state == VNAppState.Custom);

    // ─── Entry ───────────────────────────────────────────────────────────────
    /// Call this from a FreeRoam object's Custom action, or from anywhere.
    public void Play()
    {
        _score = 0;
        _round = 0;
        VNGameController.Instance.EnterCustom();   // records the room/story we are leaving
    }

    // ─── Play ────────────────────────────────────────────────────────────────
    public void ScorePoint()
    {
        VNGameController.Instance.PushCustomRollback();   // Back undoes this round
        _score++;
        _round++;
    }

    // ─── Exit ────────────────────────────────────────────────────────────────
    public void Finish()
    {
        var game = VNGameController.Instance;

        // The result belongs to the world, so it is a VN variable, not part of the blob:
        // conditions, quests and the HUD can all see it, and it saves and rewinds for free.
        game.SharedVariables.Set("minigame_best",
            Mathf.Max(game.SharedVariables.GetInt("minigame_best"), _score).ToString());

        BeastyTime.AdvanceDayparts(1);   // playing took an afternoon

        // Back to where the player came from; the main menu if there is nowhere to go back to.
        if (!game.RollbackFromCustom()) game.GoToMainMenu();
    }

    // ─── Persistence ─────────────────────────────────────────────────────────
    private string Capture() => JsonUtility.ToJson(new State { score = _score, round = _round });

    private void Restore(string json)
    {
        if (string.IsNullOrEmpty(json)) { _score = 0; _round = 0; return; }
        var state = JsonUtility.FromJson<State>(json);
        _score = state.score;
        _round = state.round;
    }
}
```

Save while this mode is running and the slot records `appState = Custom`, your blob, the shared store, the clock,
the quests, the inventory and the rollback queue. Load it and you are back in the minigame, at the same score,
with `Back` still able to step out into the room you started from.

## See also

- [Controllers](/docs/beasty-visual-novel/scripting/controllers/)
- [The VN static API](/docs/beasty-visual-novel/scripting/vn-api/)
- [Gameplay APIs](/docs/beasty-visual-novel/scripting/gameplay-apis/)
- [Saving and loading](/docs/beasty-visual-novel/production/saving-and-loading/)
- [Scene state (Beasty Save System)](/docs/beasty-save-system/guides/scene-state/)
- [What gets saved (Beasty Save System)](/docs/beasty-save-system/guides/what-gets-saved/)
