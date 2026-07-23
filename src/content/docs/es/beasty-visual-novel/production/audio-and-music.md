---
title: "Audio y música"
description: "El sonido tiene dos capas: cues que la historia dispara desde un bloque, y una cola de música de fondo que acompaña al jugador desde el menú principal hasta la historia y el mundo."
---

El sonido tiene dos capas: **cues** que la historia dispara desde un bloque, y una **cola de música de
fondo** que acompaña al jugador desde el menú principal hasta la historia y de ahí al mundo. Esta página
cubre ambas, y el mezclador por el que pasan.

## Los cuatro canales

![El BeastyVNMixer con un grupo por canal](/docs-images/beasty-visual-novel/vn-mixer.png)

| Canal | Qué transporta |
|---|---|
| Music | La banda sonora: la cola de fondo y cualquier cue de música de un bloque. |
| Ambient | Atmósfera en bucle: lluvia, una multitud, un bosque. |
| Sfx | Disparos únicos: una puerta, un golpe, un clic de UI. Los SFX superpuestos no se cortan entre sí. |
| Voice | Líneas de voz. Una línea nueva detiene la anterior. |

Cada canal se enruta a través del AudioMixer incluido **`BeastyVNMixer`**, que tiene un grupo por canal bajo un
grupo Master. Los deslizadores de volumen del jugador en la pantalla de preferencias controlan los parámetros
expuestos del mezclador, y el volumen propio de un bloque establece el volumen de la fuente, así que ambos se
combinan: un cue silencioso se mantiene silencioso en proporción a lo que haya elegido el jugador.

Cada canal tiene al menos dos AudioSources físicos, que es lo que permite que la música y la ambientación
hagan crossfade en lugar de cortarse.

> **Nota**
> Si dejas un grupo del mezclador sin asignar, el gestor igual reproduce el sonido; simplemente no enruta ese
> canal a través del mezclador, así que el deslizador del jugador para ese canal no hace nada. Usa el
> mezclador incluido a menos que tengas una razón para no hacerlo.

## Los bloques de audio

Estos son los bloques que colocas en un nodo. Detalles completos en la
[referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/).

![Un bloque Music con su clip, su fundido y sus ajustes de bucle](/docs-images/beasty-visual-novel/vn-block-music.png)

| Bloque | Qué hace |
|---|---|
| **Music** | Reproduce un clip en el canal Music: clip, loop, volumen, fundido, y si pausar la cola de fondo. |
| **Ambient** | Reproduce un clip en el canal Ambient: clip, loop, volumen, fundido. |
| **Voice** | Reproduce un clip de voz: clip, volumen. |
| **Sound effect** | Un disparo único en el canal Sfx. |
| **Stop channel** | Detiene Music, Ambient, Sfx o Voice, con un fundido. |

Music y Ambient hacen **crossfade**: el clip nuevo entra en fundido mientras el anterior se apaga, durante
el tiempo de fundido del bloque. Un fundido de 0 hace el cambio al instante.

> **Advertencia**
> Un bloque sin clip asignado no hace nada — se omite, y lo que estuviera sonando sigue sonando. Para silenciar
> un canal a propósito, usa **Stop channel**.

## Música de fondo por modo de app

La banda sonora persistente se define una vez, en un asset **Music Config**
(`Create > Beasty VN > Config > Music Config`), y se edita en la pestaña **Music** de la ventana de Beasty VN.
Contiene una cola por cada modo de app de nivel superior:

![La pestaña Music: una cola por modo de la aplicación](/docs-images/beasty-visual-novel/vn-tab-music.png)

| Cola | Suena mientras |
|---|---|
| `mainMenu` | El jugador está en el menú principal. |
| `visualNovel` | La novela visual se está ejecutando. |
| `freeRoam` | El jugador está caminando por las salas. |
| `custom` | Tu propio modo de app Custom está activo ([Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/)). |

Cada cola tiene cuatro campos:

| Campo | Significado |
|---|---|
| `clips` | Los clips, en orden. Una cola vacía significa "sin música de fondo aquí". |
| `mode` | Cómo se secuencian. |
| `volume` | El volumen propio de la cola (0-1), combinado con el deslizador Music del jugador. |
| `crossfadeSeconds` | El crossfade cuando la cola comienza, y entre sus pistas. |

Los modos de reproducción:

| Modo | Comportamiento |
|---|---|
| `SequentialLoop` | Reproduce los clips en orden, luego empieza de nuevo. |
| `SingleInfinite` | Reproduce solo el primer clip, en bucle infinito. |
| `Shuffle` | Reproduce en orden aleatorio, reordenando cada ciclo. |
| `Once` | Reproduce los clips una vez en orden, luego se detiene. |

El controlador escucha el modo de app y reproduce la cola correspondiente. Volver a entrar a un modo cuya cola
ya se está reproduciendo no la reinicia — caminar por una casa cuyas salas comparten la misma música no hace
saltar la pista de vuelta al primer compás.

## Overrides: una sala, o una historia

Dos cosas pueden reemplazar la cola del modo:

- **Una sala.** El `FreeRoamRoom` de un prefab de sala lleva una cola `musicOverride`. Entra en esa sala y su
  música toma el control; una sala sin override reproduce la cola del modo de mundo libre. Consulta
  [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/).
- **Una historia.** Un `DialogueScene` lleva una cola `musicOverride`. Entra en esa novela visual y toma el
  control de la cola `visualNovel` del modo.

Un override sin clips no es un override: se aplica la cola del modo.

## Pausar el fondo para la pista propia de una escena

Un bloque **Music** tiene una bandera de **pausar fondo**, activada por defecto. Cuando el bloque se dispara, la
cola persistente se hace a un lado y el cue se queda con el canal Music mientras la escena lo necesite.
Cuando la historia avanza a un nodo sin un cue que pause, la cola de fondo se reanuda sola — no tienes que
acordarte de reiniciarla.

Desactiva la bandera cuando quieras que el cue simplemente reemplace la música, sin que la capa de fondo
vuelva a sonar.

## Ver también

- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — cada bloque, incluidos los de audio, campo por campo.
- [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/) — dónde vive el override de música de una sala.
- [UI prefabs](/es/docs/beasty-visual-novel/production/ui-prefabs/) — el prefab del mezclador y la pantalla de preferencias con los deslizadores de volumen.
