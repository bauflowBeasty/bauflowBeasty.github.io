---
title: "Large projects"
description: "A twenty-hour game is not a two-hour game with more nodes. The parts of the package built for scale, and the habits that keep a long production moving."
---

A twenty-hour game is not a two-hour game with more nodes in it. This page is about the parts of the package
built for scale, and the habits that keep a long production from grinding to a halt.

## What the editor already does for you

You do not have to plan for these. They are how the windows work.

- **Virtualized lists.** The variable, quest, item, character, room and node lists draw only the rows that are
  on screen. A list with thousands of entries scrolls as fast as a list with ten.
- **Search and grouping** in those lists, so finding one variable among thousands is typing, not scrolling.
- **Multi-select and bulk delete.** Click, shift-click for a range, ctrl-click to add — then
  **Delete selected (N)**. Available in the variables, items, quests, characters and screens lists. Cleaning up
  a hundred obsolete flags is one operation.
- **Master-detail for character variables.** The character list is on the left, that character's fields on the
  right, instead of one flat list of every field of every character.

## Splitting the story across scenes

Do not write a twenty-hour game as one `DialogueScene`. Split it — by chapter, by act, by route — and move
between them with the **Go to VN scene** flow block (or the `goto-scene` line in a text script).

The thing that makes this work: **the variable store survives the jump**. Chapter 2 opens with every flag,
every character stat, the game clock, the quest states and the inventory exactly as Chapter 1 left them,
because all of it lives in one store that belongs to the game, not to the scene. You can also enter a specific
node of the target scene rather than its entry node.

What you get out of it:

- Each scene is a smaller asset, so the graph canvas, the text script and the localization table are all
  workable.
- Two writers can work on two chapters at once without fighting over one file.
- The Localization tab's **Section** export can hand one chapter to one translator.

## Reuse with subgraphs

Anything you write more than once should be a subgraph: a shop, a fight, a "make tea" scene, a dream sequence.
A subgraph node calls a nested graph and routes on the outcome it returns, so one authored sequence serves
every caller and each caller decides what happens afterwards. See [Subgraphs](/docs/beasty-visual-novel/authoring/subgraphs/).

The validator checks that each caller either routes every outcome the subgraph can return, or has a fallback —
which is the failure mode that bites when a subgraph grows a new ending late in production.

## Keeping localization manageable

A long game's translation table is big, and re-sending it in full every time you touch a line wastes your
translator's time and your money.

- Export **Missing or stale only**. It contains exactly the cells that need work, and nothing else. Because
  every translated cell remembers the source text it was made from, this stays accurate after any amount of
  rewriting.
- Export **by section** to hand out one chapter at a time.
- Sweep **Unused keys** periodically. Deleting story content leaves its keys behind.

See [Localization](/docs/beasty-visual-novel/production/localization/).

## When to turn on streaming

Turn it on when your art is genuinely the problem — a long game whose backdrops and character sprites do not
all need to be resident at once, or a memory-constrained platform. It is opt-in, and it is currently in beta, so it
is a deliberate decision rather than a default. It is also reversible at any time.

See [Streaming](/docs/beasty-visual-novel/production/streaming/).

## Run the validator regularly

The cost of a dangling reference grows with the size of the project: in a small game you notice it the next
time you play; in a big one it sits in a branch nobody has walked in three months. Run
`Tools > Beasty VN > Maintenance > Validate Selected Project` on each scene as part of your routine, not just
before a build.

Duplicating assets in the Project window is also more common on a big team — so run `Find duplicate ids` when
things start behaving oddly. See [Validation and ids](/docs/beasty-visual-novel/production/validation-and-ids/).

## See also

- [Streaming](/docs/beasty-visual-novel/production/streaming/), [Validation and ids](/docs/beasty-visual-novel/production/validation-and-ids/), [Localization](/docs/beasty-visual-novel/production/localization/).
- [Subgraphs](/docs/beasty-visual-novel/authoring/subgraphs/) and [Transitions](/docs/beasty-visual-novel/authoring/transitions/) — reuse, and moving
  between scenes and modes.
- [The text script](/docs/beasty-visual-novel/authoring/text-script/) — writing a scene as text, which scales differently from the
  canvas.
