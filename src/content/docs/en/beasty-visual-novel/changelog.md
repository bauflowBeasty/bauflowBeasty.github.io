---
title: "Changelog"
description: "A summary of what changed in Beasty Visual Novel, version by version. The project follows Semantic Versioning."
---

A summary of what changed in Beasty Visual Novel, version by version. Each feature is explained in full on
its own page of these docs. This project follows [Semantic Versioning](https://semver.org/).

## 1.1.0 — 2026-10-31

### New
- **Transitions and screen effects.** Dissolves, fades, wipes, slides and more between scenes, plus
  flashes, shakes, tints, color filters, blur and camera zoom, with ready-made presets.
- **Layered characters and wardrobe.** Build expressions from layers in the new Expression Composer, and
  change clothes and outfits during the story.
- **Characters can speak together.** Two to five characters say the same line.
- **Stat notifications.** A short note appears when a stat or a variable changes during play.
- **Walkthrough hints.** Choices can show what they do to the player's stats; players turn the hints on
  or off in Preferences.
- **Phone screens.** A ready-made smartphone with apps, and phone versions of the menu, inventory and
  character screens.
- **Translate your game's own texts**: HUD texts, room names, quests, stat names and items, in two new
  Localization tabs.
- **New player options**: reduce flashes and motion, and start with auto-forward on. Screen buttons can
  change player preferences too.
- **House Demo: new chapter *Party night***, showing off the wardrobe, effects, phone, notifications and
  hints.

### Improved
- **New look for the whole game UI**: a hand-drawn "ink and paper" style, readable at any resolution.
- Redesigned Preferences, save/load, character list, character profile and inventory screens.
- Talk menus always end with a **Leave** option, so the player can never get stuck in a conversation.
- A character's default expression is the first one in its list.
- The Screens section is easier to work with: one menu to create screens, drag to reorder, click the
  preview to select, and undo for every step.
- The Beasty VN window stays usable at any width, with side panels you can resize.
- The player's language stays the same after rewinding or loading a save.
- Settings and menu translations now live in your project and are created for you: a new project plays the
  House Demo with no setup, and updating the package no longer overwrites your translations.
- Characters on stage are now built from parts: custom scripts that read a character's sprite directly
  need an update.

### Fixed
- The Dialogue Preview no longer shows an empty stage after some choices, and it now draws the dialogue
  box.
- Moving an object in a room prefab is no longer undone by the FreeRoam window.
- The preview in the Screens section shows the screen's content again.
- The ready-made dialogue box no longer shows placeholder text before the first line.

## 1.0.1 — 2026-08-14

### Fixed
- The script text editor no longer fills the console with errors in projects created with Unity 6.3 or
  later.

## 1.0.0 — 2026-08-13

First public release.

### New
- **Story graph** with a block-based editor, plus a text script, written like Ren'Py, that stays in sync
  with the graph.
- **Live preview** of any line of the story inside the editor.
- **Free-roam rooms** with doors, objects and characters that follow a weekly routine through the day.
- **Game time, quests and talk menus** for every character.
- **Ready-made game screens**: dialogue, choices, history, save/load, preferences and help.
- **Localization** with menus already translated into 15 languages, and spreadsheet import and export.
- **Saving** with slots, thumbnails, autosaves, backups and optional encryption, also to the cloud with
  Firebase.
- **Music for each game mode**, and optional streaming of large assets (beta).
- **House Demo**: a complete mini-game that shows the features working together.
- Includes Beasty Save System and needs nothing else.
