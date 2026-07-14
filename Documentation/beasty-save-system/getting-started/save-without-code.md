# Save without writing code

This page takes you from an empty scene to a working save and load without a single line of C#. You will
add two components, tick some boxes, and wire two buttons. Follow it in order and it works.

Ten minutes. Nothing here is throwaway — this is the real way to do it, not a toy demo.

## What you are about to build

A cube you can move around. A **Save** button that writes its position to a file on disk. A **Load** button
that puts it back where it was, even after you stop the game and start it again.

Once that works, everything else in the package is a variation on it.

## 1. Make a scene with something in it

Open a new scene. Add a cube: `GameObject > 3D Object > Cube`. Move it somewhere you will recognise.

That cube is the thing whose state you want to keep. In your real game it will be the player, a door, a
chest — but the steps are identical.

## 2. Add the Save Manager

The Save Manager is the piece that does the actual saving. There is one per scene.

Open `Tools > Beasty Save System > Save Manager`. The window opens with a **Manager** section at the top.
Because your scene has no manager yet, it shows a message and a button: **Create Beasty Save Manager**.

Click it. A GameObject called `Beasty Save Manager` appears in your scene.

![The Save Manager window with the Create Beasty Save Manager button](../images/save-manager-window-empty.png)

> **Note**
> You can also do this by hand: create an empty GameObject and use
> `Add Component > Beasty > Beasty Save Manager`. Same result. The window is faster.

Select the new object and look at its inspector. It has one field, **Settings**, and inside it are the
options for where and how saves are written — folder, extension, encryption, backup, strict loading,
data version. Leave every one of them alone for now. The defaults are the right defaults. When you are
curious, [settings.md](../guides/settings.md) explains all of them.

## 3. Make the cube saveable

Select the cube. Use `Add Component > Beasty > Beasty Saveable`.

The component appears with two things in it:

- **Save Id** — a generated string of characters, with a **New** button next to it. This is how the save
  file recognises this particular object. Do not touch it. (It matters later; see step 9.)
- **Saved Components** — a checklist of every component on the cube. Nothing is ticked yet.

Tick **Transform**.

![The Beasty Saveable inspector with the Transform component ticked](../images/save-saveable-inspector.png)

That is the whole configuration. You have told the system: when a save happens, write down this object's
Transform — its position, its rotation, its scale.

Notice the label next to each component in the checklist. It says `core`, or `ugui`, or `animation`. That
is which layer knows how to save it. If a component shows a warning instead, the system has no way to save
that type and the save would fail; untick it, and read
[converter-modules.md](../reference/converter-modules.md) to find out why.

> **Note**
> There is a faster way to do this for many objects at once. The Save Manager window has a drop zone —
> "Drag GameObjects here to make them saveable". Drag objects onto it and each gets a `BeastySaveable`
> with a fresh id. You still have to tick the components you want on each one.

## 4. Add a Save button

Create a uGUI button: `GameObject > UI > Button - TextMeshPro`. (Unity will add a Canvas and an
EventSystem for you if the scene has none. Let it.)

Rename the button's text to `Save`.

## 5. Wire the Save button

Select the button and find the **On Click ()** list at the bottom of its inspector.

1. Click the **+** to add an entry.
2. Drag the **Beasty Save Manager** object from the Hierarchy into the object field that says `None
   (Object)`.
3. Open the function dropdown. Choose **BeastySaveManager > SaveAll (string)**.
4. A small text field appears underneath. Type a slot name into it: `slot1`.

![A uGUI Button OnClick wired to BeastySaveManager.SaveAll with the slot name slot1](../images/save-button-onclick.png)

That is the whole wiring. `SaveAll` gathers every saveable object in the scene, writes the components you
ticked, and puts them all in a file called `slot1`.

The slot name is just the file name. `slot1`, `autosave`, `quicksave` — whatever you type. A few names are
rejected (anything with a slash, anything with `..`, and the old Windows device names like `CON` or
`PRN`); the reasons are in [settings.md](../guides/settings.md).

## 6. Add a Load button

Do steps 4 and 5 again, with two changes: call the button `Load`, and pick **BeastySaveManager > LoadAll
(string)** in the dropdown. Type the same slot name, `slot1`.

The two slot names must match. `SaveAll("slot1")` writes the file; `LoadAll("slot1")` reads it back. If you
type `slot1` on one button and `Slot1` on the other, nothing will load and you will lose twenty minutes
wondering why.

## 7. Try it

Press **Play**.

1. Move the cube in the Scene view while the game is running. Drag it somewhere obviously different.
2. Click **Save**.
3. Move the cube again, somewhere else entirely.
4. Click **Load**. The cube snaps back to where it was when you saved.

Now the real test — the one that proves a file was written:

5. Press **Play** again to stop. The cube returns to its editor position.
6. Press **Play** again to start.
7. Click **Load**. The cube goes back to where you saved it.

That state survived a stop and a restart because it is on disk, not in memory. You have a save system.

## 8. Where the file actually is

Go back to the Save Manager window (`Tools > Beasty Save System > Save Manager`) and scroll to **Slots on
Disk**. Click **Refresh**. Your slot is listed. Click **Open Folder** and your file browser opens right on
it.

The file is `slot1.save`. Its full path is `<persistentDataPath>/Saves/slot1.save`, where
`persistentDataPath` is Unity's per-user writable folder — on Windows that is under
`AppData\LocalLow\<your company>\<your product>`. The `Saves` folder and the `save` extension are the
`Folder` and `Extension` settings on the manager; change them and the file moves.

Open `slot1.save` in any text editor. It is plain, indented JSON, and you can read it:

```json
{
  "beasty": 2,
  "dataVersion": 1,
  "type": "Beasty.SaveGroup",
  "checksum": "…",
  "data": {
    "saveables": {
      "…the cube's save id…": {
        "UnityEngine.Transform": { "module": "core", "data": { } }
      }
    }
  }
}
```

Being able to read your own save file is a feature, not an oversight. When something does not come back the
way you expected, open the file and look. The answer is usually right there.

If you would rather players could not read it, turn on **Encrypted** in the manager's settings — but read
[encryption.md](../guides/encryption.md) first, because it is honest about what encryption here does and
does not buy you.

Save again from the game and you will notice a second file appear: `slot1.save.bak`. That is the previous
save, kept automatically. If a save file ever goes bad, the **Restore Backup** button in the Save Manager
window puts the old one back. See [backups-and-corruption.md](../guides/backups-and-corruption.md).

## 9. The two things that will bite you

Everything above works. These two are the places where people lose an afternoon, so read them now rather
than later.

### An object created while the game runs needs an id you choose

The Save Id on your cube was generated once, in the editor, and it is stored in the scene. It is the same
id every time you play. That is why the save can find the cube again.

An object you spawn at runtime — an enemy, a dropped item, a bullet — has no scene to remember it. Every
copy you `Instantiate` gets a **brand new id, every single time**. So its state is written into the save
file under an id that will never exist again, and it never comes back.

The fix is to give the spawned object an id you control, using
`BeastySaveManager.Register(gameObject, "a.stable.id", components)`. That is one line of C#, and if you do
not write C# it is the one line you will need to ask someone for.

The full explanation, and how to pick ids that stay stable, is in
[scene-state.md](../guides/scene-state.md). Read it before you build anything that spawns things.

### A reference to a sprite or to another object is not saved

Beasty Save System does not save references to Unity objects. If your script has a field pointing at a
`Sprite`, a `GameObject`, an `AudioClip` or another component, that field is skipped when saving and left
alone when loading.

This is deliberate, and it is good news more often than it is bad news: **the wiring you did in the scene
survives**. Loading a save does not blank out your references, break your prefab links or lose the sprite
you dragged in. Everything you set up in the inspector is still there after a load.

What it does mean is that if the *identity* of the sprite is part of your game state — the player picked a
red hat, and red-hat-ness must persist — you cannot save the `Sprite` itself. You save something that
identifies it (a name, an id, an index) and pick the sprite back up from that when you load.

The full rules, and what to do instead, are in [what-gets-saved.md](../guides/what-gets-saved.md). That is
the most important page in this package. Read it next.

## See also

- [what-gets-saved.md](../guides/what-gets-saved.md) — what round-trips and what does not
- [scene-state.md](../guides/scene-state.md) — ids, spawned objects, and the manager in depth
- [save-manager-window.md](../guides/save-manager-window.md) — every button in the editor window
- [settings.md](../guides/settings.md) — folder, extension, encryption, backup, strict, version
- [slots-and-metadata.md](../guides/slots-and-metadata.md) — turning slots into a real save-slot screen
- [save-with-code.md](save-with-code.md) — the same system, from a script
