---
title: "Working with the other Beasty packages"
description: "How Beasty Visual Novel and Beasty Save System use this logger. Read this if you own more than one of them; if you own only the logger, you can skip it."
---

How Beasty Visual Novel and Beasty Save System use this logger. Read this if you own more than one of them;
if you own only the logger, you can skip it.

Each package is sold and imported on its own, and each works on its own. Nothing here is a dependency you
have to satisfy.

## Beasty Visual Novel

[Beasty Visual Novel](/docs/beasty-visual-novel/) logs through its own facade, `VNLog` — a thin wrapper
class that forwards every message to whichever logger it finds. `VNLog` looks this logger up by
reflection — by class name at runtime, without referencing the assembly — the same way the save system
does, and falls back to `UnityEngine.Debug` when the console is not in the project. The facade adds
three things on top of the API:

![The console filled with Beasty VN logs, tagged by category](/docs-images/beasty-console/log-vn-categories.png)

- a `[BeastyVN]` tag on every message, so you can find them with the console's search field;
- per-system channels — data, director, stage, streaming, save and verbose — each with its own switch, so
  you can silence a noisy area without touching call sites;
- its own master switch, which is on in the editor and in a development build, and **off in a release build
  by default**. A shipped novel does not write a line for every dialogue line the player advances.

`VNLog` sits on top of `BeastyConsole`, so `IsEnabled` still applies: switching the logger off silences
the VN too.

The VN package bundles a full copy of this one, so the console is already there when you import it. Delete
it and the VN keeps compiling and running — its logs simply go to Unity's Console instead.

## Beasty Save System

[Beasty Save System](/docs/beasty-save-system/) does **not** reference this logger either. It looks for it
by reflection when it first logs something:

- if the logger is in your project, the save system routes its messages through it, and they arrive in the
  Beasty Console classified and coloured;
- if it is not, the save system logs through `UnityEngine.Debug`.

That is why both assets ship independently. You never have to install one to use the other.

> **Warning**
> One consequence to know about. With the logger present, the save system's warnings are routed to
> `LogCaution` — which is a soft alert and, to Unity, a **normal log**. So save-system warnings stop
> appearing as warnings in Unity's own Console, and they do not trip Error Pause. They are still there,
> under the Caution filter in the Beasty Console. Errors are unaffected: they remain Unity errors.

If you would rather keep the save system's warnings as Unity warnings, assign your own log sink: implement
`IBeastySaveLogSink` and set `BeastySaveLog.Sink`, a static field on the save system's logging facade.
Assign it at runtime — the field resets on every Play.

## See also

- [Logging](/docs/beasty-console/guides/logging/)
- [The Beasty Console window](/docs/beasty-console/guides/console-window/)
- [Beasty Visual Novel](/docs/beasty-visual-novel/)
- [Beasty Save System](/docs/beasty-save-system/)
