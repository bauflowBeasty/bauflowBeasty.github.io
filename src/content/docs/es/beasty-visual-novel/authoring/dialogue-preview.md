---
title: "Vista previa de diálogo"
description: "La Vista previa de diálogo te muestra cómo se ve un nodo —fondo, personajes, props, cuadro de diálogo— sin entrar al modo Play."
---

La Vista previa de diálogo te muestra cómo se ve un nodo: el fondo, los personajes, los props, el cuadro
de diálogo, sin entrar al modo Play. Es para la pregunta de diez segundos que te haces cien veces al día:
¿ella está del lado correcto de la pantalla?, ¿esa es la expresión correcta?, ¿la línea cabe en el cuadro?

Ábrela con `Tools > Beasty VN > Dialogue Preview`.

![La ventana Dialogue Preview mostrando un nodo con dos personajes en escena](/docs-images/beasty-visual-novel/vn-dialogue-preview.png)

## Cómo usarla

La barra de herramientas de arriba tiene tres cosas:

- El campo **Visual Novel**. Suelta ahí una `DialogueScene`.
- El desplegable de **nodo**. `(project entry point)` empieza al inicio del proyecto; debajo aparecen todos
  los nodos de diálogo del grafo raíz, por nombre.
- **Restart**, que vuelve a empezar la vista previa desde el principio.

La vista previa se renderiza en el centro. **Haz clic en cualquier parte de la imagen para avanzar**,
exactamente como un clic izquierdo avanza el juego real. Abajo, `Back` y `Forward` recorren el nodo paso a
paso, y una etiqueta de estado te dice dónde estás: el número de línea, `Awaiting choice`, o `End of story`.

Cuando la vista previa llega a un nodo de elección, las opciones aparecen como botones debajo de la imagen.
Haz clic en una y la vista previa la sigue.

## El botón de vista previa por bloque

No tienes que hacer clic desde el inicio de un nodo para llegar a la línea once.

![El botón de vista previa que lleva cada bloque en el inspector del nodo](/docs-images/beasty-visual-novel/vn-preview-block-button.png)

En la pestaña Story, cada bloque de la pila del nodo seleccionado tiene un pequeño botón de vista previa en
su fila (su tooltip dice "Preview up to this block"). Púlsalo y se abre la ventana de vista previa,
**adelantada hasta el momento exacto en que se ejecuta ese bloque**: el escenario montado tal como va a
estar, con esa línea en pantalla.

Esta es la forma rápida de trabajar. Escribe un bloque, pulsa su botón de vista previa, mira, corrige, pulsa
de nuevo.

A diferencia del desplegable de nodo, que lista nodos del grafo raíz, el botón por bloque funciona también
en nodos dentro de subgrafos.

## Ambientación heredada

Un nodo normalmente no fija cada canal por sí mismo: hereda el fondo de algún nodo anterior. La vista
previa reconstruye eso. Recorre hacia atrás la cadena de nodos que llevan hasta el tuyo y rellena cada
canal —fondo, personajes, props— desde el ancestro más cercano que lo fija.

Lo hace hasta donde puede: sigue una cadena de predecesores únicos y sin ambigüedad, y se detiene cuando
llega a una ramificación o una convergencia, porque en ese punto hay más de una respuesta y no va a
adivinar. Si el nodo que estás previsualizando se alcanza desde tres lugares distintos y hereda su fondo,
la vista previa puede mostrarlo sin fondo. Eso no es un error en tu escena. Fija el canal
explícitamente, o previsualiza desde un nodo más arriba en la cadena.

## Lo que no hace

La vista previa es una vista previa **de la presentación**. Ejecuta el motor de historia real, así que la
ramificación, las condiciones y el escenario son reales, pero estas cosas están desconectadas a propósito:

- **Sin audio.** La música, el ambiente, la voz y los efectos de sonido no se reproducen. La vista previa es
  silenciosa.
- **Sin video.** Un fondo de video no se renderiza.
- **Sin entrada de texto.** Los bloques `Ask` no abren su cuadro de texto.
- **Sin máquina de escribir.** Cada línea aparece completa de golpe, porque la animación no puede
  ejecutarse fuera del modo Play. Aquí no puedes evaluar la velocidad de tipeo.

Tampoco toca nada. Construye su propia escena desechable, nunca modifica la escena que tienes abierta, y no
guarda nada.

## Cuándo todavía necesitas pulsar Play

La vista previa es para el aspecto; lo demás se comprueba jugando. Pulsa Play cuando necesites revisar:

- Audio: pistas, crossfades, si la música se atenúa donde querías.
- Ritmo: la máquina de escribir, los bloques `Wait`, el avance automático, el salto.
- Entrada: los bloques `Ask`, teclas reasignadas, un mando.
- Cualquier cosa que salga de la novela: mundo libre, transiciones de sala, otra escena VN.
- Guardar, cargar y retroceder.
- El HUD y las pantallas superpuestas.

## Ver también

- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) — el lienzo junto al que vive el botón de vista previa.
- [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/) — lo que estás viendo en la vista previa.
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — los bloques cuyas filas llevan el botón de vista previa.
