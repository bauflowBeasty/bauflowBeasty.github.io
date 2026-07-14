# Custom converters

A converter teaches the save system how to turn one family of types into JSON and back. Write one when the
default path cannot reach your state, or when you want to replace what a built-in converter stores. This
page is for programmers.

The default path serializes a component by its Unity-serializable fields: `public` and `[SerializeField]`
fields, nothing else. If your state lives behind a property, in a private field Unity does not serialize,
or in a runtime structure that has to be rebuilt in a particular order, that state never reaches the file.
A converter is the answer. See [What gets saved](../guides/what-gets-saved.md) for the full list of what
the default path covers.

## The interface

`Beasty_SaveSystemCore.IBeastyConverter` has three members.

```csharp
bool CanConvert(Type type);
JsonNode Write(object value, JsonMapper mapper);
object Read(JsonNode node, Type type, object existing, JsonMapper mapper);
```

| Member | What it does |
|---|---|
| `CanConvert(Type type)` | True when this converter handles `type`. Called once per type and cached. |
| `Write(object value, JsonMapper mapper)` | Returns the `JsonNode` that represents `value`. Use `mapper.ToNode(...)` for anything you do not want to hand-write. |
| `Read(JsonNode node, Type type, object existing, JsonMapper mapper)` | Rebuilds the value from `node` and returns it. `existing` is the instance already in the scene, or `null`. |

`CanConvert` decides the whole family. `type == typeof(Furnace)` handles one type;
`typeof(MonoBehaviour).IsAssignableFrom(type)` handles every MonoBehaviour — which is exactly what the
built-in `core` converter does.

## The contract

Two rules, and they are not negotiable.

**Component converters populate the existing instance. They never construct one.** A scene component
cannot be created from data: it belongs to a GameObject, it has references the scene wired, and the loader
is restoring it in place. So `Read` casts `existing`, mutates it, and returns it. If `existing` is `null`,
throw a `JsonException` with a message that says so — the pipeline turns that into a typed
`FieldMapFailed` result instead of an exception in the player's face.

**Value-type converters build a new value and ignore `existing`.** A `Vector3` has nothing to populate.
Read the members, construct, return.

Third rule, for when you touch fields: **honour `mapper.StrictPopulate` and `mapper.FieldSkipReporter`.**
They carry the tolerance the caller asked for into your converter. If you delegate field restoration to
the mapper, pass them straight through:

```csharp
mapper.PopulateFields(existing, node, mapper.StrictPopulate, mapper.FieldSkipReporter);
```

Pinning `strict: true` there would mean a tolerant load throws away the whole component on one bad field.
See [Strict vs tolerant loading](../guides/strict-vs-tolerant.md).

## A worked example

This component is a realistic case the default path cannot handle. Its contents live in a private field
Unity does not serialize, and its temperature is a property — and properties are never saved.

```csharp
using System.Collections.Generic;
using UnityEngine;

public sealed class Furnace : MonoBehaviour
{
    // Private, no [SerializeField]: Unity does not serialize it, so neither does the default path.
    private readonly Dictionary<string, int> _fuel = new Dictionary<string, int>();

    // A property. Only fields are saved.
    public float Temperature { get; private set; }

    public IReadOnlyDictionary<string, int> Fuel => _fuel;

    public void SetTemperature(float value) => Temperature = value;
    public void SetFuel(string kind, int amount) => _fuel[kind] = amount;
    public void ClearFuel() => _fuel.Clear();
}
```

Tick `Furnace` in the `BeastySaveable` inspector today and the save file gets an empty object. Here is the
converter that fixes it.

```csharp
using System;
using System.Collections.Generic;
using Beasty_SaveSystemCore;
using Beasty_SaveSystemCore.Json;

public sealed class FurnaceConverter : IBeastyConverter
{
    public bool CanConvert(Type type) => type == typeof(Furnace);

    public JsonNode Write(object value, JsonMapper mapper)
    {
        var furnace = (Furnace)value;
        JsonNode node = JsonNode.NewObject();
        ConverterUtil.WriteFloat(node, "temperature", furnace.Temperature);

        JsonNode fuel = JsonNode.NewObject();
        foreach (KeyValuePair<string, int> entry in furnace.Fuel)
            fuel[entry.Key] = JsonNode.Of((long)entry.Value);
        node["fuel"] = fuel;

        return node;
    }

    public object Read(JsonNode node, Type type, object existing, JsonMapper mapper)
    {
        // Component converter: populate what is already in the scene, never construct.
        var furnace = existing as Furnace;
        if (furnace == null)
            throw new JsonException(
                "Furnace can only be loaded into an existing scene instance; use LoadInto or a group save.");

        furnace.SetTemperature(ConverterUtil.ReadFloat(node, "temperature", furnace.Temperature));

        if (node.TryGetMember("fuel", out JsonNode fuel) && !fuel.IsNull)
        {
            furnace.ClearFuel();
            foreach (string kind in fuel.Keys)
                furnace.SetFuel(kind, ConverterUtil.ReadInt(fuel, kind, 0));
        }

        return furnace;
    }
}
```

Register it (see below), tick `Furnace` on the object's `BeastySaveable`, and it round-trips. The
inspector's Saved Components checklist now labels it `dev` instead of warning that it has no converter.

### A value-type converter

Same interface, opposite shape: `existing` is meaningless, so build and return.

```csharp
using System;
using Beasty_SaveSystemCore;
using Beasty_SaveSystemCore.Json;

public struct GridCell
{
    public int X;
    public int Y;
}

public sealed class GridCellConverter : IBeastyConverter
{
    public bool CanConvert(Type type) => type == typeof(GridCell);

    public JsonNode Write(object value, JsonMapper mapper)
    {
        var cell = (GridCell)value;
        JsonNode node = JsonNode.NewObject();
        node["x"] = JsonNode.Of((long)cell.X);
        node["y"] = JsonNode.Of((long)cell.Y);
        return node;
    }

    public object Read(JsonNode node, Type type, object existing, JsonMapper mapper) =>
        new GridCell
        {
            X = ConverterUtil.ReadInt(node, "x", 0),
            Y = ConverterUtil.ReadInt(node, "y", 0)
        };
}
```

## Overriding a built-in

A converter you register yourself sits in the `dev` layer, which outranks everything. To replace a
built-in, write a converter whose `CanConvert` claims the same type. This one stores only world position,
because a game that never rotates or scales anything does not need the rest:

```csharp
using System;
using Beasty_SaveSystemCore;
using Beasty_SaveSystemCore.Json;
using UnityEngine;

public sealed class PositionOnlyTransformConverter : IBeastyConverter
{
    public bool CanConvert(Type type) => type == typeof(Transform);

    public JsonNode Write(object value, JsonMapper mapper)
    {
        var t = (Transform)value;
        JsonNode node = JsonNode.NewObject();
        node["position"] = mapper.ToNode(t.position);
        return node;
    }

    public object Read(JsonNode node, Type type, object existing, JsonMapper mapper)
    {
        var t = existing as Transform;
        if (t == null)
            throw new JsonException("Transform can only be loaded into an existing scene instance.");

        if (node.TryGetMember("position", out JsonNode position) && !position.IsNull)
            t.position = (Vector3)mapper.ToObject(position, typeof(Vector3));

        return t;
    }
}
```

Register it and every `Transform` in every save now goes through your code instead of the built-in
`core` one.

> **Warning**
> Overriding a built-in changes the shape of the data on disk. Saves written by the old converter still
> contain the old members. Members you no longer read are ignored, and members you now read that are absent
> fall back silently — but if the meaning of a member changed, write a migration. See
> [Versioning and migrations](../guides/versioning-and-migrations.md).

## ConverterUtil

`Beasty_SaveSystemCore.ConverterUtil` is the read/write helper set every built-in converter uses. Use it
rather than reading `JsonNode` members by hand, because it implements the strict/tolerant rule for you.

| Helper | Notes |
|---|---|
| `WriteFloat(JsonNode obj, string name, float value)` | Writes a number. |
| `ReadFloat(JsonNode obj, string name, float fallback)` | |
| `ReadInt(JsonNode obj, string name, int fallback)` | Requires an integer node. |
| `ReadLong(JsonNode obj, string name, long fallback)` | Requires an integer node. |
| `ReadBool(JsonNode obj, string name, bool fallback)` | |
| `ReadString(JsonNode obj, string name, string fallback)` | |
| `WriteEnum(JsonNode obj, string name, Enum value)` | Stores the enum **by name**, so reordering the enum later does not corrupt old saves. |
| `ReadEnum<T>(JsonNode obj, string name, T fallback)` | `where T : struct, Enum`. Parses case-insensitively. |

Pass the component's current value as the `fallback`. That is what makes a converter survive a save
written by an older build.

### The fallback rule

This is the part that decides how your converter behaves against imperfect data.

- A member that is **missing, or explicitly null**, falls back to the value you passed. Silently. No
  warning, no failure. This is deliberate: it lets an old save load into a new build that added a member.
- A member that is **present but holds the wrong type** is different. That is corrupt or foreign data, and
  swallowing it would drop real state with nothing said anywhere. In a **strict** load it throws, and the
  pipeline reports `FieldMapFailed`. In a **tolerant** load it keeps the fallback and adds a warning to
  `LoadResult.Warnings`.

`ReadEnum<T>` follows the same rule for a string that is not a valid value of the enum.

## Registration

Two entry points, both on `Beasty_SaveSystem.BeastySave`.

```csharp
static void RegisterConverter(IBeastyConverter converter);
static void RegisterModule(string moduleId, IEnumerable<IBeastyConverter> converters);
```

**`RegisterConverter`** puts the converter in the `dev` layer — the highest priority. The most recent
registration wins, so registering a second converter for the same type shadows the first. This is how you
override a built-in.

**`RegisterModule`** registers a named group. It is **idempotent by id**: registering `"mystudio.rpg"`
twice replaces the set rather than duplicating it. The id matters beyond bookkeeping — it is written into
**every entry of a scene save**:

```json
{ "saveables": { "furnace.kitchen": { "Furnace": { "module": "mystudio.rpg", "data": { } } } } }
```

So a build that no longer has the module can load the file, see which module wrote the entry, and tell the
player exactly what is missing instead of failing with a shrug. This is how the seven built-in modules
work; see [Converter modules](../reference/converter-modules.md).

```csharp
BeastySave.RegisterModule("mystudio.rpg", new IBeastyConverter[]
{
    new FurnaceConverter(),
    new GridCellConverter()
});
```

### Priority

```text
dev  >  modules  >  core
```

The first converter whose `CanConvert` returns true, walking the layers in that order, handles the type.
Resolution is cached per type and the cache is cleared on every registration.

`BeastySave.TryDescribeConverter(Type type, out string source)` tells you which layer would handle a type:
`"dev"`, a module id, or `"core"`. The `BeastySaveable` inspector uses it to label each component in the
Saved Components checklist.

### The Play Mode reset

> **Warning**
> Entering Play Mode resets the statics. Converters registered with `RegisterConverter`, and migrations
> registered with `RegisterMigration`, are **lost on every Play**. If you register them from a menu item,
> an editor script or an `Awake`, they will be gone the next time you press Play and your saves will
> quietly go back to the built-in behaviour. Register them from a `[RuntimeInitializeOnLoadMethod]`.
> Converters registered with `RegisterModule` survive the reset.

```csharp
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;
using UnityEngine;

public static class GameConverters
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    private static void Register()
    {
        BeastySave.RegisterConverter(new FurnaceConverter());
        BeastySave.RegisterConverter(new PositionOnlyTransformConverter());
        BeastySave.RegisterMigration(1, 2, node => node);
    }
}
```

Use `BeforeSceneLoad`, not `SubsystemRegistration`. The reset itself runs at `SubsystemRegistration`, and
the order of two methods on the same load type is not defined — registering there can be wiped by the
reset that follows it.

This also applies with Fast Enter Play Mode (domain reload off), which is the reason the reset exists: it
stops converters and migrations from one Play session leaking into the next.

## See also

- [What gets saved](../guides/what-gets-saved.md) — what the default path covers, and what it refuses.
- [Converter modules](../reference/converter-modules.md) — the seven built-in modules and what each stores.
- [Strict vs tolerant loading](../guides/strict-vs-tolerant.md) — the tolerance your converter must honour.
- [The JSON engine](../reference/json-engine.md) — `JsonNode`, `JsonMapper`, `JsonParser`, `JsonWriter`.
- [The save file format](../reference/save-file-format.md) — where the `module` id ends up.
- [Results and errors](../reference/results-and-errors.md) — `FieldMapFailed`, `TypeUnavailable`.
