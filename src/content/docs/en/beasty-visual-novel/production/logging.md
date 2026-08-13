---
title: "Logging"
description: "Where the VN's own log messages go, how to silence a noisy subsystem without silencing the rest, and why a shipped build stays quiet by default."
---

Where the VN's own log messages go, how to silence a noisy subsystem without silencing the rest, and why a
shipped build stays quiet by default. Nothing here needs setting up: the defaults are already the ones you
want in the editor and in a release build.

## Everything goes through one facade

The package never calls `UnityEngine.Debug` directly. Every message it produces — loading a story asset,
advancing a node, resolving a keyframe, writing a save — goes through `VNLog`, a static facade — one front
door for every message — in the `Beasty.VN.Core` namespace.

Where the messages land depends on one thing: whether [Beasty Console](/docs/beasty-console/) — a
separate, optional asset — is in the project. With it installed, every message goes to its window at
`Tools > Beasty Console > Console`. See
[The Beasty Console window](/docs/beasty-console/guides/console-window/) for what it adds — level filters
with live counts, search, Collapse, Clear on Play, and a detail panel whose stack-trace lines open the file
at the right line in your IDE. Without it, the messages go to Unity's own Console — same content, minus
the level filters and the category colours.

The VN does not *depend* on the console: `VNLog` finds it by reflection — it looks the console up at
runtime instead of referencing it directly — so the VN compiles and runs either way, and importing
Beasty Console later needs no re-wiring; the VN's logs land in its window from that moment on.

Every message is prefixed `[BeastyVN][Category]`, so the console's search field is enough to isolate the
package's own output from yours. Exceptions are handed to the console as the exception object itself, which
is what keeps Unity's stack trace intact.

## Categories

Each message is tagged with the area it came from, and each area has its own switch:

![VN logs in the console, one per category](/docs-images/beasty-visual-novel/vn-log-categories.png)

| Category | What logs through it | Default |
|---|---|---|
| `Data` | ScriptableObject loading, validation, model integrity | On |
| `Director` | Flow control, node transitions, choices, decisions | On |
| `Stage` | Scene presentation: backdrop, video, characters, keyframe resolution | On |
| `Streaming` | The node loading window, Addressables prefetch and release | On |
| `Save` | The save and load integration | On |
| `Verbose` | High-frequency output: the typewriter, per-frame work | **Off** |

The switches are public fields on `VNLog`:

```csharp
using Beasty.VN.Core;

VNLog.LogStage = false;          // stop the stage chatter, keep the rest
VNLog.LogVerboseChannel = true;  // turn the noisy channel on while you debug the typewriter
```

`Verbose` is off by default because it prints during the typewriter effect and on per-frame work. Turn it on
while you are chasing something there, and turn it back off.

> **Note**
> Warnings, errors and exceptions **ignore the per-category switches**. Silencing `Stage` silences its
> informational messages; a stage error still reaches you. Only the master switch below hides those.

## The master switch

```csharp
VNLog.Enabled = false;
```

That silences all VN logging, warnings and errors included. Its default depends on the build:

| Where | Default |
|---|---|
| Editor | On |
| Development build | On |
| Release build | **Off** |

That is the point of it. A visual novel logs on every dialogue line, every choice and every room change, and
a shipped game must not write all of that into the player's log. You do not have to do anything to get that
behaviour — it is what a release build already does.

If you do want the logs back in a release build, set `Enabled = true` yourself.

## Setting the switches so they stick

`VNLog` resets every switch during Unity's runtime initialization, so each Play session and each build starts
from the defaults above. A value you set from an editor script, or in a previous session, does not survive.

![The per-category log switches, and the master switch](/docs-images/beasty-visual-novel/vn-log-switches.png)

Set them **after startup** — from a bootstrap `MonoBehaviour` in your first scene, or from a
`RuntimeInitializeOnLoadMethod`:

```csharp
using UnityEngine;
using Beasty.VN.Core;

public class VNLoggingBootstrap : MonoBehaviour
{
    private void Awake()
    {
        VNLog.LogStreaming = false;  // this project's streaming logs are not interesting
        VNLog.LogVerboseChannel = false;
    }
}
```

## Two switches, not one

With Beasty Console in the project, `VNLog` sits on top of it, so there are two switches above your logs
and either one silences the VN:

- **`VNLog.Enabled`** — the VN's own switch. Off in a release build.
- **`BeastyConsole.IsEnabled`** — the console's master switch, which silences *everything* in the project,
  including your own log calls. It resets to `true` at the start of every run. See
  [Release builds](/docs/beasty-console/guides/release-builds/).

Neither switch removes the calls from the build. They stop the output, not the work of building the message.
That matters for your own logging, not for the package's — see
[Release builds](/docs/beasty-console/guides/release-builds/) for the pattern.

## Logging from your own code

`VNLog` is public, so you can tag your own messages with a VN category and have them filter alongside the
package's:

```csharp
VNLog.Info(VNLogCategory.Director, "Chapter 3 unlocked", this);
```

The last parameter is a `context` object: pass a `GameObject` or a `ScriptableObject` and the entry becomes
clickable, pinging that object in the Hierarchy or the Project window.

For messages that have nothing to do with the VN — if you own Beasty Console — call `BeastyConsole`
directly instead. See [Logging](/docs/beasty-console/guides/logging/).

## See also

- [Logging](/docs/beasty-console/guides/logging/)
- [The Beasty Console window](/docs/beasty-console/guides/console-window/)
- [Release builds](/docs/beasty-console/guides/release-builds/)
- [Validation and ids](/docs/beasty-visual-novel/production/validation-and-ids/)
- [Building and platforms](/docs/beasty-visual-novel/production/building-and-platforms/)
