---
title: "Slots y metadatos"
description: "Un slot es un archivo de guardado. Cómo se nombran, listan y eliminan los slots, y cómo adjuntarles metadatos para armar una pantalla de slots sin cargar los guardados."
---

Un slot es un archivo de guardado. Esta página explica cómo se nombran, listan y eliminan los slots, y cómo adjuntar un
pequeño bloque de metadatos a cada uno para que puedas armar una pantalla de slots de guardado sin cargar los guardados.

## Qué es un slot

Un slot es un nombre, no una ruta. El sistema de guardado lo convierte en un archivo:

```text
{DataPath o Application.persistentDataPath}/{Folder}/{slot}.{Extension}
```

`DataPath`, `Folder` y `Extension` vienen de [BeastySaveSettings](/es/docs/beasty-save-system/guides/settings/). Con los valores por defecto, el
slot `slot1` en Windows se convierte en algo como:

```text
C:/Users/<tú>/AppData/LocalLow/<Empresa>/<Juego>/Saves/slot1.save
```

Nunca escribes esa ruta tú mismo. Pasas `"slot1"` y el sistema resuelve el resto. Si necesitas la
ruta real (para mostrarla en una pantalla de soporte, o para abrir la carpeta), pídela:

```csharp
string folder = BeastySave.GetFolderPath(settings);
string file   = BeastySave.GetSlotPath("slot1", settings);
```

## Reglas de nombrado

Un nombre de slot debe ser un nombre de archivo a secas, sin ruta. Se rechaza si:

- está vacío o solo contiene espacios,
- contiene `/` o `\`,
- contiene `..`,
- es una ruta con raíz (`C:\saves\x`, `/saves/x`),
- contiene un carácter que no es válido en un nombre de archivo,
- es un nombre de dispositivo reservado de Windows: `CON`, `PRN`, `AUX`, `NUL`, `COM1`-`COM9`, `LPT1`-`LPT9`.

Los nombres de dispositivo se rechazan en todas las plataformas, no solo en Windows, así que una carpeta de guardado escrita en
macOS o Linux sigue siendo utilizable cuando el mismo jugador se pasa a Windows.

Un nombre rechazado nunca toca el disco. La llamada devuelve un resultado fallido con el error
`InvalidArgument` y un mensaje que dice por qué:

```text
Invalid slot name '../hack': it contains '..'.
```

Cualquier otro nombre es válido: `slot1`, `autosave`, `quicksave`, `Chapter 2 - the well`. Si dejas que el jugador
escriba el nombre del slot, compruébalo antes de usarlo, o simplemente muestra el mensaje que te da el resultado. Consulta
[Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/).

## Exists, Delete, ListSlots

| Llamada | Qué hace |
|---|---|
| `BeastySave.Exists(slot, settings)` | True cuando el archivo del slot está en disco. |
| `BeastySave.Delete(slot, settings)` | Elimina el slot **y su backup**. Devuelve true si el archivo del slot estaba ahí. |
| `BeastySave.ListSlots(settings)` | Los nombres de cada slot en la carpeta. |

Dos cosas que debes saber sobre `Delete`. También elimina el archivo `.bak`, así que un slot eliminado desaparece para siempre;
no queda nada que restaurar. Y devuelve `false` cuando no había ningún archivo de slot para empezar, lo cual
no es un error.

`ListSlots` devuelve solo los nombres de slot, sin la extensión, y excluye los backups `.bak` y
cualquier archivo `.tmp` residual. La lista viene en orden **ordinal** — carácter por carácter, no como la
ordenaría una persona: `slot10` queda antes que `slot2`. Si eso te importa, o bien rellena tus nombres con ceros
(`slot01`, `slot02`, `slot10`) o bien ordena la lista tú mismo una vez que hayas leído los metadatos — que es la
siguiente sección, y la razón por la que existe esta página.

## Metadatos: lo que una lista de slots realmente necesita

Para dibujar una pantalla de slots de guardado necesitas el nombre del capítulo, el tiempo de juego, el nivel, la fecha. No necesitas
el inventario completo del jugador. Cargar doce guardados completos para imprimir doce líneas de texto es un desperdicio, y
si los guardados están encriptados es peor: tendrías que desencriptarlos todos.

![La metadata de un slot, resumida en la ventana Save Manager](/docs-images/beasty-save-system/save-slot-metadata.png)

Así que `Save` recibe un diccionario opcional de strings. Se escribe en el archivo de guardado junto a los datos, y
después puede leerse por sí solo.

```csharp
using System;
using System.Collections.Generic;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;

var meta = new Dictionary<string, string>
{
    { "chapter",  "The Long Winter" },
    { "playtime", "01:22:40" },
    { "level",    "7" },
    { "savedAt",  DateTime.UtcNow.ToString("o") },
};

SaveResult result = BeastySave.Save(playerData, "slot1", settings, meta);
```

Tanto las claves como los valores son strings. Los números, fechas y cualquier otra cosa entran como texto, y salen
como texto; convertirlos de vuelta es tarea tuya.

El mismo parámetro existe en el flujo de guardado de escena:

```csharp
BeastySaveManager.Instance.SaveAllNow("slot1", meta);
```

Para leerlo de vuelta, sin cargar el guardado:

```csharp
LoadResult<Dictionary<string, string>> meta = BeastySave.ReadMeta("slot1", settings);
if (meta.Success)
{
    string chapter = meta.Value["chapter"];
}
```

`ReadMeta` lee el envelope del archivo y se detiene. No toca el payload de datos, no verifica el
checksum, y no necesita la clave de encriptación.

## Los metadatos son texto plano, incluso cuando el guardado está encriptado

Este trade-off es deliberado — es lo que hace barata una lista de slots — y conviene que lo tengas claro.

Los datos de un guardado pueden estar encriptados. Los metadatos nunca lo están. Se quedan en texto plano en el archivo, así que
`ReadMeta` puede construir tu lista de slots en un juego encriptado sin desencriptar nada, y así
la [ventana Save Manager](/es/docs/beasty-save-system/guides/save-manager-window/) puede mostrarte un resumen de un slot para el que no tiene clave.

Dos consecuencias:

> **Advertencia**
> Los metadatos son datos de visualización. No confíes en ellos para decisiones de gameplay. Son legibles y editables por
> cualquiera con un editor de texto, y `ReadMeta` los devuelve sin comprobar el checksum del archivo. Pon el
> nombre del capítulo en los metadatos. No pongas ahí el oro del jugador y luego lo leas de vuelta como la verdad.
> La verdad vive en el payload de datos, que se verifica con checksum al cargar.

Tampoco pongas nada privado en ellos. Si un valor no debería ser visible en un editor de texto, su lugar está en
los datos, no en el meta. Consulta [Encriptación](/es/docs/beasty-save-system/guides/encryption/).

## Un ejemplo trabajado: resúmenes de slot para una UI

Este método devuelve un resumen por slot, listo para vincular a una lista de botones. Nunca carga un guardado.

```csharp
using System;
using System.Collections.Generic;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;

public sealed class SlotSummary
{
    public string Slot;
    public string Chapter;
    public string Playtime;
    public int Level;
    public DateTime SavedAt;
    public bool Unreadable;   // el archivo está ahí, pero su envelope no se pudo leer
}

public static class SaveSlots
{
    public static List<SlotSummary> List(BeastySaveSettings settings)
    {
        var summaries = new List<SlotSummary>();

        foreach (string slot in BeastySave.ListSlots(settings))
        {
            var summary = new SlotSummary { Slot = slot };

            LoadResult<Dictionary<string, string>> meta = BeastySave.ReadMeta(slot, settings);
            if (!meta.Success)
            {
                // Envelope corrupto o ilegible. Igualmente lista el slot: el jugador debe poder
                // seleccionarlo, ver que está dañado, y restaurar su backup.
                summary.Unreadable = true;
                summaries.Add(summary);
                continue;
            }

            summary.Chapter  = Text(meta.Value, "chapter", "Unknown chapter");
            summary.Playtime = Text(meta.Value, "playtime", "--:--");

            if (int.TryParse(Text(meta.Value, "level", "0"), out int level))
                summary.Level = level;

            if (DateTime.TryParse(Text(meta.Value, "savedAt", null), out DateTime savedAt))
                summary.SavedAt = savedAt;

            summaries.Add(summary);
        }

        // ListSlots ordena ordinalmente. Lo más reciente primero suele ser lo que un jugador quiere.
        summaries.Sort((a, b) => b.SavedAt.CompareTo(a.SavedAt));
        return summaries;
    }

    private static string Text(IDictionary<string, string> meta, string key, string fallback) =>
        meta.TryGetValue(key, out string value) && !string.IsNullOrEmpty(value) ? value : fallback;
}
```

Fíjate qué le pasa a un slot dañado: sigue en la lista, marcado como `Unreadable`. Eso es a propósito. Un
slot que el jugador no puede ver es un slot que el jugador no puede reparar, y cada guardado tiene un backup esperando.
[Copias de seguridad y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/) muestra el resto de ese flujo.

## Ver también

- [Copias de seguridad y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/) — restaurar un slot dañado
- [Settings](/es/docs/beasty-save-system/guides/settings/) — `Folder`, `Extension`, `DataPath`
- [Encriptación](/es/docs/beasty-save-system/guides/encryption/) — qué cubre la encriptación y qué no
- [La ventana Save Manager](/es/docs/beasty-save-system/guides/save-manager-window/) — la misma lista de slots, en el editor
- [API de BeastySave](/es/docs/beasty-save-system/reference/api-beastysave/) — cada método de la fachada
- [El formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/) — dónde se ubica `meta` en el archivo
