---
title: "Troubleshooting"
description: "Symptom, cause, fix for the most common problems: black screen, silent blocks, refused imports, missing characters, stale translations."
---

Symptom, cause, fix. Find your symptom, apply the fix, get back to work.

## The game boots to a black screen. The engine is running. There are zero errors in the console.

**Cause.** The scene's wiring broke. Reordering the hierarchy, editing a menu prefab, or moving an object can
drop a reference that was cabled in the scene. Nothing throws, because nothing is missing at compile time -
the views the controllers were pointing at are simply gone.

**Fix.** Select the **BeastyManager** in the scene and press **Auto-wire / Repair** in its inspector.

That is almost always it. Auto-wire guarantees every manager exists and re-resolves the scene's views by
type. It only fills empty references - it never overwrites wiring you did yourself, so it is safe to press at
any time. Make it your first move whenever a scene misbehaves and the console is clean.

If the scene is missing whole objects (no Canvas, no Stage), re-run `Tools > Beasty VN > Setup > Create Scene`.
It reuses the camera, the EventSystem and the canvas that are already there, so it is safe to run on an
existing scene. See [Menu items](/docs/beasty-visual-novel/reference/menu-items/).

## My time conditions are all false

**Cause.** No **Time Config** is assigned on the BeastyManager, so the time system is off. It writes no time
variables at all, and every condition on `@time:...` compares against an empty value.

**Fix.** Create a Time Config (`Create > Beasty VN > Config > Time Config`) and drag it into the **Time
Config** field of the BeastyManager. The inspector also offers a **Create & assign Time Config** button when
the field is empty.

Then remember that time never advances on its own. You move it with an **Advance time** block, with a
free-roam object's `advanceTimeOnClick`, or from code.

See [Game time](/docs/beasty-visual-novel/world/game-time/) and [Variable keys](/docs/beasty-visual-novel/reference/variable-keys/).

## My character never appears in a room

Two causes, in this order.

**Cause 1: the rule that matched has an empty room.** A routine rule with no room means the character is
**absent** - not in that room, not anywhere on the map. If the first rule whose condition passes has an empty
room, that is your answer. Remember the fallback rule counts too.

**Fix.** Open the **FreeRoam** tab, switch to **Routines**, and filter by that character. The grid shows what
resolves at each day and daypart. Fill in the room on the rule that is winning, or reorder the rules so a
different one wins.

**Cause 2: another character took the spot first.** If two characters resolve to the same spot, only the
first is placed. The others are skipped, with a notice in the console.

**Fix.** Give them different spots in the room prefab, or move one of them to another room.

See [Character routines](/docs/beasty-visual-novel/world/character-routines/).

## A block does nothing

**Cause.** The block has no asset assigned. A Backdrop block with no sprite, a Music block with no clip, a
Show character block with no character: all of them are skipped. Whatever is on screen stays on screen, and
whatever is playing keeps playing.

This is deliberate. It means a half-authored block never blanks your scene by accident.

**Fix.** Assign the asset. If what you actually wanted was to blank something on purpose, use the block that
does that:

| To do this | Use |
|---|---|
| Remove the background | **Clear > Backdrop** |
| Remove a character | **Scene > Hide character**, or **Clear > Characters** |
| Remove every prop | **Clear > Props** |
| Silence music, ambient, SFX or voice | **Audio > Stop channel** |

See [Blocks reference](/docs/beasty-visual-novel/authoring/blocks-reference/).

## Saving the text script deleted a block

**Cause.** A block with no asset assigned has nothing to write. It does not appear in the `.vnbeasty` file,
so when the file is applied back to the graph the block is gone from the graph too.

**Fix.** Assign the block's asset **before** you save the script. This is about empty blocks only: a block
that has its asset always has a text form, layered backdrops and props included.

If the import wrote a timestamped `.bak` next to your script, the overwritten side is in it.

See [The text script](/docs/beasty-visual-novel/authoring/text-script/).

## My script will not import

**Cause.** The import was refused on purpose. The graph is the source of truth: an import that fails to
parse, that is empty, or that would destroy content is rejected and the graph is left exactly as it was. You
have lost nothing.

**Fix.** Read the reported line. The message names it.

The one that surprises people: an asset name that does not resolve, or that several assets share, is an
**error**, not a warning. The importer refuses rather than guess which sprite you meant. Rename the
duplicate, or use a path (`backdrop interiors/bedroom`) to disambiguate.

Assets resolve by GUID once a node is synced, so moving or renaming art later does not break anything.

See [The text script](/docs/beasty-visual-novel/authoring/text-script/) and [the .vnbeasty syntax](/docs/beasty-visual-novel/authoring/vnbeasty-syntax/).

## The graph and the text disagree

**Cause.** Both sides changed since the last sync. The Story tab shows a warning marker on the **Graph**
toggle when it detects this.

**Fix.** Decide which side is right, and save that one. **The most recent save wins**, and a timestamped
`.bak` of the overwritten side is left next to the script, so the other version is never lost.

- Graph is right: press **Sync from graph** to rewrite the script.
- Text is right: save the file to apply it to the graph.

Agree a direction with your team before both people edit the same scene.

See [The text script](/docs/beasty-visual-novel/authoring/text-script/).

## A choice never shows up

**Cause.** Its condition is false. A choice is only listed when its condition passes.

**Fix.** Open the choice and read its condition. Two rules explain almost every case:

- An **empty condition is always true**. If a choice with no condition is missing, the problem is elsewhere.
- A clause with **no variable selected is incomplete and evaluates to false**. The console reports it once.
  A half-filled condition hides the choice.

If every option is gated out, the Choice node goes to its default next node, so the story does not stall - it
just skips the menu.

See [Choices and decisions](/docs/beasty-visual-novel/authoring/choices-and-decisions/) and
[Variable keys](/docs/beasty-visual-novel/reference/variable-keys/).

## My variable condition never fires

**Cause.** The joins. **AND binds tighter than OR**, and there are no brackets.

`a AND b OR c` means `(a AND b) OR c`. If you meant `a AND (b OR c)`, you did not write it.

**Fix.** Reorder the clauses so the AND group is what you intended, or split the branch into two branches of
a Decision node.

While you are there, check the value type. A quest state is a string (`active`, `completed`), not a number.

See [Variables and conditions](/docs/beasty-visual-novel/world/variables-and-conditions/).

## The streamed art is missing

**Cause.** You ran `Tools > Beasty VN > Streaming > Convert To Streamed Content`, which marks the sprites
Addressable and clears the direct references. The addresses exist, but the Addressables content was never
built, or is stale after you changed the art.

**Fix.** Rebuild the Addressables content (`Window > Asset Management > Addressables > Groups`, then build the
groups). Any time you convert to streamed content, or add art to a streamed group, rebuild.

To go back, run `Tools > Beasty VN > Streaming > Convert To Direct References`. It is always available, and
it restores the direct references so the art loads synchronously again.

> **Warning**
> Streaming is opt-in and beta in 1.0.0. If you are not shipping a very large game, leave it off. Audio,
> video, fonts, free-roam and hover art, choice and talk-menu images, HUD icons and save thumbnails are never
> streamed.

See [Streaming](/docs/beasty-visual-novel/production/streaming/).

## Two assets behave as one

**Cause.** They share an id. Ids are what conditions, scripts and saves refer to, so two assets with the same
id are indistinguishable to the engine. This usually happens after duplicating an asset with Ctrl+D.

**Fix.** Run `Tools > Beasty VN > Validate > Find duplicate ids`. It reports every collision. Then right-click
the wrong one in the Project window and choose
`Assets > Beasty VN > Give this asset fresh ids (fix a duplicate)`.

Ids are auto-generated but editable, and renaming one cascades. Do it before your players find the problem.

See [Validation and ids](/docs/beasty-visual-novel/production/validation-and-ids/).

## A translation looks out of date

**Cause.** It is. The cell is **Stale**. Every translated cell records a fingerprint of the source text it was
translated from. When you edit the source line, every translation of it is marked Stale - the old text is
still there, but it no longer matches.

**Fix.** Open the **Localization** tab. The status is shown per cell. Use `Export` and choose
**Missing or stale only** to send your translator exactly the lines that changed, then import the result.

See [Localization](/docs/beasty-visual-novel/production/localization/).

## Nothing here matches

Run `Tools > Beasty VN > Maintenance > Validate Selected Project`. It walks the root graph and every
subgraph, and reports dangling references: unknown character ids, unknown variable keys, unknown dictionary
tokens, unknown character fields.

If you recently deleted assets, also run `Tools > Beasty VN > Maintenance > Clean Deleted-Asset Residue`.

## See also

- [FAQ](/docs/beasty-visual-novel/faq/)
- [Menu items](/docs/beasty-visual-novel/reference/menu-items/)
- [Variable keys](/docs/beasty-visual-novel/reference/variable-keys/)
- [Validation and ids](/docs/beasty-visual-novel/production/validation-and-ids/)
