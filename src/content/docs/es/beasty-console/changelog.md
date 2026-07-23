---
title: "Historial de cambios"
description: "Todos los cambios relevantes de Beasty Console, versión por versión. El proyecto sigue Semantic Versioning."
---

Todos los cambios relevantes de Beasty Console. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.0.0 — sin publicar

Primera versión pública.

### API de logging

- Once niveles semánticos en una sola clase estática — info, verbose, trace, debug, notice, highlight,
  caution, success, warning, error y exception — para que un mensaje diga qué clase de mensaje es en el
  mismo punto donde lo escribes.
- Solo warning, error y exception elevan la severidad de Unity. `LogCaution` es un aviso suave: no dispara
  Error Pause ni aparece como advertencia en la consola de Unity.
- Etiquetas con color y glifo en el editor, y en ASCII plano en una build, para que el `Player.log` del
  jugador siga siendo legible en un editor de texto.
- Un parámetro `context` en cada método: le pasas un `GameObject` y la entrada se vuelve clicable, señalando
  el objeto en la jerarquía.
- Un `canPrint` por llamada, para que un log concreto quede detrás de tu propio interruptor de depuración
  sin envolverlo en un `if`.
- `IsEnabled`, un interruptor maestro que silencia todos los niveles en tiempo de ejecución. Vuelve a `true`
  al inicializarse el runtime, así que hay que ponerlo después del arranque.
- `PrintLongMessage` parte un texto muy largo en trozos y registra cada uno, para que Unity no lo trunque.

### La ventana Beasty Console

- Una consola de editor en `Tools > Beasty VN > Diagnostics > Console` que clasifica cada entrada por su nivel.
- Filtros por nivel con recuentos en vivo, campo de búsqueda, Collapse, Clear on Play y Error Pause.
- Un panel de detalle cuyas líneas de traza abren el archivo en la línea exacta dentro de tu IDE.

### Dependencias y plataformas

- **Sin dependencias externas.** Dos ensamblados: `Beasty.Console` (runtime, todas las plataformas) y
  `Beasty.Console.Editor` (la ventana). Ninguno referencia nada fuera de Unity.
- Beasty Save System detecta este asset por reflexión y encamina sus logs a través de él cuando está
  presente, pero ninguno de los dos paquetes necesita al otro: ambos se pueden comprar e importar por
  separado.
- Mono e IL2CPP.

### Cambios previos a la publicación

Cambios de comportamiento hechos antes de que salga la 1.0.0.

- **El asset ahora se llama Beasty Console**, no Beasty Debug Logger. La clase que llamas es `BeastyConsole`
  (antes `BeastyDebugLogger`), en el espacio de nombres `BeastyConsoleLogger` (antes
  `BeastyDebugLoggerConsole`); los ensamblados son `Beasty.Console` y `Beasty.Console.Editor` (antes
  `Beasty.DebugLogger` y `Beasty.DebugLogger.Editor`); y la carpeta es
  `Assets/BeastyComponents/BeastyConsole` (**breaking**: hay que renombrar el `using BeastyDebugLoggerConsole;`
  y cada llamada `BeastyDebugLogger.Log*`). Los nombres y firmas de los métodos, la ventana de consola y su
  entrada de menú `Tools > Beasty VN > Diagnostics > Console` no cambian.
- **La detección por reflexión sigue el nombre nuevo.** Beasty Save System ahora busca
  `BeastyConsoleLogger.BeastyConsole, Beasty.Console`, así que sus logs siguen llegando a esta ventana. Una
  copia del save system de una build anterior busca el ensamblado viejo, no lo encuentra, y cae a la consola
  de Unity hasta que también se actualice.
