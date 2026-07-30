---
title: "Preguntas frecuentes"
description: "Respuestas a las dudas más comunes: solape con la Consola de Unity, archivos de log, el costo en una build, niveles propios y logs que desaparecen."
---

Respuestas cortas, con un enlace a la página que tiene la larga.

## ¿Reemplaza a la Consola de Unity?

No. La Beasty Console escucha en paralelo a la Consola de Unity, sobre el mismo flujo de logs. Ambas
ventanas muestran las mismas entradas; la de Beasty las clasifica por nivel y te permite filtrar y buscar.
Si quieres, deja abierta la Consola de Unity — no hay ningún conflicto entre las dos.

## ¿Escribe un archivo de log?

No. Llama a `UnityEngine.Debug` y nada más. La persistencia es la que Unity ya te da, que en una build de
escritorio es `Player.log`. Si necesitas un archivo propio, escríbelo desde tu propio código.

## ¿Cuesta rendimiento en una build de lanzamiento?

Sí, a menos que tomes medidas. Los métodos de logging no se eliminan (stripped): la llamada se hace y el
mensaje se construye incluso cuando `IsEnabled` es false. Este es el punto delicado del paquete y está
documentado en detalle en [Builds de lanzamiento](/es/docs/beasty-console/guides/release-builds/). Lee esa página antes de
esparcir llamadas de log por un bucle crítico (hot loop).

## ¿Necesito los demás paquetes Beasty?

No. El logger no referencia nada y funciona por sí solo. Si además tienes Beasty Visual Novel o Beasty Save
System, consulta [Trabajar con los demás paquetes Beasty](/es/docs/beasty-console/guides/beasty-integration/).

## ¿Puedo agregar mi propio nivel?

No como un nivel nuevo. Los once niveles son fijos: cada uno tiene una etiqueta, un color y un toggle de
filtro en la consola, y el clasificador los identifica.

Lo que sí puedes hacer:

- usar la sobrecarga `LogColor` de `Log` para colorear un mensaje sin la etiqueta de un nivel;
- escribir una fachada estática ligera sobre la API que anteponga tu propia etiqueta y maneje tus propios
  interruptores, y loguear a través de ella. Beasty Visual Novel hace exactamente eso. Consulta
  [Logging](/es/docs/beasty-console/guides/logging/) y [Trabajar con los demás paquetes Beasty](/es/docs/beasty-console/guides/beasty-integration/).

## ¿Por qué a mi mensaje le falta una parte?

Porque contenía corchetes angulares. La consola elimina de la visualización todo lo que está entre `<` y
`>`, para que el marcado de color de rich-text no aparezca como texto literal. Un mensaje como
`Deprecated call: GetComponent<Rigidbody2D>` aparece en la fila como `Deprecated call: GetComponent`.

El mensaje llegó a Unity intacto — solo se ve afectada la visualización. Si los corchetes importan, escribe
el mensaje sin ellos. Consulta [La ventana Beasty Console](/es/docs/beasty-console/guides/console-window/).

## ¿Por qué desaparecieron mis logs?

La causa más probable es una recompilación de scripts. Un domain reload limpia la lista de la consola, así
que todo lo logueado antes de la compilación desaparece.

Las otras dos causas posibles: que Clear on Play esté activado y hayas entrado en Play Mode, o que el toggle
de filtro del nivel esté desactivado — las entradas están ahí, solo que ocultas. El contador del toggle sigue
sumando de todas formas.

## Antes la consola estaba bajo el menú Beasty VN. ¿Dónde está ahora?

En `Tools > Beasty Console > Console`. El paquete tiene su propio menú: es un asset independiente, así que ya
no cuelga de `Tools > Beasty VN > Diagnostics` y se abre en un proyecto que no tenga Beasty Visual Novel
instalado. Lo demás de la ventana no cambia.
