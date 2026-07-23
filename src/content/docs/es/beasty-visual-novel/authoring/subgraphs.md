---
title: "Subgrafos"
description: "Un subgrafo es un grafo dentro de un nodo: pliega un tramo de historia en una sola caja del lienzo padre y te deja llamarlo desde más de un lugar."
---

Un subgrafo es un grafo dentro de un nodo. Lo usas para plegar un tramo de historia en una sola caja del
lienzo padre, y para llamar a ese tramo desde más de un lugar.

## Por qué

Hay tres casos que se repiten una y otra vez:

- **Un encuentro reutilizable.** La emboscada de bandidos ocurre en tres caminos distintos. Escríbela una
  vez. Cada uno de los tres caminos tiene un SubGraph Node que la llama, y cada uno enruta el resultado a su
  manera.
- **Un capítulo.** El Capítulo 2 tiene cuarenta nodos. No pertenece al mismo lienzo que los capítulos 1 y 3.
  Conviértelo en un subgrafo y el grafo de nivel superior se vuelve legible: cinco cajas y los cables entre
  ellas.
- **Una escena autocontenida con un resultado.** Un combate, una negociación, un examen. La escena decide
  algo —ganado, perdido, huido— y a la historia de afuera le interesa saber cuál, sin importarle cómo.

Lo que un subgrafo te da, y un simple grupo de nodos no, es el **resultado**: una sola palabra que se
devuelve a quien lo llama, para que este enrute según ella.

## Crear un subgrafo

Haz clic derecho en un nodo del grafo y elige **`Create Subgraph`**. El nodo ahora contiene un grafo anidado,
y el elemento del menú se convierte en **`Open Subgraph`**.

![Create Subgraph en el menú contextual del nodo](/docs-images/beasty-visual-novel/vn-subgraph-create.png)

Normalmente harás esto en un **SubGraph Node**, porque ese es el tipo de nodo que sabe enrutar un resultado.
(Cualquier nodo puede llevar un grafo anidado, pero solo un SubGraph Node lo llama y se ramifica según lo que
vuelva.)

## Entrar y salir

![La miga de pan del subgrafo y el botón Up](/docs-images/beasty-visual-novel/vn-subgraph-breadcrumb.png)

- **Abrir el subgrafo**: haz clic derecho en el nodo y elige `Open Subgraph`, o pulsa el botón
  `open subgraph` del propio nodo.
- **Saber dónde estás**: en la barra de herramientas de la pestaña Story aparece una miga de pan que muestra
  el camino por el que entraste.
- **Volver arriba**: el botón **`↥ Up`** junto a la miga de pan.

Dentro, es el mismo lienzo con los mismos siete tipos de nodo y las mismas reglas. Tiene su propio nodo de
entrada, y la reproducción del subgrafo empieza ahí.

## El nodo Return

Un subgrafo termina en un **Return Node**. Es un terminador: no tiene puerto de salida, porque el control
vuelve a quien lo llamó.

![Un nodo Return con su resultado y sus efectos](/docs-images/beasty-visual-novel/vn-return-node.png)

Tiene dos campos:

| Campo | Qué hace |
|---|---|
| **Outcome key** | La palabra devuelta a quien lo llama: `win`, `refused`, `fled`. Tú la eliges. |
| **Effects** | Cambios de variables aplicados al salir: las mismas filas `variable, operación, valor` que una opción de elección. |

Con los efectos, un subgrafo reporta *qué cambió*; con el resultado, *qué pasó*. Un subgrafo
de combate podría devolver el resultado `win` y, en sus efectos, sumar 20 de oro y fijar `bandits_beaten` en
true.

Un subgrafo puede tener tantos Return Nodes como finales tenga. Todos pueden devolver resultados distintos, o
dos pueden devolver el mismo.

## Enrutar el resultado

De vuelta en el grafo padre, selecciona el SubGraph Node. Tiene:

- Una lista de **rutas de resultado**, añadidas con el botón `+ outcome`. Cada una es una clave de resultado
  más un puerto. Escribe la clave exactamente como la escribe el Return Node, y luego conecta el puerto a
  donde ese resultado deba continuar.
- Un puerto **`fallback →`**, que se toma para cualquier resultado que no hayas enrutado, incluido uno
  vacío.

> **Advertencia**
> El fallback no es opcional. Si un Return Node devuelve `fled` y solo enrutaste `win` y `lost`, la historia
> va al fallback. Si el fallback no está conectado, la historia se detiene. Conéctalo, aunque solo lleve al
> mismo nodo que el resultado más probable.

## Un ejemplo completo

Al jugador lo pueden emboscar en el camino del norte, en el del sur y en las afueras del molino. Los tres
casos son la misma pelea.

**1. Construye la pelea una sola vez.**

En el lienzo padre, crea un SubGraph Node y llámalo `Ambush`. Haz clic derecho en él, `Create Subgraph`, y
luego `Open Subgraph`.

Dentro, construye la pelea como nodos normales: un Dialogue Node que ambienta la escena, un Choice Node con
"Fight", "Talk your way out" y "Run", y los nodos de diálogo a los que lleva cada uno.

**2. Termina cada camino con un nodo Return.**

Tres Return Nodes:

| Nodo Return | Clave de resultado | Efectos |
|---|---|---|
| Al ganar | `win` | `gold += 20`, `toggle bandits_beaten` |
| Al convencerlos hablando | `talked` | `maya.trust += 1` |
| Al huir | `fled` | `toggle coward` |

Conecta el último nodo de diálogo de cada camino a su Return Node.

**3. Sube de nuevo y enruta.**

Pulsa `↥ Up`. Selecciona el nodo `Ambush` y añade dos rutas de resultado:

- `win` -> el nodo donde el camino continúa, con el botín.
- `talked` -> el nodo donde el camino continúa, y los bandidos se despiden con la mano.

Deja `fled` sin enrutar. Conecta `fallback →` al nodo donde el jugador despierta de vuelta en el pueblo
anterior. Ahora `fled` —y cualquier resultado que añadas más tarde y olvides enrutar— aterriza en un lugar
razonable.

**4. Llámalo desde los otros dos lugares.**

En el camino del sur y en las afueras del molino, crea un SubGraph Node en cada uno, y apunta cada
`subGraph` al mismo asset de grafo. Cada uno de los tres puntos que la llaman enruta `win` y `talked` a *su
propia* continuación, porque las rutas viven en quien llama, no en el subgrafo. La pelea se escribe una vez;
las consecuencias son locales.

Las variables que la pelea cambió —el oro, las banderas, la confianza— están en el mismo almacén compartido,
así que cualquier condición puede verlas en cualquier parte de ahí en adelante, y se guardan y rebobinan con
todo lo demás.

## Ver también

- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) — el SubGraph Node y el Return Node en la referencia de nodos.
- [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) — condiciones y efectos, que los Return Nodes reutilizan.
- [Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/) — abandonar la novela por completo, algo distinto de un subgrafo.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — el almacén en el que escriben los efectos de un subgrafo.
