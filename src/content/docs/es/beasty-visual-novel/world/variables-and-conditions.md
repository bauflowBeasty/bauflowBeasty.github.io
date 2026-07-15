---
title: "Variables y condiciones"
description: "Todo lo que tu juego recuerda es una variable. Todo lo que tu juego decide es una condición. Esta página es la base del resto de la sección World: misiones, objetos, tiempo, rutinas y pantallas se construyen sobre estas dos ideas."
---

Todo lo que tu juego recuerda es una variable. Todo lo que tu juego decide es una condición. Esta página es
la base del resto de la sección World: misiones, objetos, tiempo, rutinas y pantallas están construidos sobre
las dos ideas de abajo, y en cuanto entiendes el almacén, los entiendes todos.

## Crear una variable

Abre `Tools > Beasty VN > Editor`, ve a la pestaña **Variables** y pulsa **+ New Variable**.

Una variable tiene:

| Campo | Qué es |
|---|---|
| **Key** | Su nombre, escrito sin corchetes: `gold`. En el diálogo lo escribes como `[gold]`. |
| **Value type** | `String`, `Int`, `Float` o `Bool`. |
| **Kind** | Cómo se produce el valor. Ver más abajo. |
| **Default value** | El valor antes de que nada lo fije. |
| **Prompt at runtime** | Pregunta al jugador por este valor cuando empieza el juego. |

Los cuatro **kinds** describen de dónde viene un valor. Son una etiqueta para ti y tu equipo, y
cambian lo que te ofrece el editor:

| Kind | Significado |
|---|---|
| **PlayerInput** | El jugador lo nombra (el título de su héroe, el nombre de su nave). |
| **Fixed** | Una constante que fijas tú y el juego no cambia. |
| **Enum** | Uno de una lista fija de valores permitidos que escribes tú. Una variable Enum siempre se guarda como `String`. |
| **Computed** | La calcula la lógica del juego — la escribe la historia; tú nunca la fijas a mano. |

### Preguntar al jugador

Dos formas de dejar que el jugador rellene una variable:

- Activa **Prompt at runtime** en la propia variable, y dale una etiqueta de pregunta. Se le pregunta al jugador
  por ella al principio.
- Usa el bloque **Ask -> variable** (categoría de paleta **Input**) en cualquier parte de la historia. Es una
  parada autocontenida: muestra una línea de pregunta — con un hablante opcional, como cualquier línea de
  diálogo — y abre el cuadro de entrada en ese mismo momento. Tiene un **valor por defecto** que se usa si el
  jugador deja el cuadro en blanco, y un indicador **required** que, en vez de eso, rechaza la respuesta en blanco.

Hay dos bloques hermanos, **Ask -> dictionary** y **Ask -> character name**, que hacen lo mismo
para un [token de diccionario](/es/docs/beasty-visual-novel/world/dictionary/) y para el
[nombre mostrado de un personaje](/es/docs/beasty-visual-novel/world/characters/#alias-mostrar-un-nombre-distinto).

## Cambiar una variable

El bloque **Set variable** (categoría de paleta **State**) es todo lo que hay. Elige una variable, elige una
operación, escribe un valor:

| Operación | Qué hace |
|---|---|
| **Assign** | La variable pasa a ser el valor. |
| **Add** | Numérico. `gold + 10`. |
| **Subtract** | Numérico. `gold - 10`. |
| **Toggle** | Invierte un `Bool`. El campo de valor se ignora. |

Add y Subtract trabajan con números enteros cuando ambos lados son enteros, y con decimales en cuanto alguno de
los dos lados tiene una parte fraccionaria. Una variable que contiene algo que no es un número cuenta como `0`
para estas dos.

Para cambiar un valor en un personaje — `maya.affection`, `juan.met` — usa mejor el bloque **Character
variable**. Son los mismos tres campos más el personaje. Existe como bloque aparte solo para que el editor pueda
ofrecerte los campos de ese personaje entre los que elegir.

El mismo cambio está disponible fuera de un bloque, como un **efecto**. Consulta [Efectos](#efectos) más abajo.

## El almacén

Esta es la parte que hace que el resto del paquete tenga sentido.

**Hay un único almacén plano de clave/valor, y todo está en él.** Tus variables, las estadísticas de tu personaje,
el reloj del juego, dónde está cada personaje ahora mismo, el estado de cada misión, cada objeto que lleva el jugador, y
cada token de diccionario — un solo almacén, una sola lista de claves y valores. Los subsistemas no guardan cada uno sus
propios datos privados. Escriben en el mismo lugar donde vive tu variable `gold`.

| Qué | La clave bajo la que vive |
|---|---|
| Tus variables | `gold` — la clave, sin prefijo |
| Variables de personaje | `@char:<id>:<field>` |
| Estado de rutina del personaje | `@char:<id>:@routineLocation`, `@char:<id>:@routineSpot`, `@char:<id>:@routineMode` |
| Tiempo de juego | `@time:daypart`, `@time:hour`, `@time:day`, `@time:weekday`, `@time:season` |
| Misiones | `@quest:<id>:@state`, `@quest:<id>:@stage`, `@quest:<id>:@period`, `@quest:<id>:@rewarded`, `@quest:<id>:@penalized`, `@quest:<id>:@lastResult`, y `@quest:<id>:<objectiveId>` por objetivo |
| Inventario | `item.<id>` (cuántos se tienen), `inventory.order` (el orden de ranuras) |
| Diccionario | la propia clave del token |

De aquí se desprenden tres cosas, y son la razón por la que el paquete está construido así:

1. **Cualquier condición puede leer cualquiera de ellas.** "Es martes por la tarde, Maya está en la panadería, el
   jugador tiene tres monedas y ha terminado el capítulo uno" es una sola condición con cuatro cláusulas, no cuatro
   sistemas distintos hablando entre sí. Nunca escribes código de conexión para hacerle una pregunta al sistema de tiempo.
2. **Todo se guarda, y tú no haces nada.** Una partida guardada escribe el almacén. Añade una misión, añade un objeto,
   avanza el reloj — ya está en cada archivo de guardado, sin trabajo extra y sin nada que recordar.
3. **El rebobinado funciona sobre todo ello.** El jugador que retrocede tres líneas retrocede el oro que gastó, la
   misión que empezó y la hora que pasó, porque las tres cosas son del mismo tipo.

Normalmente no escribirás estas claves a mano. El selector de condiciones y los selectores de bloques te las muestran, y
las muestran con etiquetas amigables: `time.daypart`, `time.hour`, `maya.location`, `maya.spot`,
`maya.routineMode`, `maya.affection`. La lista completa está en
[Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/).

> **Nota**
> Los espacios de nombres reservados empiezan todos con `@` o contienen un `.`, algo que una clave de variable que tú
> escribas no puede producir. Tu `gold` nunca puede chocar con el del motor.

## Condiciones

Una condición es una lista de **cláusulas**. Una cláusula tiene tres partes: un **token** (cualquier clave del
almacén), un **operador** y un **valor**.

### Dónde puedes adjuntar una

| Adjunta a | Qué decide |
|---|---|
| Una opción de elección | Si se le ofrece al jugador |
| Una rama de decisión | Si la historia toma esa ruta |
| Una entrada del menú de conversación | Si el jugador puede decir eso |
| El fondo condicional de una sala | Qué fondo muestra la sala |
| El **Shown when** de un objeto de sala | Si el objeto está en pantalla |
| La excepción de acceso de una puerta | Si la puerta está abierta, y qué línea se reproduce cuando no lo está |
| La acción VN condicional de una puerta | A qué escena lleva la puerta |
| Una regla de rutina | Dónde está un personaje en este momento |
| **Start when** / **Fail when** de una misión, y **Complete when** de un objetivo | Si la misión empieza, falla, o ese objetivo está hecho |
| El **Use condition** de un objeto | Si el jugador puede usarlo aquí |
| Una pantalla, y un elemento de pantalla | Si se muestra el botón del HUD o la superposición, y qué icono y etiqueta usa |
| La visibilidad en la lista de reparto de un personaje | Si el jugador lo ve en la lista de reparto |

En todas partes, el mismo editor y el mismo evaluador. Apréndelo una vez.

### Operadores

| Operador | Significado |
|---|---|
| `Equals` | El valor coincide |
| `NotEquals` | El valor no coincide |
| `Greater` | Numérico `>` |
| `Less` | Numérico `<` |
| `GreaterOrEqual` | Numérico `>=` |
| `LessOrEqual` | Numérico `<=` |
| `Contains` | El texto contiene el valor |

### Y, O, y precedencia

Cada cláusula después de la primera lleva una unión: **And** u **Or**.

**AND liga más fuerte que OR.** Una condición escrita como

```text
a  AND  b  OR  c
```

significa `(a AND b) OR c`, no `a AND (b OR c)`. Es la precedencia booleana de toda la vida, y la fuente más
común de condiciones que "no funcionan". Si quieres la otra agrupación, reordena las cláusulas o divide la
lógica entre dos ramas de un nodo de decisión.

### Las dos reglas que engañan a todo el mundo

> **Advertencia**
> **Una condición vacía siempre es verdadera.** Sin cláusulas significa "sin condición", y eso significa "sí". Una
> elección con una condición vacía siempre se ofrece; una puerta con una excepción de acceso vacía siempre está
> abierta. Es lo que quieres casi siempre — por eso puedes dejar el campo de condición en paz y todo se muestra
> sin más — pero significa que no puedes ocultar algo dejando la condición en blanco.

> **Advertencia**
> **Una cláusula sin token está incompleta, y se evalúa como falsa.** Si añades una cláusula y olvidas elegir
> una variable, todo el conjunto falla del lado seguro: la elección nunca aparece, la puerta nunca se abre. Falla
> así a propósito — si una condición a medio escribir pasara, desbloquearía en silencio todo el contenido que
> protege. El motor lo reporta una vez en la Console, nombrando la cláusula, para que puedas encontrarla.

## Efectos

Un **efecto** es el mismo cambio que hace un bloque **Set variable**, aplicado en un momento en el que un bloque
no puede ejecutarse. Tiene los mismos tres campos — una clave, una operación (Assign / Add / Subtract / Toggle),
un valor — y se comporta de forma idéntica.

Los efectos se adjuntan a:

- **Una opción de elección.** Se aplica cuando el jugador la elige.
- **Una rama de decisión.** Se aplica cuando se toma la rama.
- **Un nodo Return.** Se aplica cuando un subgrafo devuelve su resultado.
- **Una misión.** Sus efectos de recompensa al completarse, sus efectos de penalización al fallar.
- **Un objeto.** Sus efectos de uso, aplicados cuando se usa el objeto.
- **Un elemento de pantalla.** Sus efectos de clic, aplicados cuando el jugador clica ese botón del HUD.

Así que "elegir esta opción cuesta 10 de oro y hace que le gustes menos a Maya" son dos efectos en la elección, y
ningún bloque de por medio. Consulta [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/).

## Condiciones compartidas y @self

`@self` es un marcador que representa "el personaje para el que se está evaluando esto, sea cual sea". Se usa
cuando una condición se aplica a todo el reparto, personaje por personaje — el caso principal es la condición de
visibilidad compartida de la lista de reparto. Escribe la condición una vez contra `@self`, y cada personaje se
comprueba contra su propio campo:

```text
@self.met == true
```

Esa única línea revela a cada personaje en la lista de reparto en cuanto se activa su propia bandera `met`. Sin
`@self` escribirías la misma condición una vez por personaje. Consulta
[Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/).

## Para programadores

Puedes leer y escribir cada una de estas claves desde C#, y no tienes que escribir las cadenas de clave a mano.
`Tools > Beasty VN > Codegen` genera `VNVars` y `VNChars`: accesores tipados y verificados en tiempo de compilación
para las variables y personajes que existen en tu proyecto. Consulta
[Accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/), y
[API de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) para las fachadas de tiempo, rutina, misión e inventario.

## Ver también

- [Conceptos básicos](/es/docs/beasty-visual-novel/getting-started/core-concepts/) — proyecto, contexto, grafo, nodo, bloque
- [Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/) — cada espacio de nombres de clave reservado
- [Personajes](/es/docs/beasty-visual-novel/world/characters/) — variables de personaje y el esquema
- [El diccionario](/es/docs/beasty-visual-novel/world/dictionary/) — tokens de texto editables por el jugador
- [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) — dónde hacen la mayor parte de su trabajo las condiciones y los efectos
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — todos los bloques, por categoría
