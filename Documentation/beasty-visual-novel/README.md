# Beasty Visual Novel

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
> One limit worth knowing before you start: a backdrop built from more than one sprite layer has no text
> form. Those scenes stay graph-only. See [The text script](authoring/text-script.md).

## More than a dialogue player

- **Free-roam rooms.** Leave the novel for an explorable room with doors, interactables and clickable
  characters, then come back. See [Free roam rooms](world/free-roam-rooms.md).
- **Game time.** Dayparts, an optional clock, weekdays and seasons. Time never advances on its own — you
  advance it. See [Game time](world/game-time.md).
- **Character routines.** Where each character is, per day and per daypart, edited on a week x daypart
  grid. See [Character routines](world/character-routines.md).
- **Quests and the talk menu.** Quests with stages, objectives, rewards and recurrence; a per-character
  conversation hub that always lists exactly what you can say to that character right now. See
  [Quests](world/quests.md) and [The talk menu](world/talk-menu.md).
- **Characters with stats and screens.** Expressions, portraits, delivery styles, aliases, per-character
  stats, and in-game screens for the cast list, the profile, the calendar and the quest log. See
  [Characters](world/characters.md) and [Character screens](world/character-screens.md).
- **Variables and conditions everywhere.** Any block, any choice, any door, any routine rule can be
  gated by a condition over the same variables. See
  [Variables and conditions](world/variables-and-conditions.md).
- **Localization.** Translation tables for the story and for the UI, CSV/TSV import and export, staleness
  tracking, and live language switching. See [Localization](production/localization.md).
- **Saving and loading.** Slots with thumbnails, autosave, and a save that holds the whole world: your
  variables, the time, the quests, the inventory, the stage and the rewind history. See
  [Saving and loading](production/saving-and-loading.md).

Everything the player sees is a uGUI prefab you can restyle. Full C# source is included.

## Where to start

Everyone reads [Installation](getting-started/installation.md) and then
[Your first scene](getting-started/your-first-scene.md) — from nothing to a playable scene with two
spoken lines and a choice, writing zero code. After that, pick your path.

### You just want to write a story

1. [Core concepts](getting-started/core-concepts.md) — scene, context, graph, node, block. Ten minutes,
   and every other page makes sense.
2. [Editor tour](getting-started/editor-tour.md) — what each tab of the Beasty VN window is for.
3. [The story graph](authoring/story-graph.md) and [Blocks reference](authoring/blocks-reference.md) —
   the whole authoring vocabulary.
4. [Dialogue and the stage](authoring/dialogue-and-stage.md) and
   [Choices and decisions](authoring/choices-and-decisions.md).
5. [The text script](authoring/text-script.md) when you want to write faster than you can click.
6. [Localization](production/localization.md) and
   [Saving and loading](production/saving-and-loading.md) when it is time to ship.

### You are building a life-sim with rooms and routines

1. [Core concepts](getting-started/core-concepts.md), and pay attention to the variable store — it is why
   the rest of this list works.
2. [Free roam rooms](world/free-roam-rooms.md) and
   [Interactables and doors](world/interactables-and-doors.md).
3. [Game time](world/game-time.md), then [Character routines](world/character-routines.md).
4. [Quests](world/quests.md) and [The talk menu](world/talk-menu.md).
5. [Screens and HUD](world/screens-and-hud.md) and
   [Character screens](world/character-screens.md).
6. [Items and inventory](world/items-and-inventory.md).

### You are a programmer

1. [Scripting overview](scripting/overview.md) — the assemblies and where to hook in. `Core` is pure
   logic with no Unity UI, in its own assembly from the view layer.
2. [The VN API](scripting/vn-api.md) — the static `VN` entry point, its state, events and control.
3. [Controllers](scripting/controllers.md) — `BeastyManager`, `VNGameController`,
   `VisualNovelController`.
4. [Gameplay APIs](scripting/gameplay-apis.md) — `BeastyTime`, `BeastyRoutines`, `BeastyQuests`,
   `Inventory`.
5. [Custom mode](scripting/custom-mode.md) — drop your own minigame or battle system into the game as a
   first-class app state that saves, loads and rolls back with everything else.
6. [Generated accessors](scripting/generated-accessors.md) — `VNVars` and `VNChars` give you
   compile-time-checked variable and character keys.

## Saves are built in

**Beasty Save System ships inside this package.** Do not import it separately. There are no external
dependencies and no third-party packages to install: saving, slots, thumbnails, autosave, backups and
optional encryption all work out of the box. If you want to save your own objects alongside the story,
its documentation is in [Beasty Save System](../beasty-save-system/README.md).

## See also

- [Installation](getting-started/installation.md)
- [Your first scene](getting-started/your-first-scene.md)
- [Core concepts](getting-started/core-concepts.md)
- [Editor tour](getting-started/editor-tour.md)
- [Menu items](reference/menu-items.md) and [Assets](reference/assets.md)
- [Troubleshooting](troubleshooting.md) and [FAQ](faq.md)
