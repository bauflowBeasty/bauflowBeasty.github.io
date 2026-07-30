---
title: "Componentes"
description: "Los dos MonoBehaviours: BeastySaveable marca un GameObject para guardados de escena; BeastySaveManager contiene la configuración y ejecuta SaveAll y LoadAll."
---

Los dos MonoBehaviours del sistema de guardado. `BeastySaveable` marca un GameObject como parte de un
guardado de escena; `BeastySaveManager` contiene la configuración y hace el guardado. Ambos viven en el
namespace `Beasty_SaveSystem`.

## BeastySaveable

Add Component: `Beasty > Beasty Saveable`. Marcado `[DisallowMultipleComponent]`.

![La lista Saved Components, con cada componente etiquetado con su capa de conversor](/docs-images/beasty-save-system/save-saveable-components-checklist.png)

Marca un GameObject como parte de los guardados de escena: un id estable, más la lista de componentes cuyo
estado captura `SaveAll` y restaura `LoadAll`.

### Campos del inspector

| Campo | Tipo | Significado |
|---|---|---|
| Save Id (`id`) | `string` | Identificador estable que indexa este objeto dentro de los archivos de guardado. Se autogenera y es editable — si lo cambias, los datos guardados bajo el id anterior quedan huérfanos. |
| Saved Components (`components`) | `List<Component>` | Componentes de este GameObject capturados por SaveAll y restaurados por LoadAll. |

El inspector personalizado muestra el Save Id con un botón **New** que lo regenera, y los componentes como
una lista con casillas de cada componente del GameObject, cada uno etiquetado con la capa que lo convierte
(`dev`, un id de módulo, o `core`). Marcar un componente sin convertidor muestra una advertencia: SaveAll
fallará con `TypeUnavailable`.

`Reset` (el estado por defecto del componente, al hacer Add Component) marca el `Transform`.

### Miembros públicos

```csharp
public string Id { get; }
```

El id actual.

```csharp
public IReadOnlyList<Component> SavedComponents { get; }
```

Los componentes seleccionados, sin las entradas destruidas o faltantes.

```csharp
public void EnsureId()
```

Genera un id GUID cuando el id está vacío. Un id existente nunca se sobrescribe.

```csharp
public void SetId(string value)
```

Fija el id. Lanza `ArgumentException` cuando `value` está vacío. Así es como un objeto generado en tiempo de
ejecución se empareja con sus datos entre sesiones: dale el mismo id que le diste la última vez.

### Ciclo de vida

- **Se registra en `OnEnable`. Se desregistra en `OnDestroy`** — no en `OnDisable`. Un objeto desactivado (un
  jefe que aún no ha aparecido, una puerta que solo existe de noche) se sigue guardando y restaurando.
- Un **asset** de prefab no lleva id: se limpia en el editor, porque de lo contrario cada instancia heredaría
  el mismo y todas menos la primera colisionarían. Cada instancia de escena estampa el suyo propio.
- Un objeto que instancias con `Instantiate` en tiempo de ejecución obtiene un **id nuevo cada vez**, así que
  su estado no puede volver a encontrarse en un guardado anterior. Usa
  `BeastySaveManager.Register(go, "a.stable.id", components)` para objetos generados dinámicamente.
- Dos saveables con el mismo id: el segundo **no se registra** y se escribe un error en el log. Queda fuera
  del guardado.

## BeastySaveManager

Add Component: `Beasty > Beasty Save Manager`. Marcado `[DisallowMultipleComponent]`.

El punto de entrada a nivel de escena del flujo sin código. Contiene la configuración, rastrea cada
`BeastySaveable` registrado, y escribe un documento de grupo por guardado.

### Campos del inspector

| Campo | Tipo | Significado |
|---|---|---|
| Settings (`settings`) | `BeastySaveSettings` | Ubicación, cifrado, copias de seguridad, carga estricta y versión de datos usados por SaveAll/LoadAll. |
| Logs (`logs`) | `BeastySaveLogMode` | Cuánto imprime el save system: `Auto` (activo en el editor y en builds de desarrollo, apagado en release), `On`, `Verbose`, `Off`. Se aplica en `OnEnable` y `OnValidate`, así que cambiarlo en Play surte efecto al momento. Consulta [Logging](/es/docs/beasty-save-system/guides/logging/). |

Cada campo de `BeastySaveSettings` está documentado en [Configuración](/es/docs/beasty-save-system/guides/settings/).

### Instancia y estado

```csharp
public static BeastySaveManager Instance { get; }
public BeastySaveSettings Settings { get; }
public SaveResult LastSaveResult { get; }
public LoadResult LastLoadResult { get; }
```

`Instance` se asigna en `OnEnable` y se limpia en `OnDisable`. Un segundo manager en la escena registra una
advertencia en el log y no toma el control. `LastSaveResult` y `LastLoadResult` guardan el resultado del
`SaveAll`/`LoadAll` más reciente, para una UI que consulta en lugar de suscribirse.

```csharp
public event Action<SaveResult> SaveCompleted;
public event Action<LoadResult> LoadCompleted;
```

Se disparan después de cada `SaveAll` y `LoadAll` con el resultado tipado.

### Guardar y cargar

```csharp
public void SaveAll(string slot)
public void LoadAll(string slot)
```

**Compatibles con UnityEvent.** Reciben un único string y devuelven void, así que puedes conectarlos
directamente al OnClick de un Button de uGUI con el nombre del slot escrito en el inspector, sin escribir
ni una línea de C#. El resultado llega a través de `SaveCompleted`/`LoadCompleted`,
`LastSaveResult`/`LastLoadResult`, y el log. Consulta [Guardar sin código](/es/docs/beasty-save-system/getting-started/save-without-code/).

```csharp
public SaveResult SaveAllNow(string slot, IDictionary<string, string> meta = null)
public LoadResult LoadAllNow(string slot)
```

Las mismas operaciones, devolviendo el resultado tipado directamente. `meta` es el diccionario de texto plano
que una pantalla de slots vuelve a leer con `BeastySave.ReadMeta`.

```csharp
public void DeleteSlot(string slot)
```

Elimina el archivo del slot y su copia de seguridad. También compatible con UnityEvent.

### El registro de saveables

```csharp
public static BeastySaveable Register(GameObject target, params Component[] components)
public static BeastySaveable Register(GameObject target, string id, params Component[] components)
```

Añade (o reutiliza) un `BeastySaveable` en `target`, fija su selección de componentes, y lo registra. Si no
pasas componentes, se mantiene la selección actual. Ambos lanzan `ArgumentNullException` cuando `target` es nulo;
el segundo lanza `ArgumentException` cuando `id` está vacío.

Usa la **sobrecarga con id para cualquier cosa que generes en tiempo de ejecución**. Sin un id fijado, el
objeto obtiene un GUID nuevo en cada `Instantiate` y su estado guardado nunca puede volver a encontrarse.
Dale un id que sea estable entre sesiones: su punto de aparición, su celda de mapa, su clave de misión.

```csharp
public static void SyncSceneSaveables()
```

Registra cada `BeastySaveable` en las escenas cargadas, **incluidos los de GameObjects inactivos**. Se llama
automáticamente antes de cada captura y cada aplicación. Los saveables se registran desde `OnEnable`, que un
objeto que empieza desactivado nunca ejecuta — sin esto, quedarían fuera del guardado sin aviso.

```csharp
public static void Unregister(GameObject target)
public static void UnregisterAll()
```

`Unregister` descarta un objeto. `UnregisterAll` vacía el registro — para cuando quieres partir de cero
(intercambiar todo el mundo, un fixture de test).

### Incrustar un guardado de escena en tu propio archivo

```csharp
public static SaveResult CaptureGroupNode(out JsonNode node)
public static LoadResult ApplyGroupNode(JsonNode node, bool strict)
```

`CaptureGroupNode` construye el documento de grupo — exactamente lo que escribe `SaveAll` — como un
`JsonNode` en memoria, para que un sistema anfitrión pueda anidar todo el estado de la escena dentro de su
propio archivo de guardado. Devuelve `Ok` con un node nulo cuando no hay nada registrado, o un fallo tipado
que nombra al componente culpable.

`ApplyGroupNode` aplica un node así de vuelta sobre los saveables registrados. Un node nulo o JSON-null es un
éxito sin efecto. Errores: `Corrupt` (la forma del documento es incorrecta), `TypeUnavailable`,
`FieldMapFailed`.

## Ver también

- [Estado de escena](/es/docs/beasty-save-system/guides/scene-state/)
- [Formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/)
- [Módulos de convertidores](/es/docs/beasty-save-system/reference/converter-modules/)
- [La ventana Save Manager](/es/docs/beasty-save-system/guides/save-manager-window/)
