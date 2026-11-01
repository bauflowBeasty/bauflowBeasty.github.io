---
title: "Vestuario y conjuntos"
description: "Viste a los personajes con ropa que la historia puede cambiar: categorías y prendas, conjuntos, los bloques Wear piece y Change outfit, y condiciones @wear."
---

El vestuario es la ropa que un personaje puede llevar encima de sus
[expresiones por capas](/es/docs/beasty-visual-novel/world/layered-expressions/): camisetas, sombreros,
gafas, pendientes. La historia pone y quita prendas, o cambia un conjunto entero de una vez, y lo que lleva
el personaje se guarda con la partida como cualquier otra variable.

Cada personaje tiene su propio vestuario. Ábrelo con **Characters › Cast › Wardrobe…**, que abre el
[Expression Composer](/es/docs/beasty-visual-novel/world/layered-expressions/#el-expression-composer) en su
pestaña **Wardrobe**.

![La pestaña Wardrobe del Expression Composer: las categorías con sus prendas a la izquierda y el personaje vestido en el lienzo](/docs-images/beasty-visual-novel/vn-wardrobe-tab.png)

## Categorías y prendas

Un vestuario se compone de **categorías** —`top`, `hat`, `glasses`, el nombre que quieras—. Añade una con
**+ Category**. Cada categoría guarda **prendas**: la ropa de verdad.

Una categoría funciona en uno de dos modos:

| Modo | Cómo se comporta | Sus ajustes |
|---|---|---|
| **One at a time** | Ponerse una prenda quita la anterior. Una camiseta, unos zapatos. | **Can be empty** — si la categoría puede quedarse vacía. **Default piece** — lo que se ve mientras la historia no dice nada. |
| **Several at once** | Cada prenda se pone y se quita por su cuenta. Pendientes, una bufanda, una chapa. | **Worn by default**, marcado en cada prenda que empieza puesta. |

Una prenda puede tener varias partes —una chaqueta con delantero y manga, por ejemplo—, cada una con su
propio sitio en el orden de dibujo.

**Mover una prenda** a otra categoría se hace con su desplegable **Category**, y solo a una categoría del
mismo modo. Los bloques, condiciones y guiones que nombran la prenda la siguen. Las entradas de conjuntos y
los ajustes *Always wear* que la usaban en su categoría anterior se eliminan; la confirmación dice cuántos, y
avisa si las dos categorías tienen posiciones por defecto distintas.

### Posición por defecto

Una categoría puede tener una **Default position** opcional. Sus prendas aparecen entonces ahí, medida desde
aquello a lo que va enganchada cada prenda, y la posición propia de una prenda pasa a ser un ajuste fino a
partir de ella. Al activarla pregunta si mover las prendas allí o dejarlas donde se dibujan ahora. El botón
de la cruz coloca la posición en el lienzo.

### Editar las prendas

En la pestaña **Wardrobe** editas las prendas en sí, sobre una expresión de referencia, bajo *"Changes apply
to every expression that wears this piece (N)"*.

Para ajustar una prenda **solo en una expresión**, ve a la pestaña **Expression** y arrastra ahí la prenda
puesta. El inspector dice *"Adjusted in this expression only"* y ofrece **Reset adjustment**.

La ropa se ordena por expresión en el árbol de capas, igual que las capas. Arrástrala, agrúpala (Ctrl+G),
usa Bring forward / Send backward o la profundidad manual, sea una categoría entera o una sola parte de una
prenda. Soltada dentro de un grupo, se mueve con él (*Moves with* en el inspector). *Use default place* lo
deshace. El **Default place** de una parte es dónde se dibuja en las expresiones en las que no se movió.

## Conjuntos

Un **conjunto** (outfit) es una selección con nombre: `school`, `party`, `pajamas`. Solo cambia las
categorías que nombra; el resto se queda como está.

- **+ Outfit** crea uno vacío. **+ Add category** dentro del conjunto le añade una categoría; el botón ×
  quita una.
- En una categoría *Several at once*, un conjunto fija exactamente qué prendas van puestas.
- El botón del **ojo** previsualiza el conjunto en el lienzo sin guardarlo. El cartel del lienzo dice
  *"Previewing: <outfit>"*; Esc lo detiene.
- El botón del **lápiz** edita el conjunto vistiendo al personaje: haz clic en una prenda de la lista del
  vestuario para añadirla o cambiarla. El cartel dice *"Editing outfit '<outfit>'"*, y **Done** termina.
- **Save look** guarda lo que muestra el lienzo como un conjunto nuevo, y pregunta qué categorías incluir.

Una entrada de conjunto que nombra una prenda que ya no existe se ve como *(missing: <id>)*; una vacía, como
*(none)*. Borrar un conjunto dice qué expresiones lo llevan por defecto y qué bloques lo ponen. Esas
expresiones vuelven al valor por defecto de cada categoría, en un solo paso de Ctrl+Z.

![Un conjunto en edición: el cartel en el lienzo y las categorías del conjunto en la lista](/docs-images/beasty-visual-novel/vn-wardrobe-outfit-edit.png)

## Qué lleva puesto un personaje

Cuando el juego dibuja un personaje, cada categoría toma la primera respuesta de esta lista:

1. las prendas *Always wear* de la expresión;
2. lo que le puso la historia;
3. el **Default outfit** de la expresión, que se fija en la
   [ficha de la expresión](/es/docs/beasty-visual-novel/world/layered-expressions/#la-ficha-de-la-expresión);
4. el valor por defecto de la categoría.

El **Default outfit** evita que un personaje aparezca desvestido en una expresión antes de que la historia lo
haya vestido. Para que una prenda se vea siempre en una expresión, arrástrala al lienzo y elige **Always wear
this in this expression** en su menú contextual.

## Cambiar la ropa desde la historia

Tres bloques cambian la ropa, todos en la categoría **Scene** de la paleta:

| Bloque | Qué hace |
|---|---|
| **Wear piece** | Elige primero la **Category**; después **Put on** o **Take off** y la prenda. En una categoría *Several at once* la prenda es obligatoria. |
| **Change outfit** | Pone un conjunto. Su editor muestra una miniatura del personaje con ese conjunto y un resumen de lo que cambia. |
| **Show character** con un **Outfit** | Muestra al personaje y le pone el conjunto, en la misma línea. |

Si un personaje aún no tiene categorías (Wear piece) o conjuntos (Change outfit), el editor del bloque muestra
un botón **Open wardrobe…**.

**El cambio se ve en su propia línea.** Si esa línea tiene una [transición](/es/docs/beasty-visual-novel/authoring/screen-effects/),
el cambio ocurre dentro de ella: un `with dissolve` antes de la línea funde la ropa nueva. Los cambios hechos
desde código, desde el mundo libre o al cargar una partida actualizan a los personajes que ya están en escena.

En un [guion `.vnbeasty`](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/#vestuario):

```text
wear mia top hoodie
wear mia earrings hoops off
wear mia hat none
outfit mia party
show mia happy outfit party
```

`none` vacía una categoría *One at a time*; el autocompletado solo lo ofrece en una categoría que puede
quedarse vacía.

### Una categoría que no puede quedarse vacía conserva su prenda

Vaciar una categoría *One at a time* que tiene **Can be empty** desactivado se ignora con un aviso, y la
escena sigue mostrando esa prenda, también en esa misma línea. Vale para un Wear piece que quita, para
`wear <char> <category> none` y para una entrada de conjunto sin prenda. Los mensajes son:

- *"Category '<category>' of '<char>' cannot be left empty; it keeps its piece."*
- *"Outfit '<outfit>' of '<char>' empties a category that cannot be left empty; it keeps its piece."*

Un conjunto aplica todas las entradas que puede. Su aviso nombra la primera que no pudo aplicar.

## Condiciones sobre la ropa

Lo que lleva un personaje es una variable de personaje, así que las condiciones pueden leerlo. El selector
de condiciones ofrece:

- un valor por cada categoría *One at a time*: `@char:mia:@wear.top`;
- un sí/no por cada prenda de una categoría *Several at once*: `@char:mia:@wear.earrings.hoops`.

Estas condiciones responden a lo que el personaje lleva **de verdad**. Mientras la historia no ha cambiado una
categoría, `@wear.<category>` lee su prenda por defecto, y `@wear.<category>.<piece>` si la prenda va puesta
por defecto. El **Default outfit** de una expresión no cuenta aquí: es cómo se dibuja una expresión, y una
condición no mira expresiones.

## Partidas, rebobinado y mundo libre

Como la ropa son variables, se guarda con la partida y sigue al rebobinado y a la vuelta atrás entre la
novela, el mundo libre y las salas. Las partidas guardadas antes de que existiera el vestuario cargan bien:
cada categoría empieza en su valor por defecto.

La [vista previa de diálogo](/es/docs/beasty-visual-novel/authoring/dialogue-preview/) hereda la ropa puesta
en los nodos anteriores, y **▶ Play effects** parte de la ropa que había antes del cambio, para que se vea el
cambio en sí.

**Una pieza que falta nunca rompe la escena.** Una categoría, prenda o conjunto desconocidos dibujan lo que
existe, vuelven al valor por defecto y dejan un aviso una sola vez.

## Ids y renombrados

Las categorías, prendas y conjuntos reciben ids generados a partir de su nombre, editables en el Composer
(el id gris bajo el nombre, con su botón ✎). Un renombrado actualiza todo lo que nombra el id, en un solo
paso de deshacer:

- dentro del personaje: conjuntos, valores por defecto de las categorías, ajustes y madres;
- en todo el proyecto: los bloques Wear piece, Change outfit y Show character, las claves
  `@char:<id>:@wear.<category>` y los valores de prenda que se comparan con ellas o se les asignan;
- los guiones `.vnbeasty` vinculados.

`none` está reservado para las prendas. Las partidas guardadas antes de renombrar una categoría o una prenda
siguen nombrando el id antiguo; ahí, la categoría muestra su prenda por defecto.

## Qué comprueba el validador

**Tools > Beasty VN > Maintenance > Validate Selected Project** informa de:

- una prenda por defecto, entrada de conjunto, *Default outfit*, prenda *Always wear* o ajuste que nombra una
  categoría, prenda o conjunto que no existe;
- una categoría *One at a time* que no puede quedarse vacía y no tiene prenda por defecto;
- un conjunto que nombra una sola prenda para una categoría *Several at once*, o varias para una *One at a
  time*;
- bloques Wear piece, Change outfit y Show character con ids desconocidos, sin personaje, o sin prenda en una
  categoría *Several at once*;
- un *Take off* que se quedó sin prenda después de que su categoría pasara a *Several at once*, o un *Take
  off* que nombra una prenda de una categoría *One at a time* que no puede quedarse vacía. Estos se ven
  también en la insignia del nodo.

## Desde código

`BeastyWardrobe` cambia y lee la ropa en tiempo de ejecución: `Wear`, `Remove`, `TakeOff`, `SetOutfit`,
`GetWorn`, `IsWorn` y `ResetToDefaults`. Consulta [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/#vestuario).

## Ver también

- [Expresiones por capas](/es/docs/beasty-visual-novel/world/layered-expressions/) — las capas sobre las que
  va la ropa, y el Expression Composer.
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/#scene) — Wear piece,
  Change outfit y Show character.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — condiciones sobre
  las claves `@wear`.
- [Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/) — el formato de las claves
  `@wear`.
- [House Demo](/es/docs/beasty-visual-novel/getting-started/house-demo/) — *Party night* viste a Mia según
  lo que elige el jugador.
