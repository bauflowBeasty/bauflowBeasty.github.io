---
title: "Diálogo y el escenario"
description: "Las dos cosas que haces con más frecuencia: escribir una línea y ambientar la escena en la que ocurre. Ambas viven como bloques dentro de un Dialogue Node."
---

Esta página trata sobre las dos cosas que haces con más frecuencia: escribir una línea y ambientar la
escena en la que ocurre. Ambas viven dentro de un Dialogue Node, como bloques. Si no has leído
[Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/), la versión corta es: los bloques se ejecutan de arriba abajo, y solo un
bloque Dialogue se detiene a esperar al jugador.

El patrón de casi todas las escenas es el mismo. Monta el escenario, luego habla.

```text
Backdrop         bedroom
Show character   Maya, expression "happy", position Left
Dialogue         Maya: "You are finally awake."
Dialogue         (no speaker): "The light through the curtain was already yellow."
```

El fondo y el personaje aparecen en el mismo instante que la primera línea. El jugador ve una escena ya
montada, no el paso a paso de cómo se construye.

## El bloque Dialogue

![Un bloque Dialogue: hablante, texto, estilo de entrega y alias](/docs-images/beasty-visual-novel/vn-block-dialogue.png)

### El speaker

Elige el personaje en el desplegable. Su placa de nombre, el color de su nombre, su retrato y su fuente
provienen todos de la definición del personaje: no los repites en cada línea.

**Deja el speaker vacío y la línea es narración.** Sin nombre, sin retrato, solo texto. Ese es todo el
mecanismo; no hay un personaje narrador aparte que crear.

### El texto

Escribe la línea. El editor la almacena bajo una clave de localización y gestiona esa clave por ti; nunca ves
una clave a menos que la busques. Traducir la línea más tarde es una tarea aparte, que se hace en la pestaña
Localization: consulta [Localización](/es/docs/beasty-visual-novel/production/localization/).

El texto puede contener términos `[token]` que se resuelven a una variable o a una entrada de diccionario en
tiempo de ejecución, así que una línea puede decir el nombre del jugador o la ciudad que eligió. Consulta
[El diccionario](/es/docs/beasty-visual-novel/world/dictionary/).

### El estado de interpretación (delivery)

El campo **Delivery** dice *cómo* se entrega la línea: `Normal`, `Whisper`, `Shout`, `Thinking`, o cualquier
estado que inventes. Vacío significa Normal.

Un estado de interpretación no es decoración en el bloque. Es una búsqueda en los **delivery styles** del
personaje que habla, y un estilo puede cambiar:

| El estilo puede fijar | Efecto en la línea |
|---|---|
| Font | Una fuente TMP distinta para este estado. |
| Text colour | Reemplaza el color de texto normal del personaje. |
| Font size multiplier | Por ejemplo 1.3 para hacer un Shout físicamente más grande. |
| Name prefix / suffix | Decora la placa de nombre, por ejemplo "Maya (thinking)". |
| Text effect | `None`, `Wave`, `Shake`, `Fade` o `Pulse`, animado sobre el texto en tiempo de ejecución. |

Así que `Shout` en Maya puede significar una línea más grande, roja y temblorosa, y `Whisper` una pequeña,
gris y que respira —y consigues ambas eligiendo una palabra en un desplegable, una vez definidos los
estilos en el personaje. Un personaje sin estilo para un estado recurre a sus valores por defecto.

Los delivery styles se definen por personaje. Consulta [Personajes](/es/docs/beasty-visual-novel/world/characters/).

### El display-name alias

El campo **Display name alias** muestra al speaker bajo un nombre distinto **solo para esta línea**.

El uso clásico: todavía no se la presentan al jugador, así que la mujer misteriosa habla como "The Stranger"
durante dos capítulos. Sigues definiéndola como Maya —el mismo personaje, las mismas variables, las mismas
expresiones— y cada línea simplemente lleva el alias. En el momento en que se presenta, dejas de fijar el
alias, y a partir de ahí es Maya.

El alias proviene de la lista de alias del personaje. No cambia nada más: ni su id, ni su nombre en ningún
otro sitio, ni el valor de `@char:maya:@name`.

> **Nota**
> El alias es por línea. Para cambiar el nombre de un personaje de forma permanente —porque el jugador lo
> renombró, o porque fue desenmascarado— usa el bloque **Character name**. Ese bloque escribe un cambio que
> queda guardado.

## El escenario

El escenario tiene tres canales independientes: el **fondo**, los **personajes** y los **props**. Cada uno
mantiene su valor actual hasta que un bloque del mismo canal lo cambia. Nunca repites el fondo.

![El escenario en el juego: fondo, dos personajes y la caja de diálogo](/docs-images/beasty-visual-novel/vn-stage-ingame.png)

### Backdrop

Un fondo es capas de sprites **o** un video. No puede ser las dos cosas.

![Un bloque Backdrop con su sprite y su transición](/docs-images/beasty-visual-novel/vn-block-backdrop.png)

**Layers** es el caso normal. Hasta cinco capas de sprites, cada una con:

- un **sprite**,
- un **orden** (0 se dibuja más al fondo),
- un **desplazamiento**,
- un factor de **parallax** (0 = estático, 1 = se mueve por completo con la cámara),
- una lista opcional de **sprites condicionales**.

Con los sprites condicionales, un solo fondo se convierte en cuatro. Le das a la capa una lista ordenada de
casos, cada uno con una condición; el primer caso cuya condición se cumpla gana, y si ninguno se cumple, se
usa el sprite por defecto de la capa. Una capa de dormitorio con casos para `time.daypart == Night` y
`time.daypart == Evening` es un dormitorio que se oscurece solo, sin ningún bloque adicional en ningún lugar
de la historia. Una condición vacía siempre se cumple, así que un caso sin condición actúa como comodín:
ponlo al final.

El modo **Video** reemplaza las capas por un clip de video:

| Opción | Qué hace |
|---|---|
| Clip | El video. |
| Loop | Repite cuando llega al final. |
| Mute | Silencia la pista de audio propia del clip. |
| Volume | De 0 a 1, cuando no está silenciado. |
| Play on enter | Activado por defecto: el video empieza en cuanto el fondo se activa. Desactívalo para iniciarlo tú mismo desde código. |

> **Advertencia**
> Un bloque **Backdrop vacío no hace nada**. No va a negro: se salta, y el fondo anterior se mantiene. Para
> eliminar el fondo, usa el bloque **Clear > Backdrop**.

### Show character

Pone a un personaje en el escenario, o lo reemplaza si ya está ahí.

![Un bloque Show character: personaje, expresión y posición](/docs-images/beasty-visual-novel/vn-block-show-character.png)

| Opción | Qué hace |
|---|---|
| Character | Quién entra. |
| Expression | Qué sprite de escenario usar. Por defecto, `base`. |
| Portrait | Opcional. Fija un retrato de UI distinto de la expresión en escena. Vacío = el retrato sigue a la expresión. |
| Position | `Left`, `CenterLeft`, `Center`, `CenterRight`, `Right`, o `Custom` (una X normalizada de 0 a 1). |
| Scale | Multiplicador de tamaño. Úsalo para dar sensación de distancia. |
| Flip | Refleja el sprite, así un mismo sprite puede mirar hacia ambos lados. |
| Layer | Slot de 0 a 4. El más alto se dibuja delante. Dos personajes en el mismo anclaje necesitan capas distintas, o se superponen. |

Quién está en escena es independiente de quién está hablando. Un personaje puede hablar sin estar en escena,
o quedarse en el escenario toda una escena sin decir una palabra.

### Expression

Cambia la expresión de un personaje que **ya** está en escena. Es más ligero que un segundo bloque Show
character, y es lo que usas entre líneas.

Tiene una opción extra que vale la pena conocer: **also set the portrait**. Actívala y el bloque también
fija el retrato del cuadro de diálogo, ya sea a una clave de retrato que nombres, o al retrato base del
personaje si la dejas vacía. Eso permite que el sprite de escenario y el pequeño icono de cabeza discrepen a
propósito, algo útil cuando el personaje está de espaldas, o cuando les oculta lo que siente a todos menos
al jugador.

### Hide character

Retira a un personaje del escenario. Los demás se quedan.

### Props

Los props son imágenes sueltas en primer o segundo plano superpuestas al fondo: una mesa, una hoja que cae,
un marco de ventana. Un bloque Props fija todo el conjunto de props a la vez, y cada prop tiene las mismas
opciones que una capa de fondo, sprites condicionales incluidos.

![Un bloque Props con un par de props colocados](/docs-images/beasty-visual-novel/vn-block-props.png)

### Los tres bloques Clear

| Bloque | Qué elimina |
|---|---|
| **Clear > Characters** | A todos los personajes, o solo al de una posición dada (anclaje más capa). |
| **Clear > Backdrop** | El fondo, capas de sprites o video. Así es como vas a negro. |
| **Clear > Props** | Todos los props. |

Son la única forma de dejar en blanco un canal. Dejar vacío un bloque Backdrop, Show character o Props no
limpia el canal: el bloque simplemente se salta.

## La cadena de reserva de expresión y retrato

No vas a dibujar cada expresión para cada personaje, y no hace falta. Cuando el motor necesita arte para un
personaje, recorre una cadena:

**la expresión que pediste -> el `base` del personaje -> el sprite de escenario del personaje**

La misma cadena se aplica a los retratos. Así que un personaje con solo un sprite `base` sigue funcionando
en todas partes: pides `angry`, obtienes `base`, y el juego funciona. Nada da error, nada se vuelve rosa,
nada desaparece. Dibuja el sprite `angry` más tarde y todas las líneas que ya lo pedían empiezan a mostrarlo.

La clave de expresión por defecto es `base`. Las expresiones y los retratos se configuran por personaje en
[Personajes](/es/docs/beasty-visual-novel/world/characters/).

## Ver también

- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — todos los bloques, incluidos estos.
- [Personajes](/es/docs/beasty-visual-novel/world/characters/) — expresiones, retratos, delivery styles, alias.
- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) — los nodos en los que viven estos bloques.
- [Vista previa de diálogo](/es/docs/beasty-visual-novel/authoring/dialogue-preview/) — ver el escenario sin pulsar Play.
