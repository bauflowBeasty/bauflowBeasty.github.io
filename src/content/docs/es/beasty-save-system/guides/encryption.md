---
title: "Encriptación"
description: "El sistema de guardado puede encriptar un archivo de guardado para que un jugador no pueda abrirlo en un editor de texto y cambiar su oro a 999999. Esta página muestra cómo activarla y qué vale de verdad."
---

El sistema de guardado puede encriptar el contenido de un archivo de guardado para que un jugador no pueda abrirlo en un
editor de texto y cambiar su oro a 999999. Esta página muestra cómo activarla, y es honesta sobre lo que realmente vale.

## Lee esto primero

> **Advertencia**
> Esto es ofuscación contra la edición casual de guardados. **No es seguridad.** La clave que encripta el guardado
> viene incluida dentro de tu juego, y cualquiera lo bastante decidido puede extraerla del build. Trata un guardado
> encriptado como una puerta cerrada con la llave debajo del felpudo: detiene al curioso, no al motivado.
>
> Nunca confíes en ella para proteger nada que importe. En particular, no trates un guardado encriptado como una
> medida anti-trampas en un juego multijugador — si un valor debe ser fiable, tiene que validarse en un
> servidor que tú controles, no almacenarse en el disco del jugador.

Esa es toda la advertencia, y aplica a cualquier función de encriptación de guardados de cualquier asset, no solo
a este. Es la consecuencia de enviarle la clave al atacante dentro del propio juego. Dicho esto, aun así vale la
pena activarla: convierte la edición casual de guardados en una molestia en lugar de un trabajo de cinco segundos,
y evita que tu archivo de guardado sea una lista en texto plano llena de spoilers de cada capítulo de tu juego.

## Activarla

Dos campos en [BeastySaveSettings](/es/docs/beasty-save-system/guides/settings/):

| Campo | Configúralo a |
|---|---|
| `Encrypted` | `true` |
| `EncryptionKey` | Un string propio |

En el inspector, están en el componente `BeastySaveManager`. En código:

```csharp
using Beasty_SaveSystemCore;

var settings = new BeastySaveSettings
{
    Encrypted     = true,
    EncryptionKey = "the-brass-lantern-hums-at-dusk",
};
```

Eso es todo. `Save`, `Load`, `SaveAll` y `LoadAll` se comportan exactamente igual que antes.

## Qué hace

El payload se encripta con AES-256 (CBC). La clave puede ser **cualquier string no vacío** — no tiene
que tener 32 caracteres, ni ser hexadecimal, ni nada por el estilo. Escribas lo que escribas, se hashea con
SHA-256 para producir la clave de 256 bits.

Para cada guardado se genera un vector de inicialización aleatorio de 16 bytes nuevo, que se almacena junto al
ciphertext. La consecuencia práctica: guardar los mismos datos dos veces produce dos archivos distintos. Esto es
correcto e intencional. No compares archivos de guardado byte por byte para decidir si algo cambió.

Lo que **no** está encriptado:

- El envelope — la versión del contenedor, la versión de datos, el nombre del tipo, el checksum.
- El diccionario `meta`.

Los metadatos se quedan en texto plano a propósito, para que una pantalla de selección de slot pueda mostrar el capítulo y el tiempo de juego de
cada slot sin desencriptar nada. Ese trade-off se explica en
[Slots y metadatos](/es/docs/beasty-save-system/guides/slots-and-metadata/). También significa que los metadatos son el lugar equivocado para cualquier cosa que
prefieras que el jugador no lea.

## Si dejas la clave vacía

La encriptación funciona igual, pero recibes una advertencia:

```text
Encryption is on but EncryptionKey is the shared default that ships with Beasty Save System:
every copy of the asset holds the same key, so anyone can decrypt your players' saves. Set
BeastySaveSettings.EncryptionKey (on the BeastySaveManager, or on the settings you pass to
BeastySave) to a string of your own before shipping.
```

Un `EncryptionKey` vacío usa como respaldo una clave por defecto, que es una constante pública del paquete. Cada
copia del asset contiene el mismo string. La encriptación sigue funcionando, pero cualquier otro dueño del asset
puede desencriptar los guardados de tus jugadores sin ningún esfuerzo.

La advertencia aparece una vez por sesión, solo en el editor y en builds de desarrollo. En los builds de release ni
siquiera se compila — a un jugador que lea su propio archivo de log no se le debería decir que el candado de sus
guardados es público.

Configura tu propia clave. Cualquier string sirve. Hazlo antes de publicar, no después: la siguiente sección
explica por qué.

## El flag Encrypted debe coincidir con el archivo

Un archivo de guardado no anuncia si está encriptado. La configuración `Encrypted` decide cómo se lee el
archivo, y ambos deben coincidir.

- Un juego con `Encrypted = true` **se niega a cargar un guardado en texto plano**. Falla con `DecryptFailed` y
  el mensaje "This save is not encrypted, but this game only loads encrypted saves."
- Un juego con `Encrypted = false` tampoco puede leer un guardado encriptado. La carga falla.

El rechazo es deliberado, no un descuido. Si un juego encriptado aceptara alegremente guardados en texto plano,
cualquiera podría escribir uno a mano y el juego lo cargaría — y la encriptación no protegería
nada en absoluto.

Lo mismo aplica a la clave en sí: cambia la clave y los guardados antiguos fallan con `DecryptFailed`, exactamente
como si hubieran sido escritos por otro juego.

> **Advertencia**
> Activar la encriptación (o cambiar la clave) a mitad de producción invalida todos los guardados existentes.
> A los jugadores que ya tengan tu juego se les rechazarán sus guardados. Decide esto antes de publicar.

## Si de todos modos tienes que cambiar

Tienes dos opciones.

**Migrar al cargar.** Prueba primero la configuración actual. Si la carga falla con `DecryptFailed`, vuelve a
intentarlo con una copia de las settings en texto plano y, si funciona, reescribe el guardado encriptado ahí
mismo. El jugador carga un guardado antiguo una vez, y a partir de ahí es un guardado nuevo.

```csharp
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;

public sealed class SaveGateway
{
    private readonly BeastySaveSettings _encrypted = new BeastySaveSettings
    {
        Encrypted     = true,
        EncryptionKey = "the-brass-lantern-hums-at-dusk",
        DataVersion   = 2,
    };

    public LoadResult<PlayerData> Load(string slot)
    {
        LoadResult<PlayerData> result = BeastySave.Load<PlayerData>(slot, _encrypted);
        if (result.Success || result.Error != BeastySaveError.DecryptFailed)
            return result;

        // El archivo es anterior a la encriptación. Léelo como texto plano, con settings que
        // coincidan con él en todo lo demás.
        var legacy = new BeastySaveSettings
        {
            Encrypted   = false,
            DataVersion = _encrypted.DataVersion,
        };

        LoadResult<PlayerData> plain = BeastySave.Load<PlayerData>(slot, legacy);
        if (!plain.Success)
            return plain;

        // Reescribe el slot encriptado. El archivo en texto plano rota hacia el .bak, así que nada se
        // pierde si resulta que este build es el que tiene el bug.
        BeastySave.Save(plain.Value, slot, _encrypted);
        return plain;
    }
}
```

Mantén `Folder`, `Extension`, `DataPath` y `DataVersion` idénticos entre los dos objetos de settings.
Solo `Encrypted` y `EncryptionKey` deben diferir. De lo contrario no estás leyendo el mismo archivo.

Ten en cuenta que `DecryptFailed` es también el código para "clave incorrecta", así que este fallback cubre un cambio de
clave además de activar la encriptación. Si estás rotando una clave, las settings de fallback necesitan la clave
**antigua**, no `Encrypted = false`.

**O conserva ambas.** Publica la actualización con `Encrypted = false` para los guardados antiguos y encripta solo los nuevos, usando
dos objetos de settings y un marcador en los metadatos para distinguirlos. Es más código y más maneras de
equivocarse. Mejor quédate con la migración.

## Ver también

- [Settings](/es/docs/beasty-save-system/guides/settings/) — cada campo, incluyendo `Encrypted` y `EncryptionKey`
- [Slots y metadatos](/es/docs/beasty-save-system/guides/slots-and-metadata/) — por qué `meta` se queda en texto plano
- [Copias de seguridad y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/) — qué significa un resultado `Corrupt`
- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) — `DecryptFailed` y el resto
- [El formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/) — dónde se ubica el ciphertext en el archivo
