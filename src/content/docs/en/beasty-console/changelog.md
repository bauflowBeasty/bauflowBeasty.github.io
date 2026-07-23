---
title: "Changelog"
description: "All notable changes to Beasty Console, version by version. The project follows Semantic Versioning."
---

All notable changes to Beasty Console. This project follows [Semantic Versioning](https://semver.org/).

## 1.0.0 — unreleased

First public release.

### Logging API

- Eleven semantic levels on one static class — info, verbose, trace, debug, notice, highlight, caution,
  success, warning, error and exception — so a message says what kind of message it is at the call site.
- Only warning, error and exception raise Unity's severity. `LogCaution` is a soft alert that does not trip
  Error Pause and does not show up as a warning in Unity's own Console.
- Colour and glyph tags in the editor, plain ASCII tags in a build, so a player's `Player.log` stays
  readable in a text editor.
- A `context` parameter on every method: pass a `GameObject` and the entry becomes clickable, pinging the
  object in the Hierarchy.
- A per-call `canPrint` flag, so a single log can sit behind your own per-system debug switch without
  wrapping it in an `if`.
- `IsEnabled`, a master switch that silences every level at runtime. It resets to `true` on runtime
  initialization, so it has to be set after startup.
- `PrintLongMessage` splits a very long string into chunks and logs each one, so Unity does not truncate it.

### The Beasty Console window

- An editor console at `Tools > Beasty Console > Console` that classifies every entry by its level.
- Per-level filter toggles with live counts, a search field, Collapse, Clear on Play and Error Pause.
- A detail panel whose stack-trace lines open the file at the right line in your IDE.

### Dependencies and platforms

- **No external dependencies.** Two assemblies: `Beasty.Console` (runtime, all platforms) and
  `Beasty.Console.Editor` (the window). Neither references anything outside Unity.
- Beasty Save System detects this asset by reflection and routes its logs through it when present, but
  neither package needs the other: both can be bought and imported on their own.
- Mono and IL2CPP.

### Pre-release changes

Behaviour changes made before 1.0.0 ships.

- **The asset is now Beasty Console**, not Beasty Debug Logger. The class you call is `BeastyConsole` (was
  `BeastyDebugLogger`), in the `BeastyConsoleLogger` namespace (was `BeastyDebugLoggerConsole`); the assemblies
  are `Beasty.Console` and `Beasty.Console.Editor` (were `Beasty.DebugLogger` and `Beasty.DebugLogger.Editor`);
  and the folder is `Assets/BeastyComponents/BeastyConsole` (**breaking**: a `using BeastyDebugLoggerConsole;`
  and every `BeastyDebugLogger.Log*` call has to be renamed). Method names, signatures and the console window
  itself are unchanged.
- **The reflection probe follows the new name.** Beasty Save System now looks for
  `BeastyConsoleLogger.BeastyConsole, Beasty.Console`, so its logs keep landing in this window. A copy of the
  save system from an earlier build looks for the old assembly, does not find it, and falls back to Unity's
  console until it is updated too.
- **The console has its own menu.** It now opens from `Tools > Beasty Console > Console` (was
  `Tools > Beasty VN > Diagnostics > Console`): Beasty Console is a standalone asset, so it no longer sits
  under the Beasty VN menu and is reachable in a project that does not have Beasty Visual Novel.
