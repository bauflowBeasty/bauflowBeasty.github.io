---
title: "Instalación"
description: "Qué necesitas antes de importar Beasty Save System, cómo importarlo, qué queda en tu proyecto, y en qué plataformas funciona."
---

Qué necesitas antes de importar Beasty Save System, cómo importarlo, qué queda en tu proyecto, y
en qué plataformas funciona.

## Requisitos

| | |
|---|---|
| Unity | 6000.2 o más reciente |
| Backend de scripting | Mono e IL2CPP, ambos soportados |
| Dependencias | Ninguna |
| Render pipeline | Cualquiera |

**Sin dependencias** significa exactamente eso. El paquete incluye su propio motor JSON, así que no hay ningún paquete
Newtonsoft que instalar ni nada que reconciliar con los paquetes que tu proyecto ya use.

**Cualquier render pipeline** — Built-in, URP, HDRP — porque el paquete no contiene ni una línea de código de
renderizado: solo lee y escribe datos. Nunca dibuja nada.

Todas las generaciones de Unity 6 desde la 6.2 hasta la 6.5 compilan e importan **sin advertencias**. Donde
una generación más nueva marcó como deprecada una API que usaban los conversores (la 6.4 reemplazó el tamaño
del cookie de `Light` y la bandera de composite de `Collider2D`), el paquete cambia por dentro, y los
guardados escritos por una versión anterior siguen cargando. Consulta
[Módulos de conversores](/es/docs/beasty-save-system/reference/converter-modules/).

## Importar

1. Abre el Package Manager (`Window > Package Manager`).
2. Selecciona **My Assets**, busca Beasty Save System, y pulsa **Import**.
3. Importa todo.

El paquete queda en `Assets/BeastyComponents/BeastySaveSystem/`. Puedes mover esa carpeta a cualquier lugar de
`Assets` — nada dentro depende de su ubicación.

Si no quieres los tests en tu proyecto, puedes dejar la carpeta `Tests` sin marcar en el diálogo de
importación. Todo lo demás es necesario.

## Qué hay en la carpeta

![La carpeta de Beasty Save System en la ventana Project](/docs-images/beasty-save-system/save-package-folder.png)

| Carpeta | Qué es |
|---|---|
| `Scripts/BeastySave.cs` | La fachada estática pública. El único punto de entrada que llamas. |
| `Scripts/Components/` | `BeastySaveable` y `BeastySaveManager`, los dos componentes de escena. |
| `Scripts/BeastySaveSystemCore/` | El motor: pipeline de guardado, envelope, checksum, settings, migraciones, convertidores, el motor JSON, cifrado AES, escritura atómica de archivos. |
| `ConverterModules/` | Siete módulos opcionales, un assembly cada uno. Ver más abajo. |
| `Editor/` | El inspector de `BeastySaveable` y la ventana del Save Manager. |
| `Tests/` | Tests de EditMode. Se pueden borrar sin problema. |

El assembly de runtime es `BeastySaveSystem.asmdef`. No tiene referencias a otros assemblies ni restricciones de
define, así que compila en cualquier proyecto.

## Después de importar

Nada que configurar. No hay ningún settings asset que crear, ninguna escena que preparar, ninguna llamada de
inicialización.

Ve directo a la ruta que más te convenga:

- [save-without-code.md](/es/docs/beasty-save-system/getting-started/save-without-code/) — un guardado y una carga funcionando, sin escribir C#.
- [save-with-code.md](/es/docs/beasty-save-system/getting-started/save-with-code/) — lo mismo desde un script, en cinco minutos.

## Los módulos convertidores

Un convertidor le enseña al sistema de guardado cómo almacenar un tipo. Los que están siempre disponibles — la
capa `core` — cubren los tipos matemáticos de Unity (`Vector2`, `Vector3`, `Quaternion`, `Color`, `Rect`, `Bounds` y afines),
`Transform`, `Camera`, `Light`, `SpriteRenderer`, `Texture2D`, y cualquier `MonoBehaviour` que escribas tú mismo.

![La carpeta de módulos de conversores, un archivo por módulo](/docs-images/beasty-save-system/save-converter-modules.png)

Todo lo demás viene de un módulo:

| Módulo | Tipos que puede guardar | Necesita el paquete de Unity |
|---|---|---|
| Animation | `Animator` | `com.unity.modules.animation` |
| Audio | `AudioSource` | `com.unity.modules.audio` |
| Particles | `ParticleSystem` | `com.unity.modules.particlesystem` |
| Physics2D | `BoxCollider2D`, `CapsuleCollider2D`, `CircleCollider2D` | `com.unity.modules.physics2d` |
| Physics3D | `BoxCollider`, `CapsuleCollider`, `SphereCollider`, `MeshCollider` | `com.unity.modules.physics` |
| TMPro | `TMP_Text` y sus subclases | El assembly de TextMeshPro: `com.unity.textmeshpro` (cualquier versión), o `com.unity.ugui` 2.0.0 o más reciente, que lo incluye |
| UGUI | `RectTransform`, `CanvasGroup`, `Image`, `RawImage`, `Slider`, `Toggle` | `com.unity.ugui` |

Estos módulos no se instalan: ya están en la carpeta, y cada uno **se registra automáticamente**
cuando el juego arranca.

Cada módulo es un assembly aparte, condicionado por una restricción de define al módulo de Unity que necesita. Si
tu proyecto eliminó ese módulo de Unity, el assembly del módulo no compila, sus convertidores no
existen, y el resto del paquete sigue funcionando. Un proyecto sin física no falla al
compilar por culpa de un convertidor de física que nunca iba a usar.

La consecuencia que conviene conocer: si marcas un componente en `BeastySaveable` cuyo módulo no está presente, el guardado
falla con el error `TypeUnavailable` y un mensaje que te lo indica. Consulta
[converter-modules.md](/es/docs/beasty-save-system/reference/converter-modules/) para saber exactamente qué campos almacena cada módulo, y
[custom-converters.md](/es/docs/beasty-save-system/advanced/custom-converters/) para enseñarle al sistema un tipo que no conoce.

## Plataformas

Beasty Save System funciona en cualquier plataforma donde Unity te dé un `Application.persistentDataPath` con
permisos de escritura:

- Windows, macOS, Linux
- Android, iOS
- Consolas

> **Advertencia**
> **WebGL no está soportado.** La ruta de escritura atómica depende de `File.Replace`, y los métodos asíncronos
> están basados en `Task`. Un build de navegador no ofrece ninguno de los dos. Si publicas en WebGL, este paquete
> no es la herramienta adecuada.

Más detalles sobre soporte de versiones, IL2CPP y rendimiento en
[platforms-and-limits.md](/es/docs/beasty-save-system/advanced/platforms-and-limits/).

## Ver también

- [save-without-code.md](/es/docs/beasty-save-system/getting-started/save-without-code/)
- [save-with-code.md](/es/docs/beasty-save-system/getting-started/save-with-code/)
- [what-gets-saved.md](/es/docs/beasty-save-system/guides/what-gets-saved/)
