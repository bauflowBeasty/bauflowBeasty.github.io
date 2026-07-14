# Screenshots still to capture

The documentation is complete in text. Eleven places reference a screenshot that does not exist yet — the
pages read fine without them, but each one is a spot where a picture carries information the words cannot.

Capture each in Unity, save it with the **exact filename** below, and drop it in the folder shown. Nothing
else needs to change: the pages already link to these paths.

## beasty-visual-novel/images/

| Filename | What to capture |
|---|---|
| `vn-first-scene-hierarchy.png` | The Hierarchy right after running `Tools > Beasty VN > Setup > Create Scene`, showing BeastyManager, Stage, Canvas, Main Camera and EventSystem. |
| `vn-story-tab.png` | The Story tab as a whole: the Add blocks panel on one side, the graph canvas, and the node inspector. |
| `vn-story-tab-first-node.png` | The Story tab with the first node selected and four blocks in it (a Backdrop and three Dialogue blocks), as the first-scene walkthrough describes. |
| `vn-text-tab.png` | The Story tab switched to Text, showing the Graph / Text toggle and the script editor with a scene in it. |
| `vn-characters-cast.png` | The Characters tab, Cast sub-tab, with one character selected so the id, display name and expressions are visible. |
| `vn-dialogue-preview.png` | The Dialogue Preview window rendering a node with a backdrop and two characters on stage. |

## beasty-save-system/images/

| Filename | What to capture |
|---|---|
| `save-manager-window-empty.png` | The Save Manager window in a scene with no manager, showing the **Create Beasty Save Manager** button. |
| `save-manager-window.png` | The Save Manager window with all three sections populated: Manager, Saveables in Scene, and at least two Slots on Disk. |
| `save-saveable-inspector.png` | The Beasty Saveable inspector with the Save Id filled in and Transform ticked in Saved Components. |
| `save-button-onclick.png` | A uGUI Button's OnClick list wired to `BeastySaveManager.SaveAll` with `slot1` typed into the string field. |

## beasty-debug-logger/images/

| Filename | What to capture |
|---|---|
| `log-console-window.png` | The Beasty Console with several levels logged, the filter toggles showing their counts, and a row selected so the detail panel and its stack trace are visible. |

## Notes

- Crop to the window. Do not screenshot the whole editor.
- Use the light or the dark editor theme consistently across all eleven.
- If you decide a screenshot is not worth taking, delete the `![...](...)` line from the page rather than
  leaving a broken image.
