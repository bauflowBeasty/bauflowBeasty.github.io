---
title: "El motor JSON"
description: "JsonNode, JsonParser, JsonWriter y JsonMapper: el motor JSON sin dependencias incluido en el paquete, usable por separado para configuración o herramientas."
---

Beasty Save System incluye su propio motor JSON en `Beasty_SaveSystemCore.Json`. Es público y utilizable por
sí solo, para cualquier cosa: archivos de configuración, payloads de red, herramientas. No necesitas el
sistema de guardado para usarlo.

## Por qué existe

**Cero dependencias.** El paquete no trae Newtonsoft, ninguna librería JSON de terceros, nada que pueda
entrar en conflicto de versiones con lo que tu proyecto u otro asset ya tenga. Todo lo que el sistema de
guardado necesita está aquí.

También es **seguro para AOT** (solo reflexión de campos, sin generación de código) y **determinista**: el
escritor conserva el orden de los miembros del objeto, que es lo que hace posible que un archivo de guardado
tenga checksum.

## JsonNode

`sealed class JsonNode`. Una sola clase modela los seis tipos de JSON. Acceder a un node como el tipo
equivocado lanza `JsonException`, así que un error falla de forma ruidosa en lugar de corromper datos en
silencio.

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
public static JsonNode Of(string value);   // un string nulo produce un node Null
```

### Acceso a valores

```csharp
public bool IsNull { get; }
public bool IsInteger { get; }   // un node Number que se escribió o parseó como entero

public bool   AsBool();
public long   AsLong();          // lanza en un número no entero: léelo con AsDouble()
public double AsDouble();        // un node entero se ensancha
public string AsString();
```

### Acceso a objetos

```csharp
public JsonNode this[string key] { get; set; }   // get devuelve null cuando la clave está ausente
public bool TryGetMember(string key, out JsonNode value);
public bool ContainsKey(string key);
public bool Remove(string key);
public IReadOnlyList<string> Keys { get; }       // orden de inserción
```

Asignar un valor nulo almacena un node `Null`. Una clave nula lanza una excepción.

### Acceso a arrays

```csharp
public void Add(JsonNode item);
public JsonNode this[int index] { get; set; }
public int Count { get; }   // miembros en un Object, items en un Array; lanza en cualquier otro caso
```

### Comparación

```csharp
public bool DeepEquals(JsonNode other);
```

Igualdad semántica: el **orden** de las claves de objeto **se ignora**, y las representaciones entera y de
punto flotante del mismo valor numérico son iguales.

## JsonParser

```csharp
public static class JsonParser
{
    public const int DefaultMaxDepth = 512;
    public static JsonNode Parse(string json, int maxDepth = DefaultMaxDepth);
}
```

Un parser estricto de descenso recursivo conforme a RFC 8259. Rechaza comas finales, ceros a la izquierda,
caracteres de control sin escapar dentro de strings, escapes inválidos, y cualquier contenido después del
final del documento. Una clave de objeto duplicada mantiene el último valor.

El **límite de profundidad de 512 niveles** evita que una entrada hostil o corrupta desborde la pila.
Anidar más profundo que eso lanza una excepción. Auméntalo con el argumento `maxDepth` si de verdad lo
necesitas, pero un guardado tan profundo suele ser un bug.

Los fallos lanzan `JsonParseException`.

## JsonWriter

```csharp
public static class JsonWriter
{
    public static string Write(JsonNode node, bool indented = false);
}
```

`indented: true` usa dos espacios y saltos de línea; el valor por defecto es compacto.

**El orden de los miembros se conserva.** Eso es lo que hace determinista la salida: el mismo árbol siempre
produce los mismos bytes, que es lo que hace funcionar el checksum del archivo de guardado. Ir y volver a
través de `Parse` y `Write` reproduce el texto exacto que fue hasheado.

**`NaN` e `Infinity` lanzan una excepción.** No son representables como números JSON. Sanea el valor antes de
guardarlo.

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

Mapeo de objeto a node basado en reflexión, siguiendo las reglas de serialización de Unity.

**`ToNode`** serializa un valor. Detecta ciclos de referencias (y lanza `JsonException`: los datos de
guardado deben ser acíclicos), deja pasar un `JsonNode` ya construido tal cual, y consulta
`ConverterResolver` antes de recurrir a la reflexión.

**`ToObject`** construye una nueva instancia a partir de un node.

**`Populate`** aplica un node Object sobre una instancia que ya existe. Los tipos manejados por un
convertidor registrado pasan por ese convertidor — la reflexión de campos nunca ve estado que vive detrás de
propiedades. Los tipos de valor se rechazan: usa `ToObject` para structs.

**`PopulateFields`** hace el trabajo campo por campo en dos fases: primero se convierte cada campo
coincidente (staging), luego se asignan los valores. Con `strict: true` un solo campo que falle aborta antes
de que se asigne nada, así que el objetivo queda intacto. Con `strict: false` los campos que fallan se omiten
y se reportan a través de `onFieldSkipped`, y el resto se aplica. Los autores de convertidores llaman a esto
directamente, para rellenar los campos de un componente sin volver a despachar hacia su propio convertidor.

**`StrictPopulate`** y **`FieldSkipReporter`** exponen la tolerancia de la llamada a `Populate` actualmente en
curso, para que un convertidor pueda respetar la elección estricta/tolerante que hizo quien llama. Fuera de
una llamada a `Populate`, `StrictPopulate` es verdadero.

**`GetSerializableFields`** devuelve los campos que el mapper tocará, en caché por tipo: campos de instancia
públicos, más campos privados marcados con `[SerializeField]`, recorriendo toda la cadena de herencia (así
que los miembros privados `[SerializeField]` de una clase base quedan incluidos). Los campos `static`,
`readonly` y `[NonSerialized]` se omiten. Las propiedades nunca se serializan.

### Reglas por tipo

| Tipo | Comportamiento |
|---|---|
| Enums | Se escriben como su nombre. Se leen desde un nombre o un entero. |
| `DateTime` | String de ida y vuelta (formato `"o"`). |
| `char` | Un string de un solo carácter. |
| `ulong` | Lanza excepción por encima de `long.MaxValue`. |
| Diccionarios | Las claves deben ser `string`, un primitivo o un enum. Una clave nula lanza excepción. |
| Colecciones | Cualquier `IEnumerable` se escribe como un array. Se lee de vuelta en arrays, `List<T>`, `HashSet<T>`, `SortedSet<T>`, `Queue<T>`, `Stack<T>` — cualquier cosa con `Add`, `Enqueue` o `Push`. Un `Stack<T>` se vuelve a apilar en orden inverso, así que el mismo elemento termina arriba. |
| `UnityEngine.Object` | Lanza excepción: no puede guardarse por valor. (El convertidor de `MonoBehaviour` omite esos campos en lugar de fallar.) |
| `JsonNode` | Pasa sin tocar, en ambas direcciones. |

## Excepciones

```csharp
public class JsonException : Exception
public sealed class JsonParseException : JsonException
{
    public int Line { get; }     // basado en 1
    public int Column { get; }   // basado en 1
}
```

`JsonException` cubre errores de escritura y mapeo: un ciclo, un acceso de tipo equivocado, un `NaN`, un tipo
no soportado. `JsonParseException` es entrada mal formada, y lleva la posición del carácter conflictivo (el
mensaje ya la incluye).

## IJsonConverterResolver

```csharp
public interface IJsonConverterResolver
{
    bool TryToNode(JsonMapper mapper, object value, out JsonNode node);
    bool TryToObject(JsonMapper mapper, JsonNode node, Type type, object existing, out object result);
}
```

El gancho que el mapper consulta antes de la reflexión, en ambas direcciones. Devuelve false para no intervenir
y dejar que siga el camino por defecto. El sistema de guardado conecta aquí su registro de convertidores; si
usas el motor JSON por separado, aquí es donde tomas el control del mapeo para tus propios tipos.

## Un ejemplo trabajado

Construir un node a mano, escribirlo y volver a parsearlo:

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

Mapear un objeto en lugar de construir el árbol:

```csharp
var mapper = new JsonMapper();

JsonNode node = mapper.ToNode(new PlayerData { Name = "Ana", Level = 7 });
PlayerData back = mapper.ToObject<PlayerData>(node);
```

## Ver también

- [Formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/)
- [Convertidores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/)
- [API de BeastySave](/es/docs/beasty-save-system/reference/api-beastysave/)
