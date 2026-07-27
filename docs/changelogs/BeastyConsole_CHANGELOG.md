# Changelog

All notable changes to Beasty Console. This project follows [Semantic Versioning](https://semver.org/).

## 1.0.0 — 2026-07-27

First public release.

### Logging API
- Eleven semantic levels on one static class, `BeastyConsole` (namespace `BeastyConsoleLogger`) — info,
  verbose, trace, debug, notice, highlight, caution, success, warning, error and exception — so a message
  says what kind of message it is at the call site.
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
- **Licensing.** A copy bought on the Unity Asset Store is licensed under the Asset Store EULA
  (https://unity.com/legal/as-terms); `Third-Party Notices.txt` points to it. A copy bought on itch.io
  includes its own license file.
