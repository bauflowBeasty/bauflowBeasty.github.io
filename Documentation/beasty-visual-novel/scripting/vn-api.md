# The VN static API

`VN` is the static entry point to the running story. Your scripts never need a reference to a controller:
they call `VN.Advance()`, read `VN.GetBool("met_maya")`, subscribe to `VN.OnLineShown`.

Namespace: `Beasty.VN.Runtime`. Assembly: `Beasty.VN.Runtime`.

## VN and VNSession

`VNSession` is the real object. It is plain C# (no MonoBehaviour): it wraps the story director and the runtime
context and exposes flow control, variables and events. `VisualNovelController` builds one per story and
publishes it as the active session.

`VN` is a static facade over whichever session is active. It relays the session's events, so a subscription
made once at startup keeps working across every story the player plays. Every forwarding call is a safe no-op
(with a warning in the console) when no story is running.

Use `VN` for everything. Reach for `VN.Active` (the `VNSession`) only when you need a member the static does not
forward — `Active.CurrentNode`, `Active.Director`, `Active.State`, `Active.OnTalkEntryChosen`,
`Active.CurrentChoiceSprite`, `Active.Stop()` — and remember it is null when no story is running.

> **Warning**
> `VN.Get*` reads the ACTIVE SESSION. In the main menu, in FreeRoam, or in your Custom mode there is no
> session, and every getter returns its fallback. To read game state from outside a story, read the shared store
> instead: `VNGameController.Instance.SharedVariables`. The gameplay APIs — `BeastyTime`, `BeastyRoutines`,
> `BeastyQuests`, `Inventory` — already do this, so they work in every mode.

## State

```csharp
public static VNSession Active { get; }
public static bool IsActive { get; }
public static bool IsAwaitingInput { get; }
public static bool IsAwaitingChoice { get; }
public static bool AutoAdvance { get; set; }
public static bool Skip { get; set; }
public static void ToggleAuto();
public static void ToggleSkip();
public static IReadOnlyList<DialogueBacklog.Entry> Backlog { get; }
public static IReadOnlyDictionary<string, string> AllVariables { get; }
public static bool IsDictionaryToken(string key);
```

`Backlog` is the shown-line history, oldest first. Each `DialogueBacklog.Entry` is a readonly struct with two
fields, `Speaker` and `Text`. It is never null.

## Events

```csharp
public static event Action OnStarted;
public static event Action OnEnded;
public static event Action<StoryNode> OnNodeChanged;
public static event Action<DialogueLine> OnLineShown;
public static event Action<IReadOnlyList<ChoiceOption>> OnChoicePresented;
public static event Action<int> OnChoiceChosen;
public static event Action<string, string> OnVariableChanged;
```

- `OnNodeChanged` fires for every node, including the invisible Decision, SubGraph and Return nodes.
- `OnLineShown` fires when a line has finished revealing on screen. Its `DialogueLine` carries `SpeakerName`,
  `Body`, `NameColor`, `TextColor`, `Font`, `FontSizeMultiplier`, `Effect` and `Portrait`. It may be null.
- `OnChoiceChosen` carries the index into the list that `OnChoicePresented` gave you, and fires before the route
  advances.
- `OnVariableChanged` carries `(key, newValue)`. The value is a string — that is how the store holds everything —
  and is null when the key was removed.

These are static events on a static class. They survive across stories, and they survive Fast Enter Play Mode
because the class resets its statics at `SubsystemRegistration`. Unsubscribe in `OnDestroy` anyway: an event that
still holds a reference to a destroyed MonoBehaviour will call into it.

## Control

```csharp
public static void Advance();
public static void Back();
public static void Choose(int index);
public static void JumpTo(string nodeId);
public static bool Save(string slot = null);
public static bool Load(string slot = null);
public static void PromptInput(VNInputRequest request, Action<string> onConfirm);
public static void PromptVariable(string variableKey, Action<string> onConfirm = null);
```

`JumpTo` resets the history and the subgraph call stack. `Save` and `Load` use the hosting controller's own
quick-save slot when you pass null; for the player-facing slot system use `VNGameController` instead, covered in
[Controllers](controllers.md). `PromptVariable` builds the request from the variable's declared type, enum values
and default, then writes the confirmed answer back into the store.

## Variables

```csharp
public static bool HasVariable(string key);
public static string GetString(string key, string fallback = null);
public static int    GetInt   (string key, int fallback = 0);
public static float  GetFloat (string key, float fallback = 0f);
public static bool   GetBool  (string key, bool fallback = false);
public static void SetString(string key, string value);
public static void SetInt   (string key, int value);
public static void SetFloat (string key, float value);
public static void SetBool  (string key, bool value);
```

The keys are the ones you declared in the Variables tab. A typo does not throw: it reads the fallback. That is
what [generated accessors](generated-accessors.md) exist to prevent.

## Character variables

```csharp
public static int    GetCharInt   (string characterId, string field, int fallback = 0);
public static bool   GetCharBool  (string characterId, string field, bool fallback = false);
public static float  GetCharFloat (string characterId, string field, float fallback = 0f);
public static string GetCharString(string characterId, string field, string fallback = "");
public static void SetCharInt   (string characterId, string field, int value);
public static void SetCharBool  (string characterId, string field, bool value);
public static void SetCharFloat (string characterId, string field, float value);
public static void SetCharString(string characterId, string field, string value);
```

Backed by the same store under the reserved `@char:<id>:<field>` keys. See
[Variable keys](../reference/variable-keys.md).

## Tokens and names

```csharp
public static string GetToken(string key);
public static void   SetToken(string key, string value);
public static string GetCharacterName(string characterId);
public static void   SetCharacterName(string characterId, string name);
public static string[] GetCharacterAliases(string characterId);
public static void   SetCharacterNameToAlias(string characterId, string aliasValue);
```

`SetCharacterNameToAlias` with an empty string clears the override and returns the character to the base name.
`GetCharacterAliases` returns an empty array when the character has none or is unknown.

## Background music

```csharp
public static void PlayBackgroundMusic(VNMusicQueue queue);
public static void SuspendBackgroundMusic(float fadeSeconds = 0.5f);
public static void ResumeBackgroundMusic();
public static void StopBackgroundMusic(float fadeSeconds = 1f);
```

These drive the persistent per-mode music layer, not the Music block's one-shot cues. They are global, not
session-bound, so they work in every app state. `Suspend` / `Resume` are the pair to use when a cue must own the
Music channel for a while. See [Audio and music](../production/audio-and-music.md).

## Example: drive a voice-over system from OnLineShown

```csharp
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class VoiceOverDirector : MonoBehaviour
{
    [SerializeField] private AudioSource source;

    private void OnEnable()  => VN.OnLineShown += HandleLineShown;
    private void OnDisable() => VN.OnLineShown -= HandleLineShown;

    private void HandleLineShown(DialogueLine line)
    {
        if (line == null || !line.HasSpeaker) return;

        // Your own naming scheme; Resources is only an example of where the clips live.
        var clip = Resources.Load<AudioClip>($"Voice/{line.SpeakerName}/{line.Body.GetHashCode():X}");
        if (clip == null) return;

        source.Stop();
        source.PlayOneShot(clip);
    }
}
```

`OnLineShown` fires after the line has finished revealing, so a voice clip started here does not race the
typewriter. If you want the clip to start as the text begins, drive it from the authored **Voice** block instead.

## Example: log choices to analytics

```csharp
using System.Collections.Generic;
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class ChoiceAnalytics : MonoBehaviour
{
    private IReadOnlyList<ChoiceOption> _presented;

    private void OnEnable()
    {
        VN.OnChoicePresented += HandlePresented;
        VN.OnChoiceChosen    += HandleChosen;
    }

    private void OnDisable()
    {
        VN.OnChoicePresented -= HandlePresented;
        VN.OnChoiceChosen    -= HandleChosen;
    }

    private void HandlePresented(IReadOnlyList<ChoiceOption> options) => _presented = options;

    private void HandleChosen(int index)
    {
        if (_presented == null || index < 0 || index >= _presented.Count) return;

        var picked = _presented[index];
        string node = VN.Active?.CurrentNode?.id ?? "(none)";
        Debug.Log($"[analytics] node={node} choice={index} text=\"{picked.Text}\" target={picked.TargetNodeId}");
    }
}
```

`ChoiceOption` is a readonly struct with `Index`, `Text` and `TargetNodeId`. `OnChoiceChosen` fires before the
route advances, so `VN.Active.CurrentNode` is still the node that offered the choice.

## Example: read and write a variable from a gameplay script

```csharp
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class ShopCounter : MonoBehaviour
{
    public bool TryBuy(int price)
    {
        if (!VN.IsActive) return false;             // no story running: the store is not readable through VN
        if (VN.GetInt("money") < price) return false;

        VN.SetInt("money", VN.GetInt("money") - price);
        VN.SetCharInt("maya", "affection", VN.GetCharInt("maya", "affection") + 1);
        return true;
    }
}
```

Outside a story, do the same against the shared store, which is live in every mode:

```csharp
var store = VNGameController.Instance.SharedVariables;
int money = store.GetInt("money");
store.Set("money", (money - price).ToString());
```

## Example: drive a HUD from OnVariableChanged

```csharp
using Beasty.VN.Runtime;
using TMPro;
using UnityEngine;

public sealed class MoneyHud : MonoBehaviour
{
    [SerializeField] private TMP_Text label;

    private void OnEnable()
    {
        VN.OnVariableChanged += HandleVariableChanged;
        Refresh(VN.GetInt("money"));
    }

    private void OnDisable() => VN.OnVariableChanged -= HandleVariableChanged;

    private void HandleVariableChanged(string key, string value)
    {
        if (key != "money") return;
        int.TryParse(value, out int money);
        Refresh(money);
    }

    private void Refresh(int money) => label.text = $"{money} G";
}
```

`OnVariableChanged` only fires while a story is running. For a HUD that must also update in FreeRoam and in your
own mode, subscribe to `VNGameController.Instance.SharedVariables.Changed` instead — the same
`(key, value)` signature, but on the store that every mode shares. The built-in HUD widgets do exactly this; see
[Screens and HUD](../world/screens-and-hud.md).

## See also

- [Scripting overview](overview.md)
- [Controllers](controllers.md)
- [Generated accessors](generated-accessors.md)
- [Variables and conditions](../world/variables-and-conditions.md)
- [Variable keys](../reference/variable-keys.md)
