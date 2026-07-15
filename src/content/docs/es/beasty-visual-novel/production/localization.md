---
title: "Localización"
description: "Traduce un juego que ya está escrito: las dos tablas de traducción, cómo saber qué traducciones quedaron desactualizadas, la importación y exportación de hojas de cálculo, y el cambio de idioma en plena partida."
---

Traduce un juego que ya está escrito. Esta página cubre las dos tablas de traducción, cómo el editor te indica
qué traducciones quedaron desactualizadas, la importación y exportación de hojas de cálculo, y el cambio de
idioma en plena partida.

## Las dos tablas

Hay exactamente dos assets `LocalizationTable` en todo el juego, y nunca se mezclan.

| Tabla | Dónde vive | Qué contiene |
|---|---|---|
| La tabla de historia | En el `VNContext` (`localization`), así que todas las DialogueScene que comparten el contexto comparten también la tabla | Líneas de diálogo, etiquetas de elección, etiquetas del menú de conversación, texto de ítems y misiones — todo lo que la historia referencia por clave |
| La tabla global de UI | `VNSettings.uiLocalization`, en `Resources` | Menús, HUD, botones, diálogos de confirmación — la interfaz |

Edita ambas en la pestaña **Localization** de la ventana de Beasty VN (`Tools > Beasty VN > Editor`). El
alternador **Story / UI (global)** de la parte superior cambia entre ellas. Si un proyecto todavía no tiene
tabla, la pestaña ofrece **Create & Assign New Table**.

Los nodos nunca almacenan texto en bruto. Una línea de diálogo almacena una CLAVE, y la tabla almacena el texto
de esa clave en cada idioma. Por eso traducir siempre se reduce a "agregar una columna".

## Idiomas, y cuál es el origen

La lista `languages` de una tabla es una lista ordenada de códigos de idioma, y **el índice 0 es el idioma de
origen** — aquel en el que escribes el juego. Todos los demás son una traducción de este.

Agrega un idioma con **+ Add Language** en la grilla. Un idioma nuevo se agrega al final, nunca se inserta al
principio, así que el índice 0 sigue siendo el origen. Al eliminar un idioma se elimina también su columna de
traducciones.

## Desactualización: saber qué traducciones quedaron obsoletas

Esta es la parte que importa en una producción real.

Cada celda traducida registra una **huella digital del texto de origen a partir del cual se tradujo**. Cuando
más adelante editas la línea en inglés, la huella deja de coincidir, y la celda que se tradujo a partir de la
redacción anterior queda marcada. No tienes que recordar qué cambiaste; la tabla lo recuerda por ti.

Cada celda está en uno de cuatro estados:

| Estado | Significado |
|---|---|
| `Source` | La columna del idioma de origen (índice 0). Es la referencia, así que nunca falta ni está desactualizada. |
| `Missing` | Todavía no se ha ingresado texto para este idioma. |
| `Stale` | Traducida una vez, pero el texto de origen cambió desde entonces. Necesita revisión. |
| `Translated` | Traducida, y al día con el texto de origen actual. |

La grilla muestra el estado de cada celda como una insignia, y la barra de filtros puede acotar la grilla a
**Missing or stale**, solo **Missing** o solo **Stale**. El validador también informa los totales (ver
[Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/)).

> **Nota**
> Una tabla escrita antes de que existieran las huellas digitales se rellena una sola vez, al abrirla: se asume
> que las traducciones existentes están sincronizadas en lugar de inundarte con falsas marcas de "desactualizado".

## Trabajar en la grilla

- **+ Add Language** — agrega una columna de idioma.
- **+ Add Key** — agrega una clave manualmente. Rara vez la necesitas: el editor de bloques genera una clave
  para cada línea que escribes.
- **Unused keys** — un alternador que lista las claves que siguen en la tabla pero que ya ninguna línea de
  diálogo, elección o `[token]` referencia, con un barrido **Remove N unused key(s)**. Cuando eliminas contenido
  de la historia, sus claves quedan huérfanas; así es como las limpias.
- **Fill identical texts** — el botón de memoria de traducción. Las líneas cuyo texto de origen es EXACTAMENTE
  idéntico comparten sus traducciones: una celda vacía se rellena a partir de una gemela ya traducida. Traduce
  una vez una línea repetida como "Sí" y el botón rellena el resto. Nunca sobrescribe una celda que ya tiene
  texto.

## Importar y exportar

La tabla exporta e importa texto delimitado (CSV o TSV, RFC 4180: las comillas se duplican, y cualquier campo
que contenga el delimitador, una comilla o un salto de línea se pone entre comillas). La puntuación dentro del
diálogo nunca es un problema.

**La primera columna es `key`.** Las columnas siguientes son los idiomas, en orden. La exportación también
escribe una columna de metadatos por cada idioma que no sea el de origen, `#status.<code>`, que contiene `ok`,
`stale`, `missing` o `source`, para que un traductor que trabaje en una hoja de cálculo pueda ver qué necesita
atención. Las columnas cuyo encabezado empieza con `#` son metadatos y se ignoran al importar.

**Export** (el desplegable `Export` en la barra de herramientas de Localization) ofrece tres alcances:

| Alcance | Qué escribe |
|---|---|
| All keys | La tabla completa. |
| Section: `<graph>` | Solo las claves referenciadas por el grafo seleccionado en el desplegable de sección. Úsalo para entregar un capítulo a un traductor. |
| Missing or stale only (N) | Solo las celdas que necesitan trabajo. Esta es la que más usarás. |

La exportación usa el separador de lista configurado en el sistema (una coma en en-US, un punto y coma en la
mayoría de las configuraciones regionales europeas), así que el archivo se abre directamente en columnas al
hacer doble clic. Además se escribe como UTF-8 con BOM, así que los acentos sobreviven a Excel.

**Import** (`Import CSV...`) autodetecta el delimitador a partir de la fila de encabezado — tabulación, coma o
punto y coma — y también tolera una línea inicial `sep=` de un archivo más antiguo. Así que un archivo
exportado desde cualquier lugar, o un CSV con comas o punto y coma hecho a mano, se importa sin problemas.

Hay dos cosas que la importación hace deliberadamente:

- Un archivo **sin fila de encabezado se rechaza** y no se escribe nada. Su primera línea es dato real, y
  leerla como encabezado la perdería en silencio.
- Reimportar una tabla completa **no borra tus marcas de desactualizado**: una traducción cuyo texto no cambió
  conserva su huella digital registrada. Solo una traducción cuyo texto realmente cambió se vuelve a marcar
  como al día respecto del origen actual.

## Cambiar de idioma mientras el juego se ejecuta

Hay una única fuente de verdad para el idioma activo, compartida por la historia y la interfaz, y un único
evento de "idioma cambiado". Cambia el idioma en un solo lugar y todo se resuelve de nuevo a la vez: la línea
que está en pantalla, las elecciones visibles y un menú de conversación abierto se vuelven a renderizar al
instante. El jugador puede cambiar de idioma en medio de una línea y verla cambiar ante sus ojos.

Cuando una clave no tiene texto en el idioma activo, se muestra en su lugar el texto del idioma de origen — una
celda vacía se comporta exactamente igual que una columna que falta, así que una línea sin traducir nunca se
muestra como una clave en bruto.

### En qué idioma arranca el juego

Al iniciar, en este orden:

1. **La elección guardada del jugador.** Una vez que el jugador ha elegido un idioma, siempre gana.
2. **El idioma del sistema operativo**, pero solo si `autoDetectSystemLanguage` está activado en
   [VN Settings](/es/docs/beasty-visual-novel/production/vn-settings/) Y la tabla de UI realmente tiene ese idioma — así que el juego nunca
   arranca en un idioma que no has traducido.
3. **El idioma predeterminado** (`defaultLanguage` en VN Settings).

El idioma activo también se guarda en cada partida, y se restaura con ella.

## El idioma de autoría no es el idioma del juego

El selector **Lang** de la pestaña Story elige en qué columna de idioma estás ESCRIBIENDO mientras trabajas.
Es una comodidad del editor — un traductor puede trabajar directamente en el inspector de nodos en lugar de una
hoja de cálculo — y no tiene ningún efecto en el idioma en el que se ejecuta el juego. Poner Lang en `fr` no
hace que el juego arranque en francés; eso lo decide `defaultLanguage`.

## Ver también

- [VN settings](/es/docs/beasty-visual-novel/production/vn-settings/) — el idioma predeterminado, la autodetección del SO, y dónde se asigna la tabla de UI.
- [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/) — el validador informa las claves sin texto de origen, y los
  totales de faltantes/desactualizadas.
- [Diccionario](/es/docs/beasty-visual-novel/world/dictionary/) — texto `[token]` editable por el jugador, que es un mecanismo distinto.
- [Proyectos grandes](/es/docs/beasty-visual-novel/production/large-projects/) — cómo mantener a raya una tabla grande.
