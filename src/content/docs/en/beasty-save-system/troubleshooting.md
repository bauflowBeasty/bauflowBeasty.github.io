---
title: "Troubleshooting"
description: "Symptom, cause, fix. Find your symptom, read the two lines under it, follow the link if you need the whole story."
---

Symptom, cause, fix. Find your symptom, read the two lines under it, follow the link if you need the whole
story.

Before anything else: **check the result**. Every call returns a `SaveResult` or a `LoadResult<T>` and
nothing in this API throws at you. If you are not looking at `result.Success` and `result.Error`, the
system has already told you what went wrong and you have not read it.

```csharp
LoadResult<PlayerData> result = BeastySave.Load<PlayerData>("slot1", settings);
if (!result.Success)
    Debug.LogError(result); // "Corrupt: ...", "DecryptFailed: ...", "FileNotFound: ..."
```

The full list of codes is in [Results and errors](/docs/beasty-save-system/reference/results-and-errors/).

---

## My save loaded, but the sprite / prefab / component reference is gone

**Cause.** It was never saved. References to `UnityEngine.Object` — a `Sprite`, a `GameObject`, a
`Material`, another component — are not written to the file, in fields or in collections of them.

**This is by design, and it is usually not the problem you think it is.** Because the reference is not
saved, it is also not overwritten on load: whatever you wired in the scene or in the prefab is still
there, untouched. The reference "being gone" almost always means something else cleared it.

**Fix.** Save an **id**, not a reference. Store the string that identifies the thing, and resolve it
yourself on load:

```csharp
[SerializeField] private string equippedWeaponId;   // saved
private Weapon _equipped;                           // resolved from the id after loading
```

If your reference genuinely needs to come back through the save system, the built-in converters that do
restore assets (`AudioSource.clip`, `Image.sprite`, physics materials) resolve them **by name** through
`Resources.Load`, which only works for assets inside a `Resources/` folder. See
[What gets saved](/docs/beasty-save-system/guides/what-gets-saved/) and [Converter modules](/docs/beasty-save-system/reference/converter-modules/).

> **Note**
> One exception worth knowing: in a plain C# class — not a MonoBehaviour — a field holding a
> `UnityEngine.Object` does not get skipped. It fails the save with `SerializationFailed`.

---

## The object I spawned at runtime does not remember anything

**Cause.** A `BeastySaveable` on a prefab has no id. Every `Instantiate` generates a **fresh** one. The
object is saved under an id that will never exist again, so on load there is nothing to match it to and it
comes back at its prefab defaults.

**Fix.** Register spawned objects with a **stable** id you control:

```csharp
GameObject chest = Instantiate(chestPrefab);
BeastySaveManager.Register(chest, "chest.cave.03", chest.GetComponent<Chest>(), chest.transform);
```

The id must be the same every run for the same logical object. Derive it from the spawn point, the room,
the quest — anything stable. Not from `GetInstanceID()`, not from a counter that depends on spawn order.
See [Scene state](/docs/beasty-save-system/guides/scene-state/).

---

## One of my objects is silently missing from the save

**Cause.** A **duplicate id**. Two `BeastySaveable` components with the same id: the first registers, the
second is **refused** and drops out of the save entirely. It is silent in the game, but it is not silent in
the console.

**Fix.** Read the console. An error is logged at registration naming the id. Then either press **New** on
the `BeastySaveable` inspector to regenerate the id, or open
`Tools > Beasty Save System > Save Manager` and look at the **Saveables in Scene** list, which shows every
saveable in the scene (including inactive ones) with its id.

The usual way this happens: you duplicated a GameObject that already had a `BeastySaveable`, and the copy
carried the id with it. See [Scene state](/docs/beasty-save-system/guides/scene-state/).

---

## SaveAll fails with TypeUnavailable

**Message.** `"...has no registered converter; enable its converter module or register a custom
IBeastyConverter."`

**Cause.** A component ticked in a `BeastySaveable`'s Saved Components list has nobody to convert it. The
core layer covers the math types, `Transform`, `Camera`, `Light`, `SpriteRenderer`, `Texture2D` and any
`MonoBehaviour`. Everything else — `Animator`, `AudioSource`, `ParticleSystem`, colliders, `TMP_Text`,
uGUI components — comes from a converter module.

**Fix.** One of three:

- **Enable the module.** Each module needs its Unity package present in the project (for example the
  Physics2D module needs `com.unity.modules.physics2d`). Install it and the module compiles and registers
  itself. See [Converter modules](/docs/beasty-save-system/reference/converter-modules/).
- **Untick the component.** If you did not need its state saved, take it out of the list.
- **Write a converter.** See [Custom converters](/docs/beasty-save-system/advanced/custom-converters/).

You do not have to wait for the failure. The `BeastySaveable` inspector warns you in the editor: a ticked
component with no converter is flagged, and every other component is labelled with the layer that converts
it (`dev`, a module id, or `core`).

---

## Loading fails with Corrupt

**Cause.** The checksum does not match. The file was hand-edited, truncated by a crash, damaged by the
disk, or copied badly. The envelope is intact enough to read; the payload is not what it says it is.

**Fix.** Offer the player the backup. Every `LoadResult` carries `BackupAvailable`, on success and on
failure:

```csharp
LoadResult<PlayerData> result = BeastySave.Load<PlayerData>("slot1", settings);
if (!result.Success && result.BackupAvailable)
{
    // Ask the player first. Then:
    BeastySave.RestoreBackup("slot1", settings);
    result = BeastySave.Load<PlayerData>("slot1", settings);
}
```

`RestoreBackup` copies the `.bak` over the slot and leaves the `.bak` in place. You can also do it by hand
from `Tools > Beasty Save System > Save Manager`, which has a **Restore Backup** button per slot.

A corrupt file is never rotated into the backup, so the `.bak` is the last copy that verified. See
[Backups and corruption](/docs/beasty-save-system/guides/backups-and-corruption/).

> **Note**
> A `Corrupt` error is also raised earlier in the load, for a file whose envelope shape is wrong — a JSON
> document that parses but is not a Beasty save. Same fix.

---

## Loading fails with DecryptFailed

**Cause.** One of two, and they are different problems:

1. **The `Encrypted` flag does not match the file.** `Encrypted = true` refuses to load a plain-text save,
   and a plain-text setting cannot read an encrypted one. This is the common one: you turned encryption on
   mid-development and your existing saves are plain.
2. **The key is wrong.** The `EncryptionKey` in `BeastySaveSettings` is not the one the file was written
   with. Note that an empty `EncryptionKey` is not "no key" — it means the shared default key.

**Fix.** Make the setting match how the file was written. If you changed the key or the flag between
builds, old saves are unreadable and there is no recovery path — that is what encryption means. Decide
this before you ship, not after. See [Encryption](/docs/beasty-save-system/guides/encryption/).

---

## Loading fails with VersionTooNew

**Cause.** The save was written by a **newer build than the one reading it**. Either its `dataVersion` is
higher than the `DataVersion` in your `BeastySaveSettings`, or its container version is higher than this
release understands.

Migrations only run **forward**. The system can bring an old save up to the current version; it cannot
bring a future one down.

**Fix.** In development, this usually means a teammate's build wrote the file, or you rolled your project
back. Delete the slot, or raise `DataVersion` to match.

In a shipped game, it means a player downgraded — a cloud save from a newer version landing on an older
install. Handle it: check for `BeastySaveError.VersionTooNew` and show "This save was made with a newer
version of the game", not a generic failure. See
[Versioning and migrations](/docs/beasty-save-system/guides/versioning-and-migrations/).

---

## My load silently does nothing

**Cause.** Almost certainly `FileNotFound`, and you did not check the result. A missing slot is logged as
a **warning, not an error** — deliberately, because slot-selection screens probe every slot constantly and
an error per empty slot would drown your console.

**Fix.** Check `result.Success`. Always.

```csharp
LoadResult<PlayerData> result = BeastySave.Load<PlayerData>("slot1", settings);
if (result.Success)
    Apply(result.Value);
else if (result.Error == BeastySaveError.FileNotFound)
    StartNewGame();          // an empty slot is not an error
else
    ShowError(result.Message);
```

`BeastySave.Exists(slot, settings)` answers the question directly if that is all you need. Also check
`BeastySaveManager.LastLoadResult` if you are using the zero-code `LoadAll` path, and subscribe to
`LoadCompleted`. See [Results and errors](/docs/beasty-save-system/reference/results-and-errors/) and
[Slots and metadata](/docs/beasty-save-system/guides/slots-and-metadata/).

---

## It worked in the editor and broke in the build

Two causes, both real.

**Assets referenced by name.** The converters that restore an asset — `AudioSource.clip`, `Image.sprite`,
physics materials — write the asset's **name** and re-resolve it on load with `Resources.Load`. In the
editor the asset happens to be around. In a build, it only resolves if it lives in a **`Resources/`
folder**. If it does not resolve, the reference already wired in the scene is left alone — so the object
loads, and the wrong sprite is on it.

*Fix:* put those assets in a `Resources/` folder, or stop relying on the reference coming back through the
save and resolve it yourself from an id.

**Editor-only properties.** `Light.lightmapBakeType` is an editor-only API. The `Light` converter writes
and reads it **only in the editor**; a build neither stores it nor restores it. A save made in the editor
carries the member, a build ignores it — which is correct, and which is also why a light's bake type does
not survive into the player.

Also: `Light.cookie` is written by name but **never restored**, and `MeshCollider.sharedMesh` is never
serialized at all. See [Converter modules](/docs/beasty-save-system/reference/converter-modules/).

---

## My custom converter stopped working after I pressed Play

**Cause.** Entering Play Mode **resets the statics**. Converters registered with
`BeastySave.RegisterConverter` and migrations registered with `BeastySave.RegisterMigration` are gone on
every Play. If you registered them from a menu item, an editor callback, or a MonoBehaviour's `Awake` that
does not always run, they are not there when the save happens — and your data quietly falls back to the
built-in behaviour.

**Fix.** Register from a `[RuntimeInitializeOnLoadMethod]`:

```csharp
[RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
private static void Register()
{
    BeastySave.RegisterConverter(new FurnaceConverter());
    BeastySave.RegisterMigration(1, 2, MigrateV1ToV2);
}
```

Converters registered with `BeastySave.RegisterModule` survive the reset — that is why the built-in modules
keep working. See [Custom converters](/docs/beasty-save-system/advanced/custom-converters/).

---

## Nothing saves on WebGL

**Cause.** WebGL is **not supported**. The atomic write depends on file-system semantics the browser build
does not have, and the async variants are `Task`-based.

**Fix.** There is none, and there is no setting that changes it. A browser build needs a different
persistence layer. See [Platforms and limits](/docs/beasty-save-system/advanced/platforms-and-limits/).

---

## Other failures worth naming

| Error | What it means |
|---|---|
| `InvalidArgument` | Null data, or an invalid slot name. Slot names that try to escape the folder, and Windows device names, are rejected. |
| `SerializationFailed` | The data could not be turned into JSON: a reference **cycle** ("save data must be acyclic"), a `NaN` or `Infinity` float, a dictionary with non-primitive keys, a `UnityEngine.Object` field on a plain C# class. |
| `IoError` | The folder or the file could not be written or read. Disk full, permissions, a path that does not exist. |
| `ParseError` | The file is not valid JSON at all. |
| `TypeMismatch` | The `type` recorded in the file is not the type you asked to load. |
| `MigrationFailed` | A registered migration threw, or no chain of steps reaches the current `DataVersion`. |
| `FieldMapFailed` | A field could not be mapped. In a strict load this fails the whole load and **nothing is applied**. In a tolerant load it would have been a warning instead. |

See [Results and errors](/docs/beasty-save-system/reference/results-and-errors/) for the complete list of the thirteen codes and
[Strict vs tolerant loading](/docs/beasty-save-system/guides/strict-vs-tolerant/) for the difference the `Strict` setting makes.

## See also

- [What gets saved](/docs/beasty-save-system/guides/what-gets-saved/)
- [Scene state](/docs/beasty-save-system/guides/scene-state/)
- [Backups and corruption](/docs/beasty-save-system/guides/backups-and-corruption/)
- [Encryption](/docs/beasty-save-system/guides/encryption/)
- [Versioning and migrations](/docs/beasty-save-system/guides/versioning-and-migrations/)
- [The Save Manager window](/docs/beasty-save-system/guides/save-manager-window/)
- [FAQ](/docs/beasty-save-system/faq/)
