---
title: "Beasty Debug Logger"
description: "Beasty Debug Logger is a static logging API with semantic levels  that you call instead of Debug.Log. It also ships an editor console window that classifies,"
---

Beasty Debug Logger is a static logging API with semantic levels (info, verbose, trace, debug, notice,
highlight, caution, success, warning, error, exception) that you call instead of `Debug.Log`. It also ships
an editor console window that classifies, filters and searches every log your project produces.

It is for anyone who has lost a real error inside a wall of `Debug.Log` output: you tag each message with a
level as you write it, and later you switch levels off until only the ones you care about remain.

## Zero dependencies

The package references nothing. It ships two assemblies, `Beasty.DebugLogger` (runtime, all platforms) and
`Beasty.DebugLogger.Editor` (the console window). It does not need the other Beasty packages, and they do
not need it. See [Beasty integration](/docs/beasty-debug-logger/guides/beasty-integration/).

## What you get

- Eleven logging levels, each with its own tag and colour, on one static class.
- Colour and glyph tags in the editor, plain ASCII tags in a build, so a player's `Player.log` stays
  readable.
- A `context` parameter: pass a GameObject and the log entry pings it in the Hierarchy.
- A per-call `canPrint` flag, so a single log can sit behind your own per-system debug switch.
- A master switch, `IsEnabled`, that silences every level at runtime.
- `PrintLongMessage`, which splits a very long string into chunks so Unity does not truncate it.
- The Beasty Console window: per-level filter toggles with live counts, a search field, Collapse,
  Clear on Play, Error Pause, and a detail panel whose stack-trace lines open the file in your IDE.

## Where to start

- [Getting started](/docs/beasty-debug-logger/getting-started/) — install it, write one log, open the console.
- [Logging](/docs/beasty-debug-logger/guides/logging/) — every level and when to use it.
- [The Beasty Console window](/docs/beasty-debug-logger/guides/console-window/) — the window, control by control.
- [Release builds](/docs/beasty-debug-logger/guides/release-builds/) — what logging really costs you in a shipped game.
- [API reference](/docs/beasty-debug-logger/reference/api/) — every public member.
- [FAQ](/docs/beasty-debug-logger/faq/)
