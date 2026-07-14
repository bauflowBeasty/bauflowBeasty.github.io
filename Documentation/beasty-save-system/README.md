# Beasty Save System

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
- Optional AES-256 encryption. Read [encryption.md](guides/encryption.md) for its honest limits.
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

**If you do not write C#**, go to [save-without-code.md](getting-started/save-without-code.md). It walks
you from an empty scene to a working save and load, clicking only.

**If you do write C#**, go to [save-with-code.md](getting-started/save-with-code.md). Five minutes, a data
class, and a save file on disk.

Either way, install first: [installation.md](getting-started/installation.md).

## The one page everybody should read

[what-gets-saved.md](guides/what-gets-saved.md). It tells you which types round-trip, and — more
importantly — that references to Unity objects (a sprite, a prefab, another component) are **not** saved.
That is deliberate, and there is a right way to work with it. Reading that page before you build a save
screen is worth the ten minutes.

## Guides

Written for anyone, code or no code.

| Page | What it covers |
|---|---|
| [what-gets-saved.md](guides/what-gets-saved.md) | Supported types, what is not saved, the errors that fail a save |
| [settings.md](guides/settings.md) | Every `BeastySaveSettings` field and when to change it |
| [scene-state.md](guides/scene-state.md) | `BeastySaveable`, `BeastySaveManager`, ids, spawned objects |
| [slots-and-metadata.md](guides/slots-and-metadata.md) | Slots, listing them, and building a save-slot screen |
| [backups-and-corruption.md](guides/backups-and-corruption.md) | Atomic writes, `.bak` files, restoring one |
| [encryption.md](guides/encryption.md) | AES, and what encryption does and does not protect |
| [strict-vs-tolerant.md](guides/strict-vs-tolerant.md) | The two loading modes |
| [versioning-and-migrations.md](guides/versioning-and-migrations.md) | Shipping an update that reads old saves |
| [async-saving.md](guides/async-saving.md) | What the async methods really do |
| [save-manager-window.md](guides/save-manager-window.md) | The editor window, section by section |

## Reference

Exact signatures, exact behaviour.

| Page | What it covers |
|---|---|
| [api-beastysave.md](reference/api-beastysave.md) | Every method on the `BeastySave` facade |
| [results-and-errors.md](reference/results-and-errors.md) | `SaveResult`, `LoadResult<T>`, the error codes |
| [components.md](reference/components.md) | `BeastySaveable` and `BeastySaveManager`, field by field |
| [converter-modules.md](reference/converter-modules.md) | The seven modules and exactly what each stores |
| [save-file-format.md](reference/save-file-format.md) | The envelope, the group format, the pipelines |
| [json-engine.md](reference/json-engine.md) | `JsonNode`, `JsonMapper`, `JsonParser`, `JsonWriter` |

## Advanced

| Page | What it covers |
|---|---|
| [custom-converters.md](advanced/custom-converters.md) | Teaching the system to save your own types |
| [platforms-and-limits.md](advanced/platforms-and-limits.md) | Unity versions, IL2CPP, WebGL, performance |

## When something goes wrong

[troubleshooting.md](troubleshooting.md) maps a symptom to a cause to a fix. [faq.md](faq.md) answers the
questions that come up most.
