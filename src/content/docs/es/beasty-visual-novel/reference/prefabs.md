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

## Los prefabs de diálogo y opciones

`VN_Canvas` contiene toda la interfaz. `DialogueView` maneja el cuadro de diálogo, `ChoiceView` maneja las
opciones.

- Para rediseñar el cuadro de diálogo, edita `DialogPanel`.
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
línea de historial. Rediseña la plantilla y todas las filas cambian con ella.

`Tools > Beasty VN > Setup > Build Default Menu Prefabs` los reconstruye desde cero y te avisa antes de
sobrescribir nada. `Tools > Beasty VN > Setup > Upgrade UI Prefabs (keep customizations)` los actualiza
conservando tu rediseño.

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
