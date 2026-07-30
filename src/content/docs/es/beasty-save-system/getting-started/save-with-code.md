---
title: "Guardar con código"
description: "El camino C# de cinco minutos: una clase de datos, un BeastySaveSettings, BeastySave.Save y BeastySave.Load con resultados tipados en vez de excepciones."
---

El camino de cinco minutos: una clase de datos, un `BeastySaveSettings`, `BeastySave.Save`, `BeastySave.Load<T>`. Esta
página es para quienes escriben C#. Si prefieres hacer clic, usa
[save-without-code.md](/es/docs/beasty-save-system/getting-started/save-without-code/).

## Los dos namespaces

```csharp
using Beasty_SaveSystem;      // BeastySave, BeastySaveable, BeastySaveManager
using Beasty_SaveSystemCore;  // BeastySaveSettings, SaveResult, LoadResult<T>, BeastySaveError
```

`BeastySave` es una fachada estática — una única clase estática que expone todo el sistema — y el único
punto de entrada. No hay nada que instanciar y nada que inicializar.

## 1. Una clase de datos

Cualquier objeto C# plano. Los campos son lo que se escribe — `public` y `[SerializeField]`, incluyendo los privados
heredados de una clase base. Las propiedades se ignoran.

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class PlayerData
{
    public string playerName = "Hero";
    public int level = 1;
    public float health = 100f;
    public Vector3 position;
    public List<string> inventory = new List<string>();
    public Dictionary<string, int> currencies = new Dictionary<string, int>();
    public DateTime lastPlayed;
}
```

Los arrays, `List`, `Dictionary`, `HashSet`, `SortedSet`, `Queue`, `Stack`, enums, nullables, `DateTime` y los
tipos de valor de Unity se guardan y recuperan todos sin problema. Lo que no: cualquier referencia a un `UnityEngine.Object`. Lee
[what-gets-saved.md](/es/docs/beasty-save-system/guides/what-gets-saved/) antes de diseñar tu clase de guardado — es corta, y
te ahorrará un rediseño.

## 2. Settings

Cada llamada recibe un `BeastySaveSettings`. Lleva la ubicación, el flag de cifrado, el flag de backup, el
modo de carga y la versión de datos. Los valores por defecto sirven tal cual.

```csharp
private static readonly BeastySaveSettings Settings = new BeastySaveSettings
{
    Folder = "Saves",   // por defecto
    Extension = "save", // por defecto
    Backup = true,      // por defecto
    Strict = true,      // por defecto
    DataVersion = 1,    // por defecto
};
```

Como las settings se pasan **por llamada**, un autoguardado y un guardado manual en el mismo proyecto pueden comportarse
de forma diferente — carpetas distintas, niveles de exigencia distintos, uno cifrado y el otro no. Consulta
[settings.md](/es/docs/beasty-save-system/guides/settings/).

## 3. Guardar

```csharp
using UnityEngine;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;

public class SaveDemo : MonoBehaviour
{
    private static readonly BeastySaveSettings Settings = new BeastySaveSettings();

    public PlayerData Data = new PlayerData();

    public void SaveGame()
    {
        SaveResult result = BeastySave.Save(Data, "slot1", Settings);

        if (!result.Success)
        {
            Debug.LogError($"Could not save: {result}");   // "IoError: ..."
            return;
        }

        Debug.Log("Saved.");
    }
}
```

`BeastySave.Save` devuelve un `SaveResult`. No lanza excepciones. `result.Success` es lo único que debes
comprobar; `result.Error` es un valor `BeastySaveError` y `result.Message` lo explica en inglés.
`result.ToString()` te da `"OK"` o `"{Error}: {Message}"`, que es lo que quieres en una línea de log.

### Metadatos

El cuarto argumento opcional es un diccionario de strings escrito en el archivo **en texto plano, incluso cuando el
guardado está cifrado**. Así es como una pantalla de selección de slot muestra "Chapter 3 — 01:22" sin descifrar
ni deserializar nada.

```csharp
var meta = new Dictionary<string, string>
{
    ["chapter"] = "3",
    ["playtime"] = "01:22",
};

SaveResult result = BeastySave.Save(Data, "slot1", Settings, meta);
```

Léelo de vuelta con `BeastySave.ReadMeta`. Consulta
[slots-and-metadata.md](/es/docs/beasty-save-system/guides/slots-and-metadata/).

## 4. Cargar, y manejar el fallo correctamente

Esta es la parte que separa un sistema de guardado de un bug de guardado. Una carga puede fallar: el archivo falta, el
disco está mal, el jugador lo editó, un antivirus lo truncó. **`LoadResult` te dice si existe una copia de seguridad**,
y deberías ofrecerla.

```csharp
public void LoadGame()
{
    LoadResult<PlayerData> result = BeastySave.Load<PlayerData>("slot1", Settings);

    if (result.Success)
    {
        Data = result.Value;
        return;
    }

    if (result.Error == BeastySaveError.FileNotFound)
    {
        Debug.Log("No save in that slot yet.");
        return;
    }

    Debug.LogError($"Load failed: {result}");

    if (!result.BackupAvailable)
        return;

    // Pregunta al jugador primero. Luego:
    SaveResult restored = BeastySave.RestoreBackup("slot1", Settings);
    if (!restored.Success)
    {
        Debug.LogError($"Backup restore failed: {restored}");
        return;
    }

    LoadResult<PlayerData> retry = BeastySave.Load<PlayerData>("slot1", Settings);
    if (retry.Success)
        Data = retry.Value;
    else
        Debug.LogError($"Backup was unreadable too: {retry}");
}
```

Tres detalles que vale la pena señalar:

- **`BackupAvailable` se rellena en cada resultado de carga**, éxito o fallo. Puedes comprobarlo antes de
  necesitarlo.
- **`RestoreBackup` deja el `.bak` en su lugar.** Restaurar dos veces es seguro.
- **`result.Warnings`** es un `IReadOnlyList<string>` que se llena en modo tolerante
  (`Settings.Strict = false`): campos que se omitieron en lugar de hacer fallar la carga. En modo estricto un campo
  malo hace fallar toda la carga y no se aplica nada. Consulta
  [strict-vs-tolerant.md](/es/docs/beasty-save-system/guides/strict-vs-tolerant/).

Hay 13 códigos de error. Cada uno tiene un significado específico y una solución específica; están listados en
[results-and-errors.md](/es/docs/beasty-save-system/reference/results-and-errors/).

## 5. LoadInto — cargar sobre un objeto que ya tienes

`Load<T>` construye un objeto nuevo. `LoadInto` rellena uno que ya existe, que es lo que quieres para un
`MonoBehaviour` o cualquier objeto al que otro código ya guarda una referencia.

```csharp
LoadResult result = BeastySave.LoadInto(Data, "slot1", Settings);
if (!result.Success)
    Debug.LogError($"Load failed: {result}");
// Data se rellenó en el mismo lugar. Ninguna referencia a él se rompió.
```

`LoadInto` devuelve un `LoadResult` simple — no hay `Value`, porque el valor es el objeto que pasaste.

## 6. Exists, Delete, ListSlots

```csharp
if (BeastySave.Exists("slot1", Settings))
    Debug.Log("There is a save in slot1.");

BeastySave.Delete("slot1", Settings);   // elimina el slot Y su .bak

string[] slots = BeastySave.ListSlots(Settings);  // sin .bak, sin .tmp
```

`Delete` devuelve `bool`. `ListSlots` devuelve nombres de slot, no rutas — pásalo directamente a `Load`.
Para las rutas completas, `BeastySave.GetFolderPath(Settings)` y `BeastySave.GetSlotPath("slot1", Settings)`.

## 7. Asíncrono

```csharp
SaveResult result = await BeastySave.SaveAsync(Data, "slot1", Settings);
LoadResult<PlayerData> loaded = await BeastySave.LoadAsync<PlayerData>("slot1", Settings);
```

Mismos resultados, mismos códigos de error. La IO de archivos ocurre de forma asíncrona; la serialización y el
cifrado siguen ejecutándose en el hilo que llama. Evitan que un guardado grande bloquee el hilo principal en
la IO — no son un trabajo en segundo plano. [async-saving.md](/es/docs/beasty-save-system/guides/async-saving/) lo explica con precisión.

## Adónde ir a continuación

- [what-gets-saved.md](/es/docs/beasty-save-system/guides/what-gets-saved/) — las reglas que tu clase de datos debe cumplir
- [api-beastysave.md](/es/docs/beasty-save-system/reference/api-beastysave/) — cada método de la fachada
- [results-and-errors.md](/es/docs/beasty-save-system/reference/results-and-errors/) — los 13 códigos de error, y qué hacer con cada uno
- [scene-state.md](/es/docs/beasty-save-system/guides/scene-state/) — guardar componentes en la escena en vez de tu propia clase
- [versioning-and-migrations.md](/es/docs/beasty-save-system/guides/versioning-and-migrations/) — publicar una actualización que lee guardados antiguos
- [custom-converters.md](/es/docs/beasty-save-system/advanced/custom-converters/) — enseñar al sistema un tipo que no conoce
