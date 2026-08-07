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
| P1 · imprescindibles | 24 | 1 | 25 |
| P2 · recomendadas | 25 | 2 | 27 |
| P3 · complementarias | 11 | 0 | 11 |
| **Total** | **60** | **3** | **63** |

## Beasty Visual Novel

Carpeta destino: `public/docs-images/beasty-visual-novel/` · 24 por hacer de 24.

### Dialogue and the stage · Diálogo y el escenario

`/docs/beasty-visual-novel/authoring/dialogue-and-stage/` — `/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/`

#### `vn-stage-ingame.png` — P1 · ⬜ pendiente

- **Sección:** The stage · El escenario
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** Una línea de diálogo en marcha con DOS personajes en escena (uno hablando, otro no), fondo puesto y la caja de diálogo con la placa de nombre. Es la foto de referencia de qué significa «el escenario».

### Core concepts · Conceptos fundamentales

`/docs/beasty-visual-novel/getting-started/core-concepts/` — `/es/docs/beasty-visual-novel/getting-started/core-concepts/`

#### `vn-beastymanager-inspector.png` — P2 · 🔁 rehacer

- **Sección:** BeastyManager - the one object · BeastyManager - el único objeto
- **Vista:** Unity ▸ Inspector, con el BeastyManager de la escena seleccionado
- **Qué tiene que verse:** El inspector del BeastyManager en una escena montada, con los campos asignados (Time Config, canvas principal, cámara, pantalla de carga…). Que se vea que es UN objeto del que cuelga todo, incluida la sección Saving con su insignia de backend.
- **Por qué rehacerla:** La foto actual es anterior a la sección Saving: salta de Streaming a Scene references. Desde la 1.1 el inspector muestra el foldout Saving (con insignia «Local file» / «Active · …») entre Streaming y Scene references.

### The House Demo · El House Demo

`/docs/beasty-visual-novel/getting-started/house-demo/` — `/es/docs/beasty-visual-novel/getting-started/house-demo/`

#### `vn-house-demo-living.png` — P1 · ⬜ pendiente

- **Sección:** Running it · Ejecutarlo
- **Vista:** Unity ▸ Game view en Play, escena Demos/HouseDemo/HouseDemo.unity
- **Qué tiene que verse:** La sala (Living Room) de DÍA con la pose placeholder de Mia visible, las dos estanterías, la puerta al dormitorio y el HUD de mundo libre. Tómala con la misión activa y el cursor sobre Mia para que se vea el realce de interactuable. Los placeholders etiquetados (LIVING ROOM - DAY, MIA POSE…) son parte del mensaje: el demo enseña estructura, no arte.

### Audio and music · Audio y música

`/docs/beasty-visual-novel/production/audio-and-music/` — `/es/docs/beasty-visual-novel/production/audio-and-music/`

#### `vn-background-music-foldout.png` — P2 · 🔁 rehacer

- **Sección:** Background music per app mode · Música de fondo por modo de app
- **Vista:** Unity ▸ Inspector, con el BeastyManager de la escena seleccionado
- **Qué tiene que verse:** Recorte del inspector del BeastyManager con el desplegable Background Music ABIERTO y el toggle Keep Previous When Empty visible (mejor desactivado, que es el valor con el que una cola vacía significa silencio). Solo el desplegable y un poco de contexto alrededor, no el inspector entero.
- **Por qué rehacerla:** La foto actual muestra otra cosa: la lista de Channels del manager de Audio (Mixer, canales Music/Ambient/Sfx/Voice), no el foldout Background Music con el toggle Keep Previous When Empty que pide la ficha.

### Localization · Localización

`/docs/beasty-visual-novel/production/localization/` — `/es/docs/beasty-visual-novel/production/localization/`

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

### Saving and loading · Guardado y carga

`/docs/beasty-visual-novel/production/saving-and-loading/` — `/es/docs/beasty-visual-novel/production/saving-and-loading/`

#### `vn-save-load-ingame.png` — P1 · 🔁 rehacer

- **Sección:** Slots · Slots
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La pantalla de guardar/cargar con varios slots ocupados (con su miniatura, la fecha y el capítulo) y alguno vacío. Si el autoguardado tiene su propio slot, que se vea. Las miniaturas deben mostrar la ESCENA, no el menú.
- **Por qué rehacerla:** En la foto actual las miniaturas de los slots muestran el menú de pausa abierto. Desde la 1.1 la captura se toma antes de que el menú se dibuje, así que las miniaturas enseñan la escena — la foto contradice lo que la página cuenta.

#### `vn-saving-section.png` — P1 · ⬜ pendiente

- **Sección:** The Saving section: one place for all of it · La sección Saving: todo en un sitio
- **Vista:** Unity ▸ Inspector del BeastyManager, sección Saving
- **Qué tiene que verse:** El foldout Saving ABIERTO con su insignia de backend visible en el título — idealmente con un backend cloud activo para que se lea «Active · Firebase Firestore»; si no, «Local file». Dentro deben verse los grupos Backend (con el desplegable Storage), Location, Security, Reliability, Versioning, Thumbnails y Save policy (Global Settings) con su botón Open Global Settings.

### UI prefabs · Prefabs de UI

`/docs/beasty-visual-novel/production/ui-prefabs/` — `/es/docs/beasty-visual-novel/production/ui-prefabs/`

#### `vn-black-screen-fix.png` — P1 · ⬜ pendiente

- **Sección:** The black screen, and the button that fixes it · La pantalla negra, y el botón que la arregla
- **Vista:** Unity ▸ Game view en Play + el botón de arreglo en la ventana de Beasty VN
- **Qué tiene que verse:** Dos cosas en una: la pantalla negra tal y como la ve quien tiene el problema y, al lado o en una segunda captura, el botón que lo corrige, con su texto legible.

### Character routines · Rutinas de personajes

`/docs/beasty-visual-novel/world/character-routines/` — `/es/docs/beasty-visual-novel/world/character-routines/`

#### `vn-routine-calendar-ingame.png` — P2 · ⬜ pendiente

- **Sección:** The in-game routine calendar · El calendario de rutina dentro del juego
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** La pantalla de rutina de un personaje en vista de semana: momentos del día en filas, días en columnas, con la columna de hoy tintada y el momento actual resaltado con más fuerza.

### Character screens · Pantallas de personaje

`/docs/beasty-visual-novel/world/character-screens/` — `/es/docs/beasty-visual-novel/world/character-screens/`

#### `vn-routine-calendar-ingame.png` — P2 · ⬜ pendiente

- **Sección:** The routine calendar · El calendario de rutina
- **Vista:** Unity ▸ Game view en Play
- **Qué tiene que verse:** Reutiliza la captura del calendario de rutinas de la página de rutinas de personaje.

### Characters · Personajes

`/docs/beasty-visual-novel/world/characters/` — `/es/docs/beasty-visual-novel/world/characters/`

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

#### `vn-freeroam-ingame.png` — P1 · ⬜ pendiente

- **Sección:** Entering a room from the story, and leaving again · Entrar en una sala desde la historia, y volver a salir
- **Vista:** Unity ▸ Game view en Play, en mundo libre
- **Qué tiene que verse:** Una sala jugable con su fondo, un par de objetos clicables, una puerta y un personaje colocado por su rutina. Con el HUD encima, si lo tienes. Es la foto que responde a «¿qué es el mundo libre?».

### Game time · Tiempo de juego

`/docs/beasty-visual-novel/world/game-time/` — `/es/docs/beasty-visual-novel/world/game-time/`

#### `vn-time-hud-ingame.png` — P2 · ⬜ pendiente

- **Sección:** From a HUD button · Desde un botón del HUD
- **Vista:** Unity ▸ Game view en Play, en mundo libre
- **Qué tiene que verse:** El HUD en marcha con una etiqueta ligada a `time.day` y otra a `time.daypart`, y a ser posible el botón cuya acción es AdvanceTime, que es de lo que habla esta sección.

### Interactables and doors · Interactuables y puertas

`/docs/beasty-visual-novel/world/interactables-and-doors/` — `/es/docs/beasty-visual-novel/world/interactables-and-doors/`

#### `vn-object-hover.png` — P2 · ⬜ pendiente

- **Sección:** Hover feedback · Efecto al pasar el cursor
- **Vista:** Unity ▸ pestaña FreeRoam (ajustes) + Game view en Play (resultado)
- **Qué tiene que verse:** Los ajustes de Hover feedback con el modo elegido y Zoom on hover activado; si puedes, la misma captura junto al efecto en el juego con el mouse sobre el objeto (tintado o sprite cambiado).

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

### Quests · Misiones

`/docs/beasty-visual-novel/world/quests/` — `/es/docs/beasty-visual-novel/world/quests/`

#### `vn-quest-marker.png` — P3 · ⬜ pendiente

- **Sección:** The map marker · El marcador de mapa
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Quests
- **Qué tiene que verse:** La sección del marcador con un sprite asignado y al menos un caso condicional debajo, para que se vea que puede cambiar según el estado del mundo.

#### `vn-quest-routine-override.png` — P2 · ⬜ pendiente

- **Sección:** The routine override · La anulación de rutina
- **Vista:** Unity ▸ Tools > Beasty VN > Editor ▸ pestaña Characters ▸ Quests
- **Qué tiene que verse:** La sección «Move character while current» activada, con la sala destino y las listas de días y momentos del día marcadas. Es el «quedamos en el muelle a medianoche» sin escribir código.

### The talk menu · El menú de conversación

`/docs/beasty-visual-novel/world/talk-menu/` — `/es/docs/beasty-visual-novel/world/talk-menu/`

#### `vn-talk-menu-ingame.png` — P1 · ⬜ pendiente

- **Sección:** How the player reaches the menu · Cómo llega el jugador al menú
- **Vista:** Unity ▸ Game view en Play, en mundo libre
- **Qué tiene que verse:** El menú abierto tras hacer clic en un personaje dentro de una sala, con varias entradas visibles. Lo ideal es capturarlo cuando una entrada de entrega de misión ha aparecido sola porque el jugador lleva los ítems.

## Beasty Save System

Carpeta destino: `public/docs-images/beasty-save-system/` · 29 por hacer de 29.

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

### Cloud saves with Firebase · Guardados en la nube con Firebase

`/docs/beasty-save-system/guides/firebase/` — `/es/docs/beasty-save-system/guides/firebase/`

#### `save-firebase-console-data.png` — P2 · ⬜ pendiente

- **Sección:** Where the data lives · Dónde viven los datos
- **Vista:** Navegador ▸ consola de Firebase ▸ Firestore Database ▸ pestaña Data
- **Qué tiene que verse:** Un guardado real visto en la consola: la ruta users/{uid}/saves/{slot} con el documento cabecera (campos chunkCount y updatedAt) y su subcolección chunks abierta mostrando el documento «0» con el campo text. Debe leerse la jerarquía por usuario, que es lo que la página describe.

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
- **Qué tiene que verse:** La ventana entera con las tres secciones llenas: Manager (con la tarjeta de estado y los grupos de ajustes visibles), Saveables in Scene (al menos tres objetos, uno de ellos con «0 comp.» para que se vea el caso de auditoría) y Slots on Disk con dos slots o más, con su resumen de metadata.

#### `save-manager-inspector.png` — P1 · ⬜ pendiente

- **Sección:** Manager · Manager
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager, sección Manager
- **Qué tiene que verse:** Recorte de la sección Manager con un manager ya creado: el campo de objeto arriba, la tarjeta de estado (fila «Active storage» con su insignia Local o Cloud) y debajo los ajustes agrupados por función — Backend (Storage y Save Mode), Location, Security, Reliability, Versioning, Logging. Es la foto de «aquí se edita todo sin cambiar de selección».

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
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager, grupos de Settings
- **Qué tiene que verse:** Los grupos de ajustes con TODOS los campos visibles a la vez: Backend (Storage, Save Mode, Scope By User), Location (Folder, Extension, Data Path), Security (Encrypted y Encryption Key con el cifrado activado), Reliability (Backup, Strict) y Versioning (Data Version). Es la imagen de referencia de la tabla de esta página, así que no recortes ningún campo. En la ventana Save Manager se ven todos; en el inspector del componente, Data Path no aparece.

### Slots and metadata · Slots y metadatos

`/docs/beasty-save-system/guides/slots-and-metadata/` — `/es/docs/beasty-save-system/guides/slots-and-metadata/`

#### `save-slot-metadata.png` — P3 · ⬜ pendiente

- **Sección:** Metadata: what a slot list actually needs · Metadatos: lo que una lista de slots realmente necesita
- **Vista:** Unity ▸ Tools > Beasty Save System > Save Manager, sección Slots on Disk
- **Qué tiene que verse:** Recorte de UNA fila de slot cuyo guardado lleve metadata de verdad (capítulo, tiempo jugado, nivel), para que se lea el resumen «key: value · key: value …» que la página propone usar en la pantalla de partidas.

### Storage backends · Backends de almacenamiento

`/docs/beasty-save-system/guides/storage-backends/` — `/es/docs/beasty-save-system/guides/storage-backends/`

#### `save-storage-dropdown.png` — P1 · ⬜ pendiente

- **Sección:** The Storage dropdown · El desplegable Storage
- **Vista:** Unity ▸ Inspector del BeastySaveManager (o la ventana Save Manager), desplegable Storage
- **Qué tiene que verse:** El desplegable Storage ABIERTO con el SDK de Firebase instalado, para que se vean las tres entradas: Local file, Firebase Firestore y Firebase Realtime Database. Si es posible, que se vea también el campo Save Mode justo debajo — son las dos decisiones que la página presenta juntas.

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

#### `save-manager-inspector.png` — P1 · ⬜ pendiente

- **Sección:** The inspector · El inspector
- **Vista:** Unity ▸ Inspector del BeastySaveManager
- **Qué tiene que verse:** MISMA FOTO que la ficha de guides/save-manager-window (se reutiliza el archivo): la tarjeta de estado con la fila «Active storage» y su insignia, los campos Storage y Save Mode al frente, el foldout Advanced settings colapsado y el botón Open Save Manager. Solo hay que tomarla una vez.

### Save file format · Formato del archivo de guardado

`/docs/beasty-save-system/reference/save-file-format/` — `/es/docs/beasty-save-system/reference/save-file-format/`

#### `save-file-envelope.png` — P2 · ⬜ pendiente

- **Sección:** The envelope · El sobre (envelope)
- **Vista:** Cualquier editor de texto, con un archivo de guardado SIN cifrar
- **Qué tiene que verse:** Abre un guardado sin cifrar con el JSON formateado y captura la cabecera: los campos del sobre (`type`, `meta`, versión, payload) visibles a la vez. Que el archivo sea pequeño, para que quepa la estructura entera.

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
