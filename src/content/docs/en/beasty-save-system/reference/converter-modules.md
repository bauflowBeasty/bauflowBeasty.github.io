---
title: "Converter modules"
description: "The seven optional converter modules and the always-on core layer, with the exact fields each built-in converter stores and restores."
---

A converter turns one type into JSON and back. The `core` layer is always there; seven optional modules
cover the Unity packages you may or may not have. This page lists exactly which fields each converter
stores, so you know what will and will not come back.

## The modules

Each module is its own assembly, gated by a define constraint, and registers itself automatically. If the
Unity package it needs is not in the project, the assembly does not compile, its converters do not exist,
and the rest of the package still works.

| Module | Module id | Needs | Types it converts |
|---|---|---|---|
| Animation | `animation` | `com.unity.modules.animation` | `Animator` |
| Audio | `audio` | `com.unity.modules.audio` | `AudioSource` |
| Particles | `particles` | `com.unity.modules.particlesystem` | `ParticleSystem` |
| Physics2D | `physics2d` | `com.unity.modules.physics2d` | `BoxCollider2D`, `CapsuleCollider2D`, `CircleCollider2D` |
| Physics3D | `physics3d` | `com.unity.modules.physics` | `BoxCollider`, `CapsuleCollider`, `SphereCollider`, `MeshCollider` |
| TMPro | `tmpro` | `com.unity.textmeshpro` or `com.unity.ugui >= 2.0.0` | `TMP_Text` and its subclasses |
| UGUI | `ugui` | `com.unity.ugui` | `RectTransform`, `CanvasGroup`, `Image`, `RawImage`, `Slider`, `Toggle` |

The **core layer** needs no module and is always available: the math value types (`Vector2`, `Vector3`,
`Vector4`, `Quaternion`, `Color`, `Rect`, `Bounds`), `Transform`, `Camera`, `Light`, `SpriteRenderer`,
`Texture2D`, and any `MonoBehaviour`.

Priority is `dev` > modules > `core`, so you can override any of these with your own converter. See
[Custom converters](/docs/beasty-save-system/advanced/custom-converters/).

> **Note**
> Every component converter **populates an existing instance**. You cannot `Load<Transform>` a component
> out of thin air; components are restored through `LoadInto` or a scene save.

## Rules that apply to all of them

**Assets are stored by name.** `AudioSource.clip`, `Image.sprite`, collider `sharedMaterial`: the save
holds the asset's name, and the load re-resolves it with `Resources.Load`. That means **the asset only
comes back if it lives in a `Resources/` folder**. If the name does not resolve, the reference wired in the
scene is left alone — nothing is broken, but nothing changed either. If your game swaps these at runtime
and you are not using `Resources`, save an identifier of your own in a `MonoBehaviour` field instead.

**A missing member falls back silently. A member of the wrong type does not.** If the save does not carry a
field, the converter keeps the live value — that is what makes loads resilient across Unity versions. If
the save carries the field but with the wrong JSON type, a strict load fails with `FieldMapFailed` and a
tolerant load keeps the live value and adds a warning.

## Core

### Math value types

| Type | Stored |
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

On load the world values are applied first and the local values second, so for a parented object the local
values win. The parent itself is not saved: reparenting is not restored.

Matched by exact type. A `RectTransform` is **not** a `Transform` here — it needs the UGUI module.

### Camera

`fieldOfView`, `orthographic`, `orthographicSize`, `nearClipPlane`, `farClipPlane`, `backgroundColor`,
`clearFlags`, `depth`, `cullingMask`, `renderingPath`, `allowHDR`, `allowMSAA`, `allowDynamicResolution`,
`targetDisplay`, `rect`, `usePhysicalProperties`, `focalLength`, `sensorSize`, `lensShift`, `gateFit`,
`enabled`.

### Light

`type`, `color`, `colorTemperature`, `useColorTemperature`, `intensity`, `bounceIntensity`, `range`,
`spotAngle`, `innerSpotAngle`, `shadows`, `shadowStrength`, `shadowResolution`, `shadowBias`,
`shadowNormalBias`, `shadowNearPlane`, `renderMode`, `cullingMask`, `cookieSize`, `enabled`.
`lightmapBakeType` is stored in the Editor only.

**`Light.cookie` is written (by name) but never restored.** The member is in the file for inspection; the
load ignores it, because restoring it would need an asset reference.

### SpriteRenderer

`color`, `flipX`, `flipY`, `drawMode`, `size`, `tileMode`, `adaptiveModeThreshold`, `maskInteraction`,
`spriteSortPoint`, `sortingLayerID`, `sortingOrder`, `shadowCastingMode`, `receiveShadows`,
`renderingLayerMask`, `enabled`.

`size` is only applied when `drawMode` is not `Simple`, because Unity ignores it otherwise.

**The sprite itself is not stored.** A `SpriteRenderer` comes back with whatever sprite the scene gives it.
If your game changes the sprite at runtime and you need it back, store the choice in a `MonoBehaviour`
field (a string id, an index) and reapply it yourself.

### Texture2D

`format`, `width`, `height`, and `data` — the pixels, encoded as a Base64 PNG. This is a real snapshot, not
an asset reference: it round-trips without a `Resources` folder, and it makes the save file large. The
texture must be readable for `EncodeToPNG` to work.

### MonoBehaviour

Every Unity-serializable field: public fields and private fields marked `[SerializeField]`, including
private ones inherited from a base class. `static`, `readonly` and `[NonSerialized]` fields are skipped, and
so are properties — fields only.

**`UnityEngine.Object` references are skipped**, both single fields and arrays/`List<T>` of them. They are
omitted on write and left untouched on read, so the wiring you did in the scene survives a load. See
[What gets saved](/docs/beasty-save-system/guides/what-gets-saved/).

## Animation

### Animator

Float, int and bool parameters, by name. Then, per layer, the current state's `stateHash`
(`shortNameHash`) and its `normalizedTime`.

**Triggers are ignored.** They are momentary; there is nothing meaningful to persist. If a trigger matters
to your game state, drive it from a bool you set yourself.

An `Animator` with no `runtimeAnimatorController` writes an empty node and loads as a no-op. Parameters in
the file that no longer exist on the live controller are skipped silently.

## Audio

### AudioSource

`clip` (by name), `volume`, `pitch`, `loop`, `mute`, `spatialBlend`, `panStereo`, `isPlaying`, `time`.

On load: the clip name is re-resolved with `Resources.Load` (an unresolved name keeps the clip already
assigned in the scene); `time` is clamped to the clip's length; if the source was playing and the game is
in Play Mode it is played again from that time, otherwise it is stopped.

## Particles

### ParticleSystem

`isPlaying`, `isPaused`, `time`, `loop`, `simulationSpeed`, and `startLifetime`, `startSpeed`, `startSize`
**only when they are constant curves**.

A start value set to a curve, a random range or two-curve mode is not stored and not restored: the authoring
curve belongs to the scene, and the save only carries the scalar tweaks. If it is not stored, the value in
the file is simply absent and the live value is kept.

On load, a system that was playing or paused is re-simulated to `time` and then resumed; one that was
stopped is stopped and cleared.

## Physics2D

All three colliders share: `isTrigger`, `usedByEffector`, `usedByComposite`, `compositeOperation` (Unity
2023.1 and newer), `layerOverridePriority`, `includeLayers`, `excludeLayers`, `enabled`, and
`sharedMaterial` **by name**.

| Collider | Also stores |
|---|---|
| `BoxCollider2D` | `size`, `offset`, `edgeRadius`, `autoTiling` |
| `CapsuleCollider2D` | `size`, `offset`, `direction` |
| `CircleCollider2D` | `radius`, `offset` |

## Physics3D

All four colliders share: `isTrigger`, `providesContacts`, `contactOffset`, `layerOverridePriority`,
`includeLayers`, `excludeLayers`, `enabled`, and `sharedMaterial` **by name**.

| Collider | Also stores |
|---|---|
| `BoxCollider` | `center`, `size` |
| `CapsuleCollider` | `center`, `radius`, `height`, `direction` |
| `SphereCollider` | `center`, `radius` |
| `MeshCollider` | `convex`, `cookingOptions` |

**`MeshCollider.sharedMesh` is never serialized.** A mesh is an asset, not state. The collider keeps the
mesh the scene gave it.

## TMPro

### TMP_Text (and TextMeshPro, TextMeshProUGUI)

`text`, `fontSize`, the colour as four members `r`, `g`, `b`, `a`, plus `fontStyle` and `alignment`,
both stored as raw integers.

The font asset is not stored.

## UGUI

| Component | Stored |
|---|---|
| `RectTransform` | `anchorMin`, `anchorMax`, `pivot`, `anchoredPosition`, `sizeDelta`, `localRotation`, `localScale` |
| `CanvasGroup` | `alpha`, `interactable`, `blocksRaycasts` |
| `Image` | `sprite` (by name, written only when one is assigned), `color`, `fillAmount`, `fillMethod`, `type` |
| `RawImage` | `color`, `uvRect` |
| `Slider` | `minValue`, `maxValue`, `value` |
| `Toggle` | `isOn` |

**`Slider` and `Toggle` are restored without firing `onValueChanged`.** Loading a save must not look like
the player dragged the handle or ticked the box: games hang volume changes, click sounds and analytics
events off those callbacks. The `Slider` widens its range, places the value with `SetValueWithoutNotify`
and then narrows the range back, so even the clamping cannot notify. The `Toggle` uses
`SetIsOnWithoutNotify`. If you need your UI to react to a loaded value, do it from
`BeastySaveManager.LoadCompleted`.

`RawImage` stores no texture.

## When a module is not there

**At save time** the component has no converter, and the save fails with `TypeUnavailable`:

```text
UnityEngine.UI.Slider on 'VolumeSlider' has no registered converter; enable its converter module
or register a custom IBeastyConverter.
```

Nothing is written. The editor warns you about this before you ever press Play: the `BeastySaveable`
inspector marks a ticked component with no converter.

**At load time** the save file records which module wrote each component, so the message names it:

```text
UnityEngine.UI.Slider on saveable 'a3f…' has no registered converter. The save was written by
module 'ugui' — enable that converter module (or its package) in this project.
```

A **strict** load fails with `TypeUnavailable` and applies nothing. A **tolerant** load adds that message to
`LoadResult.Warnings`, skips the entry and loads the rest.

To cover a type no module handles — your own component with state behind properties, a third-party
component, a struct with a custom shape — write a converter. See
[Custom converters](/docs/beasty-save-system/advanced/custom-converters/).

## See also

- [What gets saved](/docs/beasty-save-system/guides/what-gets-saved/)
- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/)
- [Components](/docs/beasty-save-system/reference/components/)
