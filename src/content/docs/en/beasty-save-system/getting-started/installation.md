---
title: "Installation"
description: "What you need before you import Beasty Save System, how to import it, what lands in your project, and which platforms it runs on."
---

What you need before you import Beasty Save System, how to import it, what lands in your project, and
which platforms it runs on.

## Requirements

| | |
|---|---|
| Unity | 6000.2 or newer |
| Scripting backend | Mono and IL2CPP, both supported |
| Dependencies | None |
| Render pipeline | Any |

**No dependencies** means exactly that. The package ships its own JSON engine, so there is no Newtonsoft
package to install and nothing to reconcile with the packages your project already uses.

**Any render pipeline** — Built-in, URP, HDRP — because the package contains no rendering code at all. It
reads and writes data. It never draws anything.

## Import

1. Open the Package Manager (`Window > Package Manager`).
2. Select **My Assets**, find Beasty Save System, and click **Import**.
3. Import everything.

The package lands under `Assets/BeastyComponents/BeastySaveSystem/`. You can move that folder anywhere in
`Assets` — nothing inside depends on its location.

If you do not want the tests in your project, you can leave the `Tests` folder unticked in the import
dialog. Everything else is needed.

## What is in the folder

![The Beasty Save System folder in the Project window](/docs-images/beasty-save-system/save-package-folder.png)

| Folder | What it is |
|---|---|
| `Scripts/BeastySave.cs` | The public static facade. The only entry point you call. |
| `Scripts/Components/` | `BeastySaveable` and `BeastySaveManager`, the two scene components. |
| `Scripts/BeastySaveSystemCore/` | The engine: save pipeline, envelope, checksum, settings, migrations, converters, the JSON engine, AES encryption, atomic file writing. |
| `ConverterModules/` | Seven optional modules, one assembly each. See below. |
| `Editor/` | The `BeastySaveable` inspector and the Save Manager window. |
| `Tests/` | EditMode tests. Safe to delete. |

The runtime assembly is `BeastySaveSystem.asmdef`. It has no assembly references and no define
constraints, so it compiles in any project.

## After importing

Nothing to configure. There is no settings asset to create, no scene to set up, no initialisation call.

Go straight to whichever path suits you:

- [save-without-code.md](/docs/beasty-save-system/getting-started/save-without-code/) — a working save and load, writing no C#.
- [save-with-code.md](/docs/beasty-save-system/getting-started/save-with-code/) — the same thing from a script, in five minutes.

## The converter modules

A converter teaches the save system how to store one type. The always-available ones — the `core` layer —
cover the Unity maths types (`Vector2`, `Vector3`, `Quaternion`, `Color`, `Rect`, `Bounds` and friends),
`Transform`, `Camera`, `Light`, `SpriteRenderer`, `Texture2D`, and any `MonoBehaviour` you write yourself.

![The converter modules folder, one file per module](/docs-images/beasty-save-system/save-converter-modules.png)

Anything beyond that comes from a module:

| Module | Types it can save | Needs the Unity package |
|---|---|---|
| Animation | `Animator` | `com.unity.modules.animation` |
| Audio | `AudioSource` | `com.unity.modules.audio` |
| Particles | `ParticleSystem` | `com.unity.modules.particlesystem` |
| Physics2D | `BoxCollider2D`, `CapsuleCollider2D`, `CircleCollider2D` | `com.unity.modules.physics2d` |
| Physics3D | `BoxCollider`, `CapsuleCollider`, `SphereCollider`, `MeshCollider` | `com.unity.modules.physics` |
| TMPro | `TMP_Text` and its subclasses | The TextMeshPro assembly: `com.unity.textmeshpro` (any version), or `com.unity.ugui` 2.0.0 or newer, which ships it |
| UGUI | `RectTransform`, `CanvasGroup`, `Image`, `RawImage`, `Slider`, `Toggle` | `com.unity.ugui` |

You do not install these. They are already in the folder, and each one **registers itself automatically**
when the game starts.

Each module is a separate assembly gated by a define constraint on the Unity module it needs. If your
project has stripped that Unity module out, the module's assembly does not compile, its converters do
not exist, and the rest of the package keeps working. A project with no physics does not fail to
compile because of a physics converter it was never going to use.

The consequence to know: if you tick a component in `BeastySaveable` whose module is not present, the save
fails with the `TypeUnavailable` error and a message telling you so. See
[converter-modules.md](/docs/beasty-save-system/reference/converter-modules/) for exactly which fields each module stores, and
[custom-converters.md](/docs/beasty-save-system/advanced/custom-converters/) for teaching the system a type it does not know.

## Platforms

Beasty Save System works anywhere Unity gives you a writable `Application.persistentDataPath`:

- Windows, macOS, Linux
- Android, iOS
- Consoles

> **Warning**
> **WebGL is not supported.** The atomic write path relies on `File.Replace`, and the async methods are
> `Task`-based. A browser build provides neither. If you ship to WebGL, this package is not the right tool.

More detail on version support, IL2CPP and performance in
[platforms-and-limits.md](/docs/beasty-save-system/advanced/platforms-and-limits/).

## See also

- [save-without-code.md](/docs/beasty-save-system/getting-started/save-without-code/)
- [save-with-code.md](/docs/beasty-save-system/getting-started/save-with-code/)
- [what-gets-saved.md](/docs/beasty-save-system/guides/what-gets-saved/)
