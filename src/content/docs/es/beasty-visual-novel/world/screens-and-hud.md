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
| **Primary HUD** | Un HUD persistente. Está en pantalla siempre que su modo y su condición lo permitan. El dinero, el día, un retrato, un botón que abre el inventario. |
| **Secondary overlay** | Una superposición. No está en pantalla hasta que algo la abre, y vuelve a cerrarse. El inventario, un mapa, un panel de ajustes. |

Las pantallas se crean desde el menú **+ New screen** de la lista de pantallas de la pestaña:

| Entrada | Qué crea |
|---|---|
| **Primary** | Un HUD vacío. |
| **Secondary ▸ Blank overlay** / **Phone app** | Una superposición vacía, o una app de teléfono vacía. |
| **Menu ▸ Grid** / **Vertical list** / **Phone grid** / **Phone list** | Un menú de botones, sobre una hoja de papel o dentro del teléfono. |
| **Inventory ▸ Notebook** / **Phone** | El [inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/) ya hecho. |
| **Characters ▸ Notebook** / **Phone** | La [lista de personajes y el perfil](/es/docs/beasty-visual-novel/world/character-screens/) ya hechos. |
| **Phone** | Un smartphone ya hecho, con apps. Consulta [Pantallas de teléfono](/es/docs/beasty-visual-novel/world/phone-screens/). |
| **Add existing prefab…** | Registra un prefab que ya tenías. |

Un proyecto puede tener los dos inventarios a la vez, el de cuaderno y el de teléfono, mostrando los mismos
ítems. Cada tipo se sigue creando una sola vez.

## Dónde aparece una pantalla

![Un HUD en el juego: un contador de dinero en vivo, el día, y un botón que abre una pantalla](/docs-images/beasty-visual-novel/vn-hud-ingame.png)

| Campo | Qué hace |
|---|---|
| **Id** | El id estable. El bloque **Open screen** y cualquier botón que abra esta pantalla la nombran por su id. Renombrarlo renombra también el prefab y mueve sus traducciones. |
| **Prefab (uGUI)** | El prefab de la pantalla. |
| **Kind** | HUD primario o superposición secundaria. |
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

**+ Button** y **+ Decoration** crean el elemento, crean su objeto dentro del prefab y ponen el cursor en su
campo **Name**. Renombrar un elemento renombra ambos lados.

### La lista de elementos

Los elementos se listan en filas agrupadas por el contenedor en el que están; una lista con scroll muestra el
nombre de su dueño. Cada fila tiene un asa de arrastre, el icono del elemento, su nombre y un resumen de una
línea de lo que hace. Arrastra el asa para reordenar dentro del grupo: el prefab de la pantalla lo sigue. La
fila seleccionada abre su editor debajo.

**Haz clic en un elemento de la vista previa** para seleccionarlo: la lista se desplaza hasta él y lo marca en
azul.

Los atajos funcionan con el foco en cualquier parte de la sección, y el menú del clic derecho de la fila los
lista:

| Atajo | Acción |
|---|---|
| Supr / Retroceso | Borrar el elemento. |
| F2 | Renombrar. |
| Ctrl+D | Duplicar: un elemento nuevo junto al original, con los mismos ajustes. |
| Ctrl+C / Ctrl+V | Copiar los ajustes y pegarlos en el elemento seleccionado. |
| Arriba / Abajo | Seleccionar el elemento anterior / siguiente. |
| Esc | Limpiar la selección. |
| F | Mostrar la selección en la lista. |

### Lo que tiene todo elemento

- **Icon** — el icono base del elemento, guardado en el prefab de la pantalla.
- **Text** — texto de etiqueta fijo. Puede estar vacío. Se traduce en
  [Localization › Game UI](/es/docs/beasty-visual-novel/production/localization/#la-pestaña-game-ui).
- **Variable (live)** — una variable cuyo valor actual se añade al texto, y **se mantiene actualizado en
  tiempo de ejecución**. Este es el contador de dinero en vivo: Text = `Money: `, Variable = `gold`, y la etiqueta dice
  `Money: 120` y cambia en el instante en que el jugador gana una moneda. Cualquier variable funciona, incluidas las reservadas
  — elige `time.day` y tienes un contador de días. Para texto que lee el jugador, elige un token traducido:
  `@time:daypart.label`, `@time:weekday.label`, o `@time:clock.label` (la hora como `HH:00` si hay reloj, el
  nombre del momento del día si no lo hay).
- **Visible when** — una condición. Vacío = siempre mostrado.
- **Conditional variants (icon/text)** — una lista ordenada de **casos**. Cada caso tiene una condición, un icono opcional y
  un texto opcional. **Gana el primer caso cuya condición se cumpla**; si ninguno lo hace, se aplican el icono y la etiqueta
  base del elemento. Un caso que solo fija un icono conserva la etiqueta base, y viceversa.

Los casos son la forma en que un elemento dice varias cosas. Un icono de clima que cambia con la estación. Un
retrato que cambia con el afecto. Un icono de puerta que muestra un candado mientras la tienda está cerrada.

El icono propio del elemento siempre gana a un cambio hecho en tiempo de ejecución: un icono que un script pone
en un elemento de pantalla se sustituye la próxima vez que la pantalla se refresca. Usa un caso en su lugar.

## Acciones

El desplegable **Does** dice qué hace un elemento al clicarlo:

![Un elemento de tipo botón con su desplegable Does abierto](/docs-images/beasty-visual-novel/vn-screen-button-action.png)

| Does | Qué hace |
|---|---|
| **Nothing (decoration)** | No clicable. Muestra arte y/o una etiqueta. |
| **Open screen** | Abre una pantalla secundaria (tú eliges cuál). |
| **Back** | Retrocede **un** nivel: vuelve a mostrar la pantalla padre, o cierra la superposición si es el nivel superior. |
| **Close all screens** | Cierra **toda** la pila secundaria de una vez. El botón de "salir". |
| **Open game menu** | Abre el menú de pausa en Guardar/Cargar, Preferencias, Historial, Ayuda o Créditos. La pantalla sigue abierta debajo, y el jugador vuelve a ella. Avisa si la escena abierta no tiene gestor de menús. |
| **Change values only** | Aplica los cambios **On click** del botón y nada más. Para botones que solo cambian valores. |
| **Enter VN scene** | Entra en una escena de novela visual, en un nodo de inicio que eliges de esa escena. La pila de superposición se cierra y se reproduce el diálogo. |
| **Advance time** | Cambia el reloj del juego, con las mismas operaciones que el bloque [Advance time](/es/docs/beasty-visual-novel/world/game-time/); el momento del día y el día de la semana salen del time config. Un botón de "esperar" o "dormir". Necesita un Time Config en el BeastyManager. |
| **Custom event** | Lanza un id de evento personalizado para que tu propio script lo gestione. |

### Efectos al clicar

Independientemente de la acción, un botón puede llevar efectos de variable **On click**: `gold` Subtract `10`,
`stamina` Subtract `1`, `flag_visited` Toggle. Se aplican **antes** de que se ejecute la acción. Un botón puede cobrarle
al jugador y luego abrir la pantalla.

### Cambiar las preferencias del jugador

**On click** también puede cambiar las preferencias del jugador. Elige una del grupo **Player preferences**:

| Preferencia | Qué es | Operaciones |
|---|---|---|
| `@pref:textSpeed` | Velocidad del texto. | Assign, Add, Subtract |
| `@pref:autoDelay` | Tiempo del auto-avance. | Assign, Add, Subtract |
| `@pref:volume.master`, `.music`, `.sfx`, `.voice`, `.ambience` | Un volumen, entre 0 y 1. | Assign, Add, Subtract, Toggle |
| `@pref:autoOnStart` | Empezar con auto-avance. | Assign, Toggle |
| `@pref:skipUnread` | Saltar el texto no leído. | Assign, Toggle |
| `@pref:reduceMotion` | Reducir destellos y movimiento. | Assign, Toggle |
| `@pref:walkthrough` | [Pistas de la guía](/es/docs/beasty-visual-novel/world/notifications-and-walkthrough/). | Assign, Toggle |

Los volúmenes se quedan entre 0 y 1. **Toggle** sobre un volumen lo silencia, y volver a pulsarlo recupera el
volumen que tenía: un botón de silencio en una línea.

Las preferencias se pueden leer en cualquier sitio: en condiciones y en etiquetas como `[@pref:volume.music]`.
`@pref:walkthrough.available` dice si el proyecto tiene activadas las pistas de la guía. La historia no puede
cambiar preferencias: un bloque Set variable o un efecto de opción que apunta a una clave `@pref:` se ignora, con
un aviso por clave. Las preferencias nunca se guardan en las partidas.

### Interactivo en VN

Un botón en una pantalla cuyo modo incluye `VisualNovel` tiene un interruptor extra: **Interactive in VN**. Desactívalo
y el botón sigue siendo **visible** durante el diálogo pero no responde. Úsalo para mantener un HUD legible durante
una escena sin dejar que el jugador se vaya a mitad de una conversación. En mundo libre un botón siempre es interactivo;
el interruptor no se ofrece ahí.

## La pila secundaria

Las pantallas secundarias forman una **pila**. Abrir una desde otra la apila y oculta a su padre, así que solo la
superposición superior está en pantalla. **Back** desapila un nivel y vuelve a mostrar al padre; **Close all screens**
descarta toda la pila.

Todo esto lo obtienes sin conectar nada: **toda pantalla secundaria recibe un botón Back automáticamente** al
crearse — un elemento arriba a la derecha con la acción **Back**. Clicar fuera del panel también cierra la superposición, y
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

La pestaña Screens muestra una vista previa del prefab de la pantalla seleccionada junto a sus ajustes, tal como
se ve en el juego, también para un prefab con su propio Canvas. Se redibuja cuando cambian el prefab o el ancho
de la columna. **Edit layout (open prefab)** te lleva al prefab para mover cosas de sitio; **Refresh** vuelve a
renderizar la vista previa. El desplegable **Hierarchy (who opens what)** muestra el árbol de pantallas y qué
botón abre cuál — y te deja añadir o desvincular una pantalla hija sin tener que buscar el botón que lo hace.

![La vista previa de la pantalla junto a sus ajustes, con el desplegable de jerarquía](/docs-images/beasty-visual-novel/vn-screen-preview.png)

La sección se adapta a ventanas estrechas: las etiquetas se encogen con la columna y las filas largas saltan de
línea en vez de desplazarse de lado. La vista previa es lo primero que se estrecha; cuando ya no cabe, se pliega
en un interruptor **Preview** de la barra de herramientas que la muestra en lugar de la configuración hasta que
lo apagas.

## Deshacer

Añadir, renombrar, borrar y reordenar elementos, y cambiar el icono de un elemento, se puede deshacer, prefab
incluido: un Ctrl+Z repone a la vez los ajustes del elemento y su objeto en el prefab de la pantalla, y Ctrl+Y lo
rehace. Vincular y desvincular una pantalla hija desde la jerarquía se deshace igual. Borrar un elemento no pide
confirmación, porque se puede deshacer.

> **Nota**
> Deshacer un paso de Screens restaura el prefab tal como estaba en ese paso. Lo que hayas editado a mano en
> Prefab Mode después se sobrescribe. Deshacer la creación de una pantalla o app de teléfono quita la pantalla y
> sus entradas, pero deja los prefabs copiados en tu carpeta de Screens.

## Ver también

- [Pantallas de teléfono](/es/docs/beasty-visual-novel/world/phone-screens/) — el teléfono ya hecho y sus apps.
- [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) — restilizar cada pantalla, y actualizar los prefabs de fábrica.
- [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) — la lista de reparto, el perfil, las estadísticas, el calendario y el registro de misiones ya hechos.
- [Objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/) — la pantalla de inventario ya hecha.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — qué puede leer una etiqueta en vivo y la condición de un caso.
- [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/) — las operaciones de la acción Advance time.
