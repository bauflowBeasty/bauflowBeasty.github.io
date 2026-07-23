---
title: "Trabajar con los demás paquetes Beasty"
description: "Cómo usan este logger Beasty Visual Novel y Beasty Save System. Lee esto si tienes más de uno de ellos; si solo tienes el logger, puedes saltártelo."
---

Cómo usan este logger Beasty Visual Novel y Beasty Save System. Lee esto si tienes más de uno de ellos; si
solo tienes el logger, puedes saltártelo.

Cada paquete se vende y se importa por separado, y cada uno funciona por sí solo. Nada aquí es una
dependencia que tengas que satisfacer.

## Beasty Visual Novel

[Beasty Visual Novel](/es/docs/beasty-visual-novel/) referencia este logger directamente y loguea a través
de su propia fachada, `VNLog`. La fachada suma tres cosas por encima de la API:

![La consola con logs de Beasty VN, etiquetados por categoría](/docs-images/beasty-console/log-vn-categories.png)

- una etiqueta `[BeastyVN]` en cada mensaje, para que puedas encontrarlos con el campo de búsqueda de la
  consola;
- canales por sistema — data, director, stage, streaming, save y verbose — cada uno con su propio
  interruptor, para que puedas silenciar un área ruidosa sin tocar los sitios de llamada;
- su propio interruptor maestro, que está activo en el editor y en una development build, y **desactivado
  en una build de lanzamiento por defecto**. Una novela lanzada no escribe una línea por cada línea de
  diálogo que el jugador avanza.

`VNLog` se apoya en `BeastyConsole`, así que `IsEnabled` sigue aplicando: apagar el logger también
silencia la VN.

## Beasty Save System

[Beasty Save System](/es/docs/beasty-save-system/) **no** referencia este logger. Lo busca por reflexión la
primera vez que loguea algo:

- si el logger está en tu proyecto, el save system enruta sus mensajes a través de él, y llegan a la Beasty
  Console clasificados y coloreados;
- si no está, el save system loguea a través de `UnityEngine.Debug`.

Por eso ambos assets se distribuyen de forma independiente: nunca necesitas instalar uno para usar el
otro.

> **Advertencia**
> Una consecuencia que conviene conocer. Con el logger presente, las advertencias del save system se
> enrutan a `LogCaution` — que es una alerta suave y, para Unity, un **log normal**. Así que las
> advertencias del save system dejan de aparecer como advertencias en la propia Consola de Unity, y no
> disparan Error Pause. Siguen estando ahí, bajo el filtro Caution en la Beasty Console. Los errores no se
> ven afectados: siguen siendo errores de Unity.

Si prefieres mantener las advertencias del save system como advertencias de Unity, asigna tu propio log
sink en la fachada de logging del save system y enrútalas donde quieras.

## Ver también

- [Logging](/es/docs/beasty-console/guides/logging/)
- [La ventana Beasty Console](/es/docs/beasty-console/guides/console-window/)
- [Beasty Visual Novel](/es/docs/beasty-visual-novel/)
- [Beasty Save System](/es/docs/beasty-save-system/)
