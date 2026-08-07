# Changelog

All notable changes to Beasty Visual Novel. This project follows [Semantic Versioning](https://semver.org/).

## 1.0.0 — 2026-08-06

First public release.

### Demos
- House Demo sample at `Demos/HouseDemo`: a complete mini-game showcasing the intro flow (player rename
  prompt, profile choices, invisible decision routing), FreeRoam with two connected rooms, day/night
  backgrounds, a weekly NPC routine, a two-step quest with an inventory pickup and a Deliver step, a talk
  menu with conditional entries, character profile/stats/calendar screens, save/load, and live
  English/Spanish switching. All art ships as labeled placeholder PNGs under `Demos/HouseDemo/Sprites/` —
  replace each file (same name) with final art; no references need rewiring. Story source lives in
  `Demos/HouseDemo/Scripts/*.vnbeasty` (the text-script format, kept in sync).

### Story authoring
- Node graph (dialogue, choice, decision, subgraph, flow) with a block-based editor.
- `.vnbeasty` text script: write scenes as a Ren'Py-like script, kept in two-way sync with the graph. The graph
  stays the source of truth — an empty, unparseable or unrepresentable script never overwrites it, and a
  destructive import leaves a timestamped `.bak`.
- In-editor preview of any node, up to any block.
- The text format has 1:1 parity with the graph — everything the nodes can express is writable in text:
  talk-menu nodes, the choice node's side image, props, layered backdrops with offset/parallax/order,
  `show … portrait <key> slot <n>`, positional `clear characters at <anchor>`, and localized character names.
- A node header leads with its type keyword: `label intro:` is a dialogue node, and `choice cross:`,
  `decision route:`, `subgraph combat:`, `return combat/done ("win"):`, `talkmenu charla (ana):` and
  `flow to_town:` declare the other kinds.
- Dotted variables work everywhere in text: `ana.afecto` in a condition or an effect block compiles to the
  same per-character store key that `set ana.afecto` writes; `item.<id>` and `@time:`/`@quest:`/`@char:`
  keys are valid condition tokens, and `set item.<id>` routes through the inventory (clamping included).
- Typos warn at import: condition tokens, effect keys, `set`/`toggle`/`dict` keys, item ids, quest ids,
  objectives and screen ids are checked against the project's declarations, and an unknown name gets a
  warning with its line number instead of silently creating a dead key at runtime.
- The text editor's autocomplete offers the same catalog the graph's condition picker uses — every variable
  group (globals, character fields as `ana.afecto`, `item.<id>` counts, dictionary tokens, `@time:`/`@quest:`
  reserved keys) — plus the node-kind keywords on header lines, labels, `portrait` keys and anchors. Header
  keywords are syntax-highlighted in their node kind's graph color, and the Text tab ships a Syntax
  cheat-sheet.
- A `Wait` block holds the flow for its seconds BEFORE the next line appears: clicks are swallowed during
  the pause, stepping back cancels it, Skip fast-forwards it, and a rewound revisit does not wait again
  (like side effects, the pause runs once). A Wait of `0` seconds is an auto-advance barrier: Auto stops
  there and waits for a manual advance.
- Story graph nodes can be copied, cut, pasted and duplicated (context menu or Ctrl+C/X/V/D), across Story
  windows and across scene assets. A paste clones the selection with fresh node ids, deep-clones any
  subgraphs, keeps the connections between copied nodes, and mints NEW localization keys whose rows copy
  every language column — so editing a copy's text never edits the original's.
- "Save & apply" in the script Text view is undoable in one step — one Ctrl+Z restores the entire graph,
  its nodes and the localization texts to their pre-import state — and so are "Format", linking and
  unlinking a script. Automatic imports (saving the `.vnbeasty` file externally) are not.

### World
- Free-roam rooms with conditional backgrounds, doors and interactables.
- Game time (dayparts or clock), character routines with profiles, and a routine grid editor.
- Quests with stages, objectives, rewards and a talk-menu hub per character.
- Doors, objects and poses can be deleted from the room timeline (✕ on the chip or a "Delete…" button in
  the element's inspector), with confirmation, removing the matching child from the room prefab in one undo
  step. Deleting a room offers to also delete its room prefab asset — asset deletion is not undoable, and
  the prompt says so.
- Routine profiles can be deleted from the profile selector (the built-in Default profile stays), and a
  character routine left completely empty — no placements, no fallback, no interaction dialogues — is
  pruned from the map graph automatically.
- A character's whole talk menu can be deleted (with confirmation and undo), returning the character to its
  pre-talk-menu state; its localized texts stay in the table.

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
- Switching language in-game changes menus and HUD too: at boot, `BeastyManager` retro-fits
  `VNLocalizedText` onto any label whose text matches a built-in UI default (in any language), so existing
  scenes and prefabs follow the player's language without re-authoring anything. Custom label texts are
  never touched. The UI (global) localization tab also shows a repair button when the table's source column
  is not English.
- The Story window follows language changes: deleting, restoring or renaming a language re-resolves the
  node card previews and the authoring-language selector immediately, and an authoring-language selection
  that no longer exists falls back to the main language instead of silently showing English.
- The global UI localization table heals itself: every scene setup and Auto-wire / Repair pass adopts and
  re-wires a `UILocalization` table that exists but is unassigned, and only when none exists creates a
  fresh one beside the settings asset, pre-seeded with the built-in UI strings. The check is merge-only — a
  healthy table, its custom keys and every edited translation are never touched. A DELETED table's own
  content (custom keys, item names and descriptions, your translations) is not recoverable; regeneration
  restores the built-in strings.
- A typed variable prompt renders the input its type calls for (an `Ask → variable` on a Bool shows a
  true/false dropdown). When a prompt's variable definition cannot be found, the console explains where to
  look (the 'Game Context' field on VNSettings) and the prompt falls back to a free-text field instead of
  degrading with no trace.
- Background music is configured per mode (main menu, visual novel, free-roam, custom), with per-project
  overrides, under the Beasty Manager's **Background Music** foldout. An empty queue means silence in that
  mode: entering it fades the previous mode's music out. To deliberately carry the previous music across a
  mode change, enable the controller's **Keep Previous When Empty** toggle.
- Optional Addressables streaming of node assets (**beta**).

### Saving
- New top-level **Saving** section in the BeastyManager Inspector: storage backend, save location,
  encryption, thumbnail size, and the global save policy (autosave, slots per page, naming) in one place.
- **Cloud storage backends** (Beasty Save System 1.1 Firestore / Realtime Database modules) are supported
  end to end: pick the backend from the Storage dropdown and the save/load screen, autosave queue, slot
  listing, delete and backup restore all work against it (async under the hood, nothing else to configure).
  Requires the Firebase SDK; with no SDK installed nothing changes.
- With a cloud backend, slot **thumbnails travel inside the save** and rebuild the local thumbnail cache
  on any device; local saves keep writing the sibling PNG exactly as before.
- Save-slot **thumbnails no longer show the pause/game menu**: the screenshot is taken the moment the menu
  opens, before it draws (autosaves keep capturing the live scene).
- The BeastyManager's Saving section is now a boxed foldout like the manager sections, with a badge
  showing the active backend ("Active · Firebase Firestore" when a cloud backend is on, "Local file"
  otherwise). Inside, the storage configuration mirrors the Save System's grouping (Backend,
  Location, Security, Reliability, Versioning) and exposes four new per-project settings: data path
  (empty = the platform default), backup, strict loading and data version — all carried into the
  save layer.

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
- Beasty Console is reached by reflection, never by assembly reference: with the console asset removed from
  the project, `VNLog` falls back to `UnityEngine.Debug`, so VN compiles and runs with or without it — and
  importing Beasty Console alongside a project that already bundles it cannot produce a duplicate-assembly
  error.

### Editor
- Undo behaves like one step per gesture: deleting several nodes or edges in the Story graph, creating a
  door/object/pose from a timeline lane, and Auto-wire / Repair each collapse into a single undo step.
- The asset's internal test assemblies compile only when the `BEASTY_DEV_TOOLS` scripting define is set, so
  importing the asset does not fill the Test Runner window with its internal tests. To run them, add
  `BEASTY_DEV_TOOLS` under `Project Settings ▸ Player ▸ Scripting Define Symbols`.

### Licensing
- The package ships no license file of its own: an asset bought on the Unity Asset Store is licensed under
  the Asset Store EULA (https://unity.com/legal/as-terms), and each `Third-Party Notices.txt` points to it.
  Copies bought on itch.io get their own license file, added to the itch download at packaging time.

### Compatibility
- Compiles on every Unity 6 generation, including Unity 6.5, where `Object.GetInstanceID()` became a compile
  error (`error CS0619: 'GetInstanceID is deprecated. Use GetEntityId instead.'`). The package calls the
  replacement `GetEntityId` on Unity 6.4 and newer, and keeps `GetInstanceID` on 6.0–6.3, where the new API
  does not exist yet.
- Importing on Unity 6.4/6.5 prints no deprecation warnings either: scene lookups use `FindAnyObjectByType`
  and, on 6.4+, the sort-free `FindObjectsByType` overloads and `ContactFilter2D.noFilter` (every replaced
  lookup targeted a single object, so behavior is unchanged), and two never-used inspector fields
  (`CharacterRoutineScreen`'s Day/Week header labels) were removed.
- Unity 6.2/6.3 import warning-free too: there `ContactFilter2D.NoFilter()` is already flagged deprecated but
  is still the correct API (its replacement arrived in 6.4), so its warning is suppressed at the call site
  instead of switching APIs early.
