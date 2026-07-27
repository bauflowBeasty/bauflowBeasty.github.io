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

- **`.vnbeasty` reaches 1:1 parity with the node graph.** Everything the nodes can express is now writable in
  text: talk-menu nodes (`label charla (talkmenu ana):`), the choice node's side image (`image <sprite>
  [if <cond>]`), props (`props <sprite>[, …]` / `props clear`), layered backdrops with offset/parallax/order,
  `show … portrait <key> slot <n>`, `expression … portrait [<key>]`, positional `clear characters at <anchor>
  [layer <n>]`, and localized character names (`name ana = key <locKey>`).
- **Dotted variables work everywhere in text.** `ana.afecto` in a condition or an effect block now compiles
  to the same per-character store key that `set ana.afecto` writes (before, it silently targeted a key that
  never existed). `item.<id>` and raw `@time:`/`@quest:`/`@char:` keys are also valid condition tokens, and
  `set item.<id>` routes through the inventory (clamping included).
- **Typos warn at import.** Condition tokens, effect keys, `set`/`toggle`/`dict` keys, item ids, quest ids,
  objectives and screen ids are checked against the project's declarations; an unknown name gets a warning
  with its line number instead of silently creating a dead key at runtime.
- **The text editor's autocomplete now offers every variable group** (globals, character fields as
  `ana.afecto`, `item.<id>` counts, dictionary tokens, `@time:`/`@quest:` reserved keys) — the same catalog
  the graph's condition picker uses — plus the new keywords, `portrait` keys and anchors.
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
- **Story window edges no longer drift when zooming or panning.** On large graphs, a wire whose nodes had
  been culled off-screen (or simplified by the far-zoom LOD) could reappear floating in mid-air or seemingly
  attached to the wrong node until it was selected or the view moved again. Edges now recompute their
  position as soon as they come back into view, and a wire is never drawn while one of its endpoints is
  still hidden.
- **VN logging no longer requires Beasty Console to be present.** `VNLog` now reaches the console by
  reflection and falls back to `UnityEngine.Debug` when the console asset is not in the project — so VN
  compiles and runs with or without it (before, its assemblies referenced `Beasty.Console` directly, and
  deleting the console broke the build). When the console is present, logs keep landing in its window
  exactly as before, and importing Beasty Console alongside a project that already bundles it no longer
  risks a duplicate-assembly error.
- **`.vnbeasty` node headers now lead with the node kind.** A node opens with its type keyword followed by
  its name: `choice cross:`, `decision route:`, `subgraph combat:`, `return combat/done ("win"):`,
  `talkmenu charla (ana):`, `flow to_town:` — and `label intro:` stays the plain dialogue node. This is the
  form the writer now emits (a linked script is rewritten to it on the next graph sync); the previous
  `label <name> (choice):` tag form still parses, so existing scripts keep working. A type tag that
  contradicts the keyword (`choice cross (decision):`) is an import error.
- **The text tab's autocomplete now works on header lines too.** Column 0 suggests the node-kind keywords
  (`label`, `choice`, `decision`, `subgraph`, `return`, `talkmenu`, `flow`) plus `scene` and `start`;
  `start ` suggests the script's labels, `talkmenu ` suggests character ids for its `(<character>)`
  argument, and `jump` / route targets pick up labels declared with the new kind-first headers. Header
  keywords are syntax-highlighted in their node kind's graph color, and the Syntax cheat-sheet shows the
  new form.
- **The asset's internal tests no longer show up in your Test Runner.** The test assemblies that ship with
  the package now compile only when the `BEASTY_DEV_TOOLS` scripting define is set, so importing the asset
  no longer fills the Test Runner window with its internal tests. To run them, add `BEASTY_DEV_TOOLS` under
  `Project Settings ▸ Player ▸ Scripting Define Symbols`.
- **An empty music queue now means silence in that mode.** Entering a mode (main menu, visual novel,
  free-roam, custom) whose background-music queue has no clips fades the previous mode's music out instead of
  letting it play on forever — clips assigned only to Main Menu no longer keep sounding over gameplay after
  Play or a loaded save. To deliberately carry the previous music across a mode change, enable the
  controller's **Keep Previous When Empty** toggle, now visible in the Beasty Manager inspector under the new
  **Background Music** foldout (it used to be hidden, and on, with no way to see it).
- **Per-project music now applies when entering a story.** The music queue used to resolve before the VN
  session existed, so a project's music override could be ignored — or the previous project's music kept —
  when starting a new game, opening a talk menu or loading a save; it is re-resolved once the session is
  live. The current mode's music also starts on scene load regardless of component initialization order, and
  auto-wire keeps the controller pointed at the same music config asset the Music tab edits.
- **Doors and objects can finally be deleted from a room.** In the room timeline, door/object chips got a ✕
  button, and the selected element's inspector a "Delete door… / Delete object… / Delete pose…" button. Both
  confirm first and also remove the matching child from the room prefab, in one undo step. Before, a created
  door or object could not be removed from the editor at all.
- **Routine profiles can be deleted** from the profile selector ("Delete profile…", with confirmation; the
  built-in Default profile stays). A character routine left completely empty — no placements, no fallback, no
  interaction dialogues — is pruned from the map graph automatically, in the same undo step as the deletion
  that emptied it.
- **Deleting a room now offers to also delete its room prefab asset**, which used to stay behind as an
  orphan in the project (asset deletion is not undoable; the prompt says so).
- **A character's whole talk menu can be deleted** ("Delete talk menu…", with confirmation and undo),
  returning the character to its pre-talk-menu state. Its localized texts stay in the table.
- **"Save & apply" in the script Text view is now undoable.** One Ctrl+Z restores the entire graph, its
  nodes and the localization texts to their pre-import state; "Format", linking and unlinking a script are
  undoable too. Automatic imports (saving the `.vnbeasty` file externally) are unchanged.
- **Undo now behaves like one step per gesture.** Deleting several nodes or edges in the Story graph,
  creating a door/object/pose from a timeline lane, and Auto-wire / Repair each collapse into a single undo
  step instead of several. Editing a character-list visibility condition now undoes itself rather than the
  previous unrelated action, variable/item pickers and localization lookups refresh after an undo instead of
  offering stale entries, and the FreeRoam timeline and routine grid drop a selection that an undo removed
  instead of silently editing a disconnected copy.
- **The package no longer ships its own license file.** `BeastyVN_LICENSE.md` is gone (and so are the bundled
  save system's and console's): an asset bought on the Unity Asset Store is licensed under the Asset Store
  EULA (https://unity.com/legal/as-terms), and an independent license inside the package conflicts with it.
  Each `Third-Party Notices.txt` now points to that EULA. Copies bought on itch.io get their own license
  file, added to the itch download at packaging time.

### Persistence

- Slot saves with thumbnails, autosaves, backups, and optional encryption.
- Scene-object state (`BeastySaveable`) rides inside the save.

### Logging

- Every VN log goes through `VNLog` into the Beasty Console window
  (`Tools > Beasty Console > Console`), tagged with a category — Data, Director, Stage, Streaming,
  Save, Verbose — so a noisy subsystem can be silenced without silencing the rest.
- `VNLog.Enabled` is on in the editor and in development builds and off in a release build, so a shipped game
  does not write a line into the player's log for every dialogue line, choice and room change. Warnings, errors
  and exceptions ignore the per-category switches: only that master switch hides them.
- The package bundles **Beasty Console** and **Beasty Save System**; importing this asset gives you the full
  copy of each, and there are no external dependencies.
