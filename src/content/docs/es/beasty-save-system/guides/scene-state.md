---
title: "Estado de la escena"
description: "Cómo guardar los objetos que ya están en tu escena: BeastySaveable marca un objeto para que se guarde, BeastySaveManager los escribe todos en un archivo."
---

Cómo guardar los objetos que ya están en tu escena: `BeastySaveable` marca un objeto para que se guarde,
`BeastySaveManager` los escribe todos en un archivo. Esta página cubre ambos, y los cuatro comportamientos en
torno a los ids que deciden si tus objetos vuelven o no.

Si aún no has construido la configuración básica, [save-without-code.md](/es/docs/beasty-save-system/getting-started/save-without-code/)
la explica clic por clic. Esta página explica qué hace realmente esa configuración.

## Los dos componentes

**`BeastySaveable`** va en cualquier objeto cuyo estado quieras conservar. Tiene un **id** y una lista de
**componentes** a capturar. Uno por GameObject — el componente no permite duplicados.

**`BeastySaveManager`** va en un objeto de la escena. Mantiene el `BeastySaveSettings` usado por el
guardado de escena, y es en el que llamas a `SaveAll` y `LoadAll`. Expone una `Instance` estática.

Cada `BeastySaveable` habilitado se registra automáticamente con el manager. `SaveAll` recorre ese registro, le
pide su estado a cada componente marcado de cada saveable, y escribe todo en un archivo, indexado por id.

## Ids

El id es la forma en que un archivo de guardado reconoce un objeto entre sesiones. Todo en el guardado de escena
se reduce a si el id es el mismo la próxima vez que el juego corra.

### Se autogenera, y es editable

Añade un `BeastySaveable` y recibe un id automáticamente. El inspector lo muestra como **Save Id**, con un
botón **New** al lado que genera uno nuevo.

Puedes editar el id a mano, y hay buenas razones para hacerlo — `player`, `door.cellar`, `chest.tutorial` son
más fáciles de encontrar en un archivo de guardado que un string aleatorio.

> **Advertencia**
> **Cambiar un id deja huérfanos los datos ya guardados bajo el anterior.** El estado sigue en el archivo, bajo
> una clave que ya nada en la escena reclama, y el objeto con el nuevo id no lo encontrará. Decide tus ids
> antes de tener guardados que te importen. El botón **New** tiene exactamente el mismo efecto: rompe la conexión
> del objeto con todos los guardados existentes.

### Un asset de prefab no lleva ningún id

El asset de prefab en sí no tiene id. Cada **instancia** recibe el suyo propio, generado cuando se crea. Dos
copias del mismo prefab en una escena son dos saveables distintos con dos ids distintos, que es lo que quieres —
son dos cofres diferentes.

### Un objeto generado en tiempo de ejecución obtiene un id nuevo cada vez

Este es el que atrapa a la gente.

Un objeto que instancias con `Instantiate` mientras el juego corre recibe un **id completamente nuevo, cada
vez**. Juega, genera un enemigo, guarda: el estado del enemigo va al archivo bajo un id generado en esa sesión.
Reinicia, genera un enemigo, carga: el enemigo nuevo tiene otro id, no encuentra nada en el archivo, y se queda
con su estado por defecto. El estado antiguo se queda en el archivo, inalcanzable, para siempre.

La solución es darle al objeto generado un id que tú controles, en el momento de generarlo:

```csharp
using Beasty_SaveSystem;
using UnityEngine;

public class EnemySpawner : MonoBehaviour
{
    public GameObject enemyPrefab;

    public GameObject Spawn(string enemyId, Vector3 position)
    {
        GameObject enemy = Instantiate(enemyPrefab, position, Quaternion.identity);

        // Un id estable, y los componentes a capturar.
        BeastySaveManager.Register(enemy, $"enemy.{enemyId}", enemy.transform);

        return enemy;
    }
}
```

`Register` añade el `BeastySaveable` por ti, configura el id, y asigna la lista de componentes — así que el objeto es
guardable desde ese momento. Hay dos overloads:

```csharp
static BeastySaveable Register(GameObject target, params Component[] components);
static BeastySaveable Register(GameObject target, string id, params Component[] components);
```

El que no tiene id usa el que el objeto ya tenga, lo cual solo es útil para objetos que vinieron
de la escena. **Para cualquier cosa que generes, usa el overload que recibe un id.**

El id tiene que ser algo que puedas reproducir en la siguiente ejecución. `enemy.goblin.3` derivado de los datos de tu
propio juego es estable. `enemy.` más `Guid.NewGuid()` no lo es — es el mismo problema otra vez, ahora en tu
propio código.

Las contrapartes, cuando un objeto desaparece definitivamente:

```csharp
BeastySaveManager.Unregister(gameObject);   // este ya no está
BeastySaveManager.UnregisterAll();          // limpia el registro
BeastySaveManager.SyncSceneSaveables();     // vuelve a escanear la escena en busca de saveables
```

### Dos objetos con el mismo id: el segundo desaparece

Si dos saveables terminan con el mismo id, **el segundo no se registra**. Se registra un error, y
ese objeto queda fuera del guardado sin más aviso — no se escribe, y no se restaura.

Los ids duplicados ocurren cuando copias y pegas un GameObject que ya tiene un id escrito a mano, o cuando generas
dos objetos y pasas el mismo id a `Register`. Si un objeto se niega misteriosamente a persistir, revisa la
consola en busca del error de id duplicado, y luego revisa su id en el inspector.

## Los objetos inactivos se guardan

Un `BeastySaveable` se registra en `OnEnable` y se desregistra en `OnDestroy` — **no** en `OnDisable`.

Así que un objeto que desactivas con `SetActive(false)` sigue en el registro, sigue escribiéndose en el guardado,
y sigue restaurándose al cargar. Ese es el comportamiento que quieres: un enemigo deshabilitado o un panel de UI
cerrado mantiene su estado en lugar de perderlo en el momento en que desaparece.

Destruir el objeto es lo que lo elimina del guardado.

## Varios componentes del mismo tipo

Dos componentes `BoxCollider` en un mismo GameObject se guardan y recuperan bien los dos. Se almacenan por
separado en el archivo (el segundo lleva un sufijo `#1` en su clave) y cada uno se restaura donde corresponde. No
tienes que hacer nada para que esto funcione.

## Guardando y cargando

### Desde un botón, sin código

`SaveAll(string)` y `LoadAll(string)` son métodos `void` que reciben un único string, lo que los hace
conectables directamente al **On Click ()** de un Button uGUI con el nombre del slot escrito en el inspector. Este es
el camino sin código, y está cubierto paso a paso en
[save-without-code.md](/es/docs/beasty-save-system/getting-started/save-without-code/).

### Desde código

```csharp
BeastySaveManager manager = BeastySaveManager.Instance;

SaveResult saved = manager.SaveAllNow("slot1");
if (!saved.Success)
    Debug.LogError($"Save failed: {saved}");

LoadResult loaded = manager.LoadAllNow("slot1");
if (!loaded.Success)
    Debug.LogError($"Load failed: {loaded}");
```

`SaveAllNow` y `LoadAllNow` son los que **devuelven un resultado**. Úsalos siempre que quieras saber
si funcionó — o sea, siempre, en código de producción. `SaveAllNow` también recibe un diccionario de
metadatos opcional:

```csharp
manager.SaveAllNow("slot1", new Dictionary<string, string>
{
    ["chapter"] = "3",
    ["playtime"] = "01:22",
});
```

`SaveAll` y `LoadAll` hacen el mismo trabajo pero no devuelven nada, porque un `UnityEvent` no puede usar un valor
de retorno. En su lugar almacenan el resultado:

```csharp
manager.SaveAll("slot1");
SaveResult result = manager.LastSaveResult;   // y manager.LastLoadResult después de una carga
```

`manager.DeleteSlot("slot1")` elimina un slot y su backup.

### Los eventos

```csharp
void OnEnable()
{
    BeastySaveManager.Instance.SaveCompleted += OnSaved;
    BeastySaveManager.Instance.LoadCompleted += OnLoaded;
}

void OnDisable()
{
    if (BeastySaveManager.Instance == null) return;
    BeastySaveManager.Instance.SaveCompleted -= OnSaved;
    BeastySaveManager.Instance.LoadCompleted -= OnLoaded;
}

void OnSaved(SaveResult result)
{
    if (result.Success) ShowToast("Game saved");
    else ShowError(result.Message);
}

void OnLoaded(LoadResult result)
{
    if (result.Success) return;
    if (result.BackupAvailable) OfferBackupRestore();
    else ShowError(result.Message);
}
```

`SaveCompleted` y `LoadCompleted` se disparan en cada guardado y carga, tanto desde los botones como desde código.
Son el lugar correcto para poner el toast de "Game saved", y también para ofrecer la copia de seguridad cuando
una carga falla. `LoadResult.BackupAvailable` se rellena en cada resultado de carga, éxito o fallo — consulta
[backups-and-corruption.md](/es/docs/beasty-save-system/guides/backups-and-corruption/).

## Qué termina realmente en el archivo

Un guardado de escena tiene el tipo `Beasty.SaveGroup` y se ve así:

```json
{
  "saveables": {
    "player": {
      "UnityEngine.Transform": { "module": "core", "data": { } }
    },
    "door.cellar": {
      "UnityEngine.BoxCollider":   { "module": "physics3d", "data": { } },
      "UnityEngine.BoxCollider#1": { "module": "physics3d", "data": { } }
    }
  }
}
```

Una entrada por id de saveable, una entrada por componente guardado dentro de él, y el módulo que escribió cada uno. El
sufijo `#1` es el segundo componente del mismo tipo en ese objeto.

Un saveable que está en la escena pero **no tiene datos en el archivo** — un objeto nuevo añadido después de que se escribió el
guardado — se deja intacto, con una advertencia. No es un error, y no hace fallar la carga.

## Marcar un componente que no se puede guardar

La lista **Saved Components** etiqueta cada componente con la capa que puede convertirlo: `core`, un
id de módulo como `ugui`, o `dev` para un convertidor que registraste tú mismo.

Si marcas un componente que nada sabe convertir, el inspector te avisa, y un guardado fallará con
`TypeUnavailable`. Desmárcalo, activa el módulo que necesita
([converter-modules.md](/es/docs/beasty-save-system/reference/converter-modules/)), o escribe un convertidor para él
([custom-converters.md](/es/docs/beasty-save-system/advanced/custom-converters/)).

## Ver también

- [save-without-code.md](/es/docs/beasty-save-system/getting-started/save-without-code/) — la configuración clic por clic
- [save-manager-window.md](/es/docs/beasty-save-system/guides/save-manager-window/) — la ventana del editor
- [components.md](/es/docs/beasty-save-system/reference/components/) — `BeastySaveable` y `BeastySaveManager`, campo por campo
- [what-gets-saved.md](/es/docs/beasty-save-system/guides/what-gets-saved/) — qué campos y tipos se guardan y recuperan correctamente
- [converter-modules.md](/es/docs/beasty-save-system/reference/converter-modules/) — qué almacena cada convertidor
- [strict-vs-tolerant.md](/es/docs/beasty-save-system/guides/strict-vs-tolerant/) — qué hace una carga de escena cuando un componente falla
