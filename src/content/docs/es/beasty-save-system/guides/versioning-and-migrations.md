---
title: "Versionado y migraciones"
description: "Publicaste. Los jugadores tienen guardados. Ahora necesitas cambiar tu clase de datos. Esta página trata sobre cómo hacerlo sin romper los archivos que esos j"
---

Publicaste. Los jugadores tienen guardados. Ahora necesitas cambiar tu clase de datos. Esta página trata sobre cómo hacerlo
sin romper los archivos que esos jugadores ya tienen en disco.

## La situación

Tu clase de guardado se veía así en la versión 1.0 de tu juego:

```csharp
public sealed class PlayerData
{
    public string name;
    public float volume;
}
```

En 1.1 renombras `name` a `displayName`, y divides el único `volume` en volúmenes separados de música y
efectos:

```csharp
public sealed class PlayerData
{
    public string displayName;
    public float musicVolume;
    public float sfxVolume;
}
```

Cada guardado en el disco de cada jugador todavía contiene `name` y `volume`. Cargar uno ahora perdería el nombre y
ambos volúmenes. Una migración es cómo los trasladas.

## DataVersion

`BeastySaveSettings.DataVersion` es un entero que tú controlas. Por defecto es `1`. Se escribe en cada archivo de
guardado, y se lee de vuelta en cada carga. El sistema compara la versión **en el archivo** con la versión
**en tus settings**:

| El archivo dice | Qué pasa |
|---|---|
| La misma versión | El guardado carga tal cual. |
| Una versión **más baja** | Las migraciones registradas se ejecutan, en orden, hasta que el archivo alcanza tu versión. Luego carga. |
| Una versión **más alta** | La carga se rechaza con el error `VersionTooNew`. |

Esa última fila es un rechazo deliberado, y vale la pena entenderlo. Un guardado con una versión más alta fue
escrito por un **build más nuevo de tu juego** que el que se está ejecutando — un jugador retrocediendo un parche, o un guardado
de beta abierto por el build de release. Ese archivo puede contener campos que este build nunca ha conocido y formas que
no puede interpretar. En lugar de leerlo a medias y producir un juego sutilmente roto, el sistema lo rechaza y
te dice por qué:

```text
Save data version 3 is newer than the game's version 2.
```

Muéstraselo al jugador como "Este guardado se hizo con una versión más nueva del juego." No hay nada que
reparar; el backup no ayudará.

## Registrar una migración

Una migración es una función que recibe los datos crudos del guardado y devuelve los mismos datos en una forma más nueva. Se
ejecuta **antes** de que nada se mapee sobre tus clases, así que trabaja sobre JSON, no sobre `PlayerData`.

```csharp
static void RegisterMigration(int fromVersion, int toVersion, Func<JsonNode, JsonNode> migrate)
```

`JsonNode` es el tipo de nodo JSON propio del paquete — consulta [El motor JSON](/es/docs/beasty-save-system/reference/json-engine/) para
la API completa. Para una migración necesitas muy poco de ella: leer un miembro, escribir un miembro, eliminar un miembro.

Aquí está el cambio descrito arriba, como una migración de la versión de datos 1 a la 2:

```csharp
using System;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore.Json;

public static class SaveMigrations
{
    private static JsonNode V1ToV2(JsonNode data)
    {
        // Defensivo: una migración recibe lo que sea que esté en el archivo. No asumas la forma.
        if (data == null || data.Kind != JsonNodeKind.Object)
            return data;

        // Renombrar: "name" -> "displayName".
        if (data.TryGetMember("name", out JsonNode name))
        {
            data["displayName"] = name;
            data.Remove("name");
        }

        // Dividir: un "volume" -> "musicVolume" + "sfxVolume".
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

Configura `DataVersion = 2` en tus settings, registra el paso, y cada guardado de 1.0 ahora se abre en 1.1 con su
nombre y sus volúmenes intactos.

Puntos para copiar de ese ejemplo:

- **Protege la forma.** El nodo viene de un archivo, y un archivo puede ser cualquier cosa. Comprueba `Kind` antes de
  indexarlo. Leer un miembro del tipo equivocado lanza una excepción, y una migración que lanza excepciones hace fallar la carga
  con `MigrationFailed`.
- **Devuelve el nodo.** Puedes mutar el nodo que recibiste y devolverlo, como arriba, o construir uno nuevo
  y devolver ese. Devolver `null` deja los datos sin cambios en lugar de borrarlos.
- **Mantenla pura.** Una migración debería transformar datos y nada más. No toques la escena, no cargues
  assets, ni leas el estado actual de tu juego a partir de ella. Se ejecuta durante una carga, antes de que tus objetos existan.

## Las migraciones se encadenan

Registra un paso por cada subida de versión. El sistema los recorre en orden.

```csharp
BeastySave.RegisterMigration(1, 2, V1ToV2);
BeastySave.RegisterMigration(2, 3, V2ToV3);
```

Con `DataVersion = 3`, un guardado de versión 1 ejecuta `V1ToV2` y luego `V2ToV3`. Nunca escribes un paso de 1 a 3,
y nunca tienes que pensar en cada combinación histórica — solo escribes el paso desde la versión que
acabas de dejar hasta la versión que acabas de crear.

Si falta un paso en la cadena, la carga falla con `MigrationFailed`:

```text
No migration registered from data version 2.
```

`toVersion` debe ser mayor que `fromVersion`. Pasar cualquier otra cosa lanza inmediatamente una excepción — un error de
registro es tu bug, no el archivo del jugador, así que sale a la luz al arrancar en lugar de reportarse como un fallo de
carga meses después.

## La trampa: las migraciones no sobreviven al Play Mode

> **Advertencia**
> Las migraciones registradas se **borran cada vez que entras en Play Mode**. Igual que los convertidores personalizados
> registrados con `RegisterConverter`. Si registras tus migraciones desde un elemento de menú, un `Awake`, o un
> script de editor puntual, desaparecerán la próxima vez que pulses Play, y tus guardados antiguos de repente fallarán
> con `MigrationFailed` — por razones que parecerán magia negra.
>
> Regístralas desde un `[RuntimeInitializeOnLoadMethod]` para que se vuelvan a registrar en cada Play, en el
> editor y en un build por igual.

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

Esta única clase estática es toda la configuración. Se ejecuta antes de tu primera escena, en cada build, en cada Play,
y no cuesta nada cuando no hay nada que migrar.

Los módulos convertidores, registrados con `RegisterModule`, no se ven afectados — persisten. Solo
`RegisterMigration` y `RegisterConverter` necesitan volver a registrarse. Consulta
[Convertidores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/).

## Migrar un guardado de escena

Todo lo anterior aplica a `BeastySave.Save`, donde el nodo de datos es tu propia clase. Un guardado de escena escrito
por `SaveAll` tiene una forma fija en su lugar — un documento de ids de saveable, cada uno con tipos de componente y
sus datos. Una migración sobre esos datos recibe ese documento, no tu clase. Es factible, pero estás
editando una estructura que el paquete posee; lee [El formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/) primero
para que sepas exactamente qué estás reformando.

## Consejos prácticos

**Sube `DataVersion` en el mismo commit que el cambio a tu clase de datos.** La versión y la forma que describe son
una sola cosa. Dividirlas entre dos commits es cómo terminas con guardados cuyo número de versión miente sobre
su contenido, y ninguna migración puede arreglar eso.

**Escribe la migración en ese mismo commit también**, mientras aún recuerdas qué significaba el campo antiguo.

**Conserva cada migración para siempre.** Un jugador puede instalar tu juego hoy, jugar el build 1.0 que compró en
un disco, y abrir ese guardado en el build 2.4 después de una actualización. El paso de 1 a 2 todavía tiene que estar ahí. La
cadena solo es tan larga como la historia de tu juego, y cada paso son unas pocas líneas; borrar los antiguos no te ahorra
nada y eventualmente le cuesta a un jugador su guardado.

**Prueba la cadena.** Guarda un archivo de guardado de cada versión publicada en tu proyecto y cárgalos todos en un test.
La cadena es exactamente el tipo de código que nunca se ejercita hasta que lo ejercita un jugador.

## Ver también

- [Settings](/es/docs/beasty-save-system/guides/settings/) — el campo `DataVersion`
- [Carga estricta vs. tolerante](/es/docs/beasty-save-system/guides/strict-vs-tolerant/) — la otra forma de sobrevivir a una clase cambiada, y por qué pierde datos
- [El motor JSON](/es/docs/beasty-save-system/reference/json-engine/) — todo lo que `JsonNode` puede hacer
- [El formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/) — dónde vive `dataVersion` en el archivo
- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) — `VersionTooNew` y `MigrationFailed`
- [Convertidores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/) — el mismo reinicio de Play Mode, para convertidores
