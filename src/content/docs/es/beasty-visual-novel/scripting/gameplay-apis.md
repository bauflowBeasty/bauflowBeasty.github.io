---
title: "APIs de gameplay"
description: "BeastyTime, BeastyRoutines, BeastyQuests, Inventory y BeastyWardrobe: clases estáticas para leer y escribir los sistemas del mundo desde código."
---

Cuatro clases estáticas en `Beasty.VN.Runtime`: `BeastyTime`, `BeastyRoutines`, `BeastyQuests` e `Inventory`.
Son la cara en código de los sistemas de mundo que creas en el editor. Más abajo, la misma página cubre
`BeastyWardrobe`, las APIs de avisos y de la guía, los nombres traducidos y cómo añadir tus propias
transiciones y efectos de pantalla.

Las cuatro leen y escriben el mismo `VariableStore` — `VNGameController.SharedVariables` — bajo namespaces
de claves reservados. Tres consecuencias, y sí importan:

- Funcionan en TODOS los estados de la aplicación, no solo dentro de una historia en ejecución. A diferencia
  de `VN.Get*`, no necesitan una sesión.
- Todo lo que tocan está en el guardado, automáticamente. Nunca serializas una misión o un objeto tú mismo.
- Todo lo que tocan se rebobina con la historia, porque el rebobinado restaura el almacén.

Cada miembro se degrada de forma segura: si no hay manager, configuración o contexto, obtienes un valor por
defecto o un no-op, nunca una excepción.

## BeastyTime

Tiempo del juego. Lee y escribe las claves reservadas `@time:*`.

```csharp
public static bool   Enabled  { get; }
public static int    Day      { get; }
public static int    Hour     { get; }
public static string Daypart  { get; }
public static string Weekday  { get; }
public static string Season   { get; }

public static VNTimeSnapshot Read();

public static void AdvanceDayparts(int n = 1);
public static void AdvanceHours(int n);       // Solo en modo Clock
public static void AdvanceDays(int n = 1);
public static void SetDaypart(string name);
public static void SetHour(int hour);         // Solo en modo Clock
public static void SetWeekday(string weekday);
```

`Enabled` es false cuando no hay ningún `VNTimeConfig` asignado en el `BeastyManager`. En ese caso el tiempo
está apagado: no se escribe ninguna clave `@time:`, cada getter devuelve su valor por defecto y cada
condición de tiempo evalúa a false.

`Read()` devuelve un `VNTimeSnapshot`, un struct readonly con `Day`, `Hour`, `Daypart`, `Weekday`, `Season`.
Úsalo cuando necesites varios campos tomados en el mismo instante.

> **Advertencia**
> El tiempo lo maneja el autor. El runtime NUNCA avanza el reloj por sí solo. Nada sucede a menos que se
> ejecute un bloque Advance Time, se use un objeto de FreeRoam con `advanceTimeOnClick`, o llames a uno de
> los métodos de arriba. Un juego en el que nada se mueve es un juego en el que el tiempo nunca avanzó.

Si escribes a mano las variables `@time:` crudas, te saltas la republicación de los valores derivados
(daypart a partir de la hora, weekday, season) y las notificaciones de las que depende la UI reactiva. Mejor
usa estos métodos.

```csharp
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class Bed : MonoBehaviour
{
    // El botón "dormir" de un minijuego: terminar el día, despertar a la mañana siguiente.
    public void Sleep()
    {
        if (!BeastyTime.Enabled) return;

        BeastyTime.AdvanceDays(1);
        BeastyTime.SetDaypart("Morning");

        var now = BeastyTime.Read();
        Debug.Log($"Day {now.Day}, {now.Weekday}, {now.Daypart}");
    }
}
```

`SetWeekday` siempre avanza hacia la próxima ocurrencia de ese weekday (hoy cuenta). Consulta
[Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/).

## BeastyRoutines

Dónde están los personajes, ahora mismo e hipotéticamente.

```csharp
public static FreeRoamMapGraph ActiveMap { get; set; }

public static string LocationOf(string id);         // id de sala, o "" si no está presente
public static string SpotOf(string id);             // id del spot dentro de la sala, o ""
public static bool   IsPresent(string id);
public static string ActiveProfileOf(string id);    // el perfil de rutina en vigor
public static string LocationDisplayOf(string id);  // el displayName de la sala

public static IReadOnlyList<string> CharactersIn(string roomId);

public static RoutinePlacement ResolveAt(string id, string weekday, string daypart);
public static RoutinePlacement ResolveAt(FreeRoamMapGraph map, VNTimeConfig cfg,
                                         string id, string weekday, string daypart);
public static RoutinePlacement ResolveAt(FreeRoamMapGraph map, VNTimeConfig cfg,
                                         string id, string weekday, string daypart, VariableStore live);
public static VariableStore Snapshot();
public static RoutinePlacement ResolveIn(VariableStore scratch, string id, string weekday, string daypart);

public static IReadOnlyList<(string daypart, RoutinePlacement placement)> DaySchedule(string id, string weekday);
```

`RoutinePlacement` es un struct readonly: `Present`, `RoomId`, `SpotId`, `Visual`.

`LocationOf` y compañía son lecturas en vivo del almacén. La familia `ResolveAt` responde una hipótesis —
"¿dónde estaría Maya el viernes por la tarde?" — copiando el almacén, sobrescribiendo las dos claves de
tiempo en la copia y resolviendo contra esa copia. Es pura: preguntar dónde estará alguien esta noche nunca
hace que sea de noche.

La copia es el costo. Una pregunta está bien; una pantalla llena de ellas, no. Para una grilla, toma un
`Snapshot()` y haz todas las consultas contra él con `ResolveIn`:

```csharp
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class WhereIsEveryone : MonoBehaviour
{
    public void LogRoom(string roomId)
    {
        foreach (var id in BeastyRoutines.CharactersIn(roomId))
            Debug.Log($"{id} is at {BeastyRoutines.SpotOf(id)} in {BeastyRoutines.LocationDisplayOf(id)}");
    }

    public void LogWeek(string characterId)
    {
        var scratch = BeastyRoutines.Snapshot();     // una copia para toda la grilla
        foreach (var weekday in new[] { "Monday", "Tuesday", "Wednesday" })
        foreach (var (daypart, _) in BeastyRoutines.DaySchedule(characterId, weekday))
        {
            var at = BeastyRoutines.ResolveIn(scratch, characterId, weekday, daypart);
            Debug.Log($"{weekday} {daypart}: {(at.Present ? at.RoomId : "away")}");
        }
    }
}
```

`DaySchedule` devuelve una entrada por momento del día de la configuración de tiempo, en orden, y una lista
vacía cuando el tiempo está apagado. Consulta [Rutinas de personaje](/es/docs/beasty-visual-novel/world/character-routines/).

## BeastyQuests

Estado de las misiones, leído y escrito contra el almacén compartido; el motor de misiones recalcula desde
ahí.

```csharp
public static string StateOf(string id);            // notstarted / active / completed / failed
public static bool   IsActive(string id);
public static bool   IsCompleted(string id);
public static bool   IsFailed(string id);
public static string LastResultOf(string id);       // último período resuelto de una misión recurrente
public static int    StageOf(string id);
public static bool   ObjectiveDone(string id, string objectiveId);
public static List<string> ActiveQuestsOf(string characterId);
public static List<string> ActiveGlobalQuests();

public static void StartQuest(string id);
public static void SetState(string id, string state);
public static void CompleteObjective(string id, string objectiveId);
public static bool Deliver(string questId, string objectiveId);
```

`StartQuest` solo inicia una misión que está `notstarted`; no reiniciará una ya completada. Usa `SetState`
cuando realmente quieras forzar un estado.

`Deliver` resuelve un objetivo `GatherDeliver`: verifica el inventario, consume los objetos y marca el
objetivo como hecho. Devuelve false y no cambia nada cuando el jugador no los tiene. Ese es el único tipo de
objetivo que no se maneja mediante una condición `completeWhen`.

```csharp
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class QuestBoard : MonoBehaviour
{
    public void Accept(string questId) => BeastyQuests.StartQuest(questId);

    public void HandInHerbs()
    {
        if (!BeastyQuests.IsActive("ana_m1")) return;

        if (!BeastyQuests.Deliver("ana_m1", "herbs"))
        {
            Debug.Log("Not enough herbs yet.");
            return;
        }

        if (BeastyQuests.StageOf("ana_m1") == 2) BeastyQuests.SetState("ana_m1", "completed");
    }
}
```

Consulta [Misiones](/es/docs/beasty-visual-novel/world/quests/).

## Inventory

El inventario global. Las cantidades viven bajo las claves reservadas `item.<id>`, el orden de las ranuras
bajo `inventory.order`.

```csharp
public static ItemHandle Item(string id);

public static int  Count(string id);
public static bool Has(string id);
public static int  MaxOf(string id);
public static bool CanUse(string id);

public static void Give(string id, int amount = 1);
public static void Take(string id, int amount = 1);
public static void Set(string id, int quantity);
public static bool Use(string id, bool jumpScene = true);

public static List<string> Order();
public static void SetOrder(IEnumerable<string> ids);

public static event Action<string, int> ItemChanged;   // (id, nueva cantidad)
```

Cada mutación se limita al tipo del objeto: un objeto Key es 0 o 1, un Consumable va de 0 a su máximo.
Al llegar a 0, el objeto sale del orden de ranuras y desaparece de la UI de inventario; al adquirirlo por
primera vez, se añade.

`Use` aplica los efectos del objeto, consume `consumeAmount`, y — cuando `jumpScene` es true — salta a la
escena de VN del objeto. Devuelve false cuando la condición de uso no se cumple en ese momento. `Order()`
devuelve los objetos en posesión, en el orden que el jugador dejó guardado.

`ItemHandle` es un handle tipado sobre un id, con `Count`, `Owned`, `Max`, `CanUse`, `Give`, `Take`, `Set`,
`Use`. Combínalo con las constantes generadas `ItemIds` para mantenerte lejos de strings mágicos:

```csharp
using Beasty.VN.Runtime;
using TMPro;
using UnityEngine;

public sealed class PotionButton : MonoBehaviour
{
    [SerializeField] private TMP_Text count;

    private void OnEnable()
    {
        Inventory.ItemChanged += HandleItemChanged;
        Refresh();
    }

    private void OnDisable() => Inventory.ItemChanged -= HandleItemChanged;

    private void HandleItemChanged(string id, int quantity)
    {
        if (id == ItemIds.Potion) count.text = quantity.ToString();
    }

    public void Drink()
    {
        var potion = Inventory.Item(ItemIds.Potion);
        if (potion.CanUse) potion.Use();
    }

    private void Refresh() => count.text = Inventory.Item(ItemIds.Potion).Count.ToString();
}
```

`ItemIds` se regenera desde la pestaña Items cada vez que tus ids cambian, exactamente igual que los
accesores en [Accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/). Consulta
[Objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/).

## Vestuario

`BeastyWardrobe` cambia y lee lo que lleva un personaje, en tiempo de ejecución. Lo que lleva es una variable
de personaje, así que cada cambio se guarda y se rebobina como el resto del almacén. Consulta
[Vestuario y conjuntos](/es/docs/beasty-visual-novel/world/wardrobe/).

```csharp
public static bool   Wear(string characterId, string slotId, string pieceId);   // "" vacía la categoría
public static bool   Remove(string characterId, string slotId);
public static bool   TakeOff(string characterId, string category, string pieceId);
public static bool   SetOutfit(string characterId, string outfitId);
public static string GetWorn(string characterId, string slotId);
public static bool   IsWorn(string characterId, string category, string pieceId);
public static void   ResetToDefaults(string characterId);
```

En código, una categoría del vestuario es un `WardrobeSlot`; de ahí `slotId`. `TakeOff` quita una prenda de
una categoría *Several at once* y vacía una *One at a time*. `IsWorn` responde para los dos tipos: lo que le
puso la historia o, si no, los valores por defecto.

**Un cambio que no se aplica exactamente como se pidió deja un aviso y devuelve `false`.** Una categoría o un
conjunto desconocidos, o vaciar una categoría que no puede quedarse vacía, no cambian nada. Una prenda
desconocida se guarda igualmente —la prenda por defecto de la categoría se ve hasta que exista una prenda con
ese id— y la llamada devuelve `false` de todos modos. Todos los métodos devuelven `false` si no hay partida en
marcha.

Los personajes que ya están en escena se actualizan cuando el cambio llega desde código.

## Avisos de estadísticas y pistas de la guía

El interruptor de la guía del jugador, y cómo se le presenta cualquier variable. Consulta
[Avisos de estadísticas y pistas de la guía](/es/docs/beasty-visual-novel/world/notifications-and-walkthrough/).

```csharp
// VN (Beasty.VN.Runtime)
public static bool Walkthrough { get; set; }
public static event Action<bool> OnWalkthroughChanged;

// VariablePresentation (Beasty.VN.Core)
public static bool TryResolve(VNContext ctx, string storeKey, out PresentedVariable v);
```

- `VN.Walkthrough` es true cuando el proyecto permite las pistas **y** el jugador las activó. Fijarlo se ignora,
  con un aviso, mientras el proyecto tenga la guía apagada. `OnWalkthroughChanged` salta con el nuevo valor
  efectivo cada vez que cambia, sea cual sea la causa, **Restablecer** de Preferencias incluido.
- `VariablePresentation.TryResolve` dice cómo se presenta una clave del almacén: como campo de personaje (con
  lo sobrescrito por personaje aplicado) o como variable global. `PresentedVariable` lleva su tipo, si avisa y
  si sale en la guía, y `Label(table)`.
- `VariableDefinition` tiene los campos `displayName`, `notifyOnChange` y `showInWalkthrough`, y `DisplayLabel`:
  el display name o, si no hay, la clave.
- `GameTextKeys.Variable(key)` (`var.<key>.label`) y `GameTextKeys.VariablePrefix(key)` (`var.<key>.`) nombran
  los textos de juego de una variable global; `GameText.VariableLabel(variable, table)` devuelve su etiqueta
  traducida.

> **Nota**
> `StatNotificationLine.CharacterName` es null en la línea de una variable global. Una vista de avisos propia
> no debe escribir un prefijo `Nombre:` para ella.

## Nombres traducidos

Los nombres que lee el jugador —salas, estadísticas, nombres del tiempo, ítems— salen de las tablas de textos
del juego y de ítems. Estas utilidades los devuelven en el idioma del jugador, y si no hay traducción, el texto
que escribiste:

| Miembro | Devuelve |
|---|---|
| `GameText.Get(key, authored)` | Cualquier texto del juego por clave. |
| `GameText.RoomName(roomId, authored)` | El nombre traducido de una sala. |
| `GameText.StatLabel(field)` | El display name traducido de un campo de personaje. |
| `ItemText.Get(key, fallback)` | Un texto de ítem: la tabla de ítems, después la de UI, después el valor de reserva. |
| `GameTextTokens.TryResolve(token, storeGet, out value)` | Los tokens `.label`: `@time:daypart.label` y los demás. |
| `BeastyRoutines.LocationDisplayOf(id)` | Dónde está un personaje ahora, como nombre de sala traducido. |

`VNUiLocalization.TokenLookup` resuelve los tokens de UI y responde también a los tokens `.label`, así que
cualquier texto de UI o de ítem puede usar `[@time:daypart.label]`. `VariableBoundLabel.Bind` admite un
`gameTextTable` opcional. En el editor, `GameTextSync.Sync(VNContext, VNTimeConfig)` sincroniza los textos del
juego leyendo los nombres del tiempo del time config que le pases en vez del `BeastyManager` de la escena: para
herramientas que montan la escena después.

## Menús de conversación

`TalkMenuService.ResolveForPlayer(...)` devuelve el menú de conversación de un personaje tal como lo ve el
jugador, con la opción **Irse** incluida; `Resolve` sigue devolviendo solo tus entradas. Una entrada Irse
tiene `ResolvedTalkEntry.IsLeave` activado, y su final es `TalkMenuEnding.Leave`. Consulta
[El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/#la-opción-irse).

## Transiciones y efectos propios

Añade tu propio modo de transición o tipo de efecto de pantalla en dos mitades:

1. **Los datos**: una clase que deriva de `TransitionSpec` (una transición) o de `ScreenEffect` (un efecto),
   con campos serializados. El editor del bloque dibuja esos campos solo. Para una disposición propia, escribe
   un `IEffectFieldsDrawer` y márcalo con `[EffectFieldsDrawer(typeof(TuSpec))]`.
2. **El runtime**: un `ITransitionStyle` registrado con `TransitionStyleRegistry.Register(typeof(TuSpec),
   style)`, o un `IScreenEffectApplier` registrado con `ScreenEffectApplierRegistry.Register(typeof(TuEfecto),
   applier)`.

`TransitionStyleRegistry.Unregister(Type)` quita un estilo registrado, también uno de serie. Una transición sin
estilo se presenta como un corte. Consulta [Transiciones visuales y efectos de pantalla](/es/docs/beasty-visual-novel/authoring/screen-effects/).

## El aspecto de los personajes, y utilidades del editor

- **Aspecto en el mundo libre.** `FreeRoamInteractable.ShowLook`, `HideLook`, `ShowsLook` y `HasOwnArt`,
  `PoseLooks.Refresh` y `LookColliderBuilder.Build` (namespace `Beasty.VN.Runtime`) pintan y refrescan el
  aspecto por capas de una pose o de un punto de personaje.
- **Herramientas del editor** (namespace `Beasty.VN.Editor`): `StreamedContentTools.VisitCharacterArt` y
  `CountArt`; `BeastyIdRename.RewriteValue` y `RewriteValueIn`; `WardrobeIdRename`, `ExpressionKeyRename` y
  `WardrobeValidation`.
- **Datos del vestuario.** Una categoría es un `WardrobeSlot` con un `mode` (`CategoryMode`). `WearAction` es el
  *Put on* / *Take off* del bloque Wear piece. `WardrobeState.Wear(..., WearAction)` y `WardrobeState.IsWorn`
  escriben y leen lo que se lleva; `WardrobeKeys.PieceKey` es la clave de variable de una prenda de una
  categoría *Several at once*; `IWearSource.TryGetPieceWorn` la responde para el resolvedor de condiciones.
  `ShowCharacterBlock.outfitId` es el conjunto opcional de un bloque Show character, y
  `ExpressionEntry.defaultOutfitId` el Default outfit de una expresión.
- **Preparación de escenas.** `PipelineCameraSetup.EnsureCameraData(camera)` (namespace `Beasty.VN.Editor`)
  añade el componente de datos por cámara del pipeline de render activo —`UniversalAdditionalCameraData` en
  URP, `HDAdditionalCameraData` en HDRP—, igual que hace **Create Scene** con su propia cámara.

## Ver también

- [Resumen de scripting](/es/docs/beasty-visual-novel/scripting/overview/)
- [La API estática VN](/es/docs/beasty-visual-novel/scripting/vn-api/)
- [Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/)
- [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/), [Rutinas de personaje](/es/docs/beasty-visual-novel/world/character-routines/),
  [Misiones](/es/docs/beasty-visual-novel/world/quests/), [Objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/)
