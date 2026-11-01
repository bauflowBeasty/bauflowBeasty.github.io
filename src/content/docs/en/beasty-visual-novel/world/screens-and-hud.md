---
title: "Screens and HUD"
description: "The money counter in the corner, the clock, the inventory button, the panel that opens when you click it. This page is for writers and designers."
---

The money counter in the corner, the clock, the inventory button, the panel that opens when you click it. This
page is for writers and designers.

You author screens in the **Screens** tab of the Beasty VN window (`Tools > Beasty VN > Editor`). A screen is a
uGUI prefab plus a small record saying what each thing in it means. The prefab owns the look; the record owns
the logic. Same split as rooms.

## Two kinds of screen

![The Screens tab: the screen list, its settings and the prefab preview](/docs-images/beasty-visual-novel/vn-tab-screens.png)

| Kind | What it is |
|---|---|
| **Primary HUD** | A persistent HUD. It is on screen whenever its mode and its condition allow. Money, the day, a portrait, a button that opens the inventory. |
| **Secondary overlay** | An overlay. It is not on screen until something opens it, and it closes again. The inventory, a map, a settings panel. |

Create screens from the **+ New screen** menu in the tab's screen list:

| Entry | What it creates |
|---|---|
| **Primary** | An empty HUD. |
| **Secondary ▸ Blank overlay** / **Phone app** | An empty overlay, or an empty phone app. |
| **Menu ▸ Grid** / **Vertical list** / **Phone grid** / **Phone list** | A menu of buttons, on a paper sheet or inside the phone. |
| **Inventory ▸ Notebook** / **Phone** | The ready-made [inventory](/docs/beasty-visual-novel/world/items-and-inventory/). |
| **Characters ▸ Notebook** / **Phone** | The ready-made [character list and profile](/docs/beasty-visual-novel/world/character-screens/). |
| **Phone** | A ready-made smartphone with apps. See [Phone screens](/docs/beasty-visual-novel/world/phone-screens/). |
| **Add existing prefab…** | Registers a prefab you already made. |

A project can have both inventories at once, the notebook one and the phone one, showing the same items. Each
kind is still created only once.

## Where a screen shows up

![A HUD in game: a live money counter, the day, and a button that opens a screen](/docs-images/beasty-visual-novel/vn-hud-ingame.png)

| Field | What it does |
|---|---|
| **Id** | The stable id. The **Open screen** block and any button that opens this screen name it by id. Renaming it renames the prefab too, and moves its translations. |
| **Prefab (uGUI)** | The screen's prefab. |
| **Kind** | Primary HUD or secondary overlay. |
| **Mode** | `FreeRoam`, `VisualNovel` or `Both`. |
| **Visible when** | A condition. Empty = always (within its mode). |

**Mode** is the coarse switch: a money counter is usually `Both`; a "travel to another room" button is
`FreeRoam`; a "recap" panel might be `VisualNovel` only. **Visible when** is the fine one: show the stamina bar
only after the tutorial, hide the clock indoors.

A primary screen is shown when its mode matches the current app state **and** its condition passes. Both have
to agree.

## Items

An **item** is one thing inside the screen: an icon, a label, a button. **An item is named after an object in
the prefab** — the record and the prefab element are matched by name, so you never type an id.

![A screen item: text, live variable, visibility condition and conditional variants](/docs-images/beasty-visual-novel/vn-screen-item.png)

**+ Button** and **+ Decoration** create the item, create its element inside the prefab, and put the cursor in
its **Name** field. Renaming an item renames both sides.

### The item list

Items are listed in rows grouped by the container they sit in; a scroll list shows its owner's name. Each row
has a drag handle, the item's icon, its name and a one-line summary of what it does. Drag the handle to reorder
inside the group — the screen prefab follows. The selected row opens its editor under it.

**Click an item in the preview** to select it: the list scrolls to it and marks it in blue.

Shortcuts work with the focus anywhere in the section, and the row's right-click menu lists them:

| Shortcut | Action |
|---|---|
| Delete / Backspace | Delete the item. |
| F2 | Rename. |
| Ctrl+D | Duplicate: a new item next to the original, with the same settings. |
| Ctrl+C / Ctrl+V | Copy the settings, and paste them onto the selected item. |
| Up / Down | Select the previous / next item. |
| Esc | Clear the selection. |
| F | Show the selection in the list. |

### What every item has

- **Icon** — the item's base icon, saved in the screen prefab.
- **Text** — fixed label text. May be empty. It is translated in
  [Localization › Game UI](/docs/beasty-visual-novel/production/localization/#the-game-ui-tab).
- **Variable (live)** — a variable whose current value is appended to the text, and **kept up to date at
  runtime**. This is the live money counter: Text = `Money: `, Variable = `gold`, and the label reads
  `Money: 120` and changes the instant the player earns a coin. Any variable works, including the reserved ones
  — pick `time.day` and you have a day counter. For text the player reads, pick a translated token:
  `@time:daypart.label`, `@time:weekday.label`, or `@time:clock.label` (the hour as `HH:00` with a clock, the
  time-of-day name without one).
- **Visible when** — a condition. Empty = always shown.
- **Conditional variants (icon/text)** — an ordered list of **cases**. Each case has a condition, an optional
  icon and an optional text. **The first case whose condition passes wins**; if none does, the item's base icon
  and label apply. A case that only sets an icon keeps the base label, and vice versa.

Cases are how one item says several things. A weather icon that changes with the season. A portrait that
changes with affection. A door icon that shows a padlock while the shop is closed.

The item's own icon always wins over a change made at runtime: an icon a script sets on a screen element is
replaced the next time the screen refreshes. Use a case instead.

## Actions

The **Does** popup says what an item does when clicked:

![A button item with its Does popup open](/docs-images/beasty-visual-novel/vn-screen-button-action.png)

| Does | What it does |
|---|---|
| **Nothing (decoration)** | Not clickable. Shows art and/or a label. |
| **Open screen** | Opens a secondary screen (you pick which). |
| **Back** | Goes back **one** level: re-shows the parent screen, or closes the overlay if it is the top level. |
| **Close all screens** | Closes the **whole** secondary stack at once. The "exit" button. |
| **Open game menu** | Opens the pause menu on Save/Load, Preferences, History, Help or Credits. The screen stays open underneath, and the player returns to it. It warns when the open scene has no menu manager. |
| **Change values only** | Applies the button's **On click** changes and nothing else. For buttons that only change values. |
| **Enter VN scene** | Enters a visual novel scene, at a start node you pick from that scene. The overlay stack closes and the dialogue plays. |
| **Advance time** | Changes the game clock, with the same operations as the [Advance time](/docs/beasty-visual-novel/world/game-time/) block; the daypart and weekday come from the time config. A "wait" or "sleep" button. It needs a Time Config on the BeastyManager. |
| **Custom event** | Raises a custom event id for your own script to handle. |

### Click effects

Independently of the action, a button can carry **On click** variable effects: `gold` Subtract `10`,
`stamina` Subtract `1`, `flag_visited` Toggle. They are applied **before** the action runs. A button can charge
the player and then open the screen.

### Changing player preferences

**On click** can also change the player's preferences. Pick one from the **Player preferences** group:

| Preference | What it is | Operations |
|---|---|---|
| `@pref:textSpeed` | Text speed. | Assign, Add, Subtract |
| `@pref:autoDelay` | Auto-forward time. | Assign, Add, Subtract |
| `@pref:volume.master`, `.music`, `.sfx`, `.voice`, `.ambience` | A volume, between 0 and 1. | Assign, Add, Subtract, Toggle |
| `@pref:autoOnStart` | Start with auto-forward on. | Assign, Toggle |
| `@pref:skipUnread` | Skip unread text. | Assign, Toggle |
| `@pref:reduceMotion` | Reduce flashes and motion. | Assign, Toggle |
| `@pref:walkthrough` | [Walkthrough hints](/docs/beasty-visual-novel/world/notifications-and-walkthrough/). | Assign, Toggle |

Volumes stay between 0 and 1. **Toggle** on a volume mutes it, and toggling again restores the volume it had —
a mute button in one line.

Preferences can be read anywhere: in conditions, and in labels such as `[@pref:volume.music]`.
`@pref:walkthrough.available` tells whether the project enables walkthrough hints. The story cannot change
preferences: a Set variable block or a choice effect that targets an `@pref:` key is ignored, with one warning
per key. Preferences are never saved in game saves.

### Interactive in VN

A button on a screen whose mode includes `VisualNovel` has one extra toggle: **Interactive in VN**. Turn it off
and the button is still **visible** during dialogue but does not respond. Use it to keep a HUD readable during
a scene without letting the player wander off mid-conversation. In free roam a button is always interactive;
the toggle is not offered there.

## The secondary stack

Secondary screens form a **stack**. Opening one from another pushes it and hides its parent, so only the top
overlay is on screen. **Back** pops one level and re-shows the parent; **Close all screens** dismisses the whole
stack.

You get this without wiring it: **every secondary screen is given a Back button automatically** when it is
created — a top-right element with the **Back** action. Clicking outside the panel also closes the overlay, and
while any secondary screen is open a blocker sits behind it, so a click meant for the overlay never leaks
through to the room underneath. Secondary screens are modal.

The open stack is part of the save, so a player who saves with the inventory open reloads with the inventory
open.

## Opening a screen from the story

The **Open screen** block (palette category **World**) opens a secondary screen by id from inside a node. Use
it to show the player the map when the story hands it to them, or to pop the inventory open the first time they
pick something up.

```text
[Dialogue]     "The old man presses a folded map into your hand."
[Open screen]  screen = map
```

In the text script:

```text
screen map
```

The block is presentation only — it opens the overlay, and the player closes it like any other. There is
nothing to restore on rewind.

## Preview

The Screens tab previews the selected screen's prefab beside its settings, as it looks in the game — also for a
prefab with its own Canvas. It redraws when the prefab or the column width changes. **Edit layout (open
prefab)** takes you to the prefab to move things around; **Refresh** re-renders the preview. The **Hierarchy
(who opens what)** foldout shows the tree of screens and which button opens which — and lets you add or unlink a
child screen without hunting for the button that does it.

![The screen preview beside its settings, with the hierarchy foldout](/docs-images/beasty-visual-novel/vn-screen-preview.png)

The section adapts to narrow windows: labels shrink with the column and long rows wrap instead of scrolling
sideways. The preview narrows first; when it no longer fits, it folds into a **Preview** toggle in the toolbar
that shows it in place of the configuration until you switch it off.

## Undo

Adding, renaming, deleting and reordering items, and changing an item's icon, can all be undone — the prefab
included: one Ctrl+Z puts back both the item's settings and its element in the screen prefab, and Ctrl+Y redoes
it. Linking and unlinking a child screen from the hierarchy undo the same way. Deleting an item does not ask
for confirmation, since it can be undone.

> **Note**
> Undoing a Screens step restores the prefab as it was at that step. Edits you made by hand in Prefab Mode
> after it are overwritten. Undoing the creation of a phone screen or app removes the screen and its entries,
> but leaves the copied prefab files in your Screens folder.

## See also

- [Phone screens](/docs/beasty-visual-novel/world/phone-screens/) — the ready-made phone and its apps.
- [UI prefabs](/docs/beasty-visual-novel/production/ui-prefabs/) — restyling every screen, and upgrading the shipped prefabs.
- [Character screens](/docs/beasty-visual-novel/world/character-screens/) — the ready-made cast list, profile, stats, calendar and quest log.
- [Items and inventory](/docs/beasty-visual-novel/world/items-and-inventory/) — the ready-made inventory screen.
- [Variables and conditions](/docs/beasty-visual-novel/world/variables-and-conditions/) — what a live label and a case condition can read.
- [Game time](/docs/beasty-visual-novel/world/game-time/) — the Advance time action's operations.
