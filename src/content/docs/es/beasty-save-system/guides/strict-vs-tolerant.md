---
title: "Carga estricta vs. tolerante"
description: "Hay dos formas de cargar un guardado que ya no coincide del todo con tu código: la estricta rechaza el archivo entero; la tolerante carga lo que puede y te dice qué omitió."
---

Hay dos formas de cargar un guardado cuyo contenido ya no coincide del todo con tu código. Estricta rechaza el archivo
entero. Tolerante carga lo que puede y te dice qué omitió. Esta página explica ambas, y cuándo elegir cada una.

Un campo la controla: `Strict` en [BeastySaveSettings](/es/docs/beasty-save-system/guides/settings/). Por defecto es `true`.

## La versión corta

| | `Strict = true` (por defecto) | `Strict = false` |
|---|---|---|
| Un campo malo | Toda la carga falla | Ese campo se omite |
| Qué se aplica | Nada | Todo lo demás |
| Dónde te enteras | `LoadResult.Error` es `FieldMapFailed` | `LoadResult.Warnings` |
| El mundo después de una carga mala | Exactamente como estaba | Parcialmente cargado |

## Estricto: todo o nada

Estricto es el valor por defecto porque es el modo que no puede dejar tu juego en un estado para el que nunca escribiste
código. Si un solo campo en el guardado no se puede mapear a tu clase, la carga falla y **no se
aplica nada**.

Es una garantía real, no un simple intento. Dos mecanismos la respaldan:

- Al mapear un objeto, cada campo se prepara primero. Los valores solo se asignan una vez que todos se han
  leído correctamente. Un fallo a mitad de camino no deja asignada la primera mitad.
- Al cargar una escena (`LoadAll`), el archivo completo se valida contra la escena **antes de que se mute nada**.
  Si aun así un componente falla al aplicarse, los componentes ya aplicados se
  revierten al estado en el que estaban.

Así que una carga estricta que falla deja el mundo exactamente como estaba antes de que la llamaras. El jugador ve
un mensaje de error y sigue jugando. No ve un guardado a medio cargar con el inventario correcto y la
posición incorrecta.

El fallo se reporta con el error `FieldMapFailed`, con un mensaje que nombra el campo:

```text
Field 'PlayerData.stamina' failed to load: expected Number, found String.
```

## Tolerante: omite el campo malo, conserva el resto

Configura `Strict = false` y el mismo archivo carga. El campo culpable se omite, su valor anterior se deja
intacto, y la carga tiene éxito con una advertencia:

```text
Field 'stamina' skipped: expected Number, found String.
```

Para una carga de escena, tolerante también omite entradas cuyo id de saveable ya no está en la escena, y entradas
cuyo componente ha desaparecido, cada una con una advertencia, y sigue adelante.

No hay rollback en modo tolerante. Ese es el punto: aplica lo que puede.

## Leer las advertencias

Una carga tolerante que tiene éxito aún puede tener cosas que decir. Lee `Warnings` — nunca es null, así que puedes
iterarla sin comprobación.

![Las advertencias que un cargado tolerante informa por los campos que omitió](/docs-images/beasty-save-system/save-tolerant-warnings.png)

```csharp
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;
using UnityEngine;

var settings = new BeastySaveSettings { Strict = false };

LoadResult<PlayerData> result = BeastySave.Load<PlayerData>("slot1", settings);

if (!result.Success)
{
    Debug.LogError($"Load failed: {result.Error} — {result.Message}");
    return;
}

foreach (string warning in result.Warnings)
    Debug.LogWarning($"Save was loaded, but: {warning}");

Apply(result.Value);
```

Las advertencias también quedan en el log automáticamente, así que las verás durante el desarrollo sin añadir
ningún código. Lo que no puedes hacer es ignorarlas y asumir que la carga fue limpia — una carga tolerante que omitió
cinco campos sigue reportando `Success = true`. Si te importa, comprueba `result.Warnings.Count`.

## Cuándo usar tolerante

Úsalo cuando un guardado antiguo debe abrirse con código nuevo, y perder un campo es aceptable.

El caso habitual es un renombrado. Publicaste una demo, los jugadores tienen guardados, y desde entonces renombraste
`PlayerData.hp` a `PlayerData.health`. Bajo estricto, esos guardados fallan. Bajo tolerante, cargan: `hp` en
el archivo no coincide con nada y se omite, `health` en tu clase mantiene su valor por defecto, y el resto del guardado
pasa correctamente. El jugador pierde un valor en lugar de todo el archivo.

Fíjate en lo que tolerante no es. Es una forma de sobrevivir a un desajuste, no una forma de arreglarlo — el valor en el
campo antiguo se descarta, no se mueve. Cuando realmente quieras trasladar el valor antiguo, lo que necesitas es una
migración, que reescribe el contenido del guardado antes de que empiece el mapeo:
[Versionado y migraciones](/es/docs/beasty-save-system/guides/versioning-and-migrations/). Las migraciones conservan los datos. La carga tolerante
solo tolera perderlos.

Una política razonable para un juego publicado: mantén `Strict = true`, y recurre a tolerante solo cuando una
actualización específica lo necesite.

## La advertencia que necesitas conocer

> **Advertencia**
> La carga tolerante solo aplica cuando el objeto raíz que cargas es una **clase**. Si cargas un struct, un
> string, una colección (un array, una `List`, un `Dictionary`) o un primitivo, el mapeo es estricto sin importar
> cómo esté configurado `Strict`. Un campo malo dentro de esos sigue haciendo fallar toda la carga.

En la práctica esto rara vez es un problema, porque una raíz de guardado casi siempre es una clase — un `PlayerData`, un
`GameState`. Pero si guardas una `List<InventoryEntry>` directamente en la raíz, `Strict = false` no te
protegerá de un campo renombrado dentro de `InventoryEntry`. Envuélvelo en una clase si necesitas la tolerancia.

Dos comportamientos más, en ambos modos:

- Un miembro que está **ausente o es null** en el archivo conserva en silencio el valor que el campo ya
  tenga. Eso no es una advertencia en ningún modo. Añadir un campo nuevo a tu clase de datos no rompe los guardados
  antiguos; el campo nuevo simplemente mantiene su valor por defecto.
- Un saveable que está en la escena pero no tiene datos en el archivo se deja intacto, con una advertencia. No se
  reinicia.

Solo un miembro que está **presente con el tipo equivocado** dispara la diferencia entre estricto y tolerante.

## Ver también

- [Settings](/es/docs/beasty-save-system/guides/settings/) — el campo `Strict`
- [Versionado y migraciones](/es/docs/beasty-save-system/guides/versioning-and-migrations/) — cómo conservar un valor antiguo en lugar de omitirlo
- [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/) — qué campos se escriben en primer lugar
- [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/) — `FieldMapFailed` y el resto
- [Estado de la escena](/es/docs/beasty-save-system/guides/scene-state/) — `LoadAll`, ids de saveable y el rollback de toda la escena
