---
title: "Módulos de convertidores"
description: "Los siete módulos de convertidores opcionales y la capa core siempre activa, con los campos exactos que cada convertidor integrado almacena y restaura."
---

Un convertidor convierte un tipo en JSON y viceversa. La capa `core` siempre está presente; siete módulos
opcionales cubren paquetes de Unity que quizá tengas en el proyecto, quizá no. Esta página lista exactamente qué campos
almacena cada convertidor, para que sepas qué volverá y qué no.

## Los módulos

Cada módulo es su propio assembly, controlado por una restricción de define, y se registra automáticamente.
Si el paquete de Unity que necesita no está en el proyecto, el assembly no compila, sus convertidores no
existen, y el resto del paquete sigue funcionando.

| Módulo | Id de módulo | Necesita | Tipos que convierte |
|---|---|---|---|
| Animation | `animation` | `com.unity.modules.animation` | `Animator` |
| Audio | `audio` | `com.unity.modules.audio` | `AudioSource` |
| Particles | `particles` | `com.unity.modules.particlesystem` | `ParticleSystem` |
| Physics2D | `physics2d` | `com.unity.modules.physics2d` | `BoxCollider2D`, `CapsuleCollider2D`, `CircleCollider2D` |
| Physics3D | `physics3d` | `com.unity.modules.physics` | `BoxCollider`, `CapsuleCollider`, `SphereCollider`, `MeshCollider` |
| TMPro | `tmpro` | `com.unity.textmeshpro` o `com.unity.ugui >= 2.0.0` | `TMP_Text` y sus subclases |
| UGUI | `ugui` | `com.unity.ugui` | `RectTransform`, `CanvasGroup`, `Image`, `RawImage`, `Slider`, `Toggle` |

La **capa core** no necesita ningún módulo y está siempre disponible: los tipos de valor matemáticos
(`Vector2`, `Vector3`, `Vector4`, `Quaternion`, `Color`, `Rect`, `Bounds`), `Transform`, `Camera`, `Light`,
`SpriteRenderer`, `Texture2D`, y cualquier `MonoBehaviour`.

La prioridad es `dev` > módulos > `core`, así que puedes sobrescribir cualquiera de estos con tu propio
convertidor. Consulta [Convertidores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/).

> **Nota**
> Cada convertidor de componente **rellena una instancia existente**. No puedes hacer `Load<Transform>` de un
> componente de la nada; los componentes se restauran mediante `LoadInto` o un guardado de escena.

## Reglas que aplican a todos ellos

**Los assets se almacenan por nombre.** `AudioSource.clip`, `Image.sprite`, `sharedMaterial` de un collider:
el guardado contiene el nombre del asset, y la carga lo vuelve a resolver con `Resources.Load`. Eso
significa que **el asset solo vuelve si vive en una carpeta `Resources/`**. Si el nombre no se resuelve, la
referencia conectada en la escena se deja intacta — nada se rompe, pero tampoco cambia nada. Si tu juego
intercambia estos elementos en tiempo de ejecución y no usas `Resources`, guarda mejor un identificador propio
en un campo de `MonoBehaviour`.

**Un miembro faltante pasa en silencio. Un miembro del tipo incorrecto, no.** Si el guardado no lleva un
campo, el convertidor mantiene el valor en vivo — eso es lo que hace que las cargas sean resilientes entre
versiones de Unity. Si el guardado lleva el campo pero con el tipo JSON incorrecto, una carga estricta falla
con `FieldMapFailed` y una carga tolerante mantiene el valor en vivo y añade una advertencia.

## Core

### Tipos de valor matemáticos

| Tipo | Almacena |
|---|---|
| `Vector2` | `x`, `y` |
| `Vector3` | `x`, `y`, `z` |
| `Vector4` | `x`, `y`, `z`, `w` |
| `Quaternion` | `x`, `y`, `z`, `w` |
| `Color` | `r`, `g`, `b`, `a` |
| `Rect` | `x`, `y`, `width`, `height` |
| `Bounds` | `center`, `size` |

### Transform

`position`, `rotation`, `localPosition`, `localRotation`, `localScale`.

Al cargar, los valores de mundo se aplican primero y los valores locales segundo, así que para un objeto con
padre ganan los valores locales. El padre en sí no se guarda: un cambio de padre no se restaura.

Se empareja por tipo exacto. Un `RectTransform` **no** es un `Transform` aquí — necesita el módulo UGUI.

### Camera

`fieldOfView`, `orthographic`, `orthographicSize`, `nearClipPlane`, `farClipPlane`, `backgroundColor`,
`clearFlags`, `depth`, `cullingMask`, `renderingPath`, `allowHDR`, `allowMSAA`, `allowDynamicResolution`,
`targetDisplay`, `rect`, `usePhysicalProperties`, `focalLength`, `sensorSize`, `lensShift`, `gateFit`,
`enabled`.

### Light

`type`, `color`, `colorTemperature`, `useColorTemperature`, `intensity`, `bounceIntensity`, `range`,
`spotAngle`, `innerSpotAngle`, `shadows`, `shadowStrength`, `shadowResolution`, `shadowBias`,
`shadowNormalBias`, `shadowNearPlane`, `renderMode`, `cullingMask`, `cookieSize`, `enabled`.
`lightmapBakeType` se almacena solo en el Editor.

**`Light.cookie` se escribe (por nombre) pero nunca se restaura.** El miembro está en el archivo a modo de
inspección; la carga lo ignora, porque restaurarlo necesitaría una referencia a un asset.

### SpriteRenderer

`color`, `flipX`, `flipY`, `drawMode`, `size`, `tileMode`, `adaptiveModeThreshold`, `maskInteraction`,
`spriteSortPoint`, `sortingLayerID`, `sortingOrder`, `shadowCastingMode`, `receiveShadows`,
`renderingLayerMask`, `enabled`.

`size` solo se aplica cuando `drawMode` no es `Simple`, porque Unity lo ignora en caso contrario.

**El sprite en sí no se almacena.** Un `SpriteRenderer` vuelve con el sprite que la escena le dé. Si tu juego
cambia el sprite en tiempo de ejecución y necesitas recuperarlo, guarda la elección en un campo de
`MonoBehaviour` (un string id, un índice) y vuelve a aplicarlo tú mismo.

### Texture2D

`format`, `width`, `height`, y `data` — los píxeles, codificados como un PNG en Base64. Esto es una
instantánea real, no una referencia a un asset: funciona de ida y vuelta sin una carpeta `Resources`, y hace
que el archivo de guardado sea grande. La textura debe ser legible para que `EncodeToPNG` funcione.

### MonoBehaviour

Cada campo serializable por Unity: campos públicos y campos privados marcados con `[SerializeField]`,
incluidos los privados heredados de una clase base. Los campos `static`, `readonly` y `[NonSerialized]` se
omiten, y también las propiedades — solo campos.

**Las referencias a `UnityEngine.Object` se omiten**, tanto campos individuales como arrays/`List<T>` de
ellos. Se omiten al escribir y se dejan intactas al leer, así que el cableado que hiciste en la escena
sobrevive a una carga. Consulta [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/).

## Animation

### Animator

Parámetros float, int y bool, por nombre. Luego, por capa, el `stateHash` (`shortNameHash`) del estado
actual y su `normalizedTime`.

**Los triggers se ignoran.** Son momentáneos; no hay nada significativo que persistir. Si un trigger importa
para el estado de tu juego, contrólalo desde un bool que fijes tú mismo.

Un `Animator` sin `runtimeAnimatorController` escribe un node vacío y al cargar no hace nada. Los parámetros
en el archivo que ya no existen en el controlador en vivo se omiten en silencio.

## Audio

### AudioSource

`clip` (por nombre), `volume`, `pitch`, `loop`, `mute`, `spatialBlend`, `panStereo`, `isPlaying`, `time`.

Al cargar: el nombre del clip se vuelve a resolver con `Resources.Load` (un nombre no resuelto mantiene el
clip ya asignado en la escena); `time` se limita a la duración del clip; si la fuente estaba reproduciéndose
y el juego está en Play Mode se vuelve a reproducir desde ese momento, en caso contrario se detiene.

## Particles

### ParticleSystem

`isPlaying`, `isPaused`, `time`, `loop`, `simulationSpeed`, y `startLifetime`, `startSpeed`, `startSize`
**solo cuando son curvas constantes**.

Un valor inicial fijado como curva, un rango aleatorio o modo de dos curvas no se almacena ni se restaura: la
curva de autoría pertenece a la escena, y el guardado solo lleva los ajustes escalares. Si no se almacena, el
valor en el archivo simplemente está ausente y se mantiene el valor en vivo.

Al cargar, un sistema que estaba reproduciéndose o en pausa se vuelve a simular hasta `time` y luego se
reanuda; uno que estaba detenido se detiene y se limpia.

## Physics2D

Los tres colliders comparten: `isTrigger`, `usedByEffector`, `usedByComposite`, `compositeOperation` (Unity
2023.1 en adelante), `layerOverridePriority`, `includeLayers`, `excludeLayers`, `enabled`, y
`sharedMaterial` **por nombre**.

| Collider | También almacena |
|---|---|
| `BoxCollider2D` | `size`, `offset`, `edgeRadius`, `autoTiling` |
| `CapsuleCollider2D` | `size`, `offset`, `direction` |
| `CircleCollider2D` | `radius`, `offset` |

## Physics3D

Los cuatro colliders comparten: `isTrigger`, `providesContacts`, `contactOffset`, `layerOverridePriority`,
`includeLayers`, `excludeLayers`, `enabled`, y `sharedMaterial` **por nombre**.

| Collider | También almacena |
|---|---|
| `BoxCollider` | `center`, `size` |
| `CapsuleCollider` | `center`, `radius`, `height`, `direction` |
| `SphereCollider` | `center`, `radius` |
| `MeshCollider` | `convex`, `cookingOptions` |

**`MeshCollider.sharedMesh` nunca se serializa.** Una malla es un asset, no estado. El collider mantiene la
malla que le dio la escena.

## TMPro

### TMP_Text (y TextMeshPro, TextMeshProUGUI)

`text`, `fontSize`, el color como cuatro miembros `r`, `g`, `b`, `a`, más `fontStyle` y `alignment`, ambos
almacenados como enteros crudos.

El asset de fuente no se almacena.

## UGUI

| Componente | Almacena |
|---|---|
| `RectTransform` | `anchorMin`, `anchorMax`, `pivot`, `anchoredPosition`, `sizeDelta`, `localRotation`, `localScale` |
| `CanvasGroup` | `alpha`, `interactable`, `blocksRaycasts` |
| `Image` | `sprite` (por nombre, se escribe solo cuando hay uno asignado), `color`, `fillAmount`, `fillMethod`, `type` |
| `RawImage` | `color`, `uvRect` |
| `Slider` | `minValue`, `maxValue`, `value` |
| `Toggle` | `isOn` |

**`Slider` y `Toggle` se restauran sin disparar `onValueChanged`.** Cargar un guardado no debe parecer que el
jugador arrastró el control o marcó la casilla: los juegos conectan a esos callbacks cambios de volumen,
sonidos de clic y eventos de analítica. El `Slider` amplía su rango, coloca el valor con
`SetValueWithoutNotify` y luego vuelve a estrechar el rango, de modo que ni siquiera el recorte (clamping)
puede notificar. El `Toggle` usa `SetIsOnWithoutNotify`. Si necesitas que tu UI reaccione a un valor cargado,
hazlo desde `BeastySaveManager.LoadCompleted`.

`RawImage` no almacena ninguna textura.

## Cuando un módulo no está

**Al guardar**, el componente no tiene convertidor y el guardado falla con `TypeUnavailable`:

```text
UnityEngine.UI.Slider on 'VolumeSlider' has no registered converter; enable its converter module
or register a custom IBeastyConverter.
```

No se escribe nada. El editor te advierte de esto antes de que pulses Play: el inspector de `BeastySaveable`
señala cualquier componente marcado que no tenga convertidor.

**Al cargar**, el archivo de guardado lleva registrado qué módulo escribió cada componente, así que el mensaje
lo nombra:

```text
UnityEngine.UI.Slider on saveable 'a3f…' has no registered converter. The save was written by
module 'ugui' — enable that converter module (or its package) in this project.
```

Una carga **estricta** falla con `TypeUnavailable` y no aplica nada. Una carga **tolerante** añade ese mensaje
a `LoadResult.Warnings`, omite la entrada y carga el resto.

Para cubrir un tipo que ningún módulo maneja — tu propio componente con estado detrás de propiedades, un
componente de terceros, un struct con una forma personalizada — escribe un convertidor. Consulta
[Convertidores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/).

## Ver también

- [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/)
- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/)
- [Componentes](/es/docs/beasty-save-system/reference/components/)
