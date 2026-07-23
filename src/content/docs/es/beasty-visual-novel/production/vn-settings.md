---
title: "VN settings"
description: "Los valores predeterminados de todo el proyecto para el juego completo: un asset, editado desde dos lugares, leído en tiempo de ejecución."
---

Los valores predeterminados de todo el proyecto para el juego completo: un asset, editado desde dos lugares,
leído en tiempo de ejecución.

Ábrelo con `Edit > Project Settings > Beasty VN`, o con `Tools > Beasty VN > Settings > Global Settings`. Ambos
editan **el mismo asset** (`VNSettings`, que vive en una carpeta `Resources` para que el juego pueda leerlo en
una build).

Cada configuración de abajo tiene un valor predeterminado funcional. Puedes lanzar el juego sin tocar esta
página.

## Contexto compartido

![El asset de VN Settings, de arriba abajo](/docs-images/beasty-visual-novel/vn-settings-inspector.png)

| Configuración | Qué hace |
|---|---|
| `gameContext` | El único `VNContext` compartido para todo el juego: el elenco, las variables, el esquema de personajes, el diccionario, la tabla de localización de la historia, las pantallas, los ítems, el catálogo de misiones, la configuración de música. Como el asset de settings vive en `Resources`, esto es lo que hace que el contexto sea resoluble en tiempo de ejecución incluso desde una escena que no lo referencia directamente. |

Cámbialo cuando tengas más de un asset de contexto en el proyecto y necesites decir cuál es el del juego. La
mayoría de los proyectos tienen exactamente uno y nunca tocan esto.

## Localización

| Configuración | Qué hace |
|---|---|
| `defaultLanguage` | El código de idioma en el que arranca el juego cuando el jugador no ha elegido uno (`en` por defecto). También el idioma de origen para proyectos nuevos. |
| `autoDetectSystemLanguage` | Desactivado por defecto. Cuando está activado, un jugador que abre el juego por primera vez recibe el idioma del sistema operativo SI la tabla de UI lo tiene; de lo contrario, el predeterminado. |
| `uiLocalization` | La tabla de traducción GLOBAL de la interfaz: menús, HUD, botones, diálogos. Separada de la tabla de historia en el contexto. |

Consulta [Localización](/es/docs/beasty-visual-novel/production/localization/) para el orden de arranque y las dos tablas.

## Guardado

| Configuración | Qué hace |
|---|---|
| `autosaveEnabled` | Si el juego autoguarda en las decisiones. Activado por defecto. |
| `autosaveAntiRollbackMargin` | Segundos. Un autoguardado en la MISMA posición que el más reciente, dentro de este margen, se omite — así que retroceder y volver a elegir la misma opción no puede inundar el anillo de autoguardado. 2 segundos por defecto. |
| `maxAutosaves` | Cuántos slots de autoguardado tiene el anillo. Cuando está lleno, el más antiguo se sobrescribe. 6 por defecto. |
| `saveSlotsPerPage` | Cuántos slots manuales muestra una página de la pantalla de guardado. 6 por defecto. |
| `saveManualPages` | Cuántas páginas manuales se muestran inicialmente. El índice crece automáticamente más allá de esto, sin límite. |
| `allowSaveNaming` | Si el jugador puede titular una partida. Cuando está desactivado, un slot se etiqueta con su marca de tiempo de creación local. |
| `defaultSaveThumbnail` | La imagen de respaldo mostrada para un slot GUARDADO cuyo PNG de miniatura falta o no se puede leer. Los slots vacíos usan en su lugar el arte de stock del prefab del slot, no esto. |

Consulta [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/).

## Retroceso

| Configuración | Qué hace |
|---|---|
| `maxRollbackSteps` | El número máximo de pasos de retroceso mantenidos en memoria y persistidos en la partida guardada. 20 por defecto. Súbelo si quieres que `Back` llegue más lejos; cuesta memoria y tamaño de guardado. |

## Guiones de texto (.vnbeasty)

| Configuración | Qué hace |
|---|---|
| `spriteIndexFolders` | Carpetas relativas al proyecto indexadas para la búsqueda de sprites por NOMBRE en un guion `.vnbeasty`. |
| `audioIndexFolders` | Lo mismo, para clips de audio. |

Déjalas vacías y el sistema usa la carpeta `Sprites` / `Audio` del proyecto; si no puede encontrarla, te
pregunta.

> **Nota**
> Estas carpetas mantienen los nombres cortos y sin ambigüedad — **no** son un filtro. Un asset fuera de
> ellas igual se resuelve por nombre en todo el proyecto. Lo que las carpetas te dan es un espacio de nombres
> pequeño y limpio para escribir.

Consulta [El guion de texto](/es/docs/beasty-visual-novel/authoring/text-script/).

## Diálogo y valores predeterminados de texto

![La sección de valores por defecto de diálogo y texto de VN Settings](/docs-images/beasty-visual-novel/vn-settings-text.png)

| Configuración | Qué hace |
|---|---|
| `typewriterCharsPerSecond` | Velocidad de la máquina de escribir, en caracteres por segundo. |
| `autoAdvance` | Si el auto-avance empieza activado. |
| `autoAdvanceDelay` | Segundos de espera en una línea antes de auto-avanzar. |
| `defaultTextColor`, `defaultNameColor` | Los colores usados cuando un personaje no los sobrescribe. |
| `defaultFontSizeMultiplier` | Escala la fuente del diálogo. |
| `defaultDeliveryState` | El estado de entrega usado por una línea que lo deja vacío (`Normal`). |

## Rangos de velocidad de texto y auto-avance

Estos acotan los deslizadores que el jugador ve en la pantalla de preferencias.

| Configuración | Qué hace |
|---|---|
| `textSpeedMin`, `textSpeedMax` | El rango de caracteres por segundo que expone el deslizador de velocidad de texto. En el máximo, el texto es instantáneo. |
| `autoForwardMin`, `autoForwardMax` | El rango de segundos que expone el deslizador de auto-avance. En el máximo, la historia NO auto-avanza. |
| `skipUnreadByDefault` | El valor predeterminado para "permitir saltar texto no leído". El texto leído siempre se puede adelantar rápido. |

## Escenario

![La sección de escenario de VN Settings](/docs-images/beasty-visual-novel/vn-settings-stage.png)

| Configuración | Qué hace |
|---|---|
| `stageWidth` | El ancho en espacio de mundo en el que se distribuyen los personajes. |
| `characterBaseY` | La Y en la que se paran los personajes. |
| `defaultCharacterScale` | La escala de un personaje que no establece la suya propia. |
| `backdropZSpacing` | El espacio Z en espacio de mundo entre capas de fondo, que da profundidad sin sorting layers. |
| `anchorX` | X normalizada (0 = izquierda, 1 = derecha) para las cinco anclas nombradas: Left, CenterLeft, Center, CenterRight, Right. |

## Resolución y tamaño de sprites

| Configuración | Qué hace |
|---|---|
| `targetWidth`, `targetHeight` | La resolución de diseño (1920x1080 por defecto). El forzador de relación de aspecto la lee. |
| `pixelsPerUnit` | Los píxeles por unidad usados en todo el arte de la VN. |
| `characterHeightFraction` | La fracción de la altura de pantalla que debe ocupar un personaje del escenario. |
| `portraitHeightFraction` | La fracción de la altura de pantalla usada como el tamaño (cuadrado) del retrato. |

Consulta [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/) para el forzador de relación de aspecto.

## Retroalimentación de botones de mundo libre

| Configuración | Qué hace |
|---|---|
| `freeRoamHoverZoom` | El multiplicador de escala aplicado a un sprite de botón al pasar el mouse por encima. |
| `freeRoamHighlightColor` | El tinte usado para resaltar un interactuable. |
| `freeRoamHoverTween` | Los segundos que tarda el zoom/resaltado de hover. |

Consulta [Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/).

## Límites suaves

| Configuración | Qué hace |
|---|---|
| `maxCharacters` | Personajes en el escenario a la vez. |
| `maxBackdropLayers` | Capas de sprite en un fondo. |
| `maxBlocksPerNode` | Bloques en un nodo. Si lo excedes, el validador lo informa. |

## Ver también

- [Localización](/es/docs/beasty-visual-novel/production/localization/), [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/),
  [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/).
- [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/) — qué es el contexto y por qué hay uno.
