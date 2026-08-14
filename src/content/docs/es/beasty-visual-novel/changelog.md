---
title: "Historial de cambios"
description: "Todos los cambios relevantes de Beasty Visual Novel, versión por versión. El proyecto sigue Semantic Versioning."
---

Todos los cambios relevantes de Beasty Visual Novel. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.0.1 — 14 de agosto de 2026

### Escritura de la historia

- Corregido: el editor de texto `.vnbeasty` y su chuleta de sintaxis ya no inundan la consola con
  `NullReferenceException` en proyectos que usan el Advanced Text Generator de UI Toolkit — el
  backend de texto por defecto de los proyectos nuevos de Unity 6000.3+. Los colores y la alineación
  de glifos de la capa superpuesta no cambian.

## 1.0.0 — 13 de agosto de 2026

Primera versión pública.

### Demos

- Demo House Demo en `Demos/HouseDemo`: un mini-juego completo que cubre el flujo de introducción,
  mundo libre con dos salas conectadas, fondos de día y de noche, una rutina semanal de NPC, una
  misión de dos pasos, un menú de conversación, pantallas de personaje, guardado y carga, y cambio
  entre inglés y español en vivo. Todo el arte llega como PNG de relleno etiquetados bajo
  `BeastyVN/Sprites/` — sustituye cada archivo (mismo nombre) por el arte final.
- House Demo: dormir en la cama avanza el tiempo, la cama cambia a una variante de arte nocturna, y
  la puerta del dormitorio se ilumina al pasar el cursor.

### Escritura de la historia

- Grafo de nodos (diálogo, elección, decisión, subgrafo, flujo) con un editor por bloques.
- Guion de texto `.vnbeasty`: escribe las escenas como un guion al estilo Ren'Py, mantenido en
  sincronía bidireccional con el grafo. El grafo sigue siendo la fuente de verdad, y una importación
  destructiva deja un `.bak` con fecha y hora.
- Vista previa en el editor de cualquier nodo, hasta cualquier bloque.
- El formato de texto tiene paridad 1:1 con el grafo — todo lo que los nodos pueden expresar se puede
  escribir en texto.
- La cabecera de un nodo empieza por la palabra clave de su tipo: `label`, `choice`, `decision`,
  `subgraph`, `return`, `talkmenu`, `flow`.
- Las variables con punto funcionan en todo el texto: `ana.afecto`, los recuentos `item.<id>` y las
  claves `@time:`/`@quest:`/`@char:`, tanto en condiciones como en efectos.
- Los recuentos de objetos empiezan en `0`: una partida nueva siembra `item.<id>` para cada objeto
  del catálogo.
- Las erratas avisan al importar: los nombres desconocidos de variables, objetos, misiones, objetivos
  y pantallas reciben una advertencia con su número de línea.
- El autocompletado del editor de texto ofrece el catálogo completo de variables, las palabras clave
  de nodo, las etiquetas, las claves de retrato y los anclajes, y la pestaña Text incluye una chuleta
  de sintaxis.
- Un bloque `Wait` retiene el flujo durante sus segundos antes de que aparezca la siguiente línea; un
  Wait de `0` segundos es una barrera de autoavance.
- Los nodos del grafo se pueden copiar, cortar, pegar y duplicar entre ventanas y assets de escena,
  acuñando claves de localización nuevas para que editar una copia nunca edite el original.
- «Save & apply» en la vista Text se deshace en un solo paso, igual que «Format» y enlazar o
  desenlazar un guion.

### Mundo

- Salas de mundo libre con fondos condicionales, puertas e interactuables.
- Tiempo de juego (momentos del día o reloj), rutinas de personaje con perfiles, y un editor de
  grilla de rutinas.
- Misiones con etapas, objetivos, recompensas y un núcleo de menú de conversación por personaje.
- Las puertas, objetos y poses se pueden eliminar desde la línea de tiempo de la sala — hijo del
  prefab incluido — en un solo paso de deshacer.
- Los perfiles de rutina se pueden eliminar, y una rutina de personaje completamente vacía se poda
  del grafo del mapa automáticamente.
- El menú de conversación entero de un personaje se puede eliminar, con confirmación y deshacer.

### Presentación

- Pantallas de diálogo, elecciones, historial, guardado/carga, preferencias y ayuda, todas
  localizables.
- Tablas de localización con seguimiento de celdas obsoletas e importación y exportación CSV/TSV.
- Los idiomas se añaden desde un desplegable de 15 idiomas curados más `Custom…`; añadir uno curado
  rellena de antemano los textos de interfaz integrados en ese idioma.
- Eliminar un idioma pide confirmación y lo mueve a una papelera de **idiomas eliminados**
  restaurable en vez de destruir sus textos.
- Eliminar el idioma PRINCIPAL asciende al siguiente; las operaciones de idioma se aplican a la tabla
  de la historia y a la tabla global de interfaz a la vez.
- Una línea sin traducción en el idioma activo muestra el texto del idioma de origen en vez de un
  hueco en blanco.
- **Bake Localized UI Labels**: añade `VNLocalizedText` de forma permanente a cada etiqueta
  coincidente de la escena, escribiendo en los prefabs de origen.
- El inspector de `VNLocalizedText` puede crear una clave `ui.*` nueva a partir del texto de una
  etiqueta con un botón.
- El inspector de `VNLocalizedText` también edita el texto del idioma de origen de la clave en el
  sitio, con los botones de sincronización «From label» y «To label».
- Cambiar de idioma dentro del juego también cambia los menús y el HUD: al arrancar, las etiquetas
  que coinciden con un texto de interfaz integrado se adaptan automáticamente.
- La ventana Story sigue los cambios de idioma — eliminar, restaurar, renombrar — al instante.
- La tabla global de localización de interfaz se repara sola: las pasadas de configuración y Repair
  adoptan una tabla sin asignar, y solo crean una nueva cuando no existe ninguna.
- Una pregunta de variable tipada muestra el campo que su tipo pide (un Bool muestra un desplegable
  verdadero/falso).
- La música de fondo se configura por modo (menú principal, novela visual, mundo libre,
  personalizado); una cola vacía significa silencio en ese modo.
- Streaming opcional de los assets de los nodos con Addressables (**beta**).

### Guardado

- Nueva sección **Saving** de primer nivel en el Inspector del BeastyManager: backend, ubicación,
  cifrado, miniaturas y la política global de guardado en un solo sitio.
- Los backends de almacenamiento en la nube (módulos Firestore / Realtime Database de Beasty Save
  System 1.1) funcionan de punta a punta. Requiere el SDK de Firebase; sin él nada cambia.
- Con un backend en la nube, las miniaturas de ranura viajan dentro del guardado y reconstruyen la
  caché local en cualquier dispositivo.
- Las miniaturas de las ranuras ya no muestran el menú de pausa: la captura se toma antes de que se
  dibuje.
- La sección Saving replica la agrupación del Save System y añade por proyecto la ruta de datos, la
  copia de seguridad, la carga estricta y la versión de datos.

### Persistencia

- Guardados por ranura con miniaturas, autoguardados, copias de seguridad y cifrado opcional.
- El estado de los objetos de escena (`BeastySaveable`) viaja dentro del guardado.

### Logging

- Cada log de la novela visual pasa por `VNLog`, etiquetado con una categoría, así que un subsistema
  ruidoso se puede silenciar sin silenciar el resto.
- `VNLog.Enabled` está activo en el editor y en las builds de desarrollo y apagado en una build de
  lanzamiento; las advertencias, errores y excepciones siempre pasan.
- El paquete incluye **Beasty Save System** y no tiene dependencias externas. **Beasty Console no
  viene incluida**: es su propio asset, y opcional.
- Beasty Console se alcanza por reflexión, nunca por referencia de ensamblado: la novela visual
  compila y funciona con o sin ella.

### Editor

- Deshacer se comporta como un paso por gesto en el grafo Story, en la línea de tiempo de la sala y
  en Auto-wire / Repair.
- Los ensamblados de pruebas internos solo se compilan con el scripting define `BEASTY_DEV_TOOLS`.

### Licencia

- El paquete no incluye un archivo de licencia propio: las copias de la Asset Store se licencian bajo
  la EULA de la Asset Store; las copias de itch.io reciben su propio archivo de licencia al
  empaquetar.

### Compatibilidad

- Compila en todas las generaciones de Unity 6, incluida la deprecación de `GetInstanceID` de la 6.5
  (el paquete llama a `GetEntityId` en 6.4+).
- Importa sin advertencias de deprecación en Unity 6.4/6.5, con el comportamiento intacto.
- Unity 6.2/6.3 también importan sin advertencias (la única API marcada de forma anticipada mantiene
  su advertencia suprimida en el punto de llamada).
