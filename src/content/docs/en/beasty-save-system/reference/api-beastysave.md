---
title: "BeastySave API"
description: "BeastySave is the static facade and the only entry point of the save system. Every method takes a BeastySaveSettings and returns a typed result. Nothing on th"
---

`BeastySave` is the static facade and the only entry point of the save system. Every method takes a
`BeastySaveSettings` and returns a typed result. Nothing on this page throws, except the three
registration methods, which throw on developer error.

## Namespaces

```csharp
using Beasty_SaveSystem;          // BeastySave, BeastySaveable, BeastySaveManager
using Beasty_SaveSystemCore;      // BeastySaveSettings, SaveResult, LoadResult, BeastySaveError,
                                  // IBeastyConverter, ConverterUtil, BeastySaveLog
using Beasty_SaveSystemCore.Json; // JsonNode — needed only for migrations and custom converters
```

## Slot names

Every method that takes a `slot` validates it. A slot is a bare file name. It is rejected with
`InvalidArgument` when it is empty or whitespace, contains `/` or `\`, contains `..`, is a rooted path,
contains characters that are invalid in a file name, or is a Windows reserved device name (`CON`, `PRN`,
`AUX`, `NUL`, `COM1`-`COM9`, `LPT1`-`LPT9`). The device names are rejected on every platform, so a save
folder written on Linux stays usable on Windows.

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

## See also

- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/)
- [Components](/docs/beasty-save-system/reference/components/)
- [Save file format](/docs/beasty-save-system/reference/save-file-format/)
- [Settings](/docs/beasty-save-system/guides/settings/)
- [What gets saved](/docs/beasty-save-system/guides/what-gets-saved/)
