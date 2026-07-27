---
title: "Historial de cambios"
description: "Todos los cambios relevantes de Beasty Visual Novel, versión por versión. El proyecto sigue Semantic Versioning."
---

Todos los cambios relevantes de Beasty Visual Novel. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.0.0 — sin publicar

Primera versión pública.

### Escritura de la historia

- Grafo de nodos (diálogo, elección, decisión, subgrafo, flujo) con un editor basado en bloques.
- Script de texto `.vnbeasty`: escribe escenas como un script estilo Ren'Py, sincronizado en ambos sentidos con
  el grafo. El grafo sigue siendo la fuente de verdad — un script vacío, imposible de parsear o irrepresentable
  nunca lo sobrescribe, y una importación destructiva deja un `.bak` con marca de tiempo.
- Vista previa en el editor de cualquier nodo, hasta cualquier bloque.

### Mundo

- Salas de mundo libre con fondos condicionales, puertas e interactuables.
- Tiempo de juego (momentos del día o reloj), rutinas de personajes con perfiles, y un editor de rutinas en
  cuadrícula.
- Misiones con etapas, objetivos, recompensas y un menú de conversación por personaje.

### Presentación

- Pantallas de diálogo, elecciones, backlog, historial, guardar/cargar, preferencias y ayuda, todas localizables.
- Tablas de localización con seguimiento de desactualización por celda e importación y exportación CSV/TSV.
- Los idiomas se agregan desde un desplegable con 15 idiomas curados (los mismos nombres que muestra el
  desplegable de idioma dentro del juego: English, Spanish, French, German…) más una opción `Custom…` para
  escribir un código a mano. Al agregar un idioma curado, los textos de interfaz que trae el paquete (menús,
  HUD, diálogos, pantallas de guardar/cargar) se rellenan solos en ese idioma, así que la interfaz llega
  traducida sin que toques una sola clave.
- Eliminar un idioma siempre pide confirmación y lo mueve a una papelera de **Deleted languages** en lugar de
  destruir sus textos: desde ahí se puede restaurar (sus traducciones vuelven) o eliminar de forma
  permanente, tras una segunda confirmación que avisa de que los textos no se podrán recuperar. Agregar un
  idioma cuyo código está en la papelera lo restaura en lugar de crear un duplicado vacío.
- Eliminar el idioma PRINCIPAL promueve al siguiente: sus textos pasan a ser la columna de origen, y la
  ventana Story, la lista de idiomas soportados y `VNSettings.defaultLanguage` lo siguen automáticamente.
  Agregar, eliminar, restaurar y renombrar un idioma se aplica a la tabla de historia y a la tabla global de
  UI a la vez, así que el desplegable de idioma del juego siempre coincide con los idiomas de la historia.
- Una línea de diálogo o de interfaz sin traducción en el idioma activo muestra el texto del idioma de origen
  en lugar de una línea en blanco o una clave suelta.
- **Bake Localized UI Labels** (pestaña Localization ▸ UI, o `Tools ▸ Beasty VN ▸ Setup`): agrega de forma
  permanente `VNLocalizedText` (con su clave serializada) a cada etiqueta de la escena abierta cuyo texto
  coincida con un valor de la tabla de UI — escribiendo en los prefabs de ORIGEN, así que cada instancia
  queda arreglada de una vez y las etiquetas siguen localizándose por mucho que después las muevas, las
  renombres o les cambies el estilo.
- El inspector de `VNLocalizedText` ahora puede CREAR una clave: una etiqueta cuyo texto todavía no está en la
  tabla obtiene con un botón una clave `ui.*` nueva acuñada a partir de ese texto (que se guarda como el valor
  del idioma de origen de la clave) — ya no hace falta agregar la clave en la tabla primero.
- El inspector de `VNLocalizedText` también edita ahí mismo el texto del idioma de ORIGEN de la clave (vive en
  la tabla, así que las traducciones existentes se marcan correctamente como desactualizadas cuando cambia),
  con dos botones de sincronización contra la etiqueta TMP del mismo objeto: «From label» copia el texto
  actual de la etiqueta al valor de origen, «To label» escribe el valor de origen sobre la etiqueta.
- Streaming opcional de assets de nodos con Addressables (**beta**).

### Cambios previos a la publicación

- **`.vnbeasty` alcanza la paridad 1:1 con el grafo de nodos.** Todo lo que los nodos pueden expresar se
  escribe ya en texto: nodos de menú de conversación (`label charla (talkmenu ana):`), la imagen lateral del
  nodo de elección (`image <sprite> [if <cond>]`), atrezo (`props <sprite>[, …]` / `props clear`), fondos en
  capas con desplazamiento/parallax/orden, `show … portrait <clave> slot <n>`,
  `expression … portrait [<clave>]`, el `clear characters at <ancla> [layer <n>]` posicional, y nombres de
  personaje localizados (`name ana = key <claveLoc>`).
- **Las variables con punto funcionan en cualquier parte del texto.** `ana.afecto` en una condición o en un
  bloque de efecto compila ahora a la misma clave del almacén por personaje que escribe `set ana.afecto`
  (antes apuntaba en silencio a una clave que no existía). `item.<id>` y las claves crudas
  `@time:`/`@quest:`/`@char:` también valen como tokens de condición, y `set item.<id>` pasa por el
  inventario (con su límite incluido).
- **Las erratas avisan al importar.** Los tokens de condición, las claves de efecto, las claves de
  `set`/`toggle`/`dict`, los ids de objeto, los ids de misión, los objetivos y los ids de pantalla se
  comprueban contra lo declarado en el proyecto; un nombre desconocido da una advertencia con su número de
  línea en lugar de crear en silencio una clave muerta en ejecución.
- **El autocompletado del editor de texto ofrece ya todos los grupos de variables** (globales, campos de
  personaje como `ana.afecto`, recuentos `item.<id>`, tokens de diccionario, claves reservadas
  `@time:`/`@quest:`) — el mismo catálogo que usa el selector de condiciones del grafo — más las palabras
  clave nuevas, las claves de `portrait` y las anclas.
- **La ventana Story sigue los cambios de idioma**: eliminar, restaurar o renombrar un idioma vuelve a
  resolver al instante las vistas previas de las tarjetas de nodo y el selector de idioma de autoría, y una
  selección de idioma de autoría que ya no existe cae al idioma principal en lugar de mostrar inglés en
  silencio.
- **Cambiar de idioma en el juego ahora cambia también los menús y el HUD.** Dos arreglos: la tabla
  `UILocalization` incluida venía con la columna de inglés vacía (así que todos los idiomas caían a los
  mismos textos), y las pantallas de menú anidadas en el prefab `VN_Canvas` llevaban sus etiquetas FIJADAS en
  los componentes TMP sin ningún `VNLocalizedText` — esos menús nunca podían reaccionar a un cambio de idioma.
  Al arrancar, `BeastyManager` ahora añade `VNLocalizedText` a cualquier etiqueta cuyo texto coincida con un
  valor de interfaz que trae el paquete (en cualquier idioma), así que las escenas y prefabs existentes siguen
  el idioma del jugador sin que tengas que rehacer nada. Los textos propios de tus etiquetas nunca se tocan.
  La pestaña de localización de UI (global) muestra además un botón de reparación cuando la columna de origen
  de la tabla no es el inglés.
- **Las aristas de la ventana Story ya no se descolocan al hacer zoom o desplazarse.** En grafos grandes, un
  cable cuyos nodos se habían descartado por estar fuera de pantalla (o simplificado por el LOD de zoom
  lejano) podía reaparecer flotando en el aire o aparentemente enganchado al nodo equivocado hasta que lo
  seleccionabas o movías la vista otra vez. Las aristas ahora recalculan su posición en cuanto vuelven a
  entrar en vista, y un cable nunca se dibuja mientras uno de sus extremos siga oculto.
- **El logging de la VN ya no necesita que Beasty Console esté presente.** `VNLog` llega ahora a la consola
  por reflexión y cae a `UnityEngine.Debug` cuando el asset de la consola no está en el proyecto — así que la
  VN compila y funciona con él o sin él (antes sus ensamblados referenciaban `Beasty.Console` directamente, y
  borrar la consola rompía la build). Con la consola presente, los logs siguen llegando a su ventana
  exactamente igual que antes, e importar Beasty Console junto a un proyecto que ya lo incluye deja de
  arriesgar un error de ensamblado duplicado.
- **Los encabezados de nodo de `.vnbeasty` ahora empiezan por el tipo de nodo.** Un nodo se abre con su
  palabra clave de tipo seguida de su nombre: `choice cruce:`, `decision ruta:`, `subgraph combate:`,
  `return combate/fin ("win"):`, `talkmenu charla (ana):`, `flow al_pueblo:` — y `label intro:` sigue siendo
  el nodo de diálogo normal. Esta es la forma que el escritor emite ahora (un guion enlazado se reescribe a
  ella en la siguiente sincronización con el grafo); la forma anterior con etiqueta, `label <nombre>
  (choice):`, se sigue parseando, así que los guiones existentes siguen funcionando. Una etiqueta de tipo que
  contradice la palabra clave (`choice cruce (decision):`) es un error de importación.
- **El autocompletado de la pestaña Text ahora también funciona en las líneas de encabezado.** La columna 0
  sugiere las palabras clave de tipo de nodo (`label`, `choice`, `decision`, `subgraph`, `return`,
  `talkmenu`, `flow`) más `scene` y `start`; `start ` sugiere las etiquetas del guion, `talkmenu ` sugiere
  ids de personaje para su argumento `(<personaje>)`, y `jump` y los destinos de ruta reconocen las
  etiquetas declaradas con los nuevos encabezados que empiezan por el tipo. Las palabras clave de encabezado
  se resaltan con el color que su tipo de nodo tiene en el grafo, y la chuleta de sintaxis muestra la forma
  nueva.
- **Los tests internos del asset ya no aparecen en tu Test Runner.** Los ensamblados de tests que viajan con
  el paquete ahora solo compilan cuando está definido el símbolo de scripting `BEASTY_DEV_TOOLS`, así que
  importar el asset ya no llena la ventana Test Runner con sus tests internos. Para ejecutarlos, agrega
  `BEASTY_DEV_TOOLS` en `Project Settings ▸ Player ▸ Scripting Define Symbols`.
- **Una cola de música vacía ahora significa silencio en ese modo.** Entrar en un modo (menú principal,
  novela visual, mundo libre, personalizado) cuya cola de música de fondo no tiene clips funde la música del
  modo anterior en lugar de dejarla sonar para siempre — los clips asignados solo al menú principal ya no
  siguen sonando sobre la partida tras darle a Play o cargar un guardado. Para arrastrar a propósito la
  música anterior a través de un cambio de modo, activa el interruptor **Keep Previous When Empty** del
  controlador, ahora visible en el inspector del Beasty Manager bajo el nuevo desplegable **Background
  Music** (antes estaba oculto, y activado, sin forma de verlo).
- **La música por proyecto ahora se aplica al entrar en una historia.** La cola de música se resolvía antes
  de que existiera la sesión de VN, así que la música propia de un proyecto podía ignorarse — o quedarse la
  del proyecto anterior — al empezar partida nueva, abrir un menú de charla o cargar un guardado; ahora se
  vuelve a resolver cuando la sesión ya está viva. La música del modo actual también arranca al cargar la
  escena sea cual sea el orden de inicialización de los componentes, y el auto-wire mantiene el controlador
  apuntando al mismo asset de configuración de música que edita la pestaña Music.
- **Las puertas y los objetos por fin se pueden eliminar de una sala.** En la línea de tiempo de la sala, las
  fichas de puerta/objeto ganaron un botón ✕, y el inspector del elemento seleccionado un botón «Delete
  door… / Delete object… / Delete pose…». Ambos piden confirmación y además quitan el hijo correspondiente
  del prefab de la sala, en un solo paso de deshacer. Antes, una puerta o un objeto creados no se podían
  quitar desde el editor de ninguna manera.
- **Los perfiles de rutina se pueden eliminar** desde el selector de perfil («Delete profile…», con
  confirmación; el perfil Default integrado se queda). Una rutina de personaje que queda completamente
  vacía — sin colocaciones, sin fallback, sin diálogos de interacción — se poda automáticamente del grafo del
  mapa, en el mismo paso de deshacer que la eliminación que la vació.
- **Eliminar una sala ahora ofrece eliminar también su asset de prefab de sala**, que antes se quedaba
  huérfano en el proyecto (la eliminación del asset no se puede deshacer; el aviso lo dice).
- **El menú de charla completo de un personaje se puede eliminar** («Delete talk menu…», con confirmación y
  deshacer), devolviendo al personaje a su estado de antes de tener menú de charla. Sus textos localizados se
  quedan en la tabla.
- **«Save & apply» en la vista Text del guion ahora se puede deshacer.** Un solo Ctrl+Z restaura el grafo
  entero, sus nodos y los textos de localización a su estado previo a la importación; «Format», enlazar y
  desenlazar un guion también se pueden deshacer. Las importaciones automáticas (guardar el `.vnbeasty` desde
  fuera) no cambian.
- **Deshacer ahora se comporta como un paso por gesto.** Eliminar varios nodos o aristas en el grafo de
  Story, crear una puerta/objeto/pose desde un carril de la línea de tiempo, y Auto-wire / Repair colapsan
  cada uno en un solo paso de deshacer en lugar de varios. Editar una condición de visibilidad de la lista de
  personajes ahora se deshace a sí misma en lugar de deshacer la acción anterior sin relación, los selectores
  de variables e ítems y las consultas de localización se refrescan tras un deshacer en lugar de ofrecer
  entradas obsoletas, y la línea de tiempo de FreeRoam y la grilla de rutinas sueltan una selección que un
  deshacer eliminó en lugar de editar en silencio una copia desconectada.
- **El paquete ya no incluye su propio archivo de licencia.** `BeastyVN_LICENSE.md` desapareció (y también
  los del save system y la consola incluidos): un asset comprado en la Unity Asset Store se licencia bajo el
  EULA de la Asset Store (https://unity.com/legal/as-terms), y una licencia independiente dentro del paquete
  entra en conflicto con él. Cada `Third-Party Notices.txt` ahora apunta a ese EULA. Las copias compradas en
  itch.io reciben su propio archivo de licencia, que se añade a la descarga de itch al empaquetar.

### Persistencia

- Guardados por slot con miniaturas, autoguardados, copias de seguridad y cifrado opcional.
- El estado de los objetos de escena (`BeastySaveable`) viaja dentro del guardado.

### Logging

- Todos los logs de la VN pasan por `VNLog` hasta la ventana Beasty Console
  (`Tools > Beasty Console > Console`), etiquetados con una categoría — Data, Director, Stage,
  Streaming, Save, Verbose — para que puedas silenciar un subsistema ruidoso sin silenciar el resto.
- `VNLog.Enabled` está activo en el editor y en builds de desarrollo, y apagado en una build de release, para
  que un juego publicado no escriba una línea en el log del jugador por cada línea de diálogo, elección y
  cambio de sala. Las advertencias, errores y excepciones ignoran los interruptores por categoría: solo ese
  interruptor maestro las oculta.
- El paquete incluye **Beasty Console** y **Beasty Save System**; al importar este asset tienes la copia
  completa de cada uno, y no hay dependencias externas.
