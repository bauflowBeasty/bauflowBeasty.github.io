---
title: "Results and errors"
description: "SaveResult, LoadResult and the seventeen BeastySaveError codes: what causes each one and what your game should do about it."
---

Every save and load call returns a typed result carrying a `BeastySaveError`. This page lists the result
members and all seventeen error values, with what causes each one and what your game should do about it.

## The design principle

**The API never throws at you.** A save that failed says so, and never looks like a save that worked. There
is no exception to catch, no partially written file to detect, no silent success. Check `Success`, and if
it is false, read `Error`.

The only methods that throw are the registration ones (`RegisterMigration`, `RegisterConverter`,
`RegisterModule`): a bad registration is a mistake in your code at startup, not a fact about a file, and it
should stop you immediately.

## SaveResult

Returned by `Save`, `SaveAsync`, `RestoreBackup`, `RestoreBackupAsync`, `BeastySaveManager.SaveAllNow`,
`BeastySaveManager.SaveAllNowAsync` and `BeastySaveManager.CaptureGroupNode`.

| Member | Type | Meaning |
|---|---|---|
| `Success` | `bool` | True when the file is on disk. |
| `Error` | `BeastySaveError` | `None` on success. |
| `Message` | `string` | Human-readable detail. Null on success. |
| `BytesWritten` | `int` | Size of the file this call wrote. 0 when unknown: any failure, and successes that write no file (`CaptureGroupNode`, `RestoreBackup`). |
| `SaveResult.Ok(bytesWritten = 0)` | `static SaveResult` | Builds a success result. |
| `SaveResult.Fail(error, message)` | `static SaveResult` | Builds a failure result. |
| `ToString()` | `string` | `"OK"`, or `"{Error}: {Message}"`. |

## SaveResult&lt;T&gt;

Returned by `SaveToJson` and `ToJson` — the JSON-without-files calls, where the "file" is a string the
call hands back to you. Derives from `SaveResult` and adds the value.

| Member | Type | Meaning |
|---|---|---|
| `Value` | `T` | The produced value — for the JSON calls, the envelope or payload text. Undefined when `Success` is false — do not read it. |
| `SaveResult<T>.Ok(value, bytesWritten = 0)` | `static SaveResult<T>` | Builds a success result. |
| `SaveResult<T>.Fail(error, message)` | `static SaveResult<T>` | Builds a failure result. |

For the JSON calls, `BytesWritten` is the UTF-8 byte count of the produced text — the size the string
would occupy on disk, even though nothing was written.

## LoadResult

Returned by `LoadInto`, `LoadIntoAsync`, `BeastySaveManager.LoadAllNow`,
`BeastySaveManager.LoadAllNowAsync` and `BeastySaveManager.ApplyGroupNode`.

| Member | Type | Meaning |
|---|---|---|
| `Success` | `bool` | True when the data was applied. |
| `Error` | `BeastySaveError` | `None` on success. |
| `Message` | `string` | Human-readable detail. Null on success. |
| `BackupAvailable` | `bool` | A `.bak` exists for this slot. Filled in on every load result, success or failure. |
| `MigratedFrom` | `int` | The data version this file was migrated **from**, or 0 when no migration ran. See [versioning-and-migrations.md](/docs/beasty-save-system/guides/versioning-and-migrations/). |
| `Warnings` | `IReadOnlyList<string>` | Fields and entries skipped by a tolerant load. Never null; empty when there is nothing to report. |
| `LoadResult.Ok(warnings = null)` | `static LoadResult` | Builds a success result. |
| `LoadResult.Fail(error, message, backupAvailable = false)` | `static LoadResult` | Builds a failure result. |
| `ToString()` | `string` | `"OK"`, or `"{Error}: {Message}"`. |

`BackupAvailable` is the flag to branch on after a `Corrupt` or `ParseError`: it tells you whether offering
the player a "restore the previous save" button will do anything.

## LoadResult&lt;T&gt;

Returned by `Load<T>`, `LoadAsync<T>`, `ReadMeta`, `ReadMetaAsync`, `LoadFromJson<T>` and `FromJson<T>`.
Derives from `LoadResult` and adds the value.

| Member | Type | Meaning |
|---|---|---|
| `Value` | `T` | The loaded object. Undefined when `Success` is false — do not read it. |
| `LoadResult<T>.Ok(value, warnings = null)` | `static LoadResult<T>` | Builds a success result. |
| `LoadResult<T>.Fail(error, message, backupAvailable = false)` | `static LoadResult<T>` | Builds a failure result. |

## The error codes

`Beasty_SaveSystemCore.BeastySaveError`, in declaration order.

| Value | Raised by | Cause |
|---|---|---|
| `None` | — | Success. `Success` is true. |
| `InvalidArgument` | save, load, all slot methods | Null data, null target, null settings, or an invalid slot name. |
| `SerializationFailed` | save | The object could not be turned into JSON. |
| `IoError` | save, load | The file system refused the operation. |
| `FileNotFound` | load, `ReadMeta`, `RestoreBackup` | No file at the slot path (or no `.bak`). |
| `ParseError` | load, `ReadMeta` | The file is not valid JSON. |
| `Corrupt` | load, `ReadMeta` | Not a valid envelope, or the checksum does not match. |
| `DecryptFailed` | load | The encryption setting does not match the file, or the key is wrong. |
| `TypeMismatch` | load | The file holds a different root type than the one you asked for. |
| `TypeUnavailable` | scene save, scene load | A component has no registered converter. |
| `VersionTooNew` | load | The file was written by a newer container or a newer data version. |
| `MigrationFailed` | load | The file is older and the migration chain could not bring it up to date. |
| `FieldMapFailed` | load | The data could not be mapped onto the object. |
| `BackendRequiresAsync` | every synchronous call | The active storage backend is asynchronous-only; use the async twin. |
| `BackendUnavailable` | save, load, all slot methods | `StorageId` names a backend whose module did not compile. |
| `AuthRequired` | save, load, all slot methods on a remote backend | No user could be resolved for a per-user backend. |
| `NetworkError` | save, load, all slot methods on a remote backend | The cloud operation failed in transit. |

The sections below give the diagnosis and the fix for each.

### InvalidArgument

You passed something the call cannot work with: `data` is null on `Save`, `target` is null on `LoadInto`,
`settings` is null, or the slot name is rejected. A slot is a bare file name; it is rejected when it is
empty or whitespace, contains `/` or `\`, contains `..`, is a rooted path, contains characters that are
invalid in a file name, or is a Windows reserved device name (`CON`, `PRN`, `AUX`, `NUL`, `COM1`-`COM9`,
`LPT1`-`LPT9`).

**Do:** fix the calling code. If the slot name comes from the player (a named save), validate it before
saving and show them why it was rejected. Nothing was written.

### SerializationFailed

The object graph could not be turned into JSON. `Message` names the path (`$.inventory.items[3].owner`).
The causes, all of them:

- A **reference cycle**. Save data must be acyclic.
- A `NaN` or `Infinity` float. They are not valid JSON numbers.
- A **dictionary key** that is not a string, primitive or enum, or a null key.
- A `ulong` larger than `long.MaxValue`.
- A **`UnityEngine.Object` reference** (a `Sprite`, a `GameObject`, another component) on a plain C# class.
  On a `MonoBehaviour` such a field is skipped instead; on a plain class it is a hard failure.
- In a scene save, a converter that threw.

**Do:** fix the data. Break the cycle, sanitize the float, store an identifier (a string id) instead of the
Unity object reference. Nothing was written. See [What gets saved](/docs/beasty-save-system/guides/what-gets-saved/).

### IoError

The file system refused. The disk is full, the folder cannot be created, the file is locked by another
process, the platform denied permission. `Message` carries the underlying exception text and the path.

**Do:** tell the player the save failed and let them retry. Do not retry in a tight loop. The previous save
file, if there was one, is untouched: the write is atomic, so a failed write cannot leave a half-file
behind.

### FileNotFound

There is no file at the slot path. From `RestoreBackup`, there is no `.bak` for that slot.

This is an expected, queryable condition — a slot screen probes constantly — so it is logged as a warning,
not an error.

**Do:** treat it as an empty slot. Use `BeastySave.Exists` if you want to ask without producing a result.

### ParseError

The file is on disk but is not valid JSON. `Message` carries the line and column of the offending
character. Causes: the file was truncated (an old build that wrote non-atomically, a disk that filled up
mid-write), it was hand-edited badly, or it is not a Beasty save at all.

**Do:** check `BackupAvailable` and offer `BeastySave.RestoreBackup`. See
[Backups and corruption](/docs/beasty-save-system/guides/backups-and-corruption/).

### Corrupt

Two different gates report this:

- **The envelope shape is wrong.** The file parsed as JSON but the root is not an object, or `beasty`,
  `dataVersion`, `type`, `checksum` or `data` is missing or has the wrong type. `Message` names the field.
- **The checksum does not match.** The SHA-256 of the payload is not the one recorded in the file. The file
  was modified, or bytes rotted.

**Do:** the same as `ParseError`: check `BackupAvailable` and offer `RestoreBackup`. A player who edited
their save will hit the checksum gate; that is the gate working.

> **Note**
> A slot that fails its own checksum is never rotated into the `.bak` on the next save, so the last good
> copy stays restorable.

### DecryptFailed

Three gates report this:

- **`Encrypted = true` but the file is plain text.** A game that encrypts refuses to load an unencrypted
  save. The message is "This save is not encrypted, but this game only loads encrypted saves." This is
  deliberate: the checksum carries no secret, so without this gate anyone could hand-write a save.
- **Decryption threw.** The key is wrong, or the ciphertext was tampered with.
- **The decrypted text is not valid JSON.** Almost always a wrong key.

The reverse case — a plain-text setting reading an encrypted file — comes back as `Corrupt`, because the
checksum of the ciphertext does not match a hash of the JSON text.

**Do:** make `BeastySaveSettings.Encrypted` and `EncryptionKey` match how the file was written. If you
turned encryption on in an update, the old saves cannot be read: migrate them before shipping, or keep two
settings objects. See [Encryption](/docs/beasty-save-system/guides/encryption/).

### TypeMismatch

The envelope's `type` field does not equal the full name of the type you asked for. You called `Load<T>`
with the wrong `T`, you called `LoadInto` with an object of a different class, or you renamed or moved the
class since the save was written (the type name includes the namespace).

**Do:** load the type that was saved. If you renamed the class, the old files cannot be matched by name;
either keep the old name, or read the file with `ReadMeta` plus a migration strategy of your own.

### TypeUnavailable

A component in a scene save has no registered converter.

- **At save time:** the message is "`<Type>` on '`<object>`' has no registered converter; enable its
  converter module or register a custom IBeastyConverter." Nothing was written.
- **At load time:** the save file records which module wrote each component, so the message names it:
  "The save was written by module '`<id>`' — enable that converter module (or its package) in this
  project." A strict load fails on it; a tolerant load warns and skips the entry.

The most common cause is that the Unity package the module needs is not in the project: the module assembly
does not compile, so its converters do not exist.

**Do:** install the package the module needs, or register a custom converter for the type. See
[Converter modules](/docs/beasty-save-system/reference/converter-modules/) and [Custom converters](/docs/beasty-save-system/advanced/custom-converters/).

### VersionTooNew

Two gates report this:

- **Container version.** The file's `beasty` field is not the container version this build understands
  (currently 2). The file came from a newer Beasty Save System.
- **Data version.** The file's `dataVersion` is greater than `BeastySaveSettings.DataVersion`. The save was
  written by a newer build of your game.

**Do:** this is a downgrade, not a corruption. Tell the player their save is from a newer version of the
game and that they need to update. Do not offer to load it: the data would not fit.

### MigrationFailed

The file's `dataVersion` is older than `BeastySaveSettings.DataVersion`, and the chain of registered
migrations could not bridge the gap. Three causes, each named in `Message`:

- "No migration registered from data version `<n>`." — a step is missing.
- "Migration `<n>` -> `<m>` threw: ..." — your migration function raised an exception.
- "Migration chain overshot the target: a step landed on version `<n>` but version `<m>` was requested." —
  a step jumps past the target version.

**Do:** register the missing or fixed step with `BeastySave.RegisterMigration`, from a
`[RuntimeInitializeOnLoadMethod]` (Play Mode resets the registry). See
[Versioning and migrations](/docs/beasty-save-system/guides/versioning-and-migrations/).

### FieldMapFailed

The file was read, verified and decrypted; the data simply does not fit the object. Causes:

- **A field failed to convert** in strict mode. The message is `Field '<Type>.<field>' failed to load: ...`
  — usually a field whose type changed (a `string` became an `int`), or a value-type field that is
  missing from the JSON.
- **An unsupported collection type.** The writer turns any `IEnumerable` into an array, but a collection
  with no `Add`, `Enqueue` or `Push` cannot be read back.
- **A converter threw** while populating a component.
- **In a scene load (strict only):** a saveable id in the file is not present in the scene — "Saveable id
  '`<id>`' is not present in the scene."

In strict mode nothing is applied: `LoadAll` snapshots each component before writing it and rolls back the
ones already applied, and the message says so ("Nothing was loaded: the N component(s) already applied were
restored.").

**Do:** if the shape of your data changed between versions, that is what migrations are for. If you are
mid-production and renaming fields, set `Strict = false` so the bad field is skipped and reported in
`Warnings` instead of failing the load. See [Strict vs tolerant loading](/docs/beasty-save-system/guides/strict-vs-tolerant/).

### BackendRequiresAsync

A synchronous call — `Save`, `Load<T>`, `Exists`, any of them — reached a storage backend that cannot
answer synchronously (a cloud database). The message is "This storage backend is asynchronous; use the
Async save/load API." Nothing was attempted; the call fails before touching the backend, instead of
blocking the main thread on a network round-trip.

The manager's `SaveAll`/`LoadAll`/`DeleteSlot` never produce this error: they route themselves onto the
asynchronous path automatically.

**Do:** switch the call site to the async twin (`SaveAsync`, `LoadAsync<T>`, `ExistsAsync`…). See
[Async saving and loading](/docs/beasty-save-system/guides/async-saving/).

### BackendUnavailable

`BeastySaveSettings.StorageId` names a backend that is not registered. The message is "Storage backend
'`<id>`' is not available. Is its module (and SDK) in the project?" — almost always a Firebase backend
whose SDK is not in the project, so the module assembly never compiled. The Storage dropdown and the
manager's status card show the same warning in the editor.

**Do:** install the SDK the module needs (see [Firebase](/docs/beasty-save-system/guides/firebase/)), or
pick another backend. This is a project configuration problem, not something to handle at runtime.

### AuthRequired

A remote backend stores saves per user, and no user could be resolved. Either no user provider is
registered at all ("No user provider is registered; remote storage needs one to know whose save this is."),
or the provider failed to establish a session — with Firebase, typically because Anonymous auth is not
enabled in the Firebase console, or the SDK's dependency check failed on the device.

**Do:** with the Firebase Auth module in the project this resolves itself — the module registers a provider
that signs in anonymously on the first save. If you see it anyway, check that Anonymous auth is enabled in
the Firebase console, or register your own provider. See
[Storage backends](/docs/beasty-save-system/guides/storage-backends/).

### NetworkError

The cloud operation failed in transit: no connectivity, a timeout, a server-side rejection, or a stored
save with a missing chunk ("Save '`<slot>`' is missing chunk `<i>` of `<n>`."). The underlying SDK
exception text is in `Message`.

**Do:** treat it like `IoError`'s cloud sibling — tell the player the save failed and let them retry when
the connection is back. Do not retry in a tight loop.

## See also

- [BeastySave API](/docs/beasty-save-system/reference/api-beastysave/)
- [Save file format](/docs/beasty-save-system/reference/save-file-format/)
- [Troubleshooting](/docs/beasty-save-system/troubleshooting/)
