---
title: "El guion de texto"
description: "Escribe una escena completa como texto plano en lugar de conectar nodos con clics. El formato .vnbeasty es un guion al estilo Ren'Py que se mantiene sincronizado con el grafo en ambos sentidos."
---

Escribe una escena completa como un archivo de texto plano en lugar de conectar nodos con clics. El formato
`.vnbeasty` es un guion al estilo Ren'Py que se mantiene sincronizado en ambos sentidos con el grafo de la
historia. Esta página es para quien prefiere escribir. Para la gramática exacta de cada línea, consulta la
[Referencia de sintaxis .vnbeasty](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/).

## Qué es

Un archivo `.vnbeasty` es una escena: una `DialogueScene` y su `StoryGraph` raíz. Cada `label` del archivo es
un nodo en el grafo, y `jump` conecta los nodos entre sí. Todo lo que puedes poner dentro de un nodo —una
línea de diálogo, un fondo, un personaje, una pista de música, un cambio de variable, una elección— tiene
una forma de texto en una línea.

![Un archivo .vnbeasty abierto en un editor de código](/docs-images/beasty-visual-novel/vn-vnbeasty-file.png)

```text
label intro:
    backdrop bedroom
    juan "Hello, how are you?"
    jump cruce
```

Ese es un nodo Dialogue llamado `intro` que contiene tres bloques: un bloque Backdrop, un bloque Dialogue, y
un cable hacia el nodo llamado `cruce`. El mismo nodo, dibujado en el grafo, es el mismo dato.

## Por qué lo usarías

- **Escribes a la velocidad a la que piensas.** Una página de diálogo es una página de escritura, no
  cincuenta clics en cincuenta campos.
- **Un escritor y un diseñador pueden trabajar a la vez.** El escritor edita el guion en su propio editor de
  texto; el diseñador sigue construyendo nodos en el grafo. Ambos lados son la misma escena, y las reglas de
  sincronización de más abajo dicen exactamente quién gana cuando entran en conflicto.
- **Diferencias de texto (diffs).** Un archivo de guion es legible en una revisión de código, en un diff de
  control de versiones, y en una búsqueda.

No tienes que quedarte con una de las dos. Las dos vistas son la misma escena, y puedes cambiar de una a
otra a mitad de capítulo.

## Activarlo

Abre `Tools > Beasty VN > Editor`, ve a la pestaña **Story**, y usa el interruptor **Graph / Text** en la
parte superior izquierda. La primera vez que abres **Text** para una escena que aún no tiene guion, la
pestaña ofrece un único botón:

- **Create script from graph**: escribe el grafo actual como un archivo `.vnbeasty`, lo enlaza a la escena y
  lo abre para editar. El archivo se guarda en una carpeta `Scripts` junto al asset de la escena, con el
  nombre de la escena.

Si el grafo contiene algo que el formato de texto no puede expresar, el botón te lo dirá en lugar de crear un
archivo a medias. Consulta [Los límites](#los-límites).

![La pestaña Story con el interruptor Graph / Text y el editor de guion](/docs-images/beasty-visual-novel/vn-text-tab.png)

## La pestaña Text

El editor es una superficie de código con números de línea, coloreado de sintaxis, y un panel
**Suggestions** a la derecha que completa lo que estás escribiendo: la palabra clave al inicio de una línea,
y luego lo que esa palabra clave espera —un id de personaje, una clave de expresión, una variable, un token
de diccionario, un ítem, una misión y sus objetivos, un id de pantalla, un perfil de rutina, un nombre de
momento del día o día de la semana, un nombre de asset de fondo o audio, o una de las etiquetas ya presentes
en el archivo. Las sugerencias se leen en vivo desde el proyecto, así que un personaje que añadiste hace un
minuto ya está ahí. Haz clic en una sugerencia para insertarla.

`Tab` inserta cuatro espacios. Las flechas mueven el cursor. `Ctrl+Z` y `Ctrl+Y` controlan la pila de
deshacer propia del editor.

La barra de herramientas:

| Botón | Qué hace |
|---|---|
| **Save & apply** | Aplica tu texto al grafo, y luego escribe el archivo. Esta es la única acción que mueve texto hacia el grafo. Se pone ámbar mientras tienes cambios sin guardar. |
| **Format** | Aplica tus cambios, y luego reescribe el archivo en forma canónica: ordenado, indentado, con las anotaciones de id de nodo actualizadas. |
| **Syntax** | Muestra u oculta una guía rápida de sintaxis junto al editor. |
| **Unlink** | Deja de usar el guion. El grafo se queda como está, y el archivo `.vnbeasty` se queda en disco. |

Debajo del editor, un cuadro de reporte muestra el resultado de la última importación: qué se aplicó, qué se
rechazó, y el número de línea de la sentencia problemática.

## Cómo se mantienen sincronizados

Las dos direcciones no son simétricas, a propósito.

![La barra del modo Text, con los botones de sincronización y la marca de divergencia](/docs-images/beasty-visual-novel/vn-text-sync-toolbar.png)

**De grafo a texto es automático.** El archivo se mantiene como un espejo vivo del grafo. Edita un nodo en el
grafo y el guion se reescribe solo; abre la pestaña Text y siempre ves el grafo actual. **Format** fuerza
la misma reescritura a mano.

**De texto a grafo es manual.** Nada de lo que escribas toca el grafo hasta que pulses **Save & apply**. Eso
es lo que hace que un párrafo sin terminar sea seguro.

**Guardar el archivo en un editor externo también lo aplica.** Abre el `.vnbeasty` en VS Code, o en cualquier
editor, escribe tu escena, guarda. Unity recoge el archivo en la siguiente importación y ejecuta la misma
importación de texto a grafo que ejecuta **Save & apply**, bajo las mismas reglas. No tienes que volver a la
pestaña Text.

**Cuando los dos divergen.** Si ambos lados cambiaron desde la última sincronización, la pestaña Story marca
su primer botón de interruptor con un marcador de advertencia (`Graph ⚠`) en lugar de `Graph`, para que lo
notes antes de que tu próxima edición sobrescriba el otro lado. En ese punto nada se ha sobrescrito: el
espejo automático se niega a propósito a elegir un ganador entre dos ediciones que nadie ha reconciliado.
Abre la pestaña Text, mira el guion, y guarda cuando estés conforme.

## El contrato de seguridad

Esta es la parte que vale la pena leer dos veces. Toda la funcionalidad está construida para que un archivo
de texto nunca pueda destruir en silencio el trabajo de autoría.

- **El grafo es la fuente de verdad.** El guion es una proyección de él. Cada regla de abajo se deriva de
  esa única premisa.
- **Un guion que no se puede parsear nunca llega al grafo.** La importación se rechaza, el grafo se
  deja exactamente como estaba, y la línea problemática se reporta con su número de línea. Tu texto se sigue
  guardando en el archivo, porque una errata no debe hacerte perder el párrafo que acabas de escribir, pero
  los nodos no se mueven.
- **Un guion vacío nunca borra una escena en silencio.** Un archivo sin labels borraría todos los nodos.
  Desde la pestaña Text aparece un diálogo de confirmación que te dice cuántos nodos están en juego. Desde
  una importación automática (un archivo guardado fuera de Unity, un pull de control de versiones) no hay
  nadie a quien preguntar, así que la importación se rechaza directamente.
- **Un guion que contiene algo que el formato de texto no puede expresar se rechaza.** Si el grafo contiene
  contenido que no se puede volver a escribir como texto, entonces el archivo en disco no es un espejo fiel
  del grafo, y aplicarlo borraría exactamente el contenido que el escritor no pudo expresar. La importación
  se cancela y te lo dice.
- **Un nombre que no se resuelve es un error.** Un fondo mal escrito, un clip de audio cuyo nombre coincide
  con dos assets, un `jump` a un label que no existe, un `goto-scene` a una escena desconocida: cada uno de
  estos rechaza la importación y señala la línea. Una errata nunca puede destruir una referencia borrándola
  en silencio. (Un nombre ambiguo te dice qué assets coincidieron, para que puedas desambiguar con una
  subcarpeta: `backdrop interiors/bedroom`.)
- **Cualquier importación que perdería contenido deja antes una copia de seguridad.** Antes de una importación que
  borra o reescribe nodos, el estado actual del grafo se escribe junto al guion como un archivo con marca de
  tiempo: `MyScene.vnbeasty.2026-07-13-142530.bak`. Es una proyección `.vnbeasty` del grafo que sobrescribiste,
  así que puedes leerla, y puedes volver a pegarla. Cada importación destructiva obtiene su propio archivo de
  copia de seguridad: dos guardados malos seguidos no pueden dejarte solo con la copia degradada. Si la copia
  de seguridad no se puede escribir —una carpeta de solo lectura, un disco lleno— la importación se rechaza en
  lugar de ejecutarse sin red de seguridad.
- **Si ambos lados cambiaron desde la última sincronización, gana el guardado más reciente**, y se deja un
  `.bak` del lado sobrescrito junto al archivo. El editor te dice qué lado se conservó y dónde quedó la
  copia de seguridad.
- **Los assets se resuelven por GUID.** El nombre en el guion es la forma en que *tú* encuentras el asset; el nodo
  guarda el asset en sí. Mueve `bedroom.png` a otra carpeta, o renómbralo, y el nodo sincronizado sigue
  apuntando a él. Ejecuta **Format** para actualizar el nombre escrito en el texto.

## Los límites

Dicho claramente, para que no los descubras por las malas.

- **Un fondo con más de una capa de sprites no tiene forma de texto.** Una escena que use uno de esos
  fondos se queda solo en el grafo: su guion no se puede crear, y si añades un fondo por capas a una escena
  que ya tiene un guion,
  la pestaña Text te dice que el espejo está desactualizado en lugar de mostrarte una mentira. Lo mismo pasa
  con los props, con limpiar una sola posición de personaje (en lugar de todas), con los nodos de menú de
  conversación, y con un cambio de expresión que también cambia el retrato de UI. Esas son funciones del
  grafo; el grafo las conserva.
- **La configuración no se define en el guion.** Los personajes, las variables, el diccionario, los ítems,
  las misiones, las pantallas y la localización viven en las ventanas visuales: las pestañas Characters,
  Variables, Dictionary, Items y Localization. El guion solo los *referencia* por nombre. Escribir
  `set gold = 10` no crea una variable llamada `gold`; usa la que ya definiste. Un id de speaker que no está
  en el reparto se reporta como una advertencia en la importación.
- **Un bloque sin ningún asset asignado no se escribe en el guion.** Un bloque Backdrop vacío, o un bloque
  Music sin clip, no hace nada en el juego: se salta, y lo que ya haya en pantalla o sonando se queda. Como no
  hace nada, no tiene forma de texto, así que guardar el guion también elimina ese marcador de posición del
  grafo. Se te avisa antes de que ocurra. Para dejar el fondo en negro o silenciar un canal a propósito,
  escribe `backdrop clear` o `stop music`.
- **Un archivo es una escena.** Un archivo `.vnbeasty` cubre una única `DialogueScene` y su grafo raíz,
  subgrafos incluidos. Cambia a otra escena con `goto-scene`.
- **Los subgrafos anidan un solo nivel.** Un label `(subgraph)` posee labels hijos llamados `padre/hijo`; esos
  hijos no pueden ser a su vez subgrafos.

## Un ejemplo completo

Aquí tienes una escena completa, escrita desde cero como texto. Nada de esto existe todavía en el grafo.

```text
scene "The Bakery"
start morning

label morning:
    backdrop bakery
    music calm fade 2
    show maya base at left
    "The smell of bread reached the street."
    maya "You're early today."
    maya (whisper) "The first loaf is always the best one."
    set trust += 1
    jump offer

label offer (choice):
    choice "Buy a loaf" if gold >= 3 { gold -= 3, has_bread = true } -> bought
    choice "Just looking" -> polite
    default -> polite

label bought:
    give 1 bread
    maya (happy) "Enjoy it."
    hide maya
    jump leave

label polite:
    maya as "The Baker" "Come back when you're hungry."
    jump leave

label leave:
    -> freeroam town/square
```

Pulsa **Save & apply**, y el grafo ahora contiene cinco nodos:

1. **morning** — un nodo Dialogue. Sus bloques, de arriba abajo: un bloque Backdrop fijado al sprite
   `bakery`; un bloque Music con el clip `calm` y un fade de dos segundos; un bloque Show character que pone
   a Maya a la izquierda en su expresión `base`; un bloque Dialogue de narrador; dos bloques Dialogue
   hablados por Maya, el segundo en el estado de interpretación `whisper`; y un bloque Set variable que
   suma 1 a `trust`. Su nodo siguiente por defecto es **offer**.
2. **offer** — un nodo Choice con dos opciones y un fallback. La primera opción está bloqueada por
   `gold >= 3`; cuando el jugador la elige, resta 3 de `gold`, fija `has_bread`, y enruta a **bought**. La
   segunda enruta a **polite**. Si todas las opciones quedan bloqueadas —el jugador está sin dinero— la ruta
   `default` lo envía a **polite** de todos modos.
3. **bought** — un nodo Dialogue: un bloque Give de un `bread`, una línea de Maya en su estado de
   interpretación `happy`, un bloque Hide character. Luego a **leave**.
4. **polite** — un nodo Dialogue con una línea, mostrada bajo el alias "The Baker" en lugar del nombre de
   Maya. Luego a **leave**.
5. **leave** — un nodo Flow, porque su única línea es una salida de flecha. Entrega el control fuera de la
   novela visual y deja al jugador en la sala `square` del mapa `town`.

`scene "The Bakery"` es el nombre legible de la escena, y `start morning` nombra el label de entrada: el
nodo en el que empieza la reproducción. Cambia a la vista **Graph** y los cinco nodos están ahí, conectados,
listos para que los mueva, los previsualice y los edite alguien que nunca abre el archivo de texto.

## Ver también

- [Referencia de sintaxis .vnbeasty](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/) — cada construcción, para consulta.
- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) — el lienzo y los tipos de nodo a los que compila el guion.
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — todos los bloques, por categoría.
- [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) — condiciones, efectos y enrutamiento en el grafo.
- [Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/) — anidar un grafo y enrutar su resultado.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — de dónde vienen los nombres en `set` e
  `if`.
- [Localización](/es/docs/beasty-visual-novel/production/localization/) — el selector de idioma de autoría, y dónde se almacena
  realmente el texto de una línea.
