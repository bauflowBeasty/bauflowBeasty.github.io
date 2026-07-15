---
title: "Elecciones y decisiones"
description: "Dos nodos ramifican la historia, y no son intercambiables."
---

Dos nodos ramifican la historia, y no son intercambiables.

- Un **Choice Node** pregunta al jugador. Muestra un menú y espera.
- Un **Decision Node** pregunta al mundo. No muestra nada y enruta al instante.

Si el jugador debe sentirse responsable de lo que pasa a continuación, usa una elección. Si la historia
simplemente debe tomar el camino correcto según lo que ya pasó, usa una decisión. Confundirlos es el error
de autoría más común, y se reconoce fácil: un menú con una sola opción dentro.

## El nodo Choice

Añade opciones con el botón `+ choice` del nodo, y luego complétalas a la derecha. Cada opción tiene cuatro
partes.

### La etiqueta (label)

Un nombre corto para la opción. Aparece en el puerto del nodo en el grafo y en la lista del inspector. Es
**para ti**: el jugador nunca la ve. Nombra tus puertos y el grafo se mantiene legible de un vistazo.

### El texto del prompt

Lo que el jugador realmente lee en el botón. Es una línea localizable normal, como cualquier diálogo.

### La condición

Opcional. Vacía significa que la opción siempre se ofrece.

Cuando le das una condición a una opción, la opción solo se muestra si la condición se cumple. Así es como
restringes el acceso:

```text
"Buy the sword"      if gold >= 10
"Ask about her sister"   if maya.trust > 40
"Use the key"        if item.rusty_key >= 1
```

Una opción cuya condición falla simplemente no está en el menú. El jugador nunca la ve y no puede saber que
estuvo ahí.

### Los efectos

Cambios de variables aplicados **cuando el jugador elige esta opción**, antes de que la historia continúe.
Comprar la espada resta 10 de oro, aceptar ayudar fija `promised_to_help` en true, un insulto baja el cariño
en 2.

Los efectos son una lista de filas `variable, operación, valor`, con las mismas cuatro operaciones que el
bloque Set variable: `Assign`, `Add`, `Subtract`, `Toggle`.

### El destino

A dónde lleva elegirla. Dos tipos:

- **Un nodo de este proyecto.** Arrastra el puerto de la opción hasta el nodo. Ramificación normal.
- **Una salida de flujo.** La opción abandona la novela visual por completo: `Go to FreeRoam`,
  `Return to previous room`, `Choose room`, o `Go to another VN`. Una opción con una salida de flujo no
  tiene cable: en su lugar, la etiqueta del puerto muestra a dónde va. Consulta
  [Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/).

Eso significa que "Leave the tavern" y "Stay and ask another question" pueden convivir en el mismo menú:
una sale al mundo y la otra continúa la escena.

### Cuando todas las opciones quedan bloqueadas

Si la condición de todas las opciones falla, el menú quedaría vacío. En lugar de mostrar nada, el nodo de
elección continúa por su puerto **`default →`**.

Esto no es un caso extremo, es una herramienta de diseño: un nodo hub con cinco temas condicionales, cuyo
`default →` lleva a "You have nothing left to ask her", se vacía por sí solo a medida que el jugador lo
agota. Pero sí significa que **un `default →` sin conectar en un nodo de elección totalmente bloqueado es un
callejón sin salida.** Conéctalo.

### El sprite del personaje

Un nodo de elección puede mostrar la imagen de un personaje junto a las opciones: la persona a la que estás
respondiendo. Fija el **character sprite** en el nodo y aparece el panel de personaje de la pantalla de
elección; déjalo vacío y el panel se queda oculto.

El sprite también puede ser **condicional**, con el mismo modelo que un fondo de sala: una lista ordenada
de casos, cada uno con una condición, y el primero que se cumpla gana. Si ninguno se cumple, se usa el
sprite por defecto. Así que la cara a la que estás respondiendo puede estar enojada o contenta según lo que
hiciste antes, sin duplicar el nodo de elección.

## El nodo Decision

Un nodo de decisión no tiene UI en absoluto. **El jugador no lo ve, no hace clic en él, y no puede saber que
existe.** Es una señal que la historia lee por sí misma.

Cuando la historia llega a él, el nodo recorre sus ramas de arriba abajo, toma la **primera rama cuya
condición se cumpla**, aplica los efectos de esa rama, y salta. Si ninguna rama coincide, toma el puerto
**`fallback →`**.

Añade ramas con el botón `+ branch`. Una rama tiene una condición, efectos y un destino: un nodo, o una
salida de flujo, exactamente igual que una opción de elección.

```text
branch 1   if chapter_2_unlocked           -> Chapter 2 opening
branch 2   if maya.trust >= 50             -> The warm version of the scene
branch 3   if maya.trust <= -20            -> The cold version
fallback                                    -> The neutral version
```

El orden importa. La primera coincidencia gana, así que pon la rama más específica primero. Una rama **sin
condición** se etiqueta `(always)` en el grafo, porque una condición vacía siempre se cumple: todo lo que
hay debajo es inalcanzable. Esa es una forma legítima de escribir un valor por defecto en línea, pero hazlo
a propósito y ponla al final.

### Cuándo usar una decisión en lugar de una elección

- **Bloquear un capítulo según el estado del mundo.** La escena se abre de forma distinta según si el
  jugador ya conoció a la hermana. No hay ninguna pregunta que hacer; la historia simplemente lo sabe.
- **Dividir según una variable.** Tres finales según el rango de cariño. El jugador tomó esas decisiones
  hace mucho, una línea a la vez.
- **Limpiar después de una elección.** Un nodo de elección fija una bandera, tres escenas convergen, y un
  nodo de decisión mucho más adelante lee la bandera y vuelve a dividir. La consecuencia cae lejos de la
  causa, que es donde se supone que deben caer las consecuencias.
- **Cualquier enrutador.** Un único punto de entrada que envía al jugador a la misión que esté activa en ese
  momento.

Conecta siempre `fallback →`. Es la rama que se ejecuta el día en que una de tus condiciones está mal.

## Condiciones

Las condiciones se definen del mismo modo en todo Beasty VN: en una opción de elección, en una rama de
decisión, en un fondo de sala, en una entrada de menú de conversación. Una condición es una lista de
cláusulas.

Una cláusula es **token, operador, valor**:

- El **token** es una clave del almacén de variables. Eso incluye tus propias variables, variables de
  personaje, tiempo, misiones e inventario, porque todos viven en un solo almacén. El selector los muestra
  con etiquetas amigables (`time.daypart`, `maya.location`, `maya.trust`).
- El **operador** es uno de siete:

| Operador | Se muestra como | Significa |
|---|---|---|
| Equals | `=` | igual |
| NotEquals | `!=` | distinto |
| Greater | `>` | mayor que |
| Less | `<` | menor que |
| GreaterOrEqual | `>=` | mayor o igual que |
| LessOrEqual | `<=` | menor o igual que |
| Contains | `contains` | el valor aparece dentro del texto del token |

- El **valor** es aquello con lo que se compara.

### Combinar cláusulas

Las cláusulas se combinan con `And` u `Or`, y **AND tiene prioridad sobre OR**:

```text
a AND b OR c     is     (a AND b) OR c
```

Léelo como "a y b juntas, o si no, c". Si quieres la otra agrupación, divide la condición en dos
ramas: un nodo de decisión con dos ramas es más claro que una línea ingeniosa, y sobrevive a que alguien la
lea dentro de seis meses.

### Las dos reglas que atrapan a la gente

> **Advertencia**
> **Una condición vacía siempre es verdadera.** Una opción de elección sin condición siempre se ofrece. Una
> rama de decisión sin condición siempre coincide, así que todo lo que hay debajo está muerto. Esto es
> intencional —es lo que hace que "sin condición" signifique "sin bloqueo"— pero significa que una rama que
> *pensabas* completar y olvidaste se tragará la historia.

> **Advertencia**
> **Una cláusula sin token está incompleta y se evalúa como falsa.** Si añades una cláusula, eliges un
> operador y escribes un valor pero nunca eliges la variable, la cláusula no queda "ignorada": falla, y toda
> la condición falla con ella. La opción no aparece nunca, en silencio. El motor lo reporta una vez, así que
> revisa la consola cuando una opción que debería estar ahí no lo está.

## Efectos

Un efecto es un cambio de variable: **variable, operación, valor**. Las operaciones son `Assign`, `Add`,
`Subtract` y `Toggle` (que invierte un Bool e ignora el valor).

En lo que toca a esta página, los efectos existen en tres lugares: en una opción de elección (se aplican
cuando el jugador la elige), en una rama de decisión (cuando se toma la rama), y en un nodo Return (cuando
un subgrafo devuelve el control). Escriben en el mismo almacén que el bloque **Set variable**, así que se
conservan en las partidas guardadas y el rebobinado los revierte correctamente.

Úsalos para la pequeña consecuencia que pertenece a la elección misma: el oro gastado, la bandera levantada,
la confianza perdida. Usa un bloque Set variable en el nodo al que llegas para cualquier cosa que quien lea
tu grafo deba ver sin tener que abrir la opción.

## Ver también

- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — la explicación completa: ámbitos, tipos de
  valor y todas las claves reservadas.
- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) — los nodos y sus puertos.
- [Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/) — salidas de flujo como destino de una elección o una rama.
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — el bloque Set variable.
