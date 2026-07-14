---
title: "Save file format"
description: "The on-disk format, for anyone who wants to inspect a save, write a tool against it, or understand exactly what the pipeline does. You do not need this page t"
---

The on-disk format, for anyone who wants to inspect a save, write a tool against it, or understand exactly
what the pipeline does. You do not need this page to use the package.

## Where the file lives

```text
{DataPath or Application.persistentDataPath}/{Folder}/{slot}.{Extension}
```

With the default settings, that is `.../Saves/quicksave.save`. Alongside it:

| File | What it is |
|---|---|
| `<slot>.<ext>` | The save. |
| `<slot>.<ext>.bak` | The previous save, rotated in on the last overwrite. |
| `<slot>.<ext>.<guid>.tmp` | A write in flight. Should never survive a completed call. |

The format is JSON, indented with two spaces, UTF-8 **without a BOM**.

## The envelope

```json
{
  "beasty": 2,
  "dataVersion": 1,
  "type": "MyGame.PlayerData",
  "checksum": "9f2a...64 lowercase hex chars...c1",
  "meta": { "level": "3", "playtime": "01:22" },
  "data": {
    "playerName": "Ana",
    "hp": 87,
    "position": { "x": 12.5, "y": 0, "z": -3.25 }
  }
}
```

| Field | Type | Meaning |
|---|---|---|
| `beasty` | integer | Container version. Currently **2**. A file from a newer container fails with `VersionTooNew`. |
| `dataVersion` | integer | Your `BeastySaveSettings.DataVersion` at the time of writing. Drives migrations. |
| `type` | string | The full name of the root type. |
| `checksum` | string | SHA-256 of the payload, as 64 lowercase hex characters. |
| `meta` | object | Optional string dictionary. Omitted entirely when you pass no meta. |
| `data` | object, or string | The serialized object. A Base64 string when the save is encrypted. |

### `type` is checked, never resolved

The `type` field exists **only for validation**: the load compares it against the type you asked for and
fails with `TypeMismatch` if they differ. **The type is never instantiated from the file.** Editing a save
to say `"type": "System.Diagnostics.Process"` does not make the game construct one; it makes the load fail
with `TypeMismatch`. A save file cannot name a type into existence.

### `meta` is plain text, even when the save is encrypted

`meta` sits outside the payload and is never encrypted. That is deliberate: a save-slot screen must be able
to show the chapter name, the playtime and the level for every slot, and it has to do that without
decrypting anything. `BeastySave.ReadMeta` reads this field and nothing else — it does not verify the
checksum, does not decrypt, and never touches `data`, so listing twenty slots costs twenty small reads.

> **Warning**
> `meta` is read before the checksum is verified, and it is not covered by encryption. Treat it as
> untrusted display data. Never put a value in `meta` that the game reads back as state (a score, a
> currency, an unlock flag) — put it in `data`.

### The payload when encrypted

With `Encrypted = true`, `data` is a Base64 string of `[random 16-byte IV][AES-256-CBC ciphertext]`. The IV
is fresh on every save, so saving identical data twice produces different files. The checksum is computed
over the ciphertext string, not over the plain JSON. The envelope stays plain text.

The encryption is obfuscation against casual save editing, not security: the key ships inside your game and
can be extracted. See [Encryption](/docs/beasty-save-system/guides/encryption/).

## The group (scene) format

A save written by `BeastySaveManager.SaveAll` always has `"type": "Beasty.SaveGroup"`, and its `data` is a
group document: one entry per saveable id, one sub-entry per component.

```json
{
  "saveables": {
    "8f1c9a2b4d7e40f1": {
      "UnityEngine.Transform":   { "module": "core", "data": { "position": { "x": 0, "y": 1, "z": 0 } } },
      "MyGame.Health":           { "module": "core", "data": { "current": 40, "max": 100 } },
      "UnityEngine.BoxCollider": { "module": "physics3d", "data": { "isTrigger": false } },
      "UnityEngine.BoxCollider#1": { "module": "physics3d", "data": { "isTrigger": true } }
    }
  }
}
```

- The outer key is the `BeastySaveable.Id`.
- The inner key is the component's `Type.FullName`.
- `module` records the converter layer that produced the data: `"core"`, a module id, or `"dev"`. It is
  what lets a load say *which* module you are missing.
- `data` is whatever that converter wrote.

**The `#1` suffix** appears from the **second** component of the same type on one GameObject. The first is
keyed by the bare type name, the second `#1`, the third `#2`. Several components of the same type on one
object do round-trip, each keeping its own state. A key with no `#` reads back as index 0.

## The write pipeline

In order. Any step that fails stops the write; nothing is left on disk.

1. **Null data** to `Save` -> `InvalidArgument`.
2. **Serialize** the object to a `JsonNode` through the mapper and its converters. Failure ->
   `SerializationFailed`.
3. **Validate** the settings and the slot name -> `InvalidArgument`.
4. **Write compactly and checksum.** The node is written with no indentation, in deterministic member
   order. If encryption is on, that text is encrypted and the **ciphertext** is checksummed; otherwise the
   compact JSON is checksummed.
5. **Build the envelope** and render it indented.
6. **Create the folder** if it does not exist. Failure -> `IoError`.
7. **Decide the backup path.** With `Backup = true`, the file about to be overwritten is checked against
   its own checksum first. **A slot that does not verify is not rotated to `.bak`** — pushing a corrupt file
   into the backup would destroy the last copy the player could still restore.
8. **Atomic write.** The text goes to a unique temp file (`<slot path>.<guid>.tmp`), which is then
   `File.Replace`d over the slot — the same operation that produces the `.bak`. If the slot does not exist
   yet, the temp is moved into place instead, so **the first save creates no backup**. A crash mid-write can
   only damage the throwaway temp; the previous save is untouched. Failure -> `IoError`.

The temp name is unique per write, not per path, so two writes to the same slot in flight (an autosave
landing while the player saves manually) cannot corrupt each other.

## The load pipeline

The gates, in order. Each maps to one error code.

| # | Gate | Error on failure |
|---|---|---|
| 1 | Settings not null, slot name valid | `InvalidArgument` |
| 2 | The file exists | `FileNotFound` |
| 3 | The file can be read | `IoError` |
| 4 | The text parses as JSON | `ParseError` |
| 5 | The root is a valid envelope (all required fields, right types) | `Corrupt` |
| 6 | `beasty` equals the container version (2) | `VersionTooNew` |
| 7 | If the game expects encryption, `data` is a string | `DecryptFailed` |
| 8 | The checksum matches the payload | `Corrupt` |
| 9 | The payload decrypts, and decrypts to valid JSON | `DecryptFailed` |
| 10 | `type` matches the requested type | `TypeMismatch` |
| 11 | `dataVersion` is not newer than the game's | `VersionTooNew` |
| 12 | Migrations bring an older `dataVersion` up to date | `MigrationFailed` |
| 13 | The data maps onto the object | `FieldMapFailed` |

Two details worth knowing:

- **Gate 7 runs before the checksum.** Whether the payload is ciphertext is decided by your settings, not
  by the shape of the file. A game with encryption on refuses a plain-text save outright — the checksum
  carries no secret, so a hand-written save would otherwise pass.
- `LoadResult.BackupAvailable` is filled in on **every** load result, success or failure, so you can offer a
  restore at any gate. A missing slot is logged as a warning, not an error: slot screens poll constantly.

## Slot utilities

| Call | Behaviour |
|---|---|
| `Exists` | File presence only. Does not open the file. |
| `Delete` | Removes the slot **and** its `.bak`. |
| `ListSlots` | Ordinal order. Excludes `.bak` and `.tmp`. |
| `ReadMeta` | Envelope only. Works on an encrypted save without the key. |
| `RestoreBackup` | Copies the `.bak` over the slot atomically and **leaves the `.bak` in place**. No backup -> `FileNotFound`. |

## See also

- [BeastySave API](/docs/beasty-save-system/reference/api-beastysave/)
- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/)
- [Backups and corruption](/docs/beasty-save-system/guides/backups-and-corruption/)
- [The JSON engine](/docs/beasty-save-system/reference/json-engine/)
