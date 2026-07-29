---
title: "Platforms and limits"
description: "Where the package runs, where it does not, and the edges a shipping game actually hits. Read the WebGL section before you plan a browser build."
---

Where the package runs, where it does not, and the edges a shipping game actually hits. Read the WebGL
section before you plan a browser build.

## Unity version

Unity **6000.2 or newer**.

The package has **zero external dependencies**. It ships its own JSON engine, so there is no Newtonsoft
package to install and nothing to conflict with a version of Newtonsoft your project already uses.

## Scripting backends

Both **Mono** and **IL2CPP** are supported.

IL2CPP matters here because the package uses reflection to map fields, and AOT compilation is where naive
reflection code breaks: generic value-type paths get stripped, `Activator.CreateInstance` on a type nothing
statically references fails, and a library that works in the editor blows up in the player. The
serialization paths are exercised by a smoke scene run against a **real IL2CPP build**, not against the
editor with the backend switched. Round-trips of the supported types, the built-in converters, encryption
and the group save all run there.

You do not need link.xml entries for the package itself. Your own data types are safe too, with one
exception: a field declared as a **collection interface** whose element is one of your structs — say
`ISet<ItemStack> items;` — makes the mapper build `HashSet<ItemStack>` through reflection at load time.
If that concrete combination appears nowhere in your code, IL2CPP never generated code for it, and the
load fails in the player even though the editor was fine. Declare the field with the concrete type
(`HashSet<ItemStack>`, `List<ItemStack>`, `Dictionary<int, ItemStack>`) and the problem cannot happen.

## Platforms

Every platform with a writable `Application.persistentDataPath`:

| Platform | Supported |
|---|---|
| Windows | Yes |
| macOS | Yes |
| Linux | Yes |
| Android | Yes |
| iOS | Yes |
| Consoles | Yes, where `persistentDataPath` is writable |
| WebGL | **No** — see below |

Saves live at `{DataPath or Application.persistentDataPath}/{Folder}/{slot}.{Extension}`. Leave
`BeastySaveSettings.DataPath` empty and you get `persistentDataPath`, which is the correct, writable,
per-user location on all of the above. Set it only when you know why. See
[Settings](/docs/beasty-save-system/guides/settings/).

Console certification often has rules about save writes (no writes during suspend, a required save icon, a
required minimum free-space check). The package gives you the pieces — `SaveResult`, `SaveCompleted`,
`SaveAllNow` — but it does not implement any platform's certification requirements for you.

## WebGL

**WebGL is not supported in 1.0.0.** Not "untested". Not "works with a plugin". Not supported.

Two reasons, both structural:

1. **The atomic write.** Every save is written to a unique temp file and then moved over the slot with
   `File.Replace`, which is what produces the `.bak` and what guarantees a crash mid-write cannot leave
   half a save behind. The browser build does not provide those file-system semantics.
2. **The async variants.** `SaveAsync`, `LoadAsync` and `LoadIntoAsync` are `Task`-based. WebGL is
   single-threaded and does not run them as the rest of the API expects.

There is no setting that turns this on, and no supported workaround. If you need browser saves, you need a
different persistence layer — one built on `PlayerPrefs`, IndexedDB or a server. Plan for that before you
build, not after.

## Limits

### Save size

Serialization is **synchronous**, including inside the async variants. `SaveAsync` performs the file IO
asynchronously; building the JSON node graph, rendering the text and encrypting it all run on the thread
that called it — which is your main thread. A very large save therefore costs a frame hitch proportional to
its size, and `await`ing it does not remove that hitch. The async variants keep the game off the **IO**
stall, not off the serialization work. See [Async saving](/docs/beasty-save-system/guides/async-saving/).

The practical consequences:

- Keep the save to game state, not to a dump of the scene. Tick only the components that actually carry
  state on each `BeastySaveable`.
- Autosave at moments a hitch is invisible — a room transition, a menu open — not mid-combat.
- If a save has grown to a size you can feel, the fix is fewer saved components or a smaller data object,
  not a different call.

### JSON nesting depth

The parser caps nesting at **512 levels** (`JsonParser.DefaultMaxDepth`). Data nested deeper than that
saves without complaint but cannot be loaded back: the load fails with `ParseError`. In practice
nothing legitimate reaches 512 — a linked list stored as nested objects, or an
accidental deep structure, is what gets you there. A **reference cycle** is a separate, hard failure: the
save fails with "save data must be acyclic". Your save data must be a tree.

### The format is text

A save file is JSON, indented with two spaces, UTF-8 without a BOM. That is a deliberate trade:

- **Unencrypted, a save is human-readable and hand-editable.** Good for debugging, good for support, and
  an open invitation to a player with a text editor.
- **Encrypted, it is not** — but encryption has a size cost. The payload is AES-encrypted and then Base64
  encoded, which inflates the bytes by roughly a third, plus a random 16-byte IV per save and block
  padding. The envelope and the `meta` dictionary stay in plain text either way, which is what lets
  `ReadMeta` build a slot list without the key.

And be honest with yourself about what the encryption buys: it is obfuscation against casual save editing,
not security. The key ships inside your game. See [Encryption](/docs/beasty-save-system/guides/encryption/).

Text also means the file is bigger than a binary format would be. If your save is measured in tens of
megabytes, the format is part of why.

### Thread safety

Call the API from the **main thread**. That is the expectation the package is built around.

- Reading a component's state means touching the Unity API, and the Unity API is main-thread only. Any
  save that includes scene state — every `SaveAll`, every converter that reads a component — must run on
  the main thread. This is a Unity constraint, not a package one.
- The async variants are `async`/`await`, not background jobs. They return to your caller's context; they
  do not move your work to a worker thread.
- Do not run two saves to the **same slot** at once. The atomic write makes a concurrent write to the same
  slot safe against corruption on disk — a half-written file never replaces a good one — but which of the
  two wins is not something you should be relying on.

Two internals are built to be thread-safe: converter resolution is cached in a concurrent dictionary,
and the mapper's per-load tolerance state is thread-local. That is enough for the async paths to be
sound. It is not a licence to serialize a scene from a worker thread.

### Data limits

A handful of things simply cannot be represented:

- `NaN` and `Infinity` floats — not valid JSON. The save fails.
- Dictionary keys must be strings, primitives or enums.
- `ulong` values larger than `long.MaxValue`.
- References to `UnityEngine.Object` — never saved, on any platform. See
  [What gets saved](/docs/beasty-save-system/guides/what-gets-saved/).

## See also

- [Installation](/docs/beasty-save-system/getting-started/installation/) — requirements and what is in the folder.
- [Async saving](/docs/beasty-save-system/guides/async-saving/) — what `SaveAsync` really does.
- [Encryption](/docs/beasty-save-system/guides/encryption/) — the honest limits.
- [What gets saved](/docs/beasty-save-system/guides/what-gets-saved/) — supported types and hard errors.
- [The save file format](/docs/beasty-save-system/reference/save-file-format/) — the envelope and the write pipeline.
- [Troubleshooting](/docs/beasty-save-system/troubleshooting/)
