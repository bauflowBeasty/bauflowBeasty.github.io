# Changelog

All notable changes to Beasty Save System. This project follows [Semantic Versioning](https://semver.org/).

## 1.1.0 — 2026-08-06

### Added
- Pluggable storage backends: saves can go to a database instead of a local file. Local files remain
  the default and are unchanged; custom backends implement `IBeastySaveStorage`.
- Firebase modules — Firestore (`firestore`), Realtime Database (`realtime-db`) and automatic
  anonymous sign-in — compiled only when the Firebase SDK is present. Saves are stored per user.
- The editor keeps the `BEASTY_HAS_FIREBASE_*` scripting defines in sync automatically as the
  Firebase SDK appears or disappears from the project.
- User identity seam: `IBeastyUserProvider` / `BeastySaveUsers` decide whose saves these are;
  `ScopeByUser` also scopes local files per user.
- JSON without files: `BeastySave.SaveToJson`/`LoadFromJson` and `ToJson`/`FromJson`, for custom
  endpoints.
- `SaveResult<T>`: a typed result carrying a value, returned by the JSON/read APIs.
- Async slot utilities: `ExistsAsync`, `DeleteAsync`, `ListSlotsAsync`, `ReadMetaAsync`,
  `RestoreBackupAsync`, `SaveAllNowAsync`/`LoadAllNowAsync`.
- New typed errors: `BackendRequiresAsync`, `BackendUnavailable`, `AuthRequired`, `NetworkError`.
- **Save Mode** on the Beasty Save Manager: Synchronous (default) or Asynchronous for the
  UnityEvent-friendly entry points. Cloud backends always run asynchronously.
- A proper inspector for the Beasty Save Manager: status card, the Storage and Save Mode decisions
  up front, everything else behind an Advanced settings foldout.
- The Save Manager window groups every setting by role (Backend, Location, Security, Reliability,
  Versioning, Logging), with contextual help.
- Load diagnostics at Verbose level; a load that applies nothing now warns instead of succeeding in
  silence.
- Firestore: a head document without a valid chunk count fails as typed Corrupt data, and Verbose
  logging says whether a snapshot came from the server or from the offline cache.
- Live Firebase test suite, compiled only when the Firebase SDK is installed.

### Changed
- Load's file-not-found error message names the slot instead of the file path.
- `BeastySave.GetFolderPath`/`GetSlotPath` keep describing the local-file layout only.
- `BeastySaveManager.SaveAll`/`LoadAll`/`DeleteSlot` route to the asynchronous path automatically on
  async-only backends.

### Fixed
- With the Beasty Console asset present, `BeastySaveLog.Warning` surfaces as a real console warning.
- The demo object's status label is wired to the save/load events, so a failed save or load in the
  demo scene reports itself.

### Compatibility
- Compiles warning-free on every Unity 6 generation, including 6.5, which deprecated APIs the
  converters and scene lookups used; saves written by older versions still load across those changes.

## 1.0.0 — 2026-07-27

First public release.

### Core
- Slot-based save/load, synchronous and awaitable, with a result object every call hands back.
- Its own JSON engine: **no Newtonsoft, no external dependencies**.
- Atomic writes (temp file + swap): a crash mid-write cannot leave a half-written slot.
- Per-slot `.bak` backups, and recovery from them when a slot is damaged; a corrupt slot is never
  rotated into the backup.
- Slot names are validated: path separators, `..`, rooted paths and reserved device names come back
  as `InvalidArgument` instead of writing outside the save folder.
- Optional AES-256 encryption. Obfuscation, not real security: the key ships with the game.

### Logging
- A **Logging** dropdown on `BeastySaveManager`: `Auto`, `On`, `Verbose`, `Off`.
- Saves, loads, deletes, restores and migrations say so, with size and timing; probing an empty slot
  stays silent.
- A slot that fails its checksum and is kept out of the backup rotation warns.
- `SaveResult.BytesWritten` and `LoadResult.MigratedFrom`, for your own UI.
- One logger, `BeastySaveLog`, with a pluggable sink.
- Logs land in the **Beasty Console** window when that asset is in the project (detected by
  reflection), and in Unity's console when it is not.

### Scene state
- `BeastySaveable`: capture the components you tick on an object — inactive objects and repeated
  component types included.
- Runtime-spawned objects: `BeastySaveManager.Register` pins the id their data is filed under.
- Strict loading is all-or-nothing across the whole scene; tolerant loading skips the offending
  field and keeps the rest.
- A stored value of the wrong type is reported, never silently replaced by the live one.
- Converter modules (audio, uGUI, particles, animation), each gated behind the Unity module it
  needs. Restoring a `Slider` or a `Toggle` does not fire `onValueChanged`.

### Editor
- The internal test assembly compiles only when the `BEASTY_DEV_TOOLS` scripting define is set.

### Platforms
- Mono and IL2CPP (the reflection paths AOT builds tend to break are covered by a smoke scene).
