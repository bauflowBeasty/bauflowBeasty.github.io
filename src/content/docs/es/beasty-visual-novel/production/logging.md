---
title: "Logging"
description: "Dónde acaban los mensajes de log de la VN, cómo silenciar un subsistema ruidoso sin silenciar el resto, y por qué una build publicada se queda callada por defecto."
---

Dónde acaban los mensajes de log de la VN, cómo silenciar un subsistema ruidoso sin silenciar el resto, y por
qué una build publicada se queda callada por defecto. Aquí no hay nada que configurar: los valores por defecto
ya son los que quieres en el editor y en una build de lanzamiento.

## Todo pasa por una sola fachada

El paquete nunca llama a `UnityEngine.Debug` directamente. Cada mensaje que produce — cargar un asset de
historia, avanzar un nodo, resolver un keyframe, escribir un guardado — pasa por `VNLog`, una fachada estática
del espacio de nombres `Beasty.VN.Core`, y de ahí a **Beasty Console**.

Beasty Console viene dentro de este paquete, así que la ventana ya está ahí:
`Tools > Beasty VN > Diagnostics > Console`. Consulta
[La ventana Beasty Console](/es/docs/beasty-console/guides/console-window/) para ver lo que puede hacer:
filtros por nivel con recuentos en vivo, búsqueda, Collapse, Clear on Play, y un panel de detalle cuyas líneas
de traza abren el archivo en la línea exacta dentro de tu IDE.

Cada mensaje lleva delante `[BeastyVN][Categoría]`, así que con el campo de búsqueda de la consola basta para
aislar lo que imprime el paquete de lo que imprimes tú. Las excepciones se le entregan a la consola como el
objeto de excepción en sí, que es lo que mantiene intacta la traza de Unity.

## Categorías

Cada mensaje va etiquetado con el área de la que viene, y cada área tiene su propio interruptor:

![Logs de la VN en la consola, uno por categoría](/docs-images/beasty-visual-novel/vn-log-categories.png)

| Categoría | Qué se registra por ahí | Por defecto |
|---|---|---|
| `Data` | Carga de ScriptableObjects, validación, integridad del modelo | Activo |
| `Director` | Control de flujo, transiciones de nodo, elecciones, decisiones | Activo |
| `Stage` | Presentación de la escena: fondo, vídeo, personajes, resolución de keyframes | Activo |
| `Streaming` | La ventana de carga de nodos, la precarga y liberación con Addressables | Activo |
| `Save` | La integración de guardado y carga | Activo |
| `Verbose` | Salida de mucha frecuencia: la máquina de escribir, trabajo por frame | **Apagado** |

Los interruptores son campos públicos de `VNLog`:

```csharp
using Beasty.VN.Core;

VNLog.LogStage = false;          // corta la cháchara del escenario y deja el resto
VNLog.LogVerboseChannel = true;  // enciende el canal ruidoso mientras depuras la máquina de escribir
```

`Verbose` viene apagado porque imprime durante el efecto de máquina de escribir y en trabajo por frame.
Enciéndelo mientras persigues algo ahí, y vuelve a apagarlo.

> **Nota**
> Las advertencias, errores y excepciones **ignoran los interruptores por categoría**. Silenciar `Stage`
> silencia sus mensajes informativos; un error del escenario te sigue llegando. Solo el interruptor maestro
> de abajo los oculta.

## El interruptor maestro

```csharp
VNLog.Enabled = false;
```

Eso silencia todo el logging de la VN, advertencias y errores incluidos. Su valor por defecto depende de la
build:

| Dónde | Por defecto |
|---|---|
| Editor | Activo |
| Build de desarrollo | Activo |
| Build de release | **Apagado** |

Esa es justo la idea. Una novela visual registra algo en cada línea de diálogo, cada elección y cada cambio de
sala, y un juego publicado no debe escribir todo eso en el log del jugador. No tienes que hacer nada para
conseguir ese comportamiento: es lo que ya hace una build de lanzamiento.

Si sí quieres los logs de vuelta en una build de lanzamiento, pon `Enabled = true` tú mismo.

## Poner los interruptores para que se queden puestos

`VNLog` reinicia todos sus interruptores durante la inicialización del runtime de Unity, así que cada sesión de
Play y cada build arrancan desde los valores por defecto de arriba. Un valor que pongas desde un script de
editor, o en una sesión anterior, no sobrevive.

![Los interruptores de log por categoría, y el interruptor maestro](/docs-images/beasty-visual-novel/vn-log-switches.png)

Ponlos **después del arranque** — desde un `MonoBehaviour` de arranque en tu primera escena, o desde un
`RuntimeInitializeOnLoadMethod`:

```csharp
using UnityEngine;
using Beasty.VN.Core;

public class VNLoggingBootstrap : MonoBehaviour
{
    private void Awake()
    {
        VNLog.LogStreaming = false;  // los logs de streaming de este proyecto no interesan
        VNLog.LogVerboseChannel = false;
    }
}
```

## Dos interruptores, no uno

`VNLog` se apoya en Beasty Console, así que hay dos interruptores por encima de tus logs y cualquiera de los
dos silencia la VN:

- **`VNLog.Enabled`** — el interruptor propio de la VN. Apagado en una build de lanzamiento.
- **`BeastyConsole.IsEnabled`** — el interruptor maestro de la consola, que silencia *todo* el proyecto,
  incluidas tus propias llamadas de log. Vuelve a `true` al principio de cada ejecución. Consulta
  [Builds de lanzamiento](/es/docs/beasty-console/guides/release-builds/).

Ninguno de los dos elimina las llamadas de la build. Detienen la salida, no el trabajo de construir el
mensaje. Eso importa para tu propio logging, no para el del paquete — consulta
[Builds de lanzamiento](/es/docs/beasty-console/guides/release-builds/) para el patrón.

## Registrar desde tu propio código

`VNLog` es público, así que puedes etiquetar tus propios mensajes con una categoría de la VN y que se filtren
junto a los del paquete:

```csharp
VNLog.Info(VNLogCategory.Director, "Capítulo 3 desbloqueado", this);
```

El último parámetro es un objeto `context`: le pasas un `GameObject` o un `ScriptableObject` y la entrada se
vuelve clicable, señalando ese objeto en la jerarquía o en la ventana de proyecto.

Para mensajes que no tienen nada que ver con la VN, llama a `BeastyConsole` directamente. Consulta
[Logging](/es/docs/beasty-console/guides/logging/).

## Ver también

- [Logging](/es/docs/beasty-console/guides/logging/)
- [La ventana Beasty Console](/es/docs/beasty-console/guides/console-window/)
- [Builds de lanzamiento](/es/docs/beasty-console/guides/release-builds/)
- [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/)
- [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/)
