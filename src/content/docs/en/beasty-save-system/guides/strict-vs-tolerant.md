---
title: "Strict vs tolerant loading"
description: "There are two ways to load a save whose contents no longer quite match your code. Strict refuses the whole file. Tolerant loads what it can and tells you what"
---

There are two ways to load a save whose contents no longer quite match your code. Strict refuses the whole
file. Tolerant loads what it can and tells you what it skipped. This page explains both, and when to pick
which.

One field controls it: `Strict` in [BeastySaveSettings](/docs/beasty-save-system/guides/settings/). It defaults to `true`.

## The short version

| | `Strict = true` (default) | `Strict = false` |
|---|---|---|
| One bad field | The whole load fails | That field is skipped |
| What gets applied | Nothing | Everything else |
| Where you find out | `LoadResult.Error` is `FieldMapFailed` | `LoadResult.Warnings` |
| The world after a bad load | Exactly as it was | Partly loaded |

## Strict: all or nothing

Strict is the default because it is the mode that cannot leave your game in a state you never wrote code
for. If any single field in the save cannot be mapped onto your class, the load fails and **nothing is
applied**.

This is a real guarantee, not a best effort. Two mechanisms back it:

- When mapping an object, every field is staged first. Values are only assigned once all of them have been
  read successfully. A failure halfway through does not leave the first half assigned.
- When loading a scene (`LoadAll`), the whole file is validated against the scene **before anything is
  mutated**. If a component still fails while being applied, the components already applied are rolled
  back to the state they were in.

So a strict load that fails leaves the world exactly as it was before you called it. The player sees an
error message and keeps playing. They do not see a half-loaded save with the right inventory and the wrong
position.

The failure comes back as the error `FieldMapFailed`, with a message naming the field:

```text
Field 'PlayerData.stamina' failed to load: expected Number, found String.
```

## Tolerant: skip the bad field, keep the rest

Set `Strict = false` and the same file loads. The offending field is skipped, its previous value is left
alone, and the load succeeds with a warning:

```text
Field 'stamina' skipped: expected Number, found String.
```

For a scene load, tolerant also skips entries whose saveable id is no longer in the scene, and entries
whose component is gone, each with a warning, and keeps going.

There is no rollback in tolerant mode. That is the point: it applies what it can.

## Reading the warnings

A tolerant load that succeeds can still have things to say. Read `Warnings` — it is never null, so you can
iterate it without a check.

![The warnings a tolerant load reports for the fields it skipped](/docs-images/beasty-save-system/save-tolerant-warnings.png)

```csharp
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;
using UnityEngine;

var settings = new BeastySaveSettings { Strict = false };

LoadResult<PlayerData> result = BeastySave.Load<PlayerData>("slot1", settings);

if (!result.Success)
{
    Debug.LogError($"Load failed: {result.Error} — {result.Message}");
    return;
}

foreach (string warning in result.Warnings)
    Debug.LogWarning($"Save was loaded, but: {warning}");

Apply(result.Value);
```

The warnings are also written to the log for you, so you will see them during development without adding
any code. What you cannot do is ignore them and assume the load was clean — a tolerant load that skipped
five fields still reports `Success = true`. If it matters, check `result.Warnings.Count`.

## When to use tolerant

Use it when an old save must open against new code, and a missing field is acceptable.

The usual case is a rename. You shipped a demo, players have saves, and you have since renamed
`PlayerData.hp` to `PlayerData.health`. Under strict, those saves fail. Under tolerant, they load: `hp` in
the file matches nothing and is skipped, `health` in your class keeps its default, and the rest of the save
comes through. The player loses one value instead of the whole file.

Note what tolerant is not. It is a way of surviving a mismatch, not a way of fixing it — the value in the
old field is thrown away, not moved. When you actually want to carry the old value across, you want a
migration, which rewrites the save's contents before mapping starts:
[Versioning and migrations](/docs/beasty-save-system/guides/versioning-and-migrations/). Migrations preserve data. Tolerant loading
merely tolerates its loss.

A reasonable policy for a shipped game: keep `Strict = true`, and reach for tolerant only when a specific
update needs it.

## The caveat you need to know

> **Warning**
> Tolerant loading only applies when the root object you load is a **class**. If you load a struct, a
> string, a collection (an array, a `List`, a `Dictionary`) or a primitive, the mapping is strict no
> matter what `Strict` is set to. A bad field inside those still fails the whole load.

In practice this is rarely a problem, because a save root is almost always a class — a `PlayerData`, a
`GameState`. But if you save a `List<InventoryEntry>` directly at the root, `Strict = false` will not
protect you from a renamed field inside `InventoryEntry`. Wrap it in a class if you need the tolerance.

Two more behaviours, in both modes:

- A member that is **missing or null** in the file falls back silently to whatever the field already
  holds. That is not a warning in either mode. Adding a new field to your data class does not break old
  saves; the new field simply keeps its default.
- A saveable that is in the scene but has no data in the file is left untouched, with a warning. It is not
  reset.

Only a member that is **present with the wrong type** triggers the strict/tolerant difference.

## See also

- [Settings](/docs/beasty-save-system/guides/settings/) — the `Strict` field
- [Versioning and migrations](/docs/beasty-save-system/guides/versioning-and-migrations/) — how to keep an old value instead of skipping it
- [What gets saved](/docs/beasty-save-system/guides/what-gets-saved/) — which fields are written in the first place
- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/) — `FieldMapFailed` and the rest
- [Scene state](/docs/beasty-save-system/guides/scene-state/) — `LoadAll`, saveable ids and the scene-wide rollback
