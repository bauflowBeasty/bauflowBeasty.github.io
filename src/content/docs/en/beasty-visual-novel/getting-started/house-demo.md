---
title: "The House Demo"
description: "A complete, playable mini-game inside the package: open one scene, press Play, and see every major system working before you build your own."
---

The package ships a complete mini-game at `Demos/HouseDemo`: you wake up in a small house, meet your
housemate Mia, and run one short quest for her. It exists so you can see every major system working —
free roam, time, routines, quests, inventory, the talk menu, saves, localization — before you build any of
it yourself. Ten minutes of play, and every one of those words has a picture attached.

## Running it

Open `Demos/HouseDemo/HouseDemo.unity` in the Project window and press **Play**. Nothing to configure.

![The House Demo living room in Play, with Mia and the interactables](/docs-images/beasty-visual-novel/vn-house-demo-living.png)

The demo is also worth keeping open in the **editor**: its assets — the two `DialogueScene`s, the map, the
quest catalog, the characters — are ordinary project assets, authored exactly the way yours will be. When
a docs page describes a window, opening the demo's version of that content is the fastest way to see a
populated example.

## What it demonstrates, and where to look

| You play | The system behind it |
|---|---|
| A prompt asks your name (leave it blank and you stay "Alex") | The `Ask` block and player rename — [Characters](/docs/beasty-visual-novel/world/characters/) |
| Two profile questions, then a scene that reacts to them | Variables set by choices, routed by an **invisible decision** — [Choices and decisions](/docs/beasty-visual-novel/authoring/choices-and-decisions/) |
| Two connected rooms, with doors | Free roam and the map graph — [Free-roam rooms](/docs/beasty-visual-novel/world/free-roam-rooms/) |
| Clicking the bed turns day into night, and the backgrounds change | Game time (dayparts) and conditional backgrounds — [Game time](/docs/beasty-visual-novel/world/game-time/) |
| Mia is in the living room by day, gone at night — except Sunday | A weekly **routine** — [Character routines](/docs/beasty-visual-novel/world/character-routines/) |
| "A Good First Impression": talk to Mia, then find her book | A two-stage quest with a gather-and-deliver objective — [Quests](/docs/beasty-visual-novel/world/quests/) |
| The book appears in the bedroom only mid-quest, and goes to your inventory | Conditional visibility and items — [Items and inventory](/docs/beasty-visual-novel/world/items-and-inventory/) |
| Talking to Mia opens a menu; one entry only appears at friendship 10+ | The talk menu with conditional entries — [The talk menu](/docs/beasty-visual-novel/world/talk-menu/) |
| Mia's profile, stats and weekly calendar screens | Character screens — [Character screens](/docs/beasty-visual-novel/world/character-screens/) |
| Save, quit Play, load — day, quest and inventory come back | Saving — [Saving and loading](/docs/beasty-visual-novel/production/saving-and-loading/) |
| Switch English/Spanish in Preferences, mid-game | Localization — [Localization](/docs/beasty-visual-novel/production/localization/) |

Two details worth noticing while you play. The decision that reacts to your profile answers shows the
player nothing — the two greeting scenes differ because a `decision` node routed on the `bold` variable.
And the demo has **no music on purpose**: its queues are empty, which is the documented way to say
"silence in this mode".

## Reading the story source

The whole story is authored in the text-script format, kept in sync with the graph:

- `Demos/HouseDemo/Scripts/HouseIntro.vnbeasty` — the wake-up scene: the rename prompt, the two profile
  choices, the invisible decision, and the exit into free roam.
- `Demos/HouseDemo/Scripts/HouseInteractions.vnbeasty` — everything in the house: Mia's talk menu
  branches, the quest beats, the book pickup, the shelves.

Open either in the Story window's **Text** tab, or in any text editor. They are short, and they use the
same `.vnbeasty` constructs the [syntax reference](/docs/beasty-visual-novel/authoring/vnbeasty-syntax/)
documents — a working example of `ask`, `quest`, `deliver`, `give`, conditions and `freeroam` exits.

## The placeholder art

All art is labeled placeholder PNGs under `Demos/HouseDemo/Sprites/` — flat colors with the asset's name
stamped on them (LIVING ROOM - DAY, MIA, BOOK…). Fourteen files, named by role:

| Prefix | Files | Used as |
|---|---|---|
| `bg_` | `bg_living_day`, `bg_living_night`, `bg_bedroom_day`, `bg_bedroom_night` | Room backgrounds, one per daypart |
| `char_` | `char_player_full`, `char_mia_full` | Stage sprites |
| `portrait_` | `portrait_player`, `portrait_mia` | Dialogue portraits |
| `pose_` | `pose_mia_living` | Mia standing in the room |
| `item_` | `item_book` | The quest item |
| `door_` | `door_to_living`, `door_to_bedroom` | The clickable doors |
| `prop_` | `prop_shelf`, `prop_bed` | The clickable furniture |

**Replace any file with final art of the same name and nothing needs rewiring** — every reference in the
demo points at the file, not at a copy. The demo never overwrites an existing PNG, so your replacements
are safe.

This makes the demo a usable **skeleton for your own game**: rename nothing, swap the art, rewrite the
`.vnbeasty` files, and the wiring — rooms, screens, save/load, localization — is already done.

## See also

- [Installation](/docs/beasty-visual-novel/getting-started/installation/) — where the package puts things
- [Your first scene](/docs/beasty-visual-novel/getting-started/your-first-scene/) — build the same thing from an empty scene
- [Core concepts](/docs/beasty-visual-novel/getting-started/core-concepts/) — the vocabulary the demo just showed you
- [The text script](/docs/beasty-visual-novel/authoring/text-script/) — the format the demo's story is written in
- [Quests](/docs/beasty-visual-novel/world/quests/) — the system behind "A Good First Impression"
