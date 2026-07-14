# Variable keys

Every key that lives in the variable store, and how to write a condition against it. This is the page to
open when you need a condition on the game time, a quest state, a character's location or the player's
inventory.

## One store for everything

There is a single flat key/value store. Your variables, character variables, the clock, quest progress, the
inventory and the dictionary all live in it, under different key namespaces. That is why any of them can be
used in any condition, why all of them are saved, and why all of them rewind correctly.

| What | Key format | Example key |
|---|---|---|
| Your variables | `key` (no prefix) | `gold` |
| Character variables | `@char:<id>:<field>` | `@char:maya:affection` |
| Character name (reserved) | `@char:<id>:@name` | `@char:maya:@name` |
| Routine (reserved) | `@char:<id>:@routineLocation`, `@char:<id>:@routineSpot`, `@char:<id>:@routineMode` | `@char:maya:@routineLocation` |
| Game time | `@time:daypart`, `@time:hour`, `@time:day`, `@time:weekday`, `@time:season` | `@time:daypart` |
| Quests | `@quest:<id>:@state`, `@quest:<id>:@stage`, `@quest:<id>:@period`, `@quest:<id>:@rewarded`, `@quest:<id>:@penalized`, `@quest:<id>:@lastResult`, `@quest:<id>:<objectiveId>` | `@quest:ana_m1:@state` |
| Inventory | `item.<id>`, `inventory.order` | `item.potion` |
| Dictionary | the token key (no prefix) | `city` |

Reserved fields are spelled with a leading `@`. An author-defined key can never produce one, so your
variables can never collide with the engine's.

> **Note**
> A key that was never written reads as an empty value. A condition against it is false unless you compare
> it to an empty value.

## How you write a condition

In the editor you never type a key. Every condition field has a searchable picker that lists the keys and
inserts the right one. The picker shows a friendly label, but what gets stored is always the exact key from
the table above.

| Namespace | Label in the picker |
|---|---|
| Your variables | The key itself: `gold` |
| Character variables | `<id>.<field>`: `maya.affection` |
| Routine | `<id>.<field>`, keeping the reserved `@`: `maya.@routineLocation` |
| Game time | `time.<field>`: `time.daypart` |
| Quests | `quest.<id>:<field>`: `quest.ana_m1:@state` |
| Inventory | The key itself: `item.potion` |

In the `.vnbeasty` text script there is no picker, so you type the key yourself, exactly as it appears in
the key column: `if @time:daypart == Morning`, not `if time.daypart == Morning`. See
[the .vnbeasty syntax](../authoring/vnbeasty-syntax.md).

### Operators

`Equals`, `NotEquals`, `Greater`, `Less`, `GreaterOrEqual`, `LessOrEqual`, `Contains`. In the text script:
`==`, `!=`, `>`, `<`, `>=`, `<=`, `contains`.

Clauses join with `And` or `Or`.

> **Warning**
> **AND binds tighter than OR.** `a AND b OR c` means `(a AND b) OR c`, never `a AND (b OR c)`. There are no
> brackets. Reorder your clauses, or split the branch in two.

Two rules that catch everyone once:

- An **empty condition is always true**. No condition means "always".
- A clause with **no key selected is incomplete and evaluates to false**. It is reported in the console
  once.

The full picture is in [Variables and conditions](../world/variables-and-conditions.md).

## Your own variables

Declared in the **Variables** tab of the Beasty VN window. The key has no prefix and is exactly what you
typed.

```text
gold >= 10
saw_intro == true
player_class == Mage
```

A bare flag in the text script means `== true`:

```text
choice "Buy a sword" if gold >= 10 { gold -= 10 } -> smith
if saw_intro -> chapter2
```

Values are typed: `String`, `Int`, `Float`, `Bool`. An `Enum` variable offers its allowed values as a
dropdown in the condition editor instead of free text.

## Character variables

Every field on a character - the universal ones from the `CharacterVariableSchema` and the character's own -
is stored under `@char:<id>:<field>`.

| Key | Meaning |
|---|---|
| `@char:<id>:<field>` | One field on one character. |
| `@char:<id>:@name` | Reserved. The character's displayed name, once it has been changed or the player has named them. |
| `@char:@self:<field>` | A placeholder used in a shared condition. It resolves to whichever character the condition is being evaluated for. |

Example conditions:

```text
maya.affection >= 3          picker label
@char:maya:affection >= 3    the actual key
@char:@self:met == true      a shared condition, evaluated per character
```

Use `@self` when one condition template has to apply to the whole cast, for example the visibility rule of
the in-game cast list.

See [Characters](../world/characters.md).

## Routine keys

Three reserved fields per character, written by the routine system on every room enter and whenever the
store changes. You never write `@routineLocation` or `@routineSpot` yourself.

| Key | Value | Picker label |
|---|---|---|
| `@char:<id>:@routineLocation` | The room id the character is in right now, or empty when they are absent. | `<id>.@routineLocation` |
| `@char:<id>:@routineSpot` | The spot id inside that room, or empty. | `<id>.@routineSpot` |
| `@char:<id>:@routineMode` | The name of the active routine profile. | `<id>.@routineMode` |

`@routineLocation` and `@routineMode` are offered as dropdowns: the room list and the profile list of that
character.

Example conditions:

```text
@char:maya:@routineLocation == bakery     Maya is in the bakery
@char:maya:@routineLocation ==            Maya is absent (empty = not on the map)
@char:maya:@routineMode == Working        Maya is on her Working schedule
```

`@routineMode` is the one routine key you DO write. Setting it with a Set variable block (or the Routine
override block) swaps a character's whole schedule from the story.

See [Character routines](../world/character-routines.md).

## Time keys

Five reserved keys. They exist only while a **Time Config** is assigned on the BeastyManager.

| Key | Picker label | Availability | Value |
|---|---|---|---|
| `@time:daypart` | `time.daypart` | Always | The name of the current daypart, e.g. `Morning`. |
| `@time:hour` | `time.hour` | Clock mode only | An integer, e.g. `14`. |
| `@time:day` | `time.day` | Always | An integer, starting at 1. |
| `@time:weekday` | `time.weekday` | When weekdays are configured | The weekday name. |
| `@time:season` | `time.season` | When seasons are configured | The season name. |

`@time:daypart` is offered as a dropdown of your configured daypart names.

Example conditions:

```text
@time:daypart == Morning
@time:hour >= 18
@time:day > 3
@time:weekday == Monday
@time:season == Summer
```

> **Warning**
> With no Time Config assigned, the time system is off: none of these keys is ever written, and every
> condition on them is false. This is the most common cause of "my time conditions do nothing".

Time never advances on its own. You move it with the Advance time block, with a free-roam object's
`advanceTimeOnClick`, or from code. See [Game time](../world/game-time.md).

## Quest keys

Six reserved fields per quest, plus one key per objective. All written by the quest system.

| Key | Value |
|---|---|
| `@quest:<id>:@state` | `notstarted`, `active`, `completed` or `failed`. |
| `@quest:<id>:@stage` | The current objective index in an `Ordered` quest. |
| `@quest:<id>:<objectiveId>` | `true` once that objective is done. |
| `@quest:<id>:@period` | The period index a recurring quest is tracking. |
| `@quest:<id>:@rewarded` | Latch: the reward was paid for the current period. |
| `@quest:<id>:@penalized` | Latch: the penalty was applied for the current failure. |
| `@quest:<id>:@lastResult` | `completed` or `failed`, for the last settled period of a recurring quest. |

`@state` and `@lastResult` are offered as dropdowns of their allowed values. `@stage` only appears for
`Ordered` quests; `@lastResult` only for recurring ones.

Example conditions:

```text
@quest:ana_m1:@state == active           the quest is running
@quest:ana_m1:@state == completed        it is done
@quest:ana_m1:@stage >= 2                the player reached the third objective
@quest:ana_m1:talk_to_ana == true        that one objective is done
@quest:ana_m1:@lastResult == failed      they failed yesterday's daily
```

Compare a quest state against the string, not against a number. The four states are lowercase.

See [Quests](../world/quests.md).

## Inventory keys

| Key | Value |
|---|---|
| `item.<id>` | How many of that item the player holds. A `Key` item reads as a bool, a `Consumable` as an int. |
| `inventory.order` | The player's chosen slot order. Do not condition on it. |

Example conditions:

```text
item.potion >= 1        the player has at least one potion
item.rusty_key == true  a key item they own
item.potion == 0        they ran out
```

Give and Take clamp to the item's `maxQuantity` and to 0, so an item count is never negative and never over
the cap.

See [Items and inventory](../world/items-and-inventory.md).

## Dictionary keys

A dictionary token is stored under its own key, with no prefix, exactly like one of your variables. When a
Set dictionary block or the player writes a value, it goes into the store and shadows the author default -
so it saves and rewinds like everything else.

```text
city == Madrid
```

Because a dictionary token shares the plain namespace with your variables, give tokens distinct names.
`Tools > Beasty VN > Validate > Find duplicate ids` will not catch a token that shadows a variable.

See [The dictionary](../world/dictionary.md).

## See also

- [Variables and conditions](../world/variables-and-conditions.md) - scopes, effects, the condition editor
- [The .vnbeasty syntax](../authoring/vnbeasty-syntax.md) - writing conditions as text
- [Generated accessors](../scripting/generated-accessors.md) - `VNVars` and `VNChars`, typed keys for C#
- [Gameplay APIs](../scripting/gameplay-apis.md) - reading time, routines, quests and the inventory in code
- [Assets](assets.md)
