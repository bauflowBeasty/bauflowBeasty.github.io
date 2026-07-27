# Changelog

All notable changes to Beasty Save System. This project follows [Semantic Versioning](https://semver.org/).

## 1.0.0 — unreleased

First public release.

### Core
- Slot-based save/load, synchronous and awaitable, with a result object every call hands back: a failed save
  reports why instead of looking like a successful one.
- Its own JSON engine: **no Newtonsoft, no external dependencies**.
- Atomic writes (temp file + swap), so a crash mid-write cannot leave a half-written slot.
- Per-slot `.bak` backups, and recovery from them when a slot is damaged.
- Optional AES-256 encryption with a random IV and a key derived via SHA-256. Obfuscation, not real security:
  the key ships with the game.

### Logging
- A **Logging** dropdown on `BeastySaveManager`: `Auto` (on in the editor and development builds, off in
  release), `On`, `Verbose`, `Off`. Changing it in Play takes effect immediately.
- Saves, loads, deletes, restores and migrations now say so, with size and timing. They used to be silent:
  the system only spoke when something failed.
- A slot that fails its checksum and is therefore kept out of the backup rotation now warns instead of
  doing it quietly — that is the moment the `.bak` is the player's last copy.
- `SaveResult.BytesWritten` and `LoadResult.MigratedFrom`: the size a save wrote, and the version a load
  migrated from, for your own UI.
- One logger instead of two: the internal `DebugLogger` is gone and everything goes through
  `BeastySaveLog`, which has the pluggable sink.
- Logs land in the **Beasty Console** window when that asset is in the project, and in Unity's console when it
  is not. The detection is by reflection, with no assembly reference either way, so neither package needs the
  other and each can be imported on its own.

### Scene state
- `BeastySaveable`: capture the components you tick on an object — including inactive objects, and several
  components of the same type on one object.
- Runtime-spawned objects: `BeastySaveManager.Register(go, "your.stable.id", components)` pins the id their data
  is filed under, so a spawned chest or enemy finds its state again next session.
- Strict loading is all-or-nothing across the whole scene: a failure on one component rolls back the ones already
  applied instead of leaving the world half-loaded. Tolerant loading (`Strict = false`) skips the offending FIELD
  and keeps the rest of the component.
- Converter modules, each gated behind the Unity module it needs so a project without it still compiles:
  audio, uGUI, particles, animation.

### Platforms
- Mono and IL2CPP (the reflection paths AOT builds tend to break are covered by a smoke scene).

### Pre-release changes

Behaviour changes made before 1.0.0 ships. Save files written by earlier builds still load unchanged.

- **Encryption key.** The fallback key is now `BeastySaveSettings.SharedDefaultEncryptionKey` and is documented
  as public: it ships identical in every copy of the asset. With encryption on and no key of your own, the
  editor (and development builds) now warn once per session. The key's VALUE is unchanged, so saves encrypted
  with the default still load.
- **Slot names** are validated in one place: empty names, path separators, `..`, rooted paths and Windows
  reserved device names (`CON`, `NUL`, `COM1`…) come back as an `InvalidArgument` result instead of writing
  outside the save folder or producing a file the OS cannot open. `SaveFileInfo.GetFullPath(fileName)` applies
  the same rules and throws `ArgumentException` on a name it rejects (**breaking**: it used to accept anything).
- **Backups** no longer rotate a damaged slot. A file that fails its checksum or does not parse is overwritten
  in place, leaving the last good `.bak` where it is — saving on top of a corrupt slot used to destroy the only
  recoverable copy.
- **Atomic writes** use a temp file that is unique per write, so two writes over the same slot (an autosave
  landing while the player saves) can no longer trip over each other's temp.
- **Converters** report a stored value of the wrong type instead of silently falling back to the live one: a
  strict load fails with `FieldMapFailed`, a tolerant load skips the field with a warning (**breaking** for
  custom converters that relied on `ConverterUtil.Read*` swallowing a mismatch). A missing member — or one
  stored as null — still takes the fallback.
- **uGUI:** restoring a `Slider` or a `Toggle` no longer fires `onValueChanged`, so loading a save does not
  re-trigger the game logic wired to them (SFX, volume changes, callbacks).
- **Removed** `PasswordGenerator`, which was unused, undocumented and biased (**breaking**). Any non-empty
  string works as an encryption key; the cipher derives the AES key from it with SHA-256.
- **Logging got quieter by default.** The file-path dumps (`File Path: …`, `Folder Path …`) that used to
  print on every file operation in the editor are now Verbose-only. And probing a slot that does not
  exist — what a save-slot screen does for every empty slot each time it opens — no longer logs a
  warning per slot; a real `Load` of a missing slot still warns.
- **The asset's internal tests no longer show up in your Test Runner.** The test assembly that ships with
  the package now compiles only when the `BEASTY_DEV_TOOLS` scripting define is set, so importing the asset
  no longer fills the Test Runner window with its internal tests. To run them, add `BEASTY_DEV_TOOLS` under
  `Project Settings ▸ Player ▸ Scripting Define Symbols`.
- **The Save Manager window plays nice with undo.** "Create Beasty Save Manager" can be undone and redone;
  dragging several GameObjects in adds all their `BeastySaveable` components as ONE undo step (and undo also
  reverts the ids generated for them); and the window repaints right after an undo/redo instead of showing a
  stale list until the next mouse move.
- **The package no longer ships its own license file.** `BeastySaveSystem_LICENSE.md` is gone: an asset bought
  on the Unity Asset Store is licensed under the Asset Store EULA (https://unity.com/legal/as-terms), and an
  independent license inside the package conflicts with it. `Third-Party Notices.txt` now points to that
  EULA. Copies bought on itch.io get their own license file, added to the itch download at packaging time.
