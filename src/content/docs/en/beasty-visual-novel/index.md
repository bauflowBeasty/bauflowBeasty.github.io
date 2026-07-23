---
title: "Beasty Visual Novel"
description: "You write the story. Beasty Visual Novel plays it. It is a complete visual novel engine for Unity: an authoring window where you build the story, and a runtim"
---

You write the story. Beasty Visual Novel plays it. It is a complete visual novel engine for Unity: an
authoring window where you build the story, and a runtime that shows it to the player, with no code
required at any point.

## Two views of the same scene

A scene has two faces, and they are the same scene:

- **The graph.** A canvas of nodes. Each node is one beat of the story, and inside it a stack of blocks
  runs top to bottom: set a backdrop, show a character, speak a line, change a variable.
- **The text script.** The same scene written as a `.vnbeasty` file, in a compact Ren'Py-like syntax.
  `juan (whisper) "psst..."` is a line. `label cruce (choice):` is a choice node.

The Story tab has a **Graph / Text** toggle. Write in whichever one suits the moment: block out the
structure in the graph, then bang out a hundred lines of dialogue as text.

The package makes one promise about this, and it is the promise that matters when you have a week of
work in a scene: **the graph is the source of truth.** A script that fails to parse, is empty, or would
destroy content never overwrites your nodes — the import is refused and the graph is left exactly as it
was. Any import that would lose content leaves a timestamped `.bak` next to the script first. Art is
referenced by GUID, so renaming or moving a sprite does not break a synced node.

> **Note**
> The two views are at parity: anything the graph can express, the script can write — layered backdrops,
> props and talk-menu nodes included. See [The text script](/docs/beasty-visual-novel/authoring/text-script/).

## More than a dialogue player

- **Free-roam rooms.** Leave the novel for an explorable room with doors, interactables and clickable
  characters, then come back. See [Free roam rooms](/docs/beasty-visual-novel/world/free-roam-rooms/).
- **Game time.** Dayparts, an optional clock, weekdays and seasons. Time never advances on its own — you
  advance it. See [Game time](/docs/beasty-visual-novel/world/game-time/).
- **Character routines.** Where each character is, per day and per daypart, edited on a week x daypart
  grid. See [Character routines](/docs/beasty-visual-novel/world/character-routines/).
- **Quests and the talk menu.** Quests with stages, objectives, rewards and recurrence; a per-character
  conversation hub that always lists exactly what you can say to that character right now. See
  [Quests](/docs/beasty-visual-novel/world/quests/) and [The talk menu](/docs/beasty-visual-novel/world/talk-menu/).
- **Characters with stats and screens.** Expressions, portraits, delivery styles, aliases, per-character
  stats, and in-game screens for the cast list, the profile, the calendar and the quest log. See
  [Characters](/docs/beasty-visual-novel/world/characters/) and [Character screens](/docs/beasty-visual-novel/world/character-screens/).
- **Variables and conditions everywhere.** Any block, any choice, any door, any routine rule can be
  gated by a condition over the same variables. See
  [Variables and conditions](/docs/beasty-visual-novel/world/variables-and-conditions/).
- **Localization.** Translation tables for the story and for the UI, CSV/TSV import and export, staleness
  tracking, and live language switching. See [Localization](/docs/beasty-visual-novel/production/localization/).
- **Saving and loading.** Slots with thumbnails, autosave, and a save that holds the whole world: your
  variables, the time, the quests, the inventory, the stage and the rewind history. See
  [Saving and loading](/docs/beasty-visual-novel/production/saving-and-loading/).

Everything the player sees is a uGUI prefab you can restyle. Full C# source is included.

## Where to start

Everyone reads [Installation](/docs/beasty-visual-novel/getting-started/installation/) and then
[Your first scene](/docs/beasty-visual-novel/getting-started/your-first-scene/) — from nothing to a playable scene with two
spoken lines and a choice, writing zero code. After that, pick your path.

### You just want to write a story

1. [Core concepts](/docs/beasty-visual-novel/getting-started/core-concepts/) — scene, context, graph, node, block. Ten minutes,
   and every other page makes sense.
2. [Editor tour](/docs/beasty-visual-novel/getting-started/editor-tour/) — what each tab of the Beasty VN window is for.
3. [The story graph](/docs/beasty-visual-novel/authoring/story-graph/) and [Blocks reference](/docs/beasty-visual-novel/authoring/blocks-reference/) —
   the whole authoring vocabulary.
4. [Dialogue and the stage](/docs/beasty-visual-novel/authoring/dialogue-and-stage/) and
   [Choices and decisions](/docs/beasty-visual-novel/authoring/choices-and-decisions/).
5. [The text script](/docs/beasty-visual-novel/authoring/text-script/) when you want to write faster than you can click.
6. [Localization](/docs/beasty-visual-novel/production/localization/) and
   [Saving and loading](/docs/beasty-visual-novel/production/saving-and-loading/) when it is time to ship.

### You are building a life-sim with rooms and routines

1. [Core concepts](/docs/beasty-visual-novel/getting-started/core-concepts/), and pay attention to the variable store — it is why
   the rest of this list works.
2. [Free roam rooms](/docs/beasty-visual-novel/world/free-roam-rooms/) and
   [Interactables and doors](/docs/beasty-visual-novel/world/interactables-and-doors/).
3. [Game time](/docs/beasty-visual-novel/world/game-time/), then [Character routines](/docs/beasty-visual-novel/world/character-routines/).
4. [Quests](/docs/beasty-visual-novel/world/quests/) and [The talk menu](/docs/beasty-visual-novel/world/talk-menu/).
5. [Screens and HUD](/docs/beasty-visual-novel/world/screens-and-hud/) and
   [Character screens](/docs/beasty-visual-novel/world/character-screens/).
6. [Items and inventory](/docs/beasty-visual-novel/world/items-and-inventory/).

### You are a programmer

1. [Scripting overview](/docs/beasty-visual-novel/scripting/overview/) — the assemblies and where to hook in. `Core` is pure
   logic with no Unity UI, in its own assembly from the view layer.
2. [The VN API](/docs/beasty-visual-novel/scripting/vn-api/) — the static `VN` entry point, its state, events and control.
3. [Controllers](/docs/beasty-visual-novel/scripting/controllers/) — `BeastyManager`, `VNGameController`,
   `VisualNovelController`.
4. [Gameplay APIs](/docs/beasty-visual-novel/scripting/gameplay-apis/) — `BeastyTime`, `BeastyRoutines`, `BeastyQuests`,
   `Inventory`.
5. [Custom mode](/docs/beasty-visual-novel/scripting/custom-mode/) — drop your own minigame or battle system into the game as a
   first-class app state that saves, loads and rolls back with everything else.
6. [Generated accessors](/docs/beasty-visual-novel/scripting/generated-accessors/) — `VNVars` and `VNChars` give you
   compile-time-checked variable and character keys.

## Saves are built in

**Beasty Save System ships inside this package.** Do not import it separately. There are no external
dependencies and no third-party packages to install: saving, slots, thumbnails, autosave, backups and
optional encryption all work out of the box. If you want to save your own objects alongside the story,
its documentation is in [Beasty Save System](/docs/beasty-save-system/).

## See also

- [Installation](/docs/beasty-visual-novel/getting-started/installation/)
- [Your first scene](/docs/beasty-visual-novel/getting-started/your-first-scene/)
- [Core concepts](/docs/beasty-visual-novel/getting-started/core-concepts/)
- [Editor tour](/docs/beasty-visual-novel/getting-started/editor-tour/)
- [Menu items](/docs/beasty-visual-novel/reference/menu-items/) and [Assets](/docs/beasty-visual-novel/reference/assets/)
- [Troubleshooting](/docs/beasty-visual-novel/troubleshooting/) and [FAQ](/docs/beasty-visual-novel/faq/)
