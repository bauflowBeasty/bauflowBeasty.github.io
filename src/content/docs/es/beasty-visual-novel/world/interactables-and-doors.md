---
title: "Interactuables y puertas"
description: "Todo lo que el jugador puede clicar dentro de una sala: objetos, puertas y los personajes que hay en ella. Esta página es para guionistas y diseñadores."
---

Todo lo que el jugador puede clicar dentro de una sala: objetos, puertas y los personajes que hay en ella. Esta página es
para guionistas y diseñadores.

Cada cosa clicable en una sala es el mismo tipo de registro — un **botón** — con un trabajo distinto. Los autoras
entrando en una sala en la pestaña **FreeRoam** (`Tools > Beasty VN > Editor`) y seleccionando el objeto.

Recuerda la división: **el prefab de la sala define el arte y la posición; el grafo del mapa define qué hace la cosa.**
Están vinculados por el nombre.

## Tipo y función

Un botón tiene un **tipo** (kind) y una **función** (su acción).

| Tipo | Qué significa |
|---|---|
| `Navigation` | Una puerta. Al clicarla, el jugador se mueve a otra sala. |
| `Interaction` | Un objeto. Al clicarlo, actúa en el sitio; el jugador no se mueve. |

| Función | Qué hace al clicarlo |
|---|---|
| **Door (go to room)** | Ir a la sala de destino. |
| **Enter VN** | Reproducir una escena de novela visual y luego volver a esta sala. |
| **Custom** | Levantar un id de evento personalizado para que tu propio código lo gestione. |
| **Talk menu** | Abrir el [menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/) de un personaje. Solo se ofrece en un objeto que tiene un personaje propietario. |

Para **Enter VN** eliges la escena y, opcionalmente, un **nodo de inicio** dentro de ella (vacío significa el nodo de
entrada de la escena). Cuando la escena termina, el jugador vuelve a la sala desde la que hizo clic.

Para **Custom** escribes un id de evento. Por defecto no ocurre nada; un script tuyo escucha ese evento. Este es el
enganche para un minijuego, una tienda, un puzle — cualquier cosa que no sea una conversación.

## Arte y colocación

| Campo | Qué es |
|---|---|
| **Sprite** | El arte clicable. |
| **Position** | Dónde se sitúa en la sala, en unidades de mundo. |
| **Scale** | Su tamaño. |
| **Sorting Order** | Orden de dibujado dentro de la sala. Más alto queda delante. |

Cuando la sala tiene un prefab, estos campos se reflejan en el objeto hijo correspondiente del prefab, así que también
puedes simplemente arrastrar el objeto dentro del prefab y el registro de la sala lo sigue.

El área de clic se construye a partir del sprite. Por defecto es la forma del sprite — pero consulta
[Áreas de clic ajustadas](#áreas-de-clic-ajustadas) si tu arte es mayormente transparente.

## Efecto al pasar el cursor

Elige un **Mode**:

| Modo | Qué ve el jugador |
|---|---|
| **Tint** | El sprite en reposo se tiñe. Este es el valor por defecto. |
| **Swap** | El sprite se intercambia por un **sprite de hover**. |
| **None** | Sin cambio de color ni de sprite. |
| **Animation** | Un **clip de reposo** y un **clip de hover**, con el Animator generado por ti. |

Además **Zoom on hover**, un interruptor independiente que se aplica a Tint, Swap y None. (Animation controla su propia
escala, así que ahí no se ofrece el zoom.)

Cosas a tener en cuenta:

- **Swap sin sprite de hover recae en Tint.** Un objeto siempre tiene algún tipo de respuesta visual; nunca se queda inerte.
- **Tint** usa el color de resaltado global de [VN Settings](/es/docs/beasty-visual-novel/production/vn-settings/) a menos que marques
  **Custom tint** y elijas el tuyo propio.
- **Animation necesita un prefab de sala** — los clips viven en el objeto del prefab. Asigna un clip de reposo y/o uno de
  hover y el AnimatorController se genera y se conecta automáticamente. Elegir de nuevo un sprite o un modo de tinte
  borra los clips, de modo que el camino del sprite realmente se ejecuta.

## Visibilidad

Todo objeto tiene una condición **Visible when**. Cuando falla, el objeto no se dibuja ni es clicable — sencillamente
no existe para el jugador. Una condición vacía significa siempre visible.

Así es como una sala cambia a lo largo del juego sin duplicarse: la ventana rota solo aparece después de la
tormenta, la nota sobre la mesa solo mientras la misión está activa, el puesto del tendero solo en día de mercado.

## Puertas

Una puerta es un botón de tipo `Navigation`. Además de los campos compartidos, tiene:

| Campo | Qué es |
|---|---|
| **Goes to room** | La sala de destino. |
| **Passage id** | Opcional. Las dos puertas de un mismo pasaje — la puerta de la sala A y la puerta de la sala B — comparten este id. Déjalo vacío para una puerta solitaria sin retorno vinculado. |
| **Accessible** | Si la puerta realmente se abre. |
| **Blocked Dialogue** | La escena que se reproduce cuando se clica una puerta cerrada. |
| **Access exceptions** | Anulaciones condicionales de **Accessible**. Gana la primera coincidencia. |

Crea puertas desde el detalle de la sala (**+ Door** en un carril), o arrastrando de una sala a otra en la
vista de mapa. Hay como máximo una puerta por dirección entre dos salas.

### Acceso: cerrar una puerta, y explicar por qué

Desactiva **Accessible** y la puerta se sigue dibujando y sigue siendo clicable; simplemente no mueve al jugador.
En su lugar reproduce su **Blocked Dialogue** (con un nodo de inicio opcional) y vuelve a la sala. Esa es la
puerta que dice "Está cerrada con llave. Necesitaría la llave." en lugar de la puerta que se niega en silencio.

> **Nota**
> Una puerta cerrada sin diálogo de bloqueo se muestra y es clicable pero no hace absolutamente nada. Si la puerta debería
> ser invisible en su lugar, usa su condición **Visible when** en vez del indicador de acceso.

**Access exceptions** es una lista ordenada de casos condicionales. Cada uno tiene una condición, un indicador de accesible, y
opcionalmente su propio diálogo de bloqueo. **Gana el primer caso cuya condición se cumpla; si ninguno se cumple, se usa el
indicador por defecto de arriba.** Un caso sin diálogo de bloqueo propio recae en el diálogo por defecto de la puerta, así que
puedes cerrar una puerta condicionalmente sin repetir la escena de "está cerrada".

Cerrada de noche, abierta de día:

```text
Accessible          = on
Access exception 1  : if  time.daypart == Night   -> Accessible = off,  Blocked Dialogue = "Shop_Closed"
```

O al revés — una puerta que solo abre la llave:

```text
Accessible          = off        Blocked Dialogue = "Door_Locked"
Access exception 1  : if  item.rusty_key >= 1     -> Accessible = on
```

## VN condicional: el mismo objeto, una escena distinta

Un objeto **Enter VN** tiene una escena por defecto, más una lista ordenada de casos de **VN condicional**. Al clicar,
**se reproduce el primer caso cuya condición se cumpla; si ninguno lo hace, se reproduce la escena por defecto.**

La cama es el ejemplo que todo el mundo necesita:

```text
Case 1  : if  time.daypart == Night     -> "Sleep"
Default :                                  "Not bedtime yet"
```

El objeto sigue siendo un solo objeto. Su significado cambia con el mundo.

## Poses de personaje

Dale a un objeto un **personaje propietario** y deja de ser un objeto: *es* ese personaje, de pie ahí. Autóralos desde
el detalle de la sala con **+ Character** (elige quién) y luego **+ Pose** para cada aspecto.

- Un personaje puede tener **varias poses en una misma sala** — sentado en el mostrador, apoyado en el marco de la puerta,
  brazos cruzados. Cada pose es un objeto separado con su propio sprite, posición y condición **Show pose when**.
- **Solo se muestra la primera pose visible por propietario.** La lista es un orden de prioridad: se dibuja la primera pose cuya
  condición se cumpla y el resto se omite. El personaje nunca se dibuja dos veces.
- El editor inyecta la presencia del personaje en la visibilidad de la pose, así que una pose solo aparece mientras
  la rutina del personaje realmente la ponga en esta sala. No tienes que escribir a mano "y Maya está aquí".
- **Una pose visible reemplaza al marcador genérico de la rutina.** Sin una pose, el personaje se dibuja en un punto de personaje
  usando su sprite de mundo libre; con una, gana tu arte.

Clicar en un personaje — pose o marcador genérico — ejecuta la escena de interacción de su rutina, o su
[menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/) cuando tiene uno. Consulta [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).

## Avanzar el tiempo al clicar

Un objeto de sala puede mover el reloj del juego por sí mismo. Dos campos en el registro del objeto:

| Campo | Qué hace |
|---|---|
| **Advance time on click** | Actívalo para aplicar un cambio de tiempo cuando se clica el objeto. |
| **Time effect** | Las mismas operaciones que el bloque **Advance time**: avanzar franjas horarias, horas o días; fijar la franja horaria, la hora o el día de la semana. |

Este es el atajo para una **cama** o un **reloj** — un objeto cuyo único trabajo es mover el tiempo.

> **Nota**
> Estos dos campos viven en el registro del objeto dentro del asset FreeRoam Map Graph. El editor de detalle de la sala
> no los muestra: selecciona el grafo del mapa en la ventana Project y edita el objeto bajo
> **Rooms > Buttons > Advance Time On Click** y **Time Effect**.

**Cuando la interacción también necesita diálogo, no uses esto.** Haz que el objeto use **Enter VN** en su lugar, y pon un
bloque [Advance time](/es/docs/beasty-visual-novel/world/game-time/) dentro de esa escena:

```text
[Dialogue]      "You lie down and pull the blanket over your head."
[Advance time]  op = SetDaypart, daypart = Morning
[Dialogue]      "Sunlight. Already."
```

Obtienes la línea, el sonido, el fundido — y el cambio de tiempo — en el orden en que los escribiste, y todo se rebobina
correctamente.

## Áreas de clic ajustadas

El área de clic de un objeto proviene de su sprite. Para un arte cuyo cuadro delimitador es mucho más grande que la cosa que
realmente quieres que sea clicable — una fina cadena de lámpara, una espada tumbada en diagonal, un recorte de personaje con
muchas esquinas vacías — la caja atrapa clics que estaban destinados a la sala detrás de ella.

Selecciona los sprites y ejecuta:

```text
Tools > Beasty VN > Content > Generate Tight Click Shapes (Selection)
```

Esto construye un área de clic que sigue los **píxeles opacos** del sprite en lugar de su cuadro delimitador.

> **Advertencia**
> Esto importa sobre todo para superposiciones con un borde suave y mayormente transparente — una capa de niebla, una viñeta,
> un brillo tenue. Dejado con la forma de un cuadro delimitador, ese sprite se traga en silencio todos los clics de la sala.
> Si una sala deja de responder a los clics después de añadir una superposición, esta es la razón.

## Ver también

- [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/) — el mapa, las salas, los prefabs de sala, los fondos condicionales.
- [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/) — lo que abre clicar en un personaje.
- [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/) — quién está de pie en la sala.
- [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/) — las operaciones de Advance time en detalle.
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — cómo se construyen las condiciones.
