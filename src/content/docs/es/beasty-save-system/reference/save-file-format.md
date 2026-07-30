---
title: "Formato del archivo de guardado"
description: "El formato en disco: sobre, documento de grupo, pipeline de escritura y comprobaciones de carga. Para inspeccionar guardados y crear herramientas."
---

El formato en disco, por si quieres inspeccionar un guardado, escribir una herramienta que lo lea o
entender qué hace exactamente el pipeline. No necesitas esta página para usar el paquete.

## Dónde vive el archivo

```text
{DataPath o Application.persistentDataPath}/{Folder}/{slot}.{Extension}
```

Con la configuración por defecto, eso es `.../Saves/quicksave.save`. Junto a él:

| Archivo | Qué es |
|---|---|
| `<slot>.<ext>` | El guardado. |
| `<slot>.<ext>.bak` | El guardado anterior, rotado en la última sobrescritura. |
| `<slot>.<ext>.<guid>.tmp` | Una escritura en curso. Nunca debería seguir ahí después de una llamada completada. |

El formato es JSON, indentado con dos espacios, UTF-8 **sin BOM**.

## El sobre (envelope)

![Un archivo de guardado abierto en un editor de texto, con los campos del sobre](/docs-images/beasty-save-system/save-file-envelope.png)

```json
{
  "beasty": 2,
  "dataVersion": 1,
  "type": "MyGame.PlayerData",
  "checksum": "9f2a...64 lowercase hex chars...c1",
  "meta": { "level": "3", "playtime": "01:22" },
  "data": {
    "playerName": "Ana",
    "hp": 87,
    "position": { "x": 12.5, "y": 0, "z": -3.25 }
  }
}
```

| Campo | Tipo | Significado |
|---|---|---|
| `beasty` | entero | Versión del contenedor. Actualmente **2**. Un archivo de un contenedor más nuevo falla con `VersionTooNew`. |
| `dataVersion` | entero | Tu `BeastySaveSettings.DataVersion` en el momento de escribir. Es lo que dispara las migraciones. |
| `type` | string | El nombre completo del tipo raíz. |
| `checksum` | string | SHA-256 del payload, como 64 caracteres hexadecimales en minúscula. |
| `meta` | object | Diccionario de strings opcional. Se omite por completo cuando no pasas meta. |
| `data` | object, o string | El objeto serializado. Un string en Base64 cuando el guardado está cifrado. |

### `type` se comprueba, nunca se resuelve

El campo `type` existe **únicamente para validación**: la carga lo compara contra el tipo que solicitaste y
falla con `TypeMismatch` si difieren. **El tipo nunca se instancia a partir del archivo.** Editar un guardado
para que diga `"type": "System.Diagnostics.Process"` no hace que el juego construya uno; hace que la carga
falle con `TypeMismatch`. Un archivo de guardado no puede crear un tipo con solo nombrarlo.

### `meta` es texto plano, incluso cuando el guardado está cifrado

`meta` vive fuera del payload y nunca se cifra. Es a propósito: una pantalla de selección de slots
debe poder mostrar el nombre del capítulo, el tiempo de juego y el nivel de cada slot, y tiene que hacerlo sin
descifrar nada. `BeastySave.ReadMeta` lee este campo y nada más — no verifica el checksum, no descifra, y
nunca toca `data`, así que listar veinte slots cuesta veinte lecturas pequeñas.

> **Advertencia**
> `meta` se lee antes de que se verifique el checksum, y no está cubierto por el cifrado. Trátalo como datos
> de visualización no confiables. Nunca pongas en `meta` un valor que el juego vuelva a leer como estado (una
> puntuación, una moneda, una bandera de desbloqueo) — ponlo en `data`.

### El payload cuando está cifrado

Con `Encrypted = true`, `data` es un string en Base64 de `[IV aleatorio de 16 bytes][texto cifrado
AES-256-CBC]`. El IV es nuevo en cada guardado, así que guardar los mismos datos dos veces produce archivos
distintos. El checksum se calcula sobre el string del texto cifrado, no sobre el JSON plano. El sobre
permanece en texto plano.

El cifrado es ofuscación para desalentar la edición casual del guardado, no seguridad: la clave viaja dentro
de tu juego y puede extraerse. Consulta [Cifrado](/es/docs/beasty-save-system/guides/encryption/).

## El formato de grupo (escena)

Un guardado escrito por `BeastySaveManager.SaveAll` siempre tiene `"type": "Beasty.SaveGroup"`, y su `data`
es un documento de grupo: una entrada por id de saveable, una subentrada por componente.

```json
{
  "saveables": {
    "8f1c9a2b4d7e40f1": {
      "UnityEngine.Transform":   { "module": "core", "data": { "position": { "x": 0, "y": 1, "z": 0 } } },
      "MyGame.Health":           { "module": "core", "data": { "current": 40, "max": 100 } },
      "UnityEngine.BoxCollider": { "module": "physics3d", "data": { "isTrigger": false } },
      "UnityEngine.BoxCollider#1": { "module": "physics3d", "data": { "isTrigger": true } }
    }
  }
}
```

- La clave externa es el `BeastySaveable.Id`.
- La clave interna es el `Type.FullName` del componente.
- `module` registra la capa de convertidor que produjo los datos: `"core"`, un id de módulo, o `"dev"`. Es
  lo que permite que una carga te diga *qué* módulo te falta.
- `data` es lo que sea que ese convertidor escribió.

**El sufijo `#1`** aparece a partir del **segundo** componente del mismo tipo en un GameObject. El primero se
indexa con el nombre de tipo a secas, el segundo `#1`, el tercero `#2`. Varios componentes del mismo tipo en
un objeto sí sobreviven al viaje de ida y vuelta, y cada uno conserva su propio estado. Una clave sin `#` se
lee como índice 0.

## El pipeline de escritura

En orden. Cualquier paso que falle detiene la escritura; nada queda en disco.

1. **Datos nulos** en `Save` -> `InvalidArgument`.
2. **Serializar** el objeto a un `JsonNode` a través del mapper y sus convertidores. Si falla ->
   `SerializationFailed`.
3. **Validar** la configuración y el nombre de slot -> `InvalidArgument`.
4. **Escribir de forma compacta y calcular el checksum.** El nodo se escribe sin indentación, con los
   miembros en orden determinista. Si el cifrado está activo, ese texto se cifra y el checksum se calcula
   sobre el **texto cifrado**; si no, sobre el JSON compacto.
5. **Construir el sobre** y renderizarlo indentado.
6. **Crear la carpeta** si no existe. Si falla -> `IoError`.
7. **Decidir la ruta de la copia de seguridad.** Con `Backup = true`, antes de sobrescribir se comprueba el
   archivo existente contra su propio checksum. **Un slot que no pasa la verificación no se rota al `.bak`**
   — empujar un archivo corrupto a la copia de seguridad destruiría la última copia que el jugador aún
   podría restaurar.
8. **Escritura atómica.** El texto va a un archivo temporal único (`<ruta del slot>.<guid>.tmp`), que luego
   se coloca sobre el slot con `File.Replace` — la misma operación que produce el `.bak`. Si el slot todavía
   no existe, el temporal simplemente se mueve a esa ruta, así que **el primer guardado no crea copia de
   seguridad**. Un cierre inesperado a mitad de la escritura solo puede dañar el temporal desechable; el
   guardado anterior queda intacto. Si falla -> `IoError`.

El nombre del temporal es único por escritura, no por ruta, así que dos escrituras en curso al mismo slot (un
autoguardado que llega mientras el jugador guarda manualmente) no pueden corromperse mutuamente.

## El pipeline de carga

Las comprobaciones, en orden. Cada una corresponde a un código de error.

| # | Comprobación | Error si falla |
|---|---|---|
| 1 | Settings no nulo, nombre de slot válido | `InvalidArgument` |
| 2 | El archivo existe | `FileNotFound` |
| 3 | El archivo puede leerse | `IoError` |
| 4 | El texto se parsea como JSON | `ParseError` |
| 5 | La raíz es un sobre válido (todos los campos requeridos, tipos correctos) | `Corrupt` |
| 6 | `beasty` es igual a la versión de contenedor (2) | `VersionTooNew` |
| 7 | Si el juego espera cifrado, `data` es un string | `DecryptFailed` |
| 8 | El checksum coincide con el payload | `Corrupt` |
| 9 | El payload se descifra, y descifra a JSON válido | `DecryptFailed` |
| 10 | `type` coincide con el tipo solicitado | `TypeMismatch` |
| 11 | `dataVersion` no es más nuevo que el del juego | `VersionTooNew` |
| 12 | Las migraciones ponen al día un `dataVersion` más antiguo | `MigrationFailed` |
| 13 | Los datos se mapean sobre el objeto | `FieldMapFailed` |

Dos detalles que conviene saber:

- **La comprobación 7 se ejecuta antes que el checksum.** Que el payload sea texto cifrado o no lo decide tu
  configuración, no la forma del archivo. Un juego con el cifrado activo rechaza de entrada un guardado en
  texto plano — el checksum no lleva ningún secreto, así que de lo contrario un guardado escrito a mano
  pasaría sin problema.
- `LoadResult.BackupAvailable` viene completo en **todos** los resultados de carga, con éxito o sin él, así
  que puedes ofrecer restaurar la copia en cualquiera de las comprobaciones. Un slot que falta se registra
  como advertencia, no como error: las pantallas de slots consultan todo el tiempo.

## Utilidades de slot

| Llamada | Comportamiento |
|---|---|
| `Exists` | Solo comprueba que el archivo exista. No lo abre. |
| `Delete` | Elimina el slot **y** su `.bak`. |
| `ListSlots` | Orden ordinal. Excluye `.bak` y `.tmp`. |
| `ReadMeta` | Solo el sobre. Funciona en un guardado cifrado sin la clave. |
| `RestoreBackup` | Copia el `.bak` sobre el slot de forma atómica y **deja el `.bak` donde está**. Si no hay copia de seguridad -> `FileNotFound`. |

## Ver también

- [API de BeastySave](/es/docs/beasty-save-system/reference/api-beastysave/)
- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/)
- [Copias de seguridad y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/)
- [El motor JSON](/es/docs/beasty-save-system/reference/json-engine/)
