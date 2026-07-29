---
title: "Beasty Save System"
description: "Save and load your game's data as JSON files on disk. No dependencies, no exceptions: typed results, atomic writes, backups, encryption, migrations."
---

Beasty Save System saves and loads your game's data as JSON files on disk, with no external dependencies
and no exceptions thrown at you. It works two ways: drop two components in a scene and wire a button, or
call a five-line C# API from your own code.

## What makes it different

**Zero dependencies.** The package ships its own JSON engine. No Newtonsoft, no `JsonUtility` limits, no
package-manager entries to reconcile with the rest of your project.

**Every call returns a typed result.** `BeastySave.Save` returns a `SaveResult`. `BeastySave.Load<T>`
returns a `LoadResult<T>`. Nothing throws at you. You check `Success`, read the `Error` code, and decide
what the player sees — including offering the automatic backup when a file turns out to be corrupt.

**Safe by default.** Saves are written atomically: to a temp file, then swapped over the slot. A crash
mid-write cannot leave you with half a save. The previous file is rotated to a `.bak`, and a file that
fails its checksum is never allowed to overwrite the last good copy.

## Features

- Save any plain C# object, or the state of the components in your scene.
- A zero-code path: `BeastySaveManager` + `BeastySaveable` + a uGUI button.
- Atomic writes, automatic `.bak` backups, SHA-256 checksums, and one-call backup restore.
- Optional AES-256 encryption. Read [encryption.md](/docs/beasty-save-system/guides/encryption/) for its honest limits.
- Plain-text metadata (level, playtime, chapter) readable without decrypting the file, so a save-slot
  screen can list slots cheaply.
- Strict (all-or-nothing, with rollback) or tolerant (skip and warn) loading.
- Data versioning with registered migrations, so an update can read the saves your players already have.
- Async variants for file IO.
- Seven optional converter modules (Animation, Audio, Particles, Physics2D, Physics3D, TMPro, UGUI), each
  of which compiles only when the matching Unity module is in the project.
- An editor window that lists the saveables in your scene and the save files on disk.
- Unity 6000.2+, Mono and IL2CPP. WebGL is not supported.

## Where to start

**If you do not write C#**, go to [save-without-code.md](/docs/beasty-save-system/getting-started/save-without-code/). It walks
you from an empty scene to a working save and load, clicking only.

**If you do write C#**, go to [save-with-code.md](/docs/beasty-save-system/getting-started/save-with-code/). Five minutes, a data
class, and a save file on disk.

Either way, install first: [installation.md](/docs/beasty-save-system/getting-started/installation/).

## The one page everybody should read

[what-gets-saved.md](/docs/beasty-save-system/guides/what-gets-saved/). It tells you which types round-trip, and — more
importantly — that references to Unity objects (a sprite, a prefab, another component) are **not** saved.
That is deliberate, and there is a right way to work with it. Reading that page before you build a save
screen is worth the ten minutes.

## Guides

Written for anyone, code or no code.

| Page | What it covers |
|---|---|
| [what-gets-saved.md](/docs/beasty-save-system/guides/what-gets-saved/) | Supported types, what is not saved, the errors that fail a save |
| [settings.md](/docs/beasty-save-system/guides/settings/) | Every `BeastySaveSettings` field and when to change it |
| [scene-state.md](/docs/beasty-save-system/guides/scene-state/) | `BeastySaveable`, `BeastySaveManager`, ids, spawned objects |
| [slots-and-metadata.md](/docs/beasty-save-system/guides/slots-and-metadata/) | Slots, listing them, and building a save-slot screen |
| [backups-and-corruption.md](/docs/beasty-save-system/guides/backups-and-corruption/) | Atomic writes, `.bak` files, restoring one |
| [encryption.md](/docs/beasty-save-system/guides/encryption/) | AES, and what encryption does and does not protect |
| [strict-vs-tolerant.md](/docs/beasty-save-system/guides/strict-vs-tolerant/) | The two loading modes |
| [versioning-and-migrations.md](/docs/beasty-save-system/guides/versioning-and-migrations/) | Shipping an update that reads old saves |
| [async-saving.md](/docs/beasty-save-system/guides/async-saving/) | What the async methods really do |
| [save-manager-window.md](/docs/beasty-save-system/guides/save-manager-window/) | The editor window, section by section |
| [logging.md](/docs/beasty-save-system/guides/logging/) | The Logging toggle, what each mode prints, and sending logs elsewhere |

## Reference

Exact signatures, exact behaviour.

| Page | What it covers |
|---|---|
| [api-beastysave.md](/docs/beasty-save-system/reference/api-beastysave/) | Every method on the `BeastySave` facade |
| [results-and-errors.md](/docs/beasty-save-system/reference/results-and-errors/) | `SaveResult`, `LoadResult<T>`, the error codes |
| [components.md](/docs/beasty-save-system/reference/components/) | `BeastySaveable` and `BeastySaveManager`, field by field |
| [converter-modules.md](/docs/beasty-save-system/reference/converter-modules/) | The seven modules and exactly what each stores |
| [save-file-format.md](/docs/beasty-save-system/reference/save-file-format/) | The envelope, the group format, the pipelines |
| [json-engine.md](/docs/beasty-save-system/reference/json-engine/) | `JsonNode`, `JsonMapper`, `JsonParser`, `JsonWriter` |

## Advanced

| Page | What it covers |
|---|---|
| [custom-converters.md](/docs/beasty-save-system/advanced/custom-converters/) | Teaching the system to save your own types |
| [platforms-and-limits.md](/docs/beasty-save-system/advanced/platforms-and-limits/) | Unity versions, IL2CPP, WebGL, performance |

## When something goes wrong

[troubleshooting.md](/docs/beasty-save-system/troubleshooting/) maps a symptom to a cause to a fix. [faq.md](/docs/beasty-save-system/faq/) answers the
questions that come up most.
