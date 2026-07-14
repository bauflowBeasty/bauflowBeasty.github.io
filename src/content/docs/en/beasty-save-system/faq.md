---
title: "FAQ"
description: "Short answers. Each one links to the page that explains it properly."
---

Short answers. Each one links to the page that explains it properly.

## Does it need Newtonsoft, or any other package?

No. The package has **zero external dependencies**. It ships its own JSON engine, so there is nothing to
install and nothing to conflict with a version of Newtonsoft your project already uses. The optional
converter modules need Unity's own modules (physics, audio, uGUI and so on), and if one of those is absent
the module simply does not compile and the rest of the package still works.

See [Installation](/docs/beasty-save-system/getting-started/installation/) and
[Converter modules](/docs/beasty-save-system/reference/converter-modules/).

## Can I use it with my existing save data?

Not directly. A Beasty save is an envelope with its own version, checksum and payload, so the system cannot
read a file written by another save asset or by your own hand-rolled serializer.

The migration path is a one-off in your code: read your old file with whatever wrote it, build your data
object from it, and call `BeastySave.Save`. From then on the file is a Beasty save.
`BeastySave.RegisterMigration` is for moving **between versions of your own Beasty saves**, not for
importing a foreign format. See [Versioning and migrations](/docs/beasty-save-system/guides/versioning-and-migrations/).

## Does it work with IL2CPP?

Yes. Mono and IL2CPP are both supported, and the serialization paths — the ones AOT builds usually break —
are exercised by a smoke scene run against a real IL2CPP build, not against the editor with the backend
switched. See [Platforms and limits](/docs/beasty-save-system/advanced/platforms-and-limits/).

## Does it work on WebGL?

**No.** WebGL is not supported in 1.0.0. The atomic write depends on file-system semantics the browser
build does not provide, and the async variants are `Task`-based. There is no setting that turns it on and
no supported workaround; a browser build needs a different persistence layer.
[Platforms and limits](/docs/beasty-save-system/advanced/platforms-and-limits/) says exactly why.

## Is the encryption secure?

**No, and you should not treat it as if it were.** It is AES-256, and it is real AES-256 — but the key
ships inside your game and can be extracted from the build. That makes it obfuscation against a player
editing their save in Notepad, not security against a determined attacker. It will not protect a
leaderboard or an in-app purchase.

Use it to stop casual cheating, and design anything that has to be trustworthy to be validated on a server.
See [Encryption](/docs/beasty-save-system/guides/encryption/).

## Can I save a Dictionary?

Yes. `Dictionary`, `HashSet`, `SortedSet`, `Queue`, `Stack`, `List` and arrays all round-trip. Dictionary
keys must be strings, primitives or enums — a key of any other type fails the save. See
[What gets saved](/docs/beasty-save-system/guides/what-gets-saved/).

## Can I save a ScriptableObject reference? A sprite? A prefab?

No. References to `UnityEngine.Object` are **never** written to a save file — not as fields, not inside
collections. This is the package's sharpest edge and it is deliberate.

The upside is that they are not overwritten on load either: the references you wired in the scene survive
untouched. The pattern is to save an **id** — a string — and resolve the asset yourself after loading.
See [What gets saved](/docs/beasty-save-system/guides/what-gets-saved/).

## Can I have different settings for autosave and manual save?

Yes, from code. `BeastySaveSettings` is a plain serializable class and every `BeastySave` call takes an
instance, so you can hand a different one to each call — a different folder, a different extension,
encryption on for one and off for the other.

The zero-code path is one settings object: `BeastySaveManager` holds a single `settings` field that
`SaveAll` and `LoadAll` both use. Note that changing `Folder` or `Extension` changes what `ListSlots`
finds. See [Settings](/docs/beasty-save-system/guides/settings/).

## How big can a save be?

There is no hard cap, but serialization is **synchronous** — including inside `SaveAsync`, which does the
file IO asynchronously while building and encrypting the JSON on the calling thread. So a very large save
costs a frame hitch proportional to its size, and `await`ing it does not remove that hitch.

Save game state, not the whole scene, and autosave at moments a hitch is invisible. See
[Platforms and limits](/docs/beasty-save-system/advanced/platforms-and-limits/) and [Async saving](/docs/beasty-save-system/guides/async-saving/).

## Can I read a save file by hand?

Yes, unless you encrypted it. A save is JSON, indented with two spaces, UTF-8 without a BOM, and you can
open it in any text editor. That is useful for debugging and for support, and it is also an open invitation
to a player with a text editor — which is what the encryption option is for.

The `meta` dictionary stays in plain text **even when the save is encrypted**, so a slot-selection screen
can show the level and the playtime without the key. Treat it as untrusted display data: it is read before
the checksum. See [The save file format](/docs/beasty-save-system/reference/save-file-format/) and
[Slots and metadata](/docs/beasty-save-system/guides/slots-and-metadata/).

## Is it thread-safe?

Call it from the main thread. Anything that saves scene state has to touch the Unity API, and the Unity API
is main-thread only. The async variants are `async`/`await`, not background jobs — they keep you off the IO
stall, they do not move your work to a worker thread. See
[Platforms and limits](/docs/beasty-save-system/advanced/platforms-and-limits/).

## Can I use just the JSON engine?

Yes. `JsonNode`, `JsonMapper`, `JsonParser` and `JsonWriter` are public and usable on their own, with no
dependency on the save pipeline. Parse, build a DOM, map objects to and from it, write it back out. See
[The JSON engine](/docs/beasty-save-system/reference/json-engine/).

## Does it work without the visual novel package?

Yes. Beasty Save System is a standalone package, sold separately, that happens to also ship inside
[Beasty Visual Novel](/docs/beasty-visual-novel/). It has no dependency on the visual novel code and
nothing in it assumes a VN project.

## Do I have to write code to use it?

No. Add a `BeastySaveManager` to the scene, add a `BeastySaveable` to the objects you want remembered, tick
the components that carry their state, and wire `SaveAll` and `LoadAll` straight to a uGUI Button's
OnClick with the slot name typed into the inspector. See
[Save without code](/docs/beasty-save-system/getting-started/save-without-code/).

## What happens if a save file gets damaged?

The write is atomic — a crash mid-write cannot leave half a save behind — and the previous file is rotated
to `<slot>.<ext>.bak` on every save after the first. A corrupt file is never rotated into the backup, so
the `.bak` is always the last copy that verified.

A damaged file fails to load with `Corrupt`, and every `LoadResult` carries `BackupAvailable`. Offer the
player `BeastySave.RestoreBackup`. See [Backups and corruption](/docs/beasty-save-system/guides/backups-and-corruption/).

## Does it throw exceptions?

No. Every call on `BeastySave` returns a typed result — `SaveResult` or `LoadResult<T>` — with a `Success`
flag, a `BeastySaveError` code and a message. You never have to wrap a save in a try/catch. You do have to
check the result. See [Results and errors](/docs/beasty-save-system/reference/results-and-errors/).

## Can I add support for a type it does not know?

Yes, and you can also replace what a built-in converter stores. Implement `IBeastyConverter` and register
it with `BeastySave.RegisterConverter` (highest priority) or `BeastySave.RegisterModule` (a named,
idempotent group). Register it from a `[RuntimeInitializeOnLoadMethod]` — entering Play Mode resets the
statics. See [Custom converters](/docs/beasty-save-system/advanced/custom-converters/).

## See also

- [Troubleshooting](/docs/beasty-save-system/troubleshooting/)
- [What gets saved](/docs/beasty-save-system/guides/what-gets-saved/)
- [Platforms and limits](/docs/beasty-save-system/advanced/platforms-and-limits/)
