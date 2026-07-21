---
title: "Versioning and migrations"
description: "You shipped. Players have saves. Now you need to change your data class. This page is about doing that without breaking the files those players already have o"
---

You shipped. Players have saves. Now you need to change your data class. This page is about doing that
without breaking the files those players already have on disk.

## The situation

Your save class looked like this in version 1.0 of your game:

```csharp
public sealed class PlayerData
{
    public string name;
    public float volume;
}
```

In 1.1 you rename `name` to `displayName`, and you split the single `volume` into separate music and
effects volumes:

```csharp
public sealed class PlayerData
{
    public string displayName;
    public float musicVolume;
    public float sfxVolume;
}
```

Every save on every player's disk still holds `name` and `volume`. Loading one now would lose the name and
both volumes. A migration is how you carry them across.

## DataVersion

`BeastySaveSettings.DataVersion` is an integer you own. It defaults to `1`. It is written into every save
file, and it is read back on every load. The system compares the version **in the file** with the version
**in your settings**:

| The file says | What happens |
|---|---|
| The same version | The save loads as-is. |
| A **lower** version | Registered migrations run, in order, until the file reaches your version. Then it loads. |
| A **higher** version | The load is refused with the error `VersionTooNew`. |

That last row is a deliberate refusal, and it is worth understanding. A save with a higher version was
written by a **newer build of your game** than the one running — a player rolling back a patch, or a beta
save opened by the release build. That file may contain fields this build has never heard of and shapes it
cannot interpret. Rather than half-read it and produce a subtly broken game, the system refuses it and
tells you why:

```text
Save data version 3 is newer than the game's version 2.
```

Show that to the player as "This save was made with a newer version of the game." There is nothing to
repair; the backup will not help.

## Registering a migration

A migration is a function that takes the save's raw data and returns the same data in a newer shape. It
runs **before** anything is mapped onto your classes, so it works on JSON, not on `PlayerData`.

```csharp
static void RegisterMigration(int fromVersion, int toVersion, Func<JsonNode, JsonNode> migrate)
```

`JsonNode` is the package's own JSON node type — see [The JSON engine](/docs/beasty-save-system/reference/json-engine/) for
the full API. For a migration you need very little of it: read a member, write a member, remove a member.

Here is the change described above, as a migration from data version 1 to 2:

```csharp
using System;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore.Json;

public static class SaveMigrations
{
    private static JsonNode V1ToV2(JsonNode data)
    {
        // Defensive: a migration receives whatever is in the file. Do not assume the shape.
        if (data == null || data.Kind != JsonNodeKind.Object)
            return data;

        // Rename: "name" -> "displayName".
        if (data.TryGetMember("name", out JsonNode name))
        {
            data["displayName"] = name;
            data.Remove("name");
        }

        // Split: one "volume" -> "musicVolume" + "sfxVolume".
        double volume = 1.0;
        if (data.TryGetMember("volume", out JsonNode oldVolume) && !oldVolume.IsNull)
            volume = oldVolume.AsDouble();

        data["musicVolume"] = JsonNode.Of(volume);
        data["sfxVolume"]   = JsonNode.Of(volume);
        data.Remove("volume");

        return data;
    }
}
```

Set `DataVersion = 2` in your settings, register the step, and every 1.0 save now opens in 1.1 with its
name and its volumes intact.

Points to copy from that example:

- **Guard the shape.** The node comes from a file, and a file can be anything. Check `Kind` before you
  index into it. Reading a member of the wrong kind throws, and a migration that throws fails the load
  with `MigrationFailed`.
- **Return the node.** You may mutate the node you were given and return it, as above, or build a new one
  and return that. Returning `null` leaves the data unchanged rather than wiping it.
- **Keep it pure.** A migration should transform data and nothing else. Do not touch the scene, load
  assets, or read your game's current state from it. It runs during a load, before your objects exist.

## Migrations chain

Register one step per version bump. The system walks them in order.

```csharp
BeastySave.RegisterMigration(1, 2, V1ToV2);
BeastySave.RegisterMigration(2, 3, V2ToV3);
```

With `DataVersion = 3`, a version-1 save runs `V1ToV2` and then `V2ToV3`. You never write a 1-to-3 step,
and you never have to think about every historical combination — you only ever write the step from the
version you just left to the version you just created.

If a step is missing from the chain, the load fails with `MigrationFailed`:

```text
No migration registered from data version 2.
```

`toVersion` must be greater than `fromVersion`. Passing anything else throws immediately — a registration
mistake is your bug, not the player's file, so it surfaces at startup rather than being reported as a load
failure months later.

## The gotcha: migrations do not survive Play Mode

> **Warning**
> Registered migrations are **wiped every time you enter Play Mode**. So are custom converters registered
> with `RegisterConverter`. If you register your migrations from a menu item, an `Awake`, or a one-off
> editor script, they will be gone the next time you press Play, and your old saves will suddenly fail
> with `MigrationFailed` — for reasons that will look like black magic.
>
> Register them from a `[RuntimeInitializeOnLoadMethod]` so they are re-registered on every Play, in the
> editor and in a build alike.

```csharp
using Beasty_SaveSystem;
using Beasty_SaveSystemCore.Json;
using UnityEngine;

public static class SaveMigrations
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
    private static void Register()
    {
        BeastySave.RegisterMigration(1, 2, V1ToV2);
        BeastySave.RegisterMigration(2, 3, V2ToV3);
    }

    private static JsonNode V1ToV2(JsonNode data) { /* … */ return data; }
    private static JsonNode V2ToV3(JsonNode data) { /* … */ return data; }
}
```

This one static class is the whole setup. It runs before your first scene, in every build, on every Play,
and it costs nothing when there is nothing to migrate.

Converter **modules**, registered with `RegisterModule`, are not affected — they persist. Only
`RegisterMigration` and `RegisterConverter` need re-registering. See
[Custom converters](/docs/beasty-save-system/advanced/custom-converters/).

## Migrating a scene save

Everything above applies to `BeastySave.Save`, where the data node is your own class. A scene save written
by `SaveAll` has a fixed shape instead — a document of saveable ids, each holding component types and
their data. A migration on that data receives that document, not your class. It is doable, but you are
editing a structure the package owns; read [The save file format](/docs/beasty-save-system/reference/save-file-format/) first
so you know exactly what you are reshaping.

## Practical advice

**Bump `DataVersion` in the same commit as the change to your data class.** The version and the shape it
describes are one thing. Splitting them across two commits is how you end up with saves whose version
number lies about their contents, and no migration can fix that.

**Write the migration in that same commit too**, while you still remember what the old field meant.

**Keep every migration forever.** A player can install your game today, play the 1.0 build they bought on
a disc, and open that save in the 2.4 build after an update. The 1-to-2 step still has to be there. The
chain is only as long as your game's history, and each step is a few lines; deleting old ones saves you
nothing and eventually costs a player their save.

**Test the chain.** Keep a save file from each shipped version in your project and load them all in a test.
The chain is exactly the kind of code that is never exercised until it is exercised by a player.

**You can tell when a migration ran.** With logging on (the default in the editor — see
[Logging](/docs/beasty-save-system/guides/logging/)), a load that migrated a file says so:

```
[BeastySave] Migrated 'slot1' data v1 → v2
```

Code gets the same fact: `LoadResult.MigratedFrom` is the data version the file was migrated **from**,
or 0 when no migration ran. Use it to tell the player the truth — "your save was updated from an older
version of the game" — instead of migrating silently.

## See also

- [Settings](/docs/beasty-save-system/guides/settings/) — the `DataVersion` field
- [Strict vs tolerant loading](/docs/beasty-save-system/guides/strict-vs-tolerant/) — the other way to survive a changed class, and why it loses data
- [The JSON engine](/docs/beasty-save-system/reference/json-engine/) — everything `JsonNode` can do
- [The save file format](/docs/beasty-save-system/reference/save-file-format/) — where `dataVersion` lives in the file
- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/) — `VersionTooNew` and `MigrationFailed`
- [Custom converters](/docs/beasty-save-system/advanced/custom-converters/) — the same Play Mode reset, for converters
- [Logging](/docs/beasty-save-system/guides/logging/) — the migration line above, and everything else the save system prints
