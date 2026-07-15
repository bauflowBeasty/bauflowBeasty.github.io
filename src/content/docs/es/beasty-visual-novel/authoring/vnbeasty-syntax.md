---
title: "Referencia de sintaxis .vnbeasty"
description: "Cada construcción del guion de texto .vnbeasty, para consulta. Un archivo es una escena: cada label es un nodo, y jump los conecta entre sí. Si nunca has usado el formato, empieza por El guion de texto."
---

Cada construcción del guion de texto `.vnbeasty`, para consulta. Un archivo es una escena: cada `label` es un
nodo, `jump` conecta los nodos entre sí. Si no has usado el formato antes, lee primero
[El guion de texto](/es/docs/beasty-visual-novel/authoring/text-script/): cubre el editor, las reglas de sincronización y el contrato de
seguridad.

## Contenido

- [Estructura del archivo](#estructura-del-archivo)
- [Diálogo y narración](#diálogo-y-narración)
- [Fondos](#fondos)
- [Personajes](#personajes)
- [Audio](#audio)
- [Estado e inventario](#estado-e-inventario)
- [Misiones, pantallas y rutinas](#misiones-pantallas-y-rutinas)
- [Tiempo de juego](#tiempo-de-juego)
- [Prompts](#prompts)
- [Nombres de personaje](#nombres-de-personaje)
- [Flujo y transiciones](#flujo-y-transiciones)
- [Elecciones y decisiones](#elecciones-y-decisiones)
- [Subgrafos y retorno](#subgrafos-y-retorno)
- [Condiciones y efectos](#condiciones-y-efectos)
- [Notas](#notas)

---

## Estructura del archivo

Un archivo es un encabezado opcional seguido de secciones `label`. Un label empieza en la columna 0 y
termina con `:`; sus sentencias están indentadas debajo de él.

```text
scene "Chapter 1"        # nombre legible de la escena (opcional)
start intro              # label / entryNodeId de entrada (opcional; por defecto = el primer label)

label intro:             # un nodo (DialogueNode por defecto)
    backdrop bedroom
    juan "Hello, how are you?"
    jump cruce           # cable hacia otro label
```

`jump <label>` fija cuál es el siguiente nodo por defecto. Un nodo de diálogo sin `jump` simplemente
termina.

### Anotaciones de tipo

El tipo de nodo se infiere del cuerpo, o se anota explícitamente en la línea del label. La anotación siempre
se conserva en el ida y vuelta.

| Anotación | Tipo de nodo | Qué es |
|---|---|---|
| *(ninguna)* | `DialogueNode` | Ejecuta sus bloques en orden, y luego va a su destino `jump`. |
| `(dialogue)` | `DialogueNode` | La forma explícita del valor por defecto. |
| `(choice)` | `ChoiceNode` | Contiene líneas `choice`. Consulta [Elecciones y decisiones](#elecciones-y-decisiones). |
| `(decision)` | `DecisionNode` | Contiene ramas `if` / `else`. Invisible para el jugador. |
| `(subgraph)` | `SubGraphNode` | Contiene rutas `outcome`. Consulta [Subgrafos y retorno](#subgrafos-y-retorno). |
| `(return "win")` | `ReturnNode` | Termina un subgrafo, devolviendo la clave de resultado entre comillas. |

Un label cuya **única** línea es una salida de flujo `->` es un `FlowNode`, sin necesidad de anotación.
Consulta [Flujo y transiciones](#flujo-y-transiciones).

```text
label cruce (choice):
label ruta (decision):
label combat (subgraph):
label combat/done (return "win"):
```

Un `(...)` al final de una línea de label cuenta como anotación de tipo solo cuando nombra un tipo conocido.
`label Meeting (part 2):` es un nodo llamado `Meeting (part 2)`. Entrecomilla el nombre del label cuando
contenga `#`, `"`, o termine en `)`.

### La anotación de id

```text
label intro:  #@id:8f2c1a7b-…
```

El comentario `#@id:<guid>` se escribe automáticamente en cada ida y vuelta. Lleva la identidad del nodo, así
que renombrar un `label` renombra el nodo en lugar de destruirlo y crear uno nuevo — algo que perdería la
posición del nodo en el lienzo y los cables que apuntan a él. Omítelo cuando escribas un label nuevo a mano;
la siguiente sincronización lo añade.

## Diálogo y narración

```text
juan "Hello"                  # speaker = el id de personaje 'juan'
"The room went quiet."        # sin speaker = narrador
juan (whisper) "psst..."      # delivery state
juan as "The Stranger" "..."  # alias de display-name en una línea
```

La forma completa es `<speaker> [(state)] [as "alias"] "text"`. El delivery state nombra uno de los
delivery styles del personaje —`whisper`, `shout`, `thinking`, o uno propio— y cambia la fuente, el color y
el efecto de texto solo de esa línea. `as "..."` muestra la línea bajo un alias sin cambiar el nombre del
personaje; para cambiar el nombre de forma permanente, usa [`name`](#nombres-de-personaje).

El diálogo es la única sentencia con texto libre. Ese texto se almacena en la tabla de localización, en el
idioma de autoría seleccionado en la pestaña Story.

## Fondos

```text
backdrop bedroom              # un sprite, resuelto por nombre
backdrop interiors/bedroom    # desambiguar por subcarpeta
backdrop clear                # eliminar el fondo
backdrop video rain           # un clip de video en lugar de un sprite
backdrop video rain once mute volume 0.5 manual
```

Un fondo de video se reproduce en bucle, con su audio a volumen completo, y arranca en cuanto aparece. Cada
modificador desactiva una de esas cosas:

| Modificador | Efecto |
|---|---|
| `once` | Reproduce una vez en lugar de repetir. |
| `mute` | Silencia el audio del clip. |
| `volume <0..1>` | Reproduce el audio del clip a este volumen. |
| `manual` | No arranca automáticamente al aparecer. |

`clear` y `video` son palabras clave solo cuando no están entre comillas, así que un sprite realmente
llamado `video` sigue funcionando si lo entrecomillas.

> **Nota**
> Un fondo con más de una capa de sprites no tiene forma de texto. Esas escenas se quedan solo en el grafo.

## Personajes

```text
show juan happy at left                  # expresión + anclaje
show maria base at right scale 1.2 flip
expression juan sad
hide juan
clear characters
```

`show <character> <expression> [at <anchor>] [scale <n>] [flip]`. La clave de expresión es la definida en el
personaje; la clave por defecto es `base`.

| Anclaje | Posición |
|---|---|
| `left` | Extremo izquierdo. |
| `centerleft` | Entre izquierda y centro. |
| `center` | Centro. Es el valor por defecto, y se omite al escribirse desde el grafo. |
| `centerright` | Entre centro y derecha. |
| `right` | Extremo derecho. |
| `custom <x>` | Una posición X normalizada, de 0 a 1: `show juan happy at custom 0.35`. |

`scale` es un multiplicador (1 es sin escalar, y se omite al escribirse desde el grafo). `flip` refleja el
sprite horizontalmente.

`expression <character> <expression>` cambia la expresión de un personaje ya en escena. `hide <character>`
retira uno. `clear characters` retira a todos.

## Audio

```text
music calm fade 2                        # repite por defecto
sound door
ambient forest
voice juan_l1
stop music fade 1
```

La forma es `<channel> <clip> [fade <s>] [vol <0..1>] [once] [keepbg]`.

| Canal | Qué reproduce |
|---|---|
| `music` | El canal de música. Repite. Pausa la música de fondo mientras suena. |
| `ambient` | El canal ambiente. Repite. |
| `sound` | Un disparo único en el canal SFX. |
| `voice` | Un clip de voz en el canal de voz. |

| Modificador | Efecto | Se aplica a |
|---|---|---|
| `fade <s>` | Aparece gradualmente durante estos segundos. Por defecto 1. | `music`, `ambient` |
| `vol <0..1>` | Volumen. Por defecto 1. | los cuatro |
| `once` | Reproduce una vez en lugar de repetir. | `music`, `ambient` |
| `keepbg` | No pausa la música de fondo. | `music` |

Ten en cuenta que un fondo de video escribe su volumen como `volume`, mientras que una pista de audio lo
escribe como `vol`.

`stop <channel> [fade <s>]` detiene un canal. Los canales son `music`, `ambient`, `sfx` y `voice`.

```text
stop ambient
stop voice fade 0.5
```

## Estado e inventario

```text
set gold = 10            # asignar (también  +=  -=)
set gold += 5
toggle flag_x
dict city = "Madrid"     # un token de diccionario
set juan.affection += 1  # una variable de personaje
give 3 potion            # inventario
take 1 potion
use key
item potion = 5          # fijar una cantidad absoluta
wait 2                   # esperar 2 segundos
wait                     # esperar al clic del jugador
```

`set <key> = <value>` asigna; `+=` suma; `-=` resta. `toggle <key>` invierte un bool.

Una clave que contiene un punto es una **variable de personaje**: `set juan.affection += 1` fija el campo
`affection` del personaje `juan`.

`dict <key> = "<value>"` fija un token de diccionario: un texto editable por el jugador.

`give <amount> <item>` y `take <amount> <item>` se limitan al máximo del ítem y a 0. `item <id> = <amount>`
fija la cantidad directamente. `use <item>` ejecuta los efectos de uso del ítem.

`wait <seconds>` pausa. `wait` sin número espera al clic del jugador.

Los nombres provienen de las pestañas Variables, Dictionary e Items. El guion los referencia; no los crea.

## Misiones, pantallas y rutinas

```text
quest ana_m1 state = active        # notstarted / active / completed / failed
quest ana_m1 stage = 2             # misiones ordenadas: fijar el índice de etapa
quest ana_m1 stage += 1            # ...o avanzarlo
quest ana_m1 objective run = true  # marcar un objetivo hecho (false lo despeja)
deliver ana_m1 entrega             # entregar los ítems de un objetivo de recolectar-y-entregar
screen inventory                   # abrir una pantalla secundaria (por su id)
routine ana Work                   # cambiar el perfil de rutina de un personaje ("" = por defecto)
```

| Forma | Qué hace |
|---|---|
| `quest <id> state = <state>` | Fija el estado de la misión. Los cuatro estados son `notstarted`, `active`, `completed`, `failed`. |
| `quest <id> stage = <n>` | Fija el índice de etapa de una misión ordenada. |
| `quest <id> stage += <n>` | Avanza el índice de etapa. |
| `quest <id> objective <objId> = true` | Marca un objetivo hecho. `= false` lo despeja. |
| `deliver <quest> <objective>` | Entrega los ítems de un objetivo de recolectar-y-entregar. No hace nada si el jugador no los tiene. |
| `screen <id>` | Abre una pantalla secundaria. |
| `routine <character> <profile>` | Cambia el perfil de rutina activo del personaje. Usa `""` para el perfil por defecto. |

## Tiempo de juego

```text
time +2 dayparts                   # avanzar el reloj (también: +3 hours, +1 day)
time daypart evening               # ...o fijarlo directamente (entrecomilla nombres con espacios)
time hour 14                       # solo en modo Clock
time weekday monday
```

Las formas de avance empiezan con una cantidad con signo, las formas de fijar empiezan con la unidad:

| Forma | Qué hace |
|---|---|
| `time +<n> dayparts` | Avanza n momentos del día. |
| `time +<n> hours` | Avanza n horas. Solo en modo Clock. |
| `time +<n> days` | Avanza n días. |
| `time daypart <name>` | Fija el momento del día. |
| `time hour <n>` | Fija la hora. Solo en modo Clock. |
| `time weekday <name>` | Fija el día de la semana. Siempre hacia adelante; el mismo día cuenta. |

La unidad puede ir en singular (`+1 day` es lo mismo que `+1 days`); la forma canónica escrita desde el
grafo siempre es plural. Los nombres de momento del día y día de la semana son los configurados en la
[configuración de tiempo](/es/docs/beasty-visual-novel/world/game-time/) del proyecto.

## Prompts

Un prompt muestra una línea más un campo de texto, y guarda la respuesta del jugador donde le indiques.

```text
ask gold "How much gold?" default 0 required
ask dict city "Your city?"
ask name hero "What's your name?" default "Traveler"
```

| Forma | A dónde va la respuesta |
|---|---|
| `ask <variable> "<question>"` | A una variable. |
| `ask dict <token> "<question>"` | A un token de diccionario. |
| `ask name <character> "<question>"` | Al nombre mostrado del personaje. |

Opciones, en orden después de la pregunta: `by <character> [(state)] [as "alias"]` hace que un personaje la
pregunte en lugar del narrador, con un delivery state y un alias opcionales; `default <value>` precarga el
campo; `required` rechaza una respuesta vacía.

```text
ask gold "How much do you have?" by juan (whisper) as "The Stranger" default 0 required
```

## Nombres de personaje

```text
name juan = "Don Juan"            # fijar el nombre mostrado (texto literal)
name juan = alias "The Stranger"  # ...desde uno de los alias del personaje
name juan = var player_name       # ...desde el valor de una variable o token
name juan reset                   # volver al nombre base
```

Esto cambia el nombre de forma permanente, a diferencia del `as "..."` de una
[línea de diálogo](#diálogo-y-narración), que solo dura esa línea.

## Flujo y transiciones

```text
freeroam town/square              # ir a una sala de FreeRoam
freeroam previous                 # volver a la sala de la que vino el jugador
freeroam choose town              # dejar que el jugador elija una sala en ese mapa
goto-scene Chapter2               # ir a otra DialogueScene
goto-scene Chapter2 from intro    # ...empezando en un nodo concreto
```

`freeroam <map>/<room>` nombra el grafo del mapa y la sala dentro de él.

Una línea de flujo suelta como las de arriba es un **bloque de salida al final** dentro de un nodo de
diálogo: se ejecuta después de los demás bloques del nodo. Para hacer que la transición sea **su propio
nodo** en el grafo —un `FlowNode`— escribe un label cuya única línea sea la salida, con el prefijo de la
flecha de ruta:

```text
label to_town:
    -> freeroam town/square      # este label compila a un FlowNode

label leave:
    -> freeroam previous         # cualquier salida de flujo funciona: previous / choose <map> / goto-scene …
```

Otros labels lo alcanzan con `jump to_town`, o con `-> to_town` como destino de una choice o una rama. Para
ir a otro label, en cambio, no se usa la ruta `->`: se escribe `jump <label>`.

## Elecciones y decisiones

Las elecciones y decisiones viven en su **propio** `label` y se alcanzan con `jump`. Una línea por opción.
El destino después de `->` puede ser otro label o una salida de flujo (`freeroam …` / `goto-scene …`).

```text
label cruce (choice):
    choice "Go left" -> cave
    choice "Buy a sword" if gold >= 10 { gold -= 10 } -> smith   # condición + efectos
    choice "Flee" -> freeroam town/square                        # destino de flujo
    default -> alley                                             # usado si todo queda bloqueado
```

Un **nodo de elección** muestra las opciones cuya condición se cumple. `default -> <label>` indica a dónde
ir cuando todas las opciones quedan bloqueadas.

```text
label ruta (decision):           # enrutador invisible (DecisionNode)
    if gold > 100 { rich = true } -> rich_end
    if saw_intro -> chapter2
    else -> poor_end             # la rama de fallback (condición vacía)
```

Un **nodo de decisión** enruta de forma automática e invisible: gana la primera rama cuya condición se
cumpla y, si ninguna se cumple, el fallback. El jugador no ve nada. `else if <condition> -> <label>` es una rama condicional,
no el fallback; un `else` a secas es el fallback.

Tanto `choice` como `if` aceptan una condición opcional y un bloque de efectos opcional, en ese orden, antes
de la flecha. Consulta [Condiciones y efectos](#condiciones-y-efectos).

> **Nota**
> No hay un bloque `menu:`. Escribe una línea `choice "text" -> label` por opción dentro de un nodo
> `(choice)`.

## Subgrafos y retorno

Un nodo `(subgraph)` anida un `StoryGraph` formado por labels hijos llamados `padre/hijo`. Su cuerpo enruta
los resultados anidados de vuelta al grafo exterior.

```text
label combat (subgraph):
    outcome win -> after_win
    default -> after_combat

label combat/fight:              # un nodo hijo (el prefijo es el label padre)
    "..."
    jump combat/done

label combat/done (return "win"):  # un ReturnNode; efectos vía set / toggle
    toggle won_fight
```

`outcome <key> -> <label>` enruta una clave de resultado; `default -> <label>` recoge el resto. Un nodo
`(return "<key>")` termina el grafo anidado y devuelve esa clave. Sus líneas `set` y `toggle` son los
efectos del nodo de retorno.

Los subgrafos anidan un solo nivel: un label hijo no puede ser a su vez un subgrafo.

## Condiciones y efectos

**Una condición** es una lista de cláusulas `token op value` combinadas con `and` u `or`. Un token a secas
(`if flag`) es una forma abreviada de `flag == true`. `and` liga más fuerte que `or`, así que `a and b or c`
se lee como `(a and b) or c`. Una condición vacía siempre es verdadera.

| Operador | Significado |
|---|---|
| `==` | Igual. |
| `!=` | Distinto. |
| `>` | Mayor que. |
| `<` | Menor que. |
| `>=` | Mayor o igual que. |
| `<=` | Menor o igual que. |
| `contains` | El valor contiene el texto dado. |

```text
if gold >= 10 -> smith
if gold >= 10 and has_map -> smith
if time.daypart == Morning or maya.location == Bakery -> visit
if saw_intro -> chapter2
```

Los tokens son claves de variable, variables de personaje (`maya.location`), y las claves reservadas de
tiempo y misión. Consulta [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) para la lista completa.

**Un bloque de efectos** es una lista `{ … }` de mutaciones, separadas por comas, escrita después de la
condición y antes de la flecha. Cada entrada es `key = value`, `key += n`, `key -= n`, o `toggle key`.

```text
choice "Buy a sword" if gold >= 10 { gold -= 10, has_sword = true } -> smith
if gold > 100 { rich = true, toggle celebrated } -> rich_end
```

## Notas

- **Los comentarios** empiezan con `#`. Un `#` dentro de una cadena entrecomillada es texto, no un
  comentario. Las líneas en blanco se ignoran.
- **La indentación** bajo un `label` es de 4 espacios. La tecla `Tab` de la pestaña Text inserta 4 espacios.
- **Las cadenas** van entre comillas dobles, con los escapes `\"`, `\\`, `\n`, `\r` y `\t`.
- **Los números** usan `.` como separador decimal, sea cual sea la configuración regional de tu sistema.
- **Los nombres de asset** se resuelven a objetos por GUID, así que mover o renombrar un asset no rompe un
  nodo sincronizado. Ejecuta **Format** para actualizar el nombre escrito en el texto. Un nombre que no se
  resuelve —una errata, o un nombre que comparten varios assets— es un error: la importación se rechaza y el
  grafo queda intacto, así que una errata nunca puede destruir una referencia. Desambigua con una
  subcarpeta: `backdrop interiors/bedroom`.
- **Las carpetas listadas en [Configuración de VN](/es/docs/beasty-visual-novel/production/vn-settings/)** mantienen los nombres
  cortos y sin ambigüedad. No son una restricción excluyente: un asset que viva fuera de ellas se sigue
  resolviendo por nombre, en todo el proyecto, como último recurso.
- **Un bloque sin ningún asset asignado** —un fondo sin arte, una pista de música, sonido o voz sin clip— no
  hace nada en el juego: se salta, dejando lo que ya haya en pantalla o sonando. Tampoco se escribe en el
  guion, así que guardar el guion también elimina ese marcador de posición del grafo. Para dejar el fondo en
  negro o silenciar un canal a propósito, usa `backdrop clear` o `stop <channel>`.
- **Autocompletado.** La pestaña Text sugiere, al inicio de una línea: `backdrop`, `show`, `expression`,
  `hide`, `clear characters`, `jump`, `set`, `toggle`, `dict`, `give`, `take`, `use`, `item`, `deliver`,
  `wait`, `music`, `sound`, `ambient`, `voice`, `stop`, `name`, `ask`, `quest`, `screen`, `routine`,
  `time`, `choice`, `if`, `else`, `default`, `freeroam`, `goto-scene` —además de tus ids de personaje, ya
  que una línea puede empezar con un speaker. Después de la palabra clave sugiere lo que esa palabra clave
  espera: personajes, expresiones, variables, tokens de diccionario, ítems, misiones y sus objetivos,
  pantallas, perfiles de rutina, nombres de momento del día y día de la semana, nombres de asset, y los
  labels ya presentes en el archivo.

## Ver también

- [El guion de texto](/es/docs/beasty-visual-novel/authoring/text-script/) — el editor, las reglas de sincronización, el contrato de seguridad y los límites.
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — el mismo vocabulario, como bloques en el grafo.
- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) — los tipos de nodo a los que compila un guion.
- [Personajes](/es/docs/beasty-visual-novel/world/characters/) — ids, expresiones, delivery styles y alias.
- [Misiones](/es/docs/beasty-visual-novel/world/quests/) — ids de misión, etapas y objetivos.
- [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/) — momentos del día, el reloj, y los dos modos de tiempo.
- [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/) — los mapas y salas que `freeroam` señala como destino.
