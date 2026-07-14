---
title: "Settings"
description: "BeastySaveSettings holds every option a save or load call uses: where the file goes, whether it is encrypted, whether a backup is kept, how strictly it loads,"
---

`BeastySaveSettings` holds every option a save or load call uses: where the file goes, whether it is
encrypted, whether a backup is kept, how strictly it loads, and which data version it belongs to. This page
lists every field, its default, and the reason you would change it.

## Settings are per call, not per project

There is no global settings asset. Every `BeastySave` method takes a `BeastySaveSettings` as an argument,
and `BeastySaveManager` holds one in its inspector for `SaveAll` and `LoadAll`.

That means two saves in the same project can behave completely differently. An autosave can be tolerant,
unencrypted and backup-free, writing to an `Autosaves` folder; a manual save can be strict, encrypted and
backed up, writing to `Saves`. Nothing in the system forces them to agree.

```csharp
static readonly BeastySaveSettings Manual = new BeastySaveSettings
{
    Folder = "Saves",
    Encrypted = true,
    EncryptionKey = "your own key",
};

static readonly BeastySaveSettings Auto = new BeastySaveSettings
{
    Folder = "Autosaves",
    Backup = false,
    Strict = false,
};
```

If you never write C#, you get one settings block: the **Settings** field on the `BeastySaveManager`
component, edited in the inspector or in the Save Manager window. That is enough for most games.

## The fields

| Field | Type | Default | What it does |
|---|---|---|---|
| `Folder` | string | `"Saves"` | Subfolder under `DataPath` that holds the save files. |
| `Extension` | string | `"save"` | The file extension, **without** the dot. |
| `DataPath` | string | empty | Absolute base path. Empty means `Application.persistentDataPath`. |
| `Encrypted` | bool | `false` | Encrypt the data payload with AES-256. |
| `EncryptionKey` | string | empty | The key. Empty means the shared default key that ships with the asset. |
| `Backup` | bool | `true` | Keep the previous file as `<slot>.<ext>.bak` when overwriting a slot. |
| `Strict` | bool | `true` | All-or-nothing loading. `false` skips bad fields and warns. |
| `DataVersion` | int | `1` | The schema version stamped into every save. Drives migrations. |

The final path of a save is:

```text
<DataPath or persistentDataPath>/<Folder>/<slot>.<Extension>
```

`BeastySave.GetFolderPath(settings)` and `BeastySave.GetSlotPath("slot1", settings)` give you those paths
without you having to assemble them.

### Folder

Change it to separate kinds of save from one another — `Saves`, `Autosaves`, `Profiles`. Different folders
are independent: `ListSlots` on one never sees the other's files, and a slot named `slot1` can exist in
both at once.

### Extension

Cosmetic. `save` by default; `sav`, `dat`, `json` all work. No leading dot. Changing it on a shipped game
means your players' existing files are invisible to the new build, so choose it before you ship.

### DataPath

Leave it empty. `Application.persistentDataPath` is the per-user writable location Unity gives you on every
platform, and it is where saves belong.

Set it when you have a specific reason — an editor tool that writes into the project folder, a test that
writes into a temp directory. Setting it to a path the player's OS will not let you write to is how you
get an `IoError`.

### Encrypted

Off by default. Turn it on and the `data` section of the file becomes a Base64 blob instead of readable
JSON. The envelope and the metadata stay in plain text, so a save-slot screen still works.

Two things you must know before turning it on:

- **The flag has to match how the file was written.** With `Encrypted = true` the system refuses to load a
  plain-text save, and with `Encrypted = false` it cannot read an encrypted one. Flipping this setting on a
  shipped game strands every existing save.
- **This is obfuscation, not security.** Read [encryption.md](/docs/beasty-save-system/guides/encryption/) before you rely on it.

### EncryptionKey

Any non-empty string works — a 32-byte AES key is derived from it with SHA-256. You do not need to produce
a key of a particular length.

Leave it empty and the system uses `BeastySaveSettings.SharedDefaultEncryptionKey`, which **ships inside
every copy of the asset**. Anyone who owns Beasty Save System has that string. It exists so encryption works
out of the box, not so you can ship with it. If encryption is on and you have not set your own key, the
system warns you once in the editor and in development builds.

Set your own key before you ship. Then read [encryption.md](/docs/beasty-save-system/guides/encryption/), which is honest about the fact
that your key ships inside your game too.

### Backup

On by default. When a save overwrites an existing slot, the old file is rotated to `<slot>.<ext>.bak`
first. `BeastySave.RestoreBackup` puts it back; the Save Manager window has a **Restore Backup** button that
does the same.

Two behaviours worth knowing:

- **The first save of a slot creates no backup.** There was nothing to rotate.
- **A slot whose checksum does not verify is never rotated into the backup.** A corrupt file cannot destroy
  your last good copy.

Turn it off only where you save so often that the extra file is a real cost — a frequent autosave, say. The
default is on for a good reason. See [backups-and-corruption.md](/docs/beasty-save-system/guides/backups-and-corruption/).

### Strict

On by default. A strict load is all-or-nothing: if one field cannot be read back, the load fails and
**nothing is applied**. Your game state stays exactly as it was, and you get an error result to show the
player.

Tolerant (`Strict = false`) skips the field it could not read, records it in `LoadResult.Warnings`, and
loads the rest.

Ship strict. Use tolerant when you renamed a field mid-production and would rather lose that one value than
lose the save. The full comparison, including the rollback behaviour and one important caveat about struct
roots, is in [strict-vs-tolerant.md](/docs/beasty-save-system/guides/strict-vs-tolerant/).

### DataVersion

The schema version of *your* data. It starts at `1` and is written into every file. When you load a file
whose version is lower than the current one, the registered migrations run in order to bring it up to date.

You bump it when you change the shape of your save data in a way old files cannot survive, and you register
a migration for the step. A file with a version **higher** than your setting fails with `VersionTooNew` — an
old build refuses to guess at a save written by a newer one, rather than corrupting it.

See [versioning-and-migrations.md](/docs/beasty-save-system/guides/versioning-and-migrations/).

## Slot names

The slot is the bare file name, and the system validates it. A rejected slot makes the call fail with
`InvalidArgument` and a message saying exactly why.

A slot name is rejected when:

| Rule | Example that is rejected | Why |
|---|---|---|
| It is empty or whitespace | `""` | There is no file name. |
| It contains a path separator | `saves/slot1`, `saves\slot1` | It could write outside the save folder. |
| It contains `..` | `../slot1` | Same reason. |
| It is a rooted path | `C:\slot1`, `/slot1` | Same reason. |
| It contains characters that are not valid in a file name | `slot:1`, `slot*` | The OS cannot create the file. |
| It is a Windows reserved device name | `CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9` | The name addresses a device, not a file — `CON.save` included. |

The Windows device names are rejected on **every** platform, not just Windows. A save folder written on
macOS or Linux stays usable if the player later copies it to a Windows machine.

If your game lets players name their own saves, run the name past
`BeastySave.Save` and show the `InvalidArgument` message, or sanitise it first. Do not assume a name is
fine because it looked fine on your machine.

## See also

- [encryption.md](/docs/beasty-save-system/guides/encryption/) — the honest limits
- [backups-and-corruption.md](/docs/beasty-save-system/guides/backups-and-corruption/) — the `.bak` file and how to restore it
- [strict-vs-tolerant.md](/docs/beasty-save-system/guides/strict-vs-tolerant/) — the two loading modes
- [versioning-and-migrations.md](/docs/beasty-save-system/guides/versioning-and-migrations/) — `DataVersion` in practice
- [slots-and-metadata.md](/docs/beasty-save-system/guides/slots-and-metadata/) — listing slots and reading their metadata
- [results-and-errors.md](/docs/beasty-save-system/reference/results-and-errors/) — every error code
