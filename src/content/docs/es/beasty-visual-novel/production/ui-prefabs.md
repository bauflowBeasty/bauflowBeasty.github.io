---
title: "Prefabs de UI"
description: "Cada pantalla que ve el jugador es un prefab de Unity UI editable. La lista de prefabs, dos formas de restilizar y la solución de la pantalla negra."
---

Todo lo que el jugador ve es un prefab uGUI (uGUI es el sistema de UI integrado de Unity). No hay capa de
renderizado personalizada, ningún framework de UI
propietario y ningún canvas oculto: es Unity UI, en prefabs que puedes abrir y editar. Esta página describe su
aspecto de serie, los lista y muestra las dos formas de restilizar el juego.

## El aspecto de serie: tinta y papel

Los prefabs ya hechos comparten un aspecto dibujado a mano: una caja de diálogo y una placa de nombre de tinta
oscura con texto crema, opciones en forma de píldora de tinta que se vuelven rojo ladrillo al pasar el mouse o
al seleccionarlas, menús sobre una hoja de papel pautado encima de la escena atenuada, botones de tarjeta de
papel, ranuras de guardado tipo polaroid, y deslizadores, interruptores, desplegables, barras de scroll y
campos de texto a juego.

![El aspecto tinta y papel en el juego: la caja de diálogo, la placa de nombre y dos opciones, una con el mouse encima](/docs-images/beasty-visual-novel/vn-ui-ink-paper.png)

- **Sprites.** Una veintena de sprites pequeños de 9 cortes en `Sprites/UI` (unos 120 KB en total),
  compartidos por todos los prefabs. Ninguno lleva texto, así que no hay nada que traducir. Los sprites
  anteriores (`textbox`, `namebox`, `frame`, `nvl`, `notify`, `skip`) conservan su archivo y su GUID, así que
  tus propios prefabs que apuntan a ellos reciben el arte nuevo solos.
- **Fuente.** Nunito, Regular y Bold, con assets de fuente de TextMesh Pro que cubren el español y otros
  idiomas occidentales sin huecos. Tiene licencia SIL Open Font License 1.1, declarada en
  `Third-Party Notices.txt`. Los nombres de los hablantes conservan el **Name Color** de cada personaje; la
  placa de nombre es oscura, así que los colores claros se siguen leyendo.
- **Los botones** usan **Sprite Swap** (`card` / `card_on`, `choice` / `choice_on`) en vez de un tinte de
  color. Si una variante de prefab o una instancia en escena de un botón del paquete sobrescribe sus
  **Colors**, esos colores ya no hacen nada: vuelve a poner la **Transition** de ese botón en **Color Tint**
  para conservarlos.
- **Legible a cualquier resolución.** Todas las pantallas ya hechas están dimensionadas para el `VN_Canvas`
  4K: ningún texto baja de 28 unidades (14 px a 1080p), y los botones son lo bastante grandes para acertar sin
  esfuerzo. Los paneles de menú principal, guardar/cargar, créditos, ayuda e historial conservan sus
  proporciones y su parte de la pantalla a cualquier resolución, como el diálogo de confirmación.
- **El menú de juego.** Guardar/Cargar ocupa toda el área del menú, con pestañas grandes **Manual /
  Autoguardados** y un pie con las flechas de página (`|<`, `<`, `>`, `>|`), el campo del nombre de la partida y
  **Atrás**. Créditos, Ayuda e Historial también la ocupan, y las entradas del historial van en tinta sobre la
  hoja de papel.
- **Los menús propios** (`GridMenu`, `VerticalMenu`) van sobre una hoja de papel, así que sus etiquetas de tinta
  se leen sobre cualquier escena.
- **Las ranuras de guardado vacías** muestran la imagen discontinua `slot_empty`.

`Build Default Menu Prefabs` y los constructores de pantallas de la sección Screens dan el mismo aspecto a los
prefabs que **crean**. Nunca restilizan un prefab que ya existe en tu proyecto. La
[vista previa de diálogo](/es/docs/beasty-visual-novel/authoring/dialogue-preview/) usa la misma caja de
diálogo, así que coincide con el modo Play.

## La pantalla de Preferencias

![La pantalla de Preferencias: Pantalla y Texto a la izquierda, Sonido y Accesibilidad a la derecha](/docs-images/beasty-visual-novel/vn-preferences-screen.png)

Preferencias es una sola hoja de papel junto al menú de juego, en dos columnas:

| Izquierda | Derecha |
|---|---|
| **Pantalla** — Ventana, Idioma | **Sonido** — Volumen general, Música, Ambiente, SFX, Voz |
| **Texto** — Velocidad de texto, Tiempo de auto-avance, Empezar con auto-avance, Saltar texto no leído, Pistas de la guía | **Accesibilidad** — Reducir destellos y movimiento |

**Restablecer** y **Atrás** están abajo a la derecha. Las filas son grandes —la etiqueta a la izquierda, el
control a la derecha— y la disposición se estira con la pantalla.

- **Empezar con auto-avance** y **Reducir destellos y movimiento** vuelven a su valor con **Restablecer**.
- **Pistas de la guía** solo aparece cuando el proyecto tiene activadas las
  [pistas de la guía](/es/docs/beasty-visual-novel/world/notifications-and-walkthrough/).
- Cuando el juego tiene un solo idioma, se oculta la fila **Idioma** entera, etiqueta incluida.

Los prefabs de menú construidos antes de que existieran estas opciones las muestran cuando vuelves a ejecutar
**Build Default Menu Prefabs**. La raíz de menú que reconstruye lleva la misma pantalla de Preferencias, con
todas las etiquetas y encabezados traducidos.

## Los prefabs

![La carpeta de prefabs del paquete en la ventana Project](/docs-images/beasty-visual-novel/vn-ui-prefabs-folder.png)

| Prefab | Qué monta |
|---|---|
| `VisualNovelScene` | Una escena completa ya lista: todo lo de abajo, ya cableado. |
| `VN_Canvas` | Toda la interfaz en un prefab: la vista de diálogo, la vista de elecciones, y el gestor de menús con el menú principal, el menú de juego, guardar/cargar, preferencias, historial, créditos y pantallas de ayuda, además del diálogo de confirmación y la pantalla de carga. |
| `Stage` | El escenario (fondo, personajes, props) y el escenario de mundo libre. |
| `DialogPanel` | El panel de diálogo: la placa de nombre sobre la esquina superior izquierda de la caja, la línea, y el cuadro de texto para escribir con sus botones **Confirm** y **Back**. Las líneas de narración ocultan la placa de nombre. |
| `ChoiseRoot`, `ChoiseBtn` | El contenedor de elecciones y la plantilla de botón de elección. |
| `MainMenuScreen`, `GameMenuScreen`, `VNMenuRoot` | Los menús. |
| `VNSaveSlot` | Una celda de slot de guardado, instanciada una vez por slot. |
| `VNBacklogEntry` | Una línea de historial, instanciada una vez por línea. |
| `Inventory` | La pantalla de inventario, sus slots y el popup de detalle del ítem. |
| `CharactersMenu`, `CharacterProfile`, `CharacterStats`, `CharacterRoutine` | Las pantallas de personaje: la lista del elenco, el perfil con su barra de pestañas, el panel de estadísticas y el calendario de rutina. |
| `Phone` | La superposición de smartphone ya hecha. Consulta [Pantallas de teléfono](/es/docs/beasty-visual-novel/world/phone-screens/). |
| `GridMenu`, `VerticalMenu` y las plantillas de elemento de ítem | Los layouts a partir de los cuales se construye una pantalla de superposición. |
| `BeastyVNMixer` | El AudioMixer, con un grupo por canal (Music, Ambient, Sfx, Voice). |

La lista completa campo por campo está en la [referencia de prefabs](/es/docs/beasty-visual-novel/reference/prefabs/).

## Cómo restilizar

**Opción 1: edita el prefab.** Ábrelo, cambia las fuentes, colores, sprites, layout y anclas, agrega tu propia
decoración. Las vistas encuentran sus piezas a través de las referencias que ves en el Inspector, así que
mientras esos campos sigan apuntando a algo, el prefab sigue funcionando. Este es el camino normal y no cuesta nada.

**Opción 2: apunta las vistas a tu propio canvas.** Las vistas son MonoBehaviours comunes — componentes
normales de Unity — con referencias que cableas en el Inspector. Construye tu propio canvas, pon las vistas
en él, cablea los campos, y el motor controla tu UI en
lugar de la nuestra. Nada en el runtime da por sentada la jerarquía incluida.

## Los dos elementos de menú de prefabs

![El diálogo de confirmación antes de reconstruir o actualizar los prefabs de UI](/docs-images/beasty-visual-novel/vn-upgrade-prefabs.png)

| Elemento de menú | Úsalo cuando |
|---|---|
| `Tools > Beasty VN > Setup > Upgrade UI Prefabs (keep customizations)` | Quieres que los prefabs incluidos se actualicen — piezas nuevas que agregó una versión más reciente — **sin perder tu restilizado**. Solo agrega lo que falta y deja tus cambios intactos. Este es el que normalmente quieres. |
| `Tools > Beasty VN > Setup > Build Default Menu Prefabs` | Quieres que los prefabs de menú se regeneren desde cero: una raíz de menú simple y funcional con cada pantalla y cada campo cableado. Advierte antes de sobrescribir, porque reemplaza el prefab, y tu restilizado con él. |

Recurre a Build Default Menu Prefabs cuando un prefab de menú está roto sin remedio, o cuando quieres una base
limpia para restilizar. Recurre a Upgrade en cualquier otro caso.

## La pantalla negra, y el botón que la arregla

![La pantalla en negro, y el botón que la arregla](/docs-images/beasty-visual-novel/vn-black-screen-fix.png)

> **Advertencia**
> Los prefabs se referencian entre sí, y la escena resuelve las vistas **por tipo** en lugar de por una ruta
> que mantengas tú. Si reconstruyes un prefab de menú, o lo reorganizas mucho, una referencia que la escena
> mantenía puede terminar apuntando a nada. El síntoma es distintivo: **el juego arranca en una pantalla
> negra, el motor claramente está corriendo, y no hay un solo error en la consola.**
>
> Antes de depurar cualquier otra cosa, selecciona el **BeastyManager** en tu escena y presiona **Auto-wire /
> Repair**. Eso casi siempre es la solución.

Auto-wire vuelve a resolver las vistas de la escena y recrea cualquier gestor que haya desaparecido. Solo
rellena referencias VACÍAS — nunca sobrescribe un cableado que hiciste tú mismo — así que es seguro presionarlo
en cualquier momento. Consulta [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/) para saber exactamente qué garantiza.

## Ver también

- [Referencia de prefabs](/es/docs/beasty-visual-novel/reference/prefabs/) — cada prefab y sus campos.
- [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/) — construir tus propias pantallas de superposición a partir de estos layouts.
- [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) — la lista del elenco, el perfil, las estadísticas, el calendario y el registro de misiones.
- [Audio y música](/es/docs/beasty-visual-novel/production/audio-and-music/) — el prefab del mezclador.
