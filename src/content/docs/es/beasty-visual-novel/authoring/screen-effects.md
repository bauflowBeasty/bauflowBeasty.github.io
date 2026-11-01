---
title: "Transiciones visuales y efectos de pantalla"
description: "Fundidos, disoluciones y barridos entre escenas, más destellos, temblores, tintes y movimientos de cámara: los bloques Effects, sus presets y el rebobinado."
---

Una **transición visual** decide cómo cambia el escenario de una línea a la siguiente: una disolución, un
fundido a negro, un barrido. Un **efecto de pantalla** colorea o mueve todo el escenario: un destello
blanco, un temblor, un recuerdo en sepia, un zoom lento de cámara. Los dos son bloques de la categoría
**Effects** de la paleta, y los dos dejan la caja de diálogo encima y legible.

Esta página trata de lo que ve el jugador. Para los bloques que pasan el control de la novela al mundo
libre o a otra escena, consulta [Transiciones: salir de la novela](/es/docs/beasty-visual-novel/authoring/transitions/).

## Los bloques Effects

![La categoría Effects de la paleta Add blocks](/docs-images/beasty-visual-novel/vn-effects-palette.png)

| Bloque | Qué hace |
|---|---|
| **Transition (with)** | Decide cómo se presenta el cambio de escena de la línea siguiente. |
| **Screen effect** | Añade un destello, temblor, tinte, pantalla de color, filtro de color, viñeta, desenfoque o movimiento de cámara. |
| **Clear effects** | Quita todos los efectos de pantalla, o solo los de un tipo. |
| **Fade**, **Dissolve** | Atajos: un bloque Transition ya ajustado a ese preset. |
| **Flash**, **Punch (vpunch)** | Atajos: un bloque Screen effect ya ajustado a ese preset. |

El editor del bloque solo muestra los campos del modo o del efecto que elegiste. Un tinte nunca enseña
campos de cámara.

## Transiciones

Pon un bloque **Transition (with)** antes de una línea. Todos los cambios de escena de esa línea —fondo,
personajes, props, un fondo de vídeo— se presentan con él. La idea viene de la instrucción `with` de
Ren'Py.

```text
Transition (with)   dissolve
Backdrop            Kitchen, night
Show character      Mia
Dialogue            Mia: "You are back late."
```

El fondo y Mia aparecen juntos con una disolución, y después sale la línea.

- Una línea **sin** bloque de transición cambia de golpe, como siempre.
- Si una línea tiene varios bloques de transición, **gana el último**. El validador avisa.

### Modos de transición

| Modo | Lo que ve el jugador | Campos propios |
|---|---|---|
| `cut` | Un cambio instantáneo. | — |
| `dissolve` | La escena nueva aparece fundiéndose sobre la anterior. | — |
| `fade` | La escena anterior se funde a un color y luego entra la nueva. | Color, tiempo de espera, cubrir la caja de diálogo |
| `wipe` | Una línea barre la pantalla. | Dirección (izquierda, derecha, arriba, abajo), borde suave |
| `slide` | La escena nueva se desliza por encima de la anterior. | Dirección |
| `push` | La escena nueva empuja a la anterior fuera de la pantalla. | Dirección |
| `iris` | Un círculo se abre (`in`) o se cierra (`out`) alrededor de un punto. | Dentro o fuera, punto central, borde suave |
| `pixellate` | La escena anterior se rompe en bloques que se resuelven en la nueva. | Tamaño máximo de bloque |
| `zoom` | Se acerca a la escena anterior (`in`) o se aleja de la nueva (`out`). | Dentro o fuera, punto central |
| `mask` | Una textura en escala de grises decide qué partes de la pantalla cambian primero. | Textura, borde suave, invertir |

Todos los modos tienen además:

- **Duration** — los segundos que dura la transición.
- **Easing** — la curva de velocidad: `linear`, `in` (empieza lenta), `out` (acaba lenta), `inout`.
- **Wait for completion** — activado por defecto: la línea aparece cuando termina la transición. Si lo
  desactivas, la línea aparece mientras se reproduce.

Una transición `mask` funciona como el ImageDissolve de Ren'Py. Los píxeles oscuros de la textura cambian
primero y los claros al final, o al revés con **Invert**. Sirve cualquier imagen en escala de grises: un
corazón, un degradado horizontal, ruido.

## Efectos de pantalla

Un bloque **Screen effect** añade un efecto, según su tipo:

| Tipo | Qué hace | Campos propios |
|---|---|---|
| `flash` | Un golpe de color que se desvanece. | Color, intensidad, cubrir la caja de diálogo |
| `shake` | Hace temblar el escenario. Un punch es un solo golpe; continuous sigue temblando. | Eje (horizontal, vertical, ambos), amplitud, frecuencia, punch o continuous |
| `tint` | Pone un color encima del escenario. | Color con transparencia |
| `color screen` | Tapa el escenario con un color sólido, para una pantalla negra sostenida. | Color, cubrir la caja de diálogo |
| `color filter` | Pasa el escenario a escala de grises, sepia o invertido. | Filtro, intensidad |
| `vignette` | Oscurece los bordes de la pantalla. | Color, intensidad, suavidad |
| `blur` | Desenfoca el escenario. | Radio |
| `camera` | Hace zoom hacia un punto y desplaza el encuadre. | Zoom, desplazamiento, punto de foco |

**Un efecto de cada tipo a la vez.** Un efecto nuevo sustituye al que ya estaba activo del mismo tipo; los
de tipos distintos se suman. Un filtro sepia más una viñeta más un desenfoque es un solo aspecto hecho de
tres efectos.

![Una línea en Play con el preset flashback: sepia, viñeta y un desenfoque suave, con la caja de diálogo intacta](/docs-images/beasty-visual-novel/vn-effect-flashback.png)

### Cuánto dura un efecto

Cada bloque Screen effect elige su **duración**:

| Opción | El efecto termina |
|---|---|
| **Hasta que cambie el escenario** (por defecto) | En la primera línea posterior en la que cambian el fondo, los personajes, los props o los efectos. |
| **Hasta la línea siguiente** | Cuando aparece la siguiente línea. |
| **Hasta que se quite** | Cuando un bloque Clear effects lo quita. |
| **Segundos** | Pasados esos segundos. Se reproduce una sola vez, como un pulso. |

Los destellos y los temblores de tipo punch siempre se reproducen una vez, elijas lo que elijas. Cada
efecto tiene además tiempos de **Fade in** y **Fade out**, dentro de **Advanced**.

### Quitar efectos

**Clear effects** quita todos los efectos de pantalla del escenario, o solo los del tipo que elijas (por
ejemplo, solo el temblor). Úsalo para terminar un efecto que pusiste **hasta que se quite**: el recuerdo
acaba y vuelve el color.

## Presets

Un preset es una transición o un efecto ya hecho y con nombre. Elige uno en un bloque y listo; o cambia
cualquiera de sus campos solo en ese bloque, con el pequeño interruptor que hay junto al campo.

![Un bloque Screen effect con el preset flashback y la intensidad de la capa de viñeta sobrescrita](/docs-images/beasty-visual-novel/vn-effect-block-editor.png)

| Transiciones de serie | Efectos de serie |
|---|---|
| `dissolve`, `fade`, `fadewhite`, `blackout` | `flash`, `vpunch`, `hpunch`, `shake` |
| `wipeleft`, `wiperight`, `wipeup`, `wipedown` | `flashback` — sepia, viñeta y un desenfoque suave |
| `slideleft`, `slideright`, `slideup`, `slidedown` | `dream` — desenfoque, un tinte lavanda y una viñeta blanca |
| `pushleft`, `pushright`, `pushup`, `pushdown` | `blackscreen` |
| `irisin`, `irisout`, `pixellate`, `zoomin`, `zoomout` | |

`flashback` y `dream` tienen varias capas. Un bloque que los usa enumera las capas y puede ajustar una de
ellas, por ejemplo solo la viñeta.

### Tus propios presets: la Effect Library

Tus presets viven en un asset **Effect Library**:

1. Créalo con **Create > Beasty VN > Config > Effect Library**.
2. Asígnalo en **VN Settings > Screen effects > Effect Library**.
3. Añádele transiciones y efectos, cada uno con su id.

Un preset con el mismo id que uno de serie sustituye al de serie. Los presets de transición y los de
efecto son listas separadas: una transición llamada `soft` y un efecto llamado `soft` nunca chocan.

**Renombrar un preset** actualiza todos los bloques que lo usan y reescribe los guiones `.vnbeasty`
vinculados. Si hay bloques que lo usan, el editor pregunta antes: *"The transition preset 'x' is used by
N block(s). Rename it to 'y' and update every block and linked script?"*. Un id no puede estar vacío ni
llevar espacios.

## Saltar, auto-avance y rebobinado

- **Avanzar** durante una transición la termina; no se salta la línea.
- **Skip** termina al instante las transiciones y los efectos de un solo golpe.
- El **auto-avance** empieza a contar cuando acaba la transición.
- **Retroceder** corta directamente a la escena anterior. Las transiciones y los efectos de un solo golpe
  nunca se repiten al rebobinar, y los efectos que duran se calculan para cada línea, así que una línea
  rebobinada se ve exactamente como se vio.

## Partidas guardadas y salir de la novela

Una partida guardada recuerda los efectos que duran, y al cargarla se reconstruyen. Al salir de la novela
hacia el mundo libre o un menú, los efectos se apagan y la cámara vuelve intacta. Reaparecen cuando sigue
la historia.

## Reducir destellos y movimiento

El jugador puede activar **Reducir destellos y movimiento** en la pantalla de Preferencias. Con la opción
activada:

- los destellos llegan como mucho al 30 % de opacidad y se desvanecen más despacio;
- los temblores se mueven una cuarta parte;
- los movimientos de cámara son instantáneos.

Las transiciones no cambian. El valor inicial para los jugadores nuevos sale de **VN Settings > Screen
effects > Reduce Flashes By Default**. Los prefabs de menú construidos antes de que existiera esta opción
muestran el interruptor cuando vuelves a ejecutar **Tools > Beasty VN > Setup > Build Default Menu
Prefabs**; hasta entonces la preferencia conserva su valor por defecto.

## Probar los efectos en la vista previa de diálogo

La [vista previa de diálogo](/es/docs/beasty-visual-novel/authoring/dialogue-preview/) muestra los efectos
que duran —sepia, tinte, viñeta, desenfoque, zoom de cámara— mientras avanzas por las líneas. Pulsa
**▶ Play effects** para reproducir la transición y los efectos de un solo golpe de la línea actual tal
como lo haría el juego, empezando desde la escena de la línea anterior.

## En el guion de texto

Cada bloque Effects tiene su forma de una línea en los [guiones `.vnbeasty`](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/):

```text
with dissolve
with fade 2s color ffffff hold 0.3s coverui
effect vpunch
effect filter sepia 0.8 until cleared
clear effects
```

## Qué comprueba el validador

**Tools > Beasty VN > Maintenance > Validate Selected Project** marca como error:

- un preset que no existe;
- una transición `mask` sin textura.

Y avisa de:

- dos transiciones antes de la misma línea;
- **Hasta la línea siguiente** en un nodo sin ninguna línea;
- una amplitud de temblor mayor que 2;
- un efecto o un fundido que tapa la caja de diálogo durante más de 3 segundos.

## Cómo se dibuja

Los efectos no necesitan preparación. El `BeastyManager` crea en tiempo de ejecución el compositor que
hace falta, y este solo trabaja mientras se reproduce una transición o un efecto de color; el resto del
tiempo la cámara del escenario dibuja directamente en pantalla. Funciona en el pipeline Built-in y en URP.
Los temblores y los movimientos de cámara mueven la cámara del escenario y la devuelven a su sitio.

Para añadir tu propio modo de transición o tipo de efecto desde código, consulta
[APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/#transiciones-y-efectos-propios).

## Ver también

- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/#effects) — la categoría
  Effects.
- [Sintaxis `.vnbeasty`](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/#transiciones-y-efectos) —
  todos los argumentos de `with`, `effect` y `clear effects`.
- [Vista previa de diálogo](/es/docs/beasty-visual-novel/authoring/dialogue-preview/) — **▶ Play effects**.
- [VN Settings](/es/docs/beasty-visual-novel/production/vn-settings/) — la sección Screen effects.
- [Guardar y cargar](/es/docs/beasty-visual-novel/production/saving-and-loading/) — qué conserva una
  partida.
