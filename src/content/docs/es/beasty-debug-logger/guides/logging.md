---
title: "Logging"
description: "Cómo llamar a la API y — la parte que importa — qué nivel elegir, para que los niveles sigan significando algo a los seis meses de proyecto."
---

Cómo llamar a la API y — la parte que importa — qué nivel elegir, para que los niveles sigan significando
algo a los seis meses de proyecto.

## La llamada

Todo está en una sola clase estática. Agrega el namespace una vez por archivo:

```csharp
using BeastyDebugLoggerConsole;

BeastyDebugLogger.LogInfo("Scene initialization complete.");
```

Cada método de nivel recibe los mismos tres argumentos: el mensaje, un flag opcional `canPrint`, y un objeto
opcional `context`.

```csharp
BeastyDebugLogger.LogWarning("Missing AudioClip on SoundManager.", true, gameObject);
```

## Los niveles, y cuándo usar cada uno

Elige el nivel desde el punto de vista del lector: ¿qué necesita saber de esta línea alguien que está
revisando la consola?

**`Log`** — sin nivel, sin etiqueta. Un mensaje que no clasificaste.

```csharp
BeastyDebugLogger.Log("Reached the end of the tutorial.");
```

**`LogInfo`** — el estado normal del mundo. Algo se completó, y todo está bien. Úsalo para los eventos que
querrías ver en una ejecución limpia: una escena cargada, una config leída, un jugador conectado.

```csharp
BeastyDebugLogger.LogInfo("Config file loaded.");
```

**`LogVerbose`** — el detalle detrás de una línea de info. El mismo evento, pero con el payload. Úsalo
cuando la línea de info dice "player data serialized" y a veces necesitas ver qué contenía.

```csharp
BeastyDebugLogger.LogVerbose("Serializing player data: { id=42, level=7 }");
```

**`LogTrace`** — flujo de control. Qué método se ejecutó, qué corrutina arrancó, a qué estado pasó la
máquina. Úsalo cuando el bug es "nunca llegó ahí", no "el valor estaba mal".

```csharp
BeastyDebugLogger.LogTrace("EnterState() called on StateMachine.");
```

**`LogDebug`** — valores. El contenido de una variable en un momento que te importa. Este es el nivel que
usas sin parar mientras cazas un bug y que apagas después.

```csharp
BeastyDebugLogger.LogDebug("Inventory slots: 24, used: 7");
```

**`LogNotice`** — un evento que no es un problema, pero que tampoco quieres que se te escape. Un hito: se
alcanzó el límite de nivel, se desbloqueó un logro, un nuevo puntaje máximo.

```csharp
BeastyDebugLogger.LogNotice("Player reached level cap (50).");
```

**`LogHighlight`** — énfasis visual, nada más. Úsalo para que una línea resalte en una ejecución larga: el
momento en que empieza una pelea contra un jefe, la rama que tomó un playtest.

```csharp
BeastyDebugLogger.LogHighlight("Cutscene triggered: Ending A");
```

**`LogCaution`** — una alerta suave. Algo no está bien, pero nada se rompió: un frame tardó demasiado, la
memoria está subiendo, un asset no estaba en caché y hubo que descargarlo. Úsalo para las cosas que quieres
notar sin tratarlas como advertencias.

```csharp
BeastyDebugLogger.LogCaution("Frame budget exceeded: 18ms (target 16ms).");
```

**`LogSuccess`** — la confirmación al final de una operación que podía haber fallado. Se escribió un save,
se completó un handshake, un paso del build terminó bien.

```csharp
BeastyDebugLogger.LogSuccess("Save file written.");
```

**`LogWarning`** — algo está mal y alguien debería revisarlo, pero el juego sigue funcionando. Una
referencia faltante, una llamada obsoleta, una clave de config que terminó usando su valor por defecto.

```csharp
BeastyDebugLogger.LogWarning("Config key 'volume' not found, using default.");
```

**`LogError`** — una operación falló. El save no cargó, el request expiró (timeout). El juego puede
continuar, pero algo que el jugador pidió no ocurrió.

```csharp
BeastyDebugLogger.LogError("Failed to load save slot 2: file corrupted.");
```

**`LogException`** — capturaste una excepción y quieres el stack trace. Este método recibe una `Exception`,
no un string.

```csharp
try { LoadProfile(); }
catch (System.Exception e) { BeastyDebugLogger.LogException(e); }
```

## Solo tres niveles elevan la severidad de Unity

Tenlo presente antes de acostumbrarte a usar `LogCaution`:

> **Advertencia**
> Solo `LogWarning`, `LogError` y `LogException` elevan la severidad de Unity. Todo lo demás — incluyendo
> `LogCaution` — es un `Debug.Log` normal.

`LogCaution` es una alerta *suave*. Tiene su color, tiene su etiqueta, y la Beasty Console le da su propio
filtro y contador. Pero para Unity es un log ordinario, así que:

- no dispara Error Pause;
- no aparece como una advertencia en la propia Consola de Unity;
- no hace fallar una build.

Si necesitas que Unity trate el mensaje como una advertencia, llama a `LogWarning`.

## El objeto context

El tercer argumento es un `UnityEngine.Object`. Pasa uno y la entrada de log se vuelve clicable: al
seleccionarla resalta (ping) el objeto en la Jerarquía, así que pasas de una línea de texto al GameObject
exacto que la produjo.

```csharp
BeastyDebugLogger.LogError("No collider on this interactable.", true, gameObject);
```

Pasa el componente (`this`) o el GameObject — cualquier cosa que derive de `UnityEngine.Object`.

## El flag canPrint

`canPrint: false` silencia una llamada sin tocar el interruptor maestro. Úsalo para un log que pertenece a
un sistema con su propio flag de debug:

```csharp
public bool debugPathfinding;

BeastyDebugLogger.LogTrace($"Path recalculated: {node.name}", debugPathfinding);
```

La línea se imprime solo cuando `debugPathfinding` es true. Es un filtro por llamada; el interruptor
maestro `IsEnabled` va aparte, y silencia todo. Consulta [Builds de lanzamiento](/es/docs/beasty-debug-logger/guides/release-builds/).

> **Nota**
> `canPrint` se verifica dentro del método, así que el string igual se construye antes de la llamada. Si el
> mensaje es costoso de construir, mejor protege la llamada con un `if`.

## Color sin un nivel

La segunda sobrecarga de `Log` recibe un `LogColor` y colorea el mensaje sin adoptar la etiqueta de ningún
nivel:

```csharp
BeastyDebugLogger.Log("Wave 4 spawned.", BeastyDebugLogger.LogColor.Notice);
```

Los valores son `Default`, `Info`, `Verbose`, `Trace`, `Debug`, `Notice`, `Highlight`, `Caution`, `Success`
y `Plain`. El color se aplica solo en el editor; una build loguea texto plano.

## Mensajes muy largos

La consola de Unity trunca una línea muy larga, lo que la vuelve inútil para volcar un payload JSON o un
archivo de save. `PrintLongMessage` divide el string en fragmentos y loguea cada uno por separado, cada
fragmento con el prefijo de su offset y una etiqueta opcional:

```csharp
BeastyDebugLogger.PrintLongMessage(json, 4000, true, "save-slot-1");
```

> **Advertencia**
> `chunkSize` debe ser mayor que cero. Pasar 0 o un número negativo cuelga el editor: el loop que recorre el
> string nunca avanza.

## Emoji en el editor, ASCII en una build

La misma llamada produce una etiqueta distinta según dónde se ejecute. En el editor, `LogInfo` antepone al
mensaje un glifo emoji y lo envuelve en una etiqueta de color rich-text. En una build, antepone `[INFO]` y
no agrega color.

Eso es deliberado. La Beasty Console clasifica una entrada por el glifo o color que la abre, y esa ventana
solo existe en el editor. El `Player.log` de un jugador es un archivo de texto plano, abierto en un editor
de texto plano — un emoji ahí es mojibake, y una etiqueta rich-text es ruido. Por eso una build etiqueta sus
líneas en ASCII.

El mapeo completo está en la [referencia de la API](/es/docs/beasty-debug-logger/reference/api/).

## Ver también

- [La ventana Beasty Console](/es/docs/beasty-debug-logger/guides/console-window/)
- [Builds de lanzamiento](/es/docs/beasty-debug-logger/guides/release-builds/)
- [Referencia de la API](/es/docs/beasty-debug-logger/reference/api/)
