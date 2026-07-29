---
title: "Recorrido del editor"
description: "Un paseo por la ventana Beasty VN — la barra superior, las nueve pestañas y las ventanas auxiliares — para que sepas dónde está todo antes de necesitarlo."
---

Un recorrido guiado por la ventana Beasty VN y las demás ventanas del editor, para que sepas dónde está todo
antes de necesitarlo. Cada sección dice qué haces en esa pestaña y señala la página que la cubre en
detalle.

Abre la ventana con:

```text
Tools > Beasty VN > Editor
```

## La barra superior

La franja que cruza la parte superior de la ventana es la misma en cada pestaña.

![La barra superior de la ventana Beasty VN: DialogueScene, Context, Characters, Validate y Global Settings](/docs-images/beasty-visual-novel/vn-editor-top-bar.png)

| Control | Qué hace |
|---|---|
| Campo **DialogueScene** | Qué historia estás editando. Suelta una DialogueScene aquí, o haz doble clic en una dentro de la ventana Project y el editor se abre sobre ella. |
| Campo **Context** (+ **New**) | El mundo compartido que usa esta historia. Hay un VNContext para todo tu juego, y normalmente ya está asignado. **New** crea uno si no tienes ninguno. |
| **Characters** | Abre el reparto en su propia ventana. |
| **Validate** | Recorre el grafo raíz y cada subgrafo y reporta referencias colgantes. Consulta [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/). |
| **Global Settings** | Abre la configuración de VN a nivel de proyecto. |

En una ventana angosta los tres botones de acción se colapsan en un menú `...`.

Si no hay ninguna DialogueScene asignada, la pestaña Story ofrece un botón **Setup blank canvas...**, que
crea todo el andamiaje con un solo clic.

## Las nueve pestañas

![Las nueve pestañas de la ventana Beasty VN](/docs-images/beasty-visual-novel/vn-editor-tabs.png)

### Story

Donde construyes la historia. Esta es la pestaña en la que vivirás, y tiene tres paneles.

- **La paleta Add blocks** (izquierda). Cada bloque, agrupado por categoría: Dialogue, Scene, Clear, State,
  Quests, World, Items, Audio, Input, Flow. **Haz clic en un bloque para agregarlo** al nodo seleccionado;
  **arrástralo sobre la lista de bloques** si quieres insertarlo en una posición concreta. El panel es
  redimensionable, y se colapsa a una franja delgada cuando necesitas el espacio.
- **El lienzo del grafo** (centro). Tus nodos y las aristas entre ellos. Haz clic derecho en un espacio
  vacío para `Create` un nodo; haz clic derecho en un nodo para `Rename`, `Set as Entry Node`, `Create
  Subgraph` / `Open Subgraph`, o `Delete Node`. Arrastra desde el puerto de salida de un nodo hasta el
  puerto de entrada de otro para cablearlos.
- **El inspector de nodo** (derecha). Los bloques del nodo seleccionado, en el orden en que se ejecutan,
  más cualquier otra cosa que ese tipo de nodo necesite — las opciones de un nodo Choice, las ramas de un
  nodo Decision, las rutas de resultado de un nodo SubGraph.

Tres controles más en esta pestaña:

- **El alternador Graph / Text.** Cambia entre el grafo de nodos y la misma escena escrita como un script
  de texto `.vnbeasty`. Cuando ambos han divergido desde la última sincronización, la pestaña **Graph**
  muestra un marcador de advertencia para avisarte. El grafo siempre es la fuente de verdad: un script que
  no se puede parsear nunca sobrescribe tus nodos. Consulta [El script de texto](/es/docs/beasty-visual-novel/authoring/text-script/).
- **La miga de pan del subgrafo.** Cuando abres un subgrafo, la miga de pan muestra dónde estás, y el botón
  **Up** te devuelve al grafo exterior. Consulta [Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/).
- **El selector Lang.** En qué idioma estás escribiendo el texto de los nodos. Este es el idioma de
  **autoría**. Es independiente del idioma en el que corre el juego — úsalo para escribir una escena
  directamente en una traducción.

Más detalle en: [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/),
[Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/),
[Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/),
[Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/).

### Characters

El reparto, y todo lo que está conectado a un personaje. Cuatro sub-pestañas:

![La pestaña Characters y sus cuatro sub-pestañas](/docs-images/beasty-visual-novel/vn-tab-characters.png)

- **Cast** — identidad (id, display name, colores, categoría, tags), alias, expresiones, estilos de
  entrega, retratos. **+ New Character** crea uno; **Add existing** adopta una CharacterDefinition que ya
  tengas.
- **Variables** — el esquema universal (los campos que tiene cada personaje) y los campos propios de este
  personaje.
- **Quests** — las misiones de este personaje.
- **Talk Menu** — lo que el jugador puede decirle a este personaje.

Más detalle en: [Personajes](/es/docs/beasty-visual-novel/world/characters/), [Misiones](/es/docs/beasty-visual-novel/world/quests/),
[El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/).

### Variables

Tus variables globales: clave, tipo, valor predeterminado, y cómo se comporta la variable. Es una lista
con un panel de detalle, y las variables de personaje tienen una lista de personajes a la izquierda para
que puedas saltar rápido de un personaje a otro.

![La pestaña Variables: la lista maestro-detalle de variables globales](/docs-images/beasty-visual-novel/vn-tab-variables.png)

Más detalle en: [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/).

### Localization

La grilla de traducción: una fila por clave, una columna por idioma. Un alternador **Story / UI (global)**
cambia entre la tabla propia de la historia y la tabla compartida de UI que leen todos los menús y
pantallas.

![La pestaña Localization con el alternador Story / UI (global)](/docs-images/beasty-visual-novel/vn-tab-localization.png)

Aquí agregas idiomas, importas y exportas CSV/TSV, y ves de un vistazo qué celdas faltan, están
desactualizadas o están terminadas.

Más detalle en: [Localización](/es/docs/beasty-visual-novel/production/localization/).

### Dictionary

Tokens de texto que el jugador puede cambiar — el nombre del jugador, su ciudad natal, lo que sea que tu
historia le deje decidir. Un token tiene una clave, un valor predeterminado, y una marca de si el jugador
puede editarlo.

![La pestaña Dictionary: los tokens de texto que el jugador puede cambiar](/docs-images/beasty-visual-novel/vn-tab-dictionary.png)

Más detalle en: [El diccionario](/es/docs/beasty-visual-novel/world/dictionary/).

### Music

La cola de música para cada modo de aplicación: el menú principal, la novela visual, mundo libre, y tu
propio modo personalizado. Cada cola tiene sus clips, un modo de reproducción, un volumen y un tiempo de
crossfade.

![La pestaña Music: una cola por modo de la aplicación](/docs-images/beasty-visual-novel/vn-tab-music.png)

Más detalle en: [Audio y música](/es/docs/beasty-visual-novel/production/audio-and-music/).

### FreeRoam

El editor de salas, incrustado en la ventana. Tiene una vista **Map** — un diagrama de tus salas y los
pasajes entre ellas — y **edición en profundidad** de una sala, que es el único lugar donde creas el fondo
de esa sala, sus puertas y sus objetos interactuables. Un alternador **Routines** cambia el lienzo por la
grilla de rutinas: una vista de semana x momento del día sobre los horarios de tus personajes.

![La pestaña FreeRoam en vista Map, con las salas como cajas y las puertas como líneas](/docs-images/beasty-visual-novel/vn-tab-freeroam-map.png)

Más detalle en: [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/),
[Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/),
[Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).

### Screens

Pantallas de HUD y superposición: la barra persistente que siempre está en pantalla, y los paneles que se
abren encima del juego. Cada pantalla es un prefab más una lista de los objetos dentro de ella que hacen
algo.

![La pestaña Screens: la lista de pantallas, sus ajustes y la vista previa del prefab](/docs-images/beasty-visual-novel/vn-tab-screens.png)

Más detalle en: [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/).

### Items

Definiciones de ítems: id, ícono, tipo (una llave o un consumible), cantidad máxima, claves de nombre y
descripción, y qué pasa cuando el jugador usa uno.

![La pestaña Items con un ítem seleccionado](/docs-images/beasty-visual-novel/vn-tab-items.png)

Más detalle en: [Ítems e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/).

## Las otras ventanas

### Dialogue Preview

```text
Tools > Beasty VN > Dialogue Preview
```

Reproduce un nodo — backdrop, personajes, props, cuadro de diálogo — dentro de una ventana de editor,
**sin entrar en Play Mode**. Puede adelantarse hasta un bloque concreto, así que caes en el momento exacto
en el que estás trabajando. Nada de lo que hace toca la escena abierta, y no se guarda nada.

Más detalle en: [Vista previa de diálogo](/es/docs/beasty-visual-novel/authoring/dialogue-preview/).

### Character Database

![La Character Database en su propia ventana, junto al grafo](/docs-images/beasty-visual-novel/vn-character-database-window.png)

```text
Tools > Beasty VN > Content > Character Database
```

La pestaña Characters en su propia ventana. Mismo editor, mismos datos — útil cuando quieres tener el
reparto abierto al lado del grafo en lugar de detrás.

### Global Settings

![La ventana Global Settings: los ajustes de VN de todo el proyecto](/docs-images/beasty-visual-novel/vn-global-settings.png)

```text
Tools > Beasty VN > Settings > Global Settings
```

La configuración de VN a nivel de proyecto: el contexto global, la tabla de localización de UI, el idioma
predeterminado y la detección de idioma del sistema, la política de autoguardado, los slots de guardado, el
límite de rollback, y las carpetas de assets usadas para resolver nombres en el script de texto. Es el
mismo asset que `Edit > Project Settings > Beasty VN` — ábrelo por el camino que prefieras.

Más detalle en: [VN Settings](/es/docs/beasty-visual-novel/production/vn-settings/).

## Ver también

- [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/)
- [Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/)
- [Elementos de menú](/es/docs/beasty-visual-novel/reference/menu-items/) — cada elemento de menú en una tabla
- [Assets](/es/docs/beasty-visual-novel/reference/assets/) — cada ScriptableObject y su menú Create
