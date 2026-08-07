---
title: "Changelog"
description: "All notable changes to Beasty Save System, version by version. The project follows Semantic Versioning."
---

All notable changes to Beasty Save System. This project follows [Semantic Versioning](https://semver.org/).

## 1.1.0 — 2026-08-06

### Added

- Pluggable storage backends: saves can now go to a database instead of a local file.
  `BeastySaveSettings.StorageId` picks the backend (dropdown in the Beasty Save Manager);
  local files remain the default and are unchanged. Custom backends implement
  `IBeastySaveStorage` and register in `BeastySaveStorageRegistry`.
- Firebase modules (compiled only when the Firebase SDK is present — no setup beyond importing it):
  Firestore (`firestore`), Realtime Database (`realtime-db`), and automatic anonymous sign-in via
  Firebase Auth. Saves are stored per user under users/{uid}/saves/{slot}. Recommended security
  rules: each uid may only read/write its own subtree.
- The editor keeps the `BEASTY_HAS_FIREBASE_*` scripting defines in sync automatically: it adds and
  removes them per active build target as the Firebase SDK appears or disappears from the project,
  so a `.unitypackage` install (or removal) of the SDK does not need a manual Player Settings edit.
- User identity seam: `IBeastyUserProvider` / `BeastySaveUsers` decide whose saves these are;
  `BeastySaveSettings.ScopeByUser` also scopes local files per user.
- JSON without files: `BeastySave.SaveToJson`/`LoadFromJson` (full integrity envelope) and
  `BeastySave.ToJson`/`FromJson` (clean payload) for custom endpoints.
- `SaveResult<T>`: a typed result carrying a value, returned by the JSON/read APIs.
- Async slot utilities: `ExistsAsync`, `DeleteAsync`, `ListSlotsAsync`, `ReadMetaAsync`,
  `RestoreBackupAsync`; `BeastySaveManager.SaveAllNowAsync`/`LoadAllNowAsync`. Synchronous calls on
  an async-only backend return the new `BackendRequiresAsync` error instead of blocking.
- New typed errors: `BackendRequiresAsync`, `BackendUnavailable`, `AuthRequired`, `NetworkError`.
- **Save Mode** on the Beasty Save Manager: Synchronous (default, unchanged) or Asynchronous for the
  UnityEvent-friendly `SaveAll`/`LoadAll`/`DeleteSlot` entry points. Cloud backends always run
  asynchronously; picking Synchronous with a cloud backend still routes asynchronously (nothing is
  ever lost) and warns once per session. Code callers keep choosing explicitly via `*Now`/`*NowAsync`.
- A proper inspector for the Beasty Save Manager: status card (active backend, user session, last
  save/load result), the two decisions up front (Storage and Save Mode), everything else behind an
  Advanced settings foldout, and a button to the full Save Manager window.
- The Save Manager window now groups every setting by role (Backend, Location, Security, Reliability,
  Versioning, Logging) with contextual help: fields that do not apply to the active backend are
  hidden or disabled with a note, and enabling encryption without a key warns about the shared
  default key.
- Load diagnostics at Verbose level: every load logs how much text the backend returned and how many
  saveable ids/entries the document carries; every cloud operation logs the resolved user id; a load
  that applies nothing now warns with the full detail instead of succeeding in silence.
- Firestore: a head document without a valid chunk count now fails as typed Corrupt data instead of
  surfacing as a confusing parse error, and Verbose logging says whether a snapshot came from the
  server or from the SDK's offline cache.
- Live Firebase test suite (`BeastySaveSystem.Firebase.Tests`) that only compiles when the Firebase
  SDK is installed — real Firestore round-trips, double-read freshness, anonymous sign-in and
  corrupt-head detection against the configured project. Gated for both installs: `versionDefines`
  for a UPM package, and the `FirebaseSdkDetector`-driven global scripting defines for a
  `.unitypackage` install. Every awaited Firebase step has a hard timeout that fails the test naming
  the stalled step, and cleanup yields instead of blocking: Firestore completions marshal through
  the editor's main thread, so a blocking teardown wait used to deadlock the Test Runner into an
  infinite, log-less hang.

### Changed

- Load's file-not-found error message now names the slot instead of the file path (storage backends
  may have no file path at all).
- `BeastySave.GetFolderPath`/`GetSlotPath` keep describing the local-file layout only; they are not
  scoped per user and do not apply to non-local backends.
- `BeastySaveManager.SaveAll`/`LoadAll`/`DeleteSlot` route to the asynchronous path automatically on
  async-only backends (fire-and-forget; the outcome still arrives via `SaveCompleted`/`LoadCompleted`
  and `LastSaveResult`).

### Fixed

- With the Beasty Console asset present, `BeastySaveLog.Warning` now surfaces as a real console
  warning (it used to bind to an info-colored channel, invisible to the warnings filter).
- The demo object's status label is now wired to the save/load events, so a failed save or load in
  the demo scene reports itself instead of failing silently.

### Compatibility

- Compiles warning-free on every Unity 6 generation, including 6.5, which deprecated several APIs the
  converters and scene lookups used. `Light` saves store the directional cookie size as `cookieSize2D`
  (a `Vector2`) on Unity 6.4+; a save written by an older version still loads — its float `cookieSize` is
  applied as a square size. `Collider2D` saves there rely on `compositeOperation` alone (already saved
  alongside the deprecated `usedByComposite` bool since 1.0.0), and an old save carrying only the bool
  still loads: `true` maps to `Merge`. Scene lookups moved from `FindFirstObjectByType` to
  `FindAnyObjectByType` and the sort-free `FindObjectsByType` overloads — identical results, every lookup
  targeted a single object. On Unity 6.2/6.3 — where `cookieSize` and `usedByComposite` are already flagged
  deprecated but are still the correct APIs (their replacements arrived in 6.4) — the deprecation warnings
  are suppressed at the call sites, so those versions import warning-free too.

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
