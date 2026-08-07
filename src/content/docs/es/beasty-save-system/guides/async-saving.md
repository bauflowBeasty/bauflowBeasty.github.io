---
title: "Guardado y carga asíncronos"
description: "Guarda y carga sin bloquear el hilo principal. Qué mueven fuera del hilo principal los métodos asíncronos, y por qué la nube no acepta otra cosa."
---

Tres métodos te permiten guardar y cargar sin bloquear el hilo principal en la IO de disco. Esta página muestra
cómo usarlos, y deja claro qué mueven fuera del hilo principal y qué no. También cubre los gemelos asíncronos
de las utilidades de slot, el guardado de escena asíncrono, y la regla que llega con un backend en la nube:
en un backend solo asíncrono, la API asíncrona es la única que funciona.

## Los tres métodos

```csharp
static Task<SaveResult>    SaveAsync(object data, string slot, BeastySaveSettings settings,
                                     IDictionary<string, string> meta = null)
static Task<LoadResult<T>> LoadAsync<T>(string slot, BeastySaveSettings settings)
static Task<LoadResult>    LoadIntoAsync(object target, string slot, BeastySaveSettings settings)
```

Cada uno es la contraparte exacta del método síncrono del mismo nombre, recibe los mismos argumentos, y
vuelve con el mismo tipo de resultado. Nada lanza excepciones; compruebas el resultado, como siempre. Consulta
[Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/).

## Las utilidades de slot también tienen gemelos asíncronos

Cada utilidad de slot tiene una contraparte asíncrona con los mismos argumentos y el mismo resultado:

```csharp
static Task<bool>     ExistsAsync(string slot, BeastySaveSettings settings)
static Task<bool>     DeleteAsync(string slot, BeastySaveSettings settings)
static Task<string[]> ListSlotsAsync(BeastySaveSettings settings)
static Task<LoadResult<Dictionary<string, string>>> ReadMetaAsync(string slot, BeastySaveSettings settings)
static Task<SaveResult> RestoreBackupAsync(string slot, BeastySaveSettings settings)
```

Con archivos locales existen por simetría — las formas síncronas funcionan bien. Con un backend en la nube
son la única forma que funciona: una ida y vuelta a una base de datos no puede responder de forma síncrona.
Una pantalla de slots que sondea slots y lee metadatos a través de los gemelos asíncronos funciona sin
cambios tanto si el juego guarda en disco como en [Firebase](/es/docs/beasty-save-system/guides/firebase/).

## Qué hacen realmente

> **Nota**
> La **IO de archivos** es asíncrona. **La serialización y el cifrado no lo son** — se ejecutan en el hilo que
> llama al método, que normalmente es el hilo principal.

Esa es la descripción honesta, y es la que conviene tener en cuenta al planificar.

Un guardado tiene dos costes: convertir tu grafo de objetos en texto, y enviar ese texto al disco. El segundo coste
es el impredecible — un disco duro lento, el almacenamiento flash de un teléfono bajo carga, un requisito de
certificación de consola — y es el que estos métodos sacan del hilo principal. El primer coste se queda donde
estaba.

Así que:

- Un guardado con un **grafo de objetos grande** todavía te costará tiempo de hilo principal en `SaveAsync`, antes
  de que la IO siquiera empiece. Hacer la llamada asíncrona no hace que la serialización sea gratis.
- Un guardado con un **grafo de objetos modesto en un disco lento** es exactamente para lo que sirven estos
  métodos. El hitch que estabas viendo era el disco, y ahora el disco está fuera del hilo principal.

No son un trabajo en segundo plano. No hay ningún hilo de trabajo (worker thread) procesando tu guardado mientras
el juego sigue funcionando. Si tu guardado es realmente enorme, la respuesta es un guardado más pequeño, no uno
asíncrono.

## Cuándo usarlos

Usa las variantes asíncronas cuando:

- Guardas durante el juego — un autoguardado, un checkpoint, un guardado al cambiar de sala — y el jugador notaría
  un frame perdido.
- Estás publicando en consola o móvil, donde el almacenamiento es más lento y menos predecible que un SSD de escritorio.
- Tu guardado es lo bastante grande como para que la escritura se alcance a notar.

Usa las síncronas cuando:

- Guardas desde un menú en el que el jugador ya está detenido, donde unos pocos milisegundos no importan.
- Cargas un guardado durante una transición de escena, cuando de todos modos ya estás mostrando una pantalla de carga.

Cargar un guardado al inicio de un nivel normalmente no necesita ser asíncrono. Ya estás bloqueado por la
carga del nivel.

## Esperarlos con await

Unity no necesita una corrutina para esto. Marca tu método como `async` y espera la llamada con `await`. La
continuación vuelve en el hilo principal de Unity, así que puedes tocar la escena justo después del `await`.

```csharp
using System.Threading.Tasks;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;
using UnityEngine;

public sealed class Autosave : MonoBehaviour
{
    [SerializeField] private BeastySaveSettings _settings;

    public async Task SaveCheckpoint(PlayerData data)
    {
        SaveResult result = await BeastySave.SaveAsync(data, "autosave", _settings);

        if (!result.Success)
        {
            // De vuelta en el hilo principal aquí — tocar la escena es seguro.
            Debug.LogError($"Autosave failed: {result.Error} — {result.Message}");
            return;
        }

        ShowSavedIcon();
    }

    private void ShowSavedIcon() { /* … */ }
}
```

## Desactivar el botón de guardado mientras un guardado está en curso

Un jugador que machaca el botón de guardado puede iniciar una segunda escritura al mismo slot antes de que la
primera termine. No lo permitas. Protege la llamada con un flag, y desactiva el botón mientras el guardado esté
en curso.

```csharp
using System.Threading.Tasks;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;
using UnityEngine;
using UnityEngine.UI;

public sealed class SaveButton : MonoBehaviour
{
    [SerializeField] private Button _button;
    [SerializeField] private BeastySaveSettings _settings;

    private bool _saving;

    // Conecta esto al OnClick del Button. Un UnityEvent no puede hacer await de una Task, así que el
    // handler en sí devuelve void y reenvía al método asíncrono.
    public void OnSaveClicked() => _ = SaveAsync("slot1");

    private async Task SaveAsync(string slot)
    {
        if (_saving) return;

        _saving = true;
        _button.interactable = false;
        try
        {
            SaveResult result = await BeastySave.SaveAsync(CollectData(), slot, _settings);
            if (!result.Success)
                Debug.LogError($"Save failed: {result.Error} — {result.Message}");
        }
        finally
        {
            _saving = false;
            _button.interactable = true;
        }
    }

    private PlayerData CollectData() => new PlayerData();
}
```

El `try`/`finally` importa. Si el guardado falla, el botón tiene que volver a habilitarse, o un solo guardado
fallido dejará al jugador sin poder guardar durante el resto de la sesión.

Una precaución más: no dispares un autoguardado y un guardado manual al mismo slot al mismo tiempo. Como las
escrituras son atómicas no terminarás con un archivo a medio escribir, pero una de las dos escrituras puede fallar con
`IoError`, y cuál de ellas termina en el slot no es algo que controles. Un guardado a la vez, por
slot.

## Guardados de escena: SaveAllNowAsync y LoadAllNowAsync

Los guardados de escena tienen gemelos asíncronos en el manager:

```csharp
Task<SaveResult> BeastySaveManager.SaveAllNowAsync(string slot, IDictionary<string, string> meta = null)
Task<LoadResult> BeastySaveManager.LoadAllNowAsync(string slot)
```

`SaveAllNowAsync` ejecuta el mismo flujo de captura, sobre y registro que `SaveAllNow`, esperado a través
del pipeline. `LoadAllNowAsync` trae los datos de forma asíncrona y los aplica sobre los objetos de la
escena solo después de que el await vuelva al hilo principal de Unity — así que la pasada de aplicación es
tan segura como la síncrona. Ambos actualizan `LastSaveResult`/`LastLoadResult` y disparan
`SaveCompleted`/`LoadCompleted`, exactamente como sus gemelos síncronos.

La captura en sí (recorrer los componentes registrados) sigue ejecutándose en el hilo principal; lo que se
espera es la escritura y la lectura.

## Backends solo asíncronos

Un backend en la nube — Firestore, Realtime Database, o un backend propio que declara
`SupportsSynchronous = false` — no puede responder una llamada síncrona. Pasan dos cosas distintas según
quién llame:

- **Desde código**, una llamada síncrona (`Save`, `Load<T>`, `Exists`…) falla de inmediato con el error
  tipado `BackendRequiresAsync` en lugar de bloquear. No se escribe nada; cambia el punto de llamada al
  gemelo asíncrono.
- **Desde los puntos de entrada para UnityEvent del manager** (`SaveAll`, `LoadAll`, `DeleteSlot` — los que
  llama un botón uGUI), la operación se enruta a la vía asíncrona automáticamente, dispara y olvida, así
  que un botón ya conectado sigue funcionando y nunca se pierde nada. El resultado llega por
  `SaveCompleted`/`LoadCompleted` y `LastSaveResult`. Si el **Save Mode** del manager sigue en
  `Synchronous`, se registra una advertencia una vez por sesión pidiéndote ponerlo en `Asynchronous` para
  reconocer el enrutado.

Consulta [Backends de almacenamiento](/es/docs/beasty-save-system/guides/storage-backends/) para el Save
Mode y las reglas de enrutado al completo.

## WebGL

> **Advertencia**
> WebGL no está soportado por Beasty Save System, y los métodos asíncronos son parte de la razón: están
> basados en `Task`, y el build de navegador no proporciona el threading del que dependen. (La otra razón es
> el reemplazo atómico de archivo usado por la ruta de escritura.) Consulta
> [Plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/).

## Ver también

- [API de BeastySave](/es/docs/beasty-save-system/reference/api-beastysave/) — cada método de la fachada, síncrono y asíncrono
- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) — qué comprobar en el resultado
- [Slots y metadatos](/es/docs/beasty-save-system/guides/slots-and-metadata/) — el argumento `meta` que `SaveAsync` también recibe
- [Plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/) — dónde funciona el paquete, y a qué velocidad
