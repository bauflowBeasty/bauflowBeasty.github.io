---
title: "Expresiones por capas"
description: "Monta las expresiones de un personaje por capas —una base más ojos, bocas, rubor— y edítalas en el Expression Composer, tal como las dibuja el juego."
---

Una expresión es el aspecto de un personaje en escena. Una expresión **Single** es una sola imagen terminada.
Una expresión **Layered** se monta por partes: un sprite base más todas las capas que quieras encima —ojos,
una boca, rubor, una mano levantada—. Así, diez expresiones pueden compartir un mismo cuerpo, y las capas son
lo que hace posible el [vestuario](/es/docs/beasty-visual-novel/world/wardrobe/).

Esta página es para quien monta los personajes. Las expresiones en sí, los retratos y la expresión por
defecto se explican en [Personajes](/es/docs/beasty-visual-novel/world/characters/#expresiones-y-retratos).

## Single o por capas

Cada expresión tiene un modo:

- **Single** — el de por defecto. Dibuja un sprite, igual que siempre. Los proyectos que ya tenías no
  cambian.
- **Layered** — un sprite base más partes en capas.

El modo es de cada expresión, así que un mismo personaje puede mezclar los dos. Cambiar una expresión de un
modo a otro y volver conserva los datos de ambos lados: pasa una expresión por capas a Single y de vuelta, y
sus capas siguen ahí.

## Crear una expresión por capas

En **Characters › Cast**, pulsa **+ Add expression**. Primero pide un nombre y luego el modo:

- **Single sprite** — una sola imagen terminada, que eliges directamente en la lista de Cast.
- **Layered (open Expression Composer)…** — crea la expresión y la abre en el Composer.

![Dos expresiones en la lista de Cast: una fila Single con su campo de sprite y una fila Layered con su miniatura](/docs-images/beasty-visual-novel/vn-cast-layered-row.png)

Una fila por capas muestra una miniatura, `Layered · N layers` y un botón **Edit in Composer…**. El menú ⋮ de
cada fila ofrece **Switch to Layered** —que propone el sprite actual como base si aún no hay ninguna— y
**Switch to Single sprite**.

## El Expression Composer

El Composer es el editor de las expresiones por capas y del vestuario. Ábrelo con **Edit in Composer…** o
**Wardrobe…** en Cast, o desde **Tools > Beasty VN > Expression Composer**. Dibuja el personaje exactamente
como lo hace el juego.

![El Expression Composer: vestuario y árbol de capas a la izquierda, el personaje en el lienzo, el inspector a la derecha](/docs-images/beasty-visual-novel/vn-expression-composer.png)

Tiene tres paneles que se redimensionan con divisores. Sus anchos se recuerdan.

- **Izquierda** — los conjuntos, las categorías del vestuario y el árbol de capas, cada uno en su caja.
  Arrastra arriba y abajo los divisores entre cajas; sus alturas también se recuerdan.
- **Lienzo** — el personaje, tal como lo dibuja el juego.
- **Inspector** — dos pestañas. **Expression** edita esta expresión: su base, sus propias capas y la ficha
  de la expresión. **Wardrobe** edita la ropa, explicada en [Vestuario y conjuntos](/es/docs/beasty-visual-novel/world/wardrobe/).

Un botón de papelera en el inspector borra la selección.

### Capas y partes

Cada parte de una capa tiene lo suyo:

| Ajuste | Qué hace |
|---|---|
| **Sprite** | La imagen de esta parte. |
| **Parent** | Otra parte a la que va enganchada, por id. Mover la madre mueve a la hija. |
| **Rotation**, **Scale** | Su propia rotación y escala. |
| **Pivot override** | Girar sobre un punto distinto del pivote del sprite. |
| **Flip X**, **Flip Y** | Reflejar la parte. |
| **Tint** | Un color que se multiplica sobre el sprite. |

**La lista de capas es el orden de dibujo**: una capa más arriba en la lista se dibuja delante. El orden no
depende de la jerarquía madre-hija, así que una hija puede quedar detrás de su madre: una mano detrás de la
cabeza a la que va enganchada.

Los **grupos** (**+ Group** o Ctrl+G) se pliegan en el árbol y mueven, giran y ocultan todo lo que llevan
dentro. Ctrl+Shift+G deshace el grupo. Un grupo no tiene sprite propio.

La **profundidad manual** es opcional. Actívala para escribir tú la profundidad; el número automático se ve
en gris al lado.

### Trabajar en el lienzo

| Gesto | Efecto |
|---|---|
| Clic | Selecciona la capa visible bajo el cursor. Los píxeles transparentes dejan pasar el clic. |
| Alt+clic | Recorre las capas apiladas bajo el cursor. |
| Mayús+clic | Añade a la selección. Los valores que difieren se ven como `—` en el inspector. |
| **V**, **R**, **P** | Herramientas de mover, girar y pivote. Con una capa seleccionada, el anillo siempre gira. |
| Mayús al arrastrar | Ajusta el giro a pasos de 15°, y el movimiento a la cuadrícula cuando **Snap** está activado. |
| Flechas | Mueven 1 px; con Mayús, 10 px. |
| Rueda / botón central del mouse | Zoom / desplazar la vista. |
| **Onion** | Dibuja debajo, en tenue, la expresión por defecto, para alinear las partes. |

### El árbol de capas

Arrastra una capa para reordenarla. Suéltala sobre un grupo u otra capa para meterla dentro; arrástrala
hacia abajo y a la izquierda para sacarla. Esc cancela el arrastre, y el árbol se desplaza solo cuando
arrastras cerca de sus bordes. Clic derecho en una capa muestra todas las acciones con su atajo.

### Arrastrar desde la ventana Project

- Los sprites que sueltas en el **lienzo** se convierten en capas. El primero puede hacer de base.
- Los sprites que sueltas en la cabecera de una **categoría del vestuario** se convierten en una prenda por
  sprite.
- Los sprites que sueltas en una **prenda** se convierten en sus partes.

### Atajos de teclado

Los atajos funcionan con el foco en cualquier panel: árbol, lienzo, lista o inspector. Un campo de texto que
estés editando conserva sus propias teclas.

| Atajo | Acción |
|---|---|
| Supr / Retroceso | Quitar la selección. En la lista del vestuario quita el conjunto, la prenda o la categoría seleccionados, tras la misma confirmación que su menú. |
| Ctrl+D | Duplicar. |
| Ctrl+A | Seleccionar todo. |
| Ctrl+G / Ctrl+Shift+G | Agrupar / desagrupar. |
| F2 | Renombrar. |
| Esc | Cancelar; si lo pulsas otra vez, limpia la selección. |
| F | Encuadrar la selección en el lienzo. |
| H | Ocultar una capa solo en el editor. El juego la sigue dibujando. |
| Ctrl+] / Ctrl+[ | Llevar una capa delante / detrás. |

En macOS, Cmd sustituye a Ctrl. **Todo se puede deshacer**: cada operación del Composer y de Cast es un
paso de Ctrl+Z / Ctrl+Y, y un arrastre o un giro con el mouse es un único paso.

## La ficha de la expresión

Sin nada seleccionado, la pestaña **Expression** muestra la expresión en sí:

| Campo | Qué hace |
|---|---|
| **Name** | Renombra la expresión, y todos los bloques y guiones que la nombran, en un paso de Ctrl+Z. Antes, una confirmación los cuenta. El mismo renombrado funciona desde Cast. |
| **Layered / Single sprite** | El modo. |
| **Default outfit** | Lo que lleva el personaje en esta expresión mientras la historia no ha tocado esa ropa. Consulta [Vestuario y conjuntos](/es/docs/beasty-visual-novel/world/wardrobe/#qué-lleva-puesto-un-personaje). |
| **Show wardrobe on this expression** | Si la ropa se dibuja o no en esta expresión. |
| **Hidden here** | Categorías del vestuario que esta expresión nunca muestra. |

## Ids

Las capas y las partes reciben un id generado a partir de su nombre. El id se ve en gris bajo el nombre; su
botón ✎ lo edita. Renombrar un id actualiza todo lo que lo nombra, en un solo paso de deshacer. Renombrar
una capa mueve los anclajes del vestuario que la nombran solo si ninguna otra expresión tiene todavía una
capa con ese id; la confirmación dice cuántos se quedan. `base` está reservado para capas y partes.

## En escena y en el mundo libre

- **En escena**, una expresión por capas se dibuja exactamente igual que en el Composer.
- **En el mundo libre**, un personaje sin **Free Roam Sprite** cuya expresión por defecto es por capas
  muestra su aspecto por capas. Hacer clic en cualquier parte activa al personaje, y al pasar el mouse se
  tiñen todas las partes. Un hover de tipo **Swap sprite** pasa a ser un tinte en los personajes por capas.
- Una **pose** colocada a mano en el prefab de una sala, sin sprite propio, muestra el aspecto por capas de
  su dueño: la expresión por defecto con la ropa que lleve en ese momento. Se puede hacer clic en cualquier
  parte y se tiñe al pasar el mouse. Un sprite propio, un sprite condicional que se cumple o una animación de
  reposo siguen teniendo prioridad. El inspector de la pose, en la sección FreeRoam, dice qué va a mostrar y
  ofrece **Edit look in Composer…**.

**Una pieza que falta nunca rompe la escena.** Una expresión por capas sin sprite base dibuja lo que existe y
deja un aviso una sola vez.

## Proyectos con streaming

Con el [streaming](/es/docs/beasty-visual-novel/production/streaming/) activado, una parte que tiene dirección
de streaming solo se carga cuando se muestra —nunca el vestuario entero— y se libera con el resto del arte
de la escena. Una parte que sale de la pantalla suelta su sprite.

Una expresión Single que cambia, y una parte por capas que sigue siendo la misma parte, mantienen su arte
actual hasta que carga el nuevo, así que no parpadean. Cambiar una expresión entre Single y Layered, o
sustituir una parte por otra distinta, puede no mostrar nada durante un instante mientras llega el arte
nuevo.

## Qué comprueba el validador

**Tools > Beasty VN > Maintenance > Validate Selected Project** informa de:

- una expresión por capas sin base;
- una madre que no existe, o madres que forman un bucle;
- un id vacío, repetido o reservado;
- un grupo que tiene sprite;
- partes que se dibujan junto a una capa que no tiene ninguna expresión.

Avisa cuando un personaje usa directamente más de 64 sprites distintos entre sus expresiones por capas y su
vestuario, y sugiere el contenido en streaming.

## Para programadores: cómo se monta un personaje en escena

Cada objeto `CharactersRoot/Character_N` del escenario es un `CharacterLookView` con un `SortingGroup` y un
hijo `Part_i/Sprite` por parte. Una expresión Single tiene exactamente uno, `Part_0/Sprite`. Voltear un
personaje refleja el `Character_N` entero con una escala X negativa.

Si un script tuyo accedía al `SpriteRenderer` de `Character_N`, búscalo ahora debajo
(`Character_N/Part_0/Sprite`). El código que leía `SpriteRenderer.flipX` debe leer el signo de
`localScale.x` de `Character_N`.

## Ver también

- [Vestuario y conjuntos](/es/docs/beasty-visual-novel/world/wardrobe/) — la ropa encima de las expresiones
  por capas.
- [Personajes](/es/docs/beasty-visual-novel/world/characters/) — expresiones, retratos y la expresión por
  defecto.
- [Diálogo y escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/) — mostrar un personaje y
  cambiar su expresión.
- [Streaming](/es/docs/beasty-visual-novel/production/streaming/) — cargar el arte solo cuando se muestra.
- [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/) — el validador y los
  renombrados de ids.
