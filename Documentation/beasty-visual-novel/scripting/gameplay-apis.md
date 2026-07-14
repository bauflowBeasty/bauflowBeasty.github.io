# Gameplay APIs

Four static classes in `Beasty.VN.Runtime`: `BeastyTime`, `BeastyRoutines`, `BeastyQuests` and `Inventory`.
They are the code face of the world systems you author in the editor.

All four read and write the same `VariableStore` — `VNGameController.SharedVariables` — under reserved key
namespaces. Three consequences, and they matter:

- They work in EVERY app state, not only inside a running story. Unlike `VN.Get*`, they do not need a session.
- Everything they touch is in the save, automatically. You never serialize a quest or an item yourself.
- Everything they touch rewinds with the story, because rewind restores the store.

Every member degrades safely: no manager, no config, no context means a default value or a no-op, never an
exception.

## BeastyTime

Game time. Reads and writes the reserved `@time:*` keys.

```csharp
public static bool   Enabled  { get; }
public static int    Day      { get; }
public static int    Hour     { get; }
public static string Daypart  { get; }
public static string Weekday  { get; }
public static string Season   { get; }

public static VNTimeSnapshot Read();

public static void AdvanceDayparts(int n = 1);
public static void AdvanceHours(int n);       // Clock mode only
public static void AdvanceDays(int n = 1);
public static void SetDaypart(string name);
public static void SetHour(int hour);         // Clock mode only
public static void SetWeekday(string weekday);
```

`Enabled` is false when no `VNTimeConfig` is assigned on the `BeastyManager`. Then time is off: no `@time:` keys
are written, every getter returns its default and every time condition evaluates to false.

`Read()` returns a `VNTimeSnapshot`, a readonly struct with `Day`, `Hour`, `Daypart`, `Weekday`, `Season`. Use it
when you need several fields at a consistent moment.

> **Warning**
> Time is author-driven. The runtime NEVER advances the clock on its own. Nothing happens unless an Advance Time
> block runs, a FreeRoam object with `advanceTimeOnClick` is used, or you call one of the methods above. A game
> where nothing moves is a game that never advanced time.

Set the raw `@time:` variables by hand and you skip the derived-value republish (daypart from hour, weekday,
season) and the notifications that reactive UI depends on. Use these methods instead.

```csharp
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class Bed : MonoBehaviour
{
    // A minigame's "sleep" button: end the day, wake up next morning.
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

`SetWeekday` always moves forward to the next occurrence of that weekday (today counts). See
[Game time](../world/game-time.md).

## BeastyRoutines

Where characters are, right now and hypothetically.

```csharp
public static FreeRoamMapGraph ActiveMap { get; set; }

public static string LocationOf(string id);         // room id, or "" when absent
public static string SpotOf(string id);             // spot id within the room, or ""
public static bool   IsPresent(string id);
public static string ActiveProfileOf(string id);    // the routine profile in force
public static string LocationDisplayOf(string id);  // the room's displayName

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

`RoutinePlacement` is a readonly struct: `Present`, `RoomId`, `SpotId`, `Visual`.

`LocationOf` and friends are live reads of the store. The `ResolveAt` family answers a hypothetical — "where
would Maya be on Friday evening?" — by copying the store, overwriting the two time keys in the copy and
resolving against that. It is pure: asking where somebody will be tonight never makes it night.

The copy is the cost. One question is fine; a screenful of them is not. For a grid, take one `Snapshot()` and
ask against it with `ResolveIn`:

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
        var scratch = BeastyRoutines.Snapshot();     // one copy for the whole grid
        foreach (var weekday in new[] { "Monday", "Tuesday", "Wednesday" })
        foreach (var (daypart, _) in BeastyRoutines.DaySchedule(characterId, weekday))
        {
            var at = BeastyRoutines.ResolveIn(scratch, characterId, weekday, daypart);
            Debug.Log($"{weekday} {daypart}: {(at.Present ? at.RoomId : "away")}");
        }
    }
}
```

`DaySchedule` returns one entry per daypart in the time config, in order, and an empty list when time is off. See
[Character routines](../world/character-routines.md).

## BeastyQuests

Quest state, read and written against the shared store; the quest driver recomputes from there.

```csharp
public static string StateOf(string id);            // notstarted / active / completed / failed
public static bool   IsActive(string id);
public static bool   IsCompleted(string id);
public static bool   IsFailed(string id);
public static string LastResultOf(string id);       // last settled period of a recurring quest
public static int    StageOf(string id);
public static bool   ObjectiveDone(string id, string objectiveId);
public static List<string> ActiveQuestsOf(string characterId);
public static List<string> ActiveGlobalQuests();

public static void StartQuest(string id);
public static void SetState(string id, string state);
public static void CompleteObjective(string id, string objectiveId);
public static bool Deliver(string questId, string objectiveId);
```

`StartQuest` only starts a quest that is `notstarted`; it will not restart a completed one. Use `SetState` when
you really do mean to force a state.

`Deliver` settles a `GatherDeliver` objective: it verifies the inventory, consumes the items and marks the
objective done. It returns false and changes nothing when the player does not hold them. That is the only
objective type not driven by a `completeWhen` condition.

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

See [Quests](../world/quests.md).

## Inventory

The global inventory. Quantities live under the reserved `item.<id>` keys, the slot order under
`inventory.order`.

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

public static event Action<string, int> ItemChanged;   // (id, new quantity)
```

Every mutation clamps to the item's kind: a Key item is 0 or 1, a Consumable is 0 to its max. Reaching 0 drops
the item from the slot order and it disappears from the inventory UI; first acquisition appends it.

`Use` applies the item's effects, consumes `consumeAmount`, and — when `jumpScene` is true — jumps to the item's
VN scene. It returns false when the use condition does not currently pass. `Order()` returns held items in the
player's saved order.

`ItemHandle` is a typed handle over one id, with `Count`, `Owned`, `Max`, `CanUse`, `Give`, `Take`, `Set`, `Use`.
Combine it with the generated `ItemIds` constants to stay away from magic strings:

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

`ItemIds` is regenerated from the Items tab whenever your ids change, exactly like the accessors in
[Generated accessors](generated-accessors.md). See [Items and inventory](../world/items-and-inventory.md).

## See also

- [Scripting overview](overview.md)
- [The VN static API](vn-api.md)
- [Variable keys](../reference/variable-keys.md)
- [Game time](../world/game-time.md), [Character routines](../world/character-routines.md),
  [Quests](../world/quests.md), [Items and inventory](../world/items-and-inventory.md)
