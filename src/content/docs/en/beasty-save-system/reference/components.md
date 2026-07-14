---
title: "Components"
description: "The two MonoBehaviours of the save system. BeastySaveable marks a GameObject as part of a scene save; BeastySaveManager holds the settings and does the saving"
---

The two MonoBehaviours of the save system. `BeastySaveable` marks a GameObject as part of a scene save;
`BeastySaveManager` holds the settings and does the saving. Both live in the `Beasty_SaveSystem` namespace.

## BeastySaveable

Add Component: `Beasty > Beasty Saveable`. Marked `[DisallowMultipleComponent]`.

Marks a GameObject as part of scene saves: a stable id, plus the list of components whose state
`SaveAll` captures and `LoadAll` restores.

### Inspector fields

| Field | Type | Meaning |
|---|---|---|
| Save Id (`id`) | `string` | Stable identifier keying this object inside save files. Auto-generated; editable — changing it orphans data saved under the old id. |
| Saved Components (`components`) | `List<Component>` | Components on this GameObject captured by SaveAll and restored by LoadAll. |

The custom inspector shows the Save Id with a **New** button that regenerates it, and the components as a
checklist of every component on the GameObject, each labelled with the layer that converts it (`dev`, a
module id, or `core`). Ticking a component with no converter shows a warning: SaveAll will fail with
`TypeUnavailable`.

`Reset` (the component's default state, on Add Component) ticks the `Transform`.

### Public members

```csharp
public string Id { get; }
```

The current id.

```csharp
public IReadOnlyList<Component> SavedComponents { get; }
```

The selected components, with destroyed and missing entries filtered out.

```csharp
public void EnsureId()
```

Generates a GUID id when the id is empty. An existing id is never overwritten.

```csharp
public void SetId(string value)
```

Pins the id. Throws `ArgumentException` when `value` is empty. This is how a runtime-spawned object is
matched to its data across sessions: give it the same id you gave it last time.

### Lifecycle

- **Registers on `OnEnable`. Unregisters on `OnDestroy`** — not on `OnDisable`. A deactivated object (a
  boss that has not spawned yet, a door that only exists at night) is still saved and still restored.
- A prefab **asset** carries no id: it is cleared in the editor, because every instance would otherwise
  inherit the same one and all but the first would collide. Each scene instance stamps its own.
- An object you `Instantiate` at runtime gets a **fresh id every time**, so its state cannot be found again
  in an older save. Use `BeastySaveManager.Register(go, "a.stable.id", components)` for spawned objects.
- Two saveables with the same id: the second one is **not registered** and an error is logged. It falls out
  of the save.

## BeastySaveManager

Add Component: `Beasty > Beasty Save Manager`. Marked `[DisallowMultipleComponent]`.

The scene-level entry point of the no-code flow. It holds the settings, tracks every registered
`BeastySaveable`, and writes one group document per save.

### Inspector field

| Field | Type | Meaning |
|---|---|---|
| Settings (`settings`) | `BeastySaveSettings` | Location, encryption, backup, strict loading and data version used by SaveAll/LoadAll. |

Every field of `BeastySaveSettings` is documented in [Settings](/docs/beasty-save-system/guides/settings/).

### Instance and state

```csharp
public static BeastySaveManager Instance { get; }
public BeastySaveSettings Settings { get; }
public SaveResult LastSaveResult { get; }
public LoadResult LastLoadResult { get; }
```

`Instance` is set in `OnEnable` and cleared in `OnDisable`. A second manager in the scene logs a warning
and does not take over. `LastSaveResult` and `LastLoadResult` hold the outcome of the most recent
`SaveAll`/`LoadAll`, for UI that polls instead of subscribing.

```csharp
public event Action<SaveResult> SaveCompleted;
public event Action<LoadResult> LoadCompleted;
```

Raised after every `SaveAll` and `LoadAll` with the typed outcome.

### Saving and loading

```csharp
public void SaveAll(string slot)
public void LoadAll(string slot)
```

**UnityEvent-friendly.** They take a single string and return void, so you can wire them straight to a uGUI
Button's OnClick with the slot name typed into the inspector, and never write a line of C#. The outcome
arrives through `SaveCompleted`/`LoadCompleted`, `LastSaveResult`/`LastLoadResult`, and the log. See
[Save without code](/docs/beasty-save-system/getting-started/save-without-code/).

```csharp
public SaveResult SaveAllNow(string slot, IDictionary<string, string> meta = null)
public LoadResult LoadAllNow(string slot)
```

The same operations, returning the typed result directly. `meta` is the plain-text dictionary a slot screen
reads back with `BeastySave.ReadMeta`.

```csharp
public void DeleteSlot(string slot)
```

Deletes the slot file and its backup. Also UnityEvent-friendly.

### The saveable registry

```csharp
public static BeastySaveable Register(GameObject target, params Component[] components)
public static BeastySaveable Register(GameObject target, string id, params Component[] components)
```

Adds (or reuses) a `BeastySaveable` on `target`, sets its component selection, and registers it. Passing no
components keeps the current selection. Both throw `ArgumentNullException` when `target` is null; the
second throws `ArgumentException` when `id` is empty.

Use the **id overload for anything you spawn at runtime**. Without a pinned id the object gets a fresh GUID
on every `Instantiate` and its saved state can never be found again. Give it an id that is stable across
sessions: its spawn point, its map cell, its quest key.

```csharp
public static void SyncSceneSaveables()
```

Registers every `BeastySaveable` in the loaded scenes, **including those on inactive GameObjects**. Called
automatically before every capture and every apply. Saveables register from `OnEnable`, which an object
that starts disabled never runs — without this they would be silently missing from the save.

```csharp
public static void Unregister(GameObject target)
public static void UnregisterAll()
```

`Unregister` drops one object. `UnregisterAll` empties the registry — for when you want a clean slate up
front (swapping the whole world, a test fixture).

### Embedding a scene save in your own file

```csharp
public static SaveResult CaptureGroupNode(out JsonNode node)
public static LoadResult ApplyGroupNode(JsonNode node, bool strict)
```

`CaptureGroupNode` builds the group document — exactly what `SaveAll` writes — as an in-memory `JsonNode`,
so a host system can nest the whole scene state inside its own save file. It returns `Ok` with a null node
when nothing is registered, or a typed failure naming the culprit component.

`ApplyGroupNode` applies such a node back onto the registered saveables. A null or JSON-null node is a
no-op success. Errors: `Corrupt` (the document shape is wrong), `TypeUnavailable`, `FieldMapFailed`.

## See also

- [Scene state](/docs/beasty-save-system/guides/scene-state/)
- [Save file format](/docs/beasty-save-system/reference/save-file-format/)
- [Converter modules](/docs/beasty-save-system/reference/converter-modules/)
- [The Save Manager window](/docs/beasty-save-system/guides/save-manager-window/)
