---
title: "Claves de variables"
description: "Cada clave que vive en el almacén de variables, y cómo escribir una condición sobre ella. Abre esta página cuando necesites una condición sobre el tiempo de juego, el estado de una misión, la ubicación de un personaje o el inventario del jugador."
---

Cada clave que vive en el almacén de variables, y cómo escribir una condición sobre ella. Abre esta página
cuando necesites una condición sobre el tiempo de juego, el estado de una misión, la ubicación de
un personaje o el inventario del jugador.

## Un almacén para todo

Hay un único almacén clave/valor plano. Tus variables, las variables de personaje, el reloj, el progreso de
las misiones, el inventario y el diccionario viven todos ahí, bajo distintos namespaces de clave. Por eso
cualquiera de ellos puede usarse en cualquier condición, por eso todos se guardan, y por eso todos se
rebobinan correctamente.

| Qué | Formato de clave | Clave de ejemplo |
|---|---|---|
| Tus variables | `key` (sin prefijo) | `gold` |
| Variables de personaje | `@char:<id>:<field>` | `@char:maya:affection` |
| Nombre de personaje (reservado) | `@char:<id>:@name` | `@char:maya:@name` |
| Rutina (reservado) | `@char:<id>:@routineLocation`, `@char:<id>:@routineSpot`, `@char:<id>:@routineMode` | `@char:maya:@routineLocation` |
| Tiempo de juego | `@time:daypart`, `@time:hour`, `@time:day`, `@time:weekday`, `@time:season` | `@time:daypart` |
| Misiones | `@quest:<id>:@state`, `@quest:<id>:@stage`, `@quest:<id>:@period`, `@quest:<id>:@rewarded`, `@quest:<id>:@penalized`, `@quest:<id>:@lastResult`, `@quest:<id>:<objectiveId>` | `@quest:ana_m1:@state` |
| Inventario | `item.<id>`, `inventory.order` | `item.potion` |
| Diccionario | la clave del token (sin prefijo) | `city` |

Los campos reservados se escriben con un `@` inicial. Una clave definida por el autor nunca puede llevarlo,
así que tus variables nunca pueden colisionar con las del motor.

> **Nota**
> Una clave que nunca se escribió se lee como un valor vacío. Una condición sobre ella da false a menos que
> la compares con un valor vacío.

## Cómo escribes una condición

En el editor nunca escribes una clave. Cada campo de condición tiene un selector con búsqueda que lista las
claves e inserta la correcta. El selector muestra una etiqueta legible, pero lo que se guarda siempre es la
clave exacta de la tabla de arriba.

| Namespace | Etiqueta en el selector |
|---|---|
| Tus variables | La clave misma: `gold` |
| Variables de personaje | `<id>.<field>`: `maya.affection` |
| Rutina | `<id>.<field>`, conservando el `@` reservado: `maya.@routineLocation` |
| Tiempo de juego | `time.<field>`: `time.daypart` |
| Misiones | `quest.<id>:<field>`: `quest.ana_m1:@state` |
| Inventario | La clave misma: `item.potion` |

En el script de texto `.vnbeasty` no hay selector, así que escribes la clave tú mismo, exactamente como
aparece en la columna de clave: `if @time:daypart == Morning`, no `if time.daypart == Morning`. Consulta
[la sintaxis de .vnbeasty](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/).

### Operadores

`Equals`, `NotEquals`, `Greater`, `Less`, `GreaterOrEqual`, `LessOrEqual`, `Contains`. En el script de texto:
`==`, `!=`, `>`, `<`, `>=`, `<=`, `contains`.

Las cláusulas se combinan con `And` u `Or`.

> **Advertencia**
> **AND tiene prioridad sobre OR.** `a AND b OR c` significa `(a AND b) OR c`, nunca `a AND (b OR c)`. No hay
> paréntesis. Reordena tus cláusulas, o divide la rama en dos.

Dos reglas con las que todos tropiezan alguna vez:

- Una **condición vacía siempre es true**. Ninguna condición significa "siempre".
- Una cláusula **sin clave seleccionada está incompleta y evalúa a false**. Se reporta en la consola una
  vez.

El panorama completo está en [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/).

## Tus propias variables

Declaradas en la pestaña **Variables** de la ventana Beasty VN. La clave no tiene prefijo y es exactamente lo
que escribiste.

```text
gold >= 10
saw_intro == true
player_class == Mage
```

Una bandera sin comparación en el script de texto significa `== true`:

```text
choice "Buy a sword" if gold >= 10 { gold -= 10 } -> smith
if saw_intro -> chapter2
```

Los valores están tipados: `String`, `Int`, `Float`, `Bool`. Una variable `Enum` ofrece sus valores
permitidos como un desplegable en el editor de condiciones en vez de texto libre.

## Variables de personaje

Cada campo en un personaje — los universales del `CharacterVariableSchema` y los propios del personaje — se
almacena bajo `@char:<id>:<field>`.

| Clave | Significado |
|---|---|
| `@char:<id>:<field>` | Un campo en un personaje. |
| `@char:<id>:@name` | Reservado. El nombre mostrado del personaje, una vez que se ha cambiado o el jugador lo ha nombrado. |
| `@char:@self:<field>` | Un marcador de posición usado en una condición compartida. Se resuelve al personaje para el que se esté evaluando la condición. |

Ejemplos de condiciones:

```text
maya.affection >= 3          etiqueta del selector
@char:maya:affection >= 3    la clave real
@char:@self:met == true      una condición compartida, evaluada por personaje
```

Usa `@self` cuando una plantilla de condición tiene que aplicarse a todo el elenco, por ejemplo la regla de
visibilidad de la lista de elenco dentro del juego.

Consulta [Personajes](/es/docs/beasty-visual-novel/world/characters/).

## Claves de rutina

Tres campos reservados por personaje, escritos por el sistema de rutinas en cada entrada a una sala y cada
vez que el almacén cambia. Nunca escribes `@routineLocation` ni `@routineSpot` tú mismo.

| Clave | Valor | Etiqueta en el selector |
|---|---|---|
| `@char:<id>:@routineLocation` | El id de la sala en la que está el personaje ahora mismo, o vacío cuando está ausente. | `<id>.@routineLocation` |
| `@char:<id>:@routineSpot` | El id del spot dentro de esa sala, o vacío. | `<id>.@routineSpot` |
| `@char:<id>:@routineMode` | El nombre del perfil de rutina activo. | `<id>.@routineMode` |

`@routineLocation` y `@routineMode` se ofrecen como desplegables: la lista de salas y la lista de perfiles de
ese personaje.

Ejemplos de condiciones:

```text
@char:maya:@routineLocation == bakery     Maya está en la panadería
@char:maya:@routineLocation ==            Maya está ausente (vacío = no está en el mapa)
@char:maya:@routineMode == Working        Maya está en su horario Working
```

`@routineMode` es la única clave de rutina que SÍ escribes. Establecerla con un bloque Set variable (o el
bloque Routine override) cambia todo el horario de un personaje desde la historia.

Consulta [Rutinas de personaje](/es/docs/beasty-visual-novel/world/character-routines/).

## Claves de tiempo

Cinco claves reservadas. Existen solo mientras haya un **Time Config** asignado en el BeastyManager.

| Clave | Etiqueta en el selector | Disponibilidad | Valor |
|---|---|---|---|
| `@time:daypart` | `time.daypart` | Siempre | El nombre del momento del día actual, p. ej. `Morning`. |
| `@time:hour` | `time.hour` | Solo en modo Clock | Un entero, p. ej. `14`. |
| `@time:day` | `time.day` | Siempre | Un entero, empezando en 1. |
| `@time:weekday` | `time.weekday` | Cuando hay días de la semana configurados | El nombre del día de la semana. |
| `@time:season` | `time.season` | Cuando hay estaciones configuradas | El nombre de la estación. |

`@time:daypart` se ofrece como un desplegable con los momentos del día que configuraste.

Ejemplos de condiciones:

```text
@time:daypart == Morning
@time:hour >= 18
@time:day > 3
@time:weekday == Monday
@time:season == Summer
```

> **Advertencia**
> Sin ningún Time Config asignado, el sistema de tiempo está apagado: ninguna de estas claves se escribe
> jamás, y toda condición sobre ellas es false. Esta es la causa más común de "mis condiciones de tiempo no
> hacen nada".

El tiempo nunca avanza por sí solo. Lo mueves con el bloque Advance time, con el `advanceTimeOnClick` de un
objeto de mundo libre, o desde código. Consulta [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/).

## Claves de misión

Seis campos reservados por misión, más una clave por objetivo. Todos escritos por el sistema de misiones.

| Clave | Valor |
|---|---|
| `@quest:<id>:@state` | `notstarted`, `active`, `completed` o `failed`. |
| `@quest:<id>:@stage` | El índice de objetivo actual en una misión `Ordered`. |
| `@quest:<id>:<objectiveId>` | `true` una vez que ese objetivo está hecho. |
| `@quest:<id>:@period` | El índice de período que rastrea una misión recurrente. |
| `@quest:<id>:@rewarded` | Latch: la recompensa se pagó para el período actual. |
| `@quest:<id>:@penalized` | Latch: la penalización se aplicó para el fallo actual. |
| `@quest:<id>:@lastResult` | `completed` o `failed`, para el último período resuelto de una misión recurrente. |

`@state` y `@lastResult` se ofrecen como desplegables de sus valores permitidos. `@stage` solo aparece para
misiones `Ordered`; `@lastResult` solo para las recurrentes.

Ejemplos de condiciones:

```text
@quest:ana_m1:@state == active           la misión está en curso
@quest:ana_m1:@state == completed        está terminada
@quest:ana_m1:@stage >= 2                el jugador llegó al tercer objetivo
@quest:ana_m1:talk_to_ana == true        ese objetivo en particular está hecho
@quest:ana_m1:@lastResult == failed      fallaron la diaria de ayer
```

Compara un estado de misión con el string, no con un número. Los cuatro estados van en minúsculas.

Consulta [Misiones](/es/docs/beasty-visual-novel/world/quests/).

## Claves de inventario

| Clave | Valor |
|---|---|
| `item.<id>` | Cuántos de ese objeto tiene el jugador. Un objeto `Key` se lee como bool, un `Consumable` como int. |
| `inventory.order` | El orden de ranuras elegido por el jugador. No escribas condiciones sobre esta clave. |

Ejemplos de condiciones:

```text
item.potion >= 1        el jugador tiene al menos una poción
item.rusty_key == true  un objeto Key que posee
item.potion == 0        se quedó sin pociones
```

Give y Take respetan el `maxQuantity` del objeto y el 0, así que la cantidad de un objeto nunca es negativa ni
supera el tope.

Consulta [Objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/).

## Claves de diccionario

Un token del diccionario se almacena bajo su propia clave, sin prefijo, exactamente igual que una de tus
variables. Cuando un bloque Set dictionary o el jugador escribe un valor, va al almacén y eclipsa el valor
por defecto del autor — así que se guarda y rebobina como todo lo demás.

```text
city == Madrid
```

Como un token de diccionario comparte el namespace plano con tus variables, dales a los tokens nombres
distintos. `Tools > Beasty VN > Validate > Find duplicate ids` no detectará un token que eclipsa a una
variable.

Consulta [El diccionario](/es/docs/beasty-visual-novel/world/dictionary/).

## Ver también

- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — alcances, efectos, el editor de condiciones
- [La sintaxis de .vnbeasty](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/) — escribir condiciones como texto
- [Accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/) — `VNVars` y `VNChars`, claves tipadas para C#
- [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) — leer tiempo, rutinas, misiones e inventario en código
- [Assets](/es/docs/beasty-visual-novel/reference/assets/)
