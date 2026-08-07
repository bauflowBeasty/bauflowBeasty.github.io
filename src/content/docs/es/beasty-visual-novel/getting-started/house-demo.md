---
title: "El House Demo"
description: "Un mini-juego completo y jugable dentro del paquete: abre una escena, dale a Play, y ve cada sistema principal funcionando antes de construir el tuyo."
---

El paquete incluye un mini-juego completo en `Demos/HouseDemo`: despiertas en una casa pequeña, conoces a
tu compañera de piso Mia, y haces una misión corta para ella. Existe para que veas cada sistema principal
funcionando — mundo libre, tiempo, rutinas, misiones, inventario, el menú de conversación, guardados,
localización — antes de construir nada tú mismo. Diez minutos de juego, y cada una de esas palabras queda
con imagen.

## Ejecutarlo

Abre `Demos/HouseDemo/HouseDemo.unity` en la ventana Project y dale a **Play**. Nada que configurar.

![La sala del House Demo en Play, con Mia y los interactuables](/docs-images/beasty-visual-novel/vn-house-demo-living.png)

El demo también merece quedarse abierto en el **editor**: sus assets — las dos `DialogueScene`, el mapa,
el catálogo de misiones, los personajes — son assets normales del proyecto, creados exactamente como se
crearán los tuyos. Cuando una página de la documentación describe una ventana, abrir la versión del demo
de ese contenido es la forma más rápida de ver un ejemplo poblado.

## Qué demuestra, y dónde mirar

| Tú juegas | El sistema detrás |
|---|---|
| Una pregunta pide tu nombre (déjala en blanco y te quedas «Alex») | El bloque `Ask` y el renombrado del jugador — [Personajes](/es/docs/beasty-visual-novel/world/characters/) |
| Dos preguntas de perfil, y una escena que reacciona a ellas | Variables fijadas por choices, enrutadas por una **decisión invisible** — [Choices y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) |
| Dos salas conectadas, con puertas | El mundo libre y el grafo del mapa — [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/) |
| Hacer clic en la cama convierte el día en noche, y los fondos cambian | El tiempo de juego (momentos del día) y los fondos condicionales — [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/) |
| Mia está en la sala de día, y de noche no — salvo el domingo | Una **rutina** semanal — [Rutinas de personaje](/es/docs/beasty-visual-novel/world/character-routines/) |
| «A Good First Impression»: habla con Mia, luego encuentra su libro | Una misión de dos etapas con un objetivo de recoger y entregar — [Misiones](/es/docs/beasty-visual-novel/world/quests/) |
| El libro aparece en el dormitorio solo a mitad de misión, y va a tu inventario | Visibilidad condicional y objetos — [Objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/) |
| Hablar con Mia abre un menú; una entrada solo aparece con amistad 10+ | El menú de conversación con entradas condicionales — [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/) |
| Las pantallas de perfil, estadísticas y calendario semanal de Mia | Las pantallas de personaje — [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) |
| Guarda, sal de Play, carga — el día, la misión y el inventario vuelven | El guardado — [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/) |
| Cambia entre inglés y español en Preferencias, en pleno juego | La localización — [Localización](/es/docs/beasty-visual-novel/production/localization/) |

Dos detalles que vale la pena notar mientras juegas. La decisión que reacciona a tus respuestas de perfil
no le enseña nada al jugador — las dos escenas de saludo difieren porque un nodo `decision` enrutó sobre
la variable `bold`. Y el demo **no tiene música a propósito**: sus colas están vacías, que es la forma
documentada de decir «silencio en este modo».

## Leer el guion de la historia

Toda la historia está escrita en el formato de guion de texto, mantenido en sincronía con el grafo:

- `Demos/HouseDemo/Scripts/HouseIntro.vnbeasty` — la escena del despertar: la pregunta del nombre, las dos
  choices de perfil, la decisión invisible, y la salida al mundo libre.
- `Demos/HouseDemo/Scripts/HouseInteractions.vnbeasty` — todo lo de la casa: las ramas del menú de
  conversación de Mia, los pasos de la misión, la recogida del libro, las estanterías.

Abre cualquiera en la pestaña **Text** de la ventana Story, o en cualquier editor de texto. Son cortos, y
usan las mismas construcciones `.vnbeasty` que documenta la
[referencia de sintaxis](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/) — un ejemplo funcionando
de `ask`, `quest`, `deliver`, `give`, condiciones y salidas `freeroam`.

## El arte de relleno

Todo el arte son PNG de relleno etiquetados bajo `Demos/HouseDemo/Sprites/` — colores planos con el nombre
del asset estampado encima (LIVING ROOM - DAY, MIA, BOOK…). Catorce archivos, nombrados por función:

| Prefijo | Archivos | Se usan como |
|---|---|---|
| `bg_` | `bg_living_day`, `bg_living_night`, `bg_bedroom_day`, `bg_bedroom_night` | Fondos de sala, uno por momento del día |
| `char_` | `char_player_full`, `char_mia_full` | Sprites de escenario |
| `portrait_` | `portrait_player`, `portrait_mia` | Retratos de diálogo |
| `pose_` | `pose_mia_living` | Mia de pie en la sala |
| `item_` | `item_book` | El objeto de la misión |
| `door_` | `door_to_living`, `door_to_bedroom` | Las puertas clicables |
| `prop_` | `prop_shelf`, `prop_bed` | Los muebles clicables |

**Sustituye cualquier archivo por arte final con el mismo nombre y no hay que recablear nada** — cada
referencia del demo apunta al archivo, no a una copia. El demo nunca sobrescribe un PNG existente, así que
tus sustituciones están a salvo.

Eso convierte el demo en un **esqueleto utilizable para tu propio juego**: no renombres nada, cambia el
arte, reescribe los `.vnbeasty`, y el cableado — salas, pantallas, guardado y carga, localización — ya
está hecho.

## Ver también

- [Instalación](/es/docs/beasty-visual-novel/getting-started/installation/) — dónde pone las cosas el paquete
- [Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/) — construye lo mismo desde una escena vacía
- [Conceptos básicos](/es/docs/beasty-visual-novel/getting-started/core-concepts/) — el vocabulario que el demo te acaba de enseñar
- [El guion de texto](/es/docs/beasty-visual-novel/authoring/text-script/) — el formato en el que está escrita la historia del demo
- [Misiones](/es/docs/beasty-visual-novel/world/quests/) — el sistema detrás de «A Good First Impression»
