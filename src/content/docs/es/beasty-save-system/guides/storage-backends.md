---
title: "Backends de almacenamiento"
description: "A dónde van los guardados: archivos locales por defecto, una base de datos en la nube si la eliges, y guardados por usuario en ambos casos."
---

Cada llamada de guardado pasa por un **backend de almacenamiento**: la pieza que de verdad conserva el
texto. Por defecto es el sistema de archivos local — la carpeta, los `.bak`, todo lo que describen las
demás guías. Elige otro backend y las mismas llamadas, los mismos botones y la misma pantalla de slots
escriben en una base de datos en la nube. Esta página explica cómo elegir uno, qué cambia al hacerlo, y de
quién pasan a ser los guardados.

## El desplegable Storage

![El desplegable Storage del Beasty Save Manager, con los backends registrados](/docs-images/beasty-save-system/save-storage-dropdown.png)

Selecciona tu `BeastySaveManager` (o abre la ventana Save Manager) y mira **Storage**. Lista cada backend
registrado en el proyecto:

| Entrada | Id | Viene con |
|---|---|---|
| **Local file** | `local` (guardado como un `StorageId` vacío) | El asset. Siempre presente. |
| **Firebase Firestore** | `firestore` | El asset, compilado cuando el SDK de Firebase está presente. |
| **Firebase Realtime Database** | `realtime-db` | El asset, compilado cuando el SDK de Firebase está presente. |

Sin el SDK de Firebase en el proyecto, el desplegable muestra solo **Local file** — las entradas de nube
aparecen solas en cuanto se importa el SDK. Consulta
[firebase.md](/es/docs/beasty-save-system/guides/firebase/) para esa configuración, y
[custom-backends.md](/es/docs/beasty-save-system/advanced/custom-backends/) para registrar un backend
propio.

Si el id guardado nombra un backend que **no** está disponible — se quitó el SDK, el módulo no compiló —
el desplegable lo muestra como `<id> (not available)` con una advertencia, y cada guardado y carga falla
con el error tipado `BackendUnavailable` hasta que arregles el módulo o elijas otro backend. Nada falla en
silencio.

Desde código, la elección es un campo de las settings:

```csharp
var settings = new BeastySaveSettings { StorageId = "firestore" };
```

También existe `BeastySaveSettings.Storage` — una **instancia** de backend asignada desde código, no
serializada — que gana sobre `StorageId` cuando está asignada. Úsala para tests y para backends que
construyes tú mismo.

## Qué cambia con un backend en la nube

La API no cambia. Lo que cambia está por debajo:

- **Los guardados se almacenan por usuario**, no por máquina. Un jugador inicia sesión (de forma anónima
  por defecto, con Firebase) y sus guardados viven bajo su id de usuario — en cualquier dispositivo.
- **Todo es asíncrono.** Una ida y vuelta a una base de datos no puede bloquear el hilo principal, así que
  la API síncrona se niega con `BackendRequiresAsync` y los gemelos asíncronos hacen el trabajo. Los
  puntos de entrada para UnityEvent del manager se enrutan solos — mira el Save Mode más abajo.
- **Los campos de archivo dejan de aplicar.** `Folder`, `Extension` y `DataPath` describen archivos
  locales; el editor los deshabilita y lo dice. `BeastySave.GetFolderPath`/`GetSlotPath` siguen
  describiendo solo la disposición local.
- **La exploración de slots en la ventana Save Manager es solo local.** Una lista de slots en la nube
  depende de quién tenga la sesión iniciada; inspecciona los guardados en la nube desde la consola del
  propio backend.

Las copias de seguridad siguen existiendo — un backend en la nube conserva la versión anterior de cada
slot en su propio almacenamiento, y `RestoreBackupAsync` la restaura — y el sobre es byte a byte el mismo
que escribe un guardado a archivo: checksum, versiones, cifrado opcional, migraciones al cargar.

## Save Mode

Los puntos de entrada del manager pensados para UnityEvent — `SaveAll`, `LoadAll`, `DeleteSlot`, los que
llama un botón uGUI — necesitan una política, porque un botón no puede hacer `await`. Esa política es el
**Save Mode**, junto al desplegable Storage:

| Modo | Qué hace |
|---|---|
| `Synchronous` (por defecto) | Bloquea hasta terminar, exactamente como antes. |
| `Asynchronous` | Corre en segundo plano; el resultado llega por `SaveCompleted`/`LoadCompleted` y `LastSaveResult`. |

Los backends en la nube son asíncronos por naturaleza, así que con uno activo el desplegable queda fijado
en `Asynchronous`. Si una escena configurada para archivos locales cambia a un backend en la nube con el
Save Mode todavía en `Synchronous`, la operación se enruta de forma asíncrona igualmente — nunca se pierde
nada — y se registra una advertencia una vez por sesión:

> Save Mode is Synchronous but the active storage backend is asynchronous-only; routing through the
> asynchronous path so the operation is not lost (results arrive via SaveCompleted/LoadCompleted). Set
> Save Mode to Asynchronous to acknowledge this.

A quien llama desde código el Save Mode no le afecta: `SaveAllNow`/`LoadAllNow` y sus gemelos `*NowAsync`
eligen explícitamente. Consulta [async-saving.md](/es/docs/beasty-save-system/guides/async-saving/).

## De quién son estos guardados

Un backend por usuario necesita saber quién es el usuario. Eso es un **proveedor de usuario** — un objeto
pequeño que responde una sola pregunta: «¿cuál es el id del usuario actual?».

- Con los módulos de Firebase en el proyecto, un proveedor se registra solo: un usuario de Firebase con
  la sesión ya iniciada se usa tal cual, y si no lo hay, el primer guardado inicia sesión **de forma
  anónima**. Cero configuración.
- Desde código, asigna `BeastySaveUsers.Provider` para controlar la identidad tú mismo — tu propio
  sistema de cuentas, un id de plataforma. Un proveedor asignado por el desarrollador gana sobre el del
  módulo.
- Sin ningún proveedor, un guardado en la nube falla con el error tipado `AuthRequired` — un backend
  remoto se niega a adivinar de quién es el guardado que escribe.

El inspector del manager muestra el proveedor resuelto y el usuario actual en su tarjeta de estado, así
que puedes ver de un vistazo a quién pertenecerán los guardados.

**Los archivos locales también pueden ser por usuario.** Activa `ScopeByUser` y los guardados locales caen
en una subcarpeta por usuario — `<Folder>/<userId>/` — siempre que haya un proveedor registrado. Útil en
máquinas compartidas, y para mantener la disposición local consistente con la de la nube.

## Los errores que añade esta página

Cuatro errores tipados existen porque los backends existen:

| Error | Cuándo |
|---|---|
| `BackendRequiresAsync` | Una llamada síncrona llegó a un backend solo asíncrono. Usa el gemelo asíncrono. |
| `BackendUnavailable` | `StorageId` nombra un backend cuyo módulo no compiló. |
| `AuthRequired` | Un backend remoto no pudo resolver un usuario. |
| `NetworkError` | La operación en la nube falló por el camino. |

Cada uno está diagnosticado en
[results-and-errors.md](/es/docs/beasty-save-system/reference/results-and-errors/).

## Ver también

- [firebase.md](/es/docs/beasty-save-system/guides/firebase/) — configurar los dos backends en la nube
- [async-saving.md](/es/docs/beasty-save-system/guides/async-saving/) — la API asíncrona que exige la nube
- [settings.md](/es/docs/beasty-save-system/guides/settings/) — `StorageId` y `ScopeByUser` entre el resto
- [custom-backends.md](/es/docs/beasty-save-system/advanced/custom-backends/) — escribir un backend propio
- [results-and-errors.md](/es/docs/beasty-save-system/reference/results-and-errors/) — los cuatro errores de backend
