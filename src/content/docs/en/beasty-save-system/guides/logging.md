---
title: "Logging"
description: "The Logging dropdown on BeastySaveManager: what each mode prints, how to send the lines to your own sink, and what logging costs in a release build."
---

The save system tells you what it did. By default it does so in the editor and in development builds, and
says nothing in a release build — a shipped game should not write a line to `player.log` every time it
autosaves.

## The toggle

Select your `BeastySaveManager` and look at **Logging**.

![The Logging dropdown](/docs-images/beasty-save-system/save-manager-logging.png)

| Mode | What you get |
|---|---|
| **Auto** (default) | On in the editor and development builds, off in release builds. |
| **On** | Every save, load, delete and restore, in every build. |
| **Verbose** | The above, plus a line per component captured or applied, path resolution, probes, and which converters and migrations were registered. |
| **Off** | Nothing at all, not even errors. |

Moving the dropdown **while the game is playing** takes effect immediately: no restart, no rebuild. That is
the point of it — a bug reproduces, you switch to Verbose, you reproduce it again with the detail on.

The manager sets one global switch, so the mode you pick governs the whole save system, including code that
calls `BeastySave` directly. With no manager in the scene, `Auto` is what you get.

## What it looks like

At **On**:

![What the save system's logs look like in the console](/docs-images/beasty-save-system/save-logging-output.png)

```
[BeastySave] Saved 'slot1' — 4.2 KB, 8 ms, 12 saveables
[BeastySave] Loaded 'slot1' — 6 ms, 12 saveables
[BeastySave] Migrated 'slot1' data v1 → v2
[BeastySave] Deleted 'slot1'
[BeastySave] Restored 'slot1' from backup — 3 ms
```

Plus the warnings and errors that were always there: a load that failed, a field skipped by a tolerant
load, a saveable id used twice, and the one that matters most —

```
[BeastySave] 'slot1' failed its checksum; backup NOT rotated (any existing .bak is left untouched).
```

That line means the slot on disk is damaged and the system refused to push it over the `.bak`. The player
is one save away from losing their game and the backup is the only copy left. Offer them
`BeastySave.RestoreBackup`; see [backups-and-corruption.md](/docs/beasty-save-system/guides/backups-and-corruption/).

At **Verbose**, add the detail:

```
[BeastySave]   Player/Transform captured
[BeastySave]   Chest_02/Health captured
[BeastySave] Save 'slot1' — encryption on, backup on, data version 2
[BeastySave] Exists 'slot1' → True
```

Every line carries the `[BeastySave]` tag, so you can filter the console by it.

## From code

The toggle is a front end for `BeastySaveLog`, which is public:

```csharp
using Beasty_SaveSystemCore;

BeastySaveLog.Level = BeastySaveLogLevel.Verbose;   // Off, Normal, Verbose
BeastySaveLog.Level = BeastySaveLog.DefaultLevel;   // back to what Auto does
```

`BeastySaveLog.EnableLogs` is still there and still works: `false` is `Off`, `true` is `Normal`.

Set the level from code and the manager will overwrite it the next time its `OnEnable` or `OnValidate`
runs — entering Play mode, or you touching its inspector. If you want code to own the level, set the
manager to the mode you want and leave it alone.

## Sending the logs somewhere else

Assign a sink and every line goes wherever you want — your own console, a file, a bug reporter:

```csharp
public sealed class FileSink : IBeastySaveLogSink
{
    public void Info(string message) => File.AppendAllText("save.log", message + "\n");
    public void Warning(string message) => Info("WARN " + message);
    public void Error(string message) => Info("ERROR " + message);
}

BeastySaveLog.Sink = new FileSink();
```

Verbose lines arrive at your sink through `Info`.

With no sink assigned, the first log line picks one: the **Beasty Console** asset if it is in the
project (detected by reflection — the two assets ship independently, neither needs the other), and
`UnityEngine.Debug` otherwise.

## Performance

Logging costs nothing measurable at `Auto` in a release build: the level is `Off` and every call returns
before it touches a sink. The per-component Verbose lines are guarded so they do not even build their
message unless Verbose is on.

## See also

- [Backups and corruption](/docs/beasty-save-system/guides/backups-and-corruption/) — the checksum warning above, and what to do about it
- [Components](/docs/beasty-save-system/reference/components/) — `BeastySaveManager`, the component that hosts the Logging dropdown
- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/) — the error codes behind the messages
- [Troubleshooting](/docs/beasty-save-system/troubleshooting/)
