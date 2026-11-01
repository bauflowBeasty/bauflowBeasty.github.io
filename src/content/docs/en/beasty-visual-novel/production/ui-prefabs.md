---
title: "UI prefabs"
description: "Every screen the player sees is a Unity UI prefab you can open and edit. The prefab list, two ways to restyle, and the fix for the black-screen boot."
---

Everything the player sees is a uGUI prefab (uGUI is Unity's built-in UI system). There is no custom
rendering layer, no proprietary UI framework and no hidden canvas: it is Unity UI, in prefabs you can open
and edit. This page describes their default look, lists them, and shows the two ways to restyle the game.

## The default look: ink and paper

The ready-made prefabs share one hand-drawn look: a dark ink dialogue box and name plate with cream text, ink
pill choices that turn brick red when hovered or selected, menus on a lined paper sheet over a dimmed scene,
paper card buttons, polaroid save slots, and matching sliders, toggles, dropdowns, scrollbars and input
fields.

![The ink-and-paper look in game: the dialogue box, the name plate and two choices, one hovered](/docs-images/beasty-visual-novel/vn-ui-ink-paper.png)

- **Sprites.** About twenty small 9-slice sprites in `Sprites/UI` (around 120 KB in total), shared by every
  prefab. None contains text, so nothing needs translating. The older sprites (`textbox`, `namebox`, `frame`,
  `nvl`, `notify`, `skip`) kept their file and GUID, so your own prefabs that point at them pick up the new art
  on their own.
- **Font.** Nunito, Regular and Bold, with TextMesh Pro font assets that cover Spanish and other western
  languages without gaps. It is licensed under the SIL Open Font License 1.1, declared in
  `Third-Party Notices.txt`. Speaker names keep each character's **Name Color**; the name plate is dark, so
  light colors stay readable.
- **Buttons** use **Sprite Swap** (`card` / `card_on`, `choice` / `choice_on`) instead of a color tint. If a
  prefab variant or a scene instance of a package button overrides its **Colors**, those colors no longer do
  anything: set that button's **Transition** back to **Color Tint** to keep them.
- **Readable at any resolution.** Every ready-made screen is sized for the 4K `VN_Canvas`: no text is smaller
  than 28 units (14 px at 1080p), and buttons are large enough to hit comfortably. The Main Menu, Save/Load,
  Credits, Help and History panels keep their proportions and their share of the screen at any resolution,
  like the confirm dialog.
- **The game menu.** Save/Load fills the menu area, with large **Manual / Autosaves** tabs and a footer with the
  page arrows (`|<`, `<`, `>`, `>|`), the save-name field and **Back**. Credits, Help and History fill it too,
  and History entries are ink on the paper sheet.
- **Custom menus** (`GridMenu`, `VerticalMenu`) sit on a paper sheet, so their ink labels read over any scene.
- **Empty save slots** show a dashed `slot_empty` picture.

`Build Default Menu Prefabs` and the screen builders in the Screens section give the prefabs they **create**
the same look. They never restyle a prefab that already exists in your project. The
[Dialogue Preview](/docs/beasty-visual-novel/authoring/dialogue-preview/) uses the same dialogue box, so the
preview matches Play mode.

## The Preferences screen

![The Preferences screen: Display and Text on the left, Sound and Accessibility on the right](/docs-images/beasty-visual-novel/vn-preferences-screen.png)

Preferences is one paper sheet next to the game menu, in two columns:

| Left | Right |
|---|---|
| **Display** — Window, Language | **Sound** — Master volume, Music, Ambient, SFX, Voice |
| **Text** — Text speed, Auto-forward time, Start with auto-forward on, Skip unread text, Walkthrough hints | **Accessibility** — Reduce flashes and motion |

**Reset to defaults** and **Back** sit at the bottom right. Rows are large — label on the left, control on the
right — and the layout stretches with the screen.

- **Start with auto-forward on** and **Reduce flashes and motion** both reset with **Reset to defaults**.
- **Walkthrough hints** appears only when the project has
  [walkthrough hints](/docs/beasty-visual-novel/world/notifications-and-walkthrough/) on.
- When the game has a single language, the whole **Language** row is hidden, label included.

Menu prefabs built before these options existed show them after you run **Build Default Menu Prefabs** again.
Its rebuilt menu root carries the same Preferences screen, with every label and header translated.

## The prefabs

![The prefabs folder of the package in the Project window](/docs-images/beasty-visual-novel/vn-ui-prefabs-folder.png)

| Prefab | What it mounts |
|---|---|
| `VisualNovelScene` | A whole ready-made scene: everything below, already wired. |
| `VN_Canvas` | The entire interface in one prefab: the dialogue view, the choice view, and the menu manager with the main menu, game menu, save/load, preferences, history, credits and help screens, plus the confirm dialog and the loading screen. |
| `Stage` | The stage (backdrop, characters, props) and the free-roam scenario. |
| `DialogPanel` | The dialogue panel: the name plate above the box's top-left corner, the line, and the text input prompt with its **Confirm** and **Back** buttons. Narration lines hide the name plate. |
| `ChoiseRoot`, `ChoiseBtn` | The choice container and the choice button template. |
| `MainMenuScreen`, `GameMenuScreen`, `VNMenuRoot` | The menus. |
| `VNSaveSlot` | One save slot cell, instantiated once per slot. |
| `VNBacklogEntry` | One history line, instantiated once per line. |
| `Inventory` | The inventory screen, its slots and the item detail popup. |
| `CharactersMenu`, `CharacterProfile`, `CharacterStats`, `CharacterRoutine` | The character screens: the cast list, the profile with its tab bar, the stats panel and the routine calendar. |
| `Phone` | The ready-made smartphone overlay. See [Phone screens](/docs/beasty-visual-novel/world/phone-screens/). |
| `GridMenu`, `VerticalMenu` and the item-element templates | The layouts an overlay screen is built from. |
| `BeastyVNMixer` | The AudioMixer, with a group per channel (Music, Ambient, Sfx, Voice). |

The full field-by-field list is in the [prefab reference](/docs/beasty-visual-novel/reference/prefabs/).

## How to restyle

**Option 1: edit the prefab.** Open it, change the fonts, colours, sprites, layout and anchors, add your own
decoration. The views find their pieces through the references you see in the Inspector, so as long as those
fields still point at something, the prefab keeps working. This is the normal path and it costs nothing.

**Option 2: point the views at your own canvas.** The views are ordinary MonoBehaviours — plain Unity
components — with references you wire in the Inspector. Build your own canvas, put the views on it, wire the
fields, and the engine drives your UI instead
of ours. Nothing in the runtime assumes the shipped hierarchy.

## The two prefab menu items

![The confirmation dialog before rebuilding or upgrading the UI prefabs](/docs-images/beasty-visual-novel/vn-upgrade-prefabs.png)

| Menu item | Use it when |
|---|---|
| `Tools > Beasty VN > Setup > Upgrade UI Prefabs (keep customizations)` | You want the shipped prefabs brought up to date — new pieces a newer version added — **without losing your restyling**. It only adds what is missing and leaves your changes alone. This is the one you normally want. |
| `Tools > Beasty VN > Setup > Build Default Menu Prefabs` | You want the menu prefabs regenerated from scratch: a plain, functional menu root with every screen and every field wired. It warns before overwriting, because it replaces the prefab, and your restyling with it. |

Reach for Build Default Menu Prefabs when a menu prefab is broken beyond repair, or when you want a clean
baseline to restyle. Reach for Upgrade in every other case.

## The black screen, and the button that fixes it

![The black screen, and the button that fixes it](/docs-images/beasty-visual-novel/vn-black-screen-fix.png)

> **Warning**
> The prefabs reference each other, and the scene resolves the views **by type** rather than by a path you
> maintain. If you rebuild a menu prefab, or reorganise one heavily, a reference the scene was holding can end
> up pointing at nothing. The symptom is distinctive: **the game boots to a black screen, the engine is clearly
> running, and there is not a single error in the console.**
>
> Before you debug anything else, select the **BeastyManager** in your scene and press **Auto-wire / Repair**.
> That is almost always the fix.

Auto-wire re-resolves the scene's views and re-creates any manager that went missing. It only fills EMPTY
references — it never overwrites wiring you did yourself — so it is safe to press at any time. See
[Validation and ids](/docs/beasty-visual-novel/production/validation-and-ids/) for exactly what it guarantees.

## See also

- [Prefab reference](/docs/beasty-visual-novel/reference/prefabs/) — every prefab and its fields.
- [Screens and HUD](/docs/beasty-visual-novel/world/screens-and-hud/) — building your own overlay screens out of these layouts.
- [Character screens](/docs/beasty-visual-novel/world/character-screens/) — the cast list, profile, stats, calendar and quest log.
- [Audio and music](/docs/beasty-visual-novel/production/audio-and-music/) — the mixer prefab.
