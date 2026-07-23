---
title: "Assets reference"
description: "Every ScriptableObject you create with Beasty Visual Novel, its exact Create menu path, and its main fields. Use this page as a lookup. The concepts behind th"
---

Every ScriptableObject you create with Beasty Visual Novel, its exact `Create` menu path, and its main
fields. Use this page as a lookup. The concepts behind these assets are explained in
[Core concepts](/docs/beasty-visual-novel/getting-started/core-concepts/).

## How many of each

Most assets are per-story or per-character. A few are singletons for the whole game.

![The asset scaffolding a project ends up with, in the Project window](/docs-images/beasty-visual-novel/vn-assets-project.png)

| Asset | How many |
|---|---|
| `VNSettings` | Exactly one, in a `Resources` folder. Created for you. |
| `VNContext` | Exactly one for the whole game. Every story shares it. |
| `LocalizationTable` | One for the story (on the context) plus one global UI table (on VN Settings). |
| `CharacterVariableSchema` | One, referenced by the context. |
| `QuestCatalog` | One, referenced by the context. |
| `VNMusicConfig` | One, referenced by the context. |
| `VNTimeConfig` | One, dragged onto the BeastyManager. Optional. |
| `FreeRoamMapGraph` | One per scenario. Most games have one. |
| `DialogueScene` | One per story or chapter. Many. |
| `StoryGraph` | One root graph per scene, plus one per subgraph. Many. |
| `CharacterDefinition` | One per character. Many. |

The `VNContext` is the one to be careful with. It is the shared world, resolved at runtime through
`VNSettings.gameContext`. `Tools > Beasty VN > Content > Create Base Assets (intro + FreeRoam map)` never
duplicates it.

## Lookup table

| Asset | Create menu | What it is |
|---|---|---|
| `DialogueScene` | `Create > Beasty VN > Visual Novel (Dialogue Scene)` | The root asset of one story. |
| `VNContext` | `Create > Beasty VN > Story > VN Context` | The shared world: cast, variables, items, quests. |
| `StoryGraph` | `Create > Beasty VN > Story > Story Graph` | A canvas of nodes. |
| `VNSettings` | `Create > Beasty VN > Config > VN Settings` | Project-wide settings. |
| `VNMusicConfig` | `Create > Beasty VN > Config > Music Config` | The music queue for each app mode. |
| `VNTimeConfig` | `Create > Beasty VN > Config > Time Config` | Dayparts, hours, weekdays, seasons. |
| `CharacterDefinition` | `Create > Beasty VN > Characters > Character Definition` | One character. |
| `CharacterVariableSchema` | `Create > Beasty VN > Characters > Character Variable Schema` | The fields every character has. |
| `LocalizationTable` | `Create > Beasty VN > Localization > Localization Table` | Key by language. |
| `FreeRoamMapGraph` | `Create > Beasty VN > FreeRoam > FreeRoam Map Graph` | Rooms plus character routines. |
| `QuestCatalog` | `Create > Beasty VN > Quests > Quest Catalog` | The project's quests. |
| The seven node types | `Create > Beasty VN > Advanced > Nodes > ...` | Normally created by the graph, not by hand. |

You rarely need this menu at all.
`Tools > Beasty VN > Setup > Blank Canvas` creates the DialogueScene, the VNContext, the LocalizationTable,
a root StoryGraph and a first Dialogue node in one step. See [Menu items](/docs/beasty-visual-novel/reference/menu-items/).

## DialogueScene

The root asset of one story. Shown in the editor as the "Visual Novel" field.

| Field | Meaning |
|---|---|
| `context` | The shared `VNContext`. Empty falls back to the global context from VN Settings. |
| `rootGraph` | The `StoryGraph` playback starts from. |
| `musicOverride` | A music queue that replaces the context's Visual Novel queue for this story. |
| `scriptFile` | The `.vnbeasty` TextAsset this scene syncs with. |

See [The story graph](/docs/beasty-visual-novel/authoring/story-graph/) and [The text script](/docs/beasty-visual-novel/authoring/text-script/).

## VNContext

The one shared world. The cast, the variables, the dictionary, the items, the quests, the screens and the
localization all live here, not on the individual stories, so several DialogueScenes can share them.

| Field | Meaning |
|---|---|
| `characters` | The cast: a list of `CharacterDefinition`. |
| `variables` | Your variable definitions (inline, see below). |
| `characterSchema` | The `CharacterVariableSchema` every character inherits. |
| `musicConfig` | The `VNMusicConfig`. |
| `dictionary` | Dictionary entries (inline). |
| `localization` | The story `LocalizationTable`. |
| `languages` | The language codes this game ships. Index 0 is the source language. |
| `screens` | HUD and overlay screen definitions. |
| `items` | Item definitions (inline). |
| `questCatalog` | The `QuestCatalog`. |

## StoryGraph

A canvas of nodes: one graph per scene, plus one per subgraph.

| Field | Meaning |
|---|---|
| `nodes` | The nodes on the canvas. |
| `entryNodeId` | Where playback starts. |
| `exitOutcomes` | The outcome keys this graph can return when used as a subgraph. |

See [Subgraphs](/docs/beasty-visual-novel/authoring/subgraphs/).

## VNSettings

Project-wide settings: the global context, the UI localization table, the default language, autosave, save
slots, rollback depth, and the folders used to resolve asset names in the text script. It lives in a
`Resources` folder and is read at runtime.

Open it with `Tools > Beasty VN > Settings > Global Settings` or `Edit > Project Settings > Beasty VN`.
Every field is documented in [VN Settings](/docs/beasty-visual-novel/production/vn-settings/).

## VNMusicConfig

The music queue for each app mode: `mainMenu`, `visualNovel`, `freeRoam` and `custom`. Each queue has
`clips`, a `mode`, a `volume` and a `crossfadeSeconds`.

See [Audio and music](/docs/beasty-visual-novel/production/audio-and-music/).

## VNTimeConfig

Game time. Drag it into the **Time Config** field of the BeastyManager.

> **Warning**
> Leave that field empty and the time system is off. No time variables are written and every time condition
> evaluates to false.

| Field | Meaning |
|---|---|
| `mode` | `SlotsOnly` (named dayparts, no hour) or `Clock` (an hour counter). |
| `dayparts` | The named bands. Each has a `name` and, in Clock mode, a `startHour`. |
| `hoursPerDay` | Clock mode only. |
| `weekdays` | Optional weekday names. Leave empty to disable. |
| `seasons`, `daysPerSeason` | Optional. |
| `startDay`, `startDaypartIndex`, `startHour` | The opening moment of a new game. |

See [Game time](/docs/beasty-visual-novel/world/game-time/).

## CharacterDefinition

One character: their name, their look on stage and in the UI, their stats, and their talk menu.

| Field | Meaning |
|---|---|
| `id` | The stable id used in conditions, scripts and code. |
| `displayName`, `nameColor`, `textColor` | How the name and the line are drawn. |
| `allowPlayerRename` | Let the player set this character's name. |
| `category` | `Main` or `Secondary`. |
| `tags`, `aliases` | Free tags; alternative display names a line can use. |
| `expressions` | The stage sprites. The default key is `base`. |
| `portraits` | The UI icons. |
| `deliveryStyles` | Font, colour and text effect per delivery state. |
| `variables` | This character's own fields, on top of the schema. |
| `talkMenu` | The conversation hub entries. |
| `freeRoamSprite` | The sprite used in a room. |
| `listed`, `listVisibleWhen` | Whether the character appears in the in-game cast list. |
| `showCurrentLocation`, `showRoutine` | What the profile screen reveals. |

See [Characters](/docs/beasty-visual-novel/world/characters/) and [The talk menu](/docs/beasty-visual-novel/world/talk-menu/).

## CharacterVariableSchema

The fields EVERY character has. One `fields` list of `CharacterVariableField` (see below). A character can
override the default value and the visibility of a schema field without changing the schema.

See [Characters](/docs/beasty-visual-novel/world/characters/).

## LocalizationTable

A grid of keys by language.

| Field | Meaning |
|---|---|
| `languages` | Language codes. Index 0 is the source language. |
| `entries` | One row per key, with a cell per language and its translation status. |

There are two tables: the story table on the VNContext, and the global UI table on VN Settings. See
[Localization](/docs/beasty-visual-novel/production/localization/).

## FreeRoamMapGraph

The rooms the player walks through, and the routines that decide who is standing in them.

| Field | Meaning |
|---|---|
| `entryRoomId` | The room a new game starts in. |
| `rooms` | The room nodes: background, conditional backgrounds, room prefab, buttons. |
| `routines` | One `CharacterRoutine` per character. |

Assign the graph to the `FreeRoamScenario` component on the Stage. See
[Free roam rooms](/docs/beasty-visual-novel/world/free-roam-rooms/) and [Character routines](/docs/beasty-visual-novel/world/character-routines/).

## QuestCatalog

The project's quests, in one `quests` list. Each quest has an id, a title, an owner, a category, an order
mode, a recurrence, start and fail conditions, reward and penalty effects, and its objectives.

See [Quests](/docs/beasty-visual-novel/world/quests/).

## The seven node types

Every node type has a `Create` entry under `Create > Beasty VN > Advanced > Nodes >`:

`Dialogue Node`, `Choice Node`, `Decision Node`, `Flow Node`, `SubGraph Node`, `Return Node`,
`Talk Menu Node`.

You normally never use them. Right-clicking the graph canvas creates the node, names it, adds it to the
graph and files it as a sub-asset for you. The `Advanced` entries exist for the rare case where you need a
node asset outside a graph. See [The story graph](/docs/beasty-visual-novel/authoring/story-graph/).

## Inline data: what is NOT an asset

Four kinds of data live inside the `VNContext` instead of being separate assets. You edit them in the Beasty
VN window, not in the Project window, and you never create a file for them.

### Variable definitions

Edited in the **Variables** tab. One `VariableDefinition` per variable.

| Field | Meaning |
|---|---|
| `key` | The store key. No prefix. |
| `kind` | `PlayerInput`, `Fixed`, `Enum` or `Computed`. |
| `valueType` | `String`, `Int`, `Float` or `Bool`. |
| `defaultValue` | The value at the start of a new game. |
| `promptAtRuntime` | Ask the player for it when the game starts. |
| `allowedValues` | The domain of an `Enum` variable. |

See [Variables and conditions](/docs/beasty-visual-novel/world/variables-and-conditions/) and
[Variable keys](/docs/beasty-visual-novel/reference/variable-keys/).

### Dictionary entries

Edited in the **Dictionary** tab. One `DictionaryEntry` per token: `key`, `defaultValue`, `playerEditable`.

See [The dictionary](/docs/beasty-visual-novel/world/dictionary/).

### Item definitions

Edited in the **Items** tab.

| Field | Meaning |
|---|---|
| `id` | The item id. Also the inventory key `item.<id>`. |
| `icon` | The inventory sprite. |
| `kind` | `Key` or `Consumable`. |
| `maxQuantity` | The cap. Give and Take clamp to it and to 0. |
| `nameKey`, `descriptionKey` | Localization keys. |
| `onUse` | `useCondition`, `cannotUseMessageKey`, `effects`, `jumpToScene`, `jumpToNodeId`, `consumeAmount`. |

See [Items and inventory](/docs/beasty-visual-novel/world/items-and-inventory/).

### Character variable fields

A `CharacterVariableField` appears either in the `CharacterVariableSchema` (every character gets it) or in
one `CharacterDefinition` (only that character has it).

| Field | Meaning |
|---|---|
| `key` | The field name. The store key is `@char:<id>:<key>`. |
| `type` | `String`, `Int`, `Float` or `Bool`. |
| `defaultValue` | The starting value. |
| `showOnStats` | Show it on the character's stats screen. |
| `editable` | Let the player change it there. |
| `clamp`, `min`, `max`, `step` | Optional bounds. |

## See also

- [Menu items](/docs/beasty-visual-novel/reference/menu-items/)
- [Variable keys](/docs/beasty-visual-novel/reference/variable-keys/)
- [Prefabs](/docs/beasty-visual-novel/reference/prefabs/)
- [Core concepts](/docs/beasty-visual-novel/getting-started/core-concepts/)
- [Validation and ids](/docs/beasty-visual-novel/production/validation-and-ids/)
