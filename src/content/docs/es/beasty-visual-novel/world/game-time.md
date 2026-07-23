---
title: "Tiempo de juego"
description: "Momentos del día, un reloj opcional, días de la semana y estaciones. El tiempo de juego es la columna vertebral del mundo vivo: impulsa rutinas, fondos de sala, misiones recurrentes y cualquier condición que escribas."
---

Momentos del día, un reloj opcional, días de la semana y estaciones. El tiempo de juego es la columna vertebral del mundo vivo: impulsa
las [rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/), los fondos condicionales de sala, las misiones recurrentes y cualquier condición
que quieras escribir. Esta página es para guionistas y diseñadores.

## La decisión de diseño, dicha de entrada

**El tiempo lo controla el autor. El runtime nunca avanza el reloj por sí solo.** Ningún temporizador oculto corre
mientras el jugador lee una línea. El tiempo se mueve solo cuando tú lo dices:

- un bloque **Advance time** dentro de un nodo de la historia,
- un objeto de mundo libre con **advance time on click** (una cama, un reloj),
- un botón del HUD cuya acción es **AdvanceTime**,
- o una llamada desde tu propio código (consulta [API de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/)).

Esto es deliberado. El ritmo de una novela visual lo marcan sus escenas, no un cronómetro, y un jugador que
deambula por una sala durante diez minutos no debería perderse el atardecer.

## Activar el tiempo

![El Time Config asignado en el BeastyManager](/docs-images/beasty-visual-novel/vn-time-config-assign.png)

1. Crea la configuración: `Create > Beasty VN > Config > Time Config`.
2. Selecciona el **BeastyManager** en tu escena.
3. Arrastra la configuración a su campo **Time Config**.

> **Advertencia**
> Deja el campo **Time Config** vacío y todo el sistema de tiempo queda apagado. No se escribe ninguna variable de tiempo, y
> **toda condición que lea el tiempo se evalúa como falsa** — una regla de rutina basada en `time.daypart` nunca
> coincide, un fondo condicional basado en la estación nunca se muestra, una misión Daily nunca se renueva. Si tu
> mundo parece congelado, revisa primero este campo.

Todo lo que escribe el tiempo va al mismo almacén de variables compartido que tus propias variables. Por eso el tiempo se
guarda, se restaura y se rebobina junto con todo lo demás, y por eso puedes leerlo en cualquier condición sin trato
especial.

## Los dos modos

| Modo | Qué es |
|---|---|
| `SlotsOnly` | El tiempo es una lista de momentos del día con nombre (Mañana, Tarde, Atardecer, Noche). No hay hora. |
| `Clock` | El tiempo es un contador de horas. El momento del día actual se deriva de la hora. |

Elige `SlotsOnly` a menos que el jugador deba ver un reloj. Es menos trabajo de autoría y menos margen de error.

### Cómo deriva el modo Clock el momento del día

En el modo Clock, cada momento del día tiene una **hora de inicio**, y esas horas de inicio cortan el día en bandas. El
momento del día actual es la banda con la mayor hora de inicio que siga siendo menor o igual que la hora actual.

**Las horas anteriores a la primera banda pertenecen al ÚLTIMO momento del día, porque el reloj da la vuelta pasada la medianoche.**
Con estos cuatro momentos del día:

```text
Morning    startHour = 6
Afternoon  startHour = 12
Evening    startHour = 18
Night      startHour = 22
```

- Hora 5 -> **Night**. Ninguna banda empieza a las 5 o antes, así que pertenece a la última: Night empezó a
  las 22 de la noche anterior y sigue en curso.
- Hora 6 -> Morning.
- Hora 13 -> Afternoon.
- Hora 22 -> Night.

## Todos los campos de Time Config

![Un asset Time Config con momentos del día, días de la semana y estaciones rellenos](/docs-images/beasty-visual-novel/vn-time-config-inspector.png)

| Campo | Modo | Qué hace |
|---|---|---|
| `mode` | ambos | `SlotsOnly` o `Clock`. |
| `dayparts` | ambos | La lista ordenada de momentos del día. Cada uno tiene un **nombre** y (solo Clock) una **startHour**. |
| `hoursPerDay` | Clock | Cuántas horas tiene un día de juego. Por defecto 24. |
| `weekdays` | ambos | Lista opcional de nombres de días de la semana. Vacía = sin días de la semana. |
| `seasons` | ambos | Lista opcional de nombres de estaciones. Necesita `daysPerSeason` mayor que 0. Vacía = sin estaciones. |
| `daysPerSeason` | ambos | Cuántos días dura una estación. Se ignora cuando `seasons` está vacío. |
| `startDay` | ambos | El día en que empieza la sesión. Por defecto 1. |
| `startDaypartIndex` | SlotsOnly | Índice en `dayparts` para el momento del día inicial. |
| `startHour` | Clock | La hora en que empieza la sesión. |

### Días de la semana y estaciones

Ambas son capas de calendario opcionales, y ambas se derivan del número de día — nunca las fijas a mano.

- El día de la semana recorre la lista `weekdays`: el día 1 es el primer nombre, el día 2 el segundo, y da la vuelta.
- La estación es el bloque de `daysPerSeason` días en el que cae el día actual, recorriendo `seasons`.

Si `weekdays` está vacío, `time.weekday` nunca se escribe y las condiciones sobre él nunca coinciden. Lo mismo para las estaciones.
Una semana no tiene por qué durar siete días: nombra tres días de la semana y la semana durará tres días. Las misiones semanales recurrentes
usan la longitud de tu lista de días de la semana (o 7 si no tienes ninguna).

## Avanzar el tiempo

### El bloque Advance time

Añade un bloque **Advance time** (categoría de paleta **World**) a cualquier nodo. Tiene una operación:

![Un bloque Advance time con su operación y su cantidad](/docs-images/beasty-visual-novel/vn-block-advance-time.png)

| Operación | Qué hace |
|---|---|
| `AdvanceDayparts` | Avanza N momentos del día. Da la vuelta al día siguiente cuando pasa la última. |
| `AdvanceHours` | Solo Clock. Avanza N horas. Si las horas desbordan el día, el contador de días avanza también. |
| `AdvanceDays` | Avanza N días. Se recalculan el día de la semana y la estación. |
| `SetDaypart` | Salta a un momento del día con nombre. En modo Clock esto también fija la hora a la hora de inicio de ese momento. |
| `SetHour` | Solo Clock. Fija la hora. El momento del día se deriva de nuevo a partir de ella. |
| `SetWeekday` | Avanza hasta la siguiente aparición de un día de la semana con nombre. Siempre hacia adelante; hoy cuenta. |

Una escena de "irse a dormir", en bloques:

```text
[Dialogue]      "You close your eyes."
[Advance time]  op = AdvanceDayparts, amount = 1
[Dialogue]      "Morning already."
```

Eso avanza un momento del día, que puede ser o no la mañana. Para un salto limpio a una hora fija sin importar
cuándo se acostó el jugador, usa mejor `SetDaypart` con el nombre de momento del día `Morning`.

`SetWeekday` es la operación de "esperar hasta el viernes": avanza el contador de días hasta el siguiente viernes. Si hoy ya
es viernes, no se mueve nada.

Cada operación escribe sus cambios en un solo lote, así que las condiciones, las rutinas y cualquier etiqueta del HUD ligada al
tiempo se actualizan una vez, no cinco.

### Desde un objeto de mundo libre

Cualquier objeto o puerta de una sala puede llevar un efecto de tiempo integrado: **advance time on click** más el mismo
conjunto de operaciones. Úsalo para una cama o un reloj — un objeto cuyo único trabajo es mover el tiempo. Si la
interacción también necesita diálogo, no lo uses: haz que el objeto entre en una escena de novela visual que
contenga un bloque Advance time. Consulta [Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/).

### Desde un botón del HUD

Un elemento de pantalla cuya acción sea **AdvanceTime** hace lo mismo desde el HUD. Consulta
[Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/).

![El HUD mostrando el día y el momento del día durante la partida](/docs-images/beasty-visual-novel/vn-time-hud-ingame.png)

## Las variables de tiempo reservadas

El runtime las escribe por ti en el almacén compartido. Aparecen en el selector de condiciones con nombres
amigables, así que rara vez escribes la clave en bruto.

| Clave del almacén | Etiqueta del selector | Se escribe cuando | Valor |
|---|---|---|---|
| `@time:daypart` | `time.daypart` | Siempre | El nombre del momento del día actual, p. ej. `Morning`. |
| `@time:hour` | `time.hour` | Solo modo Clock | La hora, como número. |
| `@time:day` | `time.day` | Siempre | El número de día, empezando en 1. |
| `@time:weekday` | `time.weekday` | Cuando `weekdays` no está vacío | El nombre del día de la semana actual. |
| `@time:season` | `time.season` | Cuando `seasons` y `daysPerSeason` están definidos | El nombre de la estación actual. |

Son variables ordinarias en un espacio de nombres extraordinario: léelas en una condición de fondo, una condición de
elección, una condición de diálogo, la visibilidad de un objeto, una regla de rutina, la condición de inicio de
una misión. No hace falta nada especial en ningún sitio.

### Chuleta de condiciones

```text
time.daypart == Morning
time.hour >= 18
time.day > 3
time.weekday == Monday
time.season == Summer
```

Las rutinas de personajes publican sus propias variables reservadas junto a estas
(`maya.location`, `maya.spot`, `maya.routineMode`) — consulta [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).

## Errores comunes

- **No pasa nada.** El Time Config no está asignado al BeastyManager.
- **Una condición sobre `time.hour` nunca coincide.** Estás en modo `SlotsOnly`; no hay hora. Usa
  `time.daypart`.
- **Una condición sobre `time.weekday` nunca coincide.** La lista `weekdays` está vacía.
- **El jugador se queda atascado en Morning para siempre.** Nada en tu juego avanza el tiempo. Añade un bloque Advance time
  en algún lugar por el que pase el jugador, o una cama.

## Ver también

- [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/) — poner a los personajes donde deben estar en cada momento del día.
- [Misiones](/es/docs/beasty-visual-novel/world/quests/) — misiones Daily, Weekly y SpecificDays, y objetivos WaitTime.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — cómo se construyen las condiciones.
- [API de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) — `BeastyTime` para programadores.
- [Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/) — cada espacio de nombres de clave reservado.
