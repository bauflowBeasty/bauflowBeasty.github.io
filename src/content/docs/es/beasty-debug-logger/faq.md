---
title: "Preguntas frecuentes"
description: "No. La Beasty Console escucha en paralelo a la Consola de Unity, sobre el mismo flujo de logs. Ambas ventanas muestran las mismas entradas; la de Beasty las clasifica por nivel"
---

## ¿Reemplaza a la Consola de Unity?

No. La Beasty Console escucha en paralelo a la Consola de Unity, sobre el mismo flujo de logs. Ambas
ventanas muestran las mismas entradas; la de Beasty las clasifica por nivel y te permite filtrar y buscar.
Mantén abierta la Consola de Unity si te gusta — nada entra en conflicto.

## ¿Escribe un archivo de log?

No. Llama a `UnityEngine.Debug` y nada más. La persistencia es la que Unity ya te da, que en una build de
escritorio es `Player.log`. Si necesitas tu propio archivo, escríbelo desde tu propio código.

## ¿Cuesta rendimiento en una build de lanzamiento?

Sí, a menos que tomes medidas. Los métodos de logging no se eliminan (stripped): la llamada se hace y el
mensaje se construye incluso cuando `IsEnabled` es false. Este es el punto delicado del paquete y está
documentado en detalle en [Builds de lanzamiento](/es/docs/beasty-debug-logger/guides/release-builds/). Lee esa página antes de
esparcir llamadas de log por un bucle crítico (hot loop).

## ¿Necesito los demás paquetes Beasty?

No. El logger no referencia nada y funciona por sí solo. Si además tienes Beasty Visual Novel o Beasty Save
System, consulta [Trabajar con los demás paquetes Beasty](/es/docs/beasty-debug-logger/guides/beasty-integration/).

## ¿Puedo agregar mi propio nivel?

No como un nivel nuevo. Los once niveles son fijos: cada uno tiene una etiqueta, un color y un toggle de
filtro en la consola, y el clasificador los identifica.

Lo que puedes hacer en su lugar:

- usar la sobrecarga `LogColor` de `Log` para colorear un mensaje sin la etiqueta de un nivel;
- escribir una fachada estática delgada sobre la API que anteponga tu propia etiqueta y mantenga tus propios
  interruptores, y loguear a través de ella. Beasty Visual Novel hace exactamente esto. Consulta
  [Logging](/es/docs/beasty-debug-logger/guides/logging/) y [Trabajar con los demás paquetes Beasty](/es/docs/beasty-debug-logger/guides/beasty-integration/).

## ¿Por qué a mi mensaje le falta una parte?

Porque contenía corchetes angulares. La consola elimina de la visualización todo lo que está entre `<` y
`>`, para que el marcado de color de rich-text no aparezca como texto literal. Un mensaje como
`Deprecated call: GetComponent<Rigidbody2D>` aparece en la fila como `Deprecated call: GetComponent`.

El mensaje llegó a Unity intacto — solo se ve afectada la visualización. Si los corchetes importan, escribe
el mensaje sin ellos. Consulta [La ventana Beasty Console](/es/docs/beasty-debug-logger/guides/console-window/).

## ¿Por qué desaparecieron mis logs?

Lo más probable es una recompilación de script. Un domain reload limpia la lista de la consola, así que todo
lo logueado antes de la compilación desaparece.

Los otros dos candidatos: Clear on Play está activado, y entraste en Play Mode; o el toggle de filtro del
nivel está desactivado, así que las entradas están ahí pero ocultas. El contador del toggle sigue contando
de todas formas.

## ¿Por qué la ventana está bajo el menú Beasty VN?

`Tools > Beasty VN > Diagnostics > Console` es una ruta de menú compartida, no una dependencia. El logger no
referencia Beasty Visual Novel y funciona sin él.
