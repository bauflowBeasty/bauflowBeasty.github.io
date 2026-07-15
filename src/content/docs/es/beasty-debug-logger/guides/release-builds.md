---
title: "Builds de lanzamiento"
description: "Lo que te cuesta el logging en un juego lanzado, y qué hace y qué no hace el interruptor maestro. Lee esta página antes de esparcir mil llamadas de log por tu proyecto."
---

Lo que te cuesta el logging en un juego lanzado, y qué hace y qué no hace el interruptor maestro. Lee esta
página antes de esparcir mil llamadas de log por tu proyecto.

## El interruptor maestro

```csharp
BeastyDebugLogger.IsEnabled = false;
```

Eso silencia todos los niveles en tiempo de ejecución. Ningún nivel imprime nada mientras esté en false,
incluidos warnings, errors y exceptions.

## Lo que no hace

> **Advertencia**
> Los métodos de logging **no se eliminan (stripped)** de una build de lanzamiento. No hay un atributo
> `[Conditional]` en ellos. Poner `IsEnabled = false` detiene la salida; no elimina la llamada.

Dos consecuencias, y ambas duelen.

**1. El argumento se construye antes de que se lea el interruptor.** Esta línea sigue asignando un string y
sigue llamando al método en cada frame, incluso con `IsEnabled` en false:

```csharp
// El string interpolado se construye ANTES de verificar IsEnabled.
BeastyDebugLogger.LogTrace($"Path recalculated for {agent.name}, {path.corners.Length} corners");
```

Lo mismo aplica para `canPrint`: es un parámetro, así que se evalúa en el sitio de la llamada, y el mensaje
ya está construido para cuando el método lo revisa. `canPrint` filtra la salida; no te ahorra el costo de
producir el mensaje.

**2. `IsEnabled` se restablece a `true` al inicio de cada ejecución.** El paquete lo restablece durante la
inicialización en tiempo de ejecución de Unity, así que vuelve a `true` cada vez que entras en Play Mode, y
de nuevo cada vez que arranca una build. No puedes apagarlo desde un script de editor, o desde una sesión
anterior, y esperar que se quede así.

## Qué hacer entonces

**Configúralo desde un script de arranque (bootstrap), al inicio.** Ponlo en un objeto de tu primera
escena, o en un `RuntimeInitializeOnLoadMethod`, para que corra después del reinicio:

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

**Protege tú mismo los mensajes costosos.** Si construir el mensaje cuesta algo — interpolación de strings
en un bucle crítico (hot loop), un `ToString()` sobre una estructura grande, una consulta LINQ — envuelve la
llamada:

```csharp
if (debugPathfinding)
    BeastyDebugLogger.LogTrace($"Path: {string.Join(" -> ", path.corners)}");
```

Un string constante es barato. Uno calculado no lo es, y ningún interruptor dentro del método puede deshacer
un trabajo que ya se hizo fuera de él.

**Usa `canPrint` para interruptores por sistema, no para rendimiento.** Es la herramienta correcta para
"solo imprimir esto cuando el flag de debug de pathfinding está activo", y mantiene el sitio de la llamada
en una línea. Es la herramienta incorrecta para "esto no debe costar nada en una build de lanzamiento".
Consulta [Logging](/es/docs/beasty-debug-logger/guides/logging/).

**O elimínalos al compilar.** Si los logs de un sistema no deben existir en absoluto en una build de
lanzamiento, pon las llamadas detrás de tus propios bloques `#if DEVELOPMENT_BUILD || UNITY_EDITOR`. Eso es
lo único que realmente los elimina.

## El paquete nunca escribe un archivo

Beasty Debug Logger no abre archivos, no rota logs y no sube nada. Llama a `UnityEngine.Debug`. La
persistencia es la que Unity ya te da: en una build de escritorio, eso es `Player.log`. Si necesitas tu
propio archivo de log, escríbelo desde tu propio código.

Por eso también una build etiqueta sus líneas en ASCII en lugar de emoji — `Player.log` se lee como texto
plano. Consulta [Logging](/es/docs/beasty-debug-logger/guides/logging/).

## Ver también

- [Logging](/es/docs/beasty-debug-logger/guides/logging/)
- [Referencia de la API](/es/docs/beasty-debug-logger/reference/api/)
- [Preguntas frecuentes](/es/docs/beasty-debug-logger/faq/)
