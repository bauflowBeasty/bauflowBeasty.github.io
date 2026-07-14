---
title: "La API estática VN"
description: "VN es el punto de entrada estático a la historia en ejecución. Tus scripts nunca necesitan una referencia a un controlador: llaman a VN.Advance, leen VN.GetBool, se suscriben a VN"
---

`VN` es el punto de entrada estático a la historia en ejecución. Tus scripts nunca necesitan una referencia a
un controlador: llaman a `VN.Advance()`, leen `VN.GetBool("met_maya")`, se suscriben a `VN.OnLineShown`.

Namespace: `Beasty.VN.Runtime`. Ensamblado: `Beasty.VN.Runtime`.

## VN y VNSession

`VNSession` es el objeto real. Es C# puro (sin MonoBehaviour): envuelve el director de la historia y el
contexto de tiempo de ejecución, y expone control de flujo, variables y eventos. `VisualNovelController`
construye una por historia y la publica como la sesión activa.

`VN` es una fachada estática sobre la sesión que esté activa en cada momento. Retransmite los eventos de la
sesión, así que una suscripción hecha una sola vez al arranque sigue funcionando en cada historia que el
jugador juegue. Cada llamada de reenvío es un no-op seguro (con una advertencia en la consola) cuando no hay
ninguna historia en ejecución.

Usa `VN` para todo. Recurre a `VN.Active` (la `VNSession`) solo cuando necesites un miembro que la clase
estática no reenvía — `Active.CurrentNode`, `Active.Director`, `Active.State`, `Active.OnTalkEntryChosen`,
`Active.CurrentChoiceSprite`, `Active.Stop()` — y recuerda que es null cuando no hay ninguna historia en
ejecución.

> **Advertencia**
> `VN.Get*` lee la SESIÓN ACTIVA. En el menú principal, en FreeRoam, o en tu modo Custom no hay sesión, y
> cada getter devuelve su valor de respaldo (fallback). Para leer el estado del juego desde fuera de una
> historia, lee en cambio el almacén compartido: `VNGameController.Instance.SharedVariables`. Las APIs de
> gameplay — `BeastyTime`, `BeastyRoutines`, `BeastyQuests`, `Inventory` — ya hacen esto, así que funcionan en
> todos los modos.

## Estado

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

`Backlog` es el historial de líneas mostradas, la más antigua primero. Cada `DialogueBacklog.Entry` es un
struct readonly con dos campos, `Speaker` y `Text`. Nunca es null.

## Eventos

```csharp
public static event Action OnStarted;
public static event Action OnEnded;
public static event Action<StoryNode> OnNodeChanged;
public static event Action<DialogueLine> OnLineShown;
public static event Action<IReadOnlyList<ChoiceOption>> OnChoicePresented;
public static event Action<int> OnChoiceChosen;
public static event Action<string, string> OnVariableChanged;
```

- `OnNodeChanged` se dispara en cada nodo, incluyendo los nodos invisibles Decision, SubGraph y Return.
- `OnLineShown` se dispara cuando una línea ha terminado de revelarse en pantalla. Su `DialogueLine` lleva
  `SpeakerName`, `Body`, `NameColor`, `TextColor`, `Font`, `FontSizeMultiplier`, `Effect` y `Portrait`. Puede
  ser null.
- `OnChoiceChosen` lleva el índice dentro de la lista que te dio `OnChoicePresented`, y se dispara antes de
  que la ruta avance.
- `OnVariableChanged` lleva `(key, newValue)`. El valor es un string — así es como el almacén guarda todo — y
  es null cuando la clave fue eliminada.

Estos son eventos estáticos en una clase estática. Sobreviven entre historias, y sobreviven a Fast Enter Play
Mode porque la clase reinicia sus estáticos en `SubsystemRegistration`. Aun así, desuscríbete en `OnDestroy`:
un evento que todavía mantiene una referencia a un MonoBehaviour destruido llamará sobre él.

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

`JumpTo` reinicia el historial y la pila de llamadas de subgrafos. `Save` y `Load` usan la ranura de guardado
rápido propia del controlador anfitrión cuando pasas null; para el sistema de ranuras orientado al jugador
usa `VNGameController` en su lugar, cubierto en [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/).
`PromptVariable` construye la solicitud a partir del tipo declarado de la variable, sus valores de enum y su
valor por defecto, y luego escribe la respuesta confirmada de vuelta en el almacén.

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

Las claves son las que declaraste en la pestaña Variables. Un error de tipeo no lanza excepción: lee el
valor de respaldo. Eso es exactamente lo que existen los [accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/)
para evitar.

## Variables de personaje

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

Respaldadas por el mismo almacén, bajo las claves reservadas `@char:<id>:<field>`. Ver
[Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/).

## Tokens y nombres

```csharp
public static string GetToken(string key);
public static void   SetToken(string key, string value);
public static string GetCharacterName(string characterId);
public static void   SetCharacterName(string characterId, string name);
public static string[] GetCharacterAliases(string characterId);
public static void   SetCharacterNameToAlias(string characterId, string aliasValue);
```

`SetCharacterNameToAlias` con un string vacío limpia el override y devuelve al personaje su nombre base.
`GetCharacterAliases` devuelve un array vacío cuando el personaje no tiene ninguno o es desconocido.

## Música de fondo

```csharp
public static void PlayBackgroundMusic(VNMusicQueue queue);
public static void SuspendBackgroundMusic(float fadeSeconds = 0.5f);
public static void ResumeBackgroundMusic();
public static void StopBackgroundMusic(float fadeSeconds = 1f);
```

Estos manejan la capa de música persistente por modo, no las cues de un solo disparo del bloque Music. Son
globales, no están atados a la sesión, así que funcionan en todos los estados de la aplicación. `Suspend` /
`Resume` es el par a usar cuando una cue debe poseer el canal Music durante un rato. Ver
[Audio y música](/es/docs/beasty-visual-novel/production/audio-and-music/).

## Ejemplo: manejar un sistema de voces desde OnLineShown

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

        // Tu propio esquema de nombres; Resources es solo un ejemplo de dónde viven los clips.
        var clip = Resources.Load<AudioClip>($"Voice/{line.SpeakerName}/{line.Body.GetHashCode():X}");
        if (clip == null) return;

        source.Stop();
        source.PlayOneShot(clip);
    }
}
```

`OnLineShown` se dispara después de que la línea termina de revelarse, así que un clip de voz iniciado aquí
no compite con la máquina de escribir. Si quieres que el clip empiece cuando comienza el texto, maneja eso
desde el bloque **Voice** autorado en su lugar.

## Ejemplo: registrar elecciones en analytics

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

`ChoiceOption` es un struct readonly con `Index`, `Text` y `TargetNodeId`. `OnChoiceChosen` se dispara antes
de que la ruta avance, así que `VN.Active.CurrentNode` sigue siendo el nodo que ofreció la elección.

## Ejemplo: leer y escribir una variable desde un script de gameplay

```csharp
using Beasty.VN.Runtime;
using UnityEngine;

public sealed class ShopCounter : MonoBehaviour
{
    public bool TryBuy(int price)
    {
        if (!VN.IsActive) return false;             // no hay historia en ejecución: el almacén no se puede leer vía VN
        if (VN.GetInt("money") < price) return false;

        VN.SetInt("money", VN.GetInt("money") - price);
        VN.SetCharInt("maya", "affection", VN.GetCharInt("maya", "affection") + 1);
        return true;
    }
}
```

Fuera de una historia, haz lo mismo contra el almacén compartido, que está activo en todos los modos:

```csharp
var store = VNGameController.Instance.SharedVariables;
int money = store.GetInt("money");
store.Set("money", (money - price).ToString());
```

## Ejemplo: manejar un HUD desde OnVariableChanged

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

`OnVariableChanged` solo se dispara mientras una historia está en ejecución. Para un HUD que también deba
actualizarse en FreeRoam y en tu propio modo, suscríbete en cambio a
`VNGameController.Instance.SharedVariables.Changed` — la misma firma `(key, value)`, pero en el almacén que
todos los modos comparten. Los widgets de HUD integrados hacen exactamente esto; ver
[Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/).

## Ver también

- [Resumen de scripting](/es/docs/beasty-visual-novel/scripting/overview/)
- [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/)
- [Accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/)
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/)
- [Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/)
