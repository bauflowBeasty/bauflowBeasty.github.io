---
title: "Controladores"
description: "Los tres MonoBehaviours que llamas desde código: BeastyManager, VNGameController y VisualNovelController, y qué posee cada uno."
---

Los tres MonoBehaviours que llamas desde código: `BeastyManager` (el rig), `VNGameController` (el estado de la
aplicación y los guardados), `VisualNovelController` (una historia en ejecución). Todos en `Beasty.VN.Runtime`.

## A cuál llamo

| Tarea | Llama a |
|---|---|
| Acceder a cualquier manager | `BeastyManager.Instance` |
| Retrasar el juego hasta que mi sistema esté listo | `BeastyManager.RegisterBootBarrier` |
| Moverse entre estados de la aplicación | `VNGameController` |
| Guardar o cargar una ranura de las que ve el jugador | `VNGameController` |
| Leer el estado del juego fuera de una historia | `VNGameController.SharedVariables` |
| Iniciar, restaurar o detener una historia | `VisualNovelController` |
| Avanzar, retroceder, leer variables dentro de una historia | la API estática [`VN`](/es/docs/beasty-visual-novel/scripting/vn-api/) |

Regla general: `VNGameController` decide QUÉ se está ejecutando, `VisualNovelController` lo ejecuta, y `VN` es
tu forma de hablar con ello.

## BeastyManager

El único objeto en la jerarquía. Posee a todos los demás managers como subcomponentes ocultos en su propio
GameObject, así que hay exactamente uno de cada uno y nada que conectar manualmente.

```csharp
public static BeastyManager Instance { get; }
public event Action Ready;
public bool IsReady { get; }
public void MarkReady();
public void RegisterBootBarrier(Func<bool> isDone);
public void EnsureManagers();
```

Accesores de managers; todos se vuelven a resolver en tiempo de ejecución si una referencia se pierde:

```csharp
public VNGameController        Game            { get; }
public VisualNovelController   VN              { get; }
public StageController         Stage           { get; }
public FreeRoamController      FreeRoam        { get; }
public FreeRoamScreenController FreeRoamScreens { get; }
public VNAudioManager          Audio           { get; }
public VNBackgroundMusicController BackgroundMusic { get; }
public VNMenuManager           Menus           { get; }
```

A eso se suman las piezas de escena y la configuración que posee: `StageRoot`, `MainCanvas`, `MainCamera`,
`Loading`, `InputConfig`, `TimeConfig`.

> **Nota**
> `BeastyManager.VN` es el componente `VisualNovelController`. La API estática `VN` es un tipo distinto en el
> mismo namespace. Dentro de una clase que usa ambos, califica la estática como `Beasty.VN.Runtime.VN`.

### Barreras de arranque (boot barriers)

Al arrancar, `BeastyManager` muestra la pantalla de carga, espera un frame para que cada subsistema haya
despertado, y luego mantiene el overlay en pantalla hasta que cada barrera registrada devuelve true — o hasta
que transcurre `maxBootSeconds`, lo que ocurra primero. Después oculta el overlay, establece `IsReady` y lanza
`Ready`.

Una barrera de arranque te permite meter tu propia inicialización lenta dentro de esa ventana: una consulta
remota de configuración, un login, una migración de guardado, el calentamiento de tu propio sistema de assets.
Sin una, el jugador ve tus sistemas aparecer de golpe cuando el juego ya comenzó. Regístrala en `Awake` —
`Start` en el manager corre después de un frame y deja de aceptar barreras una vez que el arranque ha
terminado.

```csharp
using System.Threading.Tasks;
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class RemoteConfig : MonoBehaviour
{
    private bool _loaded;

    private void Awake()
    {
        BeastyManager.Instance?.RegisterBootBarrier(() => _loaded);
        _ = FetchAsync();
    }

    private async Task FetchAsync()
    {
        await Task.Delay(1500);   // tu solicitud real
        _loaded = true;           // la pantalla de carga ya puede desaparecer
    }
}
```

Ponle un límite realista a la espera. Una barrera que nunca devuelve true solo retrasa el juego
`maxBootSeconds`; no lo cuelga.

## VNGameController

Posee el estado de la aplicación y el almacén de variables compartido. Una instancia:
`VNGameController.Instance`.

```csharp
public static VNGameController Instance { get; }
public VNAppState State { get; }
public event Action<VNAppState> StateChanged;
public event Action<FreeRoamSaveState> EnteredFreeRoam;
public VariableStore SharedVariables { get; }
public VNTimeConfig TimeConfig { get; }
public VNSaveManager Saves { get; }
```

`SharedVariables` ES el estado del juego: tus variables, variables de personaje, tiempo, misiones, inventario,
overrides del diccionario. Viaja contigo por todos los modos: por eso el progreso sobrevive a un cambio de
proyecto y por eso todo lo que contiene se guarda y se rebobina gratis.

### Moverse entre modos

```csharp
public void GoToMainMenu();
public void StartNewGame();
public void EnterVisualNovel(string nodeId = null);
public void EnterVisualNovel(DialogueScene project, string nodeId = null);
public void PlayVisualNovelThenReturn(DialogueScene project, string nodeId,
                                      FreeRoamSaveState freeRoamReturn, Sprite roomBackground = null);
public bool PresentTalkMenu(string characterId);
public bool PresentTalkMenuThenReturn(string characterId, FreeRoamSaveState freeRoamReturn,
                                      Sprite roomBackground = null);
public void EnterFreeRoam(FreeRoamSaveState position = null);
public void EnterCustom();
```

- `StartNewGame` limpia la partida, reinicia el escenario persistente y entra al proyecto anfitrión de la VN.
- `EnterVisualNovel(project, nodeId)` cambia de proyecto conservando el almacén compartido, así que el
  progreso se traslada.
- `PlayVisualNovelThenReturn` es el puente con FreeRoam: reproduce una escena, y luego vuelve a la sala que
  le pasaste. El `roomBackground` opcional deja el fondo ya puesto, así un diálogo sin su propio bloque
  Backdrop muestra la sala en la que está parado el jugador.
- `PresentTalkMenu` devuelve false cuando el menú del personaje se resuelve sin entradas visibles. Maneja
  eso — no asumas que se abrió.
- `EnterFreeRoam(null)` entra en la sala de entrada del mapa.
- `EnterCustom` entrega el juego a tu código. Consulta [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/).

Retroceder a través de un límite de modo:

```csharp
public bool RollbackFromFreeRoam();
public bool RollbackFromCustom();
public void PushFreeRoamRoom(FreeRoamSaveState state);
public void PushCustomRollback();
```

Ambos métodos `Rollback*` devuelven false cuando no hay nada a lo que retroceder.

### Guardado

```csharp
public bool SaveToSlot(string slot, string saveName = null, Texture2D thumbnail = null);
public bool LoadSlot(string slot);
public VNSlotLoadOutcome LoadSlotDetailed(string slot);
public bool RestoreSlotBackup(string slot);
public Task<bool> SaveToSlotAsync(string slot, string saveName = null, Texture2D thumbnail = null);
public Task<VNSlotLoadOutcome> LoadSlotDetailedAsync(string slot);
public VisualNovelSaveData CaptureCurrent();
public bool RestoreFrom(VisualNovelSaveData data);
```

Las ranuras (slots) tienen nombre: `manual_0`, `manual_1`, ..., `auto_0`, ... `LoadSlotDetailed` devuelve
`VNSlotLoadOutcome`, uno de `Loaded`, `Failed` o `FailedBackupAvailable` — el tercero es lo que le permite a
una pantalla de guardado ofrecer "restaurar el backup" en vez de simplemente fallar. `RestoreSlotBackup`
sobrescribe una ranura dañada con su respaldo `.bak`.

`SaveToSlot` funciona desde CUALQUIER estado: etiqueta la instantánea con el `VNAppState` activo y escribe el
almacén compartido, la cola de rollback entre modos, el estado de escena de tus componentes `BeastySaveable`
y tu `customStateJson`. Devuelve false cuando el momento no se puede capturar — un menú de conversación
abierto es uno de esos momentos — y no se escribe nada.

Las variantes asíncronas hacen la E/S de archivos fuera del hilo principal. Aun así capturan en el hilo
principal, porque leer objetos de Unity lo requiere. Consulta [Guardado asíncrono](/es/docs/beasty-save-system/guides/async-saving/)
para entender qué te aporta esto en la práctica.

```csharp
using Beasty.VN.Runtime;

public static class QuickSave
{
    public static bool Save() => VNGameController.Instance.SaveToSlot("manual_0", "Quick save");

    public static bool Load()
    {
        var outcome = VNGameController.Instance.LoadSlotDetailed("manual_0");
        if (outcome == VNSlotLoadOutcome.FailedBackupAvailable)
            return VNGameController.Instance.RestoreSlotBackup("manual_0")
                   && VNGameController.Instance.LoadSlot("manual_0");
        return outcome == VNSlotLoadOutcome.Loaded;
    }
}
```

Para el panorama completo — política de autoguardado, miniaturas, qué contiene una ranura — consulta
[Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/).

## VisualNovelController

Aloja una historia. `VisualNovelController.Instance`, o `BeastyManager.Instance.VN`.

```csharp
public static VisualNovelController Instance { get; }
public VNSession Session { get; }
public bool IsRunning { get; }
public bool EndedNaturally { get; }
public DialogueScene Project { get; }
public VariableStore SharedVariableStore { get; set; }
public StageMemory PersistentStage { get; }
```

Iniciar y detener:

```csharp
public void StartVisualNovel(string nodeId = null, Sprite roomBackground = null);
public void StartVisualNovel(DialogueScene overrideProject, string nodeId = null, Sprite roomBackground = null);
public bool RestoreVisualNovel(VisualNovelSaveData data);
public bool RestoreVisualNovel(DialogueScene overrideProject, VisualNovelSaveData data);
public void StartVisualNovelTalkMenu(DialogueScene carrierProject,
                                     IReadOnlyList<ResolvedTalkEntry> entries,
                                     string promptKey = null, string promptSpeakerName = null,
                                     Sprite roomBackground = null, Sprite characterSprite = null);
public void StopVisualNovel();
public void Advance();
public void Back();
public bool Save();
public bool Load();
public void ApplyRoomBackdrop(Sprite roomBackground);
```

`RestoreVisualNovel` devuelve false cuando el nodo guardado ya no existe en la historia — la ranura es de un
build anterior. Avísale al jugador; no lo trates como una carga exitosa.

Eventos, reflejados como UnityEvents en el Inspector (`OnVisualNovelStarted`, `OnVisualNovelEnded`):

```csharp
public event Action Started;
public event Action Ended;
public event Action<string, string> FreeRoamRequested;         // scenarioId, roomId
public event Action FreeRoamReturnRequested;
public event Action<FreeRoamMapGraph, List<string>> ChooseRoomRequested;
public event Action<DialogueScene, string> SwitchProjectRequested;
public event Action<ResolvedTalkEntry> TalkEntryChosen;
public event Action<string, string> TalkMenuRequested;         // characterId, fallbackNodeId
public event Action BackAtStart;
```

`VNGameController` ya se suscribe a todos estos — así es como un bloque Flow sale de la novela. Suscríbete
solo si estás reemplazando el anfitrión.

### El almacén de variables compartido

`SharedVariableStore` lo asigna `VNGameController` al arrancar, con su propio `SharedVariables`. Cada
sesión que este controlador construye luego lee y escribe ese único almacén. Déjalo tal cual a menos que
estés ejecutando un `VisualNovelController` fuera del rig normal, en cuyo caso un almacén null hace que cada
sesión obtenga uno aislado.

### El escenario persistente

`PersistentStage` (un `StageMemory`) contiene el fondo, los personajes y los objetos (props). Vive en el
controlador, no en la sesión, así que el escenario sobrevive a un cambio de nodo, un cambio de proyecto y una
excursión a FreeRoam o a tu modo Custom: lo visual se limpia mientras estás fuera y se vuelve a renderizar
cuando la VN se reanuda. `StartNewGame` en el anfitrión llama a `PersistentStage.Reset()` para empezar de
cero.

## Ver también

- [La API estática VN](/es/docs/beasty-visual-novel/scripting/vn-api/)
- [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/)
- [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/)
- [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/)
