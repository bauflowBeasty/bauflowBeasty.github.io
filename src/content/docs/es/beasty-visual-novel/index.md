---
title: "Beasty Visual Novel"
description: "Tú escribes la historia. Beasty Visual Novel la reproduce. Un motor completo de novela visual para Unity: una ventana de creación donde construyes la historia, y un runtime que se la muestra al jugador sin necesidad de código."
---

Tú escribes la historia. Beasty Visual Novel la reproduce. Es un motor completo de novela visual para Unity: una
ventana de creación donde construyes la historia, y un runtime que se la muestra al jugador, sin necesidad de
código en ningún momento.

## Dos vistas de la misma escena

Una escena tiene dos caras, y son la misma escena:

- **El grafo.** Un lienzo de nodos. Cada nodo es un beat de la historia, y dentro de él una pila de bloques
  se ejecuta de arriba a abajo: fija un backdrop, muestra un personaje, dice una línea, cambia una variable.
- **El script de texto.** La misma escena escrita como un archivo `.vnbeasty`, en una sintaxis compacta
  similar a Ren'Py. `juan (whisper) "psst..."` es una línea. `label cruce (choice):` es un nodo de elección.

La pestaña Story tiene un alternador **Graph / Text**. Escribe en el que mejor se ajuste al momento: esboza la
estructura en el grafo, y luego escribe a toda velocidad cien líneas de diálogo como texto.

El paquete hace una promesa al respecto, y es la promesa que importa cuando tienes una semana de trabajo
metida en una escena: **el grafo es la fuente de verdad.** Un script que no se puede parsear, que está vacío,
o que destruiría contenido, nunca sobrescribe tus nodos — la importación se rechaza y el grafo queda
exactamente como estaba. Cualquier importación que pudiera perder contenido deja antes un `.bak` con marca de
tiempo junto al script. El arte se referencia por GUID, así que renombrar o mover un sprite no rompe un nodo
sincronizado.

> **Nota**
> Un límite que conviene conocer antes de empezar: un backdrop construido a partir de más de una capa de
> sprite no tiene forma de texto. Esas escenas se quedan solo en el grafo. Consulta [El script de texto](/es/docs/beasty-visual-novel/authoring/text-script/).

## Más que un reproductor de diálogos

- **Salas de mundo libre.** Deja la novela por una sala explorable con puertas, interactuables y personajes
  clicables, y luego vuelve. Consulta [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/).
- **Tiempo de juego.** Momentos del día, un reloj opcional, días de la semana y estaciones. El tiempo nunca
  avanza por sí solo — tú lo avanzas. Consulta [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/).
- **Rutinas de personajes.** Dónde está cada personaje, por día y por momento del día, editado en una
  grilla de semana x momento del día. Consulta [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).
- **Misiones y el menú de conversación.** Misiones con etapas, objetivos, recompensas y recurrencia; un
  centro de conversación por personaje que siempre lista exactamente lo que puedes decirle a ese personaje
  ahora mismo. Consulta [Misiones](/es/docs/beasty-visual-novel/world/quests/) y [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/).
- **Personajes con stats y pantallas.** Expresiones, retratos, estilos de entrega, alias, stats por
  personaje, y pantallas dentro del juego para la lista de reparto, el perfil, el calendario y el registro
  de misiones. Consulta [Personajes](/es/docs/beasty-visual-novel/world/characters/) y [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/).
- **Variables y condiciones en todas partes.** Cualquier bloque, cualquier elección, cualquier puerta,
  cualquier regla de rutina puede condicionarse sobre las mismas variables. Consulta
  [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/).
- **Localización.** Tablas de traducción para la historia y para la UI, importación y exportación
  CSV/TSV, seguimiento de desactualización, y cambio de idioma en vivo. Consulta [Localización](/es/docs/beasty-visual-novel/production/localization/).
- **Guardado y carga.** Slots con miniaturas, autoguardado, y un guardado que contiene todo el mundo: tus
  variables, el tiempo, las misiones, el inventario, el escenario y el historial de rebobinado. Consulta
  [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/).

Todo lo que ve el jugador es un prefab uGUI que puedes restilizar. Se incluye el código fuente completo en C#.

## Por dónde empezar

Todo el mundo lee [Instalación](/es/docs/beasty-visual-novel/getting-started/installation/) y luego
[Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/) — de la nada a una escena jugable con dos
líneas habladas y una elección, sin escribir código. Después, elige tu camino.

### Solo quieres escribir una historia

1. [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/) — escena, contexto, grafo, nodo, bloque. Diez
   minutos, y todas las demás páginas cobran sentido.
2. [Recorrido del editor](/es/docs/beasty-visual-novel/getting-started/editor-tour/) — para qué sirve cada pestaña de la ventana Beasty VN.
3. [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) y [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) —
   todo el vocabulario de creación.
4. [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/) y
   [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/).
5. [El script de texto](/es/docs/beasty-visual-novel/authoring/text-script/) cuando quieras escribir más rápido de lo que puedes hacer clic.
6. [Localización](/es/docs/beasty-visual-novel/production/localization/) y
   [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/) cuando llegue el momento de lanzar.

### Estás construyendo un life-sim con salas y rutinas

1. [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/), y presta atención al almacén de variables —
   es la razón por la que funciona el resto de esta lista.
2. [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/) y
   [Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/).
3. [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/), y luego [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).
4. [Misiones](/es/docs/beasty-visual-novel/world/quests/) y [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/).
5. [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/) y
   [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/).
6. [Ítems e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/).

### Eres programador

1. [Resumen de scripting](/es/docs/beasty-visual-novel/scripting/overview/) — los ensamblados y dónde conectarte. `Core` es lógica
   pura sin UI de Unity, en su propio ensamblado separado de la capa de vista.
2. [La API estática VN](/es/docs/beasty-visual-novel/scripting/vn-api/) — el punto de entrada estático `VN`, su estado, eventos y control.
3. [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/) — `BeastyManager`, `VNGameController`,
   `VisualNovelController`.
4. [APIs de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) — `BeastyTime`, `BeastyRoutines`, `BeastyQuests`,
   `Inventory`.
5. [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/) — mete tu propio minijuego o sistema de combate en el
   juego como un estado de aplicación de primera clase que se guarda, se carga y se rebobina junto con todo
   lo demás.
6. [Accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/) — `VNVars` y `VNChars` te dan claves de
   variables y personajes verificadas en tiempo de compilación.

## Los guardados vienen integrados

**Beasty Save System viene incluido dentro de este paquete.** No lo importes por separado. No hay
dependencias externas ni paquetes de terceros que instalar: el guardado, los slots, las miniaturas, el
autoguardado, las copias de seguridad y la encriptación opcional funcionan de fábrica. Si quieres guardar tus
propios objetos junto con la historia, su documentación está en [Beasty Save System](/es/docs/beasty-save-system/).

## Ver también

- [Instalación](/es/docs/beasty-visual-novel/getting-started/installation/)
- [Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/)
- [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/)
- [Recorrido del editor](/es/docs/beasty-visual-novel/getting-started/editor-tour/)
- [Elementos de menú](/es/docs/beasty-visual-novel/reference/menu-items/) y [Assets](/es/docs/beasty-visual-novel/reference/assets/)
- [Solución de problemas](/es/docs/beasty-visual-novel/troubleshooting/) y [Preguntas frecuentes](/es/docs/beasty-visual-novel/faq/)
