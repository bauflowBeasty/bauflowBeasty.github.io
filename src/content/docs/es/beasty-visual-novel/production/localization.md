---
title: "Localización"
description: "Traduce un juego terminado: las tablas de traducción, el rastreo de traducciones obsoletas, importar y exportar hojas de cálculo, y el cambio de idioma."
---

Traduce un juego que ya está escrito. Esta página cubre las tablas de traducción, cómo agregar y eliminar
idiomas, cómo el editor te indica qué traducciones quedaron desactualizadas, la importación y exportación de
hojas de cálculo, la localización de la interfaz, y el cambio de idioma en plena partida.

## Las tablas de traducción

Hay cuatro assets `LocalizationTable` en todo el juego, y nunca se mezclan.

![La pestaña Localization, con las pestañas Story, UI, Game UI e Items arriba](/docs-images/beasty-visual-novel/vn-localization-tabs.png)

| Tabla | Dónde vive | Qué contiene |
|---|---|---|
| La tabla de historia | En el `VNContext` (`localization`), así que todas las DialogueScene que comparten el contexto comparten también la tabla | Líneas de diálogo, etiquetas de elección, etiquetas del menú de conversación — todo lo que la historia referencia por clave |
| La tabla global de UI | `VNSettings.uiLocalization`, creada en `Assets/Resources/` de tu proyecto | Menús, botones, diálogos de confirmación — los textos de interfaz de serie |
| La tabla de textos del juego | En el `VNContext` (`Game Text Localization`) | Los textos que escribes para las pantallas propias del juego: textos del HUD, nombres de salas, misiones, nombres de estadísticas y variables, nombres del tiempo. Consulta [La pestaña Game UI](#la-pestaña-game-ui). |
| La tabla de ítems | En el `VNContext` (`Item Localization`) | Nombres, descripciones y mensajes de «no se puede usar» de los ítems. Consulta [La pestaña Items](#la-pestaña-items). |

Edítalas todas en la sección **Localization** de la ventana de Beasty VN (`Tools > Beasty VN > Editor`), cuyas
pestañas —**Story**, **UI**, **Game UI** e **Items**— cambian entre ellas. Si un proyecto todavía no tiene
tabla, la pestaña ofrece crearla.

**La tabla de UI no forma parte del paquete.** Cuando el editor carga y el proyecto no tiene ninguna, se crea
en `Assets/Resources/UILocalization.asset`, ya rellena con todos los textos de interfaz de serie en inglés y
español. Actualizar o reimportar el paquete nunca sobrescribe tus traducciones de UI: los textos de serie que
añade una versión nueva se mezclan la próxima vez que carga el editor, y un texto que editaste nunca se toca.
Una tabla que ya tengas sigue funcionando esté donde esté. Consulta
[Instalación](/es/docs/beasty-visual-novel/getting-started/installation/#tus-ajustes-y-tu-tabla-de-ui-se-crean-solos).

La tabla global de la interfaz además **se repara sola**: cada setup de escena y cada pasada de
**Auto-wire / Repair** la comprueban. Una tabla que existe pero está sin asignar se adopta y se recablea
automáticamente, y solo cuando no existe ninguna se crea una nueva en `Assets/Resources/`,
pre-sembrada con los textos de interfaz integrados. La comprobación solo mezcla — las claves
personalizadas y cada traducción editada no se tocan nunca. Lo que no puede hacer es resucitar el
contenido propio de una tabla **borrada**: la regeneración restaura los textos integrados, no tus claves y
traducciones.

Los nodos nunca almacenan texto en bruto. Una línea de diálogo almacena una CLAVE, y la tabla almacena el texto
de esa clave en cada idioma. Por eso traducir siempre se reduce a "agregar una columna".

## Idiomas, y cuál es el origen

La lista `languages` de una tabla es una lista ordenada de códigos de idioma, y **el índice 0 es el idioma de
origen** — aquel en el que escribes el juego. Todos los demás son una traducción de este.

Un idioma nunca se agrega a una sola tabla. Agregar, eliminar, restaurar y renombrar se aplican a todas las
tablas a la vez —historia, UI, textos del juego e ítems—, y también actualizan la lista de idiomas soportados del contexto
y `VNSettings.defaultLanguage`. Por eso el desplegable de idioma dentro del juego siempre ofrece exactamente
los idiomas que tiene la historia.

### Agregar un idioma

![El desplegable + Add Language con los 15 idiomas curados y Custom](/docs-images/beasty-visual-novel/vn-localization-add-language.png)

**+ Add Language** abre un desplegable con 15 idiomas curados — English, Spanish, French, German, Italian,
Portuguese, Dutch, Russian, Japanese, Korean, Chinese (Simplified), Chinese (Traditional), Polish, Turkish,
Arabic — más **Custom…** para escribir un código a mano. Los nombres curados son los mismos que muestra el
desplegable de idioma dentro del juego, así que un idioma creado aquí nunca le llega al jugador como un código
suelto. Los idiomas que ya están en la tabla aparecen en gris.

Agregar un idioma curado **rellena los textos de interfaz que trae el paquete en ese idioma**: los menús, el
HUD, los diálogos y las pantallas de guardar/cargar llegan traducidos sin que toques una sola clave. Solo te
queda por traducir el texto de tu historia. Un código personalizado obtiene una columna vacía, como cabe
esperar. (**Seed defaults**, en la barra de herramientas de Localization ▸ UI, vuelve a rellenar esos textos
integrados para todos los idiomas curados que ya tenga la tabla, sin sobrescribir lo que hayas escrito.)

Un idioma nuevo se agrega al final, nunca se inserta al principio, así que el índice 0 sigue siendo el origen.

> **Nota**
> Los nombres curados están en inglés a propósito. Los nombres nativos (ruso, japonés, árabe…) necesitan
> glifos que el atlas de fuente por defecto de TMP no trae, así que se verían como cuadraditos vacíos
> justamente en el desplegable con el que el jugador elige idioma. Si tu juego incluye una fuente que cubra
> esas escrituras, puedes renombrarlos sin problema.

### Eliminar un idioma, y recuperarlo

Eliminar siempre pide confirmación primero, y **no** destruye los textos: el idioma pasa a una papelera de
**Deleted languages** debajo de la lista de idiomas. Desde ahí puedes:

![La papelera Deleted languages, con Restore y Delete permanently](/docs-images/beasty-visual-novel/vn-localization-trash.png)

- **Restore** — la columna vuelve con todas las traducciones que tenía.
- **Delete permanently** — una segunda confirmación avisa de que los textos no se podrán recuperar una vez
  guardados los assets.

Agregar un idioma cuyo código está en la papelera lo restaura en lugar de crear un duplicado vacío; el
desplegable lo etiqueta con `(restore)` para que sepas cuál vas a obtener.

Eliminar el idioma **principal** (índice 0) está permitido, y la confirmación te dice quién lo sucede: el
siguiente idioma visible es promovido, sus textos pasan a ser la columna de origen, y la ventana Story, la
lista de idiomas soportados y `defaultLanguage` lo siguen. El último idioma que queda no se puede eliminar.

Renombrar se hace en el campo de la fila del idioma: escribe el código nuevo y pulsa Enter, y el código se
reescribe en las dos tablas, en los registros de la papelera, en la lista de idiomas soportados y en
`defaultLanguage`. Las celdas son posicionales, así que renombrar conserva todos los textos. Renombrar sobre
un código que ya existe se rechaza — mezclaría dos idiomas en silencio.

## Desactualización: saber qué traducciones quedaron obsoletas

Esta es la parte que importa en una producción real.

![Celdas con insignias Source, Missing, Stale y Translated en la grilla](/docs-images/beasty-visual-novel/vn-localization-staleness.png)

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

![La grilla de localización y su barra de herramientas: claves en filas, idiomas en columnas](/docs-images/beasty-visual-novel/vn-localization-grid.png)

- **+ Add Language** — agrega una columna de idioma, desde el desplegable curado o con un código propio (más
  arriba).
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

La tabla viaja como un archivo de hoja de cálculo, así que un traductor nunca necesita Unity. Exporta e
importa texto delimitado (CSV o TSV, RFC 4180: las comillas se duplican, y cualquier campo
que contenga el delimitador, una comilla o un salto de línea se pone entre comillas). La puntuación dentro del
diálogo nunca es un problema.

![El desplegable Export con sus tres alcances](/docs-images/beasty-visual-novel/vn-localization-export-menu.png)

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

## La pestaña Game UI

Los textos que escribes para las pantallas propias del juego se traducen en la pestaña **Game UI**. Viven en
la tabla de textos del juego, que se crea y se mantiene al día sola: no hay claves que crear a mano.

![La pestaña Game UI: filas agrupadas en Time, Screens, Rooms, Quests y Character stats](/docs-images/beasty-visual-novel/vn-localization-game-ui.png)

Las filas van agrupadas, y el desplegable de grupo filtra la grilla:

| Grupo | Qué contiene |
|---|---|
| **Time** | Nombres de los momentos del día, los días de la semana y las estaciones. |
| **Screens** | Textos de los elementos del HUD, y los de sus casos condicionales. |
| **Rooms** | Nombres de las salas, que se ven en los selectores de sala y en la pantalla de rutina del personaje. |
| **Quests** | Títulos, descripciones, textos de objetivos y pistas de las misiones. |
| **Character stats** | Los nombres visibles de las estadísticas, del **Display name** de cada campo. |
| **Global variables** | Los nombres visibles de las variables globales que se usan en avisos y pistas. |

- **La columna 0 es tu idioma por defecto** (`VNSettings > Default Language`). Refleja lo que escribiste en
  los editores y aquí es de solo lectura: edita el texto donde lo escribes. Los demás idiomas son columnas
  normales y editables.
- Donde una traducción está vacía, o falta la tabla, el juego muestra el texto que escribiste, nunca el texto
  de otro idioma.
- Editar el texto de origen marca como obsoletas las traducciones de esa fila, como en las pestañas Story y UI.
- La pestaña tiene importación y exportación CSV y un panel **Unused keys** como las demás, y cada edición se
  puede deshacer. Los idiomas que añades, renombras o borras en otro sitio también llegan a esta tabla.
- La tabla se refresca al abrir la pestaña, con su botón **Refresh** y antes de cada build.

Si tu idioma por defecto no es la columna 0 —porque lo cambiaste después de traducir, por ejemplo—, un aviso
ofrece **Make <language> the source**. Pide confirmación, reordena las columnas y sustituye las traducciones
que ya tuviera ese idioma por tus textos. Hasta entonces el juego deja este aviso una vez por tabla:
*"Game text table: the default language is '<default>' but column 0 is '<old>'. Open Localization > Game UI
and use 'Make <default> the source' to reorder (its existing translations will be replaced by your texts)."*

### Qué sigue a un renombrado

Renombrar una pantalla, un elemento de pantalla, una misión, un objetivo de misión o una variable se lleva sus
traducciones consigo. Los casos condicionales de un elemento del HUD tienen un id estable, así que una
traducción sigue a su caso aunque los reordenes. Renombrar un nombre del tiempo (momento del día, día de la
semana, estación), o un id que no tiene renombrado en cascada, deja las traducciones antiguas en **Unused
keys**, listas para copiarlas o borrarlas.

El **Display name** de un personaje no se traduce; consulta [Personajes](/es/docs/beasty-visual-novel/world/characters/#identidad).

### Las etiquetas de pantalla tienen una sola fuente

Las etiquetas de los elementos de pantalla —del HUD y del teléfono— solo se traducen en la pestaña Game UI. La
pasada de arranque que enlaza las etiquetas de menú con los textos de UI de serie (consulta
[Escenas hechas antes de todo esto](#escenas-hechas-antes-de-todo-esto)) se las salta, así que una etiqueta del
HUD que dice "Settings" nunca queda sobrescrita por la traducción de serie de "Settings" al cambiar de idioma.
Las etiquetas de menú fuera de las pantallas se enlazan como siempre.

## La pestaña Items

Los nombres, descripciones y mensajes de «no se puede usar» de los ítems tienen su propia tabla y su propia
pestaña **Items**. Se escriben en la ventana Items o directamente en esta pestaña. La columna 0 es tu idioma
por defecto.

- La pestaña lista todos los textos de ítems, también los que nadie ha escrito aún, como el mensaje de «no se
  puede usar» de un ítem. Salen como filas vacías y reciben su entrada cuando escribes en ellas: un paso de
  Ctrl+Z.
- La ventana Items de un proyecto nuevo muestra la primera vez un botón **Create items table**.
- En el juego, un texto de ítem se busca en la tabla de ítems, después en la tabla de UI, y si no aparece usa
  el id del ítem (para el nombre), nada (para la descripción) o el mensaje de serie (para «no se puede usar»).
  Los `[token]` de los textos de ítems se siguen expandiendo.

**Los proyectos que guardaban los textos de ítems en la tabla de UI migran solos**, sin perder nada —todos los
idiomas y el estado de cada traducción—, al abrir la ventana Items o cualquier pestaña de Localization, y antes
de cada build. Ctrl+Z deshace la migración. El texto de la primera columna de la antigua tabla de UI pasa a ser
el texto de origen solo si la celda del idioma por defecto de la tabla de ítems estaba vacía. Una clave que
todavía se necesita en otro sitio —un contexto aún sin migrar, o una etiqueta de menú— se queda también en la
tabla de UI.

## Localizar la interfaz

El texto de la historia se localiza solo: un nodo guarda una clave, y el juego busca el texto del idioma
activo en el momento de mostrar la línea. El texto de la
interfaz, en cambio, tiene que ir enganchado a la etiqueta que lo muestra, y ese enganche es el componente
`VNLocalizedText`: guarda una clave de la tabla de UI y reescribe su etiqueta TMP cada vez que cambia el
idioma activo. Una etiqueta sin él muestra para siempre el texto con el que la escribiste.

### Bake Localized UI Labels

![El diálogo de resultado de Bake Localized UI Labels](/docs-images/beasty-visual-novel/vn-localization-bake.png)

**Bake scene labels**, en la barra de herramientas de Localization ▸ UI (también
`Tools > Beasty VN > Setup > Bake Localized UI Labels`), recorre todos los canvas de la escena abierta y
agrega `VNLocalizedText`, con su clave ya rellenada, a cada etiqueta cuyo texto coincida con un valor de la
tabla de UI.

Escribe **en los prefabs de origen**, no en las instancias de la escena, así que un solo bake arregla todas
las instancias de todas las escenas a la vez. Solo las etiquetas que siguen siendo instancias de un prefab no
editable reciben el componente como una modificación de escena. A partir de ahí la clave viaja con el objeto:
puedes mover la etiqueta, renombrarla o cambiarle el estilo y sigue localizándose.

Ejecútalo una vez después de darles estilo a tus menús, y después de `Build Default Menu Prefabs`.

> **Nota**
> La coincidencia es exacta (sin espacios sobrantes, y tratando `...` y `…` como lo mismo). Una etiqueta cuyo
> texto es tuyo y no un valor de la tabla no se toca nunca, así que el bake no puede reescribir tus etiquetas
> propias.

### Enganchar una etiqueta a mano

Agrega `VNLocalizedText` a la etiqueta y elige su clave en el selector con buscador del inspector. Además de
elegir, el inspector hace dos cosas:

![El inspector de VNLocalizedText: selector de clave, texto de origen y los dos botones de sincronización](/docs-images/beasty-visual-novel/vn-localized-text-inspector.png)

- **Create key from this text.** Si el texto de la etiqueta todavía no está en la tabla, un botón acuña una
  clave `ui.*` nueva a partir de ese texto (`Open inventory` → `ui.open_inventory`), guarda el texto como el
  valor del idioma de origen de la clave y se la asigna. Nunca tienes que pasar antes por la tabla.
- **El texto de origen, editable ahí mismo.** El texto del idioma de origen de la clave se edita desde el
  propio componente. Vive en la tabla, así que editarlo marca las traducciones existentes como
  desactualizadas, exactamente igual que si lo hubieras editado en la grilla. Dos botones lo sincronizan con
  la etiqueta TMP del mismo objeto: **From label** copia el texto actual de la etiqueta al valor de origen, y
  **To label** escribe el valor de origen sobre la etiqueta.

### Escenas hechas antes de todo esto

Al arrancar, `BeastyManager` añade `VNLocalizedText` a cualquier etiqueta del canvas cuyo texto coincida con
un valor de interfaz integrado, en cualquier idioma. Los menús construidos con prefabs antiguos — que llevaban
su texto fijado en el componente TMP y nunca podían reaccionar a un cambio de idioma — siguen el idioma del
jugador sin que tengas que rehacerlos. Es una red de seguridad, no un sustituto del bake: se ejecuta en cada
arranque, solo cubre los textos integrados, y se salta las etiquetas que ya tienen su clave fijada.

### Cuando la interfaz se queda en un solo idioma

Si la columna de origen (#0) de la tabla de UI no es `en`, cada celda sin traducir cae a ese idioma, y el
síntoma es una interfaz que ignora la elección del jugador. La pestaña Localization ▸ UI lo detecta y ofrece
**Make English the source and fill missing defaults**, que devuelve `en` a la columna 0 (cada texto sigue a su
idioma) y rellena los valores integrados que faltaban.

![El aviso de reparación cuando la columna de origen de la tabla de UI no es el inglés](/docs-images/beasty-visual-novel/vn-localization-repair.png)

## Cambiar de idioma mientras el juego se ejecuta

Hay una única fuente de verdad para el idioma activo, compartida por la historia y la interfaz, y un único
evento de "idioma cambiado". Cambia el idioma en un solo lugar y todo se resuelve de nuevo a la vez: la línea
que está en pantalla, las elecciones visibles y un menú de conversación abierto se vuelven a renderizar al
instante. El HUD abierto y las pantallas de estadísticas, rutina y misiones también, sin tener que volver a
abrirlas. El jugador puede cambiar de idioma en medio de una línea y verla cambiar ante sus ojos.

![El desplegable de idioma en la pantalla de preferencias, en el juego](/docs-images/beasty-visual-novel/vn-preferences-language-ingame.png)

Cuando una clave no tiene texto en el idioma activo, se muestra en su lugar el texto del idioma de origen — una
celda vacía se comporta exactamente igual que una columna que falta, así que una línea sin traducir nunca se
muestra como una clave en bruto.

El jugador cambia de idioma desde el **desplegable de idioma de la pantalla de preferencias**. Se rellena en
tiempo de ejecución con los idiomas visibles de la tabla de UI, usando los nombres curados, y se oculta solo
cuando el juego tiene un único idioma — así que un proyecto en un solo idioma no muestra un control muerto. La
elección se guarda y gana sobre todo lo demás en el siguiente arranque.

### En qué idioma arranca el juego

Al iniciar, en este orden:

1. **La elección guardada del jugador.** Una vez que el jugador ha elegido un idioma, siempre gana.
2. **El idioma del sistema operativo**, pero solo si `autoDetectSystemLanguage` está activado en
   [VN Settings](/es/docs/beasty-visual-novel/production/vn-settings/) Y la tabla de UI realmente tiene ese idioma — así que el juego nunca
   arranca en un idioma que no has traducido.
3. **El idioma predeterminado** (`defaultLanguage` en VN Settings).

**Rebobinar y cargar mantienen el idioma del jugador.** El idioma es una preferencia del jugador, no estado
de la historia: retroceder —también entre la novela y el mundo libre— o cargar una partida hecha en otro
idioma nunca devuelve el texto al idioma anterior. Una partida sigue anotando el idioma en que se hizo, pero
al cargarla no se aplica. Un controlador que fija un idioma explícito conserva ese idioma.

### Nombres del tiempo traducidos

Los tokens `[@time:daypart.label]`, `[@time:weekday.label]` y `[@time:season.label]` muestran el nombre
traducido del momento del día, el día de la semana o la estación actuales, en el idioma del jugador, y si no
hay traducción, el nombre que escribiste. `[@time:clock.label]` muestra la hora como `HH:00` cuando el time
config es un reloj, y el nombre traducido del momento del día cuando solo tiene momentos del día. Los nombres
se traducen en la pestaña Game UI, grupo **Time**.

Los tokens normales `[@time:daypart]`, `[@time:weekday]` y `[@time:season]` siguen dando el nombre sin
traducir, igual que los valores en condiciones y partidas. Los tokens `.label` son para texto que lee el
jugador: los selectores los ofrecen para mostrar, como la variable en vivo de un elemento del HUD, y nunca en
condiciones. Cualquier texto de UI o de ítem puede usarlos.

## El idioma de autoría no es el idioma del juego

El selector **Lang** de la pestaña Story elige en qué columna de idioma estás ESCRIBIENDO mientras trabajas.
Es una comodidad del editor — un traductor puede trabajar directamente en el inspector de nodos en lugar de una
hoja de cálculo — y no tiene ningún efecto en el idioma en el que se ejecuta el juego. Poner Lang en `fr` no
hace que el juego arranque en francés; eso lo decide `defaultLanguage`.

La ventana Story sigue la lista de idiomas: elimina, restaura o renombra un idioma y las vistas previas de las
tarjetas de nodo y el selector Lang se vuelven a resolver al instante. Si el idioma en el que estabas
escribiendo ya no existe, el selector cae al idioma principal en lugar de mostrar inglés en silencio.

## Ver también

- [VN settings](/es/docs/beasty-visual-novel/production/vn-settings/) — el idioma predeterminado, la autodetección del SO, y dónde se asigna la tabla de UI.
- [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/) — el validador informa las claves sin texto de origen, y los
  totales de faltantes/desactualizadas.
- [Diccionario](/es/docs/beasty-visual-novel/world/dictionary/) — texto `[token]` editable por el jugador, que es un mecanismo distinto.
- [Proyectos grandes](/es/docs/beasty-visual-novel/production/large-projects/) — cómo mantener a raya una tabla grande.
