---
title: "Logging"
description: "El desplegable Logging de BeastySaveManager: qué imprime cada modo, cómo mandar las líneas a tu propio sink y qué cuesta el logging en una build de release."
---

El save system te cuenta lo que hizo. Por defecto lo hace en el editor y en las builds de desarrollo, y se
calla en una build de release: un juego publicado no debería escribir una línea en `player.log` cada vez
que autoguarda.

## El interruptor

Selecciona tu `BeastySaveManager` y mira **Logging**.

![El desplegable Logging](/docs-images/beasty-save-system/save-manager-logging.png)

| Modo | Qué obtienes |
|---|---|
| **Auto** (por defecto) | Activo en el editor y en builds de desarrollo, apagado en builds de release. |
| **On** | Cada guardado, carga, borrado y restauración, en todas las builds. |
| **Verbose** | Lo anterior, más una línea por componente capturado o aplicado, la resolución de rutas, los sondeos, y qué convertidores y migraciones se registraron. |
| **Off** | Nada de nada, ni siquiera los errores. |

Mover el desplegable **con el juego en marcha** surte efecto al momento: sin reiniciar, sin recompilar. Ese
es justo el objetivo — un bug se reproduce, cambias a Verbose y lo reproduces otra vez con el detalle puesto.

El manager acciona un único interruptor global, así que el modo que elijas gobierna todo el save system,
incluido el código que llama a `BeastySave` directamente. Si no hay manager en la escena, lo que tienes es
`Auto`.

## Qué pinta tiene

En **On**:

![Qué aspecto tienen en la consola los logs del sistema de guardado](/docs-images/beasty-save-system/save-logging-output.png)

```
[BeastySave] Saved 'slot1' — 4.2 KB, 8 ms, 12 saveables
[BeastySave] Loaded 'slot1' — 6 ms, 12 saveables
[BeastySave] Migrated 'slot1' data v1 → v2
[BeastySave] Deleted 'slot1'
[BeastySave] Restored 'slot1' from backup — 3 ms
```

Más los avisos y errores que siempre estuvieron ahí: una carga que falló, un campo omitido por una carga
tolerante, un id de saveable usado dos veces, y el que más importa —

```
[BeastySave] 'slot1' failed its checksum; backup NOT rotated (any existing .bak is left untouched).
```

Esa línea significa que el slot en disco está dañado y que el sistema se negó a machacar con él el `.bak`.
Al jugador le queda un guardado para perder su partida y la copia de seguridad es lo único que le queda.
Ofrécele `BeastySave.RestoreBackup`; consulta [backups-and-corruption.md](/es/docs/beasty-save-system/guides/backups-and-corruption/).

En **Verbose**, súmale el detalle:

```
[BeastySave]   Player/Transform captured
[BeastySave]   Chest_02/Health captured
[BeastySave] Save 'slot1' — encryption on, backup on, data version 2
[BeastySave] Exists 'slot1' → True
```

Todas las líneas llevan la etiqueta `[BeastySave]`, así que puedes filtrar la consola por ella.

## Desde código

El desplegable es una fachada para `BeastySaveLog`, que es público:

```csharp
using Beasty_SaveSystemCore;

BeastySaveLog.Level = BeastySaveLogLevel.Verbose;   // Off, Normal, Verbose
BeastySaveLog.Level = BeastySaveLog.DefaultLevel;   // vuelve a lo que hace Auto
```

`BeastySaveLog.EnableLogs` sigue ahí y sigue funcionando: `false` es `Off`, `true` es `Normal`.

Si fijas el nivel desde código, el manager lo sobrescribirá la próxima vez que se ejecute su `OnEnable` o su
`OnValidate` — al entrar en modo Play, o al tocar tú su inspector. Si quieres que el nivel lo controle el
código, deja el manager en el modo que quieras y no lo toques más.

## Mandar los logs a otro sitio

Asigna un sink y cada línea se va a donde tú quieras — tu propia consola, un archivo, un reportador de bugs:

```csharp
public sealed class FileSink : IBeastySaveLogSink
{
    public void Info(string message) => File.AppendAllText("save.log", message + "\n");
    public void Warning(string message) => Info("WARN " + message);
    public void Error(string message) => Info("ERROR " + message);
}

BeastySaveLog.Sink = new FileSink();
```

Las líneas de Verbose llegan a tu sink a través de `Info`.

Si no hay sink asignado, la primera línea de log elige uno: el asset **Beasty Console** si está en el
proyecto (lo detecta por reflexión — los dos assets se distribuyen por separado y ninguno necesita al otro),
y `UnityEngine.Debug` en caso contrario.

## Rendimiento

El logging no cuesta nada medible en `Auto` dentro de una build de release: el nivel es `Off` y cada llamada
retorna antes de tocar un sink. Las líneas Verbose por componente están protegidas para que ni siquiera
construyan su mensaje a menos que Verbose esté activo.

## Ver también

- [Copias de seguridad y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/) — el aviso del checksum de arriba, y qué hacer al respecto
- [Componentes](/es/docs/beasty-save-system/reference/components/) — `BeastySaveManager`, el componente que aloja el desplegable Logging
- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) — los códigos de error detrás de los mensajes
- [Solución de problemas](/es/docs/beasty-save-system/troubleshooting/)
