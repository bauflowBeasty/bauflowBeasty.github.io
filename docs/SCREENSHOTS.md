# Capturas de pantalla

Guion de capturas de toda la documentación. Cada ficha dice **dónde aparece** la imagen en el sitio,
**desde qué vista** se toma y **qué tiene que verse** en ella.

Las páginas ya enlazan todas estas rutas: basta con dejar el PNG con el nombre exacto en
`public/docs-images/<producto>/`. Una captura que todavía no existe se oculta sola al renderizar, así
que el sitio nunca muestra una imagen rota.

> **Generado.** Este archivo lo produce `npm run doc:shots` a partir de las páginas y de
> `docs/screenshots.json`. No lo edites a mano: edita la página (para mover o quitar una imagen) o el
> catálogo (para cambiar la prioridad, la vista o el guion de una captura) y vuelve a generarlo.

## Estado

| | Total | Tomadas | Pendientes |
|---|---:|---:|---:|
| P1 · imprescindibles | 79 | 59 | 20 |
| P2 · recomendadas | 77 | 53 | 24 |
| P3 · complementarias | 31 | 20 | 11 |
| **Total** | **187** | **132** | **55** |

**Prioridades.** P1 es donde el texto solo no basta: la ventana principal y sus pestañas, los
asistentes, las grillas y las pantallas que ve el jugador. P2 completa una página que ya se entiende.
P3 es un extra: si no la tomas, no se nota.

## Cómo tomarlas

- **Recorta a la ventana o al panel**, nunca el editor entero.
- **Un tema de editor para todas** (claro u oscuro, pero el mismo siempre).
- **Con datos de verdad.** Una grilla vacía o un inspector sin rellenar no enseña nada; por eso casi
  todas las fichas piden un estado concreto.
- **Nombre de archivo exacto**, en minúsculas y con guiones, tal cual aparece aquí.
- PNG, entre 900 y 1600 px de ancho. Si la ventana es enorme, encógela antes de capturar en lugar de
  escalar la imagen después.
- Si decides que una captura no merece la pena, borra su línea `![...](...)` de la página EN **y** de
  la ES, quita su ficha del catálogo y regenera este archivo.

## Beasty Visual Novel

Carpeta destino: `public/docs-images/beasty-visual-novel/` · 19 pendientes de 151.

### Blocks reference · Referencia de bloques

`/docs/beasty-visual-novel/authoring/blocks-reference/` — `/es/docs/beasty-visual-novel/authoring/blocks-reference/`

#### `vn-add-blocks-palette.png` — P1 · ✅ tomada

- **Sección:** The Add blocks panel · El panel Add blocks
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, panel izquierdo
- **Qué tiene que verse:** Recorte del panel de la paleta con TODAS las categorías desplegadas a la vez (Dialogue, Scene, Clear, State, Quests, World, Items, Audio, Input, Flow) y sus bloques legibles. Alarga la ventana en vertical si hace falta: esta captura es el índice de toda la página.

### Choices and decisions · Elecciones y decisiones

`/docs/beasty-visual-novel/authoring/choices-and-decisions/` — `/es/docs/beasty-visual-novel/authoring/choices-and-decisions/`

#### `vn-choice-inspector.png` — P1 · ✅ tomada

- **Sección:** The Choice node · El nodo Choice
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Un nodo Choice con el texto de la pregunta arriba y tres opciones desplegadas: etiqueta, condición, efectos y destino de cada una. Que se vea al menos una opción condicionada y otra con efectos.

#### `vn-choice-ingame.png` — P1 · ✅ tomada

- **Sección:** The label · La etiqueta (label)
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La escena en Play en el momento de la elección: el texto de la pregunta y los botones de opción en pantalla. A ser posible, la MISMA elección que muestra la captura del inspector, para poder comparar las dos caras.

#### `vn-condition-editor.png` — P1 · ✅ tomada

- **Sección:** The condition · La condición
- **Vista:** Unity ▸ Tools > Beasty VN > Editor, en cualquier campo de condición
- **Qué tiene que verse:** Una condición de TRES cláusulas con uniones mezcladas (And y Or) para que se vea la precedencia de la que avisa la página, y con el selector de token abierto o recién usado, mostrando etiquetas amigables (time.daypart, maya.affection, item.potion). Este editor es el mismo en todo el paquete: que la foto valga para todos los sitios.

#### `vn-decision-inspector.png` — P2 · ✅ tomada

- **Sección:** The Decision node · El nodo Decision
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Un nodo Decision con dos ramas condicionadas y su rama por defecto, con las condiciones a la vista. Sirve para contrastarlo con la captura del nodo Choice.

### Dialogue and the stage · Diálogo y el escenario

`/docs/beasty-visual-novel/authoring/dialogue-and-stage/` — `/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/`

#### `vn-block-dialogue.png` — P1 · ✅ tomada

- **Sección:** The Dialogue block · El bloque Dialogue
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Un bloque de diálogo desplegado con todos sus campos rellenos: personaje elegido, texto escrito, un estilo de entrega distinto de Normal y el alias de nombre visible. Solo el bloque, no el inspector entero.

#### `vn-stage-ingame.png` — P1 · ⬜ pendiente

- **Sección:** The stage · El escenario
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** Una línea de diálogo en marcha con DOS personajes en escena (uno hablando, otro no), fondo puesto y la caja de diálogo con la placa de nombre. Es la foto de referencia de qué significa «el escenario».

#### `vn-block-backdrop.png` — P2 · ✅ tomada

- **Sección:** Backdrop · Backdrop
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** El bloque Backdrop desplegado con el sprite asignado (que se vea la miniatura) y la transición elegida.

#### `vn-block-show-character.png` — P2 · ✅ tomada

- **Sección:** Show character · Show character
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** El bloque desplegado con el personaje elegido, una expresión concreta y la posición en escena. Si el bloque muestra miniatura del sprite, que se vea.

#### `vn-block-props.png` — P3 · ✅ tomada

- **Sección:** Props · Props
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** El bloque Props con dos props en su lista, con sus sprites y posiciones, para que se vea que son elementos de escenario independientes de los personajes.

### Dialogue preview · Vista previa de diálogo

`/docs/beasty-visual-novel/authoring/dialogue-preview/` — `/es/docs/beasty-visual-novel/authoring/dialogue-preview/`

#### `vn-dialogue-preview.png` — P1 · ✅ tomada

- **Sección:** (entradilla) · (entradilla)
- **Vista:** Unity ▸ Tools > Beasty VN > Dialogue Preview
- **Qué tiene que verse:** La ventana de vista previa renderizando un nodo con fondo y dos personajes en escena, con la caja de diálogo abajo. Sin entrar en Play: la barra de Unity debe delatar que no estamos en modo de juego.

#### `vn-preview-block-button.png` — P3 · ✅ tomada

- **Sección:** The per-block preview button · El botón de vista previa por bloque
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Recorte de la lista de bloques con el botón de vista previa de UNO de ellos señalado (cursor encima o el tooltip abierto), para que quede claro que se puede previsualizar hasta un bloque concreto.

### The story graph · El grafo de la historia

`/docs/beasty-visual-novel/authoring/story-graph/` — `/es/docs/beasty-visual-novel/authoring/story-graph/`

#### `vn-story-tab.png` — P1 · ✅ tomada

- **Sección:** (entradilla) · (entradilla)
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story
- **Qué tiene que verse:** La pestaña Story completa, con sus tres paneles bien poblados: la paleta Add blocks a la izquierda, un grafo con varios nodos y aristas en el centro, y el inspector del nodo seleccionado a la derecha.

#### `vn-graph-create-menu.png` — P2 · ✅ tomada

- **Sección:** Creating a node · Crear un nodo
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story
- **Qué tiene que verse:** Clic derecho sobre el lienzo vacío con el submenú Create abierto, mostrando los tipos de nodo que se pueden crear. Con algún nodo de fondo para dar contexto.

#### `vn-graph-wiring.png` — P2 · ✅ tomada

- **Sección:** Wiring nodes · Conectar nodos
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story
- **Qué tiene que verse:** El momento del arrastre: el cable a medio tender entre el puerto de salida de un nodo y la entrada del siguiente. Si no puedes capturar el arrastre, vale una foto de dos nodos ya conectados con los puertos bien visibles.

#### `vn-graph-node-menu.png` — P2 · ✅ tomada

- **Sección:** The node context menu · El menú contextual del nodo
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story
- **Qué tiene que verse:** Clic derecho SOBRE un nodo, con el menú contextual abierto y todas sus opciones legibles, incluidas las entradas de portapapeles (Copy, Cut, Paste, Duplicate) añadidas en la 1.0.0.

#### `vn-graph-colors.png` — P3 · ✅ tomada

- **Sección:** Colours · Colores
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story
- **Qué tiene que verse:** Un trozo de grafo que contenga a la vez un nodo de diálogo, uno de elección, uno de decisión, uno de flujo, un subgrafo y un Return, para que los colores se comparen entre sí. El nodo de entrada, marcado.

#### `vn-node-dialogue.png` — P1 · ✅ tomada

- **Sección:** Dialogue Node · Dialogue Node
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** El inspector de un nodo de diálogo con media docena de bloques de tipos distintos en el orden en que se ejecutan (Backdrop, Show character, dos Dialogue, un Set variable), para que se vea que un nodo es una lista de instrucciones.

#### `vn-node-choice.png` — P1 · ✅ tomada

- **Sección:** Choice Node · Choice Node
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Un nodo Choice con TRES opciones: una simple, una con condición y otra con efectos, cada una con su destino. Es la captura que enseña de qué se compone una opción.

#### `vn-node-decision.png` — P2 · ✅ tomada

- **Sección:** Decision Node · Decision Node
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Un nodo Decision con dos o tres ramas, cada una con su condición, más la rama por defecto. Que se note que aquí decide el juego y no el jugador.

#### `vn-node-flow.png` — P2 · ✅ tomada

- **Sección:** Flow (Mode Switch) Node · Flow (Mode Switch) Node
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Un nodo Flow configurado para saltar a mundo libre, con la sala destino elegida. Es el nodo que cambia de modo, y conviene verlo con datos reales.

#### `vn-node-subgraph.png` — P2 · ✅ tomada

- **Sección:** SubGraph Node · SubGraph Node
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Un nodo SubGraph con el grafo hijo asignado y dos o tres rutas de resultado dirigidas a nodos distintos, para que se entienda cómo vuelve el control.

#### `vn-node-talkmenu.png` — P3 · ✅ tomada

- **Sección:** Talk Menu Node · Talk Menu Node
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Un nodo Talk Menu con su personaje asignado, y el nodo visible en el grafo para que se reconozca su color y su forma.

### Subgraphs · Subgrafos

`/docs/beasty-visual-novel/authoring/subgraphs/` — `/es/docs/beasty-visual-novel/authoring/subgraphs/`

#### `vn-subgraph-create.png` — P3 · ✅ tomada

- **Sección:** Creating a subgraph · Crear un subgrafo
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story
- **Qué tiene que verse:** El menú contextual de un nodo con Create Subgraph resaltado, sobre un grafo que ya tenga contenido.

#### `vn-subgraph-breadcrumb.png` — P2 · ✅ tomada

- **Sección:** Navigating in and out · Entrar y salir
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, dentro de un subgrafo
- **Qué tiene que verse:** Entra en un subgrafo (mejor si está anidado dos niveles) y captura la barra con la miga de pan y el botón Up, con el grafo hijo detrás para dar contexto.

#### `vn-return-node.png` — P2 · ✅ tomada

- **Sección:** The Return node · El nodo Return
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Un nodo Return con un resultado nombrado (por ejemplo `success`) y un par de efectos, para que se entienda que el subgrafo devuelve algo con lo que decidir a la vuelta.

### The text script · El guion de texto

`/docs/beasty-visual-novel/authoring/text-script/` — `/es/docs/beasty-visual-novel/authoring/text-script/`

#### `vn-vnbeasty-file.png` — P3 · ✅ tomada

- **Sección:** What it is · Qué es
- **Vista:** Tu editor de código (VS Code o el que uses)
- **Qué tiene que verse:** Un `.vnbeasty` real abierto fuera de Unity, con una escena de veinte o treinta líneas. Es la prueba de que el guionista puede trabajar sin abrir Unity.

#### `vn-text-tab.png` — P1 · ✅ tomada

- **Sección:** Turning it on · Activarlo
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, modo Text
- **Qué tiene que verse:** La pestaña Story cambiada a Text: el alternador Graph / Text bien visible arriba y el editor con una escena escrita de verdad (varias líneas de diálogo, una elección), no dos líneas sueltas.

#### `vn-text-suggestions-headers.png` — P2 · ✅ tomada

- **Sección:** The Text tab · La pestaña Text
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, modo Text
- **Qué tiene que verse:** El panel Suggestions abierto en una línea de encabezado: el cursor en la columna 0 de una línea nueva, con la lista ofreciendo las palabras clave de tipo de nodo (label, choice, decision, subgraph, return, talkmenu, flow) más scene y start. Que detrás se vea algún encabezado ya escrito con su palabra clave coloreada con el color del tipo de nodo, para enseñar también el resaltado.

#### `vn-text-suggestions-variables.png` — P1 · ✅ tomada

- **Sección:** The Text tab · La pestaña Text
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, modo Text
- **Qué tiene que verse:** El panel Suggestions abierto con el catálogo de variables, disparado escribiendo una condición a medias (por ejemplo una línea `choice "…" if ` con el cursor detrás del `if`). Que la lista enseñe los cuatro grupos mezclados: una variable propia, un campo de personaje con punto (`ana.afecto`), un `item.<id>` y una clave reservada `@time:`. Es la foto que demuestra que al escribir a mano no hay que adivinar cómo se deletrea una clave.

#### `vn-text-import-report.png` — P1 · ✅ tomada

- **Sección:** The Text tab · La pestaña Text
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, modo Text
- **Qué tiene que verse:** La caja de informe bajo el editor tras un Save & apply que ha dejado un aviso: escribe a propósito una errata en una clave (por ejemplo `set gld += 1` en vez de `gold`) y aplica. Tiene que verse el aviso con su número de línea Y que la importación se aplicó igualmente — es justo la diferencia entre aviso y error que cuenta el párrafo.

#### `vn-text-sync-toolbar.png` — P2 · ✅ tomada

- **Sección:** How the two stay in sync · Cómo se mantienen sincronizados
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, modo Text
- **Qué tiene que verse:** Recorte de la barra del modo Text con los botones de exportar e importar, capturada en un momento en que grafo y texto HAYAN divergido, para que se vea la marca de aviso en la pestaña Graph.

### Transitions: leaving the novel · Transiciones: abandonar la novela

`/docs/beasty-visual-novel/authoring/transitions/` — `/es/docs/beasty-visual-novel/authoring/transitions/`

#### `vn-flow-blocks.png` — P2 · ✅ tomada

- **Sección:** The four exits · Las cuatro salidas
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, panel izquierdo
- **Qué tiene que verse:** Recorte de la paleta con la categoría Flow desplegada y sus cuatro bloques legibles (Go to FreeRoam, Return to room, Choose room, Go to VN scene).

#### `vn-flow-node.png` — P3 · ✅ tomada

- **Sección:** A dedicated Flow node · Un nodo Flow dedicado
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story
- **Qué tiene que verse:** Un trozo de grafo donde dos nodos distintos apuntan al MISMO nodo Flow, que es la razón de usar un nodo en vez de un bloque final.

### Core concepts · Conceptos fundamentales

`/docs/beasty-visual-novel/getting-started/core-concepts/` — `/es/docs/beasty-visual-novel/getting-started/core-concepts/`

#### `vn-context-inspector.png` — P2 · ✅ tomada

- **Sección:** VNContext - the one shared world · VNContext - el único mundo compartido
- **Vista:** Unity ▸ Inspector, con el asset VNContext seleccionado
- **Qué tiene que verse:** El inspector del VNContext con sus campos llenos (tabla de localización, personajes, ítems, catálogo de misiones, idiomas). La idea que ilustra es «esto es lo único que comparten todas las escenas».

#### `vn-beastymanager-inspector.png` — P2 · ✅ tomada

- **Sección:** BeastyManager - the one object · BeastyManager - el único objeto
- **Vista:** Unity ▸ Inspector, con el BeastyManager de la escena seleccionado
- **Qué tiene que verse:** El inspector del BeastyManager en una escena montada, con los campos asignados (Time Config, canvas principal, cámara, pantalla de carga…). Que se vea que es UN objeto del que cuelga todo.

### Editor tour · Recorrido del editor

`/docs/beasty-visual-novel/getting-started/editor-tour/` — `/es/docs/beasty-visual-novel/getting-started/editor-tour/`

#### `vn-editor-top-bar.png` — P1 · ✅ tomada

- **Sección:** The top bar · La barra superior
- **Vista:** Unity ▸ Tools > Beasty VN > Editor
- **Qué tiene que verse:** Recorte de la franja superior de la ventana, con el campo DialogueScene y el campo Context RELLENOS (con nombres reconocibles) y los tres botones de acción visibles sin colapsar en el menú `...`. Ensancha la ventana antes de capturar.

#### `vn-editor-tabs.png` — P1 · ✅ tomada

- **Sección:** The nine tabs · Las nueve pestañas
- **Vista:** Unity ▸ Tools > Beasty VN > Editor
- **Qué tiene que verse:** Recorte de la fila de pestañas con las nueve visibles y legibles (Story, Characters, Variables, Localization, Dictionary, Music, FreeRoam, Screens, Items), con Story seleccionada. Es el índice visual de toda la herramienta.

#### `vn-tab-characters.png` — P2 · ✅ tomada

- **Sección:** Characters · Characters
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters
- **Qué tiene que verse:** La pestaña completa con las cuatro sub-pestañas visibles (Cast, Variables, Quests, Talk Menu) y la lista del reparto a la izquierda con varios personajes. Aquí interesa el conjunto; el detalle de Cast ya tiene su propia captura.

#### `vn-tab-variables.png` — P1 · ✅ tomada

- **Sección:** Variables · Variables
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Variables
- **Qué tiene que verse:** La pestaña con media docena de variables de tipos distintos (Int, Bool, String, Enum) en la lista de la izquierda y una seleccionada a la derecha, con su clave, tipo, kind y valor por defecto a la vista.

#### `vn-tab-localization.png` — P1 · ✅ tomada

- **Sección:** Localization · Localization
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Localization
- **Qué tiene que verse:** La pestaña entera con el alternador Story / UI (global) arriba bien visible y la grilla debajo con dos o tres idiomas. Vista general: los detalles de la grilla tienen sus propias capturas.

#### `vn-tab-dictionary.png` — P2 · ✅ tomada

- **Sección:** Dictionary · Dictionary
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Dictionary
- **Qué tiene que verse:** La pestaña con dos o tres tokens creados (por ejemplo el nombre del jugador y su ciudad), con clave, valor por defecto y la marca de editable por el jugador a la vista.

#### `vn-tab-music.png` — P2 · ✅ tomada

- **Sección:** Music · Music
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Music
- **Qué tiene que verse:** La pestaña con las colas de los modos (menú principal, novela visual, mundo libre) y al menos una con clips asignados, para que se vean el modo de reproducción, el volumen y el crossfade.

#### `vn-tab-freeroam-map.png` — P1 · ✅ tomada

- **Sección:** FreeRoam · FreeRoam
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, modo Map
- **Qué tiene que verse:** El mapa con cuatro o cinco salas conectadas por puertas, la sala de entrada marcada, y el alternador Map / Routines visible en la barra de herramientas.

#### `vn-tab-screens.png` — P1 · ✅ tomada

- **Sección:** Screens · Screens
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** La pestaña con la lista de pantallas a la izquierda (al menos un HUD primario y un par de secundarias, entre ellas el inventario), una seleccionada, y la vista previa de su prefab a la derecha.

#### `vn-tab-items.png` — P1 · ✅ tomada

- **Sección:** Items · Items
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Items
- **Qué tiene que verse:** La pestaña con varios ítems en la lista (una llave y un par de consumibles) y uno seleccionado, con su id, icono, kind, cantidad máxima y claves de nombre y descripción visibles.

#### `vn-character-database-window.png` — P3 · ✅ tomada

- **Sección:** Character Database · Character Database
- **Vista:** Unity ▸ Tools > Beasty VN > Content > Character Database
- **Qué tiene que verse:** La ventana de Character Database acoplada AL LADO de la ventana principal con el grafo abierto, que es justo el escenario que justifica su existencia.

#### `vn-global-settings.png` — P1 · ✅ tomada

- **Sección:** Global Settings · Global Settings
- **Vista:** Unity ▸ Tools > Beasty VN > Settings > Global Settings
- **Qué tiene que verse:** La ventana entera con los ajustes desplegados: contexto global, tabla de localización de UI, idioma por defecto y autodetección, política de autoguardado, slots, límite de rebobinado y las carpetas de assets. Es la misma foto que sirve de referencia en la página de VN settings.

### Installation · Instalación

`/docs/beasty-visual-novel/getting-started/installation/` — `/es/docs/beasty-visual-novel/getting-started/installation/`

#### `vn-import-package.png` — P3 · ✅ tomada

- **Sección:** Importing · Importación
- **Vista:** Unity ▸ diálogo Import Unity Package
- **Qué tiene que verse:** El diálogo de importación con el árbol del paquete a la vista y todo marcado. Sirve para que se vea que se importa entero, sin decisiones que tomar.

#### `vn-package-folder.png` — P2 · ✅ tomada

- **Sección:** What is in the package · Qué contiene el paquete
- **Vista:** Unity ▸ ventana Project
- **Qué tiene que verse:** Assets/BeastyComponents desplegado mostrando BeastyVN, BeastySaveSystem y BeastyConsole al mismo nivel: es la prueba visual de que los otros dos vienen incluidos.

### Your first scene · Tu primera escena

`/docs/beasty-visual-novel/getting-started/your-first-scene/` — `/es/docs/beasty-visual-novel/getting-started/your-first-scene/`

#### `vn-create-scene-menu.png` — P2 · ✅ tomada

- **Sección:** 1. Build the scene · 1. Construye la escena
- **Vista:** Unity ▸ barra de menús Tools
- **Qué tiene que verse:** El menú Tools > Beasty VN > Setup desplegado, con Create Scene resaltado y los demás ítems del submenú legibles. Solo la cascada del menú.

#### `vn-first-scene-hierarchy.png` — P1 · ✅ tomada

- **Sección:** 1. Build the scene · 1. Construye la escena
- **Vista:** Unity ▸ Hierarchy, justo tras ejecutar Create Scene
- **Qué tiene que verse:** La Hierarchy inmediatamente después de `Tools > Beasty VN > Setup > Create Scene`, con BeastyManager, Stage, Canvas, Main Camera y EventSystem visibles. Recorta solo el panel Hierarchy.

#### `vn-first-character.png` — P2 · ✅ tomada

- **Sección:** 4. Create a character · 4. Crea un personaje
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Cast
- **Qué tiene que verse:** El personaje del tutorial recién creado con + New Character: id, nombre visible y UNA expresión `base` con su sprite asignado. Estado mínimo, no un personaje completo: es lo que el lector acaba de hacer.

#### `vn-story-tab-first-node.png` — P1 · ✅ tomada

- **Sección:** 5. Write two lines · 5. Escribe dos líneas
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story
- **Qué tiene que verse:** La pestaña Story con el primer nodo seleccionado y cuatro bloques dentro (un Backdrop y tres de Dialogue), tal y como los deja el paso a paso de esta página. Deben verse los tres paneles: paleta, grafo e inspector del nodo.

#### `vn-first-choice-node.png` — P1 · ✅ tomada

- **Sección:** 6. Add a choice · 6. Agrega una elección
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story
- **Qué tiene que verse:** El grafo con el nodo de diálogo inicial, un nodo Choice con DOS opciones y las dos aristas saliendo hacia sus nodos destino, más el inspector del Choice a la derecha con las dos etiquetas escritas. Se debe entender la forma de una bifurcación de un vistazo.

#### `vn-first-play.png` — P1 · ✅ tomada

- **Sección:** 7. Press Play · 7. Presiona Play
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La Game view en Play mostrando la primera línea: fondo, el personaje en escena, la placa con su nombre y el texto en la caja de diálogo, con el indicador de continuar visible. Captura solo la Game view, sin la interfaz de Unity alrededor.

#### `vn-validate-report.png` — P2 · ✅ tomada

- **Sección:** Validate · Valida
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ botón Validate (informe en la consola o en la ventana)
- **Qué tiene que verse:** El resultado de pulsar Validate en un proyecto que tenga a propósito un par de problemas (una referencia colgada, una clave sin texto de origen), para que el informe tenga líneas de verdad y no solo un «todo bien».

### Audio and music · Audio y música

`/docs/beasty-visual-novel/production/audio-and-music/` — `/es/docs/beasty-visual-novel/production/audio-and-music/`

#### `vn-mixer.png` — P3 · ✅ tomada

- **Sección:** The four channels · Los cuatro canales
- **Vista:** Unity ▸ ventana Audio Mixer
- **Qué tiene que verse:** El mixer abierto mostrando el grupo Master y debajo Music, Ambient, Sfx y Voice, con los parámetros expuestos a la vista si es posible.

#### `vn-block-music.png` — P2 · ✅ tomada

- **Sección:** The audio blocks · Los bloques de audio
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Un bloque de audio desplegado con el clip asignado y sus opciones; mejor si al lado hay un bloque de otro canal (Ambient o Sfx) para comparar.

#### `vn-tab-music.png` — P2 · ✅ tomada

- **Sección:** Background music per app mode · Música de fondo por modo de app
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Music
- **Qué tiene que verse:** Reutiliza la captura de la pestaña Music del recorrido por el editor.

#### `vn-background-music-foldout.png` — P2 · ✅ tomada

- **Sección:** Background music per app mode · Música de fondo por modo de app
- **Vista:** Unity ▸ Inspector, con el BeastyManager de la escena seleccionado
- **Qué tiene que verse:** Recorte del inspector del BeastyManager con el desplegable Background Music ABIERTO y el toggle Keep Previous When Empty visible (mejor desactivado, que es el valor con el que una cola vacía significa silencio). Solo el desplegable y un poco de contexto alrededor, no el inspector entero.

### Building and platforms · Compilación y plataformas

`/docs/beasty-visual-novel/production/building-and-platforms/` — `/es/docs/beasty-visual-novel/production/building-and-platforms/`

#### `vn-aspect-ratio.png` — P3 · ✅ tomada

- **Sección:** Aspect ratio and resolution · Relación de aspecto y resolución
- **Vista:** Unity ▸ Inspector del BeastyAspectRatioEnforcer, o la sección de resolución de Global Settings
- **Qué tiene que verse:** Los campos que fijan la relación de aspecto y la resolución de referencia, con valores reales puestos.

#### `vn-loading-screen.png` — P3 · ✅ tomada

- **Sección:** The loading screen · La pantalla de carga
- **Vista:** Unity ▸ Game view en Play, al arrancar
- **Qué tiene que verse:** La pantalla de carga tal y como se ve al arrancar, antes de que aparezca el menú principal.

### Input and controls · Entrada y controles

`/docs/beasty-visual-novel/production/input-and-controls/` — `/es/docs/beasty-visual-novel/production/input-and-controls/`

#### `vn-input-config.png` — P2 · ✅ tomada

- **Sección:** Rebinding in the editor · Reasignar en el editor
- **Vista:** Unity ▸ Inspector, con el asset de configuración de entrada seleccionado
- **Qué tiene que verse:** El asset con la lista completa de acciones y las teclas asignadas a cada una, que es la tabla de esta página en su forma real.

#### `vn-input-rebind-ingame.png` — P3 · ✅ tomada

- **Sección:** Rebinding by the player · Reasignación por parte del jugador
- **Vista:** Unity ▸ Game view en Play, pantalla de preferencias
- **Qué tiene que verse:** La pantalla donde el jugador reasigna controles, a poder ser en el momento en que espera a que pulses una tecla.

### Localization · Localización

`/docs/beasty-visual-novel/production/localization/` — `/es/docs/beasty-visual-novel/production/localization/`

#### `vn-localization-tabs.png` — P1 · ✅ tomada

- **Sección:** The two tables · Las dos tablas
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Localization
- **Qué tiene que verse:** La pestaña con el alternador Story / UI (global) bien visible y la grilla de la tabla de historia debajo. Es la captura que enseña que hay DOS tablas y dónde se cambia de una a otra.

#### `vn-localization-add-language.png` — P1 · ✅ tomada

- **Sección:** Adding a language · Agregar un idioma
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Localization
- **Qué tiene que verse:** Pulsa + Add Language y captura el desplegable ABIERTO con la lista de idiomas curados, los ya presentes en gris, la opción Custom… al final y, si tienes alguno en la papelera, su etiqueta `(restore)`.

#### `vn-localization-trash.png` — P1 · ✅ tomada

- **Sección:** Deleting a language, and getting it back · Eliminar un idioma, y recuperarlo
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Localization
- **Qué tiene que verse:** Elimina un idioma (confirmando el diálogo) y captura el desplegable «Deleted languages (1)» ABIERTO, con la fila del idioma y sus botones Restore y Delete permanently. Si puedes hacer dos capturas, la otra buena es el diálogo de confirmación al borrar el idioma PRINCIPAL, que nombra a su sucesor.

#### `vn-localization-staleness.png` — P1 · ✅ tomada

- **Sección:** Staleness: knowing which translations went out of date · Desactualización: saber qué traducciones quedaron obsoletas
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Localization
- **Qué tiene que verse:** Un trozo de grilla donde convivan los CUATRO estados: la columna de origen, una celda sin traducir, una desactualizada (edita un texto de origen ya traducido para provocarla) y otra al día. Con la barra de filtros visible arriba.

#### `vn-localization-grid.png` — P1 · ✅ tomada

- **Sección:** Working in the grid · Trabajar en la grilla
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Localization
- **Qué tiene que verse:** La grilla con tres idiomas y una docena de claves reales de diálogo, con la barra de herramientas visible (Import CSV…, selector de sección, Export ▾, Fill identical texts, Unused keys y el contador de claves).

#### `vn-localization-export-menu.png` — P2 · ✅ tomada

- **Sección:** Import and export · Importar y exportar
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Localization
- **Qué tiene que verse:** El menú de Export ABIERTO mostrando los tres alcances, con el de «Missing or stale only (N)» enseñando un número de verdad (elige una sección antes para que la opción de sección no salga deshabilitada).

#### `vn-localization-bake.png` — P1 · ⬜ pendiente

- **Sección:** Bake Localized UI Labels · Bake Localized UI Labels
- **Vista:** Unity ▸ pestaña Localization ▸ UI ▸ botón Bake scene labels (o Tools > Beasty VN > Setup > Bake Localized UI Labels)
- **Qué tiene que verse:** Ejecuta el bake en una escena con menús y captura el diálogo de resultado, que dice cuántas etiquetas se enlazaron y cuántas fueron dentro de prefabs de origen. Con la barra de la pestaña UI detrás, donde se ve el botón Bake scene labels.

#### `vn-localized-text-inspector.png` — P1 · ⬜ pendiente

- **Sección:** Wiring one label by hand · Enganchar una etiqueta a mano
- **Vista:** Unity ▸ Inspector de una etiqueta con VNLocalizedText
- **Qué tiene que verse:** El inspector con una clave ya elegida: el selector de clave arriba, el campo Source text con texto, y los botones From label y To label. Si consigues una segunda captura, la buena es la de una etiqueta SIN clave todavía, donde aparece el botón «Create key from this text → ui.algo».

#### `vn-localization-repair.png` — P2 · ⬜ pendiente

- **Sección:** When the interface is stuck in one language · Cuando la interfaz se queda en un solo idioma
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Localization ▸ UI (global)
- **Qué tiene que verse:** Con una tabla de UI cuya columna #0 no sea `en`, captura el aviso amarillo y el botón «Make English the source and fill missing defaults» justo encima de la barra de herramientas.

#### `vn-preferences-language-ingame.png` — P1 · ✅ tomada

- **Sección:** Switching language while the game runs · Cambiar de idioma mientras el juego se ejecuta
- **Vista:** Unity ▸ Game view en Play, pantalla de preferencias
- **Qué tiene que verse:** La pantalla de preferencias en marcha con el desplegable de idioma ABIERTO, mostrando los nombres curados (English, Spanish…). Si puedes, una segunda captura del menú ya traducido tras elegir otro idioma.

### Logging · Logging

`/docs/beasty-visual-novel/production/logging/` — `/es/docs/beasty-visual-novel/production/logging/`

#### `vn-log-categories.png` — P2 · ✅ tomada

- **Sección:** Categories · Categorías
- **Vista:** Unity ▸ Tools > Beasty Console > Console, con una escena en Play
- **Qué tiene que verse:** La consola con logs de varias categorías de la VN a la vez (Data, Director, Stage, Streaming, Save, Verbose), para que se vea cómo va etiquetado cada mensaje.

#### `vn-log-switches.png` — P2 · ✅ tomada

- **Sección:** Setting the switches so they stick · Poner los interruptores para que se queden puestos
- **Vista:** Unity ▸ donde vivan los interruptores de log de la VN (ventana de diagnóstico o ajustes)
- **Qué tiene que verse:** Los interruptores por categoría con alguno APAGADO y el interruptor maestro a la vista, que es lo que hay que dejar guardado para que persista.

### Saving and loading · Guardado y carga

`/docs/beasty-visual-novel/production/saving-and-loading/` — `/es/docs/beasty-visual-novel/production/saving-and-loading/`

#### `vn-save-load-ingame.png` — P1 · ✅ tomada

- **Sección:** Slots · Slots
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La pantalla de guardar/cargar con varios slots ocupados (con su miniatura, la fecha y el capítulo) y alguno vacío. Si el autoguardado tiene su propio slot, que se vea.

#### `vn-autosave-settings.png` — P2 · ✅ tomada

- **Sección:** Autosave · Autoguardado
- **Vista:** Unity ▸ Tools > Beasty VN > Settings > Global Settings
- **Qué tiene que verse:** Recorte de la sección de guardado: política de autoguardado, número de slots y límite de rebobinado.

### Streaming (Addressables) · Streaming (Addressables)

`/docs/beasty-visual-novel/production/streaming/` — `/es/docs/beasty-visual-novel/production/streaming/`

#### `vn-streaming-settings.png` — P2 · ✅ tomada

- **Sección:** Turning it on · Cómo activarlo
- **Vista:** Unity ▸ Tools > Beasty VN > Streaming (o el ajuste correspondiente en Global Settings)
- **Qué tiene que verse:** El interruptor de streaming en su sitio real, con el aviso de beta a la vista si lo hay. Que se entienda que es reversible.

### UI prefabs · Prefabs de UI

`/docs/beasty-visual-novel/production/ui-prefabs/` — `/es/docs/beasty-visual-novel/production/ui-prefabs/`

#### `vn-ui-prefabs-folder.png` — P2 · ✅ tomada

- **Sección:** The prefabs · Los prefabs
- **Vista:** Unity ▸ ventana Project
- **Qué tiene que verse:** `BeastyVN/Prefabs/` desplegada con los prefabs visibles y legibles, y también `Runtime/UI/Prefabs/`, donde viven VNMenuRoot y VNBacklogEntry.

#### `vn-upgrade-prefabs.png` — P2 · ✅ tomada

- **Sección:** The two prefab menu items · Los dos elementos de menú de prefabs
- **Vista:** Unity ▸ Tools > Beasty VN > Setup > Build Default Menu Prefabs / Upgrade UI Prefabs
- **Qué tiene que verse:** El diálogo de aviso que sale antes de sobrescribir, con el texto legible. Es la captura que evita el «no sabía que iba a pisar mi rediseño».

#### `vn-black-screen-fix.png` — P1 · ⬜ pendiente

- **Sección:** The black screen, and the button that fixes it · La pantalla negra, y el botón que la arregla
- **Vista:** Unity ▸ Game view en Play + el botón de arreglo en la ventana de Beasty VN
- **Qué tiene que verse:** Dos cosas en una: la pantalla negra tal y como la ve quien tiene el problema y, al lado o en una segunda captura, el botón que lo corrige, con su texto legible.

### Validation and ids · Validación e ids

`/docs/beasty-visual-novel/production/validation-and-ids/` — `/es/docs/beasty-visual-novel/production/validation-and-ids/`

#### `vn-validator-report.png` — P1 · ✅ tomada

- **Sección:** The validator · El validador
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ botón Validate
- **Qué tiene que verse:** El informe con varias entradas de tipos distintos (una escena que falta, una clave sin texto, un id duplicado), para que se vea el formato de los mensajes y que dicen dónde está el problema.

#### `vn-duplicate-ids.png` — P3 · ✅ tomada

- **Sección:** Duplicate ids · Ids duplicados
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ botón Validate
- **Qué tiene que verse:** Recorte del informe centrado en un id duplicado, con los dos elementos que lo comparten nombrados.

### VN settings · VN settings

`/docs/beasty-visual-novel/production/vn-settings/` — `/es/docs/beasty-visual-novel/production/vn-settings/`

#### `vn-settings-inspector.png` — P1 · ✅ tomada

- **Sección:** Shared context · Contexto compartido
- **Vista:** Unity ▸ Tools > Beasty VN > Settings > Global Settings (o Edit > Project Settings > Beasty VN)
- **Qué tiene que verse:** El asset entero con todas las secciones desplegadas: contexto compartido, localización, guardado, rebobinado, scripts de texto, valores por defecto de diálogo, velocidades, escenario, resolución, feedback de botones y límites blandos. Si no cabe, dos capturas: mitad de arriba y mitad de abajo.

#### `vn-settings-text.png` — P3 · ✅ tomada

- **Sección:** Dialogue and text defaults · Diálogo y valores predeterminados de texto
- **Vista:** Unity ▸ Tools > Beasty VN > Settings > Global Settings
- **Qué tiene que verse:** Recorte de la sección de texto: valores por defecto del diálogo y los rangos de velocidad de texto y de avance automático.

#### `vn-settings-stage.png` — P3 · ✅ tomada

- **Sección:** Stage · Escenario
- **Vista:** Unity ▸ Tools > Beasty VN > Settings > Global Settings
- **Qué tiene que verse:** Recorte de la sección Stage con sus campos, junto con los de resolución y tamaño de sprites si quedan cerca.

### Assets reference · Referencia de assets

`/docs/beasty-visual-novel/reference/assets/` — `/es/docs/beasty-visual-novel/reference/assets/`

#### `vn-assets-project.png` — P2 · ✅ tomada

- **Sección:** How many of each · Cuántos de cada uno
- **Vista:** Unity ▸ ventana Project
- **Qué tiene que verse:** La carpeta de un proyecto de VN de verdad con sus assets ordenados en subcarpetas: DialogueScene, VNContext, StoryGraph, LocalizationTable, VNSettings, configuraciones y catálogos. Es la foto de «cuántos de cada uno hay».

### Menu items · Menús

`/docs/beasty-visual-novel/reference/menu-items/` — `/es/docs/beasty-visual-novel/reference/menu-items/`

#### `vn-tools-menu.png` — P1 · ✅ tomada

- **Sección:** Windows · Ventanas
- **Vista:** Unity ▸ barra de menús Tools
- **Qué tiene que verse:** El menú Tools > Beasty VN abierto con TODOS sus submenús desplegados si tu sistema lo permite (Setup, Content, Codegen, Maintenance, Validate, Settings, Streaming, Export). Si no caben todos, captura el primer nivel completo: esta imagen es el mapa de la tabla entera de la página.

### Prefabs · Prefabs

`/docs/beasty-visual-novel/reference/prefabs/` — `/es/docs/beasty-visual-novel/reference/prefabs/`

#### `vn-prefabs-folder.png` — P2 · ✅ tomada

- **Sección:** Lookup table · Tabla de consulta
- **Vista:** Unity ▸ ventana Project
- **Qué tiene que verse:** Los prefabs del paquete listados con sus nombres legibles, para poder cruzarlos con la tabla de esta página. Puede ser la misma captura que la de la página de prefabs de UI si prefieres tomar solo una.

### Generated accessors: VNVars and VNChars · Accesores generados: VNVars y VNChars

`/docs/beasty-visual-novel/scripting/generated-accessors/` — `/es/docs/beasty-visual-novel/scripting/generated-accessors/`

#### `vn-generated-vnvars.png` — P3 · ✅ tomada

- **Sección:** What they look like · Cómo se ven
- **Vista:** Tu editor de código
- **Qué tiene que verse:** `VNVars.cs` (o `VNChars.cs`) recién generado, con las constantes tipadas a la vista, para que se entienda qué produce Codegen y por qué evita escribir claves a mano.

### Character routines · Rutinas de personajes

`/docs/beasty-visual-novel/world/character-routines/` — `/es/docs/beasty-visual-novel/world/character-routines/`

#### `vn-routine-profiles.png` — P2 · ✅ tomada

- **Sección:** Profiles: swapping a whole schedule in one block · Perfiles: cambiar todo un horario de un solo bloque
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, modo Routines
- **Qué tiene que verse:** El filtro de perfil con DOS perfiles creados para el mismo personaje (por ejemplo `Default` y `Fired`) y el nombre del perfil por defecto a la vista.

#### `vn-routine-rules.png` — P2 · ✅ tomada

- **Sección:** Rules: first match wins · Reglas: gana la primera coincidencia
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, modo Routines
- **Qué tiene que verse:** La lista de reglas de un perfil: tres o cuatro reglas condición+sala en orden y, abajo, el fallback con la sala VACÍA, que es como se dice «no está en ninguna parte».

#### `vn-routine-grid.png` — P1 · ✅ tomada

- **Sección:** The routine grid editor · El editor de grilla de rutinas
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, modo Routines
- **Qué tiene que verse:** La grilla llena de un personaje: la fila General arriba, las filas de momento del día con celdas de varias salas, la fila Fallback abajo, y la barra de filtros (Character, Room, Day, Profile) visible. Con alguna celda seleccionada y su inspector de colocación a la derecha.

#### `vn-room-timeline.png` — P2 · ✅ tomada

- **Sección:** Rooms are not the only way to be somewhere · Las salas no son la única forma de estar en algún sitio
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, con una sala abierta
- **Qué tiene que verse:** La línea de tiempo dentro de una sala, con un carril por momento del día, algún personaje ya añadido en uno de ellos y el botón + Character visible. Es la otra cara de la grilla de rutinas.

#### `vn-routine-calendar-ingame.png` — P2 · ⬜ pendiente

- **Sección:** The in-game routine calendar · El calendario de rutina dentro del juego
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La pantalla de rutina de un personaje en vista de semana: momentos del día en filas, días en columnas, con la columna de hoy tintada y el momento actual resaltado con más fuerza.

### Character screens · Pantallas de personaje

`/docs/beasty-visual-novel/world/character-screens/` — `/es/docs/beasty-visual-novel/world/character-screens/`

#### `vn-cast-list-ingame.png` — P1 · ✅ tomada

- **Sección:** The cast list · La lista de reparto
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La lista del reparto abierta con cuatro o cinco personajes visibles (y alguno todavía oculto por su condición, si se nota), tal y como la ve el jugador.

#### `vn-profile-ingame.png` — P1 · ✅ tomada

- **Sección:** The profile · El perfil
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** El perfil de un personaje abierto, con su retrato y nombre en la cabecera y la barra de pestañas debajo, con la primera pestaña seleccionada.

#### `vn-stats-ingame.png` — P1 · ✅ tomada

- **Sección:** The stats screen · La pantalla de estadísticas
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La pantalla de estadísticas con varias filas: alguna de solo lectura, alguna con botones + y −, y algún interruptor de un campo booleano. Si el personaje tiene activado Show current location, que se vea también la línea de ubicación.

#### `vn-routine-calendar-ingame.png` — P2 · ⬜ pendiente

- **Sección:** The routine calendar · El calendario de rutina
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** Reutiliza la captura del calendario de rutinas de la página de rutinas de personaje.

#### `vn-quest-log-ingame.png` — P1 · ✅ tomada

- **Sección:** The quest log · El registro de misiones
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** El registro de misiones de un personaje con una misión activa, sus objetivos (alguno ya marcado como hecho) y la pista del objetivo ACTUAL visible, con los siguientes todavía ocultos. Si hay una entrega pendiente, que se vea el botón Deliver.

### Characters · Personajes

`/docs/beasty-visual-novel/world/characters/` — `/es/docs/beasty-visual-novel/world/characters/`

#### `vn-characters-cast.png` — P1 · ✅ tomada

- **Sección:** Creating a character · Crear un personaje
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Cast
- **Qué tiene que verse:** La sub-pestaña Cast con un personaje seleccionado y su ficha desplegada: id, nombre visible, colores, categoría, etiquetas y la lista de expresiones. A la izquierda, un reparto de varios personajes.

#### `vn-character-identity.png` — P2 · ✅ tomada

- **Sección:** Identity · Identidad
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Cast
- **Qué tiene que verse:** Recorte del bloque de identidad con todos los campos rellenos, incluidos los dos colores (que se vean las muestras de color) y un par de etiquetas añadidas.

#### `vn-character-expressions.png` — P1 · ✅ tomada

- **Sección:** Expressions and portraits · Expresiones y retratos
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Cast
- **Qué tiene que verse:** Las dos listas a la vez, con al menos tres claves iguales en ambas (`base`, `sad`, `angry`) y sus miniaturas visibles, para que se vea que son dos juegos de sprites que comparten nombre.

#### `vn-character-delivery.png` — P2 · ✅ tomada

- **Sección:** Delivery styles · Estilos de interpretación
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Cast
- **Qué tiene que verse:** Un estilo de entrega desplegado (por ejemplo Shout) con la fuente, el color forzado, el multiplicador de tamaño, el prefijo/sufijo de nombre y el efecto de texto elegidos.

#### `vn-character-aliases.png` — P3 · ✅ tomada

- **Sección:** Aliases: showing a different name · Alias: mostrar un nombre distinto
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Cast
- **Qué tiene que verse:** La lista de alias con dos o tres entradas del tipo «El Desconocido», «La Voz», que es el caso de uso que explica la página.

#### `vn-character-variables.png` — P1 · ✅ tomada

- **Sección:** Character variables (stats) · Variables de personaje (estadísticas)
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Variables
- **Qué tiene que verse:** La sub-pestaña con las DOS zonas visibles: los campos universales del esquema (por ejemplo `affection`, `met`) y los campos propios del personaje seleccionado. Que se vean las marcas Show on stats y Editable, y a poder ser un valor por defecto sobrescrito para este personaje.

#### `vn-character-freeroam-sprite.png` — P2 · ⬜ pendiente

- **Sección:** The free-roam sprite · El sprite FreeRoam
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Cast
- **Qué tiene que verse:** Recorte con el sprite de mundo libre asignado (miniatura visible) y, justo debajo, los dos interruptores: Show current location y Show routine.

### The dictionary · El diccionario

`/docs/beasty-visual-novel/world/dictionary/` — `/es/docs/beasty-visual-novel/world/dictionary/`

#### `vn-dictionary-entry.png` — P2 · ⬜ pendiente

- **Sección:** Creating an entry · Crear una entrada
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Dictionary
- **Qué tiene que verse:** Una entrada seleccionada con su clave, su valor por defecto y la marca de editable por el jugador activada. Con otras dos o tres entradas en la lista para dar contexto.

#### `vn-dictionary-ingame.png` — P3 · ⬜ pendiente

- **Sección:** Using it in a line · Usarlo en una línea
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** Una línea de diálogo que use un `[token]` mostrada ya resuelta en pantalla, idealmente con un valor que el jugador haya escrito, para que se vea que el texto sale sustituido y no con corchetes.

### Free-roam rooms · Salas de mundo libre

`/docs/beasty-visual-novel/world/free-roam-rooms/` — `/es/docs/beasty-visual-novel/world/free-roam-rooms/`

#### `vn-freeroam-map.png` — P1 · ✅ tomada

- **Sección:** The map graph · El grafo del mapa
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, modo Map
- **Qué tiene que verse:** El mapa con cinco o seis salas conectadas y la sala de entrada claramente marcada. Que se vea la barra de herramientas con el alternador Map / Routines y el botón Fix backgrounds.

#### `vn-room-settings.png` — P1 · ✅ tomada

- **Sección:** What a room is · Qué es una sala
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, con una sala abierta
- **Qué tiene que verse:** El editor de una sala concreta (doble clic sobre ella en el mapa) con sus campos a la vista: id, nombre visible, fondo por defecto, prefab de la sala y la lista de objetos y puertas.

#### `vn-room-create.png` — P2 · ✅ tomada

- **Sección:** Creating a room and its prefab together · Crear una sala y su prefab juntos
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, modo Map
- **Qué tiene que verse:** El momento de crear una sala: el menú contextual con Create Room, o mejor aún el diálogo de guardado del prefab que sale inmediatamente después, porque es el paso que sorprende.

#### `vn-room-backgrounds.png` — P1 · ✅ tomada

- **Sección:** Conditional backgrounds · Fondos condicionales
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, con una sala abierta
- **Qué tiene que verse:** La sección «Background by time & presence» con la sección Any time y al menos dos secciones de momento del día rellenas, cada caso con su sprite, sus personajes presentes y sus días. Que se note el orden de los casos, porque el primero que pasa gana.

#### `vn-room-prefab.png` — P2 · ✅ tomada

- **Sección:** The room prefab · El prefab de la sala
- **Vista:** Unity ▸ modo de edición de prefab
- **Qué tiene que verse:** El prefab de una sala abierto en modo prefab: la vista de escena con el fondo y los objetos colocados, y la Hierarchy al lado mostrando el raíz con `FreeRoamRoom`, el hijo `Background` y varios objetos cuyos nombres son sus ids.

#### `vn-room-spots.png` — P2 · ✅ tomada

- **Sección:** Character spots · Puntos de personaje
- **Vista:** Unity ▸ modo de edición de prefab
- **Qué tiene que verse:** El prefab de la sala con dos o tres hijos con `FreeRoamCharacterSpot`, seleccionados para que se vean sus gizmos en la escena, y sus nombres (que son sus ids) en la Hierarchy.

#### `vn-freeroam-ingame.png` — P1 · ⬜ pendiente

- **Sección:** Entering a room from the story, and leaving again · Entrar en una sala desde la historia, y volver a salir
- **Vista:** Unity ▸ Game view en Play, en mundo libre
- **Qué tiene que verse:** Una sala jugable con su fondo, un par de objetos clicables, una puerta y un personaje colocado por su rutina. Con el HUD encima, si lo tienes. Es la foto que responde a «¿qué es el mundo libre?».

### Game time · Tiempo de juego

`/docs/beasty-visual-novel/world/game-time/` — `/es/docs/beasty-visual-novel/world/game-time/`

#### `vn-time-config-assign.png` — P1 · ✅ tomada

- **Sección:** Turning time on · Activar el tiempo
- **Vista:** Unity ▸ Inspector del BeastyManager
- **Qué tiene que verse:** Recorte del inspector del BeastyManager con el campo Time Config RELLENO. Es el campo que, vacío, apaga todo el sistema de tiempo: que se identifique sin dudas.

#### `vn-time-config-inspector.png` — P1 · ✅ tomada

- **Sección:** Every field of the Time Config · Todos los campos de Time Config
- **Vista:** Unity ▸ Inspector, con un asset Time Config seleccionado
- **Qué tiene que verse:** El asset con todos los campos de la tabla de esta página a la vista: modo, la lista de momentos del día (con sus horas de inicio si estás en modo Clock), horas por día, días de la semana, estaciones, días por estación y el día/momento inicial.

#### `vn-block-advance-time.png` — P2 · ✅ tomada

- **Sección:** The Advance time block · El bloque Advance time
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** El bloque con el desplegable de operación ABIERTO, para que se vean las seis operaciones (AdvanceDayparts, AdvanceHours, AdvanceDays, SetDaypart, SetHour, SetWeekday), dentro de un nodo de dormir.

#### `vn-time-hud-ingame.png` — P2 · ⬜ pendiente

- **Sección:** From a HUD button · Desde un botón del HUD
- **Vista:** Unity ▸ Game view en Play, en mundo libre
- **Qué tiene que verse:** El HUD en marcha con una etiqueta ligada a `time.day` y otra a `time.daypart`, y a ser posible el botón cuya acción es AdvanceTime, que es de lo que habla esta sección.

### Interactables and doors · Interactuables y puertas

`/docs/beasty-visual-novel/world/interactables-and-doors/` — `/es/docs/beasty-visual-novel/world/interactables-and-doors/`

#### `vn-room-object-inspector.png` — P1 · ✅ tomada

- **Sección:** Kind and function · Tipo y función
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, con una sala abierta y un objeto seleccionado
- **Qué tiene que verse:** La ficha de un objeto de tipo Interaction con función Enter VN: que se vean el kind, la función, la escena elegida y el nodo de inicio, además de sus campos de arte y posición.

#### `vn-object-hover.png` — P2 · ⬜ pendiente

- **Sección:** Hover feedback · Efecto al pasar el cursor
- **Vista:** Unity ▸ pestaña FreeRoam (ajustes) + Game view en Play (resultado)
- **Qué tiene que verse:** Los ajustes de Hover feedback con el modo elegido y Zoom on hover activado; si puedes, la misma captura junto al efecto en el juego con el mouse sobre el objeto (tintado o sprite cambiado).

#### `vn-door-inspector.png` — P1 · ✅ tomada

- **Sección:** Doors · Puertas
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, con una sala abierta y una puerta seleccionada
- **Qué tiene que verse:** Una puerta de tipo Navigation con todos sus campos: sala destino, id de pasaje, Accessible desactivado y un diálogo de bloqueo asignado, más al menos UNA excepción de acceso condicional debajo.

#### `vn-object-conditional-vn.png` — P3 · ⬜ pendiente

- **Sección:** Conditional VN: the same object, a different scene · VN condicional: el mismo objeto, una escena distinta
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, con una sala abierta y un objeto seleccionado
- **Qué tiene que verse:** La lista de casos condicionales de un objeto Enter VN con el ejemplo de la cama: un caso con `time.daypart == Night` apuntando a la escena de dormir y la escena por defecto debajo.

#### `vn-room-character-pose.png` — P2 · ⬜ pendiente

- **Sección:** Character poses · Poses de personaje
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña FreeRoam, con una sala abierta
- **Qué tiene que verse:** Un objeto con personaje propietario y DOS poses en la lista, cada una con su sprite y su condición, para que se vea que solo se dibuja la primera que pasa.

#### `vn-tight-click-shapes.png` — P3 · ⬜ pendiente

- **Sección:** Tight click shapes · Áreas de clic ajustadas
- **Vista:** Unity ▸ Tools > Beasty VN > Content > Generate Tight Click Shapes (Selection)
- **Qué tiene que verse:** El menú desplegado con el ítem resaltado y, en el Project, los sprites seleccionados de fondo. Mejor todavía si acompañas el resultado: el área de clic ajustada a la silueta en lugar de a la caja.

### Items and inventory · Objetos e inventario

`/docs/beasty-visual-novel/world/items-and-inventory/` — `/es/docs/beasty-visual-novel/world/items-and-inventory/`

#### `vn-items-tab.png` — P1 · ✅ tomada

- **Sección:** Defining an item · Definir un objeto
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Items
- **Qué tiene que verse:** Un ítem consumible seleccionado con todos sus campos rellenos y el icono a la vista, y en la lista de la izquierda al menos un ítem de tipo Key para que se vean los dos kinds.

#### `vn-item-onuse.png` — P2 · ✅ tomada

- **Sección:** On use · Al usar
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Items
- **Qué tiene que verse:** La sección On use desplegada con una condición de uso, un par de efectos, una escena de salto y la cantidad a consumir. La poción es el ejemplo perfecto.

#### `vn-inventory-ingame.png` — P1 · ✅ tomada

- **Sección:** The inventory screen · La pantalla de inventario
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** El inventario abierto con cuatro o cinco ítems (alguno con cantidad mayor que 1, para que se vea el contador) y el popup de detalle abierto sobre uno, mostrando icono, nombre, descripción y el botón Use.

#### `vn-screens-add-inventory.png` — P3 · ✅ tomada

- **Sección:** Adding it and opening it · Añadirla y abrirla
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** Recorte de la barra de la lista de pantallas con los botones de creación visibles (+ Primary, + Secondary, + Inventory (ready-made), + Menu, + Characters) y el del inventario señalado.

### Quests · Misiones

`/docs/beasty-visual-novel/world/quests/` — `/es/docs/beasty-visual-novel/world/quests/`

#### `vn-quest-editor.png` — P1 · ✅ tomada

- **Sección:** A quest · Una misión
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Quests
- **Qué tiene que verse:** La sub-pestaña con varias misiones en la lista de la izquierda (filtradas por dueño) y una seleccionada con su ficha entera a la derecha: id, título, descripción, dueño, categoría, modo de orden, recurrencia, umbral, condiciones de inicio y fallo, y recompensas.

#### `vn-quest-stages.png` — P3 · ✅ tomada

- **Sección:** Stages, and what "ordered" means · Etapas, y qué significa "ordenado"
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Quests
- **Qué tiene que verse:** Una misión en modo Ordered con cuatro objetivos, para que se vea el orden en que se desbloquean y cuáles son obligatorios.

#### `vn-quest-objective.png` — P1 · ✅ tomada

- **Sección:** Objectives · Objetivos
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Quests
- **Qué tiene que verse:** Un objetivo desplegado (id, descripción, pista, obligatorio) con el desplegable Type ABIERTO enseñando los ocho tipos. Es la tabla de esta página convertida en imagen.

#### `vn-quest-talk-step.png` — P2 · ✅ tomada

- **Sección:** The talk step · El paso de conversación
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Quests
- **Qué tiene que verse:** La sección «Talk step (character menu)» desplegada con la escena y el nodo elegidos y Complete on talk activado. Es lo que hace que el paso aparezca solo en el menú de conversación.

#### `vn-quest-marker.png` — P3 · ⬜ pendiente

- **Sección:** The map marker · El marcador de mapa
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Quests
- **Qué tiene que verse:** La sección del marcador con un sprite asignado y al menos un caso condicional debajo, para que se vea que puede cambiar según el estado del mundo.

#### `vn-quest-routine-override.png` — P2 · ⬜ pendiente

- **Sección:** The routine override · La anulación de rutina
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Quests
- **Qué tiene que verse:** La sección «Move character while current» activada, con la sala destino y las listas de días y momentos del día marcadas. Es el «quedamos en el muelle a medianoche» sin escribir código.

### Screens and HUD · Pantallas y HUD

`/docs/beasty-visual-novel/world/screens-and-hud/` — `/es/docs/beasty-visual-novel/world/screens-and-hud/`

#### `vn-tab-screens.png` — P2 · ✅ tomada

- **Sección:** Two kinds of screen · Dos tipos de pantalla
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** Reutiliza la captura de la pestaña Screens del recorrido por el editor.

#### `vn-hud-ingame.png` — P1 · ✅ tomada

- **Sección:** Where a screen shows up · Dónde aparece una pantalla
- **Vista:** Unity ▸ Game view en Play, en mundo libre
- **Qué tiene que verse:** El HUD primario en marcha sobre una sala: un contador ligado a una variable (`Money: 120`), una etiqueta de tiempo y un par de botones (inventario, personajes). Es la foto de «pantalla primaria».

#### `vn-screen-item.png` — P1 · ✅ tomada

- **Sección:** Items · Elementos
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** El elemento del contador de dinero desplegado: Text = `Money: `, Variable = `gold`, su condición de visibilidad y al menos un caso de variante condicional con icono distinto. Es el ejemplo que la página cuenta con palabras.

#### `vn-screen-button-action.png` — P2 · ✅ tomada

- **Sección:** Actions · Acciones
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** Un elemento Button con el desplegable de acción ABIERTO mostrando las seis acciones (OpenScreen, Close, Back, Custom, EnterVN, AdvanceTime), y sus efectos de clic debajo si los tiene.

#### `vn-screen-preview.png` — P2 · ✅ tomada

- **Sección:** Preview · Vista previa
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** La vista previa del prefab de una pantalla renderizada junto a sus ajustes, con el desplegable «Hierarchy (who opens what)» ABIERTO mostrando qué botón abre qué pantalla.

### The talk menu · El menú de conversación

`/docs/beasty-visual-novel/world/talk-menu/` — `/es/docs/beasty-visual-novel/world/talk-menu/`

#### `vn-talk-menu-tab.png` — P1 · ✅ tomada

- **Sección:** Where you author it · Dónde lo editas
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Talk Menu
- **Qué tiene que verse:** La sub-pestaña de un personaje con su pregunta arriba y cuatro o cinco entradas en la lista, entre ellas alguna con condición. Si hay un paso de misión inyectado automáticamente, mejor: se ve que aparece sin mantenerlo a mano.

#### `vn-talk-menu-entry.png` — P2 · ✅ tomada

- **Sección:** An entry · Una entrada
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Talk Menu
- **Qué tiene que verse:** Una entrada desplegada con todos sus campos: etiqueta, condición, escena y nodo de destino, y la opción de qué pasa cuando la rama termina.

#### `vn-talk-menu-ingame.png` — P1 · ⬜ pendiente

- **Sección:** How the player reaches the menu · Cómo llega el jugador al menú
- **Vista:** Unity ▸ Game view en Play, en mundo libre
- **Qué tiene que verse:** El menú abierto tras hacer clic en un personaje dentro de una sala, con varias entradas visibles. Lo ideal es capturarlo cuando una entrada de entrega de misión ha aparecido sola porque el jugador lleva los ítems.

### Variables and conditions · Variables y condiciones

`/docs/beasty-visual-novel/world/variables-and-conditions/` — `/es/docs/beasty-visual-novel/world/variables-and-conditions/`

#### `vn-variables-tab-new.png` — P1 · ✅ tomada

- **Sección:** Creating a variable · Crear una variable
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Variables
- **Qué tiene que verse:** Una variable recién creada y seleccionada, con su clave, tipo de valor, kind y valor por defecto rellenos, y el botón + New Variable visible. Si el kind es Enum, mejor: se ve la lista de valores permitidos.

#### `vn-block-ask.png` — P2 · ✅ tomada

- **Sección:** Asking the player · Preguntar al jugador
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** El bloque desplegado con la variable elegida, la línea de pregunta escrita, un valor por defecto y la marca de respuesta obligatoria.

#### `vn-block-set-variable.png` — P1 · ✅ tomada

- **Sección:** Changing a variable · Cambiar una variable
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** Dos bloques Set variable seguidos con operaciones distintas (por ejemplo `gold` Add 10 y un Bool con Toggle), con el selector de variable mostrando la etiqueta amigable.

#### `vn-condition-editor.png` — P1 · ✅ tomada

- **Sección:** Conditions · Condiciones
- **Vista:** Unity ▸ Tools > Beasty VN > Editor, en cualquier campo de condición
- **Qué tiene que verse:** Reutiliza la captura de la página de elecciones: el mismo editor de condiciones sirve aquí.

#### `vn-effects-editor.png` — P2 · ✅ tomada

- **Sección:** Effects · Efectos
- **Vista:** Unity ▸ Tools > Beasty VN > Editor, en una opción de Choice o en una recompensa de misión
- **Qué tiene que verse:** Una lista de dos o tres efectos (`gold` Subtract 10, `maya.affection` Add 1, un Toggle) colgando de una opción de elección, para que se vea que es la misma operación que un bloque Set variable pero sin bloque.

## Beasty Save System

Carpeta destino: `public/docs-images/beasty-save-system/` · 26 pendientes de 26.

### Installation · Instalación

`/docs/beasty-save-system/getting-started/installation/` — `/es/docs/beasty-save-system/getting-started/installation/`

#### `save-package-folder.png` — P2 · ⬜ pendiente

- **Sección:** What is in the folder · Qué hay en la carpeta
- **Vista:** Unity ▸ ventana Project
- **Qué tiene que verse:** La carpeta del paquete desplegada un nivel, para que se vean las subcarpetas de las que habla la página. Recorta solo el panel Project.

#### `save-converter-modules.png` — P3 · ⬜ pendiente

- **Sección:** The converter modules · Los módulos convertidores
- **Vista:** Unity ▸ ventana Project
- **Qué tiene que verse:** La carpeta de módulos de conversores desplegada, con los nombres de los módulos legibles (core, ugui, physics3d, tmpro…), para que se entienda que cada uno se puede quitar.

### Save without writing code · Guardar sin escribir código

`/docs/beasty-save-system/getting-started/save-without-code/` — `/es/docs/beasty-save-system/getting-started/save-without-code/`

#### `save-cube-scene.png` — P3 · ⬜ pendiente

- **Sección:** 1. Make a scene with something in it · 1. Crea una escena con algo dentro
- **Vista:** Unity ▸ vista de escena + Hierarchy
- **Qué tiene que verse:** La escena mínima del tutorial recién montada: el cubo sobre un plano en la vista de Scene, con la Hierarchy al lado para que se vea lo poco que hay. Sin el manager todavía.

#### `save-manager-window-empty.png` — P1 · ⬜ pendiente

- **Sección:** 2. Add the Save Manager · 2. Añade el Save Manager
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager, en una escena sin manager
- **Qué tiene que verse:** La ventana en una escena que NO tiene BeastySaveManager: se debe leer el mensaje «No BeastySaveManager in the open scene.» y verse el botón Create Beasty Save Manager. Es el punto de partida del camino sin código.

#### `save-saveable-inspector.png` — P1 · ⬜ pendiente

- **Sección:** 3. Make the cube saveable · 3. Haz que el cubo sea guardable
- **Vista:** Unity ▸ Inspector del cubo del tutorial
- **Qué tiene que verse:** El inspector del componente Beasty Saveable con el Save Id relleno y, en Saved Components, Transform marcado. Que se vea la etiqueta de capa del conversor junto al componente (core).

#### `save-button-onclick.png` — P1 · ⬜ pendiente

- **Sección:** 5. Wire the Save button · 5. Conecta el botón Save
- **Vista:** Unity ▸ Inspector del botón Save (uGUI)
- **Qué tiene que verse:** La lista OnClick del botón con: el objeto del Save Manager en el campo de objeto, la función BeastySaveManager > SaveAll (string) elegida, y `slot1` escrito en el campo de texto de debajo.

#### `save-load-button-onclick.png` — P2 · ⬜ pendiente

- **Sección:** 6. Add a Load button · 6. Añade un botón Load
- **Vista:** Unity ▸ Inspector del botón Load (uGUI)
- **Qué tiene que verse:** Igual que la captura del botón Save, pero con la función LoadAll (string) y el mismo `slot1` escrito. Se toman de la misma forma a propósito: la pareja se compara de un vistazo.

#### `save-playmode-test.png` — P3 · ⬜ pendiente

- **Sección:** 7. Try it · 7. Pruébalo
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La Game view en Play con el cubo desplazado de su sitio y los dos botones (Save y Load) visibles en pantalla. Si te animas, dos capturas en una: antes y después de pulsar Load.

#### `save-folder-explorer.png` — P2 · ⬜ pendiente

- **Sección:** 8. Where the file actually is · 8. Dónde está realmente el archivo
- **Vista:** Windows ▸ explorador de archivos, abierto con el botón Open Folder de la ventana Save Manager
- **Qué tiene que verse:** La carpeta de persistentDataPath abierta en el explorador, con `slot1.json` (y su `.bak` si ya existe) visibles y la ruta completa legible en la barra de direcciones. Esa ruta es justo lo que la gente no sabe encontrar.

### Backups and corruption · Copias de seguridad y corrupción

`/docs/beasty-save-system/guides/backups-and-corruption/` — `/es/docs/beasty-save-system/guides/backups-and-corruption/`

#### `save-backup-files.png` — P2 · ⬜ pendiente

- **Sección:** Backups: the previous version, kept · Backups: la versión anterior, conservada
- **Vista:** Windows ▸ explorador de archivos, en la carpeta de guardado
- **Qué tiene que verse:** La carpeta con `slot1.json` y `slot1.json.bak` visibles, con la columna de fecha de modificación a la vista: se debe notar que el .bak es la versión anterior.

#### `save-restore-backup.png` — P1 · ⬜ pendiente

- **Sección:** Doing it from the editor · Cómo hacerlo desde el editor
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager, sección Slots on Disk
- **Qué tiene que verse:** Pulsa Restore Backup en un slot que tenga .bak y captura el diálogo de confirmación («Replace slot 'x' with its .bak file?») con la fila del slot detrás. Si puedes, que se vea también otro slot con el botón deshabilitado por no tener copia.

### Encryption · Cifrado

`/docs/beasty-save-system/guides/encryption/` — `/es/docs/beasty-save-system/guides/encryption/`

#### `save-encrypted-file.png` — P2 · ⬜ pendiente

- **Sección:** What it does · Qué hace
- **Vista:** Cualquier editor de texto, con un archivo de guardado cifrado
- **Qué tiene que verse:** Abre un `.json` guardado con cifrado activado y captura el principio del archivo: se tiene que ver el bloque `meta` en texto plano y legible, y justo al lado el payload convertido en un churro de caracteres. Esa es exactamente la promesa de la página.

### Logging · Logging

`/docs/beasty-save-system/guides/logging/` — `/es/docs/beasty-save-system/guides/logging/`

#### `save-manager-logging.png` — P2 · ⬜ pendiente

- **Sección:** The toggle · El interruptor
- **Vista:** Unity ▸ Inspector del BeastySaveManager
- **Qué tiene que verse:** El inspector del manager con el desplegable Logging ABIERTO, mostrando las cuatro opciones: Auto, On, Verbose y Off.

#### `save-logging-output.png` — P2 · ⬜ pendiente

- **Sección:** What it looks like · Qué pinta tiene
- **Vista:** Unity ▸ Tools > Beasty Console > Console (o la consola de Unity), tras guardar y cargar en Play
- **Qué tiene que verse:** Guarda y carga una vez con Logging en Verbose y captura las líneas resultantes: se debe ver el slot, el tamaño y el resultado de la operación, que es lo que la página describe con palabras.

### The Save Manager window · La ventana Save Manager

`/docs/beasty-save-system/guides/save-manager-window/` — `/es/docs/beasty-save-system/guides/save-manager-window/`

#### `save-manager-window.png` — P1 · ⬜ pendiente

- **Sección:** (entradilla) · (entradilla)
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager
- **Qué tiene que verse:** La ventana entera con las tres secciones llenas: Manager (con el inspector embebido visible), Saveables in Scene (al menos tres objetos, uno de ellos con «0 comp.» para que se vea el caso de auditoría) y Slots on Disk con dos slots o más, con su resumen de metadata.

#### `save-manager-inspector.png` — P1 · ⬜ pendiente

- **Sección:** Manager · Manager
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager, sección Manager
- **Qué tiene que verse:** Recorte de la sección Manager con un manager ya creado: el campo de objeto arriba y, debajo, su inspector embebido con los ajustes desplegados (Folder, Extension, Data Path, Encrypted, Backup, Strict, Data Version). Es la foto de «aquí se edita todo sin cambiar de selección».

#### `save-manager-dropzone.png` — P2 · ⬜ pendiente

- **Sección:** The drop zone · La zona de arrastre
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager, sección Saveables in Scene
- **Qué tiene que verse:** Recorte de la caja «Drag GameObjects here to make them saveable», a poder ser mientras arrastras dos o tres objetos de la Hierarchy encima, para que se vea el estado resaltado de la zona.

#### `save-manager-saveables-list.png` — P1 · ⬜ pendiente

- **Sección:** The list · La lista
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager, sección Saveables in Scene
- **Qué tiene que verse:** La lista con cuatro o cinco filas. Que se vean los dos casos que la página enseña a detectar: una fila con «0 comp.» y dos filas con el MISMO save id. Es la captura de auditoría de escena.

#### `save-manager-slots.png` — P1 · ⬜ pendiente

- **Sección:** Slots on Disk · Slots on Disk
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager, sección Slots on Disk
- **Qué tiene que verse:** Tres o cuatro slots reales en disco. Que uno tenga metadata rica (capítulo, tiempo jugado…) para que se vea el resumen «key: value · key: value», y que en las filas se lean los botones Restore Backup y Delete. Si puedes provocar un archivo dañado, incluye una fila con «unreadable:» y su código de error.

### Scene state · Estado de la escena

`/docs/beasty-save-system/guides/scene-state/` — `/es/docs/beasty-save-system/guides/scene-state/`

#### `save-saveable-id.png` — P2 · ⬜ pendiente

- **Sección:** Ids · Ids
- **Vista:** Unity ▸ Inspector de un Beasty Saveable
- **Qué tiene que verse:** Recorte del campo Save Id con el id autogenerado a la vista y el botón New al lado. Suficiente para entender que el id es editable y regenerable.

#### `save-saveable-multiple-components.png` — P3 · ⬜ pendiente

- **Sección:** Several components of the same type · Varios componentes del mismo tipo
- **Vista:** Unity ▸ Inspector de un Beasty Saveable
- **Qué tiene que verse:** Un objeto que tenga dos componentes del mismo tipo (por ejemplo dos AudioSource) con ambos marcados en Saved Components, para que se vea cómo los distingue la lista.

### Settings · Settings

`/docs/beasty-save-system/guides/settings/` — `/es/docs/beasty-save-system/guides/settings/`

#### `save-settings-inspector.png` — P1 · ⬜ pendiente

- **Sección:** The fields · Los campos
- **Vista:** Unity ▸ Inspector del BeastySaveManager
- **Qué tiene que verse:** El bloque de ajustes del manager con TODOS los campos visibles a la vez: Folder, Extension, Data Path, Encrypted, Encryption Key, Backup, Strict y Data Version. Es la imagen de referencia de la tabla de esta página, así que no recortes ningún campo.

### Slots and metadata · Slots y metadatos

`/docs/beasty-save-system/guides/slots-and-metadata/` — `/es/docs/beasty-save-system/guides/slots-and-metadata/`

#### `save-slot-metadata.png` — P3 · ⬜ pendiente

- **Sección:** Metadata: what a slot list actually needs · Metadatos: lo que una lista de slots realmente necesita
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager, sección Slots on Disk
- **Qué tiene que verse:** Recorte de UNA fila de slot cuyo guardado lleve metadata de verdad (capítulo, tiempo jugado, nivel), para que se lea el resumen «key: value · key: value …» que la página propone usar en la pantalla de partidas.

### Strict vs tolerant loading · Carga estricta vs. tolerante

`/docs/beasty-save-system/guides/strict-vs-tolerant/` — `/es/docs/beasty-save-system/guides/strict-vs-tolerant/`

#### `save-tolerant-warnings.png` — P2 · ⬜ pendiente

- **Sección:** Reading the warnings · Leer las advertencias
- **Vista:** Unity ▸ consola, tras una carga en modo tolerante
- **Qué tiene que verse:** Provoca una carga tolerante con un campo que no encaja (por ejemplo cambia el tipo de un campo entre guardar y cargar) y captura las advertencias resultantes, con el nombre del campo visible. Es lo que hay que saber leer para decidir si el guardado sirve.

### Components · Componentes

`/docs/beasty-save-system/reference/components/` — `/es/docs/beasty-save-system/reference/components/`

#### `save-saveable-components-checklist.png` — P2 · ⬜ pendiente

- **Sección:** BeastySaveable · BeastySaveable
- **Vista:** Unity ▸ Inspector de un Beasty Saveable
- **Qué tiene que verse:** Un objeto con varios componentes (Transform, SpriteRenderer, Rigidbody2D, un script tuyo) para que se vean las etiquetas de capa: core, el id del módulo (ugui, physics2d…) y dev. Incluye, si puedes, un componente marcado que NADIE puede convertir, para que salga el aviso de TypeUnavailable.

### Save file format · Formato del archivo de guardado

`/docs/beasty-save-system/reference/save-file-format/` — `/es/docs/beasty-save-system/reference/save-file-format/`

#### `save-file-envelope.png` — P2 · ⬜ pendiente

- **Sección:** The envelope · El sobre (envelope)
- **Vista:** Cualquier editor de texto, con un archivo de guardado SIN cifrar
- **Qué tiene que verse:** Abre un guardado sin cifrar con el JSON formateado y captura la cabecera: los campos del sobre (`type`, `meta`, versión, payload) visibles a la vez. Que el archivo sea pequeño, para que quepa la estructura entera.

## Beasty Console

Carpeta destino: `public/docs-images/beasty-console/` · 10 pendientes de 10.

### Getting started · Primeros pasos

`/docs/beasty-console/getting-started/` — `/es/docs/beasty-console/getting-started/`

#### `log-first-log.png` — P2 · ⬜ pendiente

- **Sección:** Your first log · Tu primer log
- **Vista:** Unity ▸ Tools > Beasty Console > Console, tras entrar en Play con el script de ejemplo
- **Qué tiene que verse:** La ventana con una sola fila: el mensaje del ejemplo de esta página. Es la foto de «funcionó»: lista casi vacía, un único mensaje con su glifo, su hora y su color.

#### `log-menu-console.png` — P2 · ⬜ pendiente

- **Sección:** Open the console · Abrir la consola
- **Vista:** Unity ▸ barra de menús Tools
- **Qué tiene que verse:** El menú Tools desplegado con el submenú Beasty Console abierto y el ítem Console visible y resaltado. Que se vea que Beasty Console es una entrada de primer nivel de Tools, hermana de Beasty VN, no algo colgando de ella. Captura solo la cascada del menú, no el editor entero.

### Working with the other Beasty packages · Trabajar con los demás paquetes Beasty

`/docs/beasty-console/guides/beasty-integration/` — `/es/docs/beasty-console/guides/beasty-integration/`

#### `log-vn-categories.png` — P2 · ⬜ pendiente

- **Sección:** Beasty Visual Novel · Beasty Visual Novel
- **Vista:** Unity ▸ Tools > Beasty Console > Console, con una escena de VN en Play
- **Qué tiene que verse:** Entra en Play en una escena de VN, avanza un par de líneas de diálogo y cambia de sala, y captura la lista: se deben ver logs con las categorías de la VN (Data, Director, Stage, Save) mezclados, que es lo que justifica poder silenciar una categoría sin silenciar el resto.

### The Beasty Console window · La ventana Beasty Console

`/docs/beasty-console/guides/console-window/` — `/es/docs/beasty-console/guides/console-window/`

#### `log-console-window.png` — P1 · ⬜ pendiente

- **Sección:** (entradilla) · (entradilla)
- **Vista:** Unity ▸ Tools > Beasty Console > Console
- **Qué tiene que verse:** La ventana entera, acoplada y ancha. Que se hayan logueado varios niveles distintos (info, éxito, aviso, error, excepción) para que los contadores de los filtros no estén a cero, y con una fila seleccionada, de modo que el panel de detalle de abajo muestre el mensaje completo y su stack trace.

#### `log-console-toolbar.png` — P1 · ⬜ pendiente

- **Sección:** The toolbar · La barra de herramientas
- **Vista:** Unity ▸ Tools > Beasty Console > Console
- **Qué tiene que verse:** Recorte de la franja superior de la ventana, solo la barra de herramientas: Clear, Collapse, Clear on Play, Error Pause y el campo de búsqueda. Que se lea el texto de cada botón; no hace falta que haya logs.

#### `log-console-filters.png` — P1 · ⬜ pendiente

- **Sección:** The level filters · Los filtros de nivel
- **Vista:** Unity ▸ Tools > Beasty Console > Console
- **Qué tiene que verse:** Recorte de la fila de filtros por nivel, justo debajo de la barra de herramientas. Loguea antes al menos un mensaje de cada nivel para que todos los contadores muestren un número, y deja uno o dos filtros APAGADOS para que se vea la diferencia visual entre activo e inactivo.

#### `log-console-detail.png` — P1 · ⬜ pendiente

- **Sección:** The list · La lista
- **Vista:** Unity ▸ Tools > Beasty Console > Console
- **Qué tiene que verse:** La lista con varias filas de niveles distintos (para que se vean los glifos, la hora [HH:mm:ss] y los colores) y UNA fila seleccionada, con el panel de detalle abierto abajo mostrando el mensaje completo y el stack trace. Si puedes, que una fila esté agrupada con Collapse para que se vea el (Nx) al final.

#### `log-console-stack-link.png` — P3 · ⬜ pendiente

- **Sección:** Opening the file · Abrir el archivo
- **Vista:** Unity ▸ Tools > Beasty Console > Console
- **Qué tiene que verse:** Recorte del panel de detalle con el stack trace de un error lanzado desde un script tuyo, con el cursor sobre una línea que apunte a un archivo real para que se vea que es un enlace (subrayado / cambio de color). Deben distinguirse las líneas enlazables de las de ensamblados compilados, que no lo son.

### Logging · Logging

`/docs/beasty-console/guides/logging/` — `/es/docs/beasty-console/guides/logging/`

#### `log-levels-sample.png` — P1 · ⬜ pendiente

- **Sección:** The levels, and when to use each one · Los niveles, y cuándo usar cada uno
- **Vista:** Unity ▸ Tools > Beasty Console > Console
- **Qué tiene que verse:** Loguea una línea por cada nivel de la API, en el mismo orden que la tabla de esta página, con un texto que diga qué nivel es (por ejemplo «Info: cargando datos»). Captura solo la lista: es la tabla de la página hecha imagen, y se debe poder comparar color y glifo de un vistazo.

#### `log-color-sample.png` — P3 · ⬜ pendiente

- **Sección:** Colour without a level · Color sin un nivel
- **Vista:** Unity ▸ Tools > Beasty Console > Console
- **Qué tiene que verse:** Tres o cuatro mensajes del mismo nivel pero con colores distintos (los de LogColor), uno detrás de otro, para que se vea que el color no cambia el nivel ni el glifo.
