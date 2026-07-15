---
title: "Solución de problemas"
description: "Síntoma, causa, solución. Busca tu síntoma, lee las dos líneas que siguen y entra al enlace si necesitas la explicación completa."
---

Síntoma, causa, solución. Busca tu síntoma, lee las dos líneas que siguen y entra al enlace si necesitas la
explicación completa.

Antes que nada: **comprueba el resultado**. Cada llamada devuelve un `SaveResult` o un `LoadResult<T>` y
nada en esta API lanza excepciones. Si no estás mirando `result.Success` y `result.Error`, el
sistema ya te dijo qué salió mal y no lo leíste.

```csharp
LoadResult<PlayerData> result = BeastySave.Load<PlayerData>("slot1", settings);
if (!result.Success)
    Debug.LogError(result); // "Corrupt: ...", "DecryptFailed: ...", "FileNotFound: ..."
```

La lista completa de códigos está en [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/).

---

## Mi guardado cargó, pero la referencia al sprite / prefab / componente ha desaparecido

**Causa.** Nunca se guardó. Las referencias a `UnityEngine.Object` — un `Sprite`, un `GameObject`, un
`Material`, otro componente — no se escriben en el archivo, ni en campos ni en colecciones de ellos.

**Esto es intencional, y normalmente no es el problema que crees.** Como la referencia no se
guarda, tampoco se sobrescribe al cargar: lo que conectaste en la escena o en el prefab sigue
ahí, sin tocar. La referencia "desaparecida" casi siempre significa que otra cosa la limpió.

**Solución.** Guarda un **id**, no una referencia. Almacena el string que identifica la cosa, y resuélvelo
tú mismo al cargar:

```csharp
[SerializeField] private string equippedWeaponId;   // guardado
private Weapon _equipped;                           // resuelto a partir del id después de cargar
```

Si tu referencia realmente necesita volver a través del sistema de guardado, los convertidores incorporados que sí
restauran assets (`AudioSource.clip`, `Image.sprite`, materiales de física) los resuelven **por nombre** mediante
`Resources.Load`, que solo funciona para assets dentro de una carpeta `Resources/`. Consulta
[Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/) y [Módulos convertidores](/es/docs/beasty-save-system/reference/converter-modules/).

> **Nota**
> Una excepción que vale la pena conocer: en una clase C# plana — no un MonoBehaviour — un campo que contiene un
> `UnityEngine.Object` no se omite. Hace fallar el guardado con `SerializationFailed`.

---

## El objeto que generé en tiempo de ejecución no recuerda nada

**Causa.** Un `BeastySaveable` en un prefab no tiene id. Cada `Instantiate` genera uno **nuevo**. El
objeto se guarda bajo un id que nunca volverá a existir, así que al cargar no hay nada con qué emparejarlo y
vuelve con los valores por defecto del prefab.

**Solución.** Registra los objetos generados en tiempo de ejecución con un id **estable** que tú controles:

```csharp
GameObject chest = Instantiate(chestPrefab);
BeastySaveManager.Register(chest, "chest.cave.03", chest.GetComponent<Chest>(), chest.transform);
```

El id debe ser el mismo en cada ejecución para el mismo objeto lógico. Derívalo del punto de aparición, la sala, la
misión — cualquier cosa estable. No de `GetInstanceID()`, ni de un contador que dependa del orden de aparición.
Consulta [Estado de la escena](/es/docs/beasty-save-system/guides/scene-state/).

---

## Uno de mis objetos falta silenciosamente del guardado

**Causa.** Un **id duplicado**. Dos componentes `BeastySaveable` con el mismo id: el primero se registra, el
segundo es **rechazado** y queda fuera del guardado por completo. En el juego pasa desapercibido, pero en la
consola no.

**Solución.** Lee la consola. Al registrarse se reporta un error que nombra el id. Luego pulsa **New** en
el inspector del `BeastySaveable` para regenerar el id, o abre
`Tools > Beasty Save System > Save Manager` y mira la lista **Saveables in Scene**, que muestra cada
saveable en la escena (incluyendo los inactivos) con su id.

Lo más común es que pase así: duplicaste un GameObject que ya tenía un `BeastySaveable`, y la copia se llevó
el id consigo. Consulta [Estado de la escena](/es/docs/beasty-save-system/guides/scene-state/).

---

## SaveAll falla con TypeUnavailable

**Mensaje.** `"...has no registered converter; enable its converter module or register a custom
IBeastyConverter."`

**Causa.** Un componente marcado en la lista Saved Components de un `BeastySaveable` no tiene quién lo convierta. La
capa `core` cubre los tipos matemáticos, `Transform`, `Camera`, `Light`, `SpriteRenderer`, `Texture2D` y cualquier
`MonoBehaviour`. Todo lo demás — `Animator`, `AudioSource`, `ParticleSystem`, colliders, `TMP_Text`,
componentes de uGUI — proviene de un módulo convertidor.

**Solución.** Tienes tres opciones:

- **Activa el módulo.** Cada módulo necesita que su paquete de Unity esté en el proyecto (por ejemplo, el
  módulo Physics2D necesita `com.unity.modules.physics2d`). Instálalo y el módulo se compila y se registra
  solo. Consulta [Módulos convertidores](/es/docs/beasty-save-system/reference/converter-modules/).
- **Desmarca el componente.** Si no necesitabas que se guardara su estado, sácalo de la lista.
- **Escribe un convertidor.** Consulta [Convertidores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/).

No tienes que esperar a que falle. El inspector de `BeastySaveable` te avisa en el editor: un componente
marcado sin convertidor se señala, y los demás componentes se etiquetan con la capa que los convierte (`dev`,
un id de módulo, o `core`).

---

## La carga falla con Corrupt

**Causa.** El checksum no coincide. El archivo se editó a mano, se truncó por un cierre inesperado, lo dañó
el disco, o se copió mal. El sobre (envelope) está lo bastante intacto para leerse; el payload no es lo que
dice ser.

**Solución.** Ofrécele al jugador la copia de seguridad. Todo `LoadResult` lleva `BackupAvailable`, tanto en éxito como en
fallo:

```csharp
LoadResult<PlayerData> result = BeastySave.Load<PlayerData>("slot1", settings);
if (!result.Success && result.BackupAvailable)
{
    // Pregunta al jugador primero. Luego:
    BeastySave.RestoreBackup("slot1", settings);
    result = BeastySave.Load<PlayerData>("slot1", settings);
}
```

`RestoreBackup` copia el `.bak` sobre el slot y deja el `.bak` en su lugar. También puedes hacerlo a mano
desde `Tools > Beasty Save System > Save Manager`, que tiene un botón **Restore Backup** por slot.

Un archivo corrupto nunca se rota hacia la copia de seguridad, así que el `.bak` es la última copia que pasó
la verificación. Consulta
[Copias de seguridad y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/).

> **Nota**
> Un error `Corrupt` también puede aparecer antes en la carga, cuando la forma del sobre es incorrecta — un
> documento JSON que se parsea pero no es un guardado de Beasty. La solución es la misma.

---

## La carga falla con DecryptFailed

**Causa.** Una de dos, y son problemas distintos:

1. **El flag `Encrypted` no coincide con el archivo.** `Encrypted = true` rechaza cargar un guardado en texto plano,
   y una configuración en texto plano no puede leer uno encriptado. Este es el caso común: activaste la encriptación
   a mitad de desarrollo y tus guardados existentes están en texto plano.
2. **La clave es incorrecta.** El `EncryptionKey` en `BeastySaveSettings` no es el que se usó para escribir el
   archivo. Ten en cuenta que un `EncryptionKey` vacío no significa "sin clave" — significa la clave
   compartida por defecto.

**Solución.** Haz que la configuración coincida con cómo se escribió el archivo. Si cambiaste la clave o el flag entre
builds, los guardados antiguos son ilegibles y no hay forma de recuperarlos — eso es lo que significa la encriptación.
Decide esto antes de publicar, no después. Consulta [Encriptación](/es/docs/beasty-save-system/guides/encryption/).

---

## La carga falla con VersionTooNew

**Causa.** El guardado fue escrito por un **build más nuevo que el que lo está leyendo**. O bien su `dataVersion` es
más alto que el `DataVersion` en tu `BeastySaveSettings`, o su versión de contenedor es más alta que la que esta
versión entiende.

Las migraciones solo se ejecutan **hacia adelante**. El sistema puede poner al día un guardado antiguo; no
puede bajar de versión uno futuro.

**Solución.** En desarrollo, esto casi siempre significa que un compañero de equipo escribió el archivo con
su build, o que volviste a una versión anterior de tu proyecto. Borra el slot, o sube `DataVersion` para que
coincida.

En un juego publicado, significa que un jugador hizo un downgrade — un guardado en la nube de una versión
más nueva que llega a una instalación más antigua. Manéjalo: comprueba `BeastySaveError.VersionTooNew` y
muestra "Este guardado se hizo con una versión más nueva del juego", no un fallo genérico. Consulta
[Versionado y migraciones](/es/docs/beasty-save-system/guides/versioning-and-migrations/).

---

## Mi carga silenciosamente no hace nada

**Causa.** Casi seguro `FileNotFound`, y no comprobaste el resultado. Un slot que falta se registra como una
**advertencia, no un error** — a propósito, porque las pantallas de selección de slot consultan cada slot
todo el tiempo y un error por cada slot vacío te inundaría la consola.

**Solución.** Comprueba `result.Success`. Siempre.

```csharp
LoadResult<PlayerData> result = BeastySave.Load<PlayerData>("slot1", settings);
if (result.Success)
    Apply(result.Value);
else if (result.Error == BeastySaveError.FileNotFound)
    StartNewGame();          // un slot vacío no es un error
else
    ShowError(result.Message);
```

`BeastySave.Exists(slot, settings)` responde la pregunta directamente si eso es lo único que necesitas. Si
usas el camino sin código `LoadAll`, revisa también `BeastySaveManager.LastLoadResult` y suscríbete a
`LoadCompleted`. Consulta [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) y
[Slots y metadatos](/es/docs/beasty-save-system/guides/slots-and-metadata/).

---

## Funcionó en el editor y se rompió en el build

Dos causas, ambas reales.

**Assets referenciados por nombre.** Los convertidores que restauran un asset — `AudioSource.clip`, `Image.sprite`,
materiales de física — escriben el **nombre** del asset y lo vuelven a resolver al cargar con `Resources.Load`. En el
editor el asset suele estar disponible. En un build, solo se resuelve si vive en una carpeta
**`Resources/`**. Si no se resuelve, la referencia ya conectada en la escena se deja intacta — así que el
objeto carga, pero con el sprite equivocado puesto.

*Solución:* pon esos assets en una carpeta `Resources/`, o deja de depender de que la referencia vuelva a través del
guardado y resuélvela tú mismo a partir de un id.

**Propiedades exclusivas del editor.** `Light.lightmapBakeType` es una API exclusiva del editor. El
convertidor de `Light` la escribe y la lee **solo en el editor**; un build ni la almacena ni la restaura. Un
guardado hecho en el editor lleva ese miembro, un build lo ignora — lo cual es correcto, y es también la
razón de que el tipo de bake de una luz no sobreviva en el player.

Además: `Light.cookie` se escribe por nombre pero **nunca se restaura**, y `MeshCollider.sharedMesh`
directamente no se serializa. Consulta [Módulos convertidores](/es/docs/beasty-save-system/reference/converter-modules/).

---

## Mi convertidor personalizado dejó de funcionar después de pulsar Play

**Causa.** Entrar en Play Mode **reinicia las variables estáticas**. Los convertidores registrados con
`BeastySave.RegisterConverter` y las migraciones registradas con `BeastySave.RegisterMigration` desaparecen en
cada Play. Si los registraste desde un elemento de menú, un callback del editor, o un `Awake` de un
MonoBehaviour que no siempre se ejecuta, no están ahí cuando llega el guardado — y tus datos vuelven en
silencio al comportamiento incorporado.

**Solución.** Regístralos desde un `[RuntimeInitializeOnLoadMethod]`:

```csharp
[RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
private static void Register()
{
    BeastySave.RegisterConverter(new FurnaceConverter());
    BeastySave.RegisterMigration(1, 2, MigrateV1ToV2);
}
```

Los convertidores registrados con `BeastySave.RegisterModule` sobreviven al reinicio — por eso los módulos
incorporados siguen funcionando. Consulta [Convertidores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/).

---

## Nada se guarda en WebGL

**Causa.** WebGL **no está soportado**. La escritura atómica depende de una semántica de sistema de archivos
que el build de navegador no tiene, y las variantes asíncronas están basadas en `Task`.

**Solución.** No la hay, y no existe ninguna opción que lo cambie. Un build de navegador necesita una capa
de persistencia diferente. Consulta [Plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/).

---

## Otros fallos que vale la pena nombrar

| Error | Qué significa |
|---|---|
| `InvalidArgument` | Datos nulos, o un nombre de slot inválido. Se rechazan los nombres de slot que intentan escapar de la carpeta y los nombres de dispositivo de Windows. |
| `SerializationFailed` | Los datos no se pudieron convertir en JSON: un **ciclo** de referencias ("save data must be acyclic"), un valor float `NaN` o `Infinity`, un diccionario con claves no primitivas, un campo `UnityEngine.Object` en una clase C# plana. |
| `IoError` | No se pudo escribir o leer la carpeta o el archivo. Disco lleno, permisos, una ruta que no existe. |
| `ParseError` | El archivo no es JSON válido en absoluto. |
| `TypeMismatch` | El `type` registrado en el archivo no es el tipo que pediste cargar. |
| `MigrationFailed` | Una migración registrada lanzó una excepción, o ninguna cadena de pasos alcanza el `DataVersion` actual. |
| `FieldMapFailed` | Un campo no se pudo mapear. En una carga estricta esto hace fallar toda la carga y **no se aplica nada**. En una carga tolerante habría quedado en una advertencia. |

Consulta [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) para la lista completa de los trece códigos y
[Carga estricta vs. tolerante](/es/docs/beasty-save-system/guides/strict-vs-tolerant/) para la diferencia que marca la configuración `Strict`.

## Ver también

- [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/)
- [Estado de la escena](/es/docs/beasty-save-system/guides/scene-state/)
- [Copias de seguridad y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/)
- [Encriptación](/es/docs/beasty-save-system/guides/encryption/)
- [Versionado y migraciones](/es/docs/beasty-save-system/guides/versioning-and-migrations/)
- [La ventana del Save Manager](/es/docs/beasty-save-system/guides/save-manager-window/)
- [Preguntas frecuentes](/es/docs/beasty-save-system/faq/)
