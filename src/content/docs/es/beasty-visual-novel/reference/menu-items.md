---
title: "Menús"
description: "Cada elemento de menú que Beasty Visual Novel añade a Unity, agrupado por submenú, con la página que lo explica."
---

Cada elemento de menú que Beasty Visual Novel añade a Unity, agrupado por submenú, con la página que lo
explica.

Todo vive bajo `Tools > Beasty VN`, excepto las acciones de clic derecho sobre assets (bajo `Assets >`) y los
componentes (bajo `Add Component > Beasty`).

## Ventanas

| Elemento de menú | Qué hace | Más |
|---|---|---|
| `Tools > Beasty VN > Editor` | Abre la ventana principal de Beasty VN: las nueve pestañas de autoría. | [Recorrido del editor](/es/docs/beasty-visual-novel/getting-started/editor-tour/) |
| `Tools > Beasty VN > Dialogue Preview` | Reproduce un nodo — fondo, personajes, objetos, cuadro de diálogo — sin entrar en Play Mode. Puede avanzar rápido hasta un bloque dado. | [Vista previa de diálogo](/es/docs/beasty-visual-novel/authoring/dialogue-preview/) |

## Setup

| Elemento de menú | Qué hace | Más |
|---|---|---|
| `Tools > Beasty VN > Setup > Create Scene` | El asistente. Construye el BeastyManager, el Stage, el Canvas, la Main Camera y el EventSystem, instancia la UI, y luego autoconecta todo. Se puede volver a ejecutar sin riesgo: reutiliza lo que ya está ahí. | [Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/) |
| `Tools > Beasty VN > Setup > Migrate Scene to BeastyManager` | Actualiza una escena antigua al rig de BeastyManager. | [Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/) |
| `Tools > Beasty VN > Setup > Blank Canvas` | Pide una carpeta, y luego crea el andamiaje vacío: un DialogueScene, un VNContext, un LocalizationTable, un StoryGraph raíz y un primer nodo Dialogue, en subcarpetas. | [Assets](/es/docs/beasty-visual-novel/reference/assets/) |
| `Tools > Beasty VN > Setup > Build Default Menu Prefabs` | Regenera los prefabs de menú desde cero. Avisa antes de sobrescribir. | [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) |
| `Tools > Beasty VN > Setup > Upgrade UI Prefabs (keep customizations)` | Actualiza los prefabs de UI incluidos conservando tu rediseño. | [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) |

## Content

| Elemento de menú | Qué hace | Más |
|---|---|---|
| `Tools > Beasty VN > Content > Create Base Assets (intro + FreeRoam map)` | Crea solo lo que falta y lo conecta. Nunca duplica el contexto y nunca sobrescribe una referencia que ya asignaste. | [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/) |
| `Tools > Beasty VN > Content > Character Database` | Abre la pestaña Characters en su propia ventana. | [Personajes](/es/docs/beasty-visual-novel/world/characters/) |
| `Tools > Beasty VN > Content > Generate Tight Click Shapes (Selection)` | Construye áreas de clic que siguen los píxeles opacos del sprite seleccionado en vez de su bounding box. | [Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/) |

## Codegen

| Elemento de menú | Qué hace | Más |
|---|---|---|
| `Tools > Beasty VN > Codegen > Regenerate VNVars Accessors` | Regenera `VNVars`: accesores C# tipados para tus variables. | [Accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/) |
| `Tools > Beasty VN > Codegen > Regenerate VNChars Accessors` | Regenera `VNChars`: accesores C# tipados para tus personajes. | [Accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/) |

Ninguno de los dos es necesario para crear un juego. Existen para que un programador tenga claves
verificadas en tiempo de compilación.

## Maintenance

| Elemento de menú | Qué hace | Más |
|---|---|---|
| `Tools > Beasty VN > Maintenance > Validate Selected Project` | Ejecuta el validador sobre el grafo raíz y cada subgrafo, y reporta referencias colgantes. | [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/) |
| `Tools > Beasty VN > Maintenance > Clean Deleted-Asset Residue` | Elimina referencias dejadas por assets que borraste. | [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/) |

## Validate

| Elemento de menú | Qué hace | Más |
|---|---|---|
| `Tools > Beasty VN > Validate > Find duplicate ids` | Reporta colisiones de id entre assets. Dos assets que comparten un id se comportan como uno solo. | [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/) |

## Settings

| Elemento de menú | Qué hace | Más |
|---|---|---|
| `Tools > Beasty VN > Settings > Global Settings` | Abre VN Settings. El mismo asset que `Edit > Project Settings > Beasty VN`. | [VN Settings](/es/docs/beasty-visual-novel/production/vn-settings/) |

## Streaming

| Elemento de menú | Qué hace | Más |
|---|---|---|
| `Tools > Beasty VN > Streaming > Convert To Streamed Content` | Marca el arte como Addressable y limpia las referencias directas. Requiere el paquete Addressables. | [Streaming](/es/docs/beasty-visual-novel/production/streaming/) |
| `Tools > Beasty VN > Streaming > Convert To Direct References` | Lo inverso. Siempre disponible, con o sin Addressables. | [Streaming](/es/docs/beasty-visual-novel/production/streaming/) |

> **Advertencia**
> El streaming con Addressables es opcional y beta en 1.0.0. Funciona, pero la API puede cambiar en una
> versión menor.

## Export

| Elemento de menú | Qué hace | Más |
|---|---|---|
| `Tools > Beasty VN > Prepare package for export` | Ayudante de publicación: prepara el paquete para una exportación `.unitypackage`. | [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/) |

## Clic derecho en assets

Selecciona un asset en la ventana Project y haz clic derecho.

| Elemento de menú | Qué hace | Más |
|---|---|---|
| `Assets > Beasty VN > Give this asset fresh ids (fix a duplicate)` | Reasigna ids al asset seleccionado. Así es como arreglas un duplicado que reportó `Find duplicate ids`. | [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/) |
| `Assets > Beasty VN > Ensure Room Background Child` | Añade el componente de sala y un hijo de fondo a un prefab de sala hecho a mano, para que puedas soltar el arte de la sala y colocar interactuables sobre él. | [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/) |

## Add Component

| Componente | Qué es | Más |
|---|---|---|
| `Beasty > Beasty Manager` | El único GameObject del que cuelga todo el juego. Posee cada manager como subcomponente oculto. | [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/) |
| `Beasty > Beasty Loading Screen` | El overlay de carga que se muestra mientras la escena arranca y en los cambios de modo. | [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) |
| `Beasty > Beasty Aspect Ratio Enforcer` | Mantiene el juego en un aspect ratio fijo, con letterbox en el resto. | [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) |
| `Beasty > VN Transition Curtain` | El fade usado cuando el juego cambia de modo. | [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) |

El asistente añade el BeastyManager por ti. Solo necesitas `Add Component` cuando estás construyendo una
escena a mano.

## El botón que hay que recordar

El inspector del BeastyManager tiene un botón **Auto-wire / Repair**. Garantiza que exista cada manager y
vuelve a resolver las vistas de la escena por tipo, y **solo llena referencias vacías — nunca sobrescribe tu
conexión**. Si una escena deja de funcionar después de mover objetos o editar un prefab, pruébalo primero.
Consulta [Solución de problemas](/es/docs/beasty-visual-novel/troubleshooting/).

## Ver también

- [Assets](/es/docs/beasty-visual-novel/reference/assets/)
- [Prefabs](/es/docs/beasty-visual-novel/reference/prefabs/)
- [Recorrido del editor](/es/docs/beasty-visual-novel/getting-started/editor-tour/)
