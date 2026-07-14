---
title: "Resumen de scripting"
description: "Cómo está organizado Beasty Visual Novel, y dónde se conecta tu propio C#. Lee esto antes de programar contra la API, y luego ve a la página que cubre tu tarea."
---

Cómo está organizado Beasty Visual Novel, y dónde se conecta tu propio C#. Lee esto antes de programar contra
la API, y luego ve a la página que cubre tu tarea.

El código fuente completo en C# viene incluido con el paquete. Nada aquí es una caja negra.

## Ensamblados (assemblies)

| Ensamblado | Carpeta | Qué contiene |
|---|---|---|
| `Beasty.VN.Core` | `Core/` | El modelo de datos y la lógica pura: nodos, bloques, el almacén de variables, condiciones, el director de la historia, el tiempo, las rutinas, las misiones. Sin UI de Unity. |
| `Beasty.VN.Runtime` | `Runtime/` | La capa de vista y los controladores: `BeastyManager`, `VNGameController`, `VisualNovelController`, `StageController`, las vistas uGUI, la entrada, el guardado, el streaming. |
| `Beasty.VN.Editor` | `Editor/` | Todas las herramientas de autoría. Nunca se referencia desde un build. |

`Runtime` referencia a `Core`; `Core` no referencia a `Runtime`. Esa separación es la clave: el motor de la
historia no sabe que tu cuadro de diálogo existe. Puedes reemplazar toda la capa de presentación — escribir
tus propios componentes de vista, manejarlos desde la API `VN` — sin tocar el motor que ejecuta la historia.

Los namespaces reflejan los ensamblados: `Beasty.VN.Core` y `Beasty.VN.Runtime`. Dos ensamblados opcionales
compilan solo cuando su dependencia está presente: `Beasty.VN.Runtime.InputSystem` (el nuevo Input System) y
`Beasty.VN.Addressables` (streaming).

## Los objetos en tiempo de ejecución

**`BeastyManager`** es el único componente que colocas en la escena. Posee a todos los demás managers como
subcomponentes ocultos en su propio GameObject, garantiza que exista exactamente uno de cada uno, y los expone
mediante propiedades tipadas (`Game`, `VN`, `Stage`, `FreeRoam`, `Audio`, `Menus`, ...). También ejecuta la
secuencia de arranque detrás de una pantalla de carga. Obténlo con `BeastyManager.Instance`.

**`VNGameController`** posee la máquina de estados de la aplicación y el único `VariableStore` compartido que
todos los modos leen y escriben. El progreso es global porque este almacén es global: sobrevive a un cambio
de proyecto, es visible desde FreeRoam, y es lo que registra un archivo de guardado. Obténlo con
`VNGameController.Instance` o `BeastyManager.Instance.Game`.

**`VisualNovelController`** aloja una historia en ejecución. Construye el contexto de tiempo de ejecución, el
director de la historia y el adaptador de guardado, los envuelve en una `VNSession`, y publica esa sesión a
través de la API estática `VN`. Obténlo con `VisualNovelController.Instance` o `BeastyManager.Instance.VN`.

**`StageController`** pinta el escenario: el fondo, los personajes, los objetos (props). Lo maneja el
director, no tú. La memoria persistente del escenario vive en `VisualNovelController.PersistentStage`, así
que la escena sobrevive a un cambio de nodo, un cambio de proyecto y una excursión a FreeRoam.

## Los cuatro estados de la aplicación

`VNAppState` (en `Beasty.VN.Runtime`) tiene cuatro valores, y `VNGameController.State` siempre es uno de
ellos:

| Estado | Qué se está ejecutando |
|---|---|
| `MainMenu` | Sin historia, sin sala. Los menús poseen la pantalla. |
| `VisualNovel` | Una sesión de `VisualNovelController` está reproduciendo una `DialogueScene`. |
| `FreeRoam` | El jugador está en una sala en un `FreeRoamMapGraph`. |
| `Custom` | Tu código. El motor no tiene UI para este estado — ese es todo el sentido. |

`VNGameController.StateChanged` se dispara en cada transición. El guardado registra qué estado estaba activo,
así que una carga restaura el subsistema correcto. Ver [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/) para los métodos
que se mueven entre ellos, y [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/) para el cuarto.

## Quiero X -> usa Y

| Quiero | Usa | Página |
|---|---|---|
| Leer una variable | `VN.GetInt` / `GetBool` / `GetFloat` / `GetString` | [API de VN](/es/docs/beasty-visual-novel/scripting/vn-api/) |
| Escribir una variable | `VN.SetInt` / `SetBool` / `SetFloat` / `SetString` | [API de VN](/es/docs/beasty-visual-novel/scripting/vn-api/) |
| Leer o escribir una variable sin strings mágicos | `VNVars.Money`, `VNChars.Maya.Affection` | [Accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/) |
| Leer una variable fuera de una historia en ejecución | `VNGameController.Instance.SharedVariables` | [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/) |
| Reaccionar cuando se muestra una línea | `VN.OnLineShown` | [API de VN](/es/docs/beasty-visual-novel/scripting/vn-api/) |
| Reaccionar cuando aparecen opciones o se elige una | `VN.OnChoicePresented`, `VN.OnChoiceChosen` | [API de VN](/es/docs/beasty-visual-novel/scripting/vn-api/) |
| Reaccionar cuando una variable cambia | `VN.OnVariableChanged`, o `VariableStore.Changed` en el almacén compartido | [API de VN](/es/docs/beasty-visual-novel/scripting/vn-api/) |
| Iniciar una historia desde código | `VNGameController.EnterVisualNovel(project, nodeId)` | [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/) |
| Reproducir una historia y volver a la sala | `VNGameController.PlayVisualNovelThenReturn(...)` | [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/) |
| Avanzar, retroceder o elegir una opción desde código | `VN.Advance()`, `VN.Back()`, `VN.Choose(i)` | [API de VN](/es/docs/beasty-visual-novel/scripting/vn-api/) |
| Guardar o cargar una ranura (slot) | `VNGameController.SaveToSlot` / `LoadSlotDetailed` | [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/), [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/) |
| Leer o avanzar el reloj | `BeastyTime` | [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) |
| Preguntar dónde está un personaje | `BeastyRoutines` | [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) |
| Iniciar una misión o completar un objetivo | `BeastyQuests` | [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) |
| Dar, quitar o contar objetos | `Inventory` | [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) |
| Añadir mi propio modo de juego | `VNGameController.EnterCustom()` | [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/) |
| Persistir mis propios datos dentro de un guardado | `CaptureCustomStateJson` / `RestoreCustomStateJson`, o un componente `BeastySaveable` | [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/), [Estado de escena](/es/docs/beasty-save-system/guides/scene-state/) |
| Guardar un tipo de campo que el motor no conoce | Escribe un `IBeastyConverter` | [Conversores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/) |
| Retrasar el arranque hasta que mi propio sistema esté listo | `BeastyManager.RegisterBootBarrier` | [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/) |

## Ver también

- [La API estática VN](/es/docs/beasty-visual-novel/scripting/vn-api/)
- [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/)
- [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/)
- [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/)
- [Accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/)
- [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/)
