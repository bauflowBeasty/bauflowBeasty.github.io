---
title: "The dictionary"
description: "The dictionary holds the player's own words. A dictionary entry is a named text token you drop into a line — their home town, their pet's name, what they call"
---

The dictionary holds the player's own words. A dictionary entry is a named text token you drop into a
line — their home town, their pet's name, what they call their sword — and it reads the same in every
language, because the player wrote it.

## What it is, and what it is not

A dictionary token is a piece of text with a key. You write `[city]` in a line, and the player reads
"Madrid", or "Boston", or whatever they typed.

It is **not translated**. It has no per-language column in the localization table and never will. That is
the whole point: when the player types "Madrid", the German build must also say "Madrid". Their words are
their words. Everything else the player reads — dialogue, choices, screen labels — goes through the
localization tables described in [Localization](/docs/beasty-visual-novel/production/localization/). The dictionary is the one
thing that does not.

## Creating an entry

Open `Tools > Beasty VN > Editor`, go to the **Dictionary** tab and press **+ Add Term**.

| Field | What it is |
|---|---|
| **Key** | The token name, written without brackets: `city`. You use it in text as `[city]`. |
| **Default value** | What the token reads as until something sets it. The same in every language. |
| **Player editable** | If on, the player may change this term at runtime from the game's customization screen. |

Leave **Player editable** off for a token you set from the story and the player never touches.

## Using it in a line

Write the key in square brackets, anywhere in the text of a **Dialogue** block:

```text
maya "So you're from [city]? I've never been."
```

The same works in any authored text that resolves tokens, including a character's display name.

## Setting it

Three ways, depending on who decides the value.

**You decide it.** Use the **Set dictionary** block (palette category **State**). Pick the token, type the
value. In the text script:

```text
dict city = "Madrid"
```

**The player decides it, in the story.** Use the **Ask -> dictionary** block (palette category **Input**).
It is a self-contained stop: it shows a question line — with an optional speaker, like any dialogue
line — and opens the input box at the same moment. It has a default used when the player leaves the box
blank, and a **required** flag that rejects a blank answer instead.

```text
ask dict city "Where are you from?"
```

**The player decides it, in the options.** Turn on **Player editable** and the token appears on the
game's customization screen, where they can set it whenever they like.

However it is set, the value is written into the shared variable store under the token's key, where it
shadows your default. So it is saved with the game, and it rewinds with everything else, and you did
nothing to make that happen. See [Variables and conditions](/docs/beasty-visual-novel/world/variables-and-conditions/#the-store).

## Dictionary token or String variable?

They live in the same store and a condition can read either. The difference is what you mean by them, and
the editor follows your intent: the dictionary pickers only offer you dictionary entries, and the variable
pickers only offer you variables.

Use a **dictionary token** when the value is **text the player reads back**, in their own words, that must
survive a language switch untranslated:

- the town they come from
- their pet's name
- the name they gave their ship

Use a **String variable** when the value is **game state you branch on**:

- `chapter` = `"two"`
- `faction` = `"rebels"` (an `Enum` variable, with its allowed values listed)
- anything a choice, a door or a quest is gated on

If you find yourself writing a condition on a dictionary token, you probably wanted a variable. If you
find yourself printing a variable in a line and worrying about the translator changing it, you wanted a
dictionary token.

## See also

- [Variables and conditions](/docs/beasty-visual-novel/world/variables-and-conditions/) — the store both of them live in
- [Localization](/docs/beasty-visual-novel/production/localization/) — what does get translated, and how
- [Blocks reference](/docs/beasty-visual-novel/authoring/blocks-reference/) — the Set dictionary and Ask blocks
- [.vnbeasty syntax](/docs/beasty-visual-novel/authoring/vnbeasty-syntax/) — `dict` and `ask dict` in the text script
