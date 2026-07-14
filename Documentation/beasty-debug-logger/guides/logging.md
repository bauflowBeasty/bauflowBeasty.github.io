# Logging

How to call the API, and — the part that matters — which level to pick, so that the levels still mean
something six months into a project.

## The call

Everything is on one static class. Add the namespace once per file:

```csharp
using BeastyDebugLoggerConsole;

BeastyDebugLogger.LogInfo("Scene initialization complete.");
```

Every level method takes the same three arguments: the message, an optional `canPrint` flag, and an
optional `context` object.

```csharp
BeastyDebugLogger.LogWarning("Missing AudioClip on SoundManager.", true, gameObject);
```

## The levels, and when to use each one

Pick the level from the reader's point of view: what does someone scanning the console need this line to
tell them?

**`Log`** — no level, no tag. A message you did not classify.

```csharp
BeastyDebugLogger.Log("Reached the end of the tutorial.");
```

**`LogInfo`** — the normal state of the world. Something completed, and everything is fine. Use it for the
events you would want to see in a clean run: a scene loaded, a config was read, a player connected.

```csharp
BeastyDebugLogger.LogInfo("Config file loaded.");
```

**`LogVerbose`** — the detail behind an info line. The same event, but with the payload. Use it when the
info line says "player data serialized" and you sometimes need to see what was in it.

```csharp
BeastyDebugLogger.LogVerbose("Serializing player data: { id=42, level=7 }");
```

**`LogTrace`** — control flow. Which method was entered, which coroutine started, which state the machine
moved to. Use it when the bug is "it never got there", not "the value was wrong".

```csharp
BeastyDebugLogger.LogTrace("EnterState() called on StateMachine.");
```

**`LogDebug`** — values. The contents of a variable at a moment you care about. This is the level you spam
while hunting a bug and turn off afterwards.

```csharp
BeastyDebugLogger.LogDebug("Inventory slots: 24, used: 7");
```

**`LogNotice`** — an event that is not a problem but that you do not want to scroll past. A milestone: a
level cap reached, an achievement unlocked, a new high score.

```csharp
BeastyDebugLogger.LogNotice("Player reached level cap (50).");
```

**`LogHighlight`** — visual emphasis, nothing more. Use it to make one line stand out in a long run: the
moment a boss fight begins, the branch a playtest took.

```csharp
BeastyDebugLogger.LogHighlight("Cutscene triggered: Ending A");
```

**`LogCaution`** — a soft alert. Something is not right, but nothing broke: a frame took too long, memory
is climbing, an asset was not cached and had to be downloaded. Use it for the things you want to notice
without treating them as warnings.

```csharp
BeastyDebugLogger.LogCaution("Frame budget exceeded: 18ms (target 16ms).");
```

**`LogSuccess`** — the confirmation at the end of an operation that could have failed. A save was written,
a handshake completed, a build step passed.

```csharp
BeastyDebugLogger.LogSuccess("Save file written.");
```

**`LogWarning`** — something is wrong and a human should look at it, but the game keeps running. A missing
reference, a deprecated call, a config key that fell back to a default.

```csharp
BeastyDebugLogger.LogWarning("Config key 'volume' not found, using default.");
```

**`LogError`** — an operation failed. The save did not load, the request timed out. The game may continue,
but something the player asked for did not happen.

```csharp
BeastyDebugLogger.LogError("Failed to load save slot 2: file corrupted.");
```

**`LogException`** — you caught an exception and want the stack trace. This one takes an `Exception`, not a
string.

```csharp
try { LoadProfile(); }
catch (System.Exception e) { BeastyDebugLogger.LogException(e); }
```

## Only three levels raise Unity's severity

State this to yourself before you build a habit around `LogCaution`:

> **Warning**
> Only `LogWarning`, `LogError` and `LogException` raise Unity's severity. Everything else — including
> `LogCaution` — is a normal `Debug.Log`.

`LogCaution` is a *soft* alert. It is coloured, it is tagged, and the Beasty Console gives it its own
filter and counter. But to Unity it is an ordinary log, so:

- it does not trip Error Pause;
- it does not show as a warning in Unity's own Console;
- it does not fail a build.

If you need Unity to treat the message as a warning, call `LogWarning`.

## The context object

The third argument is a `UnityEngine.Object`. Pass one and the log entry becomes clickable: selecting it
pings the object in the Hierarchy, so you go from a line of text to the exact GameObject that produced it.

```csharp
BeastyDebugLogger.LogError("No collider on this interactable.", true, gameObject);
```

Pass the component (`this`) or the GameObject — anything that derives from `UnityEngine.Object`.

## The canPrint flag

`canPrint: false` silences one call without touching the master switch. Use it for a log that belongs to a
system with its own debug flag:

```csharp
public bool debugPathfinding;

BeastyDebugLogger.LogTrace($"Path recalculated: {node.name}", debugPathfinding);
```

The line prints only when `debugPathfinding` is true. This is a per-call filter; the master switch
`IsEnabled` is separate, and it silences everything. See [Release builds](release-builds.md).

> **Note**
> `canPrint` is checked inside the method, so the string is still built before the call. If the message is
> expensive to construct, guard the call site with an `if` instead.

## Colour without a level

The second `Log` overload takes a `LogColor` and colours the message without adopting any level's tag:

```csharp
BeastyDebugLogger.Log("Wave 4 spawned.", BeastyDebugLogger.LogColor.Notice);
```

The values are `Default`, `Info`, `Verbose`, `Trace`, `Debug`, `Notice`, `Highlight`, `Caution`, `Success`
and `Plain`. Colour is applied in the editor only; a build logs plain text.

## Very long messages

Unity's console truncates a very long line, which makes it useless for dumping a JSON payload or a save
file. `PrintLongMessage` splits the string into chunks and logs each one separately, prefixed with its
offset and an optional label:

```csharp
BeastyDebugLogger.PrintLongMessage(json, 4000, true, "save-slot-1");
```

> **Warning**
> `chunkSize` must be greater than zero. Passing 0 or a negative number hangs the editor: the loop that
> walks the string never advances.

## Emoji in the editor, ASCII in a build

The same call produces a different tag depending on where it runs. In the editor, `LogInfo` prefixes the
message with an emoji glyph and wraps it in a rich-text colour tag. In a build, it prefixes `[INFO]` and
adds no colour.

That is deliberate. The Beasty Console classifies an entry by the glyph or colour that opens it, and that
window only exists in the editor. A player's `Player.log` is a plain text file, opened in a plain text
editor — an emoji there is mojibake, and a rich-text tag is noise. So a build tags its lines in ASCII.

The full mapping is in the [API reference](../reference/api.md).

## See also

- [The Beasty Console window](console-window.md)
- [Release builds](release-builds.md)
- [API reference](../reference/api.md)
