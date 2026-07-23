---
title: "Getting started"
description: "From an empty project to a classified log in the Beasty Console, in about two minutes."
---

From an empty project to a classified log in the Beasty Console, in about two minutes.

## Requirements

- Unity 6000.2 or newer.
- No dependencies. The package references no other asset and no external library.
- The logging API works in the editor and in builds, on every platform. The Beasty Console window is an
  editor tool.

## Import

Import the package from the Package Manager, under My Assets. It installs into
`Assets/BeastyComponents/BeastyConsole/`:

- `Scripts/` — the logging API. This is what ships in your build.
- `Editor/` — the Beasty Console window. This never ships.

Nothing to configure. There is no settings asset and no scene setup.

## Your first log

Add this to any MonoBehaviour:

![The console with the first message logged through BeastyLog](/docs-images/beasty-console/log-first-log.png)

```csharp
using BeastyConsoleLogger;

BeastyConsole.LogInfo("Save file loaded.");
```

Enter Play Mode. The line appears in Unity's own Console, in green, with an info tag in front of it.

## Open the console

The window is at `Tools > Beasty Console > Console`.

![The Tools > Beasty Console menu with Console in it](/docs-images/beasty-console/log-menu-console.png)

> **Note**
> The package has its own menu, so the window is there in any project — with or without Beasty Visual
> Novel. If you used an earlier build, it opened from `Tools > Beasty VN > Diagnostics > Console`.

What you see:

- A toolbar: Clear, Collapse, Clear on Play, Error Pause, and a search field.
- A second toolbar of filter toggles, one per level, each showing how many entries of that level have
  arrived. Click one to hide that level.
- The list, one row per entry: the level glyph, the time, the message.
- A detail panel below it. Select a row to read the full message and its stack trace.

The console does not replace Unity's Console. It listens alongside it, so it shows every log in the
project, including plain `Debug.Log` calls from your own code and from third-party packages.

## Next

- [Logging](/docs/beasty-console/guides/logging/) — the eleven levels, and when to reach for each one.
- [The Beasty Console window](/docs/beasty-console/guides/console-window/) — every control, and the behaviours that surprise
  people.
