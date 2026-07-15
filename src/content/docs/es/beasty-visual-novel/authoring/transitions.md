---
title: "Transiciones: abandonar la novela"
description: "Una novela visual en Beasty no es todo el juego: es uno de sus modos. Una transición es el momento en que la historia entrega el control a otro modo."
---

Una novela visual en Beasty no es todo el juego. Es uno de los modos en los que puede estar el juego: los
otros son el mundo libre, donde el jugador camina por salas y hace clic en cosas, y lo que tú mismo
construyas. Una **transición** es el momento en que la historia entrega el control.

Hay cuatro transiciones. Existen de dos formas: como **bloques** que pones dentro de un nodo de diálogo, y
como un **Flow (Mode Switch) Node** dedicado. Hacen exactamente lo mismo. Cuál usar es una cuestión de cómo
se lee el grafo.

## Las cuatro salidas

### Go to FreeRoam

Abandona la novela y pone al jugador en una sala.

- **Map**: el mapa de mundo libre al que entrar.
- **Room**: dónde llegar. Déjalo vacío y el jugador llega a la sala de entrada del mapa.

Úsalo para el final de un capítulo que abre el mundo: la intro termina, y ahora puedes caminar.

### Return to room

Vuelve a la sala de mundo libre en la que estaba el jugador **justo antes de que empezara esta novela**.

No eliges nada. "De dónde viniste" está implícito, y esa es justamente la idea: el mismo nodo de
conversación puede alcanzarse desde la cocina, el jardín y la tienda, y esta salida devuelve al jugador a
donde estaba cada vez. Si el jugador no venía de mundo libre, llega a la sala de entrada del mapa.

Esta es la salida con la que termina casi cualquier conversación normal.

### Choose room

Abandona la novela y deja que el **jugador** elija a qué sala ir. Se abre un selector de salas; al elegir
una, llega ahí.

- **Map**: el mapa cuyas salas se ofrecen.
- **Allowed rooms**: una lista blanca opcional. Déjala vacía y se ofrecen todas las salas del mapa.

Úsalo para un momento de viaje rápido: "¿A dónde quieres ir esta noche?"

### Go to VN scene

Salta directamente a **otra Visual Novel** —de la Intro al Capítulo 1— sin pasar por mundo libre.

- **Project**: la Visual Novel a la que cambiar.
- **Start node**: opcional. Déjalo vacío para empezar en el nodo de entrada de ese proyecto.

Esto cambia todo el asset de historia. No es un subgrafo: un subgrafo se queda dentro del proyecto actual y
vuelve con un resultado ([Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/)); este no vuelve.

## El almacén de variables sobrevive al salto

Las cuatro salidas conservan el almacén de variables compartido. Todo lo que hay en él —tus variables, las
variables de personaje, el tiempo de juego, las misiones, el inventario, el diccionario— está exactamente
igual al otro lado.

Eso es lo que hace que funcionen los juegos de varias escenas. Una bandera que fijaste en la intro se puede
leer en el Capítulo 4. El oro gastado en una conversación sigue gastado cuando el jugador llega a la tienda,
tres salas y dos días después. No llevas nada de un lado a otro a mano, y no hay nada que conectar.

## ¿Bloque de salida o nodo Flow?

### Un bloque de salida al final

Añade la salida como el último bloque de un nodo de diálogo. Se ejecuta **cuando el jugador avanza más allá
de la última línea**, no mientras la línea está en pantalla. El jugador lee la despedida, hace clic, y la
sala aparece con un fundido.

Úsalo cuando la salida es el final natural de lo que el nodo ya está haciendo:

```text
Dialogue         Maya: "I will see you tomorrow."
Dialogue         Maya: "Do not be late."
Return to room
```

Eso es una sola caja en el grafo, y dice lo que es: una despedida corta que te devuelve a donde estabas. Un
nodo aparte para la salida añadiría un cable y una caja y no le diría nada nuevo a quien lo lea.

> **Nota**
> La salida se ejecuta después de los demás bloques del nodo, al avanzar más allá del final. No se dispara
> en el instante en que aparece la última línea, que es lo que permite al jugador leerla.

### Un nodo Flow dedicado

Crea un **Flow (Mode Switch) Node** y dale una salida. No tiene puerto de salida: no hay un "después" dentro
de este grafo.

Úsalo cuando la transición es un **hecho estructural de la historia**, y quieres que sea visible como su
propia caja:

- Un límite de capítulo. Todo el Capítulo 1 converge en un único nodo `Go to VN scene`. Cuando reordenas los
  capítulos, reconectas una sola caja.
- Un cruce. Cinco finales distintos de una escena llevan todos al mismo nodo de "volver al mundo". Un solo
  nodo, cinco cables entrantes, en lugar del mismo bloque de salida copiado y pegado cinco veces.
- Cualquier cosa que quieras poder señalar en una revisión y decir "ahí es donde el juego deja de ser una
  novela".

La regla general: **si la salida pertenece a una línea concreta, que sea un bloque. Si pertenece a la forma
de la historia, que sea un nodo.**

## Salidas como destino de una elección o una decisión

Tanto una opción de elección como una rama de decisión pueden apuntar a una salida de flujo en lugar de a un
nodo. Apunta el destino de la opción a una salida de flujo y, al elegirla, el control sale de la novela en
lugar de saltar a otro nodo.

Los destinos ofrecidos son:

- `Node (in this project)`
- `Go to FreeRoam`
- `Return to previous room`
- `Choose room`
- `Go to another VN`

Una opción o rama con un destino de flujo **no tiene cable** en el grafo: no hay nada en este grafo a lo que
apuntar. En su lugar, la etiqueta del puerto muestra a dónde va, así que el nodo te sigue diciendo qué pasa.

Así se escribe el menú que mezcla quedarse e irse:

```text
"Ask her about the letter"   ->  a node in this scene
"Ask her about her sister"   ->  a node in this scene
"Leave"                      ->  Return to previous room
```

El jugador ve tres opciones. Dos continúan la conversación; una la termina y lo devuelve a la cocina.

## Ver también

- [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/) — los mapas y salas a los que llevan estas salidas.
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — la categoría Flow.
- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) — el Flow (Mode Switch) Node.
- [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) — opciones y ramas.
- [Conceptos básicos](/es/docs/beasty-visual-novel/getting-started/core-concepts/) — los modos de la app y el almacén de variables compartido.
