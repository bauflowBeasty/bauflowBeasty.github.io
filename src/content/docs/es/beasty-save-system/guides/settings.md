---
title: "Settings"
description: "Cada campo de BeastySaveSettings, su valor por defecto y cuándo cambiarlo: backend de almacenamiento, carpeta, cifrado, backups, carga estricta y versión de datos."
---

`BeastySaveSettings` contiene todas las opciones que usa una llamada de guardado o carga: a qué backend de
almacenamiento va, adónde va el archivo, si está cifrado, si se conserva un backup, qué tan estricta es la
carga, y a qué versión de datos pertenece. Esta página lista cada campo, su valor por defecto, y la razón
por la que lo cambiarías.

## Las settings son por llamada, no por proyecto

No hay ningún settings asset global. Cada método de `BeastySave` recibe un `BeastySaveSettings` como argumento,
y `BeastySaveManager` mantiene uno en su inspector para `SaveAll` y `LoadAll`.

Eso significa que dos guardados en el mismo proyecto pueden comportarse de forma completamente distinta. Un autoguardado puede
ser tolerante, sin cifrar y sin backup, escribiendo a una carpeta `Autosaves`; un guardado manual puede ser estricto,
cifrado y con backup, escribiendo a `Saves`. Nada en el sistema los obliga a coincidir.

```csharp
static readonly BeastySaveSettings Manual = new BeastySaveSettings
{
    Folder = "Saves",
    Encrypted = true,
    EncryptionKey = "your own key",
};

static readonly BeastySaveSettings Auto = new BeastySaveSettings
{
    Folder = "Autosaves",
    Backup = false,
    Strict = false,
};
```

Si nunca escribes C#, trabajas con un solo bloque de settings: el campo **Settings** del componente
`BeastySaveManager`, editado en el inspector o en la ventana Save Manager. Con eso alcanza para la mayoría de los
juegos.

## Los campos

![Los campos de ajustes en el inspector del BeastySaveManager](/docs-images/beasty-save-system/save-settings-inspector.png)

| Campo | Tipo | Por defecto | Qué hace |
|---|---|---|---|
| `Folder` | string | `"Saves"` | Subcarpeta bajo `DataPath` que contiene los archivos de guardado. |
| `Extension` | string | `"save"` | La extensión del archivo, **sin** el punto. |
| `DataPath` | string | vacío | Ruta base absoluta. Vacío significa `Application.persistentDataPath`. |
| `Encrypted` | bool | `false` | Cifra el payload de datos con AES-256. |
| `EncryptionKey` | string | vacío | La clave. Vacío significa la clave por defecto compartida que viene con el asset. |
| `Backup` | bool | `true` | Conserva el archivo anterior como `<slot>.<ext>.bak` al sobrescribir un slot. |
| `Strict` | bool | `true` | Carga todo o nada. `false` omite los campos malos y advierte. |
| `DataVersion` | int | `1` | La versión de esquema estampada en cada guardado. Dirige las migraciones. |
| `StorageId` | string | vacío | Qué backend de almacenamiento usan las llamadas. Vacío significa archivos locales. En el editor se dibuja como el desplegable **Storage**. |
| `ScopeByUser` | bool | `false` | Mantiene los archivos locales en una subcarpeta por usuario cuando hay un proveedor de usuario registrado. |
| `Storage` | `IBeastySaveStorage` | `null` | Una instancia de backend asignada desde código. Si está asignada, gana sobre `StorageId`. No se serializa. |

La ruta final de un guardado local es:

```text
<DataPath o persistentDataPath>/<Folder>/<slot>.<Extension>
```

— con un nivel extra, `<Folder>/<userId>/`, cuando el guardado está separado por usuario.

`BeastySave.GetFolderPath(settings)` y `BeastySave.GetSlotPath("slot1", settings)` te dan esas rutas
sin que tengas que armarlas tú. Ojo con sus límites: describen **solo la disposición de archivos
locales** — no se separan por usuario y no dicen nada sobre dónde almacena un guardado un backend en la
nube.

### Folder

Cámbialo para separar distintos tipos de guardado entre sí — `Saves`, `Autosaves`, `Profiles`. Carpetas diferentes
son independientes: `ListSlots` en una nunca ve los archivos de la otra, y un slot llamado `slot1` puede existir en
ambas a la vez.

### Extension

Cosmético. `save` por defecto; `sav`, `dat`, `json` funcionan todos. Sin punto inicial. Cambiarlo en un juego ya publicado
significa que los archivos existentes de tus jugadores quedan invisibles para el nuevo build, así que elígelo antes de publicar.

### DataPath

Déjalo vacío. `Application.persistentDataPath` es la ubicación de escritura por usuario que Unity te da en cada
plataforma, y es donde pertenecen los guardados.

Configúralo cuando tengas una razón específica — una herramienta de editor que escribe dentro de la carpeta del
proyecto, un test que escribe en un directorio temporal. Si lo apuntas a una ruta donde el sistema operativo del
jugador no te deja escribir, lo que consigues es un `IoError`.

### Encrypted

Desactivado por defecto. Actívalo y la sección `data` del archivo se convierte en un blob Base64 en lugar de JSON
legible. El envelope y los metadatos se quedan en texto plano, así que una pantalla de selección de slot sigue funcionando.

Dos cosas que debes saber antes de activarlo:

- **El flag tiene que coincidir con cómo se escribió el archivo.** Con `Encrypted = true` el sistema rechaza cargar un
  guardado en texto plano, y con `Encrypted = false` no puede leer uno cifrado. Cambiar esta configuración en un
  juego ya publicado deja varados todos los guardados existentes.
- **Esto es ofuscación, no seguridad.** Lee [encryption.md](/es/docs/beasty-save-system/guides/encryption/) antes de confiar en ella.

### EncryptionKey

Cualquier string no vacío funciona — de él se deriva una clave AES de 32 bytes con SHA-256. No necesitas una
clave de una longitud concreta.

Déjalo vacío y el sistema usa `BeastySaveSettings.SharedDefaultEncryptionKey`, que **viene incluido en
cada copia del asset**. Cualquiera que posea Beasty Save System tiene ese string. Existe para que el cifrado funcione
de fábrica, no para que publiques con ella. Si el cifrado está activado y no has configurado tu propia clave, el
sistema te avisa una vez en el editor y en los builds de desarrollo.

Configura tu propia clave antes de publicar. Luego lee [encryption.md](/es/docs/beasty-save-system/guides/encryption/), que no oculta que tu clave
también viene incluida dentro de tu juego.

### Backup

Activado por defecto. Cuando un guardado sobrescribe un slot existente, el archivo antiguo se rota a `<slot>.<ext>.bak`
primero. `BeastySave.RestoreBackup` lo devuelve; la ventana Save Manager tiene un botón **Restore Backup** que
hace lo mismo.

Dos comportamientos que vale la pena conocer:

- **El primer guardado de un slot no crea backup.** No había nada que rotar.
- **Un slot cuyo checksum no verifica nunca se rota hacia el backup.** Un archivo corrupto no puede destruir
  tu última copia buena.

Desactívalo solo si guardas tan seguido que el archivo extra sea un coste real — un autoguardado frecuente, por
ejemplo. El valor por defecto viene activado por una buena razón. Consulta [backups-and-corruption.md](/es/docs/beasty-save-system/guides/backups-and-corruption/).

### Strict

Activado por defecto. Una carga estricta es todo o nada: si un campo no se puede leer de vuelta, la carga falla y
**no se aplica nada**. El estado de tu juego se queda exactamente como estaba, y obtienes un resultado de error para mostrarle
al jugador.

El modo tolerante (`Strict = false`) omite el campo que no pudo leer, lo registra en `LoadResult.Warnings`, y
carga el resto.

Publica en modo estricto. Usa el tolerante cuando renombraste un campo a mitad de producción y prefieres perder ese único valor a
perder el guardado. La comparación completa, incluyendo el comportamiento de rollback y una advertencia importante sobre las raíces
de tipo struct, está en [strict-vs-tolerant.md](/es/docs/beasty-save-system/guides/strict-vs-tolerant/).

### DataVersion

La versión de esquema de *tus* datos. Empieza en `1` y se escribe en cada archivo. Cuando cargas un archivo
cuya versión es más baja que la actual, las migraciones registradas se ejecutan en orden para ponerlo al día.

Lo subes cuando cambias la forma de tus datos de guardado de una manera que los archivos antiguos no sobreviven,
y registras una migración para ese paso. Un archivo con una versión **más alta** que tu configuración falla con
`VersionTooNew` — un build antiguo se niega a adivinar qué hacer con un guardado escrito por uno más nuevo, en
vez de corromperlo.

Consulta [versioning-and-migrations.md](/es/docs/beasty-save-system/guides/versioning-and-migrations/).

### StorageId

Vacío por defecto, lo que significa archivos locales — el comportamiento que describe el resto de esta
página. Ponle el id de un backend registrado (`firestore`, `realtime-db`, o un id tuyo) y las mismas
llamadas escriben en ese backend. En el editor el campo se dibuja como el desplegable **Storage**, que
lista cada backend cuyo módulo compiló.

Cuando el id nombra un backend que no está disponible en el proyecto — su módulo no compiló porque falta
el SDK — cada llamada falla con `BackendUnavailable` hasta que el módulo vuelva o el id cambie. Con un
backend en la nube, `Folder`, `Extension` y `DataPath` no aplican: el backend almacena los guardados por
usuario en la nube.

Consulta [Backends de almacenamiento](/es/docs/beasty-save-system/guides/storage-backends/) para elegir
backend y [Firebase](/es/docs/beasty-save-system/guides/firebase/) para la configuración de la nube.

### ScopeByUser

Desactivado por defecto. Actívalo y los guardados **locales** se mantienen en una subcarpeta por usuario
(`<Folder>/<userId>/…`) siempre que haya un proveedor de usuario registrado — útil cuando varias personas
comparten una máquina, o cuando quieres que los guardados locales sigan la misma disposición por usuario
que un backend en la nube usa de todos modos. Los backends en la nube siempre separan por usuario; este
flag solo afecta a los archivos locales.

De quién es el id que se usa lo decide `BeastySaveUsers` — consulta
[Backends de almacenamiento](/es/docs/beasty-save-system/guides/storage-backends/).

## Nombres de slot

El slot es el nombre del archivo sin más, y el sistema lo valida. Un slot rechazado hace que la llamada falle con
`InvalidArgument` y un mensaje que dice exactamente por qué.

Un nombre de slot se rechaza cuando:

| Regla | Ejemplo rechazado | Por qué |
|---|---|---|
| Está vacío o solo espacios en blanco | `""` | No hay nombre de archivo. |
| Contiene un separador de ruta | `saves/slot1`, `saves\slot1` | Podría escribir fuera de la carpeta de guardado. |
| Contiene `..` | `../slot1` | La misma razón. |
| Es una ruta con raíz | `C:\slot1`, `/slot1` | La misma razón. |
| Contiene caracteres que no son válidos en un nombre de archivo | `slot:1`, `slot*` | El sistema operativo no puede crear el archivo. |
| Es un nombre de dispositivo reservado de Windows | `CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9` | El nombre apunta a un dispositivo, no a un archivo — `CON.save` incluido. |

Los nombres de dispositivo de Windows se rechazan en **todas** las plataformas, no solo en Windows. Una carpeta de
guardado escrita en macOS o Linux sigue siendo utilizable si el jugador la copia después a una máquina Windows.

Si tu juego deja que los jugadores nombren sus propios guardados, pasa el nombre por
`BeastySave.Save` y muestra el mensaje `InvalidArgument`, o sanéalo primero. No asumas que un nombre está
bien porque se veía bien en tu máquina.

## Ver también

- [encryption.md](/es/docs/beasty-save-system/guides/encryption/) — los límites reales
- [backups-and-corruption.md](/es/docs/beasty-save-system/guides/backups-and-corruption/) — el archivo `.bak` y cómo restaurarlo
- [strict-vs-tolerant.md](/es/docs/beasty-save-system/guides/strict-vs-tolerant/) — los dos modos de carga
- [versioning-and-migrations.md](/es/docs/beasty-save-system/guides/versioning-and-migrations/) — `DataVersion` en la práctica
- [slots-and-metadata.md](/es/docs/beasty-save-system/guides/slots-and-metadata/) — listar slots y leer sus metadatos
- [results-and-errors.md](/es/docs/beasty-save-system/reference/results-and-errors/) — cada código de error
