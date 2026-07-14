# .vnbeasty syntax reference

Every construct of the `.vnbeasty` text script, for lookup. One file is one scene: every `label` is a node,
`jump` wires the nodes together. If you have not used the format before, read
[The text script](text-script.md) first — it covers the editor, the sync rules and the safety contract.

## Contents

- [File structure](#file-structure)
- [Dialogue and narration](#dialogue-and-narration)
- [Backdrops](#backdrops)
- [Characters](#characters)
- [Audio](#audio)
- [State and inventory](#state-and-inventory)
- [Quests, screens and routines](#quests-screens-and-routines)
- [Game time](#game-time)
- [Prompts](#prompts)
- [Character names](#character-names)
- [Flow and transitions](#flow-and-transitions)
- [Choices and decisions](#choices-and-decisions)
- [Subgraphs and return](#subgraphs-and-return)
- [Conditions and effects](#conditions-and-effects)
- [Notes](#notes)

---

## File structure

A file is an optional header followed by `label` sections. A label starts at column 0 and ends with `:`;
its statements are indented under it.

```text
scene "Chapter 1"        # readable scene name (optional)
start intro              # entry label / entryNodeId (optional; default = the first label)

label intro:             # a node (DialogueNode by default)
    backdrop bedroom
    juan "Hello, how are you?"
    jump cruce           # wire to another label
```

`jump <label>` sets the node's default next node. A dialogue node with no `jump` simply ends.

### Type annotations

The node type is inferred from the body, or annotated explicitly on the label line. The annotation is
always round-tripped.

| Annotation | Node type | What it is |
|---|---|---|
| *(none)* | `DialogueNode` | Runs its blocks in order, then goes to its `jump` target. |
| `(dialogue)` | `DialogueNode` | The explicit form of the default. |
| `(choice)` | `ChoiceNode` | Holds `choice` lines. See [Choices and decisions](#choices-and-decisions). |
| `(decision)` | `DecisionNode` | Holds `if` / `else` branches. Invisible to the player. |
| `(subgraph)` | `SubGraphNode` | Holds `outcome` routes. See [Subgraphs and return](#subgraphs-and-return). |
| `(return "win")` | `ReturnNode` | Ends a subgraph, returning the quoted outcome key. |

A label whose **only** line is a `->` flow exit is a `FlowNode`, with no annotation needed. See
[Flow and transitions](#flow-and-transitions).

```text
label cruce (choice):
label ruta (decision):
label combat (subgraph):
label combat/done (return "win"):
```

A trailing `(...)` on a label line counts as a type annotation only when it names a known type. `label
Meeting (part 2):` is a node called `Meeting (part 2)`. Quote the label name when it contains `#`, `"`, or
ends with `)`.

### The id annotation

```text
label intro:  #@id:8f2c1a7b-…
```

The `#@id:<guid>` comment is written automatically on every round-trip. It carries the node's identity, so
renaming a `label` renames the node instead of destroying it and creating a new one — which would lose the
node's position on the canvas and the wires pointing at it. Omit it when you write a new label by hand; the
next sync adds it.

## Dialogue and narration

```text
juan "Hello"                  # speaker = the character id 'juan'
"The room went quiet."        # no speaker = narrator
juan (whisper) "psst..."      # delivery state
juan as "The Stranger" "..."  # one-line display-name alias
```

The full form is `<speaker> [(state)] [as "alias"] "text"`. The delivery state names one of the character's
delivery styles — `whisper`, `shout`, `thinking`, or one of your own — and changes the font, colour and
text effect of that line only. `as "..."` shows the line under an alias without changing the character's
name; to change the name for good, use [`name`](#character-names).

Dialogue is the only statement with free text. That text is stored in the localization table, in the
authoring language selected in the Story tab.

## Backdrops

```text
backdrop bedroom              # a sprite, resolved by name
backdrop interiors/bedroom    # disambiguate by subfolder
backdrop clear                # remove the backdrop
backdrop video rain           # a video clip instead of a sprite
backdrop video rain once mute volume 0.5 manual
```

A video backdrop loops, plays its audio at full volume, and starts on arrival. Each modifier turns one of
those off:

| Modifier | Effect |
|---|---|
| `once` | Play once instead of looping. |
| `mute` | Silence the clip's audio. |
| `volume <0..1>` | Play the clip's audio at this volume. |
| `manual` | Do not auto-play on arrival. |

`clear` and `video` are keywords only when unquoted, so a sprite genuinely named `video` still works if you
quote it.

> **Note**
> A backdrop with more than one sprite layer has no text form. Those scenes stay graph-only.

## Characters

```text
show juan happy at left                  # expression + anchor
show maria base at right scale 1.2 flip
expression juan sad
hide juan
clear characters
```

`show <character> <expression> [at <anchor>] [scale <n>] [flip]`. The expression key is the one defined on
the character; the default key is `base`.

| Anchor | Position |
|---|---|
| `left` | Far left. |
| `centerleft` | Between left and centre. |
| `center` | Centre. This is the default, and is omitted when written back from the graph. |
| `centerright` | Between centre and right. |
| `right` | Far right. |
| `custom <x>` | A normalized X position, 0 to 1: `show juan happy at custom 0.35`. |

`scale` is a multiplier (1 is unscaled, and is omitted when written back). `flip` mirrors the sprite
horizontally.

`expression <character> <expression>` changes the expression of a character already on stage.
`hide <character>` removes one. `clear characters` removes all of them.

## Audio

```text
music calm fade 2                        # loops by default
sound door
ambient forest
voice juan_l1
stop music fade 1
```

The form is `<channel> <clip> [fade <s>] [vol <0..1>] [once] [keepbg]`.

| Channel | What it plays |
|---|---|
| `music` | The music channel. Loops. Pauses the background music while it plays. |
| `ambient` | The ambient channel. Loops. |
| `sound` | A one-shot on the SFX channel. |
| `voice` | A voice clip on the voice channel. |

| Modifier | Effect | Applies to |
|---|---|---|
| `fade <s>` | Fade in over this many seconds. Default 1. | `music`, `ambient` |
| `vol <0..1>` | Volume. Default 1. | all four |
| `once` | Play once instead of looping. | `music`, `ambient` |
| `keepbg` | Do not pause the background music. | `music` |

Note that a video backdrop spells its volume `volume`, while an audio cue spells it `vol`.

`stop <channel> [fade <s>]` stops a channel. The channels are `music`, `ambient`, `sfx` and `voice`.

```text
stop ambient
stop voice fade 0.5
```

## State and inventory

```text
set gold = 10            # assign (also  +=  -=)
set gold += 5
toggle flag_x
dict city = "Madrid"     # a dictionary token
set juan.affection += 1  # a character variable
give 3 potion            # inventory
take 1 potion
use key
item potion = 5          # set an absolute amount
wait 2                   # wait 2 seconds
wait                     # wait for the player to click
```

`set <key> = <value>` assigns; `+=` adds; `-=` subtracts. `toggle <key>` flips a bool.

A key containing a dot is a **character variable**: `set juan.affection += 1` sets the `affection` field on
the character `juan`.

`dict <key> = "<value>"` sets a dictionary token — a player-editable piece of text.

`give <amount> <item>` and `take <amount> <item>` clamp to the item's maximum and to 0. `item <id> =
<amount>` sets the amount outright. `use <item>` runs the item's on-use effects.

`wait <seconds>` pauses. `wait` with no number waits for the player to click.

The names come from the Variables, Dictionary and Items tabs. The script references them; it does not
create them.

## Quests, screens and routines

```text
quest ana_m1 state = active        # notstarted / active / completed / failed
quest ana_m1 stage = 2             # ordered quests: set the stage index
quest ana_m1 stage += 1            # ...or advance it
quest ana_m1 objective run = true  # mark an objective done (false clears it)
deliver ana_m1 entrega             # hand over a gather-and-deliver objective's items
screen inventory                   # open a secondary screen (by its id)
routine ana Work                   # switch a character's routine profile ("" = default)
```

| Form | What it does |
|---|---|
| `quest <id> state = <state>` | Sets the quest state. The four states are `notstarted`, `active`, `completed`, `failed`. |
| `quest <id> stage = <n>` | Sets the stage index of an ordered quest. |
| `quest <id> stage += <n>` | Advances the stage index. |
| `quest <id> objective <objId> = true` | Marks an objective done. `= false` clears it. |
| `deliver <quest> <objective>` | Hands over the items of a gather-and-deliver objective. Does nothing if the player does not have them. |
| `screen <id>` | Opens a secondary screen. |
| `routine <character> <profile>` | Switches the character's active routine profile. Use `""` for the default profile. |

## Game time

```text
time +2 dayparts                   # advance the clock (also: +3 hours, +1 day)
time daypart evening               # ...or set it outright (quote names with spaces)
time hour 14                       # Clock mode only
time weekday monday
```

The advance forms lead with a signed amount, the set forms with the unit:

| Form | What it does |
|---|---|
| `time +<n> dayparts` | Advance by n dayparts. |
| `time +<n> hours` | Advance by n hours. Clock mode only. |
| `time +<n> days` | Advance by n days. |
| `time daypart <name>` | Set the daypart. |
| `time hour <n>` | Set the hour. Clock mode only. |
| `time weekday <name>` | Set the weekday. Always forward; the same day counts. |

The unit may be singular (`+1 day` is the same as `+1 days`); the canonical form written back from the
graph is always the plural. The daypart and weekday names are the ones configured in the project's
[time config](../world/game-time.md).

## Prompts

A prompt shows a line plus a text field, and writes the player's answer somewhere.

```text
ask gold "How much gold?" default 0 required
ask dict city "Your city?"
ask name hero "What's your name?" default "Traveler"
```

| Form | Where the answer goes |
|---|---|
| `ask <variable> "<question>"` | Into a variable. |
| `ask dict <token> "<question>"` | Into a dictionary token. |
| `ask name <character> "<question>"` | Into the character's displayed name. |

Options, in order after the question: `by <character> [(state)] [as "alias"]` makes a character ask it
instead of the narrator, with an optional delivery state and alias; `default <value>` pre-fills the field;
`required` refuses an empty answer.

```text
ask gold "How much do you have?" by juan (whisper) as "The Stranger" default 0 required
```

## Character names

```text
name juan = "Don Juan"            # set the displayed name (literal text)
name juan = alias "The Stranger"  # ...from one of the character's aliases
name juan = var player_name       # ...from the value of a variable or token
name juan reset                   # back to the base name
```

This changes the name for good, unlike the one-line `as "..."` on a
[dialogue line](#dialogue-and-narration).

## Flow and transitions

```text
freeroam town/square              # go to a FreeRoam room
freeroam previous                 # return to the room the player came from
freeroam choose town              # let the player choose a room on that map
goto-scene Chapter2               # go to another DialogueScene
goto-scene Chapter2 from intro    # ...starting at a given node
```

`freeroam <map>/<room>` names the map graph and the room in it.

A bare flow line like the ones above is a **trailing exit block** inside a dialogue node: it runs after the
node's other blocks. To make the transition its **own node** in the graph — a `FlowNode` — write a label
whose only line is the exit, prefixed with the route arrow:

```text
label to_town:
    -> freeroam town/square      # this label compiles to a FlowNode

label leave:
    -> freeroam previous         # any flow exit works: previous / choose <map> / goto-scene …
```

Other labels reach it with `jump to_town`, or with `-> to_town` as a choice or branch target. The arrow
line must be the label's only content. A `->` route to another label is written `jump <label>` instead.

## Choices and decisions

Choices and decisions live in their **own** `label` and are reached with `jump`. One line per option. The
target after `->` can be another label or a flow exit (`freeroam …` / `goto-scene …`).

```text
label cruce (choice):
    choice "Go left" -> cave
    choice "Buy a sword" if gold >= 10 { gold -= 10 } -> smith   # condition + effects
    choice "Flee" -> freeroam town/square                        # flow target
    default -> alley                                             # used if everything is gated out
```

A **choice node** shows the options whose condition passes. `default -> <label>` is where it goes when
every option is gated out.

```text
label ruta (decision):           # invisible router (DecisionNode)
    if gold > 100 { rich = true } -> rich_end
    if saw_intro -> chapter2
    else -> poor_end             # the fallback branch (empty condition)
```

A **decision node** routes automatically and invisibly: the first branch whose condition passes wins,
otherwise the fallback. The player sees nothing. `else if <condition> -> <label>` is a conditional branch,
not the fallback; a bare `else` is the fallback.

Both `choice` and `if` take an optional condition and an optional effect block, in that order, before the
arrow. See [Conditions and effects](#conditions-and-effects).

> **Note**
> There is no `menu:` block. Write one `choice "text" -> label` line per option inside a `(choice)` node.

## Subgraphs and return

A `(subgraph)` node nests a `StoryGraph` made of child labels named `parent/child`. Its body routes the
nested outcomes back to the outer graph.

```text
label combat (subgraph):
    outcome win -> after_win
    default -> after_combat

label combat/fight:              # a child node (the prefix is the parent label)
    "..."
    jump combat/done

label combat/done (return "win"):  # a ReturnNode; effects via set / toggle
    toggle won_fight
```

`outcome <key> -> <label>` routes one outcome key; `default -> <label>` catches the rest. A `(return
"<key>")` node ends the nested graph and hands that key back. Its `set` and `toggle` lines are the return
node's effects.

Subgraphs nest one level: a child label cannot itself be a subgraph.

## Conditions and effects

**A condition** is a list of `token op value` clauses joined by `and` or `or`. A bare token (`if flag`) is
shorthand for `flag == true`. `and` binds tighter than `or`, so `a and b or c` reads as `(a and b) or c`.
An empty condition is always true.

| Operator | Meaning |
|---|---|
| `==` | Equals. |
| `!=` | Not equals. |
| `>` | Greater than. |
| `<` | Less than. |
| `>=` | Greater than or equal. |
| `<=` | Less than or equal. |
| `contains` | The value contains the given text. |

```text
if gold >= 10 -> smith
if gold >= 10 and has_map -> smith
if time.daypart == Morning or maya.location == Bakery -> visit
if saw_intro -> chapter2
```

The tokens are variable keys, character variables (`maya.location`), and the reserved time and quest keys.
See [Variables and conditions](../world/variables-and-conditions.md) for the full list.

**An effect block** is a `{ … }` list of mutations, separated by commas, written after the condition and
before the arrow. Each entry is `key = value`, `key += n`, `key -= n`, or `toggle key`.

```text
choice "Buy a sword" if gold >= 10 { gold -= 10, has_sword = true } -> smith
if gold > 100 { rich = true, toggle celebrated } -> rich_end
```

## Notes

- **Comments** start with `#`. A `#` inside a quoted string is text, not a comment. Blank lines are
  ignored.
- **Indentation** under a `label` is 4 spaces. The Text tab's `Tab` key inserts 4 spaces.
- **Strings** are double-quoted, with `\"`, `\\`, `\n`, `\r` and `\t` escapes.
- **Numbers** use `.` as the decimal separator, whatever your system locale is.
- **Asset names** resolve to objects by GUID, so moving or renaming an asset does not break a synced node.
  Run **Format** to refresh the name written in the text. A name that does not resolve — a typo, or a name
  several assets share — is an error: the import is refused and the graph is left untouched, so a typo can
  never destroy a reference. Disambiguate with a subfolder: `backdrop interiors/bedroom`.
- **The folders listed in [VN Settings](../production/vn-settings.md)** keep names short and unambiguous.
  They are not a gate: an asset that lives outside them still resolves by name, project-wide, as a last
  resort.
- **A block with no asset assigned** — a backdrop with no art, a music, sound or voice cue with no clip —
  does nothing in game: it is skipped, leaving whatever is already on screen or playing. It is not written
  to the script either, so saving the script removes that placeholder from the graph as well. To blank the
  backdrop or silence a channel on purpose, use `backdrop clear` or `stop <channel>`.
- **Autocompletion.** The Text tab suggests, at the start of a line: `backdrop`, `show`, `expression`,
  `hide`, `clear characters`, `jump`, `set`, `toggle`, `dict`, `give`, `take`, `use`, `item`, `deliver`,
  `wait`, `music`, `sound`, `ambient`, `voice`, `stop`, `name`, `ask`, `quest`, `screen`, `routine`,
  `time`, `choice`, `if`, `else`, `default`, `freeroam`, `goto-scene` — plus your character ids, since a
  line can start with a speaker. After the keyword it suggests what that keyword expects: characters,
  expressions, variables, dictionary tokens, items, quests and their objectives, screens, routine profiles,
  daypart and weekday names, asset names, and the labels already in the file.

## See also

- [The text script](text-script.md) — the editor, the sync rules, the safety contract and the limits.
- [Blocks reference](blocks-reference.md) — the same vocabulary, as blocks in the graph.
- [The story graph](story-graph.md) — the node types a script compiles into.
- [Characters](../world/characters.md) — ids, expressions, delivery styles and aliases.
- [Quests](../world/quests.md) — quest ids, stages and objectives.
- [Game time](../world/game-time.md) — dayparts, the clock, and the two time modes.
- [Free-roam rooms](../world/free-roam-rooms.md) — the maps and rooms `freeroam` targets.
