---
title: "API de BeastySave"
description: "BeastySave es la fachada estática y el único punto de entrada del sistema de guardado. Cada método recibe un BeastySaveSettings y devuelve un resultado tipado. Nada en est"
---

`BeastySave` es la fachada estática y el único punto de entrada del sistema de guardado. Cada método recibe un
`BeastySaveSettings` y devuelve un resultado tipado. Nada en esta página lanza excepciones, excepto los tres
métodos de registro, que lanzan excepciones ante un error del desarrollador.

## Espacios de nombres

```csharp
using Beasty_SaveSystem;          // BeastySave, BeastySaveable, BeastySaveManager
using Beasty_SaveSystemCore;      // BeastySaveSettings, SaveResult, LoadResult, BeastySaveError,
                                  // IBeastyConverter, ConverterUtil, BeastySaveLog
using Beasty_SaveSystemCore.Json; // JsonNode — necesario solo para migraciones y convertidores personalizados
```

## Nombres de slot

Todo método que recibe un `slot` lo valida. Un slot es un nombre de archivo desnudo. Se rechaza con
`InvalidArgument` cuando está vacío o solo contiene espacios, contiene `/` o `\`, contiene `..`, es una ruta
enraizada, contiene caracteres inválidos en un nombre de archivo, o es un nombre de dispositivo reservado de
Windows (`CON`, `PRN`, `AUX`, `NUL`, `COM1`-`COM9`, `LPT1`-`LPT9`). Los nombres de dispositivo se rechazan en
todas las plataformas, de modo que una carpeta de guardado escrita en Linux se mantiene utilizable en Windows.

## Guardar

```csharp
public static SaveResult Save(object data, string slot, BeastySaveSettings settings,
                              IDictionary<string, string> meta = null)
```

Serializa `data`, lo envuelve en un sobre (envelope) y lo escribe en el slot de forma atómica. `meta` es un
diccionario de strings opcional almacenado en texto plano junto al payload; consulta
[Formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/). Devuelve `SaveResult.Ok()` o un fallo.

Errores: `InvalidArgument` (`data` nulo, `settings` nulo, nombre de slot inválido), `SerializationFailed` (el
objeto no puede convertirse en JSON: un ciclo de referencias, un float `NaN`/`Infinity`, una clave de
diccionario no soportada, un `ulong` mayor que `long.MaxValue`, una referencia a `UnityEngine.Object` en una
clase C# plana), `IoError` (la carpeta no puede crearse, el disco está lleno, el archivo está bloqueado).

```csharp
public static Task<SaveResult> SaveAsync(object data, string slot, BeastySaveSettings settings,
                                         IDictionary<string, string> meta = null)
```

Mismo contrato, con la escritura del archivo realizada de forma asíncrona. La serialización y el cifrado
igualmente se ejecutan en el hilo que llama. Mismos códigos de error. Consulta [Guardado asíncrono](/es/docs/beasty-save-system/guides/async-saving/).

## Cargar

```csharp
public static LoadResult<T> Load<T>(string slot, BeastySaveSettings settings)
```

Lee el slot y mapea el payload en un nuevo `T`. En caso de éxito, `Value` contiene el objeto. El `type` del
sobre debe coincidir con `typeof(T).FullName`.

Errores: `InvalidArgument`, `FileNotFound`, `IoError`, `ParseError`, `Corrupt`, `VersionTooNew`,
`DecryptFailed`, `TypeMismatch`, `MigrationFailed`, `FieldMapFailed`.

```csharp
public static Task<LoadResult<T>> LoadAsync<T>(string slot, BeastySaveSettings settings)
```

Mismo contrato, leyendo el archivo de forma asíncrona. Mismos códigos de error.

```csharp
public static LoadResult LoadInto(object target, string slot, BeastySaveSettings settings)
```

Carga el slot sobre un objeto que ya existe, en lugar de crear uno. Esta es la única forma de cargar un
`MonoBehaviour` o cualquier otro `UnityEngine.Object`: nunca se construyen a partir de datos del archivo. El
`type` del sobre debe coincidir con `target.GetType().FullName`.

Errores: los mismos que `Load<T>`, más `InvalidArgument` cuando `target` es nulo.

```csharp
public static Task<LoadResult> LoadIntoAsync(object target, string slot, BeastySaveSettings settings)
```

Mismo contrato, leyendo el archivo de forma asíncrona. Mismos códigos de error.

> **Nota**
> `BeastySaveSettings.Strict` decide qué ocurre con un campo incorrecto: en modo estricto falla toda la carga
> y no aplica nada, en modo tolerante omite el campo y lo reporta en `LoadResult.Warnings`. Consulta
> [Carga estricta vs. tolerante](/es/docs/beasty-save-system/guides/strict-vs-tolerant/).

## Slots

```csharp
public static bool Exists(string slot, BeastySaveSettings settings)
```

Verdadero cuando el archivo del slot está en disco. Falso si `settings` es nulo o el nombre de slot es
inválido. No abre ni valida el archivo.

```csharp
public static bool Delete(string slot, BeastySaveSettings settings)
```

Elimina el archivo del slot y su `.bak`. Devuelve verdadero cuando el archivo del slot en sí fue eliminado.
Best effort: un archivo bloqueado se omite silenciosamente, nunca se lanza una excepción.

```csharp
public static string[] ListSlots(BeastySaveSettings settings)
```

Nombres de slot en la carpeta de guardado, ordenados en orden ordinal. Las copias de seguridad (`.bak`) y los
archivos temporales en vuelo (`.tmp`) quedan excluidos. Devuelve un array vacío cuando la carpeta no existe.

```csharp
public static LoadResult<Dictionary<string, string>> ReadMeta(string slot, BeastySaveSettings settings)
```

Lee únicamente el diccionario `meta` del sobre. No verifica el checksum, no descifra y nunca toca el payload,
por lo que funciona en un guardado cifrado sin la clave. Esto es lo que debería llamar una pantalla de
selección de slots. Consulta [Slots y metadatos](/es/docs/beasty-save-system/guides/slots-and-metadata/).

Errores: `InvalidArgument`, `FileNotFound`, `IoError`, `ParseError`, `Corrupt` (la forma del sobre es
inválida).

```csharp
public static SaveResult RestoreBackup(string slot, BeastySaveSettings settings)
```

Copia `<slot>.<ext>.bak` sobre el archivo del slot, de forma atómica. El `.bak` se deja en su lugar, así que
restaurar dos veces es seguro. Consulta [Copias de seguridad y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/).

Errores: `InvalidArgument`, `FileNotFound` (no hay copia de seguridad para ese slot), `IoError`.

## Puntos de extensión

```csharp
public static void RegisterMigration(int fromVersion, int toVersion, Func<JsonNode, JsonNode> migrate)
```

Registra un paso de la cadena de migración, aplicado al `JsonNode` crudo en el momento de carga cuando el
`dataVersion` del archivo es más antiguo que `BeastySaveSettings.DataVersion`. Los pasos se encadenan: de 1 a
2, de 2 a 3, y así sucesivamente. Lanza `ArgumentNullException` cuando `migrate` es nulo y
`ArgumentException` cuando `toVersion` no es mayor que `fromVersion` — estos son errores del desarrollador,
no hechos sobre un archivo. Consulta [Versionado y migraciones](/es/docs/beasty-save-system/guides/versioning-and-migrations/).

```csharp
public static void RegisterConverter(IBeastyConverter converter)
```

Registra un convertidor en la capa `dev`, que tiene la prioridad más alta y por lo tanto sobrescribe tanto a
los convertidores de módulo como a los `core` integrados. Gana el registro más reciente. Lanza
`ArgumentNullException` con un convertidor nulo.

```csharp
public static void RegisterModule(string moduleId, IEnumerable<IBeastyConverter> converters)
```

Registra un grupo con nombre de convertidores. Idempotente por id: registrar el mismo id de nuevo reemplaza
al grupo. El id se escribe en cada entrada de componente de un guardado de escena. Lanza `ArgumentException`
con un id vacío y `ArgumentNullException` con una secuencia nula. Consulta [Convertidores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/).

```csharp
public static bool TryDescribeConverter(Type type, out string source)
```

Verdadero cuando algún convertidor registrado maneja el tipo. `source` es `"dev"`, un id de módulo (por
ejemplo `"physics2d"`) o `"core"`. Esto es lo que usa el editor para advertir sobre componentes sin
convertidor.

> **Advertencia**
> Entrar en Play Mode reinicia los estáticos. Los convertidores registrados con `RegisterConverter`, y toda
> migración, se pierden en cada Play. Regístralos desde un `[RuntimeInitializeOnLoadMethod]`. Los módulos
> registrados con `RegisterModule` sobreviven al reinicio.

## Rutas

```csharp
public static string GetFolderPath(BeastySaveSettings settings)
```

La carpeta absoluta que contiene los archivos de guardado: `{DataPath o Application.persistentDataPath}/{Folder}`.
La carpeta se crea si no existe.

```csharp
public static string GetSlotPath(string slot, BeastySaveSettings settings)
```

La ruta absoluta del archivo de un slot: `{folder}/{slot}.{Extension}`. No crea nada y no valida el nombre
del slot.

## Ver también

- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/)
- [Componentes](/es/docs/beasty-save-system/reference/components/)
- [Formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/)
- [Configuración](/es/docs/beasty-save-system/guides/settings/)
- [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/)
