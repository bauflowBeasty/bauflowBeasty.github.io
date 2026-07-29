---
title: "Scene state"
description: "Saving objects already in your scene with BeastySaveable and BeastySaveManager, and the id rules that decide whether they come back."
---

How to save the objects that are already in your scene: `BeastySaveable` marks an object as worth saving,
`BeastySaveManager` writes them all to one file. This page covers both, and the four behaviours around ids
that decide whether your objects come back or not.

If you have not built the basic setup yet, [save-without-code.md](/docs/beasty-save-system/getting-started/save-without-code/)
walks through it click by click. This page explains what that setup actually does.

## The two components

**`BeastySaveable`** goes on any object whose state you want to keep. It has an **id** and a list of
**components** to capture. One per GameObject — the component disallows duplicates.

**`BeastySaveManager`** goes on one object in the scene. It holds the `BeastySaveSettings` used by the
scene save, and it is the thing you call `SaveAll` and `LoadAll` on. It keeps a static `Instance`.

Every enabled `BeastySaveable` registers itself with the manager. `SaveAll` walks that registry, asks each
saveable's ticked components for their state, and writes the lot into one file, keyed by id.

## Ids

The id is how a save file recognises an object across sessions. Everything about scene saving comes down to
whether the id is the same the next time the game runs.

![The Save Id field with its New button](/docs-images/beasty-save-system/save-saveable-id.png)

### It is auto-generated, and it is editable

Add a `BeastySaveable` and it gets an id automatically. The inspector shows it as **Save Id**, with a
**New** button next to it that generates a fresh one.

You may edit the id by hand, and there are good reasons to — `player`, `door.cellar`, `chest.tutorial` are
easier to find in a save file than a random string.

> **Warning**
> **Changing an id orphans the data already saved under the old one.** The state is still in the file, under
> a key nothing in the scene claims any more, and the object with the new id will not find it. Decide on
> your ids before you have saves you care about. The **New** button has exactly the same effect: it throws
> away the object's connection to every existing save.

### A prefab asset carries no id

The prefab asset itself has no id. Each **instance** gets its own, generated when it is created. Two copies
of the same prefab in a scene are two different saveables with two different ids, which is what you want —
they are two different chests.

### An object spawned at runtime gets a fresh id every time

This is the one that catches people.

An object you `Instantiate` while the game is running gets a **brand new id, every single time**. Play the
game, spawn an enemy, save: the enemy's state goes into the file under an id generated in that session.
Restart, spawn an enemy, load: the new enemy has a different id, finds nothing in the file, and keeps its
default state. The old state sits in the file, unreachable, forever.

The fix is to give the spawned object an id you control, at spawn time:

```csharp
using Beasty_SaveSystem;
using UnityEngine;

public class EnemySpawner : MonoBehaviour
{
    public GameObject enemyPrefab;

    public GameObject Spawn(string enemyId, Vector3 position)
    {
        GameObject enemy = Instantiate(enemyPrefab, position, Quaternion.identity);

        // A stable id, and the components to capture.
        BeastySaveManager.Register(enemy, $"enemy.{enemyId}", enemy.transform);

        return enemy;
    }
}
```

`Register` adds the `BeastySaveable` for you, sets the id, and assigns the component list — so the object is
saveable from that moment on. There are two overloads:

```csharp
static BeastySaveable Register(GameObject target, params Component[] components);
static BeastySaveable Register(GameObject target, string id, params Component[] components);
```

The one without an id keeps the id the object already has — and if the object has no `BeastySaveable`
yet, one is added with a fresh generated id. A fresh id cannot match anything in an older save, which is
fine for scene objects and useless for spawned copies. **For anything you spawned, use the overload that
takes an id.**

The id has to be something you can reproduce on the next run. `enemy.goblin.3` derived from your own game
data is stable. `enemy.` plus `Guid.NewGuid()` is not — that is the same problem again, in your own code.

The counterparts, when an object goes away for good:

```csharp
BeastySaveManager.Unregister(gameObject);   // this one is gone
BeastySaveManager.UnregisterAll();          // clear the registry
BeastySaveManager.SyncSceneSaveables();     // re-scan the scene for saveables
```

### Two objects with the same id: the second one disappears

If two saveables end up with the same id, **the second one is not registered**. An error is logged, and
that object silently falls out of the save — it is not written, and it is not restored.

Duplicate ids happen when you copy-paste a GameObject that already has a hand-typed id, or when you spawn
two objects and pass the same id to `Register`. If an object mysteriously refuses to persist, check the
console for the duplicate-id error, then check its id in the inspector.

## Inactive objects are saved

A `BeastySaveable` registers on `OnEnable` and unregisters on `OnDestroy` — **not** on `OnDisable`.

So an object you deactivate with `SetActive(false)` is still in the registry, still written to the save,
and still restored on load. That is the behaviour you want: a disabled enemy or a closed UI panel keeps its
state instead of losing it the moment it goes away.

Destroying the object is what removes it from the save.

## Several components of the same type

Two `BoxCollider` components on one GameObject both round-trip. They are stored separately in the file (the
second one gets a `#1` suffix on its key) and restored to the right slots. You do not have to do anything
for this to work.

![A Saved Components checklist with two components of the same type ticked](/docs-images/beasty-save-system/save-saveable-multiple-components.png)

## Saving and loading

### From a button, with no code

`SaveAll(string)` and `LoadAll(string)` are `void` methods that take a single string, which makes them
wireable straight to a uGUI Button's **On Click ()** with the slot name typed into the inspector. This is
the zero-code path, and it is covered step by step in
[save-without-code.md](/docs/beasty-save-system/getting-started/save-without-code/).

### From code

```csharp
BeastySaveManager manager = BeastySaveManager.Instance;

SaveResult saved = manager.SaveAllNow("slot1");
if (!saved.Success)
    Debug.LogError($"Save failed: {saved}");

LoadResult loaded = manager.LoadAllNow("slot1");
if (!loaded.Success)
    Debug.LogError($"Load failed: {loaded}");
```

`SaveAllNow` and `LoadAllNow` are the ones that **return a result**. Use them whenever you want to know
whether it worked — which is always, in shipped code. `SaveAllNow` also takes an optional metadata
dictionary:

```csharp
manager.SaveAllNow("slot1", new Dictionary<string, string>
{
    ["chapter"] = "3",
    ["playtime"] = "01:22",
});
```

`SaveAll` and `LoadAll` do the same work but return nothing, because a `UnityEvent` cannot use a return
value. They store the outcome instead:

```csharp
manager.SaveAll("slot1");
SaveResult result = manager.LastSaveResult;   // and manager.LastLoadResult after a load
```

`manager.DeleteSlot("slot1")` removes a slot and its backup.

### The events

```csharp
void OnEnable()
{
    BeastySaveManager.Instance.SaveCompleted += OnSaved;
    BeastySaveManager.Instance.LoadCompleted += OnLoaded;
}

void OnDisable()
{
    if (BeastySaveManager.Instance == null) return;
    BeastySaveManager.Instance.SaveCompleted -= OnSaved;
    BeastySaveManager.Instance.LoadCompleted -= OnLoaded;
}

void OnSaved(SaveResult result)
{
    if (result.Success) ShowToast("Game saved");
    else ShowError(result.Message);
}

void OnLoaded(LoadResult result)
{
    if (result.Success) return;
    if (result.BackupAvailable) OfferBackupRestore();
    else ShowError(result.Message);
}
```

`SaveCompleted` and `LoadCompleted` fire for every save and load, from the buttons as well as from code.
They are the right place to put the "Game saved" toast, and the right place to offer the backup when a load
fails. `LoadResult.BackupAvailable` is filled in on every load result, success or failure — see
[backups-and-corruption.md](/docs/beasty-save-system/guides/backups-and-corruption/).

## What actually ends up in the file

A scene save has the type `Beasty.SaveGroup` and looks like this:

```json
{
  "saveables": {
    "player": {
      "UnityEngine.Transform": { "module": "core", "data": { } }
    },
    "door.cellar": {
      "UnityEngine.BoxCollider":   { "module": "physics3d", "data": { } },
      "UnityEngine.BoxCollider#1": { "module": "physics3d", "data": { } }
    }
  }
}
```

One entry per saveable id, one entry per saved component inside it, and the module that wrote each. The
`#1` suffix is the second component of the same type on that object.

A saveable that is in the scene but has **no data in the file** — a new object added after the save was
written — is left untouched, with a warning. It is not an error, and it does not fail the load.

## Ticking a component you cannot save

The **Saved Components** checklist labels each component with the layer that can convert it: `core`, a
module id like `ugui`, or `dev` for a converter you registered yourself.

If you tick a component nothing knows how to convert, the inspector warns you, and a save will fail with
`TypeUnavailable`. Either untick it, enable the module it needs
([converter-modules.md](/docs/beasty-save-system/reference/converter-modules/)), or write a converter for it
([custom-converters.md](/docs/beasty-save-system/advanced/custom-converters/)).

## See also

- [save-without-code.md](/docs/beasty-save-system/getting-started/save-without-code/) — the click-by-click setup
- [save-manager-window.md](/docs/beasty-save-system/guides/save-manager-window/) — the editor window
- [components.md](/docs/beasty-save-system/reference/components/) — `BeastySaveable` and `BeastySaveManager`, field by field
- [what-gets-saved.md](/docs/beasty-save-system/guides/what-gets-saved/) — which fields and types round-trip
- [converter-modules.md](/docs/beasty-save-system/reference/converter-modules/) — what each converter stores
- [strict-vs-tolerant.md](/docs/beasty-save-system/guides/strict-vs-tolerant/) — what a scene load does when one component fails
