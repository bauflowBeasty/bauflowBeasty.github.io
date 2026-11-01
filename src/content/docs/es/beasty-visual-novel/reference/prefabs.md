---
title: "Prefabs"
description: "Cada prefab que incluye el paquete, y exactamente qué componentes monta. Usa esta página para saber qué prefab abrir cuando quieras rediseñar una pantalla."
---

Cada prefab que incluye el paquete, y exactamente qué componentes monta. Usa esta página para saber qué
prefab abrir cuando quieras rediseñar una pantalla.

Todo lo que ve el jugador es un prefab uGUI. Nada se dibuja desde código, así que puedes rediseñar cualquier
pantalla sin tocar C#. Cómo rediseñar de forma segura, y cómo conservar tus cambios cuando el paquete se
actualiza, está en [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/).

Los prefabs viven en `BeastyVN/Prefabs/`, excepto `VNMenuRoot` y `VNBacklogEntry`, que viven en
`BeastyVN/Runtime/UI/Prefabs/`.

## Tabla de consulta

![Los prefabs del paquete en la ventana Project](/docs-images/beasty-visual-novel/vn-prefabs-folder.png)

| Prefab | Monta | Qué es |
|---|---|---|
| `VisualNovelScene` | `BeastyManager`, `VNGameController`, `VisualNovelController`, `StageController`, `FreeRoamController`, `FreeRoamScreenController`, `VNAudioManager`, `VNInputModuleInstaller`, `BeastyAspectRatioEnforcer`, `BeastyLoadingScreen`, `VNMenuManager`, `DialogueView`, `ChoiceView`, `FreeRoamScenario` | Una escena completa lista para usar: arrástrala y presiona Play. |
| `VN_Canvas` | `DialogueView`, `ChoiceView`, `ContinueIndicatorBlink`, `DialogueTextEffect`, `VNMenuManager`, `MainMenuScreen`, `GameMenuScreen`, `SaveLoadScreen`, `PreferencesScreen`, `HistoryScreen`, `CreditsScreen`, `HelpScreen`, `VNConfirmDialog`, `BeastyLoadingScreen`, `VNLocalizedText` | Toda la interfaz en un solo prefab. |
| `Stage` | `FreeRoamScenario` | El escenario raíz y el escenario de mundo libre. |
| `DialogPanel` | `DialogueTextEffect` | El cuadro de diálogo: placa de nombre, texto, indicador de continuar. |
| `ChoiseRoot` | (solo uGUI) | El contenedor donde se instancian los botones de opción. |
| `ChoiseBtn` | (solo uGUI) | Un botón de opción, instanciado por cada opción. |
| `VNMenuRoot` | `VNMenuManager`, `MainMenuScreen`, `GameMenuScreen`, `SaveLoadScreen`, `PreferencesScreen`, `HistoryScreen`, `CreditsScreen`, `HelpScreen`, `VNConfirmDialog`, `VNLocalizedText` | Cada pantalla de menú bajo una sola raíz. |
| `MainMenuScreen` | `MainMenuScreen` | La pantalla de título. |
| `GameMenuScreen` | `GameMenuScreen`, `SaveLoadScreen`, `PreferencesScreen`, `HistoryScreen`, `CreditsScreen`, `HelpScreen` | El menú dentro del juego y las pantallas que abre. |
| `VNSaveSlot` | `SaveSlotView` | Una ranura de guardado. Instanciada por cada ranura. |
| `VNBacklogEntry` | (solo uGUI) | Una línea en la pantalla de historial. Instanciada por cada línea. |
| `Inventory` | `InventoryScreen`, `InventorySlot`, `InventoryDetailPopup`, `FlexibleGridLayout` | La pantalla de inventario, sus ranuras y el popup de detalle. |
| `CharactersMenu` | `CharacterListScreen`, `CharacterListRow` | La lista de elenco. |
| `CharacterProfile` | `CharacterProfileScreen`, `CharacterStatsScreen`, `CharacterStatRow`, `CharacterRoutineScreen`, `CharacterQuestsScreen`, `CharacterQuestRow`, `FreeRoamScreenElement` | El perfil de un personaje, con su barra de pestañas y paneles de sección. |
| `CharacterStats` | `CharacterStatsScreen`, `CharacterStatRow` | El panel de estadísticas por separado. |
| `GridMenu` | `FlexibleGridLayout` | Una pantalla overlay organizada como grilla. |
| `VerticalMenu` | `FreeRoamScreenElement` | Una pantalla overlay organizada como lista vertical. |
| `GridItemScreenElement`, `ItemScreenElement`, `VerticalItemScreenElement` | `FreeRoamScreenElement`, `VariableBoundLabel` | Las plantillas de elemento con las que se construyen los ítems de una pantalla. |
| `BeastyVNMixer` | (AudioMixer) | El mixer, con un grupo por canal: Music, Ambient, Sfx, Voice. |

## Los prefabs de escena

`VisualNovelScene` es una escena completa. Monta el BeastyManager con cada manager que posee, el Stage y el
Canvas. `Tools > Beasty VN > Setup > Create Scene` construye ese mismo rig directamente en tu propia escena,
que es lo que quieres en un proyecto real.

`Stage` lleva el componente `FreeRoamScenario`. Ahí es donde asignas tu `FreeRoamMapGraph`.

Cada personaje del escenario es un objeto `CharactersRoot/Character_N`: un `CharacterLookView` con un
`SortingGroup` y un hijo `Part_i/Sprite` por parte. Una expresión Single tiene exactamente una parte,
`Part_0/Sprite`; una [expresión por capas](/es/docs/beasty-visual-novel/world/layered-expressions/) tiene una
por cada capa y parte de ropa. Voltear un personaje refleja el `Character_N` entero con una escala X negativa.
Un script que necesite el sprite de un personaje lo busca debajo de `Character_N`, no en él, y lee el volteo
del signo de `localScale.x` de `Character_N`.

Los efectos de pantalla no necesitan prefab: el BeastyManager crea el `VNStageCompositor` en tiempo de
ejecución, con el shader `Beasty/VN/StageComposite` de `Resources`.

## Los prefabs de diálogo y opciones

`VN_Canvas` contiene toda la interfaz. `DialogueView` maneja el cuadro de diálogo, `ChoiceView` maneja las
opciones.

- Para rediseñar el cuadro de diálogo, edita `DialogPanel`. Su placa de nombre está sobre la esquina superior
  izquierda de la caja, y `DialogueView` → **Speaker Panel** apunta a ella, así que las líneas de narración
  ocultan la placa entera. El cuadro para escribir (`InputPrompt`) tiene sus propios botones **Confirm** y
  **Back**; **Back** va cableado a `DialogueView` → **Input Back Button** y se traduce con `input.back`.
- Para rediseñar las opciones, edita `ChoiseBtn` (un botón) y `ChoiseRoot` (su contenedor). `ChoiceView`
  instancia `ChoiseBtn` una vez por cada opción que pasa su condición.

`ChoiseRoot` y `ChoiseBtn` no montan ningún componente de Beasty. Son objetos uGUI comunes, lo que
significa que puedes reconstruirlos como quieras siempre que las partes que la vista busca sigan ahí.

Consulta [Diálogo y escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/) y
[Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/).

## Los prefabs de menú

`VNMenuRoot` monta `VNMenuManager` más cada pantalla que administra: menú principal, menú del juego,
guardar/cargar, preferencias, historial, créditos, ayuda, y el diálogo de confirmación. Se autoconecta al rig
de BeastyManager en tiempo de ejecución, así que puedes soltarlo bajo cualquier Canvas.

`MainMenuScreen` y `GameMenuScreen` también existen como prefabs independientes, que es lo que editas cuando
quieres rediseñar un menú en vez del conjunto completo.

`VNSaveSlot` y `VNBacklogEntry` son plantillas: una se instancia por cada ranura de guardado, otra por cada
línea de historial. Rediseña la plantilla y todas las filas cambian con ella. Una ranura vacía muestra
`SaveSlotView` → **Empty Stock Sprite**, por defecto la imagen discontinua `slot_empty`.

`PreferencesScreen` (en `GameMenuScreen`) tiene campos opcionales para las filas nuevas: **Auto On By Default
Toggle**, el interruptor de reducir movimiento y **Language Row** —la fila de idioma entera, etiqueta incluida,
que se oculta cuando el juego tiene un solo idioma—. Un prefab de menú construido antes de que existieran estas
filas no las ofrece hasta que vuelves a ejecutar **Build Default Menu Prefabs**; mientras tanto, las
preferencias mantienen su valor por defecto. Consulta [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/#la-pantalla-de-preferencias).

`Tools > Beasty VN > Setup > Build Default Menu Prefabs` los reconstruye desde cero y te avisa antes de
sobrescribir nada. `Tools > Beasty VN > Setup > Upgrade UI Prefabs (keep customizations)` los actualiza
conservando tu rediseño.

Los componentes `VNLocalizedText` de estos prefabs son los que hacen que los menús sigan el idioma del
jugador. Después de reconstruirlos o de cambiarles el estilo, ejecuta `Bake Localized UI Labels` para que
cualquier etiqueta que se haya quedado sin componente lo recupere: consulta
[Localización](/es/docs/beasty-visual-novel/production/localization/).

## Las pantallas de gameplay

El inventario y las pantallas de personaje se construyen copiando el prefab incluido en la carpeta de tu
proyecto y registrando la copia como una pantalla en el VNContext.

> **Nota**
> Rediseñas **tu copia**, no el prefab en la carpeta del paquete. Editar el prefab incluido no tiene efecto
> en una pantalla que ya fue creada, porque la pantalla apunta a la copia.

| Quieres rediseñar | Abre |
|---|---|
| La grilla de inventario, una ranura, el popup de detalle del objeto | `Inventory` |
| La lista de elenco | `CharactersMenu` |
| El perfil de un personaje, su barra de pestañas, sus secciones | `CharacterProfile` |
| Solo el panel de estadísticas | `CharacterStats` |
| Una pantalla overlay organizada como grilla | `GridMenu` más `GridItemScreenElement` |
| Una pantalla overlay organizada como lista | `VerticalMenu` más `VerticalItemScreenElement` |
| La superposición de smartphone y sus apps | `Phone` (consulta [Pantallas de teléfono](/es/docs/beasty-visual-novel/world/phone-screens/)) |

- `PhoneAppScreen` marca un prefab de pantalla como la versión de teléfono de una plantilla.
- `CharacterRoutineScreen` → **Day Header Template** (`dayHeaderTemplate`) dibuja la semana de la rutina como
  un grupo por día. **Upgrade UI Prefabs** deja como está una pantalla que lo usa.
- `RuntimeListView`, la lista virtualizada que hay detrás de la lista de reparto, virtualiza también una
  **grilla**: cuando el contenido con scroll tiene un `GridLayoutGroup` o un `ResponsiveGridLayout`, las columnas
  siguen el ancho del contenido y solo existen las filas de tarjetas visibles.
- `ResponsiveGridLayout` mantiene el tamaño de sus celdas cuando el contenedor crece con su contenido (un
  `ContentSizeFitter` activo con ajuste vertical), así que las tarjetas dentro de una vista con scroll nunca se
  aplastan.

`VariableBoundLabel` en las plantillas de elemento es lo que le permite a una etiqueta de HUD mostrar una
variable en vivo.

Consulta [Objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/),
[Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) y [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/).

## El mixer

`BeastyVNMixer` es un AudioMixer estándar de Unity con un grupo por canal: Music, Ambient, Sfx y Voice. Los
sliders de volumen de la pantalla de Preferencias escriben en él. Si lo prefieres, apunta el audio manager a
tu propio mixer, siempre que exponga los mismos cuatro grupos.

Consulta [Audio y música](/es/docs/beasty-visual-novel/production/audio-and-music/).

## Ver también

- [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) — rediseño y actualización, en detalle
- [Menús](/es/docs/beasty-visual-novel/reference/menu-items/)
- [Assets](/es/docs/beasty-visual-novel/reference/assets/)
