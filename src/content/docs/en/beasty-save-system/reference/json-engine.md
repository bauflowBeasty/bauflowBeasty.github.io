---
title: "The JSON engine"
description: "Beasty Save System ships its own JSON engine in BeastySaveSystemCore.Json. It is public and usable on its own, for anything: config files, network payloads, t"
---

Beasty Save System ships its own JSON engine in `Beasty_SaveSystemCore.Json`. It is public and usable on
its own, for anything: config files, network payloads, tooling. You do not need the save system to use it.

## Why it exists

**Zero dependencies.** The package pulls in no Newtonsoft, no third-party JSON library, nothing that can
version-conflict with what your project or another asset already has. Everything the save system needs is
here.

It is also **AOT-safe** (field reflection only, no code generation) and **deterministic**: the writer
preserves object member order, which is what lets a save file be checksummed at all.

## JsonNode

`sealed class JsonNode`. One class models all six JSON kinds. Accessing a node as the wrong kind throws
`JsonException`, so a mistake fails loudly instead of silently corrupting data.

```csharp
public enum JsonNodeKind { Null, Boolean, Number, String, Array, Object }
public JsonNodeKind Kind { get; }
```

### Factories

```csharp
public static JsonNode NewObject();
public static JsonNode NewArray();
public static JsonNode Null { get; }
public static JsonNode Of(bool value);
public static JsonNode Of(long value);
public static JsonNode Of(double value);
public static JsonNode Of(string value);   // null string produces a Null node
```

### Value access

```csharp
public bool IsNull { get; }
public bool IsInteger { get; }   // a Number node that was written or parsed as an integer

public bool   AsBool();
public long   AsLong();          // throws on a non-integer number: read it with AsDouble()
public double AsDouble();        // an integer node widens
public string AsString();
```

### Object access

```csharp
public JsonNode this[string key] { get; set; }   // get returns null when the key is absent
public bool TryGetMember(string key, out JsonNode value);
public bool ContainsKey(string key);
public bool Remove(string key);
public IReadOnlyList<string> Keys { get; }       // insertion order
```

Assigning a null value stores a `Null` node. A null key throws.

### Array access

```csharp
public void Add(JsonNode item);
public JsonNode this[int index] { get; set; }
public int Count { get; }   // members on an Object, items on an Array; throws on anything else
```

### Comparison

```csharp
public bool DeepEquals(JsonNode other);
```

Semantic equality: object key **order is ignored**, and the integer and floating representations of the
same numeric value are equal.

## JsonParser

```csharp
public static class JsonParser
{
    public const int DefaultMaxDepth = 512;
    public static JsonNode Parse(string json, int maxDepth = DefaultMaxDepth);
}
```

A strict RFC 8259 recursive-descent parser. It rejects trailing commas, leading zeros, unescaped control
characters inside strings, invalid escapes, and any content after the end of the document. A duplicate
object key keeps the last value.

The **512-level depth limit** stops hostile or corrupt input from overflowing the stack. Nesting deeper than
that throws. Raise it with the `maxDepth` argument if you genuinely need to, but a save that deep is
usually a bug.

Failures throw `JsonParseException`.

## JsonWriter

```csharp
public static class JsonWriter
{
    public static string Write(JsonNode node, bool indented = false);
}
```

`indented: true` uses two spaces and newlines; the default is compact.

**Member order is preserved.** That is what makes the output deterministic: the same tree always produces
the same bytes, which is what makes the save-file checksum work. Round-tripping through
`Parse` and `Write` reproduces the exact text that was hashed.

**`NaN` and `Infinity` throw.** They are not representable as JSON numbers. Sanitize the value before you
save it.

## JsonMapper

```csharp
public sealed class JsonMapper
{
    public IJsonConverterResolver ConverterResolver { get; set; }
    public bool StrictPopulate { get; }
    public Action<string> FieldSkipReporter { get; }

    public JsonNode ToNode(object value);
    public T ToObject<T>(JsonNode node);
    public object ToObject(JsonNode node, Type type);
    public void Populate(object target, JsonNode node, bool strict = true,
                         Action<string> onFieldSkipped = null);
    public void PopulateFields(object target, JsonNode node, bool strict = true,
                               Action<string> onFieldSkipped = null);

    public static IReadOnlyList<FieldInfo> GetSerializableFields(Type type);
}
```

Reflection-based object-to-node mapping following Unity's serialization rules.

**`ToNode`** serializes a value. It detects reference cycles (and throws `JsonException`: save data must be
acyclic), passes a pre-built `JsonNode` through verbatim, and consults `ConverterResolver` before falling
back to reflection.

**`ToObject`** builds a new instance from a node.

**`Populate`** applies an Object node onto an instance that already exists. Types handled by a registered
converter go through that converter — field reflection never sees state that lives behind properties. Value
types are rejected: use `ToObject` for structs.

**`PopulateFields`** does the field-by-field work in two phases: every matching field is converted first
(staging), then the values are assigned. With `strict: true` a single failing field aborts before anything
is assigned, so the target is left untouched. With `strict: false` failing fields are skipped and reported
through `onFieldSkipped`, and the rest apply. Converter authors call this directly, to populate a
component's fields without re-dispatching into their own converter.

**`StrictPopulate`** and **`FieldSkipReporter`** expose the tolerance of the `Populate` call currently in
flight, so a converter can honour the strict/tolerant choice the caller made. Outside a `Populate` call,
`StrictPopulate` is true.

**`GetSerializableFields`** returns the fields the mapper will touch, cached per type: public instance
fields, plus private fields marked `[SerializeField]`, walking the whole inheritance chain (so private
`[SerializeField]` members of a base class are included). `static`, `readonly` and `[NonSerialized]` fields
are skipped. Properties are never serialized.

### Type rules

| Kind | Behaviour |
|---|---|
| Enums | Written as their name. Read from a name or an integer. |
| `DateTime` | Round-trip string (`"o"` format). |
| `char` | A one-character string. |
| `ulong` | Throws above `long.MaxValue`. |
| Dictionaries | Keys must be `string`, a primitive or an enum. A null key throws. |
| Collections | Any `IEnumerable` writes as an array. Reads back into arrays, `List<T>`, `HashSet<T>`, `SortedSet<T>`, `Queue<T>`, `Stack<T>` — anything with `Add`, `Enqueue` or `Push`. A `Stack<T>` is re-pushed in reverse, so the same item ends up on top. |
| `UnityEngine.Object` | Throws: it cannot be saved by value. (The `MonoBehaviour` converter skips such fields instead of failing.) |
| `JsonNode` | Passes through untouched, in both directions. |

## Exceptions

```csharp
public class JsonException : Exception
public sealed class JsonParseException : JsonException
{
    public int Line { get; }     // 1-based
    public int Column { get; }   // 1-based
}
```

`JsonException` covers writing and mapping errors: a cycle, a wrong-kind access, a `NaN`, an unsupported
type. `JsonParseException` is malformed input, and carries the position of the offending character (the
message already includes it).

## IJsonConverterResolver

```csharp
public interface IJsonConverterResolver
{
    bool TryToNode(JsonMapper mapper, object value, out JsonNode node);
    bool TryToObject(JsonMapper mapper, JsonNode node, Type type, object existing, out object result);
}
```

The hook the mapper consults before reflection, in both directions. Return false to decline and let the
default path run. The save system plugs its converter registry in here; if you use the JSON engine on its
own, this is where you take over mapping for your own types.

## A worked example

Building a node by hand, writing it, and parsing it back:

```csharp
using Beasty_SaveSystemCore.Json;

JsonNode root = JsonNode.NewObject();
root["name"] = JsonNode.Of("Ana");
root["level"] = JsonNode.Of(7L);
root["alive"] = JsonNode.Of(true);

JsonNode items = JsonNode.NewArray();
items.Add(JsonNode.Of("sword"));
items.Add(JsonNode.Of("lantern"));
root["items"] = items;

string text = JsonWriter.Write(root, indented: true);

JsonNode parsed = JsonParser.Parse(text);
string name = parsed["name"].AsString();          // "Ana"
long level = parsed["level"].AsLong();            // 7
int count = parsed["items"].Count;                // 2
bool same = parsed.DeepEquals(root);              // true
```

Mapping an object instead of building the tree:

```csharp
var mapper = new JsonMapper();

JsonNode node = mapper.ToNode(new PlayerData { Name = "Ana", Level = 7 });
PlayerData back = mapper.ToObject<PlayerData>(node);
```

## See also

- [Save file format](/docs/beasty-save-system/reference/save-file-format/)
- [Custom converters](/docs/beasty-save-system/advanced/custom-converters/)
- [BeastySave API](/docs/beasty-save-system/reference/api-beastysave/)
