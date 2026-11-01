---
title: "Personajes"
description: "De qué se compone un personaje: identidad, sprites, estilos de interpretación, alias y estadísticas — todo lo que defines en un Character Definition."
---

Un personaje es un miembro del reparto: un nombre, un conjunto de sprites, una forma de hablar y un puñado de
números que la historia cambia. Esta página cubre todo lo que defines en un personaje. No cubre lo que
dicen — eso está en [Diálogo y escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/).

## Crear un personaje

Dos formas, el mismo resultado:

- `Create > Beasty VN > Characters > Character Definition` en la ventana Project.
- Abre `Tools > Beasty VN > Editor`, ve a la pestaña **Characters**, subpestaña **Cast**, y pulsa
  **+ New Character**. Esta es la forma que normalmente usarás, porque el personaje queda añadido al
  contexto compartido sin que tengas que hacerlo tú.

La pestaña Characters también está disponible por sí sola a través de
`Tools > Beasty VN > Content > Character Database`. Tiene cuatro subpestañas: **Cast** (identidad, alias,
expresiones, estilos de entrega, retratos), **Variables** (estadísticas), **Quests** y **Talk Menu**. La lista y el personaje seleccionado se mantienen uno al lado del otro a cualquier ancho de
ventana, con un divisor que puedes arrastrar; su ancho se recuerda.

![La pestaña Characters, subpestaña Cast, con un personaje seleccionado](/docs-images/beasty-visual-novel/vn-characters-cast.png)

## Identidad

![El bloque de identidad de un personaje: id, nombre visible, colores, categoría y etiquetas](/docs-images/beasty-visual-novel/vn-character-identity.png)

| Campo | Qué es |
|---|---|
| **Id** | El nombre estable que usa todo el motor (`maya`). Se rellena automáticamente a partir del nombre del asset como un slug en minúsculas, y es editable. |
| **Display name** | El nombre que lee el jugador. Texto plano, no se traduce. Puede contener `[tokens]`. |
| **Name color** | El color de acento de la placa de nombre. |
| **Text color** | El color por defecto del texto del cuerpo de este personaje. Un estilo de interpretación (más abajo) puede anularlo. |
| **Player can rename** | Si está activado, el jugador puede renombrar a este personaje en tiempo de ejecución, y su nombre se impone al tuyo. |
| **Category** | `Main` o `Secondary`. Agrupa el reparto en el editor. |
| **Tags** | Etiquetas libres (`feminine`, una facción, un capítulo). Agrupan y filtran la lista del reparto en el editor. Añádelas con **+ Tag**. |

Todo lo demás apunta al id: bloques, condiciones, misiones, rutinas. El display name es solo
presentación, y puede cambiar durante el juego. Si renombras el id, el editor propaga el cambio; consulta
[Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/).

> **Nota**
> El display name NO es traducible, a propósito. Es el nombre del personaje. Si tiene que variar según el
> idioma, pon un `[token]` en él y define el token por idioma, o usa el bloque
> **Character name** descrito más abajo.

## Expresiones y retratos

Dos conjuntos de sprites separados, porque son dos imágenes distintas.

![Las listas de expresiones y retratos, compartiendo sus claves](/docs-images/beasty-visual-novel/vn-character-expressions.png)

- Las **expressions** son los sprites de escenario — el cuerpo completo o busto que ve el jugador sobre el fondo. Añádelas
  con **+ Add expression**: primero pide un nombre —`happy`, `sad`, `angry`, lo que quieras; no hay una lista
  fija— y luego si la expresión es un **Single sprite** o **Layered**. Una expresión por capas se monta por
  partes en el Expression Composer; consulta [Expresiones por capas](/es/docs/beasty-visual-novel/world/layered-expressions/).
- Los **portraits** son los pequeños iconos de UI que se muestran junto al cuadro de diálogo. Añádelos con **+ Add portrait**.
  Usan las mismas claves que las expressions, así que una línea `sad` puede mostrar un icono de cabeza `sad`.

### La expresión por defecto

**La primera expresión de la lista es la expresión por defecto del personaje**, se llame como se llame, sea
Single o por capas. Su fila lleva la etiqueta *default*. Para elegir otra, usa el menú ⋮ de la fila: **Make
default**, **Move up**, **Move down**.

La expresión por defecto se usa siempre que no se nombra ninguna, o cuando la nombrada no existe: un bloque
**Show character** sin expresión, un bloque que nombra una expresión que falta, y los puntos del personaje en
el mundo libre. La cadena de reserva:

```text
expression asked for  ->  default expression (first in the list)
portrait asked for    ->  first portrait  ->  no portrait
```

El primer retrato sustituye a todas las expresiones que no tienen uno propio. Un personaje sin ningún retrato
habla sin él: el cuadro de diálogo oculta el panel del retrato.

### La ropa

**Wardrobe…**, bajo la lista de expresiones, abre el vestuario del personaje: la ropa que puede llevar encima
de las expresiones por capas. Consulta [Vestuario y conjuntos](/es/docs/beasty-visual-novel/world/wardrobe/).

## Estilos de interpretación

Un estilo de interpretación es cómo suena un personaje cuando está en un estado concreto. Añade uno con
**+ Add delivery style** y elige el estado al que se aplica.

![Un estilo de entrega con su fuente, color, multiplicador de tamaño y efecto de texto](/docs-images/beasty-visual-novel/vn-character-delivery.png)

Los estados integrados son **Normal**, **Whisper**, **Shout** y **Thinking**. Puedes escribir cualquier otra clave
que quieras y usarla como estado de interpretación en un bloque **Dialogue**; no hay nada especial en los
cuatro integrados.

Cada estilo define:

| Ajuste | Efecto |
|---|---|
| **Font** | La fuente TextMeshPro usada para este estado. Vacío = la fuente TMP por defecto. |
| **Override text color** + **Text color** | Fuerza un color de texto del cuerpo para este estado en lugar del color por defecto del personaje. |
| **Font size multiplier** | Multiplica el tamaño de fuente del cuerpo. `1` = sin cambios, `1.3` = gritando. |
| **Name prefix** / **Name suffix** | Decora la placa de nombre para este estado, p. ej. un sufijo de `" (pensando)"`. |
| **Text effect** | Una decoración animada sobre el texto del cuerpo: `None`, `Wave`, `Shake`, `Fade` o `Pulse`. |

Todo lo que dejes sin tocar cae en los valores por defecto del propio personaje. Un personaje que no define ningún estilo para
un estado habla con normalidad — nunca estás obligado a rellenar los cuatro.

## Alias: mostrar un nombre distinto

Un **alias** es otro nombre para el *mismo* personaje. Úsalo cuando el jugador aún no sabe con quién está
hablando.

![La lista de alias de un personaje](/docs-images/beasty-visual-novel/vn-character-aliases.png)

Añade alias con **+ Add alias** — son cadenas de texto planas ("El Desconocido", "La Voz"). Luego:

- **Solo para una línea:** en un bloque **Dialogue**, define su alias de nombre visible. La placa de nombre dice
  "El Desconocido" para esa línea y nada más cambia. El id, las variables y los sprites del personaje quedan
  intactos. En el guion de texto esto es `maya as "The Stranger" "..."`.
- **De forma permanente:** usa el bloque **Character name** (categoría de paleta **State**). Cambia el nombre
  mostrado a partir de ese punto, y el cambio se guarda y se rebobina como cualquier otro estado.

El bloque **Character name** toma el nuevo nombre de una de cuatro fuentes:

| Fuente | Úsala para |
|---|---|
| **Alias** | Promover uno de los alias del personaje para que sea su nombre a partir de ahora. |
| **Text** | Un nombre que escribes tú. Opcionalmente una clave de localización en lugar de texto plano. |
| **Variable** | El valor actual de una variable o token de diccionario — por ejemplo un nombre que escribió el jugador. |
| **Reset to base** | Descarta la anulación y vuelve al display name del asset. |

La revelación ("el desconocido era Maya todo este tiempo") es por tanto un solo bloque: **Character name** ->
Reset to base.

Para dejar que el jugador nombre a un personaje él mismo, usa el bloque **Ask -> character name** (categoría de paleta
**Input**). Muestra una pregunta y un campo de entrada, y guarda la respuesta como el nombre de ese personaje.

## Variables de personaje (estadísticas)

Una variable de personaje es un número o una bandera que lleva el personaje: `affection`, `met`, `trust`. Salen
de dos sitios, y un personaje tiene ambos:

![La sub-pestaña Variables: campos del esquema universal y los propios del personaje](/docs-images/beasty-visual-novel/vn-character-variables.png)

1. **El Character Variable Schema** — los campos que tiene **todo** personaje. Un asset por proyecto
   (`Create > Beasty VN > Characters > Character Variable Schema`). Declara `affection` ahí una vez y todo
   el reparto lo tiene. Edítalo en **Characters › Variables › Global**, bajo **+ Add universal field**.
2. **Los campos propios del personaje** — declarados en ese personaje concreto, en **Characters › Variables ›
   Per character › Own fields**. Úsalos para cosas que solo tiene este personaje.

**Characters › Variables** tiene dos pestañas. **Global** guarda lo que vale para todos los personajes: el
interruptor **Enable walkthrough** del proyecto, los campos universales y la visibilidad por defecto de la
lista de personajes. **Per character** muestra el reparto junto a las tres páginas del personaje
seleccionado: **Own fields**, **Global field defaults** (lo que este personaje sobrescribe de los campos
universales) y **Character list**. La división es solo visual: nada se guarda de otra forma. Los anchos de
las pestañas y del divisor se recuerdan.

Cada campo tiene:

| Campo | Qué hace |
|---|---|
| **Key** | El nombre del campo, sin corchetes: `affection`. |
| **Type** | Contador `Int`, valor `Float` o bandera `Bool`. |
| **Default value** | El valor inicial, antes de que nada lo fije. |
| **Show on stats** | Muestra este campo en la pantalla de estadísticas del personaje. Desactivado por defecto. |
| **Display name** | El nombre que lee el jugador para este campo: en la pantalla de estadísticas, en los avisos y en las pistas. Vacío = la clave. Se traduce en **Localization › Game UI**. Se muestra mientras esté marcada cualquiera de **Show on stats**, **Notify changes in gameplay** o **Show in walkthrough**. |
| **Notify changes in gameplay** | Muestra un [aviso de estadística](/es/docs/beasty-visual-novel/world/notifications-and-walkthrough/) cuando el valor cambia durante la partida. Desactivado por defecto. |
| **Show in walkthrough** | Da a este campo [pistas de la guía](/es/docs/beasty-visual-novel/world/notifications-and-walkthrough/#pistas-de-la-guía) automáticas en las opciones. Desactivado por defecto. |
| **Editable** | Deja que el jugador lo cambie desde la pantalla de estadísticas (+/- para números, un interruptor para booleanos). Desactivado = solo lectura. |
| **Clamp** + **Min** / **Max** | Mantiene el valor dentro de un rango cuando el jugador lo edita. |
| **Step** | Cuánto suma o resta cada pulsación de +/-. |

Todos los indicadores de presentación empiezan desactivados. Un campo nuevo es, antes que nada, estado del juego; mostrárselo al
jugador es una decisión que tomas a propósito.

### Anular el valor por defecto del esquema para un personaje

Todos empiezan con `affection = 0`, pero Maya empieza con 10 porque es tu hermana. No necesitas un
segundo campo para eso. En **Per character › Global field defaults**, anula el valor por defecto del campo
universal solo para este personaje. También puedes cambiar, solo para *este* personaje, si ese campo en
concreto se muestra en su pantalla de estadísticas, avisa de sus cambios y sale en la guía, sin tocar el
esquema.

Para cambiar una variable de personaje desde la historia está el bloque **Character variable** (categoría de paleta
**State**): elige el personaje, elige el campo, elige la operación. Para leerla en una condición:
`maya.affection > 5`. Ambas cosas se explican en
[Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/).

## El sprite FreeRoam

![El campo del sprite de mundo libre, con las marcas de mostrar ubicación y rutina](/docs-images/beasty-visual-novel/vn-character-freeroam-sprite.png)

El campo **Free Roam Sprite** contiene el sprite que se usa cuando el personaje está de pie en una sala,
colocado ahí por su rutina. Si lo dejas vacío, se usa la expresión por defecto del personaje; si esa expresión es por capas, la sala
muestra su aspecto por capas. Dónde se para y qué tamaño tiene lo decide
el prefab de la sala, no este campo — consulta [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).

Dos interruptores relacionados controlan qué puede ver el jugador sobre el paradero del personaje:

- **Show current location** — muestra la sala en la que está el personaje ahora mismo en su pantalla de estadísticas.
- **Show routine** — permite abrir el calendario de rutina de este personaje.

## Aparecer en la lista de reparto

La lista de reparto dentro del juego es una pantalla superpuesta que enumera a los personajes que el jugador ha conocido. Dos ajustes deciden
quién está en ella:

- **Listed** — desactivado significa que este personaje nunca aparece listado, diga lo que diga cualquier condición. Úsalo para un
  personaje que el jugador nunca debe poder consultar.
- **Shown when** — una condición. Por defecto, todo personaje usa una condición *compartida*, escrita una vez con
  el marcador `@self`: una condición de `@self.met == true` revela a cada personaje en cuanto se activa su
  propia bandera `met`. Activa la anulación por personaje para darle a uno una condición propia
  — por ejemplo, un villano clave para la historia que aparece solo después del capítulo 3.

Una condición vacía significa "siempre mostrado". `@self` se explica en
[Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/#condiciones-compartidas-y-self), y las propias pantallas
en [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/).

## El menú de conversación

Cada personaje tiene un menú de conversación: la lista de cosas que el jugador puede decirle ahora mismo. Se edita en
la subpestaña **Characters > Talk Menu**, y los pasos de misión que apuntan a este personaje se añaden a él
automáticamente, y el menú termina con la opción **Irse**. Consulta [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/).

## Ver también

- [Expresiones por capas](/es/docs/beasty-visual-novel/world/layered-expressions/) — expresiones montadas por capas, y el Expression Composer
- [Vestuario y conjuntos](/es/docs/beasty-visual-novel/world/wardrobe/) — ropa que la historia puede cambiar
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — el almacén en el que vive cada variable de personaje
- [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) — la lista de reparto, el perfil, la pantalla de estadísticas
- [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/) — el centro de conversación de cada personaje
- [Diálogo y escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/) — poner a un personaje en escena y hacerlo hablar
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — todos los bloques, por categoría
