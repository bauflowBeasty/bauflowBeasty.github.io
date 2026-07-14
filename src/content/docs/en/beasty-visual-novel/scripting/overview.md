---
title: "Scripting overview"
description: "How Beasty Visual Novel is put together, and where your own C# hooks in. Read this before you write against the API, then go to the page that covers your job."
---

How Beasty Visual Novel is put together, and where your own C# hooks in. Read this before you write against
the API, then go to the page that covers your job.

Full C# source ships with the package. Nothing here is a black box.

## Assemblies

| Assembly | Folder | What is in it |
|---|---|---|
| `Beasty.VN.Core` | `Core/` | The data model and the pure logic: nodes, blocks, the variable store, conditions, the story director, time, routines, quests. No Unity UI. |
| `Beasty.VN.Runtime` | `Runtime/` | The view layer and the controllers: `BeastyManager`, `VNGameController`, `VisualNovelController`, `StageController`, the uGUI views, input, saving, streaming. |
| `Beasty.VN.Editor` | `Editor/` | Every authoring tool. Never referenced by a build. |

`Runtime` references `Core`; `Core` does not reference `Runtime`. That split is the point: the story engine
does not know your dialogue box exists. You can replace the whole presentation layer — write your own view
components, drive them from the `VN` API — without touching the engine that runs the story.

Namespaces mirror the assemblies: `Beasty.VN.Core` and `Beasty.VN.Runtime`. Two optional assemblies compile
only when their dependency is present: `Beasty.VN.Runtime.InputSystem` (the new Input System) and
`Beasty.VN.Addressables` (streaming).

## The runtime objects

**`BeastyManager`** is the single component you drop in the scene. It owns every other manager as a hidden
sub-component on its own GameObject, guarantees exactly one of each exists, and exposes them through typed
properties (`Game`, `VN`, `Stage`, `FreeRoam`, `Audio`, `Menus`, ...). It also runs the boot sequence behind a
loading screen. Get it with `BeastyManager.Instance`.

**`VNGameController`** owns the app state machine and the one shared `VariableStore` that every mode reads and
writes. Progress is global because this store is global: it survives a project switch, is visible from FreeRoam,
and is what a save file records. Get it with `VNGameController.Instance` or `BeastyManager.Instance.Game`.

**`VisualNovelController`** hosts one running story. It builds the runtime context, the story director and the
save adapter, wraps them in a `VNSession`, and publishes that session through the static `VN` API. Get it with
`VisualNovelController.Instance` or `BeastyManager.Instance.VN`.

**`StageController`** paints the stage: the backdrop, the characters, the props. It is driven by the director, not
by you. The persistent stage memory lives on `VisualNovelController.PersistentStage`, so the scene survives a
node switch, a project switch, and an excursion into FreeRoam.

## The four app states

`VNAppState` (in `Beasty.VN.Runtime`) has four values, and `VNGameController.State` is always one of them:

| State | What is running |
|---|---|
| `MainMenu` | No story, no room. The menus own the screen. |
| `VisualNovel` | A `VisualNovelController` session is playing a `DialogueScene`. |
| `FreeRoam` | The player is in a room on a `FreeRoamMapGraph`. |
| `Custom` | Your code. The engine has no UI for this state — that is the whole point. |

`VNGameController.StateChanged` fires on every transition. The save records which state was active, so a load
restores the right subsystem. See [Controllers](/docs/beasty-visual-novel/scripting/controllers/) for the methods that move between them, and
[Custom mode](/docs/beasty-visual-novel/scripting/custom-mode/) for the fourth one.

## I want to X -> use Y

| I want to | Use | Page |
|---|---|---|
| Read a variable | `VN.GetInt` / `GetBool` / `GetFloat` / `GetString` | [VN API](/docs/beasty-visual-novel/scripting/vn-api/) |
| Write a variable | `VN.SetInt` / `SetBool` / `SetFloat` / `SetString` | [VN API](/docs/beasty-visual-novel/scripting/vn-api/) |
| Read or write a variable without magic strings | `VNVars.Money`, `VNChars.Maya.Affection` | [Generated accessors](/docs/beasty-visual-novel/scripting/generated-accessors/) |
| Read a variable outside a running story | `VNGameController.Instance.SharedVariables` | [Controllers](/docs/beasty-visual-novel/scripting/controllers/) |
| React when a line is shown | `VN.OnLineShown` | [VN API](/docs/beasty-visual-novel/scripting/vn-api/) |
| React when choices appear or one is taken | `VN.OnChoicePresented`, `VN.OnChoiceChosen` | [VN API](/docs/beasty-visual-novel/scripting/vn-api/) |
| React when a variable changes | `VN.OnVariableChanged`, or `VariableStore.Changed` on the shared store | [VN API](/docs/beasty-visual-novel/scripting/vn-api/) |
| Start a story from code | `VNGameController.EnterVisualNovel(project, nodeId)` | [Controllers](/docs/beasty-visual-novel/scripting/controllers/) |
| Play a story and come back to the room | `VNGameController.PlayVisualNovelThenReturn(...)` | [Controllers](/docs/beasty-visual-novel/scripting/controllers/) |
| Advance, rewind, or pick a choice from code | `VN.Advance()`, `VN.Back()`, `VN.Choose(i)` | [VN API](/docs/beasty-visual-novel/scripting/vn-api/) |
| Save or load a slot | `VNGameController.SaveToSlot` / `LoadSlotDetailed` | [Controllers](/docs/beasty-visual-novel/scripting/controllers/), [Saving and loading](/docs/beasty-visual-novel/production/saving-and-loading/) |
| Read or advance the clock | `BeastyTime` | [Gameplay APIs](/docs/beasty-visual-novel/scripting/gameplay-apis/) |
| Ask where a character is | `BeastyRoutines` | [Gameplay APIs](/docs/beasty-visual-novel/scripting/gameplay-apis/) |
| Start a quest or complete an objective | `BeastyQuests` | [Gameplay APIs](/docs/beasty-visual-novel/scripting/gameplay-apis/) |
| Give, take or count items | `Inventory` | [Gameplay APIs](/docs/beasty-visual-novel/scripting/gameplay-apis/) |
| Add my own game mode | `VNGameController.EnterCustom()` | [Custom mode](/docs/beasty-visual-novel/scripting/custom-mode/) |
| Persist my own data inside a save | `CaptureCustomStateJson` / `RestoreCustomStateJson`, or a `BeastySaveable` component | [Custom mode](/docs/beasty-visual-novel/scripting/custom-mode/), [Scene state](/docs/beasty-save-system/guides/scene-state/) |
| Save a field type the engine does not know | Write an `IBeastyConverter` | [Custom converters](/docs/beasty-save-system/advanced/custom-converters/) |
| Delay startup until my own system is up | `BeastyManager.RegisterBootBarrier` | [Controllers](/docs/beasty-visual-novel/scripting/controllers/) |

## See also

- [The VN static API](/docs/beasty-visual-novel/scripting/vn-api/)
- [Controllers](/docs/beasty-visual-novel/scripting/controllers/)
- [Gameplay APIs](/docs/beasty-visual-novel/scripting/gameplay-apis/)
- [Custom mode](/docs/beasty-visual-novel/scripting/custom-mode/)
- [Generated accessors](/docs/beasty-visual-novel/scripting/generated-accessors/)
- [Core concepts](/docs/beasty-visual-novel/getting-started/core-concepts/)
