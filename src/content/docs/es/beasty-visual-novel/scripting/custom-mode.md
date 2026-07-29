---
title: "Modo personalizado"
description: "VNAppState.Custom entrega la pantalla a tu propio modo. Cómo entrar, salir, y hacer que tu minijuego guarde, cargue y rebobine con el resto del juego."
---

`VNAppState.Custom` es la puerta abierta. No tiene UI incorporada: el motor cambia a este estado, te entrega
la pantalla y se detiene. Pon ahí tu minijuego, tu sistema de batalla, tu ciclo de granja o tu mapa del mundo,
y participará de todo lo demás que hace el motor — el almacén de variables compartido, el guardado, el
rollback entre modos, el reloj, las misiones, el inventario.

## Entrar y salir

```csharp
VNGameController.Instance.EnterCustom();
```

`EnterCustom` registra el modo que estás dejando como un límite de rollback, detiene cualquier historia en
ejecución, y establece `State` en `Custom`. No crea nada. Muestra tu propia UI desde un manejador de
`StateChanged`:

```csharp
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class MinigameRoot : MonoBehaviour
{
    [SerializeField] private GameObject ui;

    private void OnEnable()
    {
        var game = VNGameController.Instance;
        game.StateChanged += HandleStateChanged;
        HandleStateChanged(game.State);
    }

    private void OnDisable()
    {
        if (VNGameController.Instance != null)
            VNGameController.Instance.StateChanged -= HandleStateChanged;
    }

    private void HandleStateChanged(VNAppState state) => ui.SetActive(state == VNAppState.Custom);
}
```

Para salir, llama a la transición que corresponda a dónde debería ir el jugador:

| Salir hacia | Llama a |
|---|---|
| La sala de la que vino el jugador | `VNGameController.Instance.RollbackFromCustom()` |
| Una sala específica | `EnterFreeRoam(new FreeRoamSaveState { scenarioId = ..., roomId = ... })` |
| Una historia | `EnterVisualNovel(project, nodeId)` |
| El menú principal | `GoToMainMenu()` |

`RollbackFromCustom` retrocede a través del límite más reciente — la sala, la historia, o un estado Custom
anterior — y devuelve false cuando no hay nada a lo que retroceder. Conéctalo a tu input de Atrás y recurre a
`GoToMainMenu()` cuando devuelva false.

## Guardar tu modo

El motor no puede saber cuál es el estado de tu modo, así que te lo pide, como string, y lo guarda tal cual.
Ambos hooks son campos de `VNGameController`:

```csharp
public Func<string> CaptureCustomStateJson;   // tú lo llenas
public Action<string> RestoreCustomStateJson; // tú lo llenas
```

Asigna ambos una sola vez, al principio. Al guardar, si la aplicación está en el estado `Custom`, el controlador
llama a `CaptureCustomStateJson` y escribe el resultado en `VisualNovelSaveData.customStateJson`. Al cargar,
entra en `Custom` y devuelve el string a `RestoreCustomStateJson`. El motor nunca inspecciona el blob. JSON
es el formato obvio — `JsonUtility.ToJson` alcanza — pero cualquier string funciona.

Los mismos dos hooks alimentan el rollback entre modos: `PushCustomRollback()` captura el estado custom
actual como un paso hacia atrás. Llámalo justo ANTES de cambiar algo que el jugador debería poder deshacer, o
antes de cambiar de modo. No hace nada si `CaptureCustomStateJson` no está conectado.

> **Nota**
> No pongas tu puntuación en `customStateJson` si pertenece al mundo. Un número que la historia lee en una
> condición, que una misión verifica, o que un HUD muestra debería ser una variable de VN — `VN.SetInt`, o el
> almacén compartido — porque esas ya se guardan, ya se rebobinan y ya se pueden usar desde cualquier
> condición. Reserva `customStateJson` para el estado que es genuinamente interno a tu modo: el layout de un
> tablero, una mano de cartas, un contador de oleadas.

## Los hooks de FreeRoam

El mismo patrón — estos también son campos de `VNGameController` — pero el motor ya trae una
implementación, así que solo tocas esto si estás reemplazando FreeRoam:

```csharp
public Func<FreeRoamSaveState> CaptureFreeRoamState;
public Action<FreeRoamSaveState> RestoreFreeRoamState;
public Func<string, Sprite> ResolveRoomBackground;
public Action<FreeRoamMapGraph, List<string>, Action<string>> RoomSelectionRequested;
```

`ResolveRoomBackground` mapea un id de sala al sprite que esa sala muestra actualmente, con las condiciones
ya resueltas. El motor lo llama después de una carga para repintar la sala detrás de un diálogo que no tiene
su propio bloque Backdrop. Si tu modo posee las salas, conéctalo, o ese fondo quedará vacío.

`RoomSelectionRequested` es el hook que una UI de selector de sala registra para que un bloque **Choose
room** tenga a quién preguntarle. Si no hay ninguno registrado, el motor elige una sala por defecto y deja un
aviso en el log.

## Los hooks de guardado

```csharp
public static class VNSaveHooks
{
    public static event Action<VisualNovelSaveData> OnCaptureSave;
    public static event Action<VisualNovelSaveData> OnRestoreSave;
    public static event Action<VisualNovelSaveData> OnSceneRestoreFailed;
}
```

- `OnCaptureSave` se dispara después de que el motor ha llenado la instantánea y antes de que se escriba.
  Última oportunidad para añadirle algo.
- `OnRestoreSave` se dispara después de que una instantánea cargada ha sido aplicada al mundo.
- `OnSceneRestoreFailed` se dispara cuando el estado de objetos de escena de una carga no pudo aplicarse: la
  historia está en la línea guardada, pero el mundo alrededor no es el que se guardó. Suscríbete y avísale al
  jugador. Dejarlo en un mundo a medio restaurar que se ve sutilmente mal es peor que decírselo.

Los tres reinician sus suscriptores en `SubsystemRegistration`, así que Fast Enter Play Mode no deja
suscripciones colgadas.

## Persistir tu propio MonoBehaviour

No necesitas el estado Custom para esto. Pon un componente `BeastySaveable` en cualquier GameObject de la
escena, marca los componentes que quieres almacenar, y su estado viaja dentro de cada guardado de VN y cada
límite de rollback — el motor captura el grupo de escena como parte de `CaptureCurrent()` y lo aplica un
frame después de que el modo restaurado ha reconstruido su mundo.

Un fallo de captura hace fallar TODO el guardado, a propósito: mejor ningún guardado que uno al que, sin
avisar, le falte estado que el jugador espera recuperar.

Lee [Estado de escena](/es/docs/beasty-save-system/guides/scene-state/) antes de depender de esto — en
particular, el sistema de guardado no almacena referencias a objetos de Unity (sprites, prefabs, otros
componentes). Si el estado de tu minijuego es "qué prefab está en la ranura 3", guarda el id, no el prefab.

## Ejemplo completo: un minijuego con puntuación que vuelve a la sala

Un modo Custom completo. Mantiene una puntuación, la guarda, la restaura, y vuelve a donde vino el jugador.

```csharp
using System;
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class ScoreMinigame : MonoBehaviour
{
    [Serializable]
    private struct State
    {
        public int score;
        public int round;
    }

    [SerializeField] private GameObject ui;

    private int _score;
    private int _round;

    private void OnEnable()
    {
        var game = VNGameController.Instance;
        if (game == null) return;

        game.CaptureCustomStateJson = Capture;
        game.RestoreCustomStateJson = Restore;
        game.StateChanged += HandleStateChanged;
        HandleStateChanged(game.State);
    }

    private void OnDisable()
    {
        var game = VNGameController.Instance;
        if (game == null) return;

        game.StateChanged -= HandleStateChanged;
        if (game.CaptureCustomStateJson == (Func<string>)Capture) game.CaptureCustomStateJson = null;
        if (game.RestoreCustomStateJson == (Action<string>)Restore) game.RestoreCustomStateJson = null;
    }

    private void HandleStateChanged(VNAppState state) => ui.SetActive(state == VNAppState.Custom);

    // ─── Entrada ─────────────────────────────────────────────────────────────
    /// Llama esto desde la acción Custom de un objeto de FreeRoam, o desde donde sea.
    public void Play()
    {
        _score = 0;
        _round = 0;
        VNGameController.Instance.EnterCustom();   // registra la sala/historia que estamos dejando
    }

    // ─── Juego ───────────────────────────────────────────────────────────────
    public void ScorePoint()
    {
        VNGameController.Instance.PushCustomRollback();   // Atrás deshace esta ronda
        _score++;
        _round++;
    }

    // ─── Salida ──────────────────────────────────────────────────────────────
    public void Finish()
    {
        var game = VNGameController.Instance;

        // El resultado pertenece al mundo, así que es una variable de VN, no parte del blob:
        // las condiciones, las misiones y el HUD pueden verlo, y se guarda y rebobina gratis.
        game.SharedVariables.Set("minigame_best",
            Mathf.Max(game.SharedVariables.GetInt("minigame_best"), _score).ToString());

        BeastyTime.AdvanceDayparts(1);   // jugar tomó una tarde

        // Vuelve a donde vino el jugador; al menú principal si no hay a dónde volver.
        if (!game.RollbackFromCustom()) game.GoToMainMenu();
    }

    // ─── Persistencia ────────────────────────────────────────────────────────
    private string Capture() => JsonUtility.ToJson(new State { score = _score, round = _round });

    private void Restore(string json)
    {
        if (string.IsNullOrEmpty(json)) { _score = 0; _round = 0; return; }
        var state = JsonUtility.FromJson<State>(json);
        _score = state.score;
        _round = state.round;
    }
}
```

Si guardas mientras este modo está en ejecución, la ranura registra `appState = Custom`, tu blob, el almacén
compartido, el reloj, las misiones, el inventario y la cola de rollback. Al cargarla vuelves al minijuego, con
la misma puntuación y con `Back` todavía capaz de salir a la sala desde la que empezaste.

## Ver también

- [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/)
- [La API estática VN](/es/docs/beasty-visual-novel/scripting/vn-api/)
- [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/)
- [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/)
- [Estado de escena (Beasty Save System)](/es/docs/beasty-save-system/guides/scene-state/)
- [Qué se guarda (Beasty Save System)](/es/docs/beasty-save-system/guides/what-gets-saved/)
