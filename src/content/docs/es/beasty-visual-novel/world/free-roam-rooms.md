---
title: "Salas de mundo libre"
description: "El mundo entre conversaciones: un mapa de salas por las que el jugador puede caminar, hacer clic en los objetos y salir hacia una escena. Esta página es para guionistas y diseñadores."
---

El mundo entre conversaciones: un mapa de salas por las que el jugador puede caminar, hacer clic en los objetos y salir hacia una
escena. Esta página es para guionistas y diseñadores.

El modo de mundo libre es opcional. Una novela kinética pura nunca lo usa. Pero en el momento en que quieres que el jugador elija
adónde ir y con quién hablar, este es el modo en el que entras.

## El grafo del mapa

Todo vive en un solo asset, el **FreeRoam Map Graph**
(`Create > Beasty VN > FreeRoam > FreeRoam Map Graph`). Contiene:

- las **salas**,
- la **sala de entrada** — donde aterriza el jugador cuando empieza el mundo libre,
- las **rutinas** — consulta [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).

Lo editas en la pestaña **FreeRoam** de la ventana Beasty VN (`Tools > Beasty VN > Editor`), o seleccionando
el asset y haciendo clic en **Open in Beasty VN (FreeRoam tab)**.

> **Nota**
> **La vista de mapa es un diagrama, no un editor del contenido de la sala.** Muestra las salas como cajas y las puertas entre
> ellas como líneas. Puedes crear una sala, definir la sala de entrada, eliminar una sala. Todo lo demás — el nombre, el
> fondo, los objetos, las puertas — lo autoras **entrando en la sala**: haz doble clic en ella. Las líneas
> entre salas son de solo lectura; representan las puertas que existen dentro de las salas.

## Qué es una sala

| Campo | Qué es |
|---|---|
| **Id** | El id estable. Las puertas y rutinas se refieren a la sala por él. |
| **Display Name** | Cómo la llamas. Se mantiene idéntico al nombre de archivo del prefab de la sala. |
| **Background (default)** | El sprite que se muestra cuando no se aplica ningún fondo condicional. |
| **Conditional backgrounds** | Una lista ordenada de casos condición-más-sprite. Ver más abajo. |
| **Room Prefab (visual)** | El prefab que posee el arte y las posiciones. |
| **Buttons** | Los objetos y puertas de la sala. Consulta [Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/). |

La división que hay que tener presente: **el prefab define cómo se ven las cosas y dónde están; el grafo del mapa define qué
hacen.** Colocas una lámpara en el prefab con las propias herramientas de Unity, y dices "al hacer clic en la lámpara se
reproduce esta escena" en el editor de la sala. Ambos están vinculados por el nombre.

## Crear una sala y su prefab juntos

1. En la pestaña **FreeRoam**, modo **Map**, haz clic derecho en el lienzo vacío y elige **Create Room**.
2. Beasty pregunta de inmediato dónde guardar el **prefab** de la sala, y lo crea: una raíz `FreeRoamRoom` con un
   hijo `Background` listo para llevar el sprite de la sala.
3. El nombre de archivo que elijas se convierte en el **Display Name** de la sala. A partir de entonces los dos nombres se
   mantienen sincronizados: renombra la sala y el archivo del prefab la sigue; renombra el archivo del prefab y la sala lo sigue.

Si cancelas el diálogo de guardado, la sala se crea sin prefab; puedes asignar uno más tarde en la configuración de la sala.
Una sala sin prefab todavía puede visitarse, pero no puede tener puntos de personaje.

La primera sala que crees se convierte automáticamente en la **sala de entrada**. Para cambiarla, selecciona una sala en el mapa y
marca **Entry Room** (o haz clic derecho en ella y elige **Set as Entry Room**).

El botón **Fix backgrounds** de la barra de herramientas actualiza retroactivamente todos los prefabs de sala del grafo: se asegura de que
cada uno tenga un componente `FreeRoamRoom` y un hijo `Background` que lleve el sprite de la sala. Úsalo en prefabs que hayas
construido a mano.

## Fondos condicionales

Una sala no tiene por qué tener un solo aspecto. Dale una **lista ordenada de casos**: cada caso es una condición y un sprite.
**Gana el primer caso cuya condición se cumpla; si ninguna se cumple, se usa el fondo por defecto.** Así una sala puede
cambiar según la hora del día, la estación, si está lloviendo, si hay un personaje en ella, o cualquier
variable de tu juego.

Como una condición vacía siempre se cumple, un caso sin condición absorbe todo lo que está debajo de él. Ordena la
lista del caso más específico al más general.

El editor de detalle presenta esto como **Background by time & presence**, agrupado en una sección **Any time**
más una sección por franja horaria, de modo que el caso habitual se lee tal como lo piensas:

- **Background** — el sprite de este caso.
- **Characters present** — una lista de casillas; el caso solo se aplica mientras esos personajes estén en la sala.
- **Weekdays (any = all)** — una lista de casillas; déjala vacía para todos los días.
- **Advanced condition** — la condición en bruto, para todo lo que las listas de casillas no puedan expresar.

Hacer clic en el encabezado de una franja horaria en la línea de tiempo de la sala centra el editor solo en esa franja horaria, que es la
forma rápida de crear "la cocina de noche".

Por debajo, estos son los mismos casos ordenados de condición-más-sprite; las secciones son una comodidad, no un
modelo distinto.

## El prefab de la sala

El prefab es un prefab de Unity normal. Ábrelo y construye la sala igual que construirías cualquier escena 2D.

| Componente | Qué marca |
|---|---|
| `FreeRoamRoom` | La raíz del prefab. Reúne el renderer del fondo, los interactuables y los puntos. |
| `FreeRoamInteractable` | Un objeto clicable. Su **id es el nombre del GameObject**, que es como el grafo del mapa encuentra su lógica. |
| `FreeRoamCharacterSpot` | Un lugar donde se para un personaje. |

Como los ids son nombres, renombrar un GameObject en el prefab renombra el objeto al que está vinculada la lógica de la sala.
Renombra los objetos desde el editor de la sala, no desde la Hierarchy, y ambos se mantienen sincronizados.

### Puntos de personaje

Un **punto** es un objeto hijo con un componente `FreeRoamCharacterSpot`. Marca dónde se para alguien.

1. Abre el prefab de la sala.
2. Crea un GameObject hijo y colócalo — posición y escala — donde debería estar el personaje.
3. Añade el componente `FreeRoamCharacterSpot`.
4. El id del punto es el nombre del GameObject. Define **Id Override** si quieres un id que sobreviva a un renombrado.

**La posición y la escala del punto son decisiones del prefab, no datos de la rutina.** La rutina dice en qué sala está
un personaje; el prefab dice en qué parte de la sala se para. Esa separación es lo que te permite rediseñar
una sala sin tocar un solo horario.

Cuando varios personajes están en una misma sala, cada uno ocupa **el siguiente punto libre**: nunca se superponen. Si a la
sala se le acaban los puntos, el siguiente personaje se dibuja en el centro de la sala — así que dale a una sala al menos tantos
puntos como pueda llegar a albergar a la vez. Consulta [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).

## Entrar en una sala desde la historia, y volver a salir

La historia y el mapa son dos modos de la aplicación; pasas de uno a otro con **bloques de flujo** (categoría de paleta
**Flow**), que también se ofrecen como destino en cualquier elección.

| Bloque | Qué hace |
|---|---|
| **Go to FreeRoam** | Sale de la novela y deja al jugador en una sala que tú indicas. |
| **Return to room** | Vuelve a la sala de la que venía el jugador. |
| **Choose room** | Deja que el jugador elija una sala de una lista. |

Un bloque **Go to FreeRoam** toma un escenario opcional (el grafo del mapa) y un id de sala; deja la sala vacía para
aterrizar en la sala de entrada del mapa. En el guion de texto es una sola línea:

```text
freeroam town/square
freeroam previous
freeroam choose town
```

Volver en el otro sentido, de una sala a una escena, es lo que hace la acción **Enter VN** de un objeto — y cuando
esa escena termina, el jugador vuelve a la sala que dejó. Una escena a la que se entra desde una sala es una visita, no una
puerta sin retorno.

> **Nota**
> Una escena a la que se entra desde una sala mantiene detrás el fondo de la sala, a menos que la escena establezca su propio
> fondo. Esto es deliberado: un breve intercambio con un tendero debe parecer que ocurre en la tienda.

Los bloques de flujo y los nodos de flujo se explican en detalle en [Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/).

## Música por sala

El `FreeRoamRoom` del prefab de una sala puede llevar una anulación de música, de modo que una sala puede tener su propia
pista sin ningún scripting. El resto del modelo de música — la cola por modo de aplicación — está en
[Audio y música](/es/docs/beasty-visual-novel/production/audio-and-music/).

## Ver también

- [Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/) — todo lo que puedes clicar en una sala.
- [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/) — quién está en la sala, y cuándo.
- [Transiciones](/es/docs/beasty-visual-novel/authoring/transitions/) — salir de la novela y volver.
- [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/) — las variables que un fondo condicional suele leer.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — cómo se construyen las condiciones.
