# The Save Manager window

`Tools > Beasty Save System > Save Manager` opens the one editor window in the package. It does three
things: it creates and configures the scene's `BeastySaveManager`, it makes objects saveable, and it shows
you the save files on disk so you can inspect, restore or delete them without leaving Unity.

The window is titled **Beasty Save Manager**. You can dock it anywhere.

![The Save Manager window with all three sections](../images/save-manager-window.png)

## Manager

The top section finds the `BeastySaveManager` in the open scene — including one on an inactive object.

**When there is no manager**, you get a message ("No BeastySaveManager in the open scene.") and one button:

- **Create Beasty Save Manager** — creates a GameObject called `Beasty Save Manager` with the component on
  it. It is a single undoable step, so `Ctrl+Z` removes it cleanly. This is the fastest way to set up a new
  scene, and it is where the zero-code path starts.

**When there is a manager**, you get an object field pointing at it (click it to select it in the
Hierarchy) and its full inspector embedded below.

That embedded inspector is where you edit **Settings** — the folder, the extension, the data path,
encryption, backup, strict loading and the data version used by `SaveAll` and `LoadAll`. Editing it here is
exactly the same as selecting the manager and editing it in the Inspector; it is here so you do not have to
change your selection while you work. Every field is explained in [settings.md](settings.md).

The **Slots on Disk** section below reads the same settings, so changing `Folder` here immediately changes
which files the window lists.

## Saveables in Scene

The middle section is about which objects get saved.

### The drop zone

A box that says **"Drag GameObjects here to make them saveable"**. Drag one or more objects from the
Hierarchy onto it and each gets a `BeastySaveable` component with a fresh id. It is undoable.

Objects that already have a `BeastySaveable` are ignored, so you can drag a whole selection over without
worrying about duplicates.

Use it when you are setting up a scene and want to mark ten objects at once instead of using
`Add Component` ten times.

> **Note**
> The drop zone adds the component and the id. It does **not** tick any components for you. Select each
> object and tick what you want to save in its **Saved Components** checklist — see below.

### The list

Below the drop zone is every `BeastySaveable` in the open scene, **including the ones on inactive objects**.
Each row shows three things:

- The object itself, as an object field. Click it to select the object.
- How many components it saves (`2 comp.`).
- Its **save id**.

This list is how you audit a scene. Two things to look for:

- **A saveable with `0 comp.`** — it is registered, it is in the save file, and it stores nothing. Somebody
  added the component and never ticked anything.
- **Two rows with the same id** — a duplicate. The second object is not registered at all and falls out of
  the save (an error is logged when the scene runs). This usually comes from copy-pasting an object whose
  id was typed by hand. Give one of them a different id. See [scene-state.md](scene-state.md).

### The BeastySaveable inspector

Selecting a saveable gives you its own inspector, which is worth describing here because it is where the
real work happens:

- **Save Id** — the id, editable, with a **New** button that generates a fresh one. Changing the id orphans
  the data already saved under the old one.
- **Saved Components** — a checklist of every component on the GameObject. Tick the ones you want in the
  save. Each is labelled with the layer that converts it: `core` (always available), a module id such as
  `ugui` or `physics3d`, or `dev` for a converter you registered yourself.
- **A warning** when you tick a component nothing can convert. It says so plainly: `SaveAll` will fail with
  `TypeUnavailable`. Untick it, or read
  [converter-modules.md](../reference/converter-modules.md).

## Slots on Disk

The bottom section lists the actual files in the folder your settings point at. This is the part you will
keep open while you test.

Two buttons in the header:

- **Refresh** — re-reads the folder. The window does not watch the disk, so after saving from a running
  game, click this to see the new file. Nothing is cached across a refresh.
- **Open Folder** — opens the save folder in your operating system's file browser. This is the reliable way
  to find `persistentDataPath` without looking it up. Use it to open a save file in a text editor, to copy
  one aside before an experiment, or to send one to a colleague.

If there are no files, the section says so ("No save files in the configured folder."). If you expected
files and see none, check the `Folder` and `Extension` in the Manager section above — the window looks
exactly where your settings say to.

### Each slot

Every save file gets a row:

**The slot name.** The name you would pass to `SaveAll`, `Load` or `Delete`. No extension, no path.

**A metadata summary.** The `meta` dictionary written with the save, shown as up to four `key: value` pairs
joined with `·`, then `…` if there are more. This is the whole point of metadata: a chapter name, a
playtime, a level number, readable at a glance. Metadata stays in **plain text even in an encrypted save**,
so the summary works whether or not the file is encrypted, and without the key. See
[slots-and-metadata.md](slots-and-metadata.md).

If the file cannot be read at all, the summary is replaced by `unreadable:` and the error — `Corrupt`,
`ParseError`, `VersionTooNew` and so on. That is a diagnosis, and the error codes are explained in
[results-and-errors.md](../reference/results-and-errors.md).

**Restore Backup.** Copies the slot's `.bak` file over the slot. It asks for confirmation first ("Replace
slot 'x' with its .bak file?"), and it is **disabled when there is no `.bak`** — including for a slot that
has only ever been saved once, because the first save of a slot creates no backup.

Use it when a slot reads as `unreadable`, or when you want to undo the last save during testing. The `.bak`
is left in place afterwards, so restoring twice is safe. [backups-and-corruption.md](backups-and-corruption.md)
explains what a `.bak` is and when one appears.

**Delete.** Removes the save file **and its backup**. It asks for confirmation ("Delete save file 'x' (and
its backup)?"). There is no undo — these are files on disk, not assets in your project.

Use it to get back to a clean state between tests. If you want to keep the file, use **Open Folder** and
move it somewhere else instead.

## See also

- [save-without-code.md](../getting-started/save-without-code.md) — the window in use, from an empty scene
- [scene-state.md](scene-state.md) — ids, spawned objects, and what `SaveAll` actually writes
- [settings.md](settings.md) — every field in the Manager section
- [backups-and-corruption.md](backups-and-corruption.md) — the `.bak` file and Restore Backup
- [slots-and-metadata.md](slots-and-metadata.md) — the metadata behind the slot summaries
- [components.md](../reference/components.md) — `BeastySaveable` and `BeastySaveManager`, field by field
