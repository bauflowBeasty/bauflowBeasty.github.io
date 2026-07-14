---
title: "What gets saved"
description: "The rules of the system: which of your data ends up in the file, which of it does not, and which mistakes make a save fail outright. Read this page once, earl"
---

The rules of the system: which of your data ends up in the file, which of it does not, and which mistakes
make a save fail outright. Read this page once, early. It is the difference between a save system that
works and an afternoon spent wondering why the player's hat is gone.

## The short version

Beasty Save System saves **fields**, not properties. It saves the same fields Unity itself would serialize:
`public` ones and ones marked `[SerializeField]`. It saves almost every ordinary C# and Unity data type.

It does **not** save references to Unity objects — a `Sprite`, a `GameObject`, an `AudioClip`, another
component. That is on purpose, and this page explains what to do instead.

## What is saved

### Fields

| Rule | |
|---|---|
| `public` fields | Saved |
| `[SerializeField] private` fields | Saved |
| Private fields inherited from a base class | Saved, if they are `[SerializeField]` |
| Plain `private` fields with no attribute | Not saved |
| Properties (anything with `{ get; set; }`) | **Never saved** |

If it appears in Unity's own inspector, it is the kind of thing that gets saved.

> **Warning**
> Properties are not saved. `public int Level { get; set; }` writes nothing to the file and reads nothing
> back. This is the single most common surprise. If a value must persist, make it a field.

### Types

All of these round-trip:

- **Primitives**: `int`, `long`, `float`, `double`, `bool`, `string`, `char`, `byte`, and the rest.
- **Enums**.
- **Nullables**: `int?`, `float?`, and so on.
- **`DateTime`**.
- **Collections**: arrays, `List<T>`, `Dictionary<K,V>`, `HashSet<T>`, `SortedSet<T>`, `Queue<T>`,
  `Stack<T>`.
- **Unity value types**: `Vector2`, `Vector3`, `Vector4`, `Quaternion`, `Color`, `Rect`, `Bounds` and the
  rest of the maths types.
- **Your own classes and structs**, nested as deeply as you like, as long as they follow the rules above.

### Components in the scene

When you save a scene with `BeastySaveManager.SaveAll`, each component you ticked in a `BeastySaveable` is
written by a converter. `Transform`, `Camera`, `Light`, `SpriteRenderer`, `Texture2D` and any
`MonoBehaviour` you wrote are always available. `Animator`, `AudioSource`, `ParticleSystem`, colliders,
`TMP_Text` and the uGUI components come from optional modules.

Each converter stores a specific, documented list of fields — not "everything". Which fields, exactly, is
in [converter-modules.md](/docs/beasty-save-system/reference/converter-modules/). Read it before you rely on one. Some of the
gaps are sharp: `Animator` **triggers are ignored**, `MeshCollider.sharedMesh` is **never saved**, and
`Light.cookie` is written but **never restored**.

## What is NOT saved

### References to Unity objects

A field that points at a `UnityEngine.Object` — a `Sprite`, a `GameObject`, a `Transform`, an
`AudioClip`, a `Material`, another `MonoBehaviour` — is **not** written to the save file. Neither is a
collection of them (`List<GameObject>`, `Sprite[]`).

When saving a `MonoBehaviour`, such fields are skipped. When loading, they are left exactly as they are.

**This is deliberate, and it is mostly good news.** It means:

- Loading a save does not blank out the references you wired in the inspector.
- Your prefab links, your sprite assignments, your material slots — all still there after a load.
- A save file cannot be edited into something that makes your game load an arbitrary asset.

The scene wiring survives a load. That is the property you want.

> **Warning**
> One exception with teeth: a `UnityEngine.Object` field inside a **plain C# class** (not a
> `MonoBehaviour`) does not get skipped — it makes the **save fail** with `SerializationFailed`. If you
> hand `BeastySave.Save` a data class holding a `Sprite`, you get an error result, not a file. Keep Unity
> object references out of your save classes entirely.

### What to do instead

Save something that *identifies* the object, and look the object up again when you load.

Instead of this:

```csharp
[Serializable]
public class PlayerData
{
    public Sprite hat;          // wrong: not saved from a MonoBehaviour,
                                //        and fails the save from a plain class
}
```

Do this:

```csharp
[Serializable]
public class PlayerData
{
    public string hatId = "hat.red";   // an id you control
}
```

and, when you load, turn `hatId` back into a sprite with whatever lookup your game already has — a
`ScriptableObject` catalogue, a `Dictionary<string, Sprite>` on a manager, a `Resources.Load` call. The
id is the save data. The sprite is a runtime detail.

The same pattern applies to a prefab ("which enemy type is this?" → save a type id, spawn from it), to a
target ("who is the player following?" → save an id, resolve it after load) and to anything else you would
have stored as a reference.

### Assets referenced by name, inside the built-in converters

Some of the module converters do store an asset name rather than skipping the reference: `AudioSource.clip`,
`Image.sprite`, and the shared physics materials on the collider converters. On load, they are re-resolved
with `Resources.Load`.

That has a consequence you have to know: **it only works if the asset lives in a `Resources/` folder.** If
it does not resolve, the reference already wired in the scene is left alone — no error, no crash, just the
old value. If you rely on this, put the asset in `Resources/`. If that does not suit your project, save an
id in your own script and resolve it yourself, as above.

## The errors that fail a save

These are not silent skips. Each one makes `BeastySave.Save` return a failed `SaveResult`, and no file is
written.

### A reference cycle

**Symptom.** The save fails with a message about save data having to be acyclic.

**Cause.** Object A holds B, and B holds A. Or a node holds its parent, which holds its children. JSON is a
tree; it has no way to express "this is the same object again".

**Fix.** Break the cycle before you save. The usual answer is to keep the child-to-parent link out of the
save data — store a parent *id* instead of a parent *reference*, and rebuild the links after loading.

### NaN or Infinity

**Symptom.** The save fails, and the offending value is a `float` or `double` in your data.

**Cause.** `NaN` and `Infinity` are not valid JSON numbers. There is no way to write them out.

**Fix.** They almost always mean something already went wrong in your game logic — a divide by zero, a
normalise of a zero vector. Find where the value became `NaN` and fix that. If a value genuinely may be
absent, use a nullable (`float?`) instead of a magic `NaN`.

### A dictionary with a key that is not string-like

**Symptom.** The save fails on a `Dictionary`.

**Cause.** JSON object keys are strings. Beasty Save System accepts keys that map cleanly to a string:
`string`, primitives, and enums. Anything else — a `Vector3` key, a key of your own class — cannot be
written.

**Fix.** Change the key type to a `string`, an `int` or an enum. If your key is genuinely a compound value,
either encode it into a string, or replace the dictionary with a `List` of key/value pairs.

### Nesting deeper than 512 levels

**Symptom.** The save (or a parse of a hand-edited file) fails on depth.

**Cause.** The JSON engine has a 512-level nesting limit. It exists so a malformed or malicious file cannot
blow the stack.

**Fix.** In practice, hitting 512 levels means an accidental recursive structure — very often the same
problem as the reference cycle above. Flatten the data.

### A `ulong` bigger than `long.MaxValue`

**Symptom.** The save fails on a `ulong` field.

**Cause.** JSON numbers are written as signed 64-bit values. A `ulong` above `long.MaxValue`
(9,223,372,036,854,775,807) has no representation.

**Fix.** Use `long`, or store the value as a `string` if you really need the full `ulong` range.

## Checklist for a save class

- Fields, not properties.
- No `UnityEngine.Object` anywhere in it — save ids instead.
- No cycles.
- Dictionary keys are strings, primitives or enums.
- No `NaN` sneaking in from your maths.

If your class passes that list, it round-trips.

## See also

- [converter-modules.md](/docs/beasty-save-system/reference/converter-modules/) — exactly which fields each built-in converter stores
- [custom-converters.md](/docs/beasty-save-system/advanced/custom-converters/) — teaching the system a type it does not know
- [strict-vs-tolerant.md](/docs/beasty-save-system/guides/strict-vs-tolerant/) — what happens when one field cannot be read back
- [results-and-errors.md](/docs/beasty-save-system/reference/results-and-errors/) — every error code
- [scene-state.md](/docs/beasty-save-system/guides/scene-state/) — saving the scene rather than your own class
