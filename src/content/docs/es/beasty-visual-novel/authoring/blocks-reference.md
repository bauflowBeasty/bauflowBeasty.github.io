---
title: "Referencia de bloques"
description: "Un bloque es una instrucción dentro de un Nodo de Diálogo. Los bloques son todo el vocabulario de autoría de la novela visual: una línea de diálogo, un fondo, un personaje"
---

Un bloque es una instrucción dentro de un Dialogue Node. Los bloques son todo el vocabulario de autoría de
la novela visual: una línea de diálogo, un fondo, un personaje que entra caminando, una variable que sube,
una puerta hacia el mundo. Esta página enumera todos los bloques que existen, en el orden en que la paleta
los muestra.

## El panel Add blocks

El panel a la izquierda de la pestaña **Story** es la paleta. Selecciona un Dialogue Node en el grafo y la
paleta se activa.

- **Haz clic** en un botón de bloque para añadirlo al final de la pila del nodo seleccionado.
- **Arrastra** un botón de bloque hasta la lista de bloques para insertarlo en una posición concreta.
- Escribe en el campo de búsqueda de arriba para filtrar todo el catálogo por nombre.
- El panel es **redimensionable** —arrastra su borde— y los botones se reorganizan en tantas filas como
  permita el ancho. También es **plegable**, así que puedes ocultarlo cuando solo estés conectando el grafo.

Los bloques se agrupan en diez categorías: Dialogue, Scene, Clear, State, Quests, World, Items, Audio, Input
y Flow. Aparecen en ese orden.

## Cómo se ejecutan los bloques

**Los bloques se ejecutan de arriba abajo.** El nodo empieza en el primer bloque y avanza hacia abajo.

**Solo algunos bloques se detienen.** Un bloque de **Dialogue** muestra su línea y espera a que el jugador
avance. Cualquier otro bloque hace su trabajo y pasa de inmediato al siguiente: el fondo, los dos
personajes, la música y el cambio de variable que hay encima de una línea ocurren todos antes de que esa
línea aparezca, en un solo fotograma, de forma invisible. Por eso una escena se escribe así: primero se
monta el escenario, luego se dice algo.

Además de Dialogue, otros tres bloques también se detienen:

- Los tres bloques de **Input** (`Ask → variable`, `Ask → dictionary`, `Ask → character name`) muestran su
  pregunta y abren el cuadro de texto a la vez, y esperan a que el jugador escriba.
- Un bloque **Wait** puesto a **0 segundos** espera a que el jugador haga clic. Ver más abajo.

### Dos comportamientos que sorprenden

> **Advertencia**
> **Un bloque Wait con 0 segundos no espera cero segundos: espera al jugador.** Se pausa hasta que el
> jugador avanza, exactamente como una línea de diálogo sin texto. Eso suele ser lo que quieres (una pausa
> antes de que se abra la puerta). Si querías una pausa corta, escribe un número.

> **Advertencia**
> **Un bloque sin ningún asset asignado no hace absolutamente nada.** Un bloque Backdrop vacío se salta y lo
> que había en pantalla se queda en pantalla. Un bloque Music sin clip se salta y lo que estaba sonando
> sigue sonando. El bloque no borra nada: simplemente no se ejecuta. Para dejar el fondo en negro a
> propósito usa el bloque **Clear > Backdrop**; para silenciar un canal a propósito usa **Stop channel**.

### Los bloques de Scene son declarativos

Los bloques de Scene (Backdrop, Show character, Expression, Hide character, Props, y los tres bloques de
Clear) describen *el estado del escenario*, no una acción. No repites el fondo en cada línea; lo fijas una
vez y se mantiene hasta que algo más lo cambia. Esto es lo que hace segura la retrocesión del jugador: el
motor reconstruye el escenario para la línea en la que aterriza, en lugar de intentar deshacer una secuencia
de acciones.

---

## Dialogue

### Dialogue

Una línea hablada o narrada. Es el único bloque en el que escribes texto libre, y el bloque que se detiene y
espera al jugador.

| Opción | Qué hace |
|---|---|
| Speaker | El personaje que la dice. **Déjalo vacío para el narrador**: sin placa de nombre, sin retrato. |
| Delivery | El estado de interpretación: Normal, Whisper, Shout, Thinking, o uno que hayas definido. Selecciona la fuente, el color y el efecto de texto de ese personaje. |
| Text | La línea. Se almacena bajo una clave de localización por ti. |
| Display name alias | Muestra esta línea concreta bajo un alias, por ejemplo "The Stranger", sin cambiar el nombre del personaje. |

Se explica en profundidad en [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/).

---

## Scene

Todo en esta categoría se explica en profundidad en [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/).

### Backdrop

Fija el fondo. Un fondo es **o bien** capas de sprites **o bien** un clip de video, nunca ambos.

- Modo **Layers**: hasta cinco capas de sprites. Cada capa tiene un sprite, un orden de dibujado (0 es la
  más al fondo), un desplazamiento, un factor de parallax y una lista opcional de sprites condicionales (el
  primer caso cuya condición se cumpla gana: un dormitorio que está oscuro de noche).
- Modo **Video**: un clip de video, con `loop`, `mute`, `volume` y si se reproduce automáticamente cuando
  aparece el fondo.

### Show character

Pone a un personaje en el escenario.

| Opción | Qué hace |
|---|---|
| Character | Quién. |
| Expression | Qué sprite de escenario. Por defecto, `base`. |
| Portrait | Opcional: un retrato de UI distinto de la expresión en escena. Vacío = usa la expresión. |
| Position | `Left`, `CenterLeft`, `Center`, `CenterRight`, `Right`, o `Custom` con una X normalizada. |
| Scale | Multiplicador de tamaño. |
| Flip | Refleja el sprite horizontalmente. |
| Layer | Slot de 0 a 4. Decide quién se dibuja delante de quién. |

### Expression

Cambia la expresión de un personaje que ya está en escena. **También** puede fijar el retrato del cuadro de
diálogo a la vez, de modo que un personaje puede verse triste en el escenario mientras el retrato muestra
otra cosa.

### Hide character

Retira a un personaje del escenario.

### Props

Fija los props sueltos del primer plano. Misma estructura que las capas de fondo, incluidos los sprites
condicionales.

---

## Clear

### Characters

Limpia el escenario de personajes: **todos**, o solo una **posición** (un anclaje y una capa concretos).

### Backdrop

Elimina el fondo por completo, capas de sprites o video. Es el bloque que usas para ir a negro: un bloque
Backdrop vacío no lo hará.

### Props

Elimina todos los props.

---

## State

Estos bloques escriben en el almacén de variables, el mismo almacén que leen las condiciones y que persisten
las partidas guardadas. Consulta
[Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/).

### Set variable

Cambia una de tus variables. Elige la variable, la operación y el valor.

Operaciones: `Assign`, `Add`, `Subtract`, `Toggle`. `Toggle` invierte un Bool e ignora el valor.

### Set dictionary

Fija un token de diccionario: uno de los tokens de texto editables por el jugador que aparecen dentro de las
líneas. Consulta [El diccionario](/es/docs/beasty-visual-novel/world/dictionary/).

### Character variable

Fija un campo de un personaje (cariño, confianza, una bandera). Las mismas cuatro operaciones que Set
variable. El selector de campos se limita a los campos propios de ese personaje más los universales del
esquema. Consulta [Personajes](/es/docs/beasty-visual-novel/world/characters/).

### Character name

Cambia el nombre **mostrado** de un personaje durante el resto del juego. Su id nunca cambia.

| Fuente | Qué hace |
|---|---|
| Alias | Uno de los alias que definiste en el personaje. |
| Text | Un nombre que escribes. Puede ser texto plano, o una clave de localización. |
| Variable | El valor actual de una variable o token de diccionario, por ejemplo un nombre que el jugador escribió antes. |
| Reset to base | Elimina la anulación; el personaje vuelve a su propio nombre. |

La anulación se persiste, así que sobrevive a una partida guardada y a una retrocesión. Para mostrar un
alias en **una sola línea** sin cambiar nada, usa en su lugar el display-name alias del bloque Dialogue.

---

## Quests

Consulta [Misiones](/es/docs/beasty-visual-novel/world/quests/).

### Update quest

Actualiza una misión. Cuatro acciones:

| Acción | Qué hace |
|---|---|
| Set state | Escribe el estado de la misión: `notstarted`, `active`, `completed` o `failed`. |
| Set stage | Fija el índice de etapa de una misión ordenada. |
| Advance stage | Suma al índice de etapa de una misión ordenada. |
| Set objective | Marca un objetivo como hecho, o lo despeja. |

### Deliver items

Entrega los ítems de un objetivo de recolectar-y-entregar: comprueba el inventario, consume los ítems y
marca el objetivo como hecho.

> **Nota**
> Si el jugador no tiene los ítems, este bloque **no hace nada y no dice nada**. Es un no-op silencioso.
> Bloquea con una condición de inventario la rama que llega a él, o el jugador entrega tres pociones que
> nunca tuvo y nadie se da cuenta.

---

## World

### Wait

Se pausa durante un número de segundos. **0 segundos espera al clic del jugador en su lugar** (ver la
advertencia de arriba).

### Advance time

Mueve el reloj del juego. Operaciones: `AdvanceDayparts`, `AdvanceHours`, `AdvanceDays`, `SetDaypart`,
`SetHour`, `SetWeekday`. Las operaciones de hora solo se aplican en modo Clock.

El tiempo nunca avanza por sí solo: este bloque es una de las pocas cosas que lo mueve. Consulta
[Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/).

### Open screen

Abre una pantalla secundaria (el inventario, la lista de personajes, una superposición propia) por su id, a
través de la misma pila de pantallas que usa un botón del HUD. Consulta
[Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/).

### Routine override

Cambia el perfil de rutina de un personaje, de modo que a partir de ahora sigue un horario distinto. Deja el
nombre del perfil vacío para devolverlo a su perfil por defecto. Consulta
[Rutinas de personaje](/es/docs/beasty-visual-novel/world/character-routines/).

---

## Items

Los cuatro son el mismo bloque con una operación distinta. Consulta
[Ítems e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/).

### Give

Añade una cantidad de un ítem. Se limita al máximo del ítem.

### Take

Quita una cantidad. Se limita a 0: quitar 5 de un ítem del que el jugador tiene 2 lo deja con 0, no se vuelve
negativo y no falla.

### Set quantity

Fija la cantidad exacta que el jugador posee.

### Use

Ejecuta la lógica de uso del ítem: su condición, sus efectos y su consumo. El campo de cantidad se ignora.

---

## Audio

Consulta [Audio y música](/es/docs/beasty-visual-novel/production/audio-and-music/).

### Music

Hace un crossfade de un clip en el canal Music.

| Opción | Qué hace |
|---|---|
| Clip | La música. **Sin clip = el bloque se salta**; no detiene la música. |
| Loop | Repite cuando termina. |
| Volume | De 0 a 1. |
| Fade | Duración del crossfade en segundos. |
| Pause background | Activado por defecto. Pausa la cola persistente de música de fondo mientras suena esta pista, y deja que se reanude cuando la historia llega a un nodo sin ninguna pista que pause. |

### Ambient

Hace un crossfade del sonido ambiente en el canal Ambient. Clip, loop, volumen y fade.

### Voice

Reproduce un clip de voz en el canal Voice. Clip y volumen. Empezar una nueva línea de voz detiene la
anterior.

### Sound effect

Reproduce un disparo único en el canal SFX. Clip y volumen.

### Stop channel

Detiene un canal —`Music`, `Ambient`, `Sfx` o `Voice`— con un fade. Así es como silencias algo
deliberadamente. Un bloque Music vacío no lo hará.

---

## Input

Los tres bloques de Input son prompts autocontenidos: llevan su propia línea de pregunta (con speaker,
delivery y alias opcionales, exactamente como un bloque Dialogue), y cuando la historia llega a ellos, la
pregunta y el cuadro de texto aparecen juntos. El jugador escribe, y la respuesta se guarda en algún sitio.

Los tres comparten estas opciones:

| Opción | Qué hace |
|---|---|
| Default | El valor usado cuando el jugador deja el campo en blanco. |
| Required | Cuando está activado, una respuesta en blanco se rechaza y el jugador debe escribir algo. |

### Ask → variable

Escribe la respuesta en una de tus variables.

### Ask → dictionary

Escribe la respuesta en un token de diccionario.

### Ask → character name

Fija el nombre mostrado de un personaje según lo que escribió el jugador. Así es como el jugador nombra al
protagonista.

---

## Flow

Un bloque de flujo entrega el control **fuera** de la visual novel. Ponlo al final de un nodo de diálogo y
se ejecuta cuando el jugador avanza más allá de la última línea. El almacén de variables sobrevive al salto:
no se pierde nada.

Las mismas cuatro salidas también existen como un Flow (Mode Switch) Node dedicado. Cuál usar se explica en
[Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/). Las habitaciones se explican en [Habitaciones de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/).

### Go to FreeRoam

Abandona la novela y entra en una habitación. Elige el mapa, y opcionalmente la habitación; deja la
habitación vacía para llegar a la habitación de entrada del mapa.

### Return to room

Vuelve a la habitación de mundo libre en la que estaba el jugador justo antes de que empezara esta novela.
No eliges nada: "de dónde viniste" es implícito. Si el jugador no venía de mundo libre, llega en su lugar a
la habitación de entrada.

### Choose room

Abandona la novela y deja que el **jugador** elija a qué habitación ir. Opcionalmente restringe la lista a
una lista blanca de habitaciones; déjala vacía y se ofrece cada habitación del mapa.

### Go to VN scene

Salta a otra Visual Novel —de la Intro al Capítulo 1— sin pasar por mundo libre. Opcionalmente empieza en un
nodo concreto dentro de ella en lugar de en su nodo de entrada. Esto cambia todo el asset de historia, a
diferencia de un subgrafo, que se queda dentro del actual.

## Ver también

- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) — el lienzo y los siete tipos de nodo.
- [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/) — los bloques Dialogue y Scene en profundidad.
- [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) — ramificación.
- [Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/) — bloques de flujo frente a nodos de flujo.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — el almacén en el que todo escribe.
