---
title: "Pantallas y HUD"
description: "El contador de dinero en la esquina, el reloj, el botón de inventario, el panel que se abre al clicarlo. Esta página es para guionistas y diseñadores."
---

El contador de dinero en la esquina, el reloj, el botón de inventario, el panel que se abre al clicarlo. Esta
página es para guionistas y diseñadores.

Autoras pantallas en la pestaña **Screens** de la ventana Beasty VN (`Tools > Beasty VN > Editor`). Una pantalla es un
prefab uGUI más un pequeño registro que dice qué significa cada cosa en él. El prefab define el aspecto; el registro
define la lógica. La misma división que las salas.

## Dos tipos de pantalla

![La pestaña Screens: la lista de pantallas, sus ajustes y la vista previa del prefab](/docs-images/beasty-visual-novel/vn-tab-screens.png)

| Tipo | Qué es |
|---|---|
| **Primary** (Is Main) | Un HUD persistente. Está en pantalla siempre que su modo y su condición lo permitan. El dinero, el día, un retrato, un botón que abre el inventario. |
| **Secondary** | Una superposición. No está en pantalla hasta que algo la abre, y vuelve a cerrarse. El inventario, un mapa, un panel de ajustes. |

Créalas con **+ Primary** y **+ Secondary** en la lista de pantallas de la pestaña. También hay algunas ya hechas:
**+ Inventory (ready-made)**, **+ Menu** (una grilla o una lista vertical) y **+ Characters**.

## Dónde aparece una pantalla

![Un HUD en el juego: un contador de dinero en vivo, el día, y un botón que abre una pantalla](/docs-images/beasty-visual-novel/vn-hud-ingame.png)

| Campo | Qué hace |
|---|---|
| **Id** | El id estable. El bloque **Open screen** y cualquier botón que abra esta pantalla la nombran por su id. Renombrarlo renombra también el prefab. |
| **Prefab (uGUI)** | El prefab de la pantalla. |
| **Is Main (primary/HUD)** | Primaria o secundaria. |
| **Mode** | `FreeRoam`, `VisualNovel` o `Both`. |
| **Visible when** | Una condición. Vacío = siempre (dentro de su modo). |

**Mode** es el ajuste grueso: un contador de dinero suele ser `Both`; un botón de "viajar a otra sala" es
`FreeRoam`; un panel de "resumen" podría ser solo `VisualNovel`. **Visible when** es el fino: muestra la barra de
resistencia solo después del tutorial, oculta el reloj bajo techo.

Una pantalla primaria se muestra cuando su modo coincide con el estado actual de la aplicación **y** su condición
se cumple. Las dos cosas tienen que darse a la vez.

## Elementos

Un **elemento** (item) es una cosa dentro de la pantalla: un icono, una etiqueta, un botón. **Un elemento recibe el nombre
de un objeto en el prefab** — el registro y el elemento del prefab se emparejan por nombre, así que nunca escribes un id.

![Un elemento de pantalla: texto, variable en vivo, condición de visibilidad y variantes condicionales](/docs-images/beasty-visual-novel/vn-screen-item.png)

Añade uno con el campo de nombre más **+ Item** (decoración) o **+ Button** (interactivo). La pestaña crea el
elemento dentro del prefab por ti y añade su registro. Renombrar un elemento renombra ambos lados.

| Rol | Qué es |
|---|---|
| `Decoration` | No clicable. Muestra arte y/o una etiqueta. |
| `Button` | Clicable: respuesta al pasar el cursor más una acción. |

Todo elemento, sea cual sea su rol, tiene:

- **Text** — texto de etiqueta fijo. Puede estar vacío.
- **Variable (live)** — una variable cuyo valor actual se añade al texto, y **se mantiene actualizado en
  tiempo de ejecución**. Este es el contador de dinero en vivo: Text = `Money: `, Variable = `gold`, y la etiqueta dice
  `Money: 120` y cambia en el instante en que el jugador gana una moneda. Cualquier variable funciona, incluidas las reservadas
  — elige `time.day` y tienes un contador de días; elige `time.daypart` y tienes el momento del día.
- **Visible when** — una condición. Vacío = siempre mostrado.
- **Conditional variants (icon/text)** — una lista ordenada de **casos**. Cada caso tiene una condición, un icono opcional y
  un texto opcional. **Gana el primer caso cuya condición se cumpla**; si ninguno lo hace, se aplican el icono y la etiqueta
  base del elemento. Un caso que solo fija un icono conserva la etiqueta base, y viceversa.

Los casos son la forma en que un elemento dice varias cosas. Un icono de clima que cambia con la estación. Un
retrato que cambia con el afecto. Un icono de puerta que muestra un candado mientras la tienda está cerrada.

## Acciones

Un elemento **Button** tiene una acción:

![Un elemento de tipo botón con su desplegable de acción abierto](/docs-images/beasty-visual-novel/vn-screen-button-action.png)

| Acción | Qué hace |
|---|---|
| `OpenScreen` | Abre una pantalla secundaria (tú eliges cuál). |
| `Close` | Cierra **toda** la pila secundaria de una vez. El botón de "salir". |
| `Back` | Retrocede **un** nivel: vuelve a mostrar la pantalla padre, o cierra la superposición si es el nivel superior. |
| `Custom` | Lanza un id de evento personalizado para que tu propio script lo gestione. |
| `EnterVN` | Entra en una escena de novela visual, opcionalmente en un nodo específico. La pila de superposición se cierra y se reproduce el diálogo. |
| `AdvanceTime` | Cambia el reloj del juego, con las mismas operaciones que el bloque [Advance time](/es/docs/beasty-visual-novel/world/game-time/). Un botón de "esperar" o "dormir". Necesita un Time Config en el BeastyManager. |

### Efectos al clicar

Independientemente de la acción, un botón puede llevar efectos de variable **On click**: `gold` Subtract `10`,
`stamina` Subtract `1`, `flag_visited` Toggle. Se aplican **antes** de que se ejecute la acción. Un botón puede cobrarle
al jugador y luego abrir la pantalla.

### Interactivo en VN

Un botón en una pantalla cuyo modo incluye `VisualNovel` tiene un interruptor extra: **Interactive in VN**. Desactívalo
y el botón sigue siendo **visible** durante el diálogo pero no responde. Úsalo para mantener un HUD legible durante
una escena sin dejar que el jugador se vaya a mitad de una conversación. En mundo libre un botón siempre es interactivo;
el interruptor no se ofrece ahí.

## La pila secundaria

Las pantallas secundarias forman una **pila**. Abrir una desde otra la apila y oculta a su padre, así que solo la
superposición superior está en pantalla. **Back** desapila un nivel y vuelve a mostrar al padre; **Close** descarta toda la
pila.

Todo esto lo obtienes sin conectar nada: **toda pantalla secundaria recibe un botón Back automáticamente** al
crearse — un elemento arriba a la derecha con la acción `Back`. Clicar fuera del panel también cierra la superposición, y
mientras cualquier pantalla secundaria está abierta hay un bloqueador detrás de ella, así que un clic destinado a la superposición
nunca se filtra hacia la sala de debajo. Las pantallas secundarias son modales.

La pila abierta forma parte de la partida guardada, así que un jugador que guarda con el inventario abierto lo recarga con el
inventario abierto.

## Abrir una pantalla desde la historia

El bloque **Open screen** (categoría de paleta **World**) abre una pantalla secundaria por su id desde dentro de un nodo. Úsalo
para mostrarle al jugador el mapa cuando la historia se lo entrega, o para abrir el inventario la primera vez que
recoge algo.

```text
[Dialogue]     "The old man presses a folded map into your hand."
[Open screen]  screen = map
```

En el guion de texto:

```text
screen map
```

El bloque es solo presentación — abre la superposición, y el jugador la cierra como cualquier otra. No hay
nada que restaurar al rebobinar.

## Vista previa

La pestaña Screens muestra una vista previa del prefab de la pantalla seleccionada junto a sus ajustes. **Edit layout (open prefab)** te
lleva al prefab para mover cosas de sitio; **Refresh** vuelve a renderizar la vista previa. El desplegable **Hierarchy (who opens what)**
muestra el árbol de pantallas y qué botón abre cuál — y te deja añadir o desvincular una pantalla hija
sin tener que buscar el botón que lo hace.

![La vista previa de la pantalla junto a sus ajustes, con el desplegable de jerarquía](/docs-images/beasty-visual-novel/vn-screen-preview.png)

## Ver también

- [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) — restilizar cada pantalla, y actualizar los prefabs de fábrica.
- [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) — la lista de reparto, el perfil, las estadísticas, el calendario y el registro de misiones ya hechos.
- [Objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/) — la pantalla de inventario ya hecha.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — qué puede leer una etiqueta en vivo y la condición de un caso.
- [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/) — las operaciones de la acción AdvanceTime.
