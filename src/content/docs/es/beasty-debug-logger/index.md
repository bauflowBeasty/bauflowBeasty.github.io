---
title: "Beasty Debug Logger"
description: "Una API de logging estática con niveles semánticos que llamas en lugar de Debug.Log, más una consola de editor que clasifica, filtra y busca en todos los logs de tu proyecto."
---

Beasty Debug Logger es una API de logging estática con niveles semánticos (info, verbose, trace, debug, notice,
highlight, caution, success, warning, error, exception) que llamas en lugar de `Debug.Log`. También incluye
una ventana de consola de editor que clasifica, filtra y busca en todos los logs que produce tu proyecto.

Es para cualquiera que haya perdido un error real entre un muro de mensajes de `Debug.Log`: etiquetas cada
mensaje con un nivel mientras lo escribes, y después desactivas niveles hasta que solo queden los que te
importan.

## Cero dependencias

El paquete no referencia nada. Incluye dos assemblies, `Beasty.DebugLogger` (runtime, todas las plataformas)
y `Beasty.DebugLogger.Editor` (la ventana de consola). No necesita los demás paquetes Beasty, y ellos tampoco
lo necesitan a él. Consulta [Integración con Beasty](/es/docs/beasty-debug-logger/guides/beasty-integration/).

## Qué obtienes

- Once niveles de logging, cada uno con su propia etiqueta y color, en una sola clase estática.
- Etiquetas de color y glifo en el editor, etiquetas ASCII simples en una build, de modo que el `Player.log`
  de un jugador se mantenga legible.
- Un parámetro `context`: pasa un GameObject y la entrada de log lo resalta (ping) en la Jerarquía.
- Un flag `canPrint` por llamada, para que un solo log pueda depender de tu propio interruptor de debug
  por sistema.
- Un interruptor maestro, `IsEnabled`, que silencia todos los niveles en tiempo de ejecución.
- `PrintLongMessage`, que divide un string muy largo en fragmentos para que Unity no lo trunque.
- La ventana Beasty Console: toggles de filtro por nivel con recuentos en vivo, un campo de búsqueda, Collapse,
  Clear on Play, Error Pause, y un panel de detalle cuyas líneas de stack trace abren el archivo en tu IDE.

## Por dónde empezar

- [Primeros pasos](/es/docs/beasty-debug-logger/getting-started/) — instálalo, escribe un log, abre la consola.
- [Logging](/es/docs/beasty-debug-logger/guides/logging/) — cada nivel y cuándo usarlo.
- [La ventana Beasty Console](/es/docs/beasty-debug-logger/guides/console-window/) — la ventana, control por control.
- [Builds de lanzamiento](/es/docs/beasty-debug-logger/guides/release-builds/) — lo que realmente te cuesta el logging en un juego lanzado.
- [Referencia de la API](/es/docs/beasty-debug-logger/reference/api/) — todos los miembros públicos.
- [Preguntas frecuentes](/es/docs/beasty-debug-logger/faq/)
