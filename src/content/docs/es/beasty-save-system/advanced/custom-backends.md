---
title: "Backends de almacenamiento personalizados"
description: "Implementa IBeastySaveStorage, regístralo en BeastySaveStorageRegistry, y todo el pipeline de guardado — sobre, checksum, cifrado — corre sobre tu almacenamiento."
---

Un backend de almacenamiento mueve **texto** de sobre dentro y fuera de los slots — nada más. La
integridad es trabajo del pipeline: para cuando tu backend ve un guardado, ya es un sobre terminado
(checksum, versiones, cifrado opcional), y todo lo que se lee de vuelta pasa por la misma validación que
recibe un archivo. Esta página es el contrato para escribir uno: la interfaz, el registro, y el punto de
extensión de identidad de usuario.

## La interfaz

```csharp
namespace Beasty_SaveSystemCore
{
    public interface IBeastySaveStorage
    {
        bool SupportsSynchronous { get; }

        // Síncronos — solo se llaman cuando SupportsSynchronous es true
        void Write(SlotRef slot, string text, bool rotateBackup);
        string Read(SlotRef slot);              // null = el slot no existe
        bool Exists(SlotRef slot);
        bool Delete(SlotRef slot);              // borra slot Y backup; true si el slot existía
        string[] ListSlots(SlotRef scope);      // scope lleva usuario/ubicación, Slot es null
        string ReadBackup(SlotRef slot);        // null = sin backup
        bool BackupExists(SlotRef slot);

        // Asíncronos — todo backend los implementa
        Task WriteAsync(SlotRef slot, string text, bool rotateBackup);
        Task<string> ReadAsync(SlotRef slot);
        Task<bool> ExistsAsync(SlotRef slot);
        Task<bool> DeleteAsync(SlotRef slot);
        Task<string[]> ListSlotsAsync(SlotRef scope);
        Task<string> ReadBackupAsync(SlotRef slot);
        Task<bool> BackupExistsAsync(SlotRef slot);
    }
}
```

Las reglas por las que vive un backend:

- **`SupportsSynchronous` es el flag de honestidad.** Devuelve `false` y la API síncrona de `BeastySave`
  responde `BackendRequiresAsync` en lugar de llamar a tus miembros síncronos — que entonces pueden
  simplemente lanzar `NotSupportedException`, porque nada los llamará. El enrutado del Save Mode del
  manager lee este flag para decidir cuándo un Save Mode `Synchronous` debe forzarse a la vía asíncrona.
- **Un slot ausente es `null`, no un error.** `Read` y `ReadBackup` devuelven null cuando no hay nada; el
  pipeline lo convierte en `FileNotFound`.
- **`rotateBackup` es tu señal para conservar la versión anterior.** Cuando es true, el texto que el slot
  guarda ahora mismo se convierte en el backup antes de que aterrice el texto nuevo. `Delete` elimina el
  slot **y** su backup.
- **Los fallos tipados se lanzan, una vez.** Lanza `BeastySaveStorageException(code, message)` para
  aflorar un error tipado — `AuthRequired`, `NetworkError`, el que encaje. Cualquier **otra** excepción el
  pipeline la trata como `IoError`. En ambos casos quien llama recibe un resultado, nunca una excepción.

## SlotRef

Cada miembro recibe un `SlotRef` — dónde vive un guardado, sin asumir backend:

```csharp
public readonly struct SlotRef
{
    public string Slot      { get; }  // null en operaciones de ámbito (ListSlots)
    public string UserId    { get; }  // null cuando no hay separación por usuario
    public string Folder    { get; }
    public string Extension { get; }
    public string DataPath  { get; }
}
```

Tu backend decide cómo materializarlo: el backend local construye una ruta de archivo con `DataPath`,
`Folder` y `Extension` (un nivel más abajo cuando `UserId` está presente); los backends de Firebase
construyen una ruta de base de datos tipo `users/{uid}/saves/{slot}` e ignoran los campos de archivo. Usa
lo que encaje con tu almacenamiento e ignora el resto.

## El registro

```csharp
BeastySaveStorageRegistry.Register("my-backend", "My Backend",
    () => new MyBackendStorage());
```

- El id es lo que almacena `BeastySaveSettings.StorageId`; el nombre para mostrar es lo que enseña el
  desplegable **Storage**. El registro es idempotente — la última llamada para un id gana — y `"local"`
  (`BeastySaveStorageRegistry.LocalId`) siempre está presente.
- Registra desde la inicialización de un módulo, para que el backend exista antes de que nada guarde y
  sobreviva a las recargas de dominio:

```csharp
internal static class MyBackendModule
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
#if UNITY_EDITOR
    [UnityEditor.InitializeOnLoadMethod]
#endif
    static void Init() =>
        BeastySaveStorageRegistry.Register("my-backend", "My Backend",
            () => new MyBackendStorage());
}
```

Una vez registrado, el backend aparece en el desplegable Storage automáticamente — el desplegable lo
alimenta el registro (`DescribeAll()`, «local» primero, el resto por id). Un `StorageId` sin registrar
hace fallar cada llamada con `BackendUnavailable`, y el editor avisa en el desplegable y en la tarjeta de
estado.

Para tests, sáltate el registro: asigna una instancia directamente a `BeastySaveSettings.Storage`. Gana
sobre `StorageId` y no se serializa.

## De quién son los guardados: el punto de extensión de usuario

El almacenamiento por usuario necesita una fuente de identidad. Eso es `IBeastyUserProvider`:

```csharp
public interface IBeastyUserProvider
{
    // Garantiza que existe una sesión (p. ej. inicio de sesión anónimo) y devuelve el id de usuario.
    // Lanza BeastySaveStorageException(AuthRequired, ...) cuando no puede establecerse una sesión.
    Task<string> GetUserIdAsync();

    // El id de usuario actual, o null cuando aún no hay sesión. Nunca inicia sesión.
    string CurrentUserId { get; }
}
```

`BeastySaveUsers` mantiene dos capas, desarrollador sobre módulo:

```csharp
BeastySaveUsers.Provider = new MyAccountProvider(); // override del desarrollador — gana, se reinicia entre sesiones de Play
BeastySaveUsers.SetDefault(provider);               // default de módulo — persiste, idempotente
```

Cómo lo usa el pipeline:

- La **vía asíncrona en un backend remoto** llama a `GetUserIdAsync()` — ahí es donde ocurre el inicio de
  sesión anónimo. Sin ningún proveedor, la llamada falla con `AuthRequired`.
- La **vía síncrona** (archivos locales con `ScopeByUser`) lee solo `CurrentUserId` — nunca inicia la
  sesión de nadie, y un id null significa que el guardado va sin separar.

El módulo de Firebase Auth es exactamente esto: un proveedor registrado con `SetDefault` que reutiliza una
sesión de Firebase existente o inicia sesión de forma anónima. Tu proveedor lo sustituye asignando
`BeastySaveUsers.Provider`.

## Lo que NO implementas

El pipeline sigue siendo dueño de todo lo que está por encima del texto: la validación de nombres de
slot, el sobre, el checksum SHA-256, el cifrado, las migraciones de `DataVersion`, el mapeo estricto o
tolerante, el registro, y los resultados tipados que devuelve cada llamada. Un backend no puede corromper
un guardado hasta hacerlo cargar — una lectura mala falla la misma puerta de checksum que fallaría un
archivo manipulado. Escribe los ocho miembros asíncronos, sé honesto en `SupportsSynchronous`, y el resto
del sistema — incluida la UI del editor — funciona con tu almacenamiento sin cambios.

## Ver también

- [Backends de almacenamiento](/es/docs/beasty-save-system/guides/storage-backends/) — la vista de backends para el usuario
- [Firebase](/es/docs/beasty-save-system/guides/firebase/) — los dos backends que vienen con el asset
- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) — los errores tipados que un backend aflora
- [Formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/) — el sobre que tu backend almacena
- [API de BeastySave](/es/docs/beasty-save-system/reference/api-beastysave/) — la fachada delante de todo
