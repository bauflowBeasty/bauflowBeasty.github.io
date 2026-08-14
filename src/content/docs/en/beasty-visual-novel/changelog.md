---
title: "Changelog"
description: "All notable changes to Beasty Visual Novel, version by version. The project follows Semantic Versioning."
---

All notable changes to Beasty Visual Novel. This project follows [Semantic Versioning](https://semver.org/).

## 1.0.1 — 2026-08-14

### Story authoring
- Fixed: the `.vnbeasty` text editor and its Syntax cheat-sheet no longer spam
  `NullReferenceException` on projects using UI Toolkit's Advanced Text Generator — the default text
  backend of new Unity 6000.3+ projects. Colors and the overlay's glyph alignment are unchanged.

## 1.0.0 — 2026-08-13

First public release.

### Demos
- House Demo sample at `Demos/HouseDemo`: a complete mini-game covering the intro flow, FreeRoam with
  two connected rooms, day/night backgrounds, a weekly NPC routine, a two-step quest, a talk menu,
  character screens, save/load and live English/Spanish switching. All art ships as labeled
  placeholder PNGs under `BeastyVN/Sprites/` — replace each file (same name) with final art.
- House Demo: sleeping in the bed advances time, the bed swaps to a night art variant, and the
  bedroom door lights up on hover.

### Story authoring
- Node graph (dialogue, choice, decision, subgraph, flow) with a block-based editor.
- `.vnbeasty` text script: write scenes as a Ren'Py-like script, kept in two-way sync with the graph.
  The graph stays the source of truth, and a destructive import leaves a timestamped `.bak`.
- In-editor preview of any node, up to any block.
- The text format has 1:1 parity with the graph — everything the nodes can express is writable in
  text.
- A node header leads with its type keyword: `label`, `choice`, `decision`, `subgraph`, `return`,
  `talkmenu`, `flow`.
- Dotted variables work everywhere in text: `ana.afecto`, `item.<id>` counts and
  `@time:`/`@quest:`/`@char:` keys, in conditions and effects alike.
- Item counts start at `0`: a new game seeds `item.<id>` for every item in the catalog.
- Typos warn at import: unknown variable, item, quest, objective and screen names get a warning with
  their line number.
- The text editor's autocomplete offers the full variable catalog, node keywords, labels, portrait
  keys and anchors, and the Text tab ships a Syntax cheat-sheet.
- A `Wait` block holds the flow for its seconds before the next line appears; a Wait of `0` seconds
  is an auto-advance barrier.
- Story graph nodes can be copied, cut, pasted and duplicated across windows and scene assets,
  minting new localization keys so editing a copy never edits the original.
- "Save & apply" in the Text view is undoable in one step, and so are "Format", linking and unlinking
  a script.

### World
- Free-roam rooms with conditional backgrounds, doors and interactables.
- Game time (dayparts or clock), character routines with profiles, and a routine grid editor.
- Quests with stages, objectives, rewards and a talk-menu hub per character.
- Doors, objects and poses can be deleted from the room timeline — prefab child included — in one
  undo step.
- Routine profiles can be deleted, and a completely empty character routine is pruned from the map
  graph automatically.
- A character's whole talk menu can be deleted, with confirmation and undo.

### Presentation
- Dialogue, choices, backlog, history, save/load, preferences and help screens, all localizable.
- Localization tables with per-cell staleness tracking and CSV/TSV import and export.
- Languages are added from a dropdown of 15 curated languages plus `Custom…`; adding a curated one
  pre-fills the built-in UI strings in that language.
- Deleting a language asks for confirmation and moves it to a restorable **Deleted languages** trash
  instead of destroying its texts.
- Deleting the MAIN language promotes the next one; language operations apply to the story table and
  the global UI table together.
- A line with no translation in the active language shows the source-language text instead of a
  blank.
- **Bake Localized UI Labels**: permanently adds `VNLocalizedText` to every matching label in the
  scene, writing into the source prefabs.
- The `VNLocalizedText` inspector can create a fresh `ui.*` key from a label's text with one button.
- The `VNLocalizedText` inspector also edits the key's source-language text in place, with
  "From label"/"To label" sync buttons.
- Switching language in-game changes menus and HUD too: at boot, labels matching a built-in UI
  default are retro-fitted automatically.
- The Story window follows language changes — delete, restore, rename — immediately.
- The global UI localization table heals itself: setup and Repair passes adopt an unassigned table,
  and only create a fresh one when none exists.
- A typed variable prompt renders the input its type calls for (a Bool shows a true/false dropdown).
- Background music is configured per mode (main menu, visual novel, free-roam, custom); an empty
  queue means silence in that mode.
- Optional Addressables streaming of node assets (**beta**).

### Saving
- New top-level **Saving** section in the BeastyManager Inspector: backend, save location,
  encryption, thumbnails and the global save policy in one place.
- Cloud storage backends (Beasty Save System 1.1 Firestore / Realtime Database modules) are
  supported end to end. Requires the Firebase SDK; without it nothing changes.
- With a cloud backend, slot thumbnails travel inside the save and rebuild the local cache on any
  device.
- Save-slot thumbnails no longer show the pause menu: the screenshot is taken before it draws.
- The Saving section mirrors the Save System's grouping and adds per-project data path, backup,
  strict loading and data version settings.

### Persistence
- Slot saves with thumbnails, autosaves, backups, and optional encryption.
- Scene-object state (`BeastySaveable`) rides inside the save.

### Logging
- Every VN log goes through `VNLog`, tagged with a category, so a noisy subsystem can be silenced
  without silencing the rest.
- `VNLog.Enabled` is on in the editor and development builds and off in a release build; warnings,
  errors and exceptions always pass.
- The package bundles **Beasty Save System** and has no external dependencies. **Beasty Console is
  not included**: it is its own asset, and optional.
- Beasty Console is reached by reflection, never by assembly reference: the VN compiles and runs
  with or without it.

### Editor
- Undo behaves like one step per gesture in the Story graph, the room timeline and Auto-wire /
  Repair.
- The internal test assemblies compile only when the `BEASTY_DEV_TOOLS` scripting define is set.

### Licensing
- The package ships no license file of its own: Asset Store copies are licensed under the Asset
  Store EULA; itch.io copies get their own license file at packaging time.

### Compatibility
- Compiles on every Unity 6 generation, including 6.5's `GetInstanceID` deprecation (the package
  calls `GetEntityId` on 6.4+).
- Imports with no deprecation warnings on Unity 6.4/6.5, with behavior unchanged.
- Unity 6.2/6.3 import warning-free too (the one early-flagged API keeps its warning suppressed at
  the call site).
