---
title: "Resultados y errores"
description: "SaveResult, LoadResult y los diecisiete códigos de BeastySaveError: qué causa cada uno y qué debería hacer tu juego al respecto."
---

Cada llamada de guardado y carga devuelve un resultado tipado que contiene un `BeastySaveError`. Esta página
lista los miembros del resultado y los diecisiete valores de error, con qué causa cada uno y qué debería hacer tu
juego al respecto.

## El principio de diseño

**La API nunca te lanza excepciones.** Un guardado que falló lo dice, y nunca parece un guardado que
funcionó. No hay excepción que capturar, ningún archivo parcialmente escrito que detectar, ningún éxito
silencioso. Comprueba `Success`, y si es falso, lee `Error`.

Los únicos métodos que lanzan excepciones son los de registro (`RegisterMigration`, `RegisterConverter`,
`RegisterModule`): un registro incorrecto es un error en tu código al arrancar, no un problema del archivo,
y debe detenerte de inmediato.

## SaveResult

Devuelto por `Save`, `SaveAsync`, `RestoreBackup`, `RestoreBackupAsync`, `BeastySaveManager.SaveAllNow`,
`BeastySaveManager.SaveAllNowAsync` y `BeastySaveManager.CaptureGroupNode`.

| Miembro | Tipo | Significado |
|---|---|---|
| `Success` | `bool` | Verdadero cuando el archivo está en disco. |
| `Error` | `BeastySaveError` | `None` en caso de éxito. |
| `Message` | `string` | Detalle legible para humanos. Nulo en caso de éxito. |
| `BytesWritten` | `int` | Tamaño del archivo que escribió esta llamada. 0 cuando se desconoce: cualquier fallo, y los éxitos que no escriben archivo (`CaptureGroupNode`, `RestoreBackup`). |
| `SaveResult.Ok(bytesWritten = 0)` | `static SaveResult` | Construye un resultado de éxito. |
| `SaveResult.Fail(error, message)` | `static SaveResult` | Construye un resultado de fallo. |
| `ToString()` | `string` | `"OK"`, o `"{Error}: {Message}"`. |

## SaveResult&lt;T&gt;

Devuelto por `SaveToJson` y `ToJson` — las llamadas de JSON sin archivos, donde el «archivo» es una cadena
que la llamada te entrega. Deriva de `SaveResult` y añade el valor.

| Miembro | Tipo | Significado |
|---|---|---|
| `Value` | `T` | El valor producido — en las llamadas de JSON, el texto del sobre o del payload. Indefinido cuando `Success` es false — no lo leas. |
| `SaveResult<T>.Ok(value, bytesWritten = 0)` | `static SaveResult<T>` | Construye un resultado de éxito. |
| `SaveResult<T>.Fail(error, message)` | `static SaveResult<T>` | Construye un resultado de fallo. |

En las llamadas de JSON, `BytesWritten` es el número de bytes UTF-8 del texto producido — el tamaño que la
cadena ocuparía en disco, aunque no se haya escrito nada.

## LoadResult

Devuelto por `LoadInto`, `LoadIntoAsync`, `BeastySaveManager.LoadAllNow`,
`BeastySaveManager.LoadAllNowAsync` y `BeastySaveManager.ApplyGroupNode`.

| Miembro | Tipo | Significado |
|---|---|---|
| `Success` | `bool` | Verdadero cuando los datos fueron aplicados. |
| `Error` | `BeastySaveError` | `None` en caso de éxito. |
| `Message` | `string` | Detalle legible para humanos. Nulo en caso de éxito. |
| `BackupAvailable` | `bool` | Existe un `.bak` para este slot. Se completa en cada resultado de carga, éxito o fallo. |
| `MigratedFrom` | `int` | La versión de datos **desde la que** se migró este archivo, o 0 si no se ejecutó ninguna migración. Consulta [versioning-and-migrations.md](/es/docs/beasty-save-system/guides/versioning-and-migrations/). |
| `Warnings` | `IReadOnlyList<string>` | Campos y entradas omitidos por una carga tolerante. Nunca nulo; vacío cuando no hay nada que reportar. |
| `LoadResult.Ok(warnings = null)` | `static LoadResult` | Construye un resultado de éxito. |
| `LoadResult.Fail(error, message, backupAvailable = false)` | `static LoadResult` | Construye un resultado de fallo. |
| `ToString()` | `string` | `"OK"`, o `"{Error}: {Message}"`. |

`BackupAvailable` es el indicador sobre el que decidir después de un `Corrupt` o `ParseError`: te dice si
ofrecer al jugador un botón de "restaurar el guardado anterior" servirá de algo.

## LoadResult&lt;T&gt;

Devuelto por `Load<T>`, `LoadAsync<T>`, `ReadMeta`, `ReadMetaAsync`, `LoadFromJson<T>` y `FromJson<T>`.
Deriva de `LoadResult` y añade el valor.

| Miembro | Tipo | Significado |
|---|---|---|
| `Value` | `T` | El objeto cargado. Indefinido cuando `Success` es falso — no lo leas. |
| `LoadResult<T>.Ok(value, warnings = null)` | `static LoadResult<T>` | Construye un resultado de éxito. |
| `LoadResult<T>.Fail(error, message, backupAvailable = false)` | `static LoadResult<T>` | Construye un resultado de fallo. |

## Los códigos de error

`Beasty_SaveSystemCore.BeastySaveError`, en orden de declaración.

| Valor | Lo devuelve | Causa |
|---|---|---|
| `None` | — | Éxito. `Success` es verdadero. |
| `InvalidArgument` | guardar, cargar, todos los métodos de slot | Datos nulos, objetivo nulo, settings nulo, o un nombre de slot inválido. |
| `SerializationFailed` | guardar | El objeto no pudo convertirse en JSON. |
| `IoError` | guardar, cargar | El sistema de archivos rechazó la operación. |
| `FileNotFound` | cargar, `ReadMeta`, `RestoreBackup` | No hay archivo en la ruta del slot (o no hay `.bak`). |
| `ParseError` | cargar, `ReadMeta` | El archivo no es JSON válido. |
| `Corrupt` | cargar, `ReadMeta` | No es un sobre válido, o el checksum no coincide. |
| `DecryptFailed` | cargar | La configuración de cifrado no coincide con el archivo, o la clave es incorrecta. |
| `TypeMismatch` | cargar | El archivo contiene un tipo raíz distinto al que solicitaste. |
| `TypeUnavailable` | guardado de escena, carga de escena | Un componente no tiene convertidor registrado. |
| `VersionTooNew` | cargar | El archivo fue escrito por un contenedor más nuevo o una versión de datos más nueva. |
| `MigrationFailed` | cargar | El archivo es más antiguo y la cadena de migraciones registradas no pudo salvar la brecha. |
| `FieldMapFailed` | cargar | Los datos no pudieron mapearse sobre el objeto. |
| `BackendRequiresAsync` | cada llamada síncrona | El backend de almacenamiento activo es solo asíncrono; usa el gemelo asíncrono. |
| `BackendUnavailable` | guardar, cargar, todos los métodos de slot | `StorageId` nombra un backend cuyo módulo no compiló. |
| `AuthRequired` | guardar, cargar, todos los métodos de slot en un backend remoto | No se pudo resolver un usuario para un backend por usuario. |
| `NetworkError` | guardar, cargar, todos los métodos de slot en un backend remoto | La operación en la nube falló por el camino. |

Las secciones siguientes dan el diagnóstico y la solución para cada uno.

### InvalidArgument

Pasaste algo con lo que la llamada no puede trabajar: `data` es nulo en `Save`, `target` es nulo en
`LoadInto`, `settings` es nulo, o el nombre de slot es rechazado. Un slot es un nombre de archivo a secas; se
rechaza cuando está vacío o solo contiene espacios, contiene `/` o `\`, contiene `..`, es una ruta enraizada,
contiene caracteres inválidos en un nombre de archivo, o es un nombre de dispositivo reservado de Windows
(`CON`, `PRN`, `AUX`, `NUL`, `COM1`-`COM9`, `LPT1`-`LPT9`).

**Qué hacer:** corrige el código que llama. Si el nombre de slot viene del jugador (un guardado con nombre),
valídalo antes de guardar y muéstrale por qué fue rechazado. No se escribió nada.

### SerializationFailed

El grafo de objetos no pudo convertirse en JSON. `Message` nombra la ruta (`$.inventory.items[3].owner`).
Estas son todas las causas posibles:

- Un **ciclo de referencias**. Los datos de guardado deben ser acíclicos.
- Un float `NaN` o `Infinity`. No son números JSON válidos.
- Una **clave de diccionario** que no es un string, primitivo o enum, o una clave nula.
- Un `ulong` mayor que `long.MaxValue`.
- Una **referencia a `UnityEngine.Object`** (un `Sprite`, un `GameObject`, otro componente) en una clase C#
  plana. En un `MonoBehaviour` ese campo se omite en su lugar; en una clase plana es un fallo total.
- En un guardado de escena, un convertidor que lanzó una excepción.

**Qué hacer:** corrige los datos. Rompe el ciclo, sanea el float, guarda un identificador (un string id) en
lugar de la referencia al objeto de Unity. No se escribió nada. Consulta [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/).

### IoError

El sistema de archivos rechazó la operación. El disco está lleno, la carpeta no puede crearse, el archivo
está bloqueado por otro proceso, la plataforma denegó el permiso. `Message` lleva el texto de la excepción
subyacente y la ruta.

**Qué hacer:** dile al jugador que el guardado falló y deja que reintente. No reintentes en bucle.
El archivo de guardado anterior, si lo había, queda intacto: la escritura es atómica, así que una escritura
fallida no puede dejar un archivo a medias.

### FileNotFound

No hay archivo en la ruta del slot. Desde `RestoreBackup`, no hay `.bak` para ese slot.

Esta es una condición esperada y consultable — una pantalla de slots la sondea constantemente — así que se
registra como advertencia, no como error.

**Qué hacer:** trátalo como un slot vacío. Usa `BeastySave.Exists` si quieres preguntar sin producir un
resultado.

### ParseError

El archivo está en disco pero no es JSON válido. `Message` lleva la línea y columna del carácter conflictivo.
Causas: el archivo fue truncado (una build antigua que escribía de forma no atómica, un disco que se llenó a
mitad de la escritura), fue editado a mano de forma incorrecta, o directamente no es un guardado de Beasty.

**Qué hacer:** comprueba `BackupAvailable` y ofrece `BeastySave.RestoreBackup`. Consulta
[Copias de seguridad y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/).

### Corrupt

Dos comprobaciones distintas reportan esto:

- **La forma del sobre es incorrecta.** El archivo se parseó como JSON pero la raíz no es un objeto, o falta
  `beasty`, `dataVersion`, `type`, `checksum` o `data`, o tiene el tipo incorrecto. `Message` nombra el campo.
- **El checksum no coincide.** El SHA-256 del payload no es el registrado en el archivo. El archivo fue
  modificado, o los bytes se corrompieron.

**Qué hacer:** lo mismo que `ParseError`: comprueba `BackupAvailable` y ofrece `RestoreBackup`. Un jugador que
editó su guardado se topará con la comprobación de checksum; esa comprobación está funcionando como debe.

> **Nota**
> Un slot que falla su propio checksum nunca se rota al `.bak` en el siguiente guardado, así que la última
> copia buena permanece restaurable.

### DecryptFailed

Tres comprobaciones reportan esto:

- **`Encrypted = true` pero el archivo está en texto plano.** Un juego que cifra se niega a cargar un
  guardado sin cifrar. El mensaje es "This save is not encrypted, but this game only loads encrypted saves."
  Esto es deliberado: el checksum no lleva ningún secreto, así que sin esta comprobación cualquiera podría
  escribir un guardado a mano.
- **El descifrado lanzó una excepción.** La clave es incorrecta, o el texto cifrado fue manipulado.
- **El texto descifrado no es JSON válido.** Casi siempre una clave incorrecta.

El caso inverso — una configuración en texto plano leyendo un archivo cifrado — vuelve como `Corrupt`, porque
el checksum del texto cifrado no coincide con un hash del texto JSON.

**Qué hacer:** haz que `BeastySaveSettings.Encrypted` y `EncryptionKey` coincidan con cómo se escribió el
archivo. Si activaste el cifrado en una actualización, los guardados antiguos no se pueden leer: mígralos
antes de publicar, o mantén dos objetos de configuración. Consulta [Cifrado](/es/docs/beasty-save-system/guides/encryption/).

### TypeMismatch

El campo `type` del sobre no es igual al nombre completo del tipo que solicitaste. Llamaste a `Load<T>` con
el `T` equivocado, llamaste a `LoadInto` con un objeto de otra clase, o renombraste o moviste la clase desde
que se escribió el guardado (el nombre del tipo incluye el namespace).

**Qué hacer:** carga el tipo que fue guardado. Si renombraste la clase, los archivos antiguos no pueden
coincidir por nombre; mantén el nombre anterior, o lee el archivo con `ReadMeta` más una estrategia de
migración propia.

### TypeUnavailable

Un componente en un guardado de escena no tiene convertidor registrado.

- **Al guardar:** el mensaje es "`<Type>` on '`<object>`' has no registered converter; enable its converter
  module or register a custom IBeastyConverter." No se escribió nada.
- **Al cargar:** el archivo de guardado registra qué módulo escribió cada componente, así que el mensaje lo
  nombra: "The save was written by module '`<id>`' — enable that converter module (or its package) in this
  project." Una carga estricta falla por esto; una carga tolerante advierte y omite la entrada.

La causa más común es que el paquete de Unity que el módulo necesita no está en el proyecto: el assembly del
módulo no compila, así que sus convertidores no existen.

**Qué hacer:** instala el paquete que el módulo necesita, o registra un convertidor personalizado para el
tipo. Consulta [Módulos de convertidores](/es/docs/beasty-save-system/reference/converter-modules/) y [Convertidores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/).

### VersionTooNew

Dos comprobaciones reportan esto:

- **Versión del contenedor.** El campo `beasty` del archivo no es la versión de contenedor que esta build
  entiende (actualmente 2). El archivo viene de un Beasty Save System más nuevo.
- **Versión de datos.** El `dataVersion` del archivo es mayor que `BeastySaveSettings.DataVersion`. El
  guardado fue escrito por una build más nueva de tu juego.

**Qué hacer:** esto es un downgrade, no una corrupción. Dile al jugador que su guardado es de una versión más
nueva del juego y que necesita actualizar. No ofrezcas cargarlo: los datos no encajarían.

### MigrationFailed

El `dataVersion` del archivo es más antiguo que `BeastySaveSettings.DataVersion`, y la cadena de migraciones
registradas no pudo salvar la brecha. Tres causas, cada una nombrada en `Message`:

- "No migration registered from data version `<n>`." — falta un paso.
- "Migration `<n>` -> `<m>` threw: ..." — tu función de migración lanzó una excepción.
- "Migration chain overshot the target: a step landed on version `<n>` but version `<m>` was requested." —
  un paso salta más allá de la versión objetivo.

**Qué hacer:** registra el paso faltante o corregido con `BeastySave.RegisterMigration`, desde un
`[RuntimeInitializeOnLoadMethod]` (Play Mode reinicia el registro). Consulta
[Versionado y migraciones](/es/docs/beasty-save-system/guides/versioning-and-migrations/).

### FieldMapFailed

El archivo fue leído, verificado y descifrado; los datos simplemente no encajan en el objeto. Causas:

- **Un campo falló al convertir** en modo estricto. El mensaje es `Field '<Type>.<field>' failed to load:
  ...` — normalmente un campo cuyo tipo cambió (un `string` se convirtió en `int`), o un campo de tipo de
  valor que falta en el JSON.
- **Un tipo de colección no soportado.** El escritor convierte cualquier `IEnumerable` en un array, pero una
  colección sin `Add`, `Enqueue` o `Push` no se puede volver a leer.
- **Un convertidor lanzó una excepción** al rellenar un componente.
- **En una carga de escena (solo estricta):** un id saveable en el archivo no está presente en la escena —
  "Saveable id '`<id>`' is not present in the scene."

En modo estricto no se aplica nada: `LoadAll` toma una instantánea de cada componente antes de escribirlo y
revierte los ya aplicados, y el mensaje lo indica ("Nothing was loaded: the N component(s) already applied
were restored.").

**Qué hacer:** si la forma de tus datos cambió entre versiones, para eso están las migraciones. Si estás en
plena producción renombrando campos, pon `Strict = false` para que el campo incorrecto se omita y se reporte
en `Warnings` en lugar de fallar la carga. Consulta [Carga estricta vs. tolerante](/es/docs/beasty-save-system/guides/strict-vs-tolerant/).

### BackendRequiresAsync

Una llamada síncrona — `Save`, `Load<T>`, `Exists`, cualquiera — llegó a un backend de almacenamiento que
no puede responder de forma síncrona (una base de datos en la nube). El mensaje es «This storage backend
is asynchronous; use the Async save/load API.» No se intentó nada; la llamada falla antes de tocar el
backend, en lugar de bloquear el hilo principal en una ida y vuelta por red.

Los `SaveAll`/`LoadAll`/`DeleteSlot` del manager nunca producen este error: se enrutan solos a la vía
asíncrona automáticamente.

**Haz esto:** cambia el punto de llamada al gemelo asíncrono (`SaveAsync`, `LoadAsync<T>`,
`ExistsAsync`…). Consulta [Guardado y carga asíncronos](/es/docs/beasty-save-system/guides/async-saving/).

### BackendUnavailable

`BeastySaveSettings.StorageId` nombra un backend que no está registrado. El mensaje es «Storage backend
'`<id>`' is not available. Is its module (and SDK) in the project?» — casi siempre un backend de Firebase
cuyo SDK no está en el proyecto, así que el ensamblado del módulo nunca compiló. El desplegable Storage y
la tarjeta de estado del manager muestran la misma advertencia en el editor.

**Haz esto:** instala el SDK que el módulo necesita (consulta
[Firebase](/es/docs/beasty-save-system/guides/firebase/)), o elige otro backend. Es un problema de
configuración del proyecto, no algo que gestionar en tiempo de ejecución.

### AuthRequired

Un backend remoto almacena los guardados por usuario, y no se pudo resolver ninguno. O no hay ningún
proveedor de usuario registrado («No user provider is registered; remote storage needs one to know whose
save this is.»), o el proveedor no pudo establecer una sesión — con Firebase, normalmente porque el inicio
de sesión anónimo no está habilitado en la consola de Firebase, o la comprobación de dependencias del SDK
falló en el dispositivo.

**Haz esto:** con el módulo de Firebase Auth en el proyecto esto se resuelve solo — el módulo registra un
proveedor que inicia sesión de forma anónima en el primer guardado. Si aun así lo ves, comprueba que el
inicio de sesión anónimo esté habilitado en la consola de Firebase, o registra tu propio proveedor.
Consulta [Backends de almacenamiento](/es/docs/beasty-save-system/guides/storage-backends/).

### NetworkError

La operación en la nube falló por el camino: sin conectividad, un timeout, un rechazo del servidor, o un
guardado almacenado con un trozo ausente («Save '`<slot>`' is missing chunk `<i>` of `<n>`.»). El texto de
la excepción del SDK subyacente está en `Message`.

**Haz esto:** trátalo como el hermano en la nube de `IoError` — dile al jugador que el guardado falló y
déjale reintentar cuando vuelva la conexión. No reintentes en un bucle cerrado.

## Ver también

- [API de BeastySave](/es/docs/beasty-save-system/reference/api-beastysave/)
- [Formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/)
- [Solución de problemas](/es/docs/beasty-save-system/troubleshooting/)
