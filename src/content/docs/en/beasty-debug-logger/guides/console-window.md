---
title: "The Beasty Console window"
description: "The window that reads your logs back to you: it classifies every entry by level, gives each level a filter toggle and a counter, and takes you from a stack-tr"
---

The window that reads your logs back to you: it classifies every entry by level, gives each level a filter
toggle and a counter, and takes you from a stack-trace line to the file in your IDE.

Open it at `Tools > Beasty VN > Diagnostics > Console`. It is an editor window; it does not ship in a
build.

![The Beasty Console with the level filters and the detail panel](/docs-images/beasty-debug-logger/log-console-window.png)

## The toolbar

| Control | What it does |
|---|---|
| Clear | Empties the list and zeroes every counter. |
| Collapse | Groups identical messages into one row, showing `(Nx)`. |
| Clear on Play | Clears the list when you enter Play Mode. |
| Error Pause | Pauses the editor on the first error or exception. |
| Search field | Case-insensitive substring filter over the message text. |

Error Pause reacts to Unity's severity, which means errors and exceptions only. A `LogCaution` will not
pause the editor; see [Logging](/docs/beasty-debug-logger/guides/logging/).

## The level filters

Under the toolbar sits one toggle per level, each showing its live count. Click a toggle to hide that
level from the list; click it again to bring it back. Hover it for a one-line description of what the
level is for.

There is a toggle for every level the API can produce, plus two for everything else: Plain and Unknown.

## The list

Each row is `glyph  [HH:mm:ss]  message`, coloured by level. With Collapse on, a repeated message shows
its repeat count at the end of the row.

Click a row to select it. The detail panel below shows the full message and the stack trace, both as
selectable text, so you can drag across them and copy.

## Opening the file

Stack-trace lines that point at a real file are drawn as links. Click one to open that file at that line
in your IDE.

Double-clicking the row does the same thing, but chooses the frame for you: it opens the first frame that
is your own code, skipping the logger's own wrapper. That is usually the line you wanted.

Frames from compiled assemblies have no real file path and are not links.

## The splitter

The bar between the list and the detail panel is draggable. Drag it up to read a long stack trace, down to
see more rows.

## Behaviours worth knowing

These are not bugs. They are how the window works, and knowing them now will save you a support ticket
later.

**It shows everything, not only Beasty logs.** The window listens to Unity's log stream, so it receives
every log in the project: your own `Debug.Log` calls, and messages from third-party packages. An entry it
cannot classify is filed as Plain (a plain log) or Unknown. If you want everything classified, log through
[the API](/docs/beasty-debug-logger/guides/logging/).

**Collapse is not retroactive.** Turning Collapse on groups messages that arrive *from then on*. Entries
already in the list are left as they are. Clear the list first if you want a clean collapsed view.

**The counters ignore the search field.** The number on each filter toggle counts every entry of that level
that has arrived, whatever you typed in the search box and whatever is currently hidden. Only Clear resets
them.

**The list does not survive a recompile.** A script change triggers a domain reload, and the reload drops
the list. Logs from before the recompile are gone. This is also why the list is empty when you re-open the
window after a compile.

**The display strips anything between `<` and `>`.** The window strips rich-text tags so that colour
markup does not appear as literal text on screen. It strips them with a blunt rule, so a message that
legitimately contains angle brackets loses that fragment in the display: log
`Deprecated call: GetComponent<Rigidbody2D>` and the row reads `Deprecated call: GetComponent`. The
message reached Unity intact — only the display is affected. If the brackets matter, write the message
without them.

## See also

- [Logging](/docs/beasty-debug-logger/guides/logging/)
- [FAQ](/docs/beasty-debug-logger/faq/)
