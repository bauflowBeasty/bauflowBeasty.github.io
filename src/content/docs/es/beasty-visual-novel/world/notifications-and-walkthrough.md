---
title: "Avisos de estadísticas y pistas de la guía"
description: "Avisa al jugador cuando una estadística cambia y muestra en cada opción qué hará con sus estadísticas: los dos interruptores, qué se ve y cómo controlarlo."
---

Dos funciones le cuentan al jugador cómo caen sus decisiones. Un **aviso de estadística** es una cajita que
aparece cuando una estadística cambia: `Mia: Friendship+`. Una **pista de la guía** (walkthrough hint) es una
marca breve tras el texto de una opción que dice qué hará esa opción, antes de que el jugador la elija. Las
dos están apagadas hasta que las enciendes, así que un proyecto que no las quiere no muestra nada nuevo.

## Avisos de estadísticas

![Dos avisos de estadísticas apilados en una esquina del juego: un Friendship+ verde y un Trust- rojo](/docs-images/beasty-visual-novel/vn-stat-notification.png)

Cuando una estadística cambia durante la partida, aparece una caja con una línea:

- un número que sube muestra `Mia: Friendship+` en verde; uno que baja, `Mia: Friendship-` en rojo;
- una estadística de sí/no muestra un icono de encendido o apagado;
- una estadística de texto muestra un icono de «cambiado».

Nunca se muestran cantidades. Como mucho se ven cuatro cajas a la vez —una quinta termina la más antigua— y
cada una aparece fundiéndose y dura 1,8 segundos. Con **Reducir destellos y movimiento** activado solo se
funden, sin subir.

### Encenderlos

Cada campo de personaje tiene la casilla **Notify changes in gameplay**, en **Characters › Variables**.
Márcala en el esquema para encenderla en todos los personajes, y sobrescríbela por personaje donde haga
falta. Viene desactivada.

Las variables globales también pueden avisar. Marca **Notify changes in gameplay** en una variable de la
pestaña **Variables**, y sus cambios aparecen en la misma caja como `<etiqueta><marca>`, sin nombre de
personaje.

### Cuándo salta un aviso

- Con cualquier cambio real del valor, recompensas de misiones incluidas.
- **Nunca** al rebobinar ni al cargar una partida.
- Poner una estadística al valor que ya tenía no es un cambio.
- Volver a elegir la misma decisión tras rebobinar avisa otra vez. Pasar dos veces por el mismo bloque de
  asignación dentro de un nodo, no.
- Los cambios que hace el jugador a mano en la pantalla de estadísticas del personaje —los botones +/−—
  nunca avisan.

## Pistas de la guía

![Un menú de opciones con pistas de la guía: Friendship+ tras una opción y Friendship- tras otra](/docs-images/beasty-visual-novel/vn-walkthrough-hints.png)

Una pista es una marca tras el texto de una opción: `Friendship+` o `Friendship-`, o un icono de
encendido, apagado o «cambiado» para las estadísticas de sí/no y de texto. Las pistas largas terminan en
"...". No llevan color ni muestran el nombre del personaje. Los menús de conversación nunca muestran pistas.

### Encenderlas

Las pistas de la guía necesitan dos interruptores:

1. **El tuyo** — **Enable walkthrough**, en **Characters › Variables › Global**. Es un ajuste del proyecto:
   mientras está apagado, las pistas no existen para el jugador.
2. **El del jugador** — con el tuyo encendido, el jugador tiene la opción **Pistas de la guía** en
   Preferencias. Viene desactivada, y está oculta mientras tu interruptor esté apagado. **Restablecer**
   la vuelve a apagar.

Para poner el mismo interruptor en cualquier otro sitio de tu UI, añade el componente `VNWalkthroughToggle` a
un toggle. Un botón de pantalla también puede cambiarlo, a través de la preferencia `@pref:walkthrough`:
consulta [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/#cambiar-las-preferencias-del-jugador).

### Qué campos tienen pistas

Cada campo de personaje tiene la casilla **Show in walkthrough**, junto a **Notify changes in gameplay**: en
el esquema como valor por defecto y sobrescrita por personaje. Las variables globales también la tienen. Solo
los campos con ella marcada reciben pistas automáticas.

Las pistas se calculan a partir de los efectos de la propia opción más los bloques de asignación del nodo al
que lleva, hasta el primer bloque de salida de ese nodo. No las escribes tú: siguen a la historia según la
editas.

### Controlar las pistas de una opción

En el inspector de Story, cada opción tiene una sección **Walkthrough**:

- un interruptor de **ojo** por cada pista automática, para ocultarla;
- una lista de **pistas manuales**. Una pista manual puede usar cualquier campo de personaje o variable
  global, aunque no tenga **Show in walkthrough**, y gana a la pista automática del mismo campo;
- mientras el interruptor del proyecto esté apagado, una nota con un botón que abre **Characters ›
  Variables › Global**.

![La sección Walkthrough de una opción en el inspector de Story: una pista automática con su ojo y una pista manual](/docs-images/beasty-visual-novel/vn-walkthrough-choice-section.png)

Las filas de pistas manuales admiten Supr / Retroceso, Ctrl+D (duplicar), Ctrl+C / Ctrl+V, las flechas
arriba / abajo para mover una pista y Esc para limpiar la selección. Las mismas acciones están en el menú del
clic derecho, con sus atajos.

En un [guion `.vnbeasty`](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/#pistas-de-la-guía), una
opción admite grupos `hint(...)` y `hide(...)`:

```text
choice "Tell her the truth" hint(mia.trust up) hide(mia.friendship) -> truth
choice "I can keep a secret, you know." hint(mia.trusts_you on) -> mia_promise
choice "Lie" hint(likes_books on) -> lie
```

`hint` añade pistas manuales y `hide` oculta automáticas, cada uno con una lista separada por comas. Las
marcas son `up`, `down`, `on`, `off` y `changed`; sin marca, `up`.

### Leer la elección del jugador

`@pref:walkthrough` se puede leer en condiciones; por ejemplo, para dar un consejo solo a quien usa las
pistas. Nunca se guarda, y la historia no puede cambiarlo.

## Etiquetas y traducción

Un aviso o una pista muestra el **Display name** del campo cuando lo tiene, y si no, su clave. Se escribe en
**Characters › Variables** (o en la variable, para las globales). El display name aparece en cuanto está
marcada cualquiera de **Show on stats**, **Notify changes in gameplay** o **Show in walkthrough**.

Los display names se traducen en **Localization › Game UI**, y sus traducciones siguen a la variable si la
renombras. Consulta [Localización](/es/docs/beasty-visual-novel/production/localization/#la-pestaña-game-ui).

## En la vista previa del editor

La [vista previa de diálogo](/es/docs/beasty-visual-novel/authoring/dialogue-preview/) muestra los avisos, y
**▶ Play effects** los repite. Muestra las pistas en las opciones siempre que el interruptor del proyecto
esté encendido. Un canvas propio sin el contenedor de avisos no muestra nada.

## Desde código

`VN.Walkthrough` lee y cambia el interruptor del jugador, y `VN.OnWalkthroughChanged` salta cada vez que
cambia su valor efectivo, sea cual sea la causa. La API completa —incluido cómo debe tratar una vista de
avisos propia a las variables globales— está en [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/#avisos-de-estadísticas-y-pistas-de-la-guía).

## Ver también

- [Personajes](/es/docs/beasty-visual-novel/world/characters/#variables-de-personaje-estadísticas) — los
  campos de personaje y sus casillas.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — las variables
  globales.
- [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) — las opciones en
  las que aparecen las pistas.
- [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/) — botones que cambian preferencias.
- [House Demo](/es/docs/beasty-visual-novel/getting-started/house-demo/) — las primeras palabras de Mia usan
  las dos funciones.
