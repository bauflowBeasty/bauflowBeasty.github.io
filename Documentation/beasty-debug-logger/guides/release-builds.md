# Release builds

What logging costs you in a shipped game, and what the master switch does and does not do. Read this page
before you scatter a thousand log calls through your project.

## The master switch

```csharp
BeastyDebugLogger.IsEnabled = false;
```

That silences every level at runtime. No level prints anything while it is false, including warnings,
errors and exceptions.

## What it does not do

> **Warning**
> The logging methods are **not stripped** from a release build. There is no `[Conditional]` attribute on
> them. Setting `IsEnabled = false` stops the output; it does not remove the call.

Two consequences, and both of them bite.

**1. The argument is built before the switch is read.** This line still allocates a string and still calls
the method on every frame, even with `IsEnabled` false:

```csharp
// The interpolated string is constructed BEFORE IsEnabled is checked.
BeastyDebugLogger.LogTrace($"Path recalculated for {agent.name}, {path.corners.Length} corners");
```

The same is true of `canPrint`: it is a parameter, so it is evaluated at the call site, and the message is
already built by the time the method looks at it. `canPrint` filters output; it does not save you the cost
of producing the message.

**2. `IsEnabled` is reset to `true` at the start of every run.** The package resets it during Unity's
runtime initialization, so it goes back to `true` every time you enter Play Mode, and again every time a
build starts. You cannot switch it off from an editor script, or from a previous session, and expect it to
stick.

## What to do instead

**Set it from a bootstrap script, at startup.** Put this on an object in your first scene, or in a
`RuntimeInitializeOnLoadMethod`, so it runs after the reset:

```csharp
using UnityEngine;
using BeastyDebugLoggerConsole;

public class LoggingBootstrap : MonoBehaviour
{
    private void Awake()
    {
#if !UNITY_EDITOR && !DEVELOPMENT_BUILD
        BeastyDebugLogger.IsEnabled = false;
#endif
    }
}
```

**Guard expensive messages yourself.** If building the message costs anything — string interpolation in a
hot loop, a `ToString()` over a big structure, a LINQ query — wrap the call:

```csharp
if (debugPathfinding)
    BeastyDebugLogger.LogTrace($"Path: {string.Join(" -> ", path.corners)}");
```

A constant string is cheap. A computed one is not, and no switch inside the method can undo work already
done outside it.

**Use `canPrint` for per-system switches, not for performance.** It is the right tool for "only print this
when the pathfinding debug flag is on", and it keeps the call site to one line. It is the wrong tool for
"this must cost nothing in a release build". See [Logging](logging.md).

**Or compile them out.** If a system's logs must not exist in a release build at all, put the calls behind
your own `#if DEVELOPMENT_BUILD || UNITY_EDITOR` blocks. That is the only thing that truly removes them.

## The package never writes a file

Beasty Debug Logger does not open a file, does not rotate a log, and does not upload anything. It calls
`UnityEngine.Debug`. Persistence is whatever Unity already gives you: on a desktop build, that is
`Player.log`. If you need a log file of your own, write one from your own code.

This is also why a build tags its lines in ASCII rather than emoji — `Player.log` is read as plain text.
See [Logging](logging.md).

## See also

- [Logging](logging.md)
- [API reference](../reference/api.md)
- [FAQ](../faq.md)
