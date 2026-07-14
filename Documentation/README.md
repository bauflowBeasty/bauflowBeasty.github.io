# Beasty documentation

Three Unity packages. Each one works on its own, and they fit together when you own more than one.

| Package | What it does | Start here |
|---|---|---|
| **[Beasty Visual Novel](beasty-visual-novel/README.md)** | A complete visual novel engine: a story graph and a Ren'Py-like text script kept in sync, free-roam rooms, quests, game time, character routines, localization and saves. | [Your first scene](beasty-visual-novel/getting-started/your-first-scene.md) |
| **[Beasty Save System](beasty-save-system/README.md)** | Slot-based save and load with its own JSON engine and no external dependencies. Atomic writes, per-slot backups, optional encryption, and scene state from a component you tick. | [Save without writing code](beasty-save-system/getting-started/save-without-code.md) |
| **[Beasty Debug Logger](beasty-debug-logger/README.md)** | A logging API with semantic levels, plus an editor console that classifies, filters and searches everything your project logs. | [Getting started](beasty-debug-logger/getting-started.md) |

## How the three relate

Beasty Save System **ships inside** Beasty Visual Novel. If you bought the novel engine, the save system
is already there — do not import it a second time.

Beasty Debug Logger is optional for the save system, which detects it at runtime and falls back to Unity's
own console when it is absent. That is why each package can be bought and imported on its own.

## Who each page is for

The documentation is written for two readers at once, and every page says which one it is talking to.

- **You do not write code.** Everything you need is in *Getting started* and the guides. In Beasty Visual
  Novel that means `getting-started/`, `authoring/`, `world/` and `production/`; in Beasty Save System,
  `getting-started/` and `guides/`. You can build and ship a game without opening a C# file.
- **You write code.** The `reference/`, `advanced/` and `scripting/` folders give you exact signatures,
  the file formats, and the extension points. Full C# source is included in every package.

## Requirements

Unity **6000.2 or newer**. Mono and IL2CPP. Windows, macOS, Linux, Android, iOS and consoles.

**WebGL is not supported** in 1.0.0, because the save pipeline relies on file-system semantics the browser
build does not provide. This applies to Beasty Save System and, through it, to Beasty Visual Novel.
