---
title: "Pantallas de personaje"
description: "Estas son las pantallas que el jugador abre sobre un personaje: la lista de reparto, su perfil, sus estadísticas, su calendario semanal y su registro de misiones. Todas ell"
---

Estas son las pantallas que el jugador abre *sobre* un personaje: la lista de reparto, su perfil, sus estadísticas,
su calendario semanal y su registro de misiones. Todas ellas son prefabs uGUI normales. Puedes restilizar cada
una de ellas, y puedes añadir una pestaña propia al perfil.

## Añadirlas

En la pestaña **Screens** del editor, pulsa **+ Characters**. Eso copia los prefabs ya hechos a tu
proyecto y los registra como pantallas secundarias. A partir de ahí son tuyas para editar.

## La lista de reparto

La lista de reparto es una fila por cada personaje que el jugador puede consultar. Seleccionar una fila abre el
perfil de ese personaje.

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

Un solo personaje puede optar por no usar la condición compartida y llevar la suya propia en su lugar — activa
la anulación por personaje en ese personaje. Úsalo para la excepción, no para la regla: el villano que solo
aparece en la lista después del capítulo tres.

La lista está virtualizada, así que un reparto de mil personajes se abre al instante.

## El perfil

El perfil es el centro por personaje: un encabezado con su retrato y nombre, y una **barra de pestañas** debajo
que alterna entre secciones. La primera pestaña se muestra cuando se abre.

La barra de pestañas es **extensible**. Una pestaña no es más que un botón y un panel: añade un botón a la barra, añade un
panel, y añade el par a la lista de pestañas del perfil en el prefab. El panel se reconstruye para el personaje
actual cuando se muestra, así que una sección propia — una galería, un gráfico de relaciones, una pantalla de regalos —
es un panel que escribes y registras, sin ningún cambio en el motor.

Las pestañas incluidas de fábrica son las tres de abajo.

## La pantalla de estadísticas

La pantalla de estadísticas muestra el retrato del personaje, su nombre, y una fila por campo.

**Qué campos aparecen** es una decisión tuya, campo por campo: solo se listan los marcados como **Show on stats**. Tanto
los campos universales del Character Variable Schema como los propios del personaje pueden marcarse, y un
personaje puede anular ese indicador para un campo universal — así `age` puede mostrarse para todos y
`suspicion` para nadie salvo el detective. Consulta
[Personajes](/es/docs/beasty-visual-novel/world/characters/#variables-de-personaje-estadísticas).

**Los campos editables** son los marcados como **Editable**. El jugador los cambia desde esta pantalla: botones `+` y
`-` para un número, un interruptor para una bandera. El tamaño del paso y el límite mín/máx provienen del campo.
Los campos que no son editables se muestran de solo lectura.

Dos extras, ambos controlados por personaje:

- **La línea de ubicación** muestra la sala en la que está el personaje ahora mismo, si su interruptor **Show current
  location** está activado y está en algún sitio. Se oculta cuando está ausente.
- **El botón de rutina** abre el calendario. Se oculta cuando el interruptor **Show routine** del personaje está
  desactivado.

## El calendario de rutina

El calendario es el horario del personaje, en una de dos vistas, que el jugador alterna:

- **Vista de día** — una fila por franja horaria, para hoy.
- **Vista de semana** — la semana entera: franjas horarias hacia abajo, días de la semana en horizontal.

La columna de hoy está teñida, y la franja horaria actual dentro de ella está teñida con más intensidad, así que el jugador puede ver
dónde está. Una casilla en la que el personaje no está en ningún sitio del mapa se lee como desconocida.

El calendario solo se rellena para un personaje cuyo interruptor **Show routine** esté activado. Es una vista de las
reglas de rutina que autoraste — consulta [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/) — no una segunda copia de ellas,
así que sigue el perfil activo del personaje y se actualiza cuando la historia lo cambia.

## El registro de misiones

El registro de misiones es la guía. Enumera las misiones **activas** del personaje: el título de cada misión, y luego
sus objetivos con la pista que escribiste para cada uno.

Activa la opción "show global quests" del registro y, cuando se abre sin ningún personaje seleccionado, enumera en su lugar
las misiones de la historia principal — las que no tienen propietario.

> **Nota**
> **Sin spoilers.** En una misión **Ordered**, solo se revela la pista del objetivo **actual**. Los
> objetivos que el jugador ya completó se muestran marcados; los que aún están por venir permanecen ocultos. Escribe
> cada pista como si el jugador la estuviera leyendo justo en el momento en que ese paso se convierte en su siguiente paso, porque eso
> es exactamente cuándo la leerá.

Un objetivo de recolectar y entregar recibe un botón **Deliver** en el registro, para que el jugador entregue los objetos a
este personaje desde ahí. Consulta [Misiones](/es/docs/beasty-visual-novel/world/quests/).

El registro está en vivo: un objetivo completado mientras el panel está abierto se marca a sí mismo delante del jugador.

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
