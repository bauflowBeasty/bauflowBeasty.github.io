---
title: "Guardado y carga asíncronos"
description: "Tres métodos te permiten guardar y cargar sin bloquear el hilo principal en la IO de disco. Esta página muestra cómo usarlos, y es precisa sobre qué mueven y "
---

Tres métodos te permiten guardar y cargar sin bloquear el hilo principal en la IO de disco. Esta página muestra cómo
usarlos, y es precisa sobre qué mueven y qué no mueven fuera del hilo principal.

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

## Qué hacen realmente

> **Nota**
> La **IO de archivos** es asíncrona. **La serialización y la encriptación no lo son** — se ejecutan en el hilo que
> llama al método, que normalmente es el hilo principal.

Esta es la descripción honesta, y es la que deberías tener en cuenta al planificar.

Un guardado tiene dos costes: convertir tu grafo de objetos en texto, y enviar ese texto al disco. El segundo coste
es el impredecible — un disco duro lento, el almacenamiento flash de un teléfono bajo carga, un requisito de
certificación de consola — y es el que estos métodos sacan del hilo principal. El primer coste se queda donde
estaba.

Así que:

- Un guardado con un **grafo de objetos grande** todavía te costará tiempo de hilo principal en `SaveAsync`, antes de que
  la IO siquiera empiece. Hacer la llamada asíncrona no hace gratuita la serialización.
- Un guardado con un **grafo de objetos modesto en un disco lento** es exactamente para lo que sirven estos métodos. El hitch
  que estabas viendo era el disco, y el disco ahora está fuera del hilo principal.

No son un trabajo en segundo plano. No hay ningún hilo de trabajo (worker thread) procesando tu guardado mientras el juego
sigue funcionando. Si tu guardado es genuinamente enorme, la respuesta es un guardado más pequeño, no uno asíncrono.

## Cuándo usarlos

Usa las variantes asíncronas cuando:

- Guardas durante el juego — un autoguardado, un checkpoint, un guardado al cambiar de sala — y el jugador notaría
  un frame perdido.
- Estás publicando en consola o móvil, donde el almacenamiento es más lento y menos predecible que un SSD de escritorio.
- Tu guardado es lo bastante grande como para que la escritura tarde lo suficiente como para notarse.

Usa las síncronas cuando:

- Guardas desde un menú en el que el jugador ya está sentado, donde unos pocos milisegundos no importan.
- Estás cargando un guardado como parte de una transición de escena, donde ya estás mostrando una pantalla de carga de todos modos.

Cargar un guardado al inicio de un nivel normalmente no necesita ser asíncrono. Ya estás bloqueado por la
carga del nivel.

## Esperarlos con await

Unity no necesita una corrutina para esto. Marca tu método `async` y haz `await` de la llamada. La continuación
vuelve en el hilo principal de Unity, así que puedes tocar la escena justo después del `await`.

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

Un jugador que machaca el botón de guardado puede iniciar una segunda escritura al mismo slot antes de que la primera haya
terminado. No lo permitas. Protege la llamada con un flag, y desactiva el botón mientras esté activo.

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

El `try`/`finally` importa. Si el guardado falla, el botón debe volver, o un solo guardado malo dejará
al jugador sin poder guardar por el resto de la sesión.

Una precaución más: no dispares un autoguardado y un guardado manual al mismo slot al mismo tiempo. Como las
escrituras son atómicas no terminarás con un archivo a medio escribir, pero una de las dos escrituras puede fallar con
`IoError`, y cuál de ellas termina en el slot no es algo que controles. Un guardado a la vez, por
slot.

## Los guardados de escena son síncronos

`BeastySaveManager.SaveAll`, `SaveAllNow`, `LoadAll` y `LoadAllNow` no tienen contrapartes asíncronas. Un guardado
de escena recorre los componentes registrados y escribe el archivo en el acto. Si necesitas el comportamiento asíncrono para
un guardado del tamaño de una escena, esa es una razón para mantener tus datos de guardado en una clase propia y
usar `BeastySave.SaveAsync` sobre ella. Consulta [Estado de la escena](/es/docs/beasty-save-system/guides/scene-state/).

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
