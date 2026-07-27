# Changelog

All notable changes to Beasty Save System. This project follows [Semantic Versioning](https://semver.org/).

## 1.0.0 — 2026-07-27

First public release.

### Core
- Slot-based save/load, synchronous and awaitable, with a result object every call hands back: a failed save
  reports why instead of looking like a successful one.
- Its own JSON engine: **no Newtonsoft, no external dependencies**.
- Atomic writes (temp file + swap), so a crash mid-write cannot leave a half-written slot. The temp file is
  unique per write, so two writes over the same slot (an autosave landing while the player saves) cannot
  trip over each other.
- Per-slot `.bak` backups, and recovery from them when a slot is damaged. A slot that fails its checksum or
  does not parse is never rotated into the backup: it is overwritten in place, so saving on top of a corrupt
  slot keeps the last good `.bak` intact.
- Slot names are validated: empty names, path separators, `..`, rooted paths and Windows reserved device
  names (`CON`, `NUL`, `COM1`…) come back as an `InvalidArgument` result instead of writing outside the save
  folder or producing a file the OS cannot open. `SaveFileInfo.GetFullPath(fileName)` applies the same rules
  and throws `ArgumentException` on a name it rejects.
- Optional AES-256 encryption with a random IV and a key derived via SHA-256 from any non-empty string.
  Obfuscation, not real security: the key ships with the game, and the fallback key,
  `BeastySaveSettings.SharedDefaultEncryptionKey`, is public — identical in every copy of the asset. With
  encryption on and no key of your own, the editor and development builds warn once per session.

### Logging
- A **Logging** dropdown on `BeastySaveManager`: `Auto` (on in the editor and development builds, off in
  release), `On`, `Verbose`, `Off`. Changing it in Play takes effect immediately.
- Saves, loads, deletes, restores and migrations say so, with size and timing. Probing a slot that does not
  exist — what a save-slot screen does for every empty slot each time it opens — stays silent; a real `Load`
  of a missing slot does warn.
- A slot that fails its checksum and is therefore kept out of the backup rotation warns — that is the moment
  the `.bak` is the player's last copy.
- `SaveResult.BytesWritten` and `LoadResult.MigratedFrom`: the size a save wrote, and the version a load
  migrated from, for your own UI.
- One logger, `BeastySaveLog`, with a pluggable sink.
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
- A stored value of the wrong type is reported, never silently replaced by the live one: a strict load fails
  with `FieldMapFailed`, a tolerant load skips the field with a warning. A missing member — or one stored as
  null — takes the fallback.
- Converter modules, each gated behind the Unity module it needs so a project without it still compiles:
  audio, uGUI, particles, animation. Restoring a `Slider` or a `Toggle` does not fire `onValueChanged`, so
  loading a save does not re-trigger the game logic wired to them (SFX, volume changes, callbacks).

### Editor
- The asset's internal test assembly compiles only when the `BEASTY_DEV_TOOLS` scripting define is set, so
  importing the asset does not fill the Test Runner window with its internal tests. To run them, add
  `BEASTY_DEV_TOOLS` under `Project Settings ▸ Player ▸ Scripting Define Symbols`.

### Platforms
- Mono and IL2CPP (the reflection paths AOT builds tend to break are covered by a smoke scene).
