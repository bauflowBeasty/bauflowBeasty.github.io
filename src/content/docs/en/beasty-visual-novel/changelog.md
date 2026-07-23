---
title: "Changelog"
description: "All notable changes to Beasty Visual Novel, version by version. The project follows Semantic Versioning."
---

All notable changes to Beasty Visual Novel. This project follows [Semantic Versioning](https://semver.org/).

## 1.0.0 — unreleased

First public release.

### Story authoring

- Node graph (dialogue, choice, decision, subgraph, flow) with a block-based editor.
- `.vnbeasty` text script: write scenes as a Ren'Py-like script, kept in two-way sync with the graph. The graph
  stays the source of truth — an empty, unparseable or unrepresentable script never overwrites it, and a
  destructive import leaves a timestamped `.bak`.
- In-editor preview of any node, up to any block.

### World

- Free-roam rooms with conditional backgrounds, doors and interactables.
- Game time (dayparts or clock), character routines with profiles, and a routine grid editor.
- Quests with stages, objectives, rewards and a talk-menu hub per character.

### Presentation

- Dialogue, choices, backlog, history, save/load, preferences and help screens, all localizable.
- Localization tables with per-cell staleness tracking and CSV/TSV import and export.
- Languages are added from a dropdown of 15 curated languages (the same names the in-game language dropdown
  shows: English, Spanish, French, German…) plus a `Custom…` option for hand-typed codes. Adding a curated
  language pre-fills the built-in UI strings (menus, HUD, dialogs, save/load screens) in that language, so the
  interface arrives translated without touching a single key.
- Deleting a language always asks for confirmation and moves it to a **Deleted languages** trash instead of
  destroying its texts: from there it can be restored (its translations come back) or deleted permanently,
  behind a second confirmation that warns the texts are unrecoverable. Adding a language whose code sits in
  the trash restores it instead of creating an empty duplicate.
- Deleting the MAIN language promotes the next one: its texts become the source column, and the Story window,
  the supported-languages list and `VNSettings.defaultLanguage` all follow automatically. Language add,
  delete, restore and rename apply to the story table and the global UI table together, so the in-game
  language dropdown always matches the story's languages.
- A dialogue or UI line with no translation in the active language shows the source-language text instead of
  a blank line or a placeholder key.
- **Bake Localized UI Labels** (Localization ▸ UI tab, or `Tools ▸ Beasty VN ▸ Setup`): permanently adds
  `VNLocalizedText` (with its key serialized) to every label in the open scene whose text matches a UI-table
  value — writing into the SOURCE prefabs, so every instance is fixed once and the labels keep localizing no
  matter how they are later moved, renamed or restyled.
- The `VNLocalizedText` inspector can now CREATE a key: a label whose text is not in the table yet gets a
  fresh `ui.*` key minted from that text (stored as the key's source-language value) with one button — no
  need to add the key in the table first.
- The `VNLocalizedText` inspector also edits the key's SOURCE-language text in place (it lives in the table,
  so existing translations correctly flag stale when it changes), with two sync buttons against the TMP label
  on the same object: "From label" copies the label's current text into the source value, "To label" writes
  the source value onto the label.
- Optional Addressables streaming of node assets (**beta**).

### Pre-release changes

- **The Story window follows language changes**: deleting, restoring or renaming a language re-resolves the
  node card previews and the authoring-language selector immediately, and an authoring-language selection
  that no longer exists falls back to the main language instead of silently showing English.
- **Switching language in-game now changes menus and HUD too.** Two fixes: the bundled `UILocalization`
  table shipped with an empty English column (so every language fell back to the same texts), and the menu
  screens nested in the `VN_Canvas` prefab carried their labels BAKED into the TMP components with no
  `VNLocalizedText` — those menus could never react to a language change. At boot, `BeastyManager` now
  retro-fits `VNLocalizedText` onto any label whose text matches a built-in UI default (in any language), so
  existing scenes and prefabs follow the player's language without re-authoring anything. Custom label texts
  are never touched. The UI (global) localization tab also shows a repair button when the table's source
  column is not English.

### Persistence

- Slot saves with thumbnails, autosaves, backups, and optional encryption.
- Scene-object state (`BeastySaveable`) rides inside the save.

### Logging

- Every VN log goes through `VNLog` into the Beasty Console window
  (`Tools > Beasty VN > Diagnostics > Console`), tagged with a category — Data, Director, Stage, Streaming,
  Save, Verbose — so a noisy subsystem can be silenced without silencing the rest.
- `VNLog.Enabled` is on in the editor and in development builds and off in a release build, so a shipped game
  does not write a line into the player's log for every dialogue line, choice and room change. Warnings, errors
  and exceptions ignore the per-category switches: only that master switch hides them.
- The package bundles **Beasty Console** and **Beasty Save System**; importing this asset gives you the full
  copy of each, and there are no external dependencies.
