---
title: "Convertidores personalizados"
description: "Un convertidor le enseña al sistema de guardado cómo convertir una familia de tipos en JSON y viceversa. Escribe uno cuando el camino por defecto no puede alcanzar tu est"
---

Un convertidor le enseña al sistema de guardado cómo convertir una familia de tipos en JSON y viceversa.
Escribe uno cuando el camino por defecto no puede alcanzar tu estado, o cuando quieres reemplazar lo que
almacena un convertidor integrado. Esta página es para programadores.

El camino por defecto serializa un componente por sus campos serializables por Unity: campos `public` y
`[SerializeField]`, nada más. Si tu estado vive detrás de una propiedad, en un campo privado que Unity no
serializa, o en una estructura en tiempo de ejecución que debe reconstruirse en un orden particular, ese
estado nunca llega al archivo. Un convertidor es la solución. Consulta [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/) para la lista completa de lo que
cubre el camino por defecto.

## La interfaz

`Beasty_SaveSystemCore.IBeastyConverter` tiene tres miembros.

```csharp
bool CanConvert(Type type);
JsonNode Write(object value, JsonMapper mapper);
object Read(JsonNode node, Type type, object existing, JsonMapper mapper);
```

| Miembro | Qué hace |
|---|---|
| `CanConvert(Type type)` | Verdadero cuando este convertidor maneja `type`. Se llama una vez por tipo y se cachea. |
| `Write(object value, JsonMapper mapper)` | Devuelve el `JsonNode` que representa `value`. Usa `mapper.ToNode(...)` para cualquier cosa que no quieras escribir a mano. |
| `Read(JsonNode node, Type type, object existing, JsonMapper mapper)` | Reconstruye el valor a partir de `node` y lo devuelve. `existing` es la instancia ya presente en la escena, o `null`. |

`CanConvert` decide toda la familia. `type == typeof(Furnace)` maneja un solo tipo;
`typeof(MonoBehaviour).IsAssignableFrom(type)` maneja cada MonoBehaviour — que es exactamente lo que hace el
convertidor `core` integrado.

## El contrato

Dos reglas, y no son negociables.

**Los convertidores de componente rellenan la instancia existente. Nunca construyen una.** Un componente de
escena no puede crearse a partir de datos: pertenece a un GameObject, tiene referencias que la escena
conectó, y el cargador lo está restaurando en su lugar. Así que `Read` convierte `existing` con un cast, lo
muta, y lo devuelve. Si `existing` es `null`, lanza una `JsonException` con un mensaje que lo indique — el
pipeline convierte eso en un resultado tipado `FieldMapFailed` en lugar de una excepción en la cara del
jugador.

**Los convertidores de tipo de valor construyen un valor nuevo e ignoran `existing`.** Un `Vector3` no tiene
nada que rellenar. Lee los miembros, construye, devuelve.

Tercera regla, para cuando tocas campos: **respeta `mapper.StrictPopulate` y `mapper.FieldSkipReporter`.**
Llevan la tolerancia que pidió quien llama hasta tu convertidor. Si delegas la restauración de campos al
mapper, pásalos directamente:

```csharp
mapper.PopulateFields(existing, node, mapper.StrictPopulate, mapper.FieldSkipReporter);
```

Fijar `strict: true` ahí significaría que una carga tolerante descarta todo el componente por un solo campo
incorrecto. Consulta [Carga estricta vs. tolerante](/es/docs/beasty-save-system/guides/strict-vs-tolerant/).

## Un ejemplo trabajado

Este componente es un caso realista que el camino por defecto no puede manejar. Su contenido vive en un
campo privado que Unity no serializa, y su temperatura es una propiedad — y las propiedades nunca se
guardan.

```csharp
using System.Collections.Generic;
using UnityEngine;

public sealed class Furnace : MonoBehaviour
{
    // Privado, sin [SerializeField]: Unity no lo serializa, así que el camino por defecto tampoco.
    private readonly Dictionary<string, int> _fuel = new Dictionary<string, int>();

    // Una propiedad. Solo se guardan los campos.
    public float Temperature { get; private set; }

    public IReadOnlyDictionary<string, int> Fuel => _fuel;

    public void SetTemperature(float value) => Temperature = value;
    public void SetFuel(string kind, int amount) => _fuel[kind] = amount;
    public void ClearFuel() => _fuel.Clear();
}
```

Marca `Furnace` en el inspector de `BeastySaveable` hoy y el archivo de guardado obtiene un objeto vacío. Aquí
está el convertidor que lo arregla.

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
        // Convertidor de componente: rellena lo que ya está en la escena, nunca construye.
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

Regístralo (más abajo), marca `Furnace` en el `BeastySaveable` del objeto, y funciona de ida y vuelta. La
lista de verificación de Saved Components del inspector ahora lo etiqueta como `dev` en lugar de advertir que
no tiene convertidor.

### Un convertidor de tipo de valor

Misma interfaz, forma opuesta: `existing` no tiene sentido, así que construye y devuelve.

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

## Sobrescribiendo un convertidor integrado

Un convertidor que registras tú mismo se ubica en la capa `dev`, que supera a todo lo demás. Para reemplazar
uno integrado, escribe un convertidor cuyo `CanConvert` reclame el mismo tipo. Este solo almacena la posición
en el mundo, porque un juego que nunca rota ni escala nada no necesita el resto:

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

Regístralo y cada `Transform` en cada guardado pasará ahora por tu código en lugar del `core` integrado.

> **Advertencia**
> Sobrescribir un convertidor integrado cambia la forma de los datos en disco. Los guardados escritos por el
> convertidor anterior todavía contienen los miembros anteriores. Los miembros que ya no lees se ignoran, y
> los miembros que ahora lees pero están ausentes recaen en silencio — pero si el significado de un miembro
> cambió, escribe una migración. Consulta [Versionado y migraciones](/es/docs/beasty-save-system/guides/versioning-and-migrations/).

## ConverterUtil

`Beasty_SaveSystemCore.ConverterUtil` es el conjunto de ayudantes de lectura/escritura que usa cada
convertidor integrado. Úsalo en lugar de leer los miembros de `JsonNode` a mano, porque implementa la regla
estricta/tolerante por ti.

| Ayudante | Notas |
|---|---|
| `WriteFloat(JsonNode obj, string name, float value)` | Escribe un número. |
| `ReadFloat(JsonNode obj, string name, float fallback)` | |
| `ReadInt(JsonNode obj, string name, int fallback)` | Requiere un node entero. |
| `ReadLong(JsonNode obj, string name, long fallback)` | Requiere un node entero. |
| `ReadBool(JsonNode obj, string name, bool fallback)` | |
| `ReadString(JsonNode obj, string name, string fallback)` | |
| `WriteEnum(JsonNode obj, string name, Enum value)` | Almacena el enum **por nombre**, así que reordenar el enum más tarde no corrompe los guardados antiguos. |
| `ReadEnum<T>(JsonNode obj, string name, T fallback)` | `where T : struct, Enum`. Parsea sin distinguir mayúsculas/minúsculas. |

Pasa el valor actual del componente como el `fallback`. Eso es lo que hace que un convertidor sobreviva a un
guardado escrito por una build anterior.

### La regla del fallback

Esta es la parte que decide cómo se comporta tu convertidor frente a datos imperfectos.

- Un miembro que está **ausente, o explícitamente null**, recae en el valor que pasaste. En silencio. Sin
  advertencia, sin fallo. Esto es deliberado: permite que un guardado antiguo se cargue en una build nueva
  que añadió un miembro.
- Un miembro que está **presente pero tiene el tipo incorrecto** es diferente. Eso son datos corruptos o
  ajenos, y tragárselos descartaría estado real sin decir nada en ningún lugar. En una carga **estricta**
  lanza una excepción, y el pipeline reporta `FieldMapFailed`. En una carga **tolerante** mantiene el
  fallback y añade una advertencia a `LoadResult.Warnings`.

`ReadEnum<T>` sigue la misma regla para un string que no es un valor válido del enum.

## Registro

Dos puntos de entrada, ambos en `Beasty_SaveSystem.BeastySave`.

```csharp
static void RegisterConverter(IBeastyConverter converter);
static void RegisterModule(string moduleId, IEnumerable<IBeastyConverter> converters);
```

**`RegisterConverter`** pone el convertidor en la capa `dev` — la prioridad más alta. Gana el registro más
reciente, así que registrar un segundo convertidor para el mismo tipo eclipsa al primero. Así es como
sobrescribes uno integrado.

**`RegisterModule`** registra un grupo con nombre. Es **idempotente por id**: registrar `"mystudio.rpg"` dos
veces reemplaza el conjunto en lugar de duplicarlo. El id importa más allá de la contabilidad — se escribe en
**cada entrada de un guardado de escena**:

```json
{ "saveables": { "furnace.kitchen": { "Furnace": { "module": "mystudio.rpg", "data": { } } } } }
```

Así que una build que ya no tiene el módulo puede cargar el archivo, ver qué módulo escribió la entrada, y
decirle al jugador exactamente qué falta en lugar de fallar sin más explicación. Así es como funcionan los
siete módulos integrados; consulta [Módulos de convertidores](/es/docs/beasty-save-system/reference/converter-modules/).

```csharp
BeastySave.RegisterModule("mystudio.rpg", new IBeastyConverter[]
{
    new FurnaceConverter(),
    new GridCellConverter()
});
```

### Prioridad

```text
dev  >  modules  >  core
```

El primer convertidor cuyo `CanConvert` devuelve verdadero, recorriendo las capas en ese orden, maneja el
tipo. La resolución se cachea por tipo y la caché se limpia en cada registro.

`BeastySave.TryDescribeConverter(Type type, out string source)` te dice qué capa manejaría un tipo: `"dev"`,
un id de módulo, o `"core"`. El inspector de `BeastySaveable` lo usa para etiquetar cada componente en la
lista de verificación de Saved Components.

### El reinicio de Play Mode

> **Advertencia**
> Entrar en Play Mode reinicia los estáticos. Los convertidores registrados con `RegisterConverter`, y las
> migraciones registradas con `RegisterMigration`, se **pierden en cada Play**. Si los registras desde un
> elemento de menú, un script de editor o un `Awake`, habrán desaparecido la próxima vez que pulses Play y
> tus guardados volverán silenciosamente al comportamiento integrado. Regístralos desde un
> `[RuntimeInitializeOnLoadMethod]`. Los convertidores registrados con `RegisterModule` sobreviven al
> reinicio.

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

Usa `BeforeSceneLoad`, no `SubsystemRegistration`. El reinicio en sí se ejecuta en `SubsystemRegistration`, y
el orden de dos métodos con el mismo load type no está definido — registrar ahí puede ser borrado por el
reinicio que le sigue.

Esto también aplica con Fast Enter Play Mode (recarga de dominio desactivada), que es la razón por la que
existe el reinicio: evita que convertidores y migraciones de una sesión de Play se filtren a la siguiente.

## Ver también

- [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/) — lo que cubre el camino por defecto, y lo que rechaza.
- [Módulos de convertidores](/es/docs/beasty-save-system/reference/converter-modules/) — los siete módulos integrados y qué almacena cada uno.
- [Carga estricta vs. tolerante](/es/docs/beasty-save-system/guides/strict-vs-tolerant/) — la tolerancia que tu convertidor debe respetar.
- [El motor JSON](/es/docs/beasty-save-system/reference/json-engine/) — `JsonNode`, `JsonMapper`, `JsonParser`, `JsonWriter`.
- [El formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/) — dónde termina el id de `module`.
- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) — `FieldMapFailed`, `TypeUnavailable`.
