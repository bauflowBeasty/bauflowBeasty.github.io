---
title: "Prefabs de UI"
description: "Todo lo que el jugador ve es un prefab uGUI. No hay capa de renderizado personalizada, ningún framework de UI propietario y ningún canvas oculto: es Unity UI, en prefabs"
---

Todo lo que el jugador ve es un prefab uGUI. No hay capa de renderizado personalizada, ningún framework de UI
propietario y ningún canvas oculto: es Unity UI, en prefabs que puedes abrir y editar. Esta página los lista, y
muestra las dos formas de restilizar el juego.

## Los prefabs

| Prefab | Qué monta |
|---|---|
| `VisualNovelScene` | Una escena completa ya lista: todo lo de abajo, ya cableado. |
| `VN_Canvas` | Toda la interfaz en un prefab: la vista de diálogo, la vista de elecciones, y el gestor de menús con el menú principal, el menú de juego, guardar/cargar, preferencias, historial, créditos y pantallas de ayuda, además del diálogo de confirmación y la pantalla de carga. |
| `Stage` | El escenario (fondo, personajes, props) y el escenario de deambulación libre. |
| `DialogPanel` | El panel de diálogo: la placa de nombre y la línea. |
| `ChoiseRoot`, `ChoiseBtn` | El contenedor de elecciones y la plantilla de botón de elección. |
| `MainMenuScreen`, `GameMenuScreen`, `VNMenuRoot` | Los menús. |
| `VNSaveSlot` | Una celda de slot de guardado, instanciada una vez por slot. |
| `VNBacklogEntry` | Una línea de historial, instanciada una vez por línea. |
| `Inventory` | La pantalla de inventario, sus slots y el popup de detalle del ítem. |
| `CharactersMenu`, `CharacterProfile`, `CharacterStats`, `CharacterRoutine` | Las pantallas de personaje: la lista del elenco, el perfil con su barra de pestañas, el panel de estadísticas y el calendario de rutina. |
| `GridMenu`, `VerticalMenu` y las plantillas de elemento de ítem | Los layouts a partir de los cuales se construye una pantalla de superposición. |
| `BeastyVNMixer` | El AudioMixer, con un grupo por canal (Music, Ambient, Sfx, Voice). |

La lista completa campo por campo está en la [referencia de prefabs](/es/docs/beasty-visual-novel/reference/prefabs/).

## Cómo restilizar

**Opción 1: edita el prefab.** Ábrelo, cambia las fuentes, colores, sprites, layout y anclas, agrega tu propia
decoración. Las vistas encuentran sus piezas a través de sus campos serializados, así que mientras esos campos
sigan apuntando a algo, el prefab sigue funcionando. Este es el camino normal y no cuesta nada.

**Opción 2: apunta las vistas a tu propio canvas.** Las vistas son MonoBehaviours comunes con referencias
serializadas. Construye tu propio canvas, pon las vistas en él, cablea los campos, y el motor conduce tu UI en
lugar de la nuestra. Nada en el runtime asume la jerarquía incluida.

## Los dos elementos de menú de prefabs

| Elemento de menú | Úsalo cuando |
|---|---|
| `Tools > Beasty VN > Setup > Upgrade UI Prefabs (keep customizations)` | Quieres que los prefabs incluidos se actualicen — piezas nuevas que agregó una versión más reciente — **sin perder tu restilizado**. Solo agrega lo que falta y deja tus cambios intactos. Este es el que normalmente quieres. |
| `Tools > Beasty VN > Setup > Build Default Menu Prefabs` | Quieres que los prefabs de menú se regeneren desde cero: una raíz de menú simple y funcional con cada pantalla y cada campo cableado. Advierte antes de sobrescribir, porque reemplaza el prefab, y tu restilizado con él. |

Recurre a Build Default Menu Prefabs cuando un prefab de menú está roto sin remedio, o cuando quieres una base
limpia para restilizar. Recurre a Upgrade en cualquier otro caso.

## La pantalla negra, y el botón que la arregla

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
en cualquier momento. Ver [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/) para saber exactamente qué garantiza.

## Ver también

- [Referencia de prefabs](/es/docs/beasty-visual-novel/reference/prefabs/) — cada prefab y sus campos.
- [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/) — construir tus propias pantallas de superposición a partir de estos layouts.
- [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) — la lista del elenco, el perfil, las estadísticas, el calendario y el registro de misiones.
- [Audio y música](/es/docs/beasty-visual-novel/production/audio-and-music/) — el prefab del mezclador.
