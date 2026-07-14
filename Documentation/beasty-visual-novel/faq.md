# FAQ

Short answers, with a link to the page that has the long one.

## Do I need to know how to code?

No. The entire authoring path is windows, menus and prefabs.

Writing the story, branching it, defining characters and variables, quests, routines, game time, rooms and
doors, the inventory, localization, saving and loading, the menus and the HUD: all of it is done in the
Beasty VN window and the Unity inspector. You never open a C# file, and the shipped scene plays without one
line of your code.

Code becomes necessary in exactly three places:

- You want a **game mode of your own** - a minigame, a battle, a map screen. That goes in the `Custom` app
  state. See [Custom mode](scripting/custom-mode.md).
- You want to **read or drive the game from your own scripts** - react to a choice, read a quest state, push
  a variable. See [The VN API](scripting/vn-api.md).
- You want **UI behaviour** the prefabs do not have. Restyling needs no code; new behaviour does.

## Which render pipelines are supported?

Built-in, URP and HDRP. The package draws with standard Unity sprites, uGUI and TextMeshPro, and ships no
custom shaders or materials, so there is nothing pipeline-specific to break.

See [Building and platforms](production/building-and-platforms.md).

## Which Unity version do I need?

Unity 6000.2 or newer.

See [Installation](getting-started/installation.md).

## Does it work with the Input System?

Yes - and with the classic Input Manager, and with both at once. The input layer is chosen by Unity's own
**Active Input Handling** setting, so the package compiles in a project that has never installed the Input
System package.

Bindings are edited in the **Controls** section of the BeastyManager inspector, with dropdowns. It is a
serialized config, not an `.inputactions` asset. The player can rebind at runtime, and the overrides are
saved.

See [Input and controls](production/input-and-controls.md).

## Do I need Addressables?

No. The default is direct references, which resolve synchronously and cost nothing.

Addressables is only needed if you turn on streaming, which is opt-in and beta in 1.0.0. Without the package
installed, the streaming module does not even compile in, and everything works normally.

See [Streaming](production/streaming.md).

## Do I need Newtonsoft, or any other package?

No. There are no third-party dependencies. The save system has its own JSON engine, so nothing is bundled
that could collide with a package you already use.

## Does it include a save system?

Yes. Beasty Save System ships inside this package - no extra import, no extra purchase.

Saving, loading, autosave, slots, PNG thumbnails, backups and optional encryption all work out of the box. A
save holds the entire variable store, the position in the story, the stage, the free-roam state, the rewind
history and the state of the `BeastySaveable` components in your scene.

See [Saving and loading](production/saving-and-loading.md) and the
[Beasty Save System docs](../beasty-save-system/README.md).

## Can my writer work in a text file while I build in the graph?

Yes. Each story can carry a `.vnbeasty` script: one file, one scene, plain text, versionable, diffable.

The contract in one paragraph. The graph is the source of truth. Saving the file applies text to graph;
**Sync from graph** writes graph to text. If both sides changed, the most recent save wins and a timestamped
`.bak` of the overwritten side is left next to the file. An import that fails to parse, is empty, or would
destroy content is refused, and the graph is left untouched. Assets resolve by GUID, so renaming art does not
break a synced node.

The limit to know up front: **a backdrop with more than one sprite layer has no text form**. Those scenes
stay graph-only.

See [The text script](authoring/text-script.md) and
[the .vnbeasty syntax](authoring/vnbeasty-syntax.md).

## Can I use my own UI?

Yes. Everything the player sees is a uGUI prefab with its art in one folder. Restyle the prefabs, or point
the views at a canvas of your own.

`Tools > Beasty VN > Setup > Upgrade UI Prefabs (keep customizations)` updates the shipped prefabs without
throwing away your changes.

The story engine (`Core`) is a separate assembly from the view layer, so you can replace the presentation
without touching the engine.

See [UI prefabs](production/ui-prefabs.md) and [Prefabs](reference/prefabs.md).

## Can I use it for a dating sim, a life sim or a detective game?

Yes. Beyond the visual novel, the package ships the systems those genres need:

- **Dating sim**: character stats, affection variables, a talk menu per character, conditional choices,
  aliases and delivery styles.
- **Life sim**: game time with dayparts, character routines and profiles, free-roam rooms, quests with daily
  and weekly recurrence.
- **Detective game**: an inventory with key items, conditional doors, decision nodes, a dictionary of
  player-editable tokens, quest objectives with hints.

Start at [Core concepts](getting-started/core-concepts.md), then read the pages under `world/`.

## Is WebGL supported?

No. WebGL is not a supported platform.

See [Building and platforms](production/building-and-platforms.md).

## Can I localize into any number of languages?

Yes. A localization table is a grid of keys by language, and you add as many languages as you want. Index 0
is the source language.

Each cell records a fingerprint of the source text it was translated from, so when you edit a line its
translations are marked **Stale** and you can export exactly the lines that changed as CSV or TSV.

See [Localization](production/localization.md).

## Can the player switch language mid-game?

Yes, live. The current line, the choices and the talk menu re-render immediately. There is one source of
truth for the active language, shared by the story text and the interface.

On startup the game uses the player's saved choice, then the OS language if `autoDetectSystemLanguage` is on,
then the default.

## Can I add my own minigame?

Yes. That is what the `Custom` app state is for. Enter it with `EnterCustom`, capture your state into
`customStateJson`, and it saves, loads and rolls back with everything else - the variable store, the story
position and the time all stay consistent.

See [Custom mode](scripting/custom-mode.md).

## Is the C# source included?

Yes. Full source, no DLLs. `Core` is pure logic with no Unity UI, in its own assembly; `Runtime` is what
ships in a build; `Editor` holds the authoring tools.

See [Scripting overview](scripting/overview.md).

## How do I migrate from Ren'Py?

There is no automatic Ren'Py importer. You retype the script.

It is less painful than it sounds, because the `.vnbeasty` format is deliberately close to what you already
write: `label`, `jump`, `show`, `hide`, `scene` (here `backdrop`), a speaker followed by a quoted line, menus
as `choice` lines with conditions. Paste a scene in, rename the commands, and the Text tab tells you what it
cannot resolve.

Two differences to plan for:

- **Configuration is not in the script.** Characters, variables, the dictionary, items and localization are
  authored in the visual windows. The script only references them by name.
- **The graph is the source of truth.** The text is a view onto it, not the master copy.

See [the .vnbeasty syntax](authoring/vnbeasty-syntax.md).

## See also

- [Troubleshooting](troubleshooting.md)
- [Your first scene](getting-started/your-first-scene.md)
- [Installation](getting-started/installation.md)
