---
title: "Localization"
description: "Translate a game that is already written. This page covers the two translation tables, how the editor tells you which translations went out of date, importing"
---

Translate a game that is already written. This page covers the two translation tables, how the editor tells
you which translations went out of date, importing and exporting spreadsheets, and switching language while
the game runs.

## The two tables

There are exactly two `LocalizationTable` assets in play, and they never mix.

| Table | Where it lives | What it holds |
|---|---|---|
| The story table | On the `VNContext` (`localization`), so every DialogueScene that shares the context shares it | Dialogue lines, choice labels, talk-menu labels, item and quest text — everything the story references by key |
| The global UI table | `VNSettings.uiLocalization`, in `Resources` | Menus, HUD, buttons, confirmation dialogs — the interface |

Edit both in the **Localization** tab of the Beasty VN window (`Tools > Beasty VN > Editor`). The
**Story / UI (global)** toggle at the top switches between them. If a project has no table yet, the tab
offers **Create & Assign New Table**.

Nodes never store raw text. A dialogue line stores a KEY, and the table stores the text for that key in every
language. That is why translating is only ever "add a column".

## Languages, and which one is the source

A table's `languages` list is an ordered list of language codes, and **index 0 is the source language** — the
one you write the game in. Everything else is a translation of it.

Add a language with **+ Add Language** in the grid. A new language is appended at the end, never inserted at
the front, so index 0 stays the source. Removing a language takes its column of translations with it.

## Staleness: knowing which translations went out of date

This is the part that matters on a real production.

Every translated cell records a **fingerprint of the source text it was translated from**. When you later edit
the English line, the fingerprint no longer matches, and the cell that was translated from the old wording is
flagged. You do not have to remember what you changed; the table remembers for you.

Each cell is in one of four states:

| State | Meaning |
|---|---|
| `Source` | The source-language column (index 0). It is the reference, so it is never missing or stale. |
| `Missing` | No text has been entered for this language yet. |
| `Stale` | Translated once, but the source text has changed since. It needs review. |
| `Translated` | Translated, and up to date with the current source text. |

The grid shows the state of every cell as a badge, and the filter bar can narrow the grid to **Missing or
stale**, **Missing** or **Stale** only. The validator also reports the totals (see
[Validation and ids](/docs/beasty-visual-novel/production/validation-and-ids/)).

> **Note**
> A table written before fingerprints existed is backfilled once, on open: existing translations are assumed
> in sync rather than flooding you with false "stale" flags.

## Working in the grid

- **+ Add Language** — appends a language column.
- **+ Add Key** — adds a key by hand. You rarely need this: the block editor generates a key for every line
  you write.
- **Unused keys** — a toggle that lists keys the table holds but no dialogue line, choice or `[token]`
  references any more, with a **Remove N unused key(s)** sweep. Deleting story content leaves its keys behind;
  this is how you clear them.
- **Fill identical texts** — the translation-memory button. Lines whose source text is EXACTLY identical share
  their translations: an empty cell is filled from an already-translated twin. Translate a repeated line like
  "Yes" once and fill the rest. It never overwrites a cell that already has text.

## Import and export

The table exports and imports delimited text (CSV or TSV, RFC 4180: quotes double up, and any field
containing the delimiter, a quote or a newline is quoted). Punctuation inside dialogue is never a problem.

**The first column is `key`.** The columns after it are the languages, in order. Export also writes one
metadata column per non-source language, `#status.<code>`, holding `ok`, `stale`, `missing` or `source`, so a
translator working in a spreadsheet can see what needs attention. Columns whose header starts with `#` are
metadata and are ignored on import.

**Export** (the `Export` dropdown in the Localization toolbar) offers three scopes:

| Scope | What it writes |
|---|---|
| All keys | The whole table. |
| Section: `<graph>` | Only the keys referenced by the graph selected in the section dropdown. Use it to hand one chapter to one translator. |
| Missing or stale only (N) | Only the cells that need work. This is the one you will use most. |

Export uses the running machine's list separator (a comma in en-US, a semicolon in most European locales), so
the file opens straight into columns when you double-click it, and it is written as UTF-8 with a BOM, so
accents survive Excel.

**Import** (`Import CSV...`) auto-detects the delimiter from the header row — tab, comma or semicolon — and
also tolerates a leading `sep=` line from an older file. So a file exported anywhere, or a hand-made
comma/semicolon CSV, imports cleanly.

Two things import does deliberately:

- A file with **no header row is rejected** and nothing is written. Its first line is real data, and reading
  it as the header would silently eat it.
- Re-importing a full table **does not clear your stale flags**: a translation whose text did not change keeps
  its recorded fingerprint. Only a translation whose text actually changed is stamped fresh against the
  current source.

## Switching language while the game runs

There is one source of truth for the active language, shared by the story and the interface, and one "language
changed" event. Switch language in one place and everything re-resolves at once: the line currently on screen
is re-rendered, the choices on screen are re-rendered, and an open talk menu is re-rendered. The player can
change language in the middle of a line and see it change under them.

When a key has no text in the active language, the source-language text is shown instead — a blank cell falls
back exactly like a missing column, so an untranslated line never renders as a raw key.

### Which language the game starts in

At boot, in this order:

1. **The player's saved choice.** Once the player has picked a language, it always wins.
2. **The operating-system language**, but only if `autoDetectSystemLanguage` is on in
   [VN Settings](/docs/beasty-visual-novel/production/vn-settings/) AND the UI table actually has that language — so the game never starts in a
   language you have not translated.
3. **The default language** (`defaultLanguage` in VN Settings).

The active language is also stored in every save, and restored with it.

## The authoring language is not the game's language

The **Lang** selector in the Story tab picks which language column you are TYPING into while you author. It is
an editor convenience — a translator can work directly in the node inspector instead of a spreadsheet — and it
has no effect on the language the game runs in. Setting Lang to `fr` does not make the game start in French;
`defaultLanguage` does.

## See also

- [VN settings](/docs/beasty-visual-novel/production/vn-settings/) — the default language, OS auto-detect, and where the UI table is assigned.
- [Validation and ids](/docs/beasty-visual-novel/production/validation-and-ids/) — the validator reports keys with no source text, and the
  missing/stale totals.
- [Dictionary](/docs/beasty-visual-novel/world/dictionary/) — player-editable `[token]` text, which is a different mechanism.
- [Large projects](/docs/beasty-visual-novel/production/large-projects/) — keeping a big table manageable.
