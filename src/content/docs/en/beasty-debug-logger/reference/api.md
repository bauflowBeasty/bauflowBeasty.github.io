---
title: "API reference"
description: "Every public member of BeastyDebugLoggerConsole.BeastyDebugLogger. The class is static. Object is UnityEngine.Object."
---

Every public member of `BeastyDebugLoggerConsole.BeastyDebugLogger`. The class is static. `Object` is
`UnityEngine.Object`.

Assembly: `Beasty.DebugLogger` (runtime, all platforms). It references nothing.

## Fields

```csharp
public static bool IsEnabled = true;
```

Master switch. When false, no method produces output. Reset to `true` on runtime initialization, so it
must be set after startup. See [Release builds](/docs/beasty-debug-logger/guides/release-builds/).

## Methods

```csharp
public static void Log        (string message, bool canPrint = true, Object context = null);
public static void Log        (string message, LogColor color, bool canPrint = true, Object context = null);

public static void LogInfo     (string message, bool canPrint = true, Object context = null);
public static void LogVerbose  (string message, bool canPrint = true, Object context = null);
public static void LogTrace    (string message, bool canPrint = true, Object context = null);
public static void LogDebug    (string message, bool canPrint = true, Object context = null);
public static void LogNotice   (string message, bool canPrint = true, Object context = null);
public static void LogHighlight(string message, bool canPrint = true, Object context = null);
public static void LogCaution  (string message, bool canPrint = true, Object context = null);
public static void LogSuccess  (string message, bool canPrint = true, Object context = null);
public static void LogWarning  (string message, bool canPrint = true, Object context = null);
public static void LogError    (string message, bool canPrint = true, Object context = null);
public static void LogException(System.Exception e, bool canPrint = true, Object context = null);

public static void PrintLongMessage(string message, int chunkSize = 9999, bool canPrint = true,
                                    string label = "");
```

Parameters, on every method:

- `canPrint` — pass false to silence this one call. Evaluated at the call site; it does not prevent the
  message from being built.
- `context` — a `UnityEngine.Object`. The entry becomes clickable and pings the object in the Hierarchy.

`PrintLongMessage` splits `message` into chunks of `chunkSize` characters and logs each one at the
Highlight level, prefixed with its offset and `label`. `chunkSize` must be greater than 0; 0 or a negative
value hangs. A null or empty `message` logs a warning and returns.

## LogColor

```csharp
public enum BeastyDebugLogger.LogColor
{
    Default, Info, Verbose, Trace, Debug, Notice, Highlight, Caution, Success, Plain
}
```

Passed to the second `Log` overload to colour a message without adopting a level's tag. Colour is applied
in the editor only; a build logs plain text.

## Levels

| Method | Editor tag | Build tag | Unity severity |
|---|---|---|---|
| `LogInfo` | ℹ️ | `[INFO]` | Log |
| `LogVerbose` | 🔵 | `[VERBOSE]` | Log |
| `LogTrace` | 🔍 | `[TRACE]` | Log |
| `LogDebug` | 🐛 | `[DEBUG]` | Log |
| `LogNotice` | 📌 | `[NOTICE]` | Log |
| `LogHighlight` | ✨ | `[HIGHLIGHT]` | Log |
| `LogCaution` | ⚡ | `[CAUTION]` | Log |
| `LogSuccess` | ✅ | `[OK]` | Log |
| `LogWarning` | ⚠️ | `[WARNING]` | **Warning** |
| `LogError` | ❌ | `[ERROR]` | **Error** |
| `LogException` | none | none | **Exception** |
| `Log` | none | none | Log |

Only `LogWarning`, `LogError` and `LogException` raise Unity's severity. `LogCaution` is a soft alert and a
normal log: it does not trip Error Pause and it does not appear as a warning in Unity's Console.

The editor tag is an emoji because the Beasty Console classifies an entry by the glyph that opens it. A
build tags in ASCII because `Player.log` is a plain text file.

## Editor window

`Tools > Beasty VN > Diagnostics > Console`. Assembly: `Beasty.DebugLogger.Editor`. See
[The Beasty Console window](/docs/beasty-debug-logger/guides/console-window/).

## See also

- [Logging](/docs/beasty-debug-logger/guides/logging/)
- [Release builds](/docs/beasty-debug-logger/guides/release-builds/)
