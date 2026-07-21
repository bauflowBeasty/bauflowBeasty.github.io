---
title: "Copias de seguridad y corrupción"
description: "Un archivo de guardado es el tiempo del jugador. Esta página explica qué hace el paquete para que un crash, un corte de luz o un archivo dañado no se lleven ese tiempo, y cómo ofrecer una vuelta atrás."
---

Un archivo de guardado es el tiempo del jugador. Esta página explica qué hace el paquete para que un crash, un
corte de luz o un archivo dañado no se lleven ese tiempo, y cómo ofrecerle al jugador una vuelta atrás cuando
pasa de todos modos.

## Dos defensas

1. **Escrituras atómicas.** Un guardado nunca se escribe encima de sí mismo. Se escribe en otro lugar y se intercambia.
2. **Backups.** La versión buena anterior del slot se conserva como un archivo `.bak`.

Ambas están activadas por defecto. La primera no se puede desactivar. La segunda es el campo `Backup` en
[BeastySaveSettings](/es/docs/beasty-save-system/guides/settings/), que por defecto es `true`.

## Escrituras atómicas: un guardado a medio escribir no puede existir

Cuando guardas en `slot1`, el sistema:

1. Construye el contenido completo del archivo en memoria.
2. Lo escribe en un archivo temporal junto al slot, con un nombre único (`slot1.save.<guid>.tmp`).
3. Reemplaza el archivo del slot con el archivo temporal en una sola operación.

Así, el archivo del slot contiene siempre un guardado completo. Si el juego se cierra, el jugador tira del cable
de alimentación, o el disco se llena a mitad del paso 2, el archivo temporal es la víctima. El
guardado real queda intacto: sigue siendo el último guardado que terminó.

No necesitas hacer nada para conseguir esto. No hay ninguna opción de "guardado seguro" que activar.

> **Nota**
> Esta es una de las razones por las que WebGL no está soportado: el build de navegador no tiene un reemplazo atómico de archivo. Consulta
> [Plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/).

## Backups: la versión anterior, conservada

El paso de reemplazo en una escritura atómica es lo que produce el backup. El archivo que estaba en el slot no
se descarta; se mueve a:

```text
{Folder}/{slot}.{Extension}.bak
```

Con los valores por defecto, guardar sobre `slot1` deja `slot1.save` (el guardado nuevo) y `slot1.save.bak` (el
anterior) lado a lado.

El backup contiene **una** versión: el guardado inmediatamente anterior, no un historial. Cada guardado rota el
archivo actual hacia el `.bak` y sobrescribe lo que hubiera en `.bak`. Si tu juego autoguarda cada
minuto, el backup tiene un minuto de antigüedad. Ese es el comportamiento buscado — es un mecanismo de reparación, no un
sistema de control de versiones. Si quieres que el jugador pueda retroceder más, usa más slots.

### Dos comportamientos que sorprenden a la gente

**El primer guardado de un slot no crea backup.** No había nada en el slot que rotar. Un
`slot1.save` recién creado no tiene ningún `slot1.save.bak` a su lado, y no lo tendrá hasta la segunda vez que guardes
en ese slot. Así que no escribas una UI que asuma que existe un backup. Comprueba `BackupAvailable` (más abajo).

**Un slot dañado nunca se rota hacia el backup.** Antes de que un guardado sobrescriba un slot, el sistema comprueba
si el archivo actualmente en ese slot pasa su propio checksum. Si no lo pasa — el archivo está corrupto —
se descarta en lugar de promoverlo a `.bak`. Esto importa más de lo que suena. Significa que guardar
encima de un archivo roto no destruye la última copia funcional. El jugador puede pulsar "Save" en un slot corrupto
tantas veces como quiera, y el `.bak` bueno de abajo sigue intacto.

Y tampoco ocurre en silencio. En el momento en que el sistema rechaza la rotación, avisa:

```
[BeastySave] 'slot1' failed its checksum; backup NOT rotated (any existing .bak is left untouched).
```

Esa línea en un log significa que el slot en disco está dañado y que el `.bak` puede ser la única copia buena
que queda.

`Delete` es la excepción, y es deliberada: eliminar un slot elimina también su backup. Cuando el
jugador dice "borra este guardado", lo dice en serio.

## Recuperación: qué hacer cuando una carga falla

Una carga fallida te dice si hay una forma de volver. Todo `LoadResult` tiene un flag `BackupAvailable`, y
cuando una carga falla — desde `Load`, `LoadInto`, `ReadMeta` o `LoadAllNow` — ese flag indica si existe un
archivo `.bak` para ese slot. No tienes que ir a buscarlo tú mismo en el disco.

Eso permite un flujo de UI honesto. Cuando una carga falla y existe un backup, dile al jugador la verdad y
ofrécele la reparación:

> Este archivo de guardado está dañado y no se puede cargar. ¿Restaurar la última versión funcional?

`BeastySave.RestoreBackup(slot, settings)` realiza la reparación. Copia el `.bak` sobre el slot, usando
la misma escritura atómica, y **deja el `.bak` en su lugar**. Si la propia restauración se interrumpe, el
backup sigue ahí y el jugador puede intentarlo de nuevo. Si no hay backup, falla con `FileNotFound`.

```csharp
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;
using UnityEngine;

public sealed class SaveLoader : MonoBehaviour
{
    [SerializeField] private ConfirmDialog _dialog;   // tu propia UI
    private BeastySaveSettings _settings;

    public void LoadSlot(string slot)
    {
        LoadResult<PlayerData> result = BeastySave.Load<PlayerData>(slot, _settings);

        if (result.Success)
        {
            Apply(result.Value);
            return;
        }

        if (result.BackupAvailable)
        {
            _dialog.Ask(
                title:   "This save is damaged",
                message: "The save file could not be read. Restore the last working version?",
                onYes:   () => RestoreAndLoad(slot),
                onNo:    () => { });
            return;
        }

        // Nada a lo que recurrir. Dilo con claridad; no finjas que el guardado cargó.
        _dialog.Tell("This save could not be loaded and has no backup.", result.Message);
    }

    private void RestoreAndLoad(string slot)
    {
        SaveResult restored = BeastySave.RestoreBackup(slot, _settings);
        if (!restored.Success)
        {
            _dialog.Tell("The backup could not be restored.", restored.Message);
            return;
        }

        LoadResult<PlayerData> retry = BeastySave.Load<PlayerData>(slot, _settings);
        if (retry.Success)
            Apply(retry.Value);
        else
            _dialog.Tell("The backup could not be loaded either.", retry.Message);
    }

    private void Apply(PlayerData data) { /* … */ }
}
```

Hay dos detalles de ese código que vale la pena copiar.

Comprueba `BackupAvailable` en lugar del código de error. Un guardado puede fallar al cargar por muchas razones —
`Corrupt`, `ParseError`, `IoError`, `FieldMapFailed` — y para la mayoría de ellas el backup es un intento
razonable. Consulta [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) para la lista completa.

Vuelve a cargar después de restaurar, y también maneja el caso de que esa recarga falle. Un backup es un guardado como cualquier
otro; también puede estar dañado. Restaurarlo no garantiza que se abra.

## Corrupción que puedes ver venir

Un resultado `Corrupt` significa que el checksum del archivo no coincide con su contenido. Algo cambió el archivo
después de que el juego lo escribiera: un jugador editándolo a mano, un disco defectuoso, un servicio de
sincronización que resolvió mal un conflicto, una copia a medias a una memoria USB.

El checksum no es una característica de seguridad — un editor decidido puede recalcularlo — pero sí atrapa de forma fiable
el daño accidental, que es lo que realmente destruye los guardados en la práctica.

Hay dos fallos que no son corrupción y que ningún backup va a arreglar:

- `VersionTooNew` — el guardado fue escrito por un build más nuevo de tu juego. Consulta
  [Versionado y migraciones](/es/docs/beasty-save-system/guides/versioning-and-migrations/).
- `DecryptFailed` — el guardado y el juego no están de acuerdo sobre la encriptación. Consulta [Encriptación](/es/docs/beasty-save-system/guides/encryption/).

## Cómo hacerlo desde el editor

La [ventana Save Manager](/es/docs/beasty-save-system/guides/save-manager-window/) lista cada slot en disco con un botón **Restore Backup**
(desactivado cuando no existe ningún `.bak`) y un botón **Delete**, ambos con confirmación previa. Úsala para
probar el flujo de arriba: guarda dos veces, corrompe el archivo del slot en un editor de texto, carga, restaura.

## Ver también

- [Slots y metadatos](/es/docs/beasty-save-system/guides/slots-and-metadata/) — listar slots, y mostrar uno dañado en la UI
- [Settings](/es/docs/beasty-save-system/guides/settings/) — el campo `Backup`
- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) — cada código de error y qué lo causa
- [Logging](/es/docs/beasty-save-system/guides/logging/) — el aviso del checksum de arriba, y todo lo demás que imprime el save system
- [El formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/) — el envelope y el checksum
- [Solución de problemas](/es/docs/beasty-save-system/troubleshooting/)
