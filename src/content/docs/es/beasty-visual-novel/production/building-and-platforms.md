---
title: "Compilación y plataformas"
description: "Qué necesita el paquete, dónde se ejecuta, y qué revisar antes de presionar Build."
---

Qué necesita el paquete, dónde se ejecuta, y qué revisar antes de presionar Build.

## Requisitos

- **Unity 6000.2 o más reciente.** Todas las generaciones hasta la 6.5 compilan e importan sin advertencias;
  los renombrados de API entre generaciones se resuelven dentro del paquete.
- Sin paquetes externos. El sistema de guardado viene incluido dentro del paquete, con su propio motor JSON —
  no hay dependencia de Newtonsoft, y nada que instalar desde el Package Manager para tener un juego funcional.
- El paquete Addressables solo se necesita si optas por el [streaming](/es/docs/beasty-visual-novel/production/streaming/).

## Render pipelines

Un render pipeline es la parte de Unity que dibuja la pantalla. No tienes que preocuparte por cuál usa tu
proyecto:

**Built-in, URP (incluido el 2D Renderer) y HDRP funcionan todos, sin cambios.**

La razón: el paquete **no incluye shaders ni materiales**. Los fondos, personajes y props son
sprites; la interfaz es uGUI. No hay nada que actualizar cuando cambias de pipeline, y ningún material que se
ponga magenta. Puedes mover un proyecto de Built-in a URP a mitad de la producción y la novela visual no se
entera.

## Backends de scripting

Mono e IL2CPP son las dos formas en que Unity convierte el código en una build. **Ambos son compatibles**, y
el pipeline de guardado está verificado contra una build real de IL2CPP.

## Plataformas

Cualquiera donde el juego pueda leer y escribir archivos normales — que es lo que el sistema de guardado
necesita:

- Windows, macOS, Linux
- Android, iOS
- Consolas

> **Advertencia**
> **WebGL no es compatible en 1.0.0.** El pipeline de guardado es la razón: la escritura atómica necesita
> `File.Replace`, y las variantes asíncronas de guardado/carga están basadas en `Task`. Una build de navegador no
> provee ninguna de las dos. No hay un modo parcial — no planifiques un lanzamiento en WebGL con esta versión.
> La explicación completa está en [plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/) del sistema de guardado.

## Antes de compilar

Una checklist corta:

1. **Ejecuta el validador** en cada `DialogueScene`
   (`Tools > Beasty VN > Maintenance > Validate Selected Project`). Encuentra el id de personaje colgante, el
   resultado de subgrafo sin enrutar y la clave de localización sin texto de origen — los fallos que no
   lanzan excepción y por eso no aparecen al probar solo las rutas que casualmente recorriste. Consulta
   [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/).
2. **Revisa el Time Config** si tu juego usa tiempo de juego. Se asigna en el BeastyManager, y **dejarlo vacío
   apaga el sistema de tiempo**: no se escribe ninguna variable de tiempo y toda condición de tiempo se evalúa
   como falsa. Un juego cuyas rutinas no hacen nada en la build, sin dar ningún error, suele tener un Time
   Config vacío. Consulta [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/).
3. **Reconstruye el contenido de Addressables** si usas streaming. Un catálogo desactualizado significa que el
   arte en streaming no se resuelve. Consulta [Streaming](/es/docs/beasty-visual-novel/production/streaming/).
4. Revisa los totales de [localización](/es/docs/beasty-visual-novel/production/localization/): el validador informa cuántas traducciones faltan o
   están desactualizadas.

## Relación de aspecto y resolución

La resolución de diseño vive en [VN settings](/es/docs/beasty-visual-novel/production/vn-settings/) (`targetWidth` y `targetHeight`, 1920x1080 por
defecto).

![El forzador de relación de aspecto y los ajustes de resolución](/docs-images/beasty-visual-novel/vn-aspect-ratio.png)

Para asegurarte de que el juego se ENCUADRE igual en cada monitor, agrega el **Beasty Aspect Ratio Enforcer**
(`Add Component > Beasty > Beasty Aspect Ratio Enforcer`) a tu cámara. Obliga a la cámara a renderizarse con
una relación de aspecto fija: una ventana más ancha recibe barras negras a los lados (pillarbox), una más
alta recibe barras arriba y abajo (letterbox). La relación sale por defecto de la resolución objetivo de VN
settings, y se puede sobrescribir por cámara.

> **Nota**
> Para que la interfaz quede en letterbox junto con el juego, el Canvas debe estar en modo **Screen Space -
> Camera** apuntando a esa cámara. Un canvas **Screen Space - Overlay** ignora por completo el viewport de la
> cámara y sigue llenando todo el monitor.

## La pantalla de carga

Agrega el **Beasty Loading Screen** (`Add Component > Beasty > Beasty Loading Screen`) a un panel de tu canvas y
el BeastyManager lo controla: aparece mientras el juego arranca y mientras se carga una partida.

![La pantalla de carga cubriendo los primeros fotogramas del juego](/docs-images/beasty-visual-novel/vn-loading-screen.png)

Aparece y desaparece con un fundido, respeta un **tiempo de visualización mínimo** (1 segundo por defecto)
para que una carga rápida no haga parpadear el panel por dos frames, y puede controlar una barra de progreso
(un relleno de Image, un Slider, o ambos) que permanece oculta hasta que algo informa progreso. Todos sus
tiempos usan tiempo sin escalar, así que funciona aunque el juego esté en pausa. Cada elemento visual es
tuyo: restiliza los hijos libremente.

Los programadores pueden reemplazarla por su propia implementación, y mantener el arranque abierto hasta
que sus propios sistemas estén listos. Consulta [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/).

## Ver también

- [Instalación](/es/docs/beasty-visual-novel/getting-started/installation/) — requisitos, importación, y qué hay en la carpeta.
- [Streaming](/es/docs/beasty-visual-novel/production/streaming/) y [Proyectos grandes](/es/docs/beasty-visual-novel/production/large-projects/).
- [Beasty Save System: plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/).
