---
title: "Proyectos grandes"
description: "Un juego de veinte horas no es uno de dos horas con más nodos. Las partes del paquete pensadas para escalar y los hábitos que sostienen una producción larga."
---

Un juego de veinte horas no es un juego de dos horas con más nodos. Esta página trata de las partes del
paquete construidas para escalar, y de los hábitos que evitan que una producción larga se estanque.

## Lo que el editor ya hace por ti

No tienes que preparar nada de esto; las ventanas ya funcionan así.

- **Listas virtualizadas.** Las listas de variables, misiones, ítems, personajes, salas y nodos dibujan solo
  las filas que están en pantalla. Una lista con miles de entradas se desplaza tan rápido como una lista con
  diez.
- **Búsqueda y agrupación** en esas listas, así que encontrar una variable entre miles es cuestión de
  escribir, no de desplazarse.
- **Selección múltiple y borrado masivo.** Clic, shift-clic para un rango, ctrl-clic para agregar — luego
  **Delete selected (N)**. Disponible en las listas de variables, ítems, misiones, personajes y pantallas.
  Limpiar un centenar de banderas obsoletas es una sola operación.
- **Maestro-detalle para variables de personaje.** La lista de personajes está a la izquierda, los campos de ese
  personaje a la derecha, en lugar de una lista plana de cada campo de cada personaje.

## Dividir la historia entre escenas

No escribas un juego de veinte horas como un solo `DialogueScene`. Divídelo — por capítulo, por acto, por ruta
— y muévete entre ellos con el bloque de flujo **Go to VN scene** (o la línea `goto-scene` en un guion de
texto).

Lo que hace que esto funcione: **el almacén de variables sobrevive al salto**. El Capítulo 2 arranca con
cada bandera, cada stat de personaje, el reloj del juego, los estados de las misiones y el inventario
exactamente como los dejó el Capítulo 1, porque todo vive en un solo almacén que pertenece al juego, no a la
escena. También puedes entrar a un nodo específico de la escena destino en lugar de a su nodo de entrada.

Qué ganas con esto:

- Cada escena es un asset más pequeño, así que el lienzo del grafo, el guion de texto y la tabla de
  localización se mantienen manejables.
- Dos escritores pueden trabajar en dos capítulos a la vez sin pelearse por un mismo archivo.
- La exportación por **Section** de la pestaña Localization te permite entregar un capítulo a un traductor.

## Reutilización con subgrafos

Cualquier cosa que escribas más de una vez debería ser un subgrafo: una tienda, una pelea, una escena de "hacer
té", una secuencia de sueño. Un nodo de subgrafo llama a un grafo anidado y enruta según el resultado que este
devuelve, así que una misma secuencia sirve a todos los que la llaman, y cada uno decide qué pasa después.
Consulta [Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/).

El validador comprueba que cada llamador enrute todos los resultados que el subgrafo puede devolver, o tenga
un respaldo — justo el fallo que aparece cuando a un subgrafo le agregas un final nuevo tarde en la
producción.

## Mantener manejable la localización

La tabla de traducción de un juego largo es grande, y reenviarla completa cada vez que tocas una línea desperdicia
el tiempo de tu traductor y tu dinero.

- Exporta **Missing or stale only**. Contiene exactamente las celdas que necesitan trabajo, y nada más. Como
  cada celda traducida recuerda el texto de origen del que se tradujo, la exportación sigue siendo precisa
  por más que reescribas.
- Exporta **por sección** para entregar un capítulo a la vez.
- Barre **Unused keys** periódicamente. Cuando eliminas contenido de la historia, sus claves quedan atrás.

Consulta [Localización](/es/docs/beasty-visual-novel/production/localization/).

## Cuándo activar el streaming

Actívalo cuando el arte sea de verdad el problema — un juego largo cuyos fondos y sprites de personaje no
necesitan estar todos cargados en memoria a la vez, o una plataforma con memoria limitada. Es opcional, y está
en beta, así que activarlo es una decisión deliberada, no un valor predeterminado. Y es reversible en
cualquier momento.

Consulta [Streaming](/es/docs/beasty-visual-novel/production/streaming/).

## Ejecuta el validador regularmente

El costo de una referencia colgante crece con el tamaño del proyecto: en un juego pequeño lo notas la próxima
vez que juegas; en uno grande se queda en una rama que nadie ha recorrido en tres meses. Ejecuta
`Tools > Beasty VN > Maintenance > Validate Selected Project` en cada escena como parte de tu rutina, no solo
antes de una compilación.

Duplicar assets en la ventana Project también es más común en un equipo grande — así que ejecuta
`Find duplicate ids` cuando las cosas empiecen a comportarse raro. Consulta
[Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/).

## Ver también

- [Streaming](/es/docs/beasty-visual-novel/production/streaming/), [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/), [Localización](/es/docs/beasty-visual-novel/production/localization/).
- [Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/) y [Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/) — reutilización, y moverse
  entre escenas y modos.
- [El guion de texto](/es/docs/beasty-visual-novel/authoring/text-script/) — escribir una escena como texto, que escala de forma distinta al
  lienzo.
