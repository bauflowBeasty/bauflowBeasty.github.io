---
title: "Pantallas de personaje"
description: "Lista de reparto, perfil, estadísticas, calendario de rutina y registro de misiones: pantallas ya hechas y los ajustes que deciden qué muestran."
---

Estas son las pantallas que el jugador abre *sobre* un personaje: la lista de reparto, su perfil, sus estadísticas,
su calendario semanal y su registro de misiones. Todas son prefabs uGUI normales. Puedes restilizar cada una,
y puedes añadir una pestaña propia al perfil.

## Añadirlas

En la pestaña **Screens** del editor, pulsa **+ Characters**. Eso copia los prefabs ya hechos a tu
proyecto y los registra como pantallas secundarias. A partir de ahí son tuyos: edítalos como quieras.

## La lista de reparto

La lista de reparto tiene una fila por cada personaje que el jugador puede consultar. Al seleccionar una fila
se abre el perfil de ese personaje.

![La lista del reparto en el juego, una fila por personaje conocido](/docs-images/beasty-visual-novel/vn-cast-list-ingame.png)

Dos ajustes deciden quién está en ella, y viven en el personaje (consulta
[Personajes](/es/docs/beasty-visual-novel/world/characters/#aparecer-en-la-lista-de-reparto)):

- **Listed** — desactivado significa que este personaje nunca está en la lista, diga lo que diga cualquier condición.
- **Shown when** — una condición.

Por defecto, todo personaje comparte **una** condición, escrita una sola vez. Usa el marcador `@self`, que
representa "el personaje que se está evaluando":

```text
@self.met == true
```

Cada personaje se comprueba contra su propia bandera `met`, así que el reparto se va completando conforme el jugador
va conociendo a la gente. Una condición compartida vacía significa que todos se muestran desde el principio.

Un personaje concreto puede dejar de usar la condición compartida y llevar la suya propia: activa la
anulación por personaje en él. Resérvalo para la excepción, no para la regla: el villano que solo
aparece en la lista después del capítulo tres.

La lista está virtualizada — solo se dibujan las filas que hay en pantalla —, así que un reparto de mil
personajes se abre al instante.

## El perfil

El perfil es el centro de todo lo relativo a un personaje: un encabezado con su retrato y nombre, y una
**barra de pestañas** debajo que alterna entre secciones. La primera pestaña se muestra al abrirlo.

![El perfil de un personaje: cabecera, retrato y la barra de pestañas](/docs-images/beasty-visual-novel/vn-profile-ingame.png)

La barra de pestañas es **extensible**. Una pestaña no es más que un botón y un panel: añade un botón a la barra, añade un
panel, y añade el par a la lista de pestañas del perfil en el prefab. El panel se reconstruye para el personaje
actual cuando se muestra, así que una sección propia — una galería, un gráfico de relaciones, una pantalla de regalos —
es un panel que escribes y registras, sin ningún cambio en el motor.

Las pestañas incluidas de fábrica son las tres siguientes.

## La pantalla de estadísticas

La pantalla de estadísticas muestra el retrato del personaje, su nombre, y una fila por campo.

![La pantalla de estadísticas: una fila por campo, algunos editables](/docs-images/beasty-visual-novel/vn-stats-ingame.png)

**Qué campos aparecen** es una decisión tuya, campo por campo: solo se listan los marcados como **Show on stats**. Tanto
los campos universales del Character Variable Schema como los propios del personaje pueden marcarse, y un
personaje puede anular ese indicador para un campo universal — así `age` puede mostrarse para todos y
`suspicion` para nadie salvo el detective. Consulta
[Personajes](/es/docs/beasty-visual-novel/world/characters/#variables-de-personaje-estadísticas).

**Los campos editables** son los marcados como **Editable**. El jugador los cambia desde esta pantalla: botones `+` y
`-` para un número, un interruptor para una bandera. El tamaño del paso y el límite mín/máx vienen del campo.
Los campos que no son editables se muestran de solo lectura.

Dos extras, ambos controlados por personaje:

- **La línea de ubicación** muestra la sala en la que está el personaje ahora mismo, si su interruptor **Show current
  location** está activado y está en algún sitio. Se oculta cuando está ausente.
- **El botón de rutina** abre el calendario. Se oculta cuando el interruptor **Show routine** del personaje está
  desactivado.

## El calendario de rutina

El calendario es el horario del personaje, en una de dos vistas, que el jugador alterna:

![El calendario de rutina en el juego, en vista de semana](/docs-images/beasty-visual-novel/vn-routine-calendar-ingame.png)

- **Vista de día** — una fila por momento del día, para hoy.
- **Vista de semana** — la semana entera: momentos del día hacia abajo, días de la semana a lo ancho.

La columna de hoy está resaltada, y el momento del día actual dentro de ella se resalta con más intensidad, así el jugador
ve dónde está. Una celda en la que el personaje no está en ningún sitio del mapa se muestra como desconocida.

El calendario solo se rellena para un personaje cuyo interruptor **Show routine** esté activado. Es una vista de las
reglas de rutina que definiste — consulta [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/) — no una segunda copia de ellas,
así que sigue el perfil activo del personaje y se actualiza cuando la historia lo cambia.

## El registro de misiones

El registro de misiones es la guía. Enumera las misiones **activas** del personaje: el título de cada misión, y luego
sus objetivos con la pista que escribiste para cada uno.

![El registro de misiones: misiones activas, objetivos y la pista actual](/docs-images/beasty-visual-novel/vn-quest-log-ingame.png)

Si activas la opción "show global quests" del registro, al abrirse sin ningún personaje seleccionado enumera
las misiones de la historia principal — las que no tienen dueño.

> **Nota**
> **Sin spoilers.** En una misión **Ordered**, solo se revela la pista del objetivo **actual**. Los
> objetivos que el jugador ya completó se muestran marcados; los que aún están por venir permanecen ocultos. Escribe
> cada pista como si el jugador la estuviera leyendo justo cuando ese paso se convierte en el siguiente, porque ese
> es exactamente el momento en que la leerá.

Un objetivo de recolectar y entregar recibe un botón **Deliver** en el registro, para que el jugador entregue los objetos a
este personaje desde ahí. Consulta [Misiones](/es/docs/beasty-visual-novel/world/quests/).

El registro se actualiza en vivo: un objetivo que se completa con el panel abierto se marca delante del jugador.

## Cómo llega el jugador ahí

Igual que cualquier pantalla superpuesta, y ambas formas funcionan para todas ellas:

- **Un botón del HUD** con la acción **OpenScreen**, apuntando al id de la pantalla. Esta es la forma habitual en
  un juego de mundo libre.
- **El bloque Open screen** (categoría de paleta **World**), que la abre desde dentro de la historia.

Las pantallas forman una pila con Back y Close automáticos, así que una pantalla de estadísticas abierta desde la lista de
reparto se cierra de vuelta a la lista de reparto. Consulta [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/).

## Ver también

- [Personajes](/es/docs/beasty-visual-novel/world/characters/) — los ajustes detrás de cada pantalla de esta página
- [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/) — la pila de pantallas, los botones del HUD y las superposiciones
- [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/) — el horario que muestra el calendario
- [Misiones](/es/docs/beasty-visual-novel/world/quests/) — misiones, objetivos y pistas
- [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) — restilizar estas pantallas y actualizarlas de forma segura
