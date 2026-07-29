---
title: "El grafo de la historia"
description: "El lienzo donde construyes una escena: cómo crear, conectar y colorear nodos, y para qué sirve cada uno de los siete tipos de nodo."
---

El grafo de la historia es el lienzo donde construyes una escena. Sueltas nodos en él, los conectas entre sí
y el juego los reproduce en el orden que describen los cables. Esta página cubre el lienzo en sí y los siete
tipos de nodo que puedes poner en él.

Ábrelo con `Tools > Beasty VN > Editor` y elige la pestaña **Story**. Asigna una Visual Novel (una
`DialogueScene`) en la barra superior y aparecerá su grafo raíz.

![La pestaña Story: el panel Add blocks, el lienzo del grafo y el inspector de nodos](/docs-images/beasty-visual-novel/vn-story-tab.png)

## El lienzo

La pestaña Story tiene tres partes:

- El panel **Add blocks** a la izquierda. Rellena el nodo seleccionado con instrucciones. Consulta
  [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/).
- El **lienzo del grafo** en el centro. Los nodos y los cables entre ellos.
- El **inspector de nodos** a la derecha. Todo sobre el nodo que tienes seleccionado.

Desplázate con el botón central del mouse, haz zoom con la rueda, selecciona por rectángulo arrastrando.

### Crear un nodo

Haz clic derecho en una parte vacía del lienzo y elige en `Create`:

![El menú Create del clic derecho sobre el lienzo, con los tipos de nodo](/docs-images/beasty-visual-novel/vn-graph-create-menu.png)

- `Create > Dialogue Node`
- `Create > Choice Node`
- `Create > Decision Node`
- `Create > Flow (Mode Switch) Node`
- `Create > SubGraph Node`
- `Create > Return Node`
- `Create > Talk Menu Node`

El nodo aparece donde hiciste clic derecho. El primer nodo que crees en un grafo vacío se convierte
automáticamente en el nodo de entrada.

### Conectar nodos

Todo nodo tiene un puerto de entrada, `In`, en su lado izquierdo. Acepta cualquier cantidad de cables
entrantes: varios nodos pueden llevar al mismo lugar.

![Arrastrando un cable del puerto de salida de un nodo a la entrada de otro](/docs-images/beasty-visual-novel/vn-graph-wiring.png)

Los puertos de salida están a la derecha, y cuáles son depende del tipo de nodo (se describen más abajo).
Arrastra desde un puerto de salida hasta el puerto `In` de otro nodo para conectarlos. Arrastra un cable y
suéltalo en el lienzo vacío para desconectarlo, o selecciona el cable y pulsa Delete.

### El nodo de entrada

La reproducción empieza en el nodo de entrada del grafo. Su barra de título está resaltada con color para
que lo ubiques de un vistazo. Para mover el inicio de la escena, haz clic derecho en un nodo y elige
`Set as Entry Node`.

### El menú contextual del nodo

Haz clic derecho en un nodo:

![El menú contextual de un nodo: Rename, Set as Entry Node, Create Subgraph, Delete Node](/docs-images/beasty-visual-novel/vn-graph-node-menu.png)

| Elemento | Qué hace |
|---|---|
| `Rename` | Edita el nombre del nodo in situ. El nombre es para ti, no para el jugador. |
| `Set as Entry Node` | Hace que el grafo empiece en este nodo. |
| `Create Subgraph` / `Open Subgraph` | Anida un grafo dentro de este nodo, o entra en el que ya tiene. Consulta [Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/). |
| `Delete Node` | Elimina el nodo. Se borran los cables que apuntan a él. Se te pide confirmación. |

Seleccionar un nodo y pulsar Delete hace lo mismo, y funciona con una selección múltiple.

### Colores

Los nodos se colorean según su tipo. Un nodo de diálogo, un nodo de elección y un nodo de decisión tienen
colores distintos en el lienzo, así que puedes leer la forma de una escena sin abrir nada. El color es
cosmético y no tiene ningún efecto en el juego.

![Un grafo con un nodo de cada tipo, para distinguir los colores](/docs-images/beasty-visual-novel/vn-graph-colors.png)

## Dialogue Node

![El inspector de un nodo Dialogue, con su lista de bloques](/docs-images/beasty-visual-novel/vn-node-dialogue.png)

**Recurre a él cuando el jugador solo necesita que le cuenten algo.** Es el nodo que más usarás.

Un nodo de diálogo contiene una pila de bloques —líneas de diálogo, fondos, personajes, sonidos, cambios de
variables— que se ejecutan de arriba abajo. Cuando la pila termina, la historia continúa por el único puerto
de salida del nodo, `default →`.

Si no hay nada conectado a `default →`, la historia termina ahí.

Todo lo que un nodo de diálogo puede contener está en la [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/), y los
dos bloques que más usarás se explican en profundidad en [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/).

## Choice Node

![El inspector de un nodo Choice: sus opciones, con condiciones, efectos y destinos](/docs-images/beasty-visual-novel/vn-node-choice.png)

**Recurre a él cuando el jugador deba elegir.** Muestra un menú de opciones y espera.

Un nodo de elección no contiene diálogo propio. Tiene una lista de opciones; cada una tiene una etiqueta,
una condición que puede ocultarla, efectos que aplica al elegirla y un destino. Añade una con el botón
`+ choice` del nodo, y luego complétala a la derecha.

Puertos:

- Un puerto por opción. El puerto se etiqueta con el nombre de la opción, más una indicación cuando es
  condicional (`(if 2)` = dos cláusulas) o cuando lleva fuera de la novela.
- `default →`: a dónde va la historia cuando **no hay ninguna opción disponible**, porque todas quedaron
  bloqueadas por su condición. Conéctalo, o un nodo de elección totalmente bloqueado es un callejón sin
  salida.

Una opción también puede apuntar a una salida de flujo en lugar de a un nodo, en cuyo caso no tiene cable.
Consulta [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/).

## Decision Node

![El inspector de un nodo Decision, con sus ramas condicionales](/docs-images/beasty-visual-novel/vn-node-decision.png)

**Recurre a él cuando la historia debe ramificarse pero el jugador no debe saber que se está ramificando.**

Un nodo de decisión es un enrutador, no un menú. No muestra nada. El jugador nunca lo ve, nunca hace clic en
nada, y no puede notar que está ahí. Cuando la historia llega a él, recorre sus ramas de arriba abajo, toma
la primera cuya condición se cumpla, aplica los efectos de esa rama y salta.

Esta es la distinción que más se confunde. Si quieres que el jugador elija, usa un Choice Node. Si quieres
que el *estado del mundo* elija —el jugador ya tiene la llave, ya es viernes, el cariño ya está por encima de
40— usa un Decision Node.

Puertos:

- Un puerto por rama, en orden de evaluación. Una rama sin condición se etiqueta `(always)`, porque una
  condición vacía siempre se cumple; todo lo que esté debajo es inalcanzable.
- `fallback →`: se toma cuando ninguna rama coincide. Conéctalo siempre.

Añade una rama con el botón `+ branch` del nodo.

## Flow (Mode Switch) Node

![El inspector de un nodo Flow (Mode Switch)](/docs-images/beasty-visual-novel/vn-node-flow.png)

**Recurre a él cuando abandonar la novela merece su propia caja en el grafo.**

Un nodo de flujo lleva exactamente una salida: entrar en mundo libre, volver a la sala de la que vino el
jugador, dejar que el jugador elija una sala, o saltar a otra Visual Novel. Cuando la historia llega a él,
entrega el control y la novela visual se detiene.

No tiene puerto de salida. No hay un "después" dentro de este grafo.

Las mismas cuatro salidas también existen como bloques que puedes poner al final de un nodo de diálogo.
Cuándo usar cada una se explica en [Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/).

## SubGraph Node

![Un nodo SubGraph con sus rutas de resultado](/docs-images/beasty-visual-novel/vn-node-subgraph.png)

**Recurre a él cuando un tramo de la historia es reutilizable, o suficientemente grande como para merecer su
propio lienzo.**

Un nodo de subgrafo llama a un grafo anidado. El grafo anidado se ejecuta hasta un Return Node, que devuelve
un *resultado* —una palabra corta que tú eliges, como `win` o `refused`— y el nodo de subgrafo lo enruta.

Puertos:

- Un puerto por cada ruta de resultado que hayas añadido. Nombra el resultado, conecta el puerto a donde
  ese resultado deba continuar.
- `fallback →`: se toma para cualquier resultado que no hayas enrutado, incluido uno vacío.

Añade una ruta con el botón `+ outcome` del nodo. Guía completa en [Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/).

## Return Node

**Recurre a él para terminar un subgrafo.**

Un nodo de retorno tiene una clave de resultado y una lista de efectos. Aplica los efectos y devuelve el
resultado al SubGraph Node que lo llamó.

No tiene puerto de salida. Es un terminador: el control vuelve a quien lo llamó, no a un nodo hermano.

Un nodo de retorno solo tiene sentido dentro de un subgrafo. Consulta [Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/).

## Talk Menu Node

![Un nodo Talk Menu en el grafo](/docs-images/beasty-visual-novel/vn-node-talkmenu.png)

**Recurre a él cuando el jugador deba elegir qué decirle a un personaje concreto.**

Un nodo de menú de conversación nombra a un personaje y presenta el menú de conversación de ese personaje
—las entradas que definiste en `Characters > Talk Menu`, más los pasos de conversación de sus misiones
activas, que se insertan automáticamente. Es el centro de conversación al que accedes al hacer clic en un
personaje dentro de una sala, expuesto como nodo para que puedas llegar a él desde dentro de una escena.

Puertos:

- `when empty →`: a dónde va la historia cuando el menú se resuelve sin ninguna entrada visible. Sin este
  puerto, un personaje sin nada que decir es un callejón sin salida.

El menú en sí se define en el personaje, no aquí. Consulta [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/).

## Ver también

- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — todos los bloques que puede contener un nodo de diálogo.
- [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/) — escribir una línea, ambientar la escena.
- [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) — ramificación, condiciones y efectos.
- [Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/) — anidar un grafo y enrutar su resultado.
- [Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/) — abandonar la novela.
- [Conceptos básicos](/es/docs/beasty-visual-novel/getting-started/core-concepts/) — proyecto, contexto, grafo, nodo, bloque.
