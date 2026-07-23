---
title: "Rutinas de personajes"
description: "Personajes que están donde deben estar, cuando deben estar. Una rutina dice: dado el día, el momento del día y el estado del mundo, en qué sala está este personaje — o si no está en ninguna."
---

Personajes que están donde deben estar, cuando deben estar. Una rutina dice: dado el día, el momento del día y
el estado del mundo, en qué sala está este personaje — o si no está en ninguna parte. Esta página es para
guionistas y diseñadores.

Las rutinas necesitan [tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/). Sin un Time Config asignado al BeastyManager, toda condición de
tiempo es falsa y toda rutina cae en su respaldo.

## Dónde vive una rutina

Una rutina por personaje, guardada en el **FreeRoam Map Graph** — el mismo asset que contiene tus salas. Editas
las rutinas en la pestaña **FreeRoam** de la ventana Beasty VN (`Tools > Beasty VN > Editor`), ya sea desde
dentro de una sala (su línea de tiempo) o desde la grilla **Routines**.

Una rutina se compone de tres cosas, de fuera hacia dentro:

1. **Perfiles** — horarios con nombre. Solo uno está activo a la vez.
2. **Reglas** — dentro de un perfil, una lista ordenada de "si esta condición se cumple, está en esta sala".
3. **Lo visual** — cómo se dibuja al personaje en la sala una vez colocado.

## Perfiles: cambiar todo un horario de un solo bloque

Un personaje tiene uno o más perfiles con nombre (`Default`, `Working`, `Fired`, `Sick`) más un **nombre de perfil
por defecto**. El perfil activo es el que coincide con la variable de modo de rutina del personaje
(`@char:<id>:@routineMode`, mostrada en el selector de condiciones como `maya.routineMode`). Si esa variable está vacía,
o nombra un perfil que no existe, se usa el perfil por defecto; y si tampoco existe, el primero.

![Los perfiles de rutina de un personaje, con el perfil por defecto nombrado](/docs-images/beasty-visual-novel/vn-routine-profiles.png)

Este es el sentido de los perfiles: **cuando la historia da un giro, cambias toda la semana de un personaje con un
único bloque.** La despiden, él cae enfermo, se mudan a la costa — un bloque, no treinta ediciones de reglas.

Dos formas de escribirlo:

- el bloque **Routine override** (categoría de paleta **World**): elige el personaje, elige el nombre del perfil.
  Deja el perfil vacío para volver al perfil por defecto.
- un bloque **Set variable** sobre `maya.routineMode`, que hace exactamente lo mismo. El bloque es solo la
  versión tipada, guiada por selector.

En el script `.vnbeasty`, lo mismo es una línea:

```text
routine maya Fired
routine maya            # back to the default profile
```

Como el modo de rutina es una variable ordinaria, se guarda, se carga y se rebobina con todo lo demás.

## Reglas: gana la primera coincidencia

Un perfil contiene una lista ordenada de **reglas** y un **respaldo**. Cada regla es una condición más una sala.

![La lista ordenada de reglas de un perfil, con su fallback](/docs-images/beasty-visual-novel/vn-routine-rules.png)

El resolutor recorre las reglas desde arriba y se detiene en **la primera regla cuya condición se cumpla**. Si ninguna
regla coincide, se usa el respaldo.

> **Importante**
> **Una regla con una sala vacía significa que el personaje está ausente** — no en esa sala, no en ninguna sala, no en el
> mapa en absoluto. Así se escribe "ella no está por aquí de noche": deja vacía la sala del respaldo.

Una condición vacía siempre se cumple, así que una regla sin condición colocada por encima de otras anula todas las
que están debajo. El orden importa.

## El editor de grilla de rutinas

La pestaña **FreeRoam** tiene un interruptor **Map / Routines** en su barra de herramientas. Cambia a **Routines** y obtienes un
solo lienzo: **las columnas son días de la semana, las filas son momentos del día**, más una fila **General** arriba y una fila **Fallback** al
final.

![La grilla de rutinas: días de la semana en columnas, momentos del día en filas, con la barra de filtros](/docs-images/beasty-visual-novel/vn-routine-grid.png)

Una barra de filtros controla qué muestra la grilla y qué edita:

| Filtro | Efecto |
|---|---|
| **Character** | Elige uno y la grilla edita la semana de ese personaje. Este es el modo de edición. |
| **Room** | Resalta las celdas que resuelven a esa sala, así puedes ver quién está en la panadería toda la semana. |
| **Day** | Reduce la grilla a un día de la semana. |
| **Profile** | Cuál de los perfiles del personaje estás editando. |

Haz clic en una celda vacía y elige una sala del menú; haz clic en una celda ocupada para seleccionarla y editar su
colocación en el inspector de la derecha (su sala, su arte, su posición). Arrastra sobre las celdas para pintar la misma
sala en varias de una vez. **Clear (absent)** vacía una celda.

La fila **General** es para colocaciones que no dependen del día de la semana. Una regla creada ahí se aplica a
todos los días, lo que mantiene corta la lista de reglas: un panadero que está en la panadería cada mañana es una regla, no siete.

> **Nota**
> **La grilla es una lente sobre la lista de reglas, no un segundo modelo.** Lee las reglas, las muestra como celdas, y las
> vuelve a escribir como reglas. Una regla escrita a mano con una condición que la grilla no puede dibujar (digamos, una que también
> comprueba el estado de una misión) se conserva intacta y se marca como avanzada — la grilla no la destruirá en silencio.
> Las reglas siguen siendo la verdad.

La grilla también saca a la luz los **conflictos**: un personaje colocado en dos salas en el mismo momento del día en días
superpuestos. Soltar a un personaje en una sala elimina automáticamente su colocación en otras salas en ese momento del día, así que
rara vez creas uno a mano — pero las reglas escritas a mano sí pueden crearlos, y la grilla te lo indica.

## Las salas no son la única forma de estar en algún sitio

Hay una segunda forma, centrada en la sala, de crear los mismos datos: entra en una sala en la vista **Map** y usa su
línea de tiempo, que tiene un carril por momento del día y un botón `+ Character` por carril. Añadir un personaje al
carril de Morning de la Panadería escribe exactamente la regla que habría escrito la grilla. Los dos editores son dos vistas de
una misma lista de reglas; usa el que encaje con cómo estás pensando — "qué hace Maya esta semana" o "quién está en la panadería
por la mañana".

![La línea de tiempo de una sala: un carril por momento del día, con + Character](/docs-images/beasty-visual-novel/vn-room-timeline.png)

## Cómo se ve el personaje en la sala

Una vez que una regla coloca a un personaje en una sala, el runtime tiene que dibujarlo. Usa el primero de estos que exista:

1. **El sprite marcador del paso de la misión**, cuando una [anulación de rutina de misión](/es/docs/beasty-visual-novel/world/quests/) lo movió
   ahí y ese paso define un marcador.
2. **Lo visual propio de la regla** — el sprite, la posición, la escala, el orden de dibujado y la respuesta al pasar el
   cursor definidos en la propia colocación (el inspector de la grilla, o la línea de tiempo de la sala).
3. **Un punto de personaje libre** en el prefab de la sala, usando el sprite de mundo libre del personaje.
4. **El centro de la sala**, si no quedan puntos.

El arte propio del personaje proviene del **sprite de mundo libre** en la Character Definition; si está vacío, se usa su
sprite de expresión base.

### Puntos de personaje

Un **punto** es un objeto hijo dentro de un prefab de sala que lleva un componente `FreeRoamCharacterSpot`. Marca dónde
se para alguien. Su **posición y escala son decisiones del prefab, no datos en la rutina** — lo colocas
en la escena, a ojo, con las propias herramientas de Unity.

Cada personaje colocado de forma genérica ocupa **el siguiente punto libre** de la sala. Por eso dos personajes nunca
comparten un punto: el primero toma el primer punto, el segundo toma el segundo. Si a la sala se le acaban los puntos, el
siguiente personaje cae al centro de la sala — así que dale a cada sala tantos puntos como personajes pueda llegar a albergar a la vez. Consulta
[Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/) para saber cómo añadir uno.

### Las poses ganan a los marcadores

Si creas una **pose de personaje** en una sala — un objeto de sala cuyo propietario es ese personaje — la pose gana y
el marcador genérico se suprime, de modo que el personaje nunca se dibuja dos veces. Las poses son la forma de darle a un personaje
un aspecto concreto en una sala concreta. Consulta [Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/).

## Cuándo se recalculan las rutinas

En cada entrada a una sala, y siempre que cambia el almacén de variables compartido — lo que incluye cada bloque
Advance time, cada bloque Set variable, cada misión que se completa. **Nunca disparas un recálculo tú mismo.**

Cada recálculo publica tres variables reservadas por personaje:

| Clave del almacén | Etiqueta del selector | Valor |
|---|---|---|
| `@char:<id>:@routineLocation` | `maya.location` | El id de la sala en la que está, o vacío cuando está ausente. |
| `@char:<id>:@routineSpot` | `maya.spot` | El id del punto dentro de esa sala, o vacío. |
| `@char:<id>:@routineMode` | `maya.routineMode` | El nombre del perfil activo. Escribir esto cambia su horario. |

Eso significa que puedes escribir condiciones sobre dónde está la gente, en cualquier sitio donde se acepten condiciones:

```text
maya.location == Bakery
maya.spot == Counter
maya.routineMode == Working
```

Un fondo de sala que cambia cuando hay alguien en la sala, una elección que solo aparece cuando el tendero está
presente, una misión que empieza cuando el jugador la encuentra en el parque — todo eso es una sola condición.

## Hacer clic en un personaje en una sala

Al hacer clic en un personaje en una sala se ejecuta, en este orden:

1. la lista de **on interact** de la rutina — el primer caso cuya condición se cumpla reproduce su escena;
2. si no, el **[menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/)** del personaje, si resuelve en alguna entrada;
3. si no, la escena de interacción por defecto de la rutina.

Así que en cuanto le das a un personaje un menú de conversación, hacer clic en él lo abre. No hay que conectar nada.

## Anulaciones de rutina por misión

Una misión puede mover a un personaje. Mientras una misión está **activa** y uno de sus pasos de conversación es el
actual, ese paso puede colocar a su personaje en otra sala — opcionalmente solo en ciertos días de la semana y durante
ciertos momentos del día. Se impone por completo a la rutina mientras se aplique, y la variable `location` del personaje
la sigue, así que toda condición del juego concuerda con lo que ve el jugador.

Gana el primer paso que coincida (orden del catálogo). Se define en el objetivo, bajo **Talk step > Move character while current**.
Consulta [Misiones](/es/docs/beasty-visual-novel/world/quests/).

## El calendario de rutina dentro del juego

Los jugadores pueden ver el horario de un personaje. La pantalla **Character Routine** muestra el calendario del
personaje seleccionado en **vista de día** (una fila por momento del día de hoy) o **vista de semana** (una fila por día de la
semana y momento del día). Solo se rellena cuando el indicador **Show routine** del personaje está activado, así que un
extraño misterioso sigue siendo misterioso. Consulta [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/).

![El calendario de rutina en el juego, en vista de semana](/docs-images/beasty-visual-novel/vn-routine-calendar-ingame.png)

## Ejemplo trabajado: una panadera

**Objetivo.** Maya hornea por la mañana, pasea por el parque por la tarde, y no está por ningún lado de noche.

1. **Tiempo.** Crea un Time Config (`Create > Beasty VN > Config > Time Config`), modo `SlotsOnly`, momentos del día
   `Morning`, `Afternoon`, `Evening`, `Night`. Arrástralo al campo **Time Config** del BeastyManager.
2. **Salas.** En la pestaña **FreeRoam**, crea las salas `Bakery` y `Park` (cada una recibe su prefab; consulta
   [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/)).
3. **Puntos.** Abre el prefab de Bakery, añade un objeto hijo llamado `Counter` donde Maya debería estar de pie, y ponle un
   componente `FreeRoamCharacterSpot`. Haz lo mismo para un `Bench` en el prefab de Park.
4. **Rutina.** Cambia la pestaña FreeRoam a **Routines** y filtra por el personaje **Maya**. En la grilla:
   - La fila **General** no es lo que quieres aquí (la colocación depende del momento del día), así que usa las filas de cada momento del día.
   - Fila **Morning**, todos los días de la semana: elige **Bakery**.
   - Fila **Evening**, todos los días de la semana: elige **Park**.
   - **Afternoon** y **Night**: déjalas vacías.
   - **Fallback**: deja la sala vacía, así todo lo que no esté cubierto significa ausente.
5. **Sprite.** En la Character Definition de Maya, define el **sprite de mundo libre**.
6. **El tiempo tiene que moverse.** Dale al jugador algo que lo avance: una cama con **advance time on click**, o
   un bloque Advance time en una escena por la que pase.
7. Pulsa Play. Por la mañana, la Bakery tiene a Maya en el mostrador; por la tarde está en el banco del
   parque; de noche no hay nadie en casa.

Ahora el giro de la historia. La despiden en el capítulo 3:

1. En la grilla de Routines, usa el filtro **Profile** para crear un segundo perfil llamado `Fired`, y complétalo:
   Morning en el `Park`, todo lo demás vacío.
2. De vuelta en la historia, en el momento en que la despiden, coloca un bloque **Routine override**: personaje `maya`,
   perfil `Fired`.

A partir de esa línea, toda la semana de Maya es distinta, en cada sala, en cada condición, en su pantalla de calendario —
y se rebobina correctamente si el jugador retrocede más allá de ese punto.

## Ver también

- [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/) — momentos del día, el reloj, y cómo se mueve el tiempo.
- [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/) — salas, prefabs de sala, puntos de personaje.
- [Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/) — poses de personaje.
- [Misiones](/es/docs/beasty-visual-novel/world/quests/) — anulaciones de rutina por misión.
- [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) — el calendario de rutina dentro del juego.
- [API de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) — `BeastyRoutines` para programadores.
