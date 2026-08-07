---
title: "BeastySave API"
description: "Complete reference for the BeastySave static facade: saving, loading, slots, registration, paths and logging, with the error codes each call returns."
---

`BeastySave` is the static facade and the only entry point of the save system. Every save, load and
slot method takes a `BeastySaveSettings` and returns a typed result. Nothing on this page throws,
except the three registration methods, which throw on developer error.

## Namespaces

```csharp
using Beasty_SaveSystem;          // BeastySave, BeastySaveable, BeastySaveManager
using Beasty_SaveSystemCore;      // BeastySaveSettings, SaveResult, LoadResult, BeastySaveError,
                                  // IBeastyConverter, ConverterUtil, BeastySaveLog, BeastySaveLogLevel
using Beasty_SaveSystemCore.Json; // JsonNode — needed only for migrations and custom converters
```

## Slot names

Every method that takes a `slot` validates it. A slot is a bare file name. It is rejected with
`InvalidArgument` when it is empty or whitespace, contains `/` or `\`, contains `..`, is a rooted path,
contains characters that are invalid in a file name, or is a Windows reserved device name (`CON`, `PRN`,
`AUX`, `NUL`, `COM1`-`COM9`, `LPT1`-`LPT9`). The device names are rejected on every platform, so a save
folder written on Linux stays usable on Windows.

> **Note**
> With a storage backend configured (`BeastySaveSettings.StorageId`), every call on this page can also
> fail with `BackendUnavailable` (the backend's module did not compile), and — on a cloud backend —
> `AuthRequired` or `NetworkError`. A **synchronous** call on an asynchronous-only backend fails with
> `BackendRequiresAsync` instead of blocking. See
> [Storage backends](/docs/beasty-save-system/guides/storage-backends/).

## Saving

```csharp
public static SaveResult Save(object data, string slot, BeastySaveSettings settings,
                              IDictionary<string, string> meta = null)
```

Serializes `data`, wraps it in an envelope and writes it to the slot atomically. `meta` is an optional
string dictionary stored in plain text next to the payload; see
[Save file format](/docs/beasty-save-system/reference/save-file-format/). Returns `SaveResult.Ok()` or a failure.

Errors: `InvalidArgument` (null `data`, null `settings`, bad slot name), `SerializationFailed` (the object
cannot be turned into JSON: a reference cycle, a `NaN`/`Infinity` float, an unsupported dictionary key, a
`ulong` above `long.MaxValue`, a `UnityEngine.Object` reference on a plain C# class), `IoError` (the folder
cannot be created, the disk is full, the file is locked).

```csharp
public static Task<SaveResult> SaveAsync(object data, string slot, BeastySaveSettings settings,
                                         IDictionary<string, string> meta = null)
```

Same contract, with the file write done asynchronously. Serialization and encryption still run on the
calling thread. Same error codes. See [Async saving](/docs/beasty-save-system/guides/async-saving/).

## Loading

```csharp
public static LoadResult<T> Load<T>(string slot, BeastySaveSettings settings)
```

Reads the slot and maps the payload into a new `T`. On success, `Value` holds the object. The envelope's
`type` must match `typeof(T).FullName`.

Errors: `InvalidArgument`, `FileNotFound`, `IoError`, `ParseError`, `Corrupt`, `VersionTooNew`,
`DecryptFailed`, `TypeMismatch`, `MigrationFailed`, `FieldMapFailed`.

```csharp
public static Task<LoadResult<T>> LoadAsync<T>(string slot, BeastySaveSettings settings)
```

Same contract, reading the file asynchronously. Same error codes.

```csharp
public static LoadResult LoadInto(object target, string slot, BeastySaveSettings settings)
```

Loads the slot onto an object that already exists, instead of creating one. This is the only way to load a
`MonoBehaviour` or any other `UnityEngine.Object`: they are never constructed from file data. The
envelope's `type` must match `target.GetType().FullName`.

Errors: the same as `Load<T>`, plus `InvalidArgument` when `target` is null.

```csharp
public static Task<LoadResult> LoadIntoAsync(object target, string slot, BeastySaveSettings settings)
```

Same contract, reading the file asynchronously. Same error codes.

> **Note**
> `BeastySaveSettings.Strict` decides what a bad field does: strict fails the whole load and applies
> nothing, tolerant skips the field and reports it in `LoadResult.Warnings`. See
> [Strict vs tolerant loading](/docs/beasty-save-system/guides/strict-vs-tolerant/).

## Slots

```csharp
public static bool Exists(string slot, BeastySaveSettings settings)
```

True when the slot file is on disk. False for a null `settings` or an invalid slot name. Does not open or
validate the file.

```csharp
public static bool Delete(string slot, BeastySaveSettings settings)
```

Deletes the slot file and its `.bak`. Returns true when the slot file itself was deleted. Best effort: a
locked file is skipped silently, never thrown.

```csharp
public static string[] ListSlots(BeastySaveSettings settings)
```

Slot names in the save folder, sorted in ordinal order. Backups (`.bak`) and in-flight temp files (`.tmp`)
are excluded. Returns an empty array when the folder does not exist.

```csharp
public static LoadResult<Dictionary<string, string>> ReadMeta(string slot, BeastySaveSettings settings)
```

Reads only the envelope's `meta` dictionary. It does not verify the checksum, does not decrypt and never
touches the payload, so it works on an encrypted save without the key. This is what a save-slot screen
should call. See [Slots and metadata](/docs/beasty-save-system/guides/slots-and-metadata/).

Errors: `InvalidArgument`, `FileNotFound`, `IoError`, `ParseError`, `Corrupt` (the envelope shape is
invalid).

```csharp
public static SaveResult RestoreBackup(string slot, BeastySaveSettings settings)
```

Copies `<slot>.<ext>.bak` over the slot file, atomically. The `.bak` is left in place, so restoring twice
is safe. See [Backups and corruption](/docs/beasty-save-system/guides/backups-and-corruption/).

Errors: `InvalidArgument`, `FileNotFound` (there is no backup for that slot), `IoError`.

### The async twins

Every slot method has an async counterpart with the same arguments, the same result type and the same
error codes:

```csharp
public static Task<bool>     ExistsAsync(string slot, BeastySaveSettings settings)
public static Task<bool>     DeleteAsync(string slot, BeastySaveSettings settings)
public static Task<string[]> ListSlotsAsync(BeastySaveSettings settings)
public static Task<LoadResult<Dictionary<string, string>>> ReadMetaAsync(string slot, BeastySaveSettings settings)
public static Task<SaveResult> RestoreBackupAsync(string slot, BeastySaveSettings settings)
```

On an asynchronous-only backend (a cloud database) these are the only form that works — the synchronous
forms return `BackendRequiresAsync`. See [Async saving](/docs/beasty-save-system/guides/async-saving/).

## JSON without files

Four calls produce and consume save **text** instead of files, for callers who own their own transport — a
custom HTTP endpoint, a message queue, a platform cloud-save API. No storage backend is involved.

```csharp
public static SaveResult<string> SaveToJson(object data, BeastySaveSettings settings,
                                            IDictionary<string, string> meta = null)
```

The exact envelope text a save would write to disk — checksum, versions, meta, optional encryption —
without writing anything. `Value` holds the text; `BytesWritten` is its UTF-8 byte count. Errors:
`InvalidArgument`, `SerializationFailed`.

```csharp
public static LoadResult<T> LoadFromJson<T>(string json, BeastySaveSettings settings)
```

Loads from an envelope produced by `SaveToJson` (or read back from your own endpoint). Checksum, type
validation and migrations run exactly like a file load, so the error codes are the ones a `Load<T>` can
produce, minus the file-system ones.

```csharp
public static SaveResult<string> ToJson(object data, BeastySaveSettings settings)
public static LoadResult<T>      FromJson<T>(string json, BeastySaveSettings settings)
```

The same idea without the envelope: `ToJson` serializes the data as clean JSON — no checksum, no
versions — and `FromJson<T>` maps it back. No integrity check and no migrations run; strict/tolerant
mapping still applies. For endpoints that want plain data. Errors: `InvalidArgument`,
`SerializationFailed` / `ParseError`, `FieldMapFailed`.

Use the envelope pair when you want the file format's guarantees over the wire; use the clean pair when
the receiving end defines the format. `SaveResult<T>` is described in
[Results and errors](/docs/beasty-save-system/reference/results-and-errors/).

## Extension points

```csharp
public static void RegisterMigration(int fromVersion, int toVersion, Func<JsonNode, JsonNode> migrate)
```

Registers one step of the migration chain, applied to the raw `JsonNode` at load time when the file's
`dataVersion` is older than `BeastySaveSettings.DataVersion`. Steps chain: 1 to 2, 2 to 3, and so on.
Throws `ArgumentNullException` when `migrate` is null and `ArgumentException` when `toVersion` is not
greater than `fromVersion` — these are developer mistakes, not file input. See
[Versioning and migrations](/docs/beasty-save-system/guides/versioning-and-migrations/).

```csharp
public static void RegisterConverter(IBeastyConverter converter)
```

Registers a converter in the `dev` layer, which has the highest priority and therefore overrides both
module converters and the built-in `core` ones. The most recent registration wins. Throws
`ArgumentNullException` on a null converter.

```csharp
public static void RegisterModule(string moduleId, IEnumerable<IBeastyConverter> converters)
```

Registers a named group of converters. Idempotent by id: registering the same id again replaces the group.
The id is written into every component entry of a scene save. Throws `ArgumentException` on an empty id and
`ArgumentNullException` on a null sequence. See [Custom converters](/docs/beasty-save-system/advanced/custom-converters/).

```csharp
public static bool TryDescribeConverter(Type type, out string source)
```

True when some registered converter handles the type. `source` is `"dev"`, a module id (for example
`"physics2d"`) or `"core"`. This is what the editor uses to warn about components with no converter.

> **Warning**
> Entering Play Mode resets the statics. Converters registered with `RegisterConverter`, and every
> migration, are lost on every Play. Register them from a `[RuntimeInitializeOnLoadMethod]`. Modules
> registered with `RegisterModule` survive the reset.

Two more extension points live outside the facade: `BeastySaveStorageRegistry.Register` adds a storage
backend of your own, and `BeastySaveUsers` decides whose saves these are. Both are covered in
[Custom backends](/docs/beasty-save-system/advanced/custom-backends/).

## Paths

```csharp
public static string GetFolderPath(BeastySaveSettings settings)
```

The absolute folder holding the save files: `{DataPath or Application.persistentDataPath}/{Folder}`. The
folder is created if it does not exist.

```csharp
public static string GetSlotPath(string slot, BeastySaveSettings settings)
```

The absolute path of one slot's file: `{folder}/{slot}.{Extension}`. Does not create anything and does not
validate the slot name.

Both methods describe the **local-file layout only**: they are not scoped per user (`ScopeByUser` adds a
`<userId>` subfolder they do not know about) and they say nothing about a cloud backend, which has no file
path at all.

## Logging

```csharp
public static BeastySaveLogLevel Level { get; set; }   // Off, Normal, Verbose
public static BeastySaveLogLevel DefaultLevel { get; } // Normal in the editor and dev builds, Off in release
public static bool EnableLogs { get; set; }            // convenience: false is Off, true is Normal
public static IBeastySaveLogSink Sink;

public static void Verbose(string message);
public static void Info(string message);
public static void Warning(string message);
public static void Error(string message);
```

`BeastySaveLog` is the save system's logging facade. `Level` is the source of truth and defaults lazily to
`DefaultLevel`. Every line is prefixed `[BeastySave]`. `Verbose` is silent unless `Level` is
`BeastySaveLogLevel.Verbose`; a custom sink receives verbose lines through `Info`.

The `BeastySaveManager` inspector drives `Level` from its **Logging** dropdown, and re-applies it on
`OnEnable` and `OnValidate`. The whole story is in [logging.md](/docs/beasty-save-system/guides/logging/).

## See also

- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/)
- [Components](/docs/beasty-save-system/reference/components/)
- [Save file format](/docs/beasty-save-system/reference/save-file-format/)
- [Settings](/docs/beasty-save-system/guides/settings/)
- [What gets saved](/docs/beasty-save-system/guides/what-gets-saved/)
