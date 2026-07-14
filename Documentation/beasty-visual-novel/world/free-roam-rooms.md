# Free-roam rooms

The world between conversations: a map of rooms the player can walk through, click around in, and leave for a
scene. This page is for writers and designers.

Free roam is optional. A pure kinetic novel never touches it. But the moment you want the player to choose
where to go and who to talk to, this is the mode you enter.

## The map graph

Everything lives on one asset, the **FreeRoam Map Graph**
(`Create > Beasty VN > FreeRoam > FreeRoam Map Graph`). It holds:

- the **rooms**,
- the **entry room** — where the player lands when free roam starts,
- the **routines** — see [Character routines](character-routines.md).

You edit it in the **FreeRoam** tab of the Beasty VN window (`Tools > Beasty VN > Editor`), or by selecting
the asset and clicking **Open in Beasty VN (FreeRoam tab)**.

> **Note**
> **The map view is a diagram, not an editor for room content.** It shows rooms as boxes and the doors between
> them as lines. You can create a room, set the entry room, delete a room. Everything else — the name, the
> background, the objects, the doors — you author by **drilling into the room**: double-click it. The lines
> between rooms are read-only; they picture the doors that exist inside the rooms.

## What a room is

| Field | What it is |
|---|---|
| **Id** | The stable id. Doors and routines refer to the room by it. |
| **Display Name** | What you call it. Kept identical to the room prefab's file name. |
| **Background (default)** | The sprite shown when no conditional background applies. |
| **Conditional backgrounds** | An ordered list of condition-plus-sprite cases. See below. |
| **Room Prefab (visual)** | The prefab that owns the art and the positions. |
| **Buttons** | The objects and doors in the room. See [Interactables and doors](interactables-and-doors.md). |

The split to keep in mind: **the prefab owns what things look like and where they are; the map graph owns what
they do.** You place a lamp in the prefab with Unity's own tools, and you say "clicking the lamp plays this
scene" in the room's editor. The two are linked by name.

## Creating a room and its prefab together

1. In the **FreeRoam** tab, **Map** mode, right-click the empty canvas and choose **Create Room**.
2. Beasty immediately asks where to save the room's **prefab**, and creates it: a `FreeRoamRoom` root with a
   `Background` child ready to carry the room's sprite.
3. The file name you pick becomes the room's **Display Name**. From then on the two names stay in sync —
   rename the room and the prefab file follows; rename the prefab file and the room follows.

If you cancel the save dialog the room is created without a prefab; you can assign one later in the room's
settings. A room with no prefab can still be entered, but it cannot have character spots.

The first room you create becomes the **entry room** automatically. To change it, select a room in the map and
tick **Entry Room** (or right-click it and choose **Set as Entry Room**).

The toolbar's **Fix backgrounds** button retrofits every room prefab in the graph: it makes sure each one has a
`FreeRoamRoom` component and a `Background` child carrying the room's sprite. Use it on prefabs you built by
hand.

## Conditional backgrounds

A room does not need one look. Give it an **ordered list of cases**: each case is a condition and a sprite.
**The first case whose condition passes wins; if none passes, the default background is used.** So a room can
change with the time of day, the season, whether it is raining, whether a character is standing in it, or any
variable in your game.

Because an empty condition always passes, a case with no condition swallows everything below it. Order the
list from the most specific case to the most general.

The drill-in editor presents this as **Background by time & presence**, grouped into an **Any time** section
plus one section per daypart, so the common case reads the way you think about it:

- **Background** — the sprite for this case.
- **Characters present** — a tick list; the case only applies while those characters are in the room.
- **Weekdays (any = all)** — a tick list; leave it empty for every day.
- **Advanced condition** — the raw condition, for anything the tick lists cannot express.

Clicking a daypart header in the room's timeline focuses the editor on that daypart alone, which is the fast
way to author "the kitchen at night".

Under the hood these are the same ordered condition-plus-sprite cases; the sections are a convenience, not a
different model.

## The room prefab

The prefab is a normal Unity prefab. Open it and build the room the way you would build any 2D scene.

| Component | What it marks |
|---|---|
| `FreeRoamRoom` | The prefab root. Collects the background renderer, the interactables and the spots. |
| `FreeRoamInteractable` | One clickable object. Its **id is the GameObject's name**, which is how the map graph finds its logic. |
| `FreeRoamCharacterSpot` | A place where a character stands. |

Because ids are names, renaming a GameObject in the prefab renames the object the room's logic is attached to.
Rename objects from the room editor, not from the Hierarchy, and the two stay in step.

### Character spots

A **spot** is a child object with a `FreeRoamCharacterSpot` component. It marks where someone stands.

1. Open the room prefab.
2. Create a child GameObject and place it — position and scale — where the character should be.
3. Add the `FreeRoamCharacterSpot` component.
4. The spot's id is the GameObject's name. Set **Id Override** if you want an id that survives a rename.

**The spot's position and scale are prefab decisions, not routine data.** The routine says which room a
character is in; the prefab says where in the room she stands. That separation is what lets you re-lay-out a
room without touching a single schedule.

When several characters are in one room, each takes **the next free spot**: they never overlap. If the room
runs out of spots, the next character is drawn at the room's centre — so give a room at least as many spots as
it can ever hold at once. See [Character routines](character-routines.md).

## Entering a room from the story, and leaving again

The story and the map are two app modes; you cross between them with **Flow blocks** (palette category
**Flow**), which are also offered as targets on any choice.

| Block | What it does |
|---|---|
| **Go to FreeRoam** | Leaves the novel and drops the player into a room you name. |
| **Return to room** | Goes back to the room the player came from. |
| **Choose room** | Lets the player pick a room from a list. |

A **Go to FreeRoam** block takes an optional scenario (the map graph) and a room id; leave the room empty to
land in the map's entry room. In the text script it is one line:

```text
freeroam town/square
freeroam previous
freeroam choose town
```

Coming back the other way, from a room into a scene, is what an object's **Enter VN** action does — and when
that scene ends, the player is returned to the room they left. A scene entered from a room is a visit, not a
one-way door.

> **Note**
> A scene entered from a room keeps the room's background behind it unless the scene sets a backdrop of its
> own. That is deliberate: a short exchange with a shopkeeper should look like it happens in the shop.

Flow blocks and flow nodes are covered in full in [Transitions](../authoring/transitions.md).

## Music per room

A room prefab's `FreeRoamRoom` can carry a music override, so a room can have its own track without any
scripting. The rest of the music model — the queue per app mode — is in
[Audio and music](../production/audio-and-music.md).

## See also

- [Interactables and doors](interactables-and-doors.md) — everything you can click in a room.
- [Character routines](character-routines.md) — who is in the room, and when.
- [Transitions](../authoring/transitions.md) — leaving the novel and coming back.
- [Game time](game-time.md) — the variables a conditional background usually reads.
- [Variables and conditions](variables-and-conditions.md) — how conditions are built.
