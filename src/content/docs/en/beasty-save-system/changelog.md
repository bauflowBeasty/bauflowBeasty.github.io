---
title: "Changelog"
description: "A summary of what changed in Beasty Save System, version by version. The project follows Semantic Versioning."
---

A summary of what changed in Beasty Save System, version by version. Each feature is explained in full on
its own page of these docs. This project follows [Semantic Versioning](https://semver.org/).

## 1.1.0 — 2026-08-06

### New
- **Cloud saves with Firebase.** Saves can go to Firestore or the Realtime Database instead of a local
  file, with automatic anonymous sign-in. Local files stay the default.
- **Your own storage.** Plug in any other database or server.
- **Saves per player.** Each signed-in user gets their own saves, in the cloud and on disk.
- **Saves as text, without files**, to send them to your own server.
- **Asynchronous saving**, chosen with the new Save Mode setting.

### Improved
- New inspector for the Beasty Save Manager: the important choices come first, the rest sits under
  Advanced settings.
- The Save Manager window groups its settings by role, with help next to each one.
- Clearer messages when a load fails or restores nothing.

### Fixed
- Warnings show up as real warnings when Beasty Console is installed.
- The demo scene reports a failed save or load.
- Compiles with no warnings on every Unity 6 version, including 6.5.

## 1.0.0 — 2026-07-27

First public release.

### New
- **Save and load by slot**, waiting for the result or not, with a clear result on every call.
- **No dependencies**: it carries its own JSON engine.
- **Crash-safe saves**, with automatic backups and recovery of a damaged slot.
- **Optional encryption** of save files.
- **Scene objects remember their state**: tick the components to keep, also on objects created during
  play.
- **Logging** set to Auto, On, Verbose or Off, shown in Beasty Console when it is installed.
- Works with Mono and IL2CPP.
