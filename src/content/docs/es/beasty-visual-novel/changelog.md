---
title: "Historial de cambios"
description: "Todos los cambios relevantes de Beasty Visual Novel, versión por versión. El proyecto sigue Semantic Versioning."
---

Todos los cambios relevantes de Beasty Visual Novel. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.0.0 — 6 de agosto de 2026

Primera versión pública.

### Demos

- Demo House Demo en `Demos/HouseDemo`: un mini-juego completo que enseña el flujo de introducción
  (pregunta para renombrar al jugador, elecciones de perfil, enrutado con decisiones invisibles), mundo
  libre con dos salas conectadas, fondos de día y de noche, una rutina semanal de NPC, una misión de dos
  pasos con recogida al inventario y un paso de entrega, un menú de conversación con entradas
  condicionales, pantallas de perfil/estadísticas/calendario del personaje, guardado y carga, y cambio
  entre inglés y español en vivo. Todo el arte llega como PNG de relleno etiquetados bajo
  `Demos/HouseDemo/Sprites/` — sustituye cada archivo (mismo nombre) por el arte final; no hay que
  recablear ninguna referencia. El guion vive en `Demos/HouseDemo/Scripts/*.vnbeasty` (el formato de
  guion de texto, mantenido en sincronía).

### Escritura de la historia

- Grafo de nodos (diálogo, elección, decisión, subgrafo, flujo) con un editor basado en bloques.
- Script de texto `.vnbeasty`: escribe escenas como un script estilo Ren'Py, sincronizado en ambos sentidos con
  el grafo. El grafo sigue siendo la fuente de verdad — un script vacío, imposible de parsear o irrepresentable
  nunca lo sobrescribe, y una importación destructiva deja un `.bak` con marca de tiempo.
- Vista previa en el editor de cualquier nodo, hasta cualquier bloque.
- El formato de texto tiene paridad 1:1 con el grafo — todo lo que los nodos pueden expresar se escribe en
  texto: nodos de menú de conversación, la imagen lateral del nodo de elección, atrezo, fondos en capas con
  desplazamiento/parallax/orden, `show … portrait <clave> slot <n>`, el `clear characters at <ancla>`
  posicional, y nombres de personaje localizados.
- Un encabezado de nodo empieza por su palabra clave de tipo: `label intro:` es un nodo de diálogo, y
  `choice cross:`, `decision route:`, `subgraph combat:`, `return combat/done ("win"):`,
  `talkmenu charla (ana):` y `flow to_town:` declaran los demás tipos.
- Las variables con punto funcionan en cualquier parte del texto: `ana.afecto` en una condición o en un
  bloque de efecto compila a la misma clave del almacén por personaje que escribe `set ana.afecto`;
  `item.<id>` y las claves `@time:`/`@quest:`/`@char:` valen como tokens de condición, y `set item.<id>`
  pasa por el inventario (con su límite incluido).
- Las erratas avisan al importar: los tokens de condición, las claves de efecto, las claves de
  `set`/`toggle`/`dict`, los ids de objeto, los ids de misión, los objetivos y los ids de pantalla se
  comprueban contra lo declarado en el proyecto, y un nombre desconocido da una advertencia con su número
  de línea en lugar de crear en silencio una clave muerta en ejecución.
- El autocompletado del editor de texto ofrece el mismo catálogo que usa el selector de condiciones del
  grafo — todos los grupos de variables (globales, campos de personaje como `ana.afecto`, recuentos
  `item.<id>`, tokens de diccionario, claves reservadas `@time:`/`@quest:`) — más las palabras clave de
  tipo de nodo en las líneas de encabezado, las etiquetas, las claves de `portrait` y las anclas. Las
  palabras clave de encabezado se resaltan con el color que su tipo de nodo tiene en el grafo, y la pestaña
  Text trae una chuleta de sintaxis.
- Un bloque `Wait` retiene el flujo durante sus segundos ANTES de que aparezca la siguiente línea: los
  clics se tragan durante la pausa, retroceder la cancela, Skip la acelera, y una revisita tras un
  rebobinado no vuelve a esperar (como los efectos secundarios, la pausa corre una sola vez). Un Wait de
  `0` segundos es una barrera para el avance automático: Auto se detiene ahí y espera un avance manual.
- Los nodos del grafo de Story se pueden copiar, cortar, pegar y duplicar (menú contextual o Ctrl+C/X/V/D),
  entre ventanas Story y entre assets de escena. Un pegado clona la selección con ids de nodo nuevos, clona
  en profundidad los subgrafos, conserva las conexiones entre los nodos copiados, y acuña claves de
  localización NUEVAS cuyas filas copian todas las columnas de idioma — así que editar el texto de una
  copia nunca edita el del original.
- «Save & apply» en la vista Text del guion se deshace en un solo paso — un Ctrl+Z restaura el grafo
  entero, sus nodos y los textos de localización a su estado previo a la importación — igual que «Format»,
  enlazar y desenlazar un guion. Las importaciones automáticas (guardar el `.vnbeasty` desde fuera) no.

### Mundo

- Salas de mundo libre con fondos condicionales, puertas e interactuables.
- Tiempo de juego (momentos del día o reloj), rutinas de personajes con perfiles, y un editor de rutinas en
  cuadrícula.
- Misiones con etapas, objetivos, recompensas y un menú de conversación por personaje.
- Las puertas, los objetos y las poses se pueden eliminar desde la línea de tiempo de la sala (el botón ✕
  de la ficha, o un botón «Delete…» en el inspector del elemento), con confirmación, quitando el hijo
  correspondiente del prefab de la sala en un solo paso de deshacer. Eliminar una sala ofrece eliminar
  también su asset de prefab de sala — la eliminación del asset no se puede deshacer, y el aviso lo dice.
- Los perfiles de rutina se pueden eliminar desde el selector de perfil (el perfil Default integrado se
  queda), y una rutina de personaje que queda completamente vacía — sin colocaciones, sin fallback, sin
  diálogos de interacción — se poda automáticamente del grafo del mapa.
- El menú de charla completo de un personaje se puede eliminar (con confirmación y deshacer), devolviendo
  al personaje a su estado de antes de tener menú de charla; sus textos localizados se quedan en la tabla.

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
- Cambiar de idioma en el juego cambia también los menús y el HUD: al arrancar, `BeastyManager` añade
  `VNLocalizedText` a cualquier etiqueta cuyo texto coincida con un valor de interfaz que trae el paquete
  (en cualquier idioma), así que las escenas y prefabs existentes siguen el idioma del jugador sin que
  tengas que rehacer nada. Los textos propios de tus etiquetas nunca se tocan. La pestaña de localización
  de UI (global) muestra además un botón de reparación cuando la columna de origen de la tabla no es el
  inglés.
- La ventana Story sigue los cambios de idioma: eliminar, restaurar o renombrar un idioma vuelve a resolver
  al instante las vistas previas de las tarjetas de nodo y el selector de idioma de autoría, y una
  selección de idioma de autoría que ya no existe cae al idioma principal en lugar de mostrar inglés en
  silencio.
- La tabla global de localización de la interfaz se repara sola: cada setup de escena y cada pasada de
  Auto-wire / Repair adoptan y recablean una tabla `UILocalization` que existe pero está sin asignar, y
  solo cuando no existe ninguna se crea una nueva junto al asset de ajustes, pre-sembrada con los textos de
  interfaz integrados. La comprobación solo mezcla — una tabla sana, sus claves personalizadas y cada
  traducción editada no se tocan nunca. El contenido propio de una tabla BORRADA (claves personalizadas,
  nombres y descripciones de objetos, tus traducciones) no se recupera; la regeneración restaura los textos
  integrados.
- Una pregunta de variable con tipo muestra la entrada que su tipo pide (un `Ask → variable` sobre un Bool
  muestra un desplegable true/false). Cuando la definición de la variable de una pregunta no se encuentra,
  la consola explica dónde mirar (el campo «Game Context» de VNSettings) y la pregunta cae a un campo de
  texto libre en lugar de degradarse sin dejar rastro.
- La música de fondo se configura por modo (menú principal, novela visual, mundo libre, personalizado), con
  música propia por proyecto, bajo el desplegable **Background Music** del Beasty Manager. Una cola vacía
  significa silencio en ese modo: al entrar, la música del modo anterior se funde. Para arrastrar a
  propósito la música anterior a través de un cambio de modo, activa el interruptor **Keep Previous When
  Empty** del controlador.
- Streaming opcional de assets de nodos con Addressables (**beta**).

### Guardado

- Nueva sección **Saving** de primer nivel en el Inspector del BeastyManager: backend de
  almacenamiento, ubicación de los guardados, cifrado, tamaño de las miniaturas y la política global
  de guardado (autoguardado, slots por página, nombres) en un solo sitio.
- **Backends de almacenamiento en la nube** (los módulos Firestore / Realtime Database de Beasty Save
  System 1.1) funcionan de punta a punta: eliges el backend en el desplegable Storage y la pantalla de
  guardar/cargar, la cola de autoguardado, el listado de slots, el borrado y la restauración de copias
  de seguridad trabajan contra él (asíncrono por debajo, sin nada más que configurar). Requiere el SDK
  de Firebase; sin el SDK instalado nada cambia.
- Con un backend en la nube, las **miniaturas viajan dentro del guardado** y reconstruyen la caché
  local de miniaturas en cualquier dispositivo; los guardados locales siguen escribiendo el PNG vecino
  exactamente como antes.
- Las **miniaturas de los slots ya no muestran el menú de pausa/juego**: la captura se toma en el
  momento en que el menú se abre, antes de que se dibuje (los autoguardados siguen capturando la escena
  en vivo).
- La sección Saving del BeastyManager es ahora un foldout con caja como las secciones de managers, con
  una insignia que muestra el backend activo («Active · Firebase Firestore» con un backend en la nube,
  «Local file» en el resto). Dentro, la configuración de almacenamiento replica la agrupación del Save
  System (Backend, Location, Security, Reliability, Versioning) y expone cuatro ajustes nuevos por
  proyecto: ruta de datos (vacía = la de la plataforma), copia de seguridad, carga estricta y versión
  de datos — todos llegan a la capa de guardado.

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
- A Beasty Console se llega por reflexión, nunca por referencia de ensamblado: con el asset de la consola
  fuera del proyecto, `VNLog` cae a `UnityEngine.Debug`, así que la VN compila y funciona con él o sin él —
  e importar Beasty Console junto a un proyecto que ya lo incluye no puede producir un error de ensamblado
  duplicado.

### Editor

- Deshacer se comporta como un paso por gesto: eliminar varios nodos o aristas en el grafo de Story, crear
  una puerta/objeto/pose desde un carril de la línea de tiempo, y Auto-wire / Repair colapsan cada uno en
  un solo paso de deshacer.
- Los ensamblados de tests internos del asset solo compilan cuando está definido el símbolo de scripting
  `BEASTY_DEV_TOOLS`, así que importar el asset no llena la ventana Test Runner con sus tests internos.
  Para ejecutarlos, agrega `BEASTY_DEV_TOOLS` en `Project Settings ▸ Player ▸ Scripting Define Symbols`.

### Licencia

- El paquete no incluye un archivo de licencia propio: un asset comprado en la Unity Asset Store se
  licencia bajo el EULA de la Asset Store (https://unity.com/legal/as-terms), y cada
  `Third-Party Notices.txt` apunta a él. Las copias compradas en itch.io reciben su propio archivo de
  licencia, que se añade a la descarga de itch al empaquetar.

### Compatibilidad

- Compila en todas las generaciones de Unity 6, incluida Unity 6.5, donde `Object.GetInstanceID()` pasó a ser
  un error de compilación (`error CS0619: 'GetInstanceID is deprecated. Use GetEntityId instead.'`). El
  paquete llama al reemplazo `GetEntityId` en Unity 6.4 y posteriores, y mantiene `GetInstanceID` en 6.0–6.3,
  donde la API nueva todavía no existe.
- Importar en Unity 6.4/6.5 tampoco imprime advertencias de deprecación: las búsquedas en escena usan
  `FindAnyObjectByType` y, en 6.4+, las sobrecargas sin ordenar de `FindObjectsByType` y
  `ContactFilter2D.noFilter` (cada búsqueda reemplazada apuntaba a un solo objeto, así que el comportamiento
  no cambia), y se eliminaron dos campos de inspector que nunca se usaron (las etiquetas de encabezado
  Day/Week de `CharacterRoutineScreen`).
- Unity 6.2/6.3 también importan sin advertencias: ahí `ContactFilter2D.NoFilter()` ya está marcada como
  deprecada pero sigue siendo la API correcta (su reemplazo llegó en 6.4), así que su advertencia se suprime
  en el punto de llamada en lugar de cambiar de API antes de tiempo.
