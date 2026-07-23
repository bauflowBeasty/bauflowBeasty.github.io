---
title: "Referencia de assets"
description: "Cada ScriptableObject que creas con Beasty Visual Novel, su ruta exacta en el menú Create y sus campos principales. Usa esta página como consulta; los conceptos se explican en Conceptos fundamentales."
---

Cada ScriptableObject que creas con Beasty Visual Novel, su ruta exacta en el menú `Create` y sus campos
principales. Usa esta página como consulta. Los conceptos detrás de estos assets se explican en
[Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/).

## Cuántos de cada uno

La mayoría de los assets son por historia o por personaje. Unos pocos son singletons para todo el juego.

![El andamiaje de assets con el que acaba un proyecto, en la ventana Project](/docs-images/beasty-visual-novel/vn-assets-project.png)

| Asset | Cuántos |
|---|---|
| `VNSettings` | Exactamente uno, en una carpeta `Resources`. Creado para ti. |
| `VNContext` | Exactamente uno para todo el juego. Cada historia lo comparte. |
| `LocalizationTable` | Uno para la historia (en el contexto) más una tabla global de UI (en VN Settings). |
| `CharacterVariableSchema` | Uno, referenciado por el contexto. |
| `QuestCatalog` | Uno, referenciado por el contexto. |
| `VNMusicConfig` | Uno, referenciado por el contexto. |
| `VNTimeConfig` | Uno, arrastrado al BeastyManager. Opcional. |
| `FreeRoamMapGraph` | Uno por escenario. La mayoría de los juegos tiene uno. |
| `DialogueScene` | Uno por historia o capítulo. Muchos. |
| `StoryGraph` | Un grafo raíz por escena, más uno por subgrafo. Muchos. |
| `CharacterDefinition` | Uno por personaje. Muchos. |

El `VNContext` es el que hay que cuidar. Es el mundo compartido, resuelto en tiempo de ejecución a través de
`VNSettings.gameContext`. `Tools > Beasty VN > Content > Create Base Assets (intro + FreeRoam map)` nunca lo
duplica.

## Tabla de consulta

| Asset | Menú Create | Qué es |
|---|---|---|
| `DialogueScene` | `Create > Beasty VN > Visual Novel (Dialogue Scene)` | El asset raíz de una historia. |
| `VNContext` | `Create > Beasty VN > Story > VN Context` | El mundo compartido: elenco, variables, objetos, misiones. |
| `StoryGraph` | `Create > Beasty VN > Story > Story Graph` | Un lienzo de nodos. |
| `VNSettings` | `Create > Beasty VN > Config > VN Settings` | Configuración de todo el proyecto. |
| `VNMusicConfig` | `Create > Beasty VN > Config > Music Config` | La cola de música para cada modo de la aplicación. |
| `VNTimeConfig` | `Create > Beasty VN > Config > Time Config` | Momentos del día, horas, días de la semana, estaciones. |
| `CharacterDefinition` | `Create > Beasty VN > Characters > Character Definition` | Un personaje. |
| `CharacterVariableSchema` | `Create > Beasty VN > Characters > Character Variable Schema` | Los campos que tiene cada personaje. |
| `LocalizationTable` | `Create > Beasty VN > Localization > Localization Table` | Clave por idioma. |
| `FreeRoamMapGraph` | `Create > Beasty VN > FreeRoam > FreeRoam Map Graph` | Salas más rutinas de personaje. |
| `QuestCatalog` | `Create > Beasty VN > Quests > Quest Catalog` | Las misiones del proyecto. |
| Los siete tipos de nodo | `Create > Beasty VN > Advanced > Nodes > ...` | Normalmente creados por el grafo, no a mano. |

Casi nunca necesitas este menú. `Tools > Beasty VN > Setup > Blank Canvas` crea el DialogueScene, el
VNContext, el LocalizationTable, un StoryGraph raíz y un primer nodo Dialogue en un solo paso. Consulta
[Menús](/es/docs/beasty-visual-novel/reference/menu-items/).

## DialogueScene

El asset raíz de una historia. Se muestra en el editor como el campo "Visual Novel".

| Campo | Significado |
|---|---|
| `context` | El `VNContext` compartido. Si está vacío, recurre al contexto global de VN Settings. |
| `rootGraph` | El `StoryGraph` desde el que arranca la reproducción. |
| `musicOverride` | Una cola de música que reemplaza la cola Visual Novel del contexto para esta historia. |
| `scriptFile` | El TextAsset `.vnbeasty` con el que esta escena se sincroniza. |

Consulta [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) y [El script de texto](/es/docs/beasty-visual-novel/authoring/text-script/).

## VNContext

El único mundo compartido. El elenco, las variables, el diccionario, los objetos, las misiones, las
pantallas y la localización viven todos aquí, no en las historias individuales, así que varias
DialogueScenes pueden compartirlos.

| Campo | Significado |
|---|---|
| `characters` | El elenco: una lista de `CharacterDefinition`. |
| `variables` | Tus definiciones de variables (en línea, ver abajo). |
| `characterSchema` | El `CharacterVariableSchema` que hereda cada personaje. |
| `musicConfig` | El `VNMusicConfig`. |
| `dictionary` | Entradas del diccionario (en línea). |
| `localization` | La `LocalizationTable` de la historia. |
| `languages` | Los códigos de idioma que este juego incluye. El índice 0 es el idioma de origen. |
| `screens` | Definiciones de pantallas de HUD y overlay. |
| `items` | Definiciones de objetos (en línea). |
| `questCatalog` | El `QuestCatalog`. |

## StoryGraph

Un lienzo de nodos: un grafo por escena, más uno por subgrafo.

| Campo | Significado |
|---|---|
| `nodes` | Los nodos en el lienzo. |
| `entryNodeId` | Dónde arranca la reproducción. |
| `exitOutcomes` | Las claves de resultado que este grafo puede devolver cuando se usa como subgrafo. |

Consulta [Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/).

## VNSettings

Configuración de todo el proyecto: el contexto global, la tabla de localización de UI, el idioma por
defecto, el autoguardado, las ranuras de guardado, la profundidad de retroceso, y las carpetas usadas para
resolver nombres de asset en el script de texto. Vive en una carpeta `Resources` y se lee en tiempo de
ejecución.

Ábrelo con `Tools > Beasty VN > Settings > Global Settings` o `Edit > Project Settings > Beasty VN`. Cada
campo está documentado en [VN Settings](/es/docs/beasty-visual-novel/production/vn-settings/).

## VNMusicConfig

La cola de música para cada modo de la aplicación: `mainMenu`, `visualNovel`, `freeRoam` y `custom`. Cada
cola tiene `clips`, un `mode`, un `volume` y un `crossfadeSeconds`.

Consulta [Audio y música](/es/docs/beasty-visual-novel/production/audio-and-music/).

## VNTimeConfig

Tiempo del juego. Arrástralo al campo **Time Config** del BeastyManager.

> **Advertencia**
> Deja ese campo vacío y el sistema de tiempo queda apagado. No se escribe ninguna variable de tiempo y toda
> condición de tiempo se evalúa como false.

| Campo | Significado |
|---|---|
| `mode` | `SlotsOnly` (momentos del día con nombre, sin hora) o `Clock` (un contador de horas). |
| `dayparts` | Los momentos del día. Cada uno tiene un `name` y, en modo Clock, un `startHour`. |
| `hoursPerDay` | Solo en modo Clock. |
| `weekdays` | Nombres de los días de la semana, opcionales. Déjalo vacío para desactivarlos. |
| `seasons`, `daysPerSeason` | Opcional. |
| `startDay`, `startDaypartIndex`, `startHour` | El momento inicial de una partida nueva. |

Consulta [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/).

## CharacterDefinition

Un personaje: su nombre, su aspecto en el escenario y en la UI, sus estadísticas, y su menú de conversación.

| Campo | Significado |
|---|---|
| `id` | El id estable usado en condiciones, scripts y código. |
| `displayName`, `nameColor`, `textColor` | Cómo se dibujan el nombre y la línea. |
| `allowPlayerRename` | Permite que el jugador le ponga nombre a este personaje. |
| `category` | `Main` o `Secondary`. |
| `tags`, `aliases` | Etiquetas libres; nombres alternativos para mostrar, que una línea puede usar. |
| `expressions` | Los sprites de escenario. La clave por defecto es `base`. |
| `portraits` | Los íconos de UI. |
| `deliveryStyles` | Fuente, color y efecto de texto por estado de entrega. |
| `variables` | Los campos propios de este personaje, sobre el esquema. |
| `talkMenu` | Las entradas del menú de conversación. |
| `freeRoamSprite` | El sprite usado en una sala. |
| `listed`, `listVisibleWhen` | Si el personaje aparece en la lista de elenco del juego. |
| `showCurrentLocation`, `showRoutine` | Qué revela la pantalla de perfil. |

Consulta [Personajes](/es/docs/beasty-visual-novel/world/characters/) y [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/).

## CharacterVariableSchema

Los campos que tiene TODO personaje. Una lista `fields` de `CharacterVariableField` (ver abajo). Un
personaje puede sobrescribir el valor por defecto y la visibilidad de un campo del esquema sin cambiar el
esquema.

Consulta [Personajes](/es/docs/beasty-visual-novel/world/characters/).

## LocalizationTable

Una grilla de claves por idioma.

| Campo | Significado |
|---|---|
| `languages` | Códigos de idioma. El índice 0 es el idioma de origen. |
| `entries` | Una fila por clave, con una celda por idioma y su estado de traducción. |

Hay dos tablas: la tabla de la historia en el VNContext, y la tabla global de UI en VN Settings. Consulta
[Localización](/es/docs/beasty-visual-novel/production/localization/).

## FreeRoamMapGraph

Las salas por las que camina el jugador, y las rutinas que deciden quién está parado en ellas.

| Campo | Significado |
|---|---|
| `entryRoomId` | La sala en la que empieza una partida nueva. |
| `rooms` | Los nodos de sala: fondo, fondos condicionales, prefab de sala, botones. |
| `routines` | Un `CharacterRoutine` por personaje. |

Asigna el grafo al componente `FreeRoamScenario` en el Stage. Consulta
[Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/) y [Rutinas de personaje](/es/docs/beasty-visual-novel/world/character-routines/).

## QuestCatalog

Las misiones del proyecto, en una lista `quests`. Cada misión tiene un id, un título, un dueño, una
categoría, un modo de orden, una recurrencia, condiciones de inicio y fallo, efectos de recompensa y
penalización, y sus objetivos.

Consulta [Misiones](/es/docs/beasty-visual-novel/world/quests/).

## Los siete tipos de nodo

Cada tipo de nodo tiene una entrada `Create` bajo `Create > Beasty VN > Advanced > Nodes >`:

`Dialogue Node`, `Choice Node`, `Decision Node`, `Flow Node`, `SubGraph Node`, `Return Node`,
`Talk Menu Node`.

Normalmente nunca los usas. Hacer clic derecho en el lienzo del grafo crea el nodo, lo nombra, lo añade al
grafo y lo archiva como sub-asset por ti. Las entradas `Advanced` existen para el caso raro en que necesites
un asset de nodo fuera de un grafo. Consulta [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/).

## Datos en línea: lo que NO es un asset

Cuatro tipos de datos viven dentro del `VNContext` en vez de ser assets separados. Los editas en la ventana
Beasty VN, no en la ventana Project, y nunca creas un archivo para ellos.

### Definiciones de variables

Editadas en la pestaña **Variables**. Una `VariableDefinition` por variable.

| Campo | Significado |
|---|---|
| `key` | La clave en el almacén. Sin prefijo. |
| `kind` | `PlayerInput`, `Fixed`, `Enum` o `Computed`. |
| `valueType` | `String`, `Int`, `Float` o `Bool`. |
| `defaultValue` | El valor al inicio de una partida nueva. |
| `promptAtRuntime` | Pedírsela al jugador cuando empieza el juego. |
| `allowedValues` | El dominio de una variable `Enum`. |

Consulta [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) y
[Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/).

### Entradas de diccionario

Editadas en la pestaña **Dictionary**. Una `DictionaryEntry` por token: `key`, `defaultValue`,
`playerEditable`.

Consulta [El diccionario](/es/docs/beasty-visual-novel/world/dictionary/).

### Definiciones de objetos

Editadas en la pestaña **Items**.

| Campo | Significado |
|---|---|
| `id` | El id del objeto. También la clave de inventario `item.<id>`. |
| `icon` | El sprite de inventario. |
| `kind` | `Key` o `Consumable`. |
| `maxQuantity` | El tope. Give y Take nunca lo superan ni bajan de 0. |
| `nameKey`, `descriptionKey` | Claves de localización. |
| `onUse` | `useCondition`, `cannotUseMessageKey`, `effects`, `jumpToScene`, `jumpToNodeId`, `consumeAmount`. |

Consulta [Objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/).

### Campos de variable de personaje

Un `CharacterVariableField` aparece ya sea en el `CharacterVariableSchema` (todo personaje lo tiene) o en una
`CharacterDefinition` (solo ese personaje lo tiene).

| Campo | Significado |
|---|---|
| `key` | El nombre del campo. La clave en el almacén es `@char:<id>:<key>`. |
| `type` | `String`, `Int`, `Float` o `Bool`. |
| `defaultValue` | El valor inicial. |
| `showOnStats` | Mostrarlo en la pantalla de estadísticas del personaje. |
| `editable` | Dejar que el jugador lo cambie ahí. |
| `clamp`, `min`, `max`, `step` | Límites opcionales. |

## Ver también

- [Menús](/es/docs/beasty-visual-novel/reference/menu-items/)
- [Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/)
- [Prefabs](/es/docs/beasty-visual-novel/reference/prefabs/)
- [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/)
- [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/)
