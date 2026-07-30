---
title: "Referencia de la API"
description: "Cada miembro público de BeastyConsoleLogger.BeastyConsole: el interruptor IsEnabled, los métodos de nivel, PrintLongMessage, LogColor y las etiquetas."
---

Todos los miembros públicos de `BeastyConsoleLogger.BeastyConsole`. La clase es estática. `Object`
es `UnityEngine.Object`.

Assembly: `Beasty.Console` (runtime, todas las plataformas). No referencia nada.

## Campos

```csharp
public static bool IsEnabled = true;
```

Interruptor maestro. Cuando es false, ningún método produce salida. Se restablece a `true` en la
inicialización en tiempo de ejecución, así que debe configurarse después del arranque. Consulta
[Builds de lanzamiento](/es/docs/beasty-console/guides/release-builds/).

## Métodos

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

Parámetros comunes a todos los métodos:

- `canPrint` — pasa false para silenciar esta llamada en particular. Se evalúa en el sitio de la llamada;
  no evita que el mensaje se construya.
- `context` — un `UnityEngine.Object`. La entrada se vuelve clicable y resalta (ping) el objeto en la
  Jerarquía.

`PrintLongMessage` divide `message` en fragmentos de `chunkSize` caracteres y loguea cada uno en el nivel
Highlight, cada uno con el prefijo de su offset y `label`. `chunkSize` debe ser mayor que 0; 0 o un valor
negativo cuelga el editor. Un `message` nulo o vacío loguea una advertencia y no hace nada más.

## LogColor

```csharp
public enum BeastyConsole.LogColor
{
    Default, Info, Verbose, Trace, Debug, Notice, Highlight, Caution, Success, Plain
}
```

Se pasa a la segunda sobrecarga de `Log` para colorear un mensaje sin adoptar la etiqueta de un nivel. El
color se aplica solo en el editor; una build loguea texto plano.

## Niveles

| Método | Etiqueta en editor | Etiqueta en build | Severidad de Unity |
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
| `LogException` | ninguna | ninguna | **Exception** |
| `Log` | ninguna | ninguna | Log |

Solo `LogWarning`, `LogError` y `LogException` elevan la severidad de Unity. `LogCaution` es una alerta
suave y un log normal: no dispara Error Pause y no aparece como una advertencia en la Consola de Unity.

La etiqueta del editor es un emoji porque la Beasty Console clasifica una entrada por el glifo que la abre.
Una build etiqueta en ASCII porque `Player.log` es un archivo de texto plano.

## Ventana de editor

`Tools > Beasty Console > Console`. Assembly: `Beasty.Console.Editor`. Consulta
[La ventana Beasty Console](/es/docs/beasty-console/guides/console-window/).

## Ver también

- [Logging](/es/docs/beasty-console/guides/logging/)
- [Builds de lanzamiento](/es/docs/beasty-console/guides/release-builds/)
