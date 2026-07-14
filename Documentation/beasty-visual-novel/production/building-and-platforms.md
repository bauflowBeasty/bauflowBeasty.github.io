# Building and platforms

What the package needs, where it runs, and what to check before you press Build.

## Requirements

- **Unity 6000.2 or newer.**
- No external packages. The save system ships inside the package, with its own JSON engine — there is no
  Newtonsoft dependency, and nothing to install from the Package Manager to get a working game.
- The Addressables package is needed only if you opt into [streaming](streaming.md).

## Render pipelines

**Built-in, URP (including the 2D Renderer) and HDRP all work, unchanged.**

The reason is simple: the package **ships no shaders and no materials**. Backdrops, characters and props are
sprites; the interface is uGUI. There is nothing to upgrade when you switch pipeline, and no material to go
magenta. You can move a project from Built-in to URP mid-production and the visual novel does not notice.

## Scripting backends

**Mono and IL2CPP.** Both are supported, and the save pipeline is verified against a real IL2CPP build.

## Platforms

Anything with regular file IO — which is what the save system needs:

- Windows, macOS, Linux
- Android, iOS
- Consoles

> **Warning**
> **WebGL is not supported in 1.0.0.** The save pipeline is the reason: the atomic write needs `File.Replace`,
> and the async save/load variants are `Task`-based. A browser build provides neither. There is no partial
> mode — do not plan a WebGL release on this version. The full explanation is in the save system's
> [platforms and limits](../../beasty-save-system/advanced/platforms-and-limits.md).

## Before you build

A short checklist:

1. **Run the validator** on each `DialogueScene`
   (`Tools > Beasty VN > Maintenance > Validate Selected Project`). It finds the dangling character id, the
   unrouted subgraph outcome and the localization key with no source text — the failures that do not throw and
   so do not show up in a playtest of the routes you happen to take. See
   [Validation and ids](validation-and-ids.md).
2. **Check the Time Config** if your game uses game time. It is assigned on the BeastyManager, and **leaving it
   empty turns the time system off**: no time variables are written and every time condition evaluates to
   false. A game whose routines quietly do nothing in the build usually has an empty Time Config. See
   [Game time](../world/game-time.md).
3. **Rebuild the Addressables content** if you use streaming. A stale catalog means streamed art does not
   resolve. See [Streaming](streaming.md).
4. Check the [localization](localization.md) totals: the validator reports how many translations are missing or
   stale.

## Aspect ratio and resolution

The design resolution lives in [VN settings](vn-settings.md) (`targetWidth` and `targetHeight`, 1920x1080 by
default).

To make sure the game is FRAMED the same on every monitor, add the **Beasty Aspect Ratio Enforcer**
(`Add Component > Beasty > Beasty Aspect Ratio Enforcer`) to your camera. It forces the camera to present at a
fixed aspect ratio: a wider window gets black bars left and right (pillarbox), a taller one gets bars top and
bottom (letterbox). The ratio comes from the VN settings target resolution by default, and can be overridden
per camera.

> **Note**
> For the interface to be letterboxed with the game, the Canvas must be in **Screen Space - Camera** mode
> pointing at that camera. A **Screen Space - Overlay** canvas ignores the camera's viewport entirely and keeps
> filling the whole monitor.

## The loading screen

Add the **Beasty Loading Screen** (`Add Component > Beasty > Beasty Loading Screen`) to a panel on your canvas
and the BeastyManager drives it: it comes up while the game boots and while a save loads.

It fades in and out, honours a **minimum display time** (1 second by default) so a fast load does not flash the
panel for two frames, and can drive a progress bar (an Image fill, a Slider, or both) that stays hidden until
something reports progress. All of its timing is unscaled, so it works while the game is paused. Every visual
is yours: restyle the children freely.

Programmers can swap in their own implementation, and can hold the boot open until their own systems are ready.
See [Controllers](../scripting/controllers.md).

## See also

- [Installation](../getting-started/installation.md) — requirements, import, and what is in the folder.
- [Streaming](streaming.md) and [Large projects](large-projects.md).
- [Beasty Save System: platforms and limits](../../beasty-save-system/advanced/platforms-and-limits.md).
