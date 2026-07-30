---
title: "Referencia de bloques"
description: "Todos los bloques que puede contener un Dialogue Node, categoría a categoría: qué hace cada uno, sus opciones y los comportamientos que sorprenden."
---

Un bloque es una instrucción dentro de un Dialogue Node. Los bloques son todo el vocabulario de autoría de
la novela visual: una línea de diálogo, un fondo, un personaje que entra caminando, una variable que sube,
una puerta hacia el mundo. Esta página recorre todos los bloques que existen, en el orden en que los muestra
la paleta.

## El panel Add blocks

El panel a la izquierda de la pestaña **Story** es la paleta. Selecciona un Dialogue Node en el grafo y la
paleta se activa.

![La paleta Add blocks con todas las categorías desplegadas](/docs-images/beasty-visual-novel/vn-add-blocks-palette.png)

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

Además de Dialogue, otros cuatro bloques también se detienen:

- Los tres bloques de **Input** (`Ask → variable`, `Ask → dictionary`, `Ask → character name`) muestran su
  pregunta y abren el cuadro de texto a la vez, y esperan a que el jugador escriba.
- Un bloque **Wait** puesto a **0 segundos** espera a que el jugador haga clic. Se explica más abajo.

### Dos comportamientos que sorprenden

> **Advertencia**
> **Un bloque Wait con 0 segundos no espera cero segundos: espera al jugador.** Se pausa hasta que el
> jugador avanza, exactamente como una línea de diálogo sin texto. Auto también se detiene ahí: la pausa
> solo termina con un avance manual. Eso suele ser lo que quieres (una pausa antes de que se abra la
> puerta). Si querías una pausa corta, escribe un número.

> **Advertencia**
> **Un bloque sin ningún asset asignado no hace absolutamente nada.** Un bloque Backdrop vacío se salta y lo
> que había en pantalla se queda en pantalla. Un bloque Music sin clip se salta y lo que estaba sonando
> sigue sonando. El bloque no borra nada: simplemente no se ejecuta. Para dejar el fondo en negro a
> propósito usa el bloque **Clear > Backdrop**; para silenciar un canal a propósito usa **Stop channel**.

### Los bloques de Scene son declarativos

Los bloques de Scene (Backdrop, Show character, Expression, Hide character, Props, y los tres bloques de
Clear) describen *el estado del escenario*, no una acción. No repites el fondo en cada línea; lo fijas una
vez y se mantiene hasta que algo más lo cambia. Esto es lo que hace seguro el rebobinado del jugador: el
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
| Delivery | El estado de interpretación: Normal, Whisper, Shout, Thinking, o uno que hayas definido. Determina la fuente, el color y el efecto de texto de ese personaje. |
| Text | La línea. Se guarda automáticamente bajo una clave de localización. |
| Display name alias | Muestra esta línea concreta bajo un alias, por ejemplo "The Stranger", sin cambiar el nombre del personaje. |

Se explica en profundidad en [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/).

---

## Scene

Todo en esta categoría se explica en profundidad en [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/).

### Backdrop

Fija el fondo. Un fondo es capas de sprites **o** un clip de video, nunca ambas cosas.

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
Backdrop vacío no sirve para eso.

### Props

Elimina todos los props.

---

## State

Estos bloques escriben en el almacén de variables, el mismo que leen las condiciones y el que se conserva en
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
| Reset to base | Elimina el cambio; el personaje vuelve a su propio nombre. |

El cambio queda guardado, así que sobrevive al guardado y al rebobinado. Para mostrar un alias en **una sola
línea** sin cambiar nada, usa el display-name alias del bloque Dialogue.

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
| Set objective | Marca un objetivo como hecho, o lo desmarca. |

### Deliver items

Entrega los ítems de un objetivo de recolectar-y-entregar: comprueba el inventario, consume los ítems y
marca el objetivo como hecho.

> **Nota**
> Si el jugador no tiene los ítems, este bloque **no hace nada y no dice nada**. Es un no-op silencioso.
> Protege con una condición de inventario la rama que llega hasta él, o el jugador entregará tres pociones
> que nunca tuvo y nadie se dará cuenta.

---

## World

### Wait

Pausa la historia durante un número de segundos antes de que corra el siguiente bloque. Los clics durante la
pausa se tragan, **Skip** la acelera, retroceder la cancela, y una revisita tras un rebobinado no vuelve a
esperar — como un efecto secundario, la pausa corre una sola vez. **Con 0 segundos, espera al clic del
jugador** (consulta la advertencia de arriba).

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
| Pause background | Activado por defecto. Pausa la cola persistente de música de fondo mientras suena esta pista, y deja que se reanude cuando la historia llega a un nodo sin ninguna pista que la pause. |

### Ambient

Hace un crossfade del sonido ambiente en el canal Ambient. Clip, loop, volumen y fade.

### Voice

Reproduce un clip de voz en el canal Voice. Clip y volumen. Al empezar una nueva línea de voz, la anterior
se detiene.

### Sound effect

Reproduce un sonido único (one-shot) en el canal SFX. Clip y volumen.

### Stop channel

Detiene un canal —`Music`, `Ambient`, `Sfx` o `Voice`— con un fade. Esta es la forma de silenciar algo a
propósito; un bloque Music vacío no lo hace.

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

Escribe la respuesta en una de tus variables. El campo de entrada sigue el tipo de la variable: un Bool
recibe un desplegable true/false, un número un campo numérico, un String texto libre. Si una variable con
tipo aparece como texto libre en una build, la pregunta no pudo resolver la definición de la variable — la
consola lo dice, y el sitio donde mirar es el campo `Game Context` de los
[ajustes de la VN](/es/docs/beasty-visual-novel/production/vn-settings/).

### Ask → dictionary

Escribe la respuesta en un token de diccionario.

### Ask → character name

Fija el nombre mostrado de un personaje según lo que escribió el jugador. Así es como el jugador nombra al
protagonista.

---

## Flow

Un bloque de flujo entrega el control **fuera** de la novela visual. Ponlo al final de un nodo de diálogo y
se ejecuta cuando el jugador avanza más allá de la última línea. El almacén de variables sobrevive al salto:
no se pierde nada.

Las mismas cuatro salidas también existen como un Flow (Mode Switch) Node dedicado. En
[Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/) se explica cuál usar. Las salas se
explican en [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/).

### Go to FreeRoam

Sale de la novela y entra en una sala. Elige el mapa y, opcionalmente, la sala; déjala vacía para llegar a
la sala de entrada del mapa.

### Return to room

Vuelve a la sala de mundo libre en la que estaba el jugador justo antes de que empezara esta novela.
No eliges nada: "de dónde viniste" está implícito. Si el jugador no venía de mundo libre, llega a la sala
de entrada.

### Choose room

Sale de la novela y deja que el **jugador** elija a qué sala ir. Puedes restringir la lista a una lista
blanca de salas; déjala vacía y se ofrecen todas las salas del mapa.

### Go to VN scene

Salta a otra Visual Novel —de la Intro al Capítulo 1, por ejemplo— sin pasar por mundo libre. Puede empezar en un nodo
concreto dentro de ella, en lugar de en su nodo de entrada. Esto cambia todo el asset de historia, a
diferencia de un subgrafo, que se queda dentro del actual.

## Ver también

- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) — el lienzo y los siete tipos de nodo.
- [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/) — los bloques Dialogue y Scene en profundidad.
- [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) — ramificación.
- [Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/) — bloques de flujo frente a nodos de flujo.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — el almacén en el que todo escribe.
