---
title: "Instalación"
description: "Lo que necesitas antes de importar Beasty Visual Novel, qué pasa cuando lo haces, y para qué sirve cada carpeta del paquete. Lee las secciones de render pipeline e input aunque tengas prisa."
---

Lo que necesitas antes de importar Beasty Visual Novel, qué ocurre cuando lo haces, y para qué sirve cada
carpeta del paquete. Lee las secciones de render pipeline e input aunque tengas prisa — son los dos lugares
donde un paquete de Unity suele costarte una tarde, y aquí no te cuestan nada.

## Requisitos

| | |
|---|---|
| Unity | 6000.2 o más reciente (Unity 6.2+) |
| Render pipeline | Built-in, URP (incluyendo el 2D Renderer), o HDRP |
| Input | New Input System, Input Manager clásico, o ambos |
| Paquetes de Unity requeridos | uGUI y TextMeshPro |
| Paquetes de Unity opcionales | Addressables (solo para streaming) |
| Backends de scripting | Mono e IL2CPP |

## Render pipeline: cualquiera de ellos, sin cambios

El paquete funciona en **Built-in**, **URP** (2D Renderer incluido) y **HDRP** sin cambios y sin ningún paso
de configuración.

Eso no es una afirmación de compatibilidad, es una consecuencia de cómo está hecho el paquete. No incluye
**shaders ni materiales propios**. Todo lo que ve el jugador es:

- **uGUI + TextMeshPro** — el cuadro de diálogo, las elecciones, los menús, el inventario, las pantallas de
  personaje. La UI de Unity se renderiza igual en cada pipeline.
- **SpriteRenderer con el material de sprite predeterminado de Unity** — el backdrop, los personajes en el
  escenario, los props, las salas de mundo libre.

Así que no hay nada que actualizar ni convertir cuando cambies de pipeline. Tu propio arte es asunto tuyo,
pero el paquete no te pedirá que le pases un actualizador de materiales.

## Input: compila de cualquier forma

El paquete funciona con el **new Input System**, con el **Input Manager clásico**, o con ambos. Sigue la
propia configuración **Active Input Handling** de tu proyecto (`Edit > Project Settings > Player`) y elige
la capa correspondiente en tiempo de ejecución.

La consecuencia práctica: **compila en un proyecto que nunca instaló el paquete Input System.** Ningún
ensamblado del paquete lo referencia directamente. Si más adelante instalas el Input System, nada se rompe
y no hay que recablear nada.

Los bindings de teclas no son un asset `.inputactions`. Son una configuración serializada editada con
desplegables en la sección **Controls** del inspector de BeastyManager, y el jugador puede reasignarlos en
tiempo de ejecución. Consulta [Entrada y controles](/es/docs/beasty-visual-novel/production/input-and-controls/).

## Paquetes de Unity requeridos

**uGUI** y **TextMeshPro**. Ambos están presentes en un proyecto de Unity 6 por defecto, así que en la
práctica ya los tienes. Si los quitaste de un proyecto mínimo, vuelve a agregarlos desde el Package Manager
antes de importar.

**Addressables es opcional.** El módulo de streaming solo compila cuando `com.unity.addressables` está en
el proyecto. Sin él, todo funciona con normalidad con referencias directas — que es lo predeterminado y no
cuesta nada. Consulta [Streaming](/es/docs/beasty-visual-novel/production/streaming/).

## Beasty Save System viene incluido

**Beasty Save System viene incluido dentro de este paquete. No lo importes por separado.** Si ya lo tienes
como paquete independiente, no importes ambos — terminarías con dos copias de los mismos ensamblados y el
proyecto no compilaría.

No hay otras dependencias. Ninguna librería de terceros, ningún paquete externo, nada que instalar desde un
registro.

## Plataformas

| Plataforma | Estado |
|---|---|
| Windows, macOS, Linux (standalone) | Compatible |
| iOS, Android | Compatible |
| **WebGL** | **No compatible en 1.0.0** |

> **Advertencia**
> **WebGL no es compatible en 1.0.0.** El pipeline de guardado escribe archivos de guardado a disco a través
> del sistema de archivos normal, que WebGL no provee. La historia se reproduciría, pero el guardado y la
> carga no funcionarían, así que la plataforma queda directamente como no compatible, en vez de compatible
> a medias. Si tu juego debe correr en un navegador, esta es la versión que debes evitar.

Tanto **Mono** como **IL2CPP** son backends de scripting compatibles. Consulta
[Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/) para saber qué revisar antes de lanzar.

## Importación

1. En Unity, abre **Window > Package Manager**, selecciona **My Assets**, busca **Beasty Visual Novel** y
   presiona **Download**, y luego **Import**.
2. Importa **todo**. Las carpetas dependen unas de otras: las herramientas de editor necesitan el modelo de
   datos central, y el runtime necesita los prefabs.
3. Espera a que termine de compilar. Ahora deberías tener un menú **Tools > Beasty VN**.
4. Si el menú no está ahí, busca errores de compilación en la consola. La causa habitual es una segunda
   copia de Beasty Save System ya en el proyecto (ver arriba).

Siguiente: [Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/).

## Qué contiene el paquete

El paquete se instala bajo `Assets/BeastyComponents/BeastyVN/`.

| Carpeta | Qué es |
|---|---|
| `Core/` | El modelo de datos y la lógica pura de la historia. Sin UI de Unity aquí. Este es el ensamblado contra el que puedes compilar si quieres reemplazar por completo la capa de presentación. |
| `Runtime/` | Todo lo que se ejecuta en un build: los controladores, las vistas, la capa de entrada, la integración de guardado, el módulo de streaming. |
| `Editor/` | Todas las herramientas de creación — la ventana Beasty VN, el grafo, el editor de mundo libre, el validador, los generadores de código. Nada de esto termina en tu build. |
| `Prefabs/` | Los prefabs de UI y de escena ya listos: el canvas con cada pantalla dentro, el stage, el panel de diálogo, los menús, las pantallas de personaje. Restilízalos. Consulta [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/). |
| `Resources/` | `VNSettings.asset` y `UILocalization.asset`. Estos dos se leen en tiempo de ejecución, por eso viven aquí. Consulta [VN Settings](/es/docs/beasty-visual-novel/production/vn-settings/). |
| `Sprites/` | Arte de relleno, para que una escena nueva muestre algo en lugar de nada. Reemplázalo con el tuyo. |
| `Documentation/` | Los archivos de referencia que vienen con el paquete, incluyendo la sintaxis completa de `.vnbeasty` y la referencia de tiempo y rutinas. |
| `Tests/` | Las suites de pruebas EditMode, PlayMode y de guardado. Puedes borrarlas sin riesgo antes de lanzar; de todas formas se excluyen del build. |

Deja el paquete en la carpeta donde se importó. Dos cosas dependen de eso: `VNSettings.asset` y `UILocalization.asset`
deben quedarse dentro de una carpeta `Resources` para poder leerse en tiempo de ejecución, y el asistente de
escena busca el prefab `Stage` en su ruta predeterminada. Tu propio contenido — escenas, personajes, arte,
scripts — va donde quieras; el editor te pide una carpeta cuando crea assets.

## Ver también

- [Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/)
- [Recorrido del editor](/es/docs/beasty-visual-novel/getting-started/editor-tour/)
- [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/)
- [Entrada y controles](/es/docs/beasty-visual-novel/production/input-and-controls/)
- [Beasty Save System](/es/docs/beasty-save-system/)
