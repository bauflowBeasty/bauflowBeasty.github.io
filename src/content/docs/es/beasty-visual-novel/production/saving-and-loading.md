---
title: "Guardado y carga"
description: "El guardado funciona desde el primer momento. Qué es un slot, qué contiene, cómo se comporta el autoguardado y qué ve el jugador si una partida se daña."
---

El guardado funciona desde el primer momento. No escribes ningún código, y no tienes que decirle al sistema qué
guardar. Esta página es para el diseñador que quiere saber qué es un slot, qué contiene, y qué ve el jugador
cuando algo sale mal.

## Slots

Una partida guardada vive en un slot. Hay dos tipos:

![La pantalla de guardar/cargar: slots con miniaturas y su metadata](/docs-images/beasty-visual-novel/vn-save-load-ingame.png)

| Tipo | Nombre del slot | Escrito por |
|---|---|---|
| Manual | `manual_0`, `manual_1`, ... | El jugador, desde la pantalla de guardado |
| Autoguardado | `auto_0`, `auto_1`, ... | El juego, automáticamente (ver [Autoguardado](#autoguardado)) |

Junto a cada archivo de guardado el juego escribe una **miniatura PNG** con el mismo nombre, así que la
pantalla de guardado muestra una imagen del momento en que el jugador guardó. Si falta una miniatura o no se
puede leer, el slot usa el sprite de miniatura predeterminado de [VN Settings](/es/docs/beasty-visual-novel/production/vn-settings/). (Un slot VACÍO
muestra en su lugar el arte de stock del prefab del slot, no ese respaldo.)

Cada slot también lleva un **nombre**. Si `allowSaveNaming` está activado, el campo de texto de la pantalla de
guardado permite al jugador titular la partida; cuando lo deja en blanco, el slot se etiqueta con la fecha y
hora locales en que se creó.

La pantalla de guardado muestra una **página** de slots manuales a la vez — `saveSlotsPerPage` de ellos — con
botones de paginación. `saveManualPages` establece cuántas páginas se muestran inicialmente, y las páginas
**crecen automáticamente**: siempre hay al menos una página vacía después de la última que usó el jugador, así
que nunca se queda sin espacio. Los autoguardados tienen su propia página dedicada, que es **solo para
cargar** — el jugador no puede sobrescribir un autoguardado a mano.

## Autoguardado

El autoguardado está activado por defecto (`autosaveEnabled`). El juego autoguarda cuando el jugador llega a
una decisión.

![Los ajustes de autoguardado y de slots en Global Settings](/docs-images/beasty-visual-novel/vn-autosave-settings.png)

Las reglas:

- Los slots de autoguardado forman un **anillo** de como máximo `maxAutosaves` entradas (6 por defecto). Cuando
  el anillo está lleno, el autoguardado MÁS ANTIGUO es el que se sobrescribe.
- **La UI de guardado nunca sobrescribe un autoguardado.** Viven bajo su propio prefijo y su página es solo
  para cargar.
- **Deduplicación anti-retroceso.** Si el autoguardado más reciente está en la misma posición (mismo nodo,
  mismo paso) y se escribió hace menos de `autosaveAntiRollbackMargin` segundos, el nuevo autoguardado se
  omite. Sin esto, un jugador que retrocede y vuelve a elegir la misma opción inundaría el anillo y expulsaría
  sus autoguardados reales.

El orden se deriva de la marca de tiempo de creación de cada archivo, así que sobrevive a un reinicio sin
registros adicionales.

## Qué contiene realmente una partida guardada

Todo. Esta es la parte tranquilizadora; aquí va la lista:

- El id del proyecto, la **ruta del grafo** a través de cualquier subgrafo anidado, el nodo actual y el paso
  dentro de él.
- El **idioma** activo.
- **Todo el almacén de variables** — tus variables, las variables de personaje, el tiempo de juego, el estado
  de las misiones, el inventario, y el diccionario. Todos viven en un solo almacén, por eso todos se guardan
  sin estar registrados en ningún lado. Consulta [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/).
- Los **nodos visitados** (así que el "texto visto" y el salto de texto se mantienen correctos).
- Las **pantallas abiertas** — las superposiciones secundarias que estaban abiertas, la más interna al final,
  así que cargar reabre la misma pila de navegación.
- El **estado del mundo libre**: el escenario, la sala actual, y las salas que el jugador ha visitado.
- El **escenario**: el fondo, los personajes en él y los props — restaurados incluso cuando la escena en
  pantalla se heredó de un nodo anterior.
- El **historial de rebobinado** y la cola de retroceso entre modos, así que `Back` sigue cruzando líneas y
  modos después de cargar en lugar de detenerse en la línea restaurada.
- El resultado pendiente del menú de conversación, así que una partida guardada en medio de una rama de
  conversación sigue aplicando su desenlace.
- El estado de cada componente **`BeastySaveable`** en tu escena — tus propios GameObjects, guardados junto con
  la historia.
- Un blob `customStateJson` reservado para que lo llenes tú (más abajo).

Los sprites, prefabs y otras referencias a objetos de Unity nunca se escriben en una partida guardada. Se
vuelven a resolver a partir de tus assets al cargar, así que mover o restilizar el arte no invalida una partida
antigua.

## Cargar, y una partida dañada

Cargar un slot restaura todo lo de la lista anterior y devuelve al jugador exactamente al lugar donde estaba,
incluido el modo en el que se encontraba — novela visual, mundo libre o un modo personalizado.

Cada escritura es atómica — el archivo nuevo se escribe completo o no se escribe en absoluto — y el archivo
bueno anterior se conserva junto a él como copia de respaldo `.bak`. Así que cuando un
slot no se puede leer — un archivo a medio escribir tras un corte de energía, una partida manipulada — la
carga informa que hay una copia de respaldo disponible, y la pantalla de guardado ofrece al jugador un diálogo de
confirmación: **"Esta partida está dañada. ¿Restaurar la copia de respaldo?"**. Aceptar restaura la versión
anterior de ese slot y reintenta la carga. Un slot dañado permanece VISIBLE en la lista, etiquetado como
`Partida dañada`, así que el jugador puede restaurarlo o eliminarlo en lugar de ver su partida desaparecer en
silencio.

## Dónde están los archivos, y qué lo hace posible

Las partidas se escriben bajo la ruta de datos persistentes de la plataforma, en la carpeta `VisualNovel`, con
la extensión `vnsave`, y la miniatura como un `.png` junto a cada una.

Todo esto funciona gracias a **Beasty Save System**, que viene incluido dentro de este paquete. No hay nada que
instalar ni ninguna dependencia externa — nada de Newtonsoft, nada de add-ons. Es el mismo sistema de guardado
documentado como un producto propio:

- [Beasty Save System](/es/docs/beasty-save-system/) — qué es y qué puede hacer.
- [Copias de respaldo y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/) — la escritura atómica, el
  archivo `.bak`, y exactamente qué ve un jugador cuando una partida se corrompe.

## Guardar el estado de tu propio juego

Si eres programador y tu juego tiene estado que el motor de historia no conoce — un minijuego, un sistema de
batalla, una pantalla de mapa — tienes dos opciones:

- Pon un `BeastySaveable` en tus GameObjects. Su estado se captura con la partida y se restaura con ella, sin
  código. Consulta [Estado de escena](/es/docs/beasty-save-system/guides/scene-state/).
- Usa el estado de app **Custom** y su blob `customStateJson`, que se guarda, carga y retrocede junto con todo
  lo demás. Consulta [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/).

## Ver también

- [VN settings](/es/docs/beasty-visual-novel/production/vn-settings/) — autoguardado, slots por página, nombrado de partidas, la miniatura predeterminada.
- [UI prefabs](/es/docs/beasty-visual-novel/production/ui-prefabs/) — restilizar la pantalla de guardado/carga y la plantilla de slot.
- [Entrada y controles](/es/docs/beasty-visual-novel/production/input-and-controls/) — guardado rápido (F5) y carga rápida (F9).
