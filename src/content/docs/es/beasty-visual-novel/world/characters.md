---
title: "Personajes"
description: "Un personaje es un miembro del reparto: un nombre, un conjunto de sprites, una forma de hablar, y un conjunto de números que la historia cambia. Esta página cubre todo lo que aut"
---

Un personaje es un miembro del reparto: un nombre, un conjunto de sprites, una forma de hablar, y un conjunto de
números que la historia cambia. Esta página cubre todo lo que autoras en un personaje. No cubre lo que
dicen — eso es [Diálogo y escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/).

## Crear un personaje

Dos formas, el mismo resultado:

- `Create > Beasty VN > Characters > Character Definition` en la ventana Project.
- Abre `Tools > Beasty VN > Editor`, ve a la pestaña **Characters**, subpestaña **Cast**, y pulsa
  **+ New Character**. Esta es la forma que normalmente usarás, porque el personaje se añade al
  contexto compartido por ti.

La pestaña Characters también está disponible por sí sola a través de
`Tools > Beasty VN > Content > Character Database`. Tiene cuatro subpestañas: **Cast** (identidad, alias,
expresiones, estilos de interpretación, retratos), **Variables** (estadísticas), **Quests** y **Talk Menu**.

![La pestaña Characters, subpestaña Cast, con un personaje seleccionado](/docs-images/beasty-visual-novel/vn-characters-cast.png)

## Identidad

| Campo | Qué es |
|---|---|
| **Id** | El nombre estable que usa todo el motor (`maya`). Se rellena automáticamente a partir del nombre del asset como un slug en minúsculas, y es editable. |
| **Display name** | El nombre que lee el jugador. Texto plano, no se traduce. Puede contener `[tokens]`. |
| **Name color** | El color de acento de la placa de nombre. |
| **Text color** | El color por defecto del texto del cuerpo de este personaje. Un estilo de interpretación puede anularlo. |
| **Player can rename** | Si está activado, el jugador puede renombrar a este personaje en tiempo de ejecución, y su nombre se impone al tuyo. |
| **Category** | `Main` o `Secondary`. Agrupa el reparto en el editor. |
| **Tags** | Etiquetas libres (`feminine`, una facción, un capítulo). Agrupan y filtran la lista del reparto en el editor. Añádelas con **+ Tag**. |

El id es a lo que apunta todo lo demás: bloques, condiciones, misiones, rutinas. El display name es solo
presentación, y puede cambiar durante el juego. Renombra el id y el editor propaga el renombrado; consulta
[Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/).

> **Nota**
> El display name NO es traducible, a propósito. Es el nombre del personaje. Si tiene que variar según el
> idioma, pon un `[token]` en él y define el token por idioma, o usa el bloque
> **Character name** descrito más abajo.

## Expresiones y retratos

Dos conjuntos de sprites separados, porque son dos imágenes distintas.

- Las **expressions** son los sprites de escenario — el cuerpo completo o busto que ve el jugador sobre el fondo. Añádelas
  con **+ Add expression**. Cada una es una clave más un sprite: `base`, `sad`, `angry`, lo que quieras. No hay
  una lista fija.
- Los **portraits** son los pequeños iconos de UI que se muestran junto al cuadro de diálogo. Añádelos con **+ Add portrait**.
  Usan las mismas claves que las expressions, así que una línea `sad` puede mostrar un icono de cabeza `sad`.

`base` es la clave por defecto. Un bloque **Show character** sin clave de expresión, o un bloque **Expression**
que apunta a una clave que no has creado, sigue poniendo al personaje en escena, por la cadena de reserva:

```text
expression asked for  ->  base expression  ->  nothing
portrait asked for    ->  base portrait    ->  the stage sprite for that expression
```

Así que un personaje con solo sprites de escenario aun así consigue un retrato: el motor reutiliza el sprite de escenario. Un
personaje sin una expresión `base` no muestra nada, que es el único caso al que hay que estar atento.

## Estilos de interpretación

Un estilo de interpretación es cómo suena un personaje cuando está en un estado concreto. Añade uno con
**+ Add delivery style** y elige el estado al que se aplica.

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

Todo lo que dejes sin tocar recae en los valores por defecto propios del personaje. Un personaje que no define ningún estilo para
un estado simplemente habla con normalidad en él — nunca tienes que rellenar los cuatro.

## Alias: mostrar un nombre distinto

Un **alias** es otro nombre para el *mismo* personaje. Úsalo cuando el jugador aún no sabe con quién está
hablando.

Añade alias con **+ Add alias** — son solo cadenas de texto ("El Desconocido", "La Voz"). Luego:

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

Una variable de personaje es un número o una bandera que lleva el personaje: `affection`, `met`, `trust`. Provienen
de dos sitios, y un personaje tiene ambos:

1. **El Character Variable Schema** — los campos que tiene **todo** personaje. Un asset por proyecto
   (`Create > Beasty VN > Characters > Character Variable Schema`). Declara `affection` ahí una vez y todo
   el reparto lo tiene. Edítalo en la subpestaña **Characters > Variables**, bajo **+ Add universal field**.
2. **Los campos propios del personaje** — declarados en ese personaje concreto, en la misma subpestaña. Úsalos para
   cosas que solo tiene este personaje.

Cada campo tiene:

| Campo | Qué hace |
|---|---|
| **Key** | El nombre del campo, sin corchetes: `affection`. |
| **Type** | Contador `Int`, valor `Float` o bandera `Bool`. |
| **Default value** | El valor inicial, antes de que nada lo fije. |
| **Show on stats** | Muestra este campo en la pantalla de estadísticas del personaje. Desactivado por defecto. |
| **Editable** | Deja que el jugador lo cambie desde la pantalla de estadísticas (+/- para números, un interruptor para booleanos). Desactivado = solo lectura. |
| **Clamp** + **Min** / **Max** | Mantiene el valor dentro de un rango cuando el jugador lo edita. |
| **Step** | Cuánto suma o resta cada pulsación de +/-. |

Ambos indicadores de presentación empiezan desactivados. Un campo nuevo es primero estado del juego; ponerlo delante del
jugador es una decisión que tomas a propósito.

### Anular el valor por defecto del esquema para un personaje

Todos empiezan con `affection = 0`, pero Maya empieza con 10 porque es tu hermana. No necesitas un
segundo campo para eso. En la subpestaña **Variables** del personaje, anula el valor por defecto del campo universal
solo para este personaje. También puedes anular si ese campo en concreto se muestra en la pantalla de estadísticas de
*este* personaje, sin tocar el esquema.

Cambiar una variable de personaje desde la historia es el bloque **Character variable** (categoría de paleta
**State**): elige el personaje, elige el campo, elige la operación. Leer una en una condición es
`maya.affection > 5`. Ambas cosas se explican en
[Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/).

## El sprite FreeRoam

**FreeRoam sprite** es el sprite usado cuando el personaje está de pie en una sala, colocado ahí por su rutina.
Déjalo vacío y se usa en su lugar la expresión `base` del personaje. Dónde se para y cuán grande es lo decide
el prefab de la sala, no aquí — consulta [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).

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
  propia bandera `met`. Activa la anulación por personaje para darle a uno su propia condición
  en su lugar — un villano crucial para la historia que aparece solo después del capítulo 3, por ejemplo.

Una condición vacía significa "siempre mostrado". `@self` se explica en
[Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/#condiciones-compartidas-y-self), y las propias pantallas
en [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/).

## El menú de conversación

Cada personaje tiene un menú de conversación: la lista de cosas que el jugador puede decirle ahora mismo. Se autora en
la subpestaña **Characters > Talk Menu**, y los pasos de misión que apuntan a este personaje se añaden a él
automáticamente. Consulta [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/).

## Ver también

- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — el almacén en el que vive cada variable de personaje
- [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) — la lista de reparto, el perfil, la pantalla de estadísticas
- [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/) — el centro de conversación de cada personaje
- [Diálogo y escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/) — poner a un personaje en escena y hacerlo hablar
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — todos los bloques, por categoría
