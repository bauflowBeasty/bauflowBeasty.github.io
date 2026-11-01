# Capturas pendientes

Solo lo que falta por hacer: las capturas **⬜ pendientes** (sin PNG en `public/docs-images/`) y las
**🔁 a rehacer** (el PNG existe pero quedó desactualizado; su ficha dice por qué). El guion completo,
con las ya tomadas, está en `docs/SCREENSHOTS.md`.

> **Generado.** Este archivo lo produce `npm run doc:shots`, el mismo comando que el guion completo.
> Al dejar un PNG nuevo (o sustituir uno a rehacer y quitar su campo `rehacer` del catálogo),
> vuelve a ejecutarlo y la captura desaparece de aquí.

## Estado

| | Pendientes | Rehacer | Por hacer |
|---|---:|---:|---:|
| P1 · imprescindibles | 5 | 14 | 19 |
| P2 · recomendadas | 4 | 7 | 11 |
| P3 · complementarias | 2 | 1 | 3 |
| **Total** | **11** | **22** | **33** |

## Beasty Visual Novel

Carpeta destino: `public/docs-images/beasty-visual-novel/` · 22 por hacer de 22.

### Blocks reference · Referencia de bloques

`/docs/beasty-visual-novel/authoring/blocks-reference/` — `/es/docs/beasty-visual-novel/authoring/blocks-reference/`

#### `vn-add-blocks-palette.png` — P1 · 🔁 rehacer

- **Sección:** The Add blocks panel · El panel Add blocks
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, panel izquierdo
- **Qué tiene que verse:** Recorte del panel de la paleta con TODAS las categorías desplegadas a la vez (Dialogue, Scene, Clear, State, Quests, World, Items, Audio, Input, Flow) y sus bloques legibles. Alarga la ventana en vertical si hace falta: esta captura es el índice de toda la página.
- **Por qué rehacerla:** La paleta tiene una categoría nueva, Effects (entre Clear y State), y bloques nuevos: Say together, Wear piece, Change outfit.

### Dialogue and the stage · Diálogo y el escenario

`/docs/beasty-visual-novel/authoring/dialogue-and-stage/` — `/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/`

#### `vn-block-show-character.png` — P2 · 🔁 rehacer

- **Sección:** Show character · Show character
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Story, inspector del nodo
- **Qué tiene que verse:** El bloque desplegado con el personaje elegido, una expresión concreta y la posición en escena. Si el bloque muestra miniatura del sprite, que se vea.
- **Por qué rehacerla:** El bloque Show character tiene ahora el campo Outfit.

### Dialogue preview · Vista previa de diálogo

`/docs/beasty-visual-novel/authoring/dialogue-preview/` — `/es/docs/beasty-visual-novel/authoring/dialogue-preview/`

#### `vn-dialogue-preview.png` — P1 · 🔁 rehacer

- **Sección:** (entradilla) · (entradilla)
- **Vista:** Unity ▸ Tools > Beasty VN > Dialogue Preview
- **Qué tiene que verse:** La ventana de vista previa renderizando un nodo con fondo y dos personajes en escena, con la caja de diálogo abajo. Sin entrar en Play: la barra de Unity debe delatar que no estamos en modo de juego.
- **Por qué rehacerla:** La vista previa dibuja ya la caja de diálogo con el aspecto tinta y papel y tiene el botón ▶ Play effects. Rehacer con una línea con efecto (por ejemplo el flashback de la intro).

### Core concepts · Conceptos fundamentales

`/docs/beasty-visual-novel/getting-started/core-concepts/` — `/es/docs/beasty-visual-novel/getting-started/core-concepts/`

#### `vn-beastymanager-inspector.png` — P2 · 🔁 rehacer

- **Sección:** BeastyManager - the one object · BeastyManager - el único objeto
- **Vista:** Unity ▸ Inspector, con el BeastyManager de la escena seleccionado
- **Qué tiene que verse:** El inspector del BeastyManager en una escena montada, con los campos asignados (Time Config, canvas principal, cámara, pantalla de carga…). Que se vea que es UN objeto del que cuelga todo, incluida la sección Saving con su insignia de backend.
- **Por qué rehacerla:** La foto actual es anterior a la sección Saving: salta de Streaming a Scene references. Desde la 1.1 el inspector muestra el foldout Saving (con insignia «Local file» / «Active · …») entre Streaming y Scene references.

### Editor tour · Recorrido del editor

`/docs/beasty-visual-novel/getting-started/editor-tour/` — `/es/docs/beasty-visual-novel/getting-started/editor-tour/`

#### `vn-tab-variables.png` — P1 · 🔁 rehacer

- **Sección:** Variables · Variables
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Variables
- **Qué tiene que verse:** La pestaña con media docena de variables de tipos distintos (Int, Bool, String, Enum) en la lista de la izquierda y una seleccionada a la derecha, con su clave, tipo, kind y valor por defecto a la vista.
- **Por qué rehacerla:** La pestaña Variables muestra lista y detalle lado a lado con divisor, y los campos Display name, Notify changes in gameplay y Show in walkthrough.

### Installation · Instalación

`/docs/beasty-visual-novel/getting-started/installation/` — `/es/docs/beasty-visual-novel/getting-started/installation/`

#### `vn-package-folder.png` — P2 · 🔁 rehacer

- **Sección:** What is in the package · Qué contiene el paquete
- **Vista:** Unity ▸ ventana Project
- **Qué tiene que verse:** Assets/BeastyComponents desplegado mostrando BeastyVN y BeastySaveSystem al mismo nivel: es la prueba visual de que el Save System viene incluido.
- **Por qué rehacerla:** La captura actual muestra también BeastyConsole dentro de BeastyComponents, pero desde la 1.0.0 publicada la consola ya no viaja en el bundle: rehacer con solo BeastyVN y BeastySaveSystem.

### Audio and music · Audio y música

`/docs/beasty-visual-novel/production/audio-and-music/` — `/es/docs/beasty-visual-novel/production/audio-and-music/`

#### `vn-background-music-foldout.png` — P2 · 🔁 rehacer

- **Sección:** Background music per app mode · Música de fondo por modo de app
- **Vista:** Unity ▸ Inspector, con el BeastyManager de la escena seleccionado
- **Qué tiene que verse:** Recorte del inspector del BeastyManager con el desplegable Background Music ABIERTO y el toggle Keep Previous When Empty visible (mejor desactivado, que es el valor con el que una cola vacía significa silencio). Solo el desplegable y un poco de contexto alrededor, no el inspector entero.
- **Por qué rehacerla:** La foto actual muestra otra cosa: la lista de Channels del manager de Audio (Mixer, canales Music/Ambient/Sfx/Voice), no el foldout Background Music con el toggle Keep Previous When Empty que pide la ficha.

### Localization · Localización

`/docs/beasty-visual-novel/production/localization/` — `/es/docs/beasty-visual-novel/production/localization/`

#### `vn-localization-tabs.png` — P1 · 🔁 rehacer

- **Sección:** The translation tables · Las tablas de traducción
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Localization
- **Qué tiene que verse:** La pestaña con el alternador Story / UI (global) bien visible y la grilla de la tabla de historia debajo. Es la captura que enseña que hay DOS tablas y dónde se cambia de una a otra.
- **Por qué rehacerla:** La sección Localization tiene ahora cuatro pestañas: Story, UI, Game UI e Items.

#### `vn-preferences-language-ingame.png` — P1 · 🔁 rehacer

- **Sección:** Switching language while the game runs · Cambiar de idioma mientras el juego se ejecuta
- **Vista:** Unity ▸ Game view en Play, pantalla de preferencias
- **Qué tiene que verse:** La pantalla de preferencias en marcha con el desplegable de idioma ABIERTO, mostrando los nombres curados (English, Spanish…). Si puedes, una segunda captura del menú ya traducido tras elegir otro idioma.
- **Por qué rehacerla:** La pantalla de Preferencias se rediseñó (dos columnas sobre una hoja de papel).

### Saving and loading · Guardado y carga

`/docs/beasty-visual-novel/production/saving-and-loading/` — `/es/docs/beasty-visual-novel/production/saving-and-loading/`

#### `vn-save-load-ingame.png` — P1 · 🔁 rehacer

- **Sección:** Slots · Slots
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La pantalla de guardar/cargar con varios slots ocupados (con su miniatura, la fecha y el capítulo) y alguno vacío. Si el autoguardado tiene su propio slot, que se vea. Las miniaturas deben mostrar la ESCENA, no el menú.
- **Por qué rehacerla:** En la foto actual las miniaturas de los slots muestran el menú de pausa abierto. Desde la 1.1 la captura se toma antes de que el menú se dibuje, así que las miniaturas enseñan la escena — la foto contradice lo que la página cuenta.

### Character screens · Pantallas de personaje

`/docs/beasty-visual-novel/world/character-screens/` — `/es/docs/beasty-visual-novel/world/character-screens/`

#### `vn-cast-list-ingame.png` — P1 · 🔁 rehacer

- **Sección:** The cast list · La lista de reparto
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La lista del reparto abierta con cuatro o cinco personajes visibles (y alguno todavía oculto por su condición, si se nota), tal y como la ve el jugador.
- **Por qué rehacerla:** La lista de personajes se rediseñó: hoja de papel con título y tarjetas polaroid en grilla.

#### `vn-profile-ingame.png` — P1 · 🔁 rehacer

- **Sección:** The profile · El perfil
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** El perfil de un personaje abierto, con su retrato y nombre en la cabecera y la barra de pestañas debajo, con la primera pestaña seleccionada.
- **Por qué rehacerla:** El perfil se rediseñó: polaroid y nombre a la izquierda, pestañas de papel claro a la derecha.

#### `vn-stats-ingame.png` — P1 · 🔁 rehacer

- **Sección:** The stats screen · La pantalla de estadísticas
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La pantalla de estadísticas con varias filas: alguna de solo lectura, alguna con botones + y −, y algún interruptor de un campo booleano. Si el personaje tiene activado Show current location, que se vea también la línea de ubicación.
- **Por qué rehacerla:** Las estadísticas son ahora tarjetas grandes en una o dos columnas, con el aspecto tinta y papel.

### Characters · Personajes

`/docs/beasty-visual-novel/world/characters/` — `/es/docs/beasty-visual-novel/world/characters/`

#### `vn-character-expressions.png` — P1 · 🔁 rehacer

- **Sección:** Expressions and portraits · Expresiones y retratos
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Cast
- **Qué tiene que verse:** Las dos listas a la vez, con al menos tres claves iguales en ambas (`base`, `sad`, `angry`) y sus miniaturas visibles, para que se vea que son dos juegos de sprites que comparten nombre.
- **Por qué rehacerla:** La lista de expresiones cambió: filas Single y Layered, etiqueta default en la primera, menú ⋮ y botón Wardrobe…

#### `vn-character-variables.png` — P1 · 🔁 rehacer

- **Sección:** Character variables (stats) · Variables de personaje (estadísticas)
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Variables
- **Qué tiene que verse:** La sub-pestaña con las DOS zonas visibles: los campos universales del esquema (por ejemplo `affection`, `met`) y los campos propios del personaje seleccionado. Que se vean las marcas Show on stats y Editable, y a poder ser un valor por defecto sobrescrito para este personaje.
- **Por qué rehacerla:** Characters › Variables tiene ahora pestañas Global y Per character, y cada campo las casillas Notify changes in gameplay, Show in walkthrough y Display name.

### Items and inventory · Objetos e inventario

`/docs/beasty-visual-novel/world/items-and-inventory/` — `/es/docs/beasty-visual-novel/world/items-and-inventory/`

#### `vn-inventory-ingame.png` — P1 · 🔁 rehacer

- **Sección:** The inventory screen · La pantalla de inventario
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** El inventario abierto con cuatro o cinco ítems (alguno con cantidad mayor que 1, para que se vea el contador) y el popup de detalle abierto sobre uno, mostrando icono, nombre, descripción y el botón Use.
- **Por qué rehacerla:** El inventario se rediseñó: hoja titulada con tarjetas polaroid y un popup de detalle grande con Use y Cancel.

#### `vn-screens-add-inventory.png` — P3 · 🔁 rehacer

- **Sección:** Adding it and opening it · Añadirla y abrirla
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** Recorte de la barra de la lista de pantallas con los botones de creación visibles (+ Primary, + Secondary, + Inventory (ready-made), + Menu, + Characters) y el del inventario señalado.
- **Por qué rehacerla:** Ya no existe el botón + Inventory (ready-made): rehacer con el menú + New screen abierto en Inventory ▸ Notebook / Phone.

### Screens and HUD · Pantallas y HUD

`/docs/beasty-visual-novel/world/screens-and-hud/` — `/es/docs/beasty-visual-novel/world/screens-and-hud/`

#### `vn-tab-screens.png` — P2 · 🔁 rehacer

- **Sección:** Two kinds of screen · Dos tipos de pantalla
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** Reutiliza la captura de la pestaña Screens del recorrido por el editor.
- **Por qué rehacerla:** La pestaña Screens cambió: menú + New screen en vez de la fila de botones, campo Kind en vez de Is Main, elementos en filas agrupadas con icono y resumen. Rehacer con el menú + New screen abierto en Menu o Inventory.

#### `vn-hud-ingame.png` — P1 · 🔁 rehacer

- **Sección:** Where a screen shows up · Dónde aparece una pantalla
- **Vista:** Unity ▸ Game view en Play, en mundo libre
- **Qué tiene que verse:** El HUD primario en marcha sobre una sala: un contador ligado a una variable (`Money: 120`), una etiqueta de tiempo y un par de botones (inventario, personajes). Es la foto de «pantalla primaria».
- **Por qué rehacerla:** El HUD de la House Demo cambió: tarjeta de papel con día y momento traducidos, insignia redonda y botón Phone.

#### `vn-screen-item.png` — P1 · 🔁 rehacer

- **Sección:** Items · Elementos
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** El elemento del contador de dinero desplegado: Text = `Money: `, Variable = `gold`, su condición de visibilidad y al menos un caso de variante condicional con icono distinto. Es el ejemplo que la página cuenta con palabras.
- **Por qué rehacerla:** El editor del elemento se abre ahora bajo su fila de la lista e incluye el campo Icon. Rehacer con una fila seleccionada y su editor desplegado.

#### `vn-screen-button-action.png` — P2 · 🔁 rehacer

- **Sección:** Actions · Acciones
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** Un elemento Button con el desplegable de acción ABIERTO mostrando las seis acciones (OpenScreen, Close, Back, Custom, EnterVN, AdvanceTime), y sus efectos de clic debajo si los tiene.
- **Por qué rehacerla:** La acción se elige ahora en el desplegable Does (Nothing, Open screen, Back, Close all screens, Open game menu, Change values only, Enter VN scene, Advance time, Custom event). Rehacer con ese desplegable abierto.

#### `vn-screen-preview.png` — P2 · 🔁 rehacer

- **Sección:** Preview · Vista previa
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Screens
- **Qué tiene que verse:** La vista previa del prefab de una pantalla renderizada junto a sus ajustes, con el desplegable «Hierarchy (who opens what)» ABIERTO mostrando qué botón abre qué pantalla.
- **Por qué rehacerla:** La vista previa de Screens ahora dibuja el contenido del prefab (antes salía solo el fondo oscuro). Rehacer con un elemento seleccionado marcado en azul en la vista previa.

## Beasty Save System

Carpeta destino: `public/docs-images/beasty-save-system/` · 1 por hacer de 1.

### Cloud saves with Firebase · Guardados en la nube con Firebase

`/docs/beasty-save-system/guides/firebase/` — `/es/docs/beasty-save-system/guides/firebase/`

#### `save-firebase-console-data.png` — P2 · ⬜ pendiente

- **Sección:** Where the data lives · Dónde viven los datos
- **Vista:** Navegador ▸ consola de Firebase ▸ Firestore Database ▸ pestaña Data
- **Qué tiene que verse:** Un guardado real visto en la consola: la ruta users/{uid}/saves/{slot} con el documento cabecera (campos chunkCount y updatedAt) y su subcolección chunks abierta mostrando el documento «0» con el campo text. Debe leerse la jerarquía por usuario, que es lo que la página describe.

## Beasty Console

Carpeta destino: `public/docs-images/beasty-console/` · 10 por hacer de 10.

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
