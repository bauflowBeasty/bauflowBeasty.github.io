---
title: "Conceptos fundamentales"
description: "El modelo mental detrás de todo el paquete. Seis ideas. Cuando las tienes claras, las demás páginas de esta documentación son solo detalle, y el editor deja de sorprenderte."
---

El modelo mental detrás de todo el paquete. Seis ideas. Cuando las tienes claras, las demás páginas de esta
documentación son solo detalle, y el editor deja de sorprenderte.

Lee esto después de [Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/), cuando ya hayas visto moverse las piezas.

## DialogueScene - una historia

Una **DialogueScene** es el asset raíz de una historia. El Capítulo 1 es una DialogueScene. También lo es
una única conversación a la que saltas desde una sala y de la que vuelves directo.

No contiene casi nada por sí misma. Apunta a dos cosas: el **VNContext** (el mundo en el que ocurre esta
historia) y un **StoryGraph** raíz (la historia en sí). También puede llevar un archivo de script
`.vnbeasty`, que es la misma historia escrita como texto.

Crea una con `Create > Beasty VN > Visual Novel (Dialogue Scene)`, o deja que
`Tools > Beasty VN > Setup > Blank Canvas` construya una con todo lo que necesita ya cableado.

Un juego normalmente tiene varias DialogueScenes. Todas comparten un mundo.

## VNContext - el único mundo compartido

Un **VNContext** es todo lo que es verdad sobre tu juego en lugar de sobre una escena:

- el **reparto** — cada personaje
- las **variables** que definiste, y el **esquema de personaje** (los campos que tiene cada personaje)
- el **diccionario** — tokens de texto que el jugador puede editar
- la tabla de **localización** y la lista de idiomas
- los **ítems** y el **catálogo de misiones**
- las **pantallas** y la configuración de música

**Hay un único contexto global.** No uno por escena, no uno por capítulo — uno. Cada DialogueScene de tu
juego apunta al mismo VNContext, por eso una variable que fijas en el capítulo 1 sigue ahí en el capítulo 7,
y por eso el personaje que definiste una vez es el mismo personaje en todas partes.

El editor lo trata como un singleton: `Create Base Assets` reutiliza el contexto que ya existe y nunca crea
un segundo. Si te encuentras con dos, eso es un bug en tu proyecto, no una característica. Consulta
[Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/).

## StoryGraph - un lienzo de nodos

Un **StoryGraph** es un lienzo con nodos encima y aristas entre ellos. Un nodo es el **nodo de entrada** —
ahí es donde empieza la reproducción.

Un **subgrafo** es un StoryGraph anidado dentro de otro. Lo llamas desde un nodo SubGraph, se ejecuta,
vuelve con un resultado, y el nodo que lo llamó enruta según ese resultado. Úsalo cuando un trozo de
historia es autocontenido: una pelea, un flashback, el diálogo de un minijuego. Consulta [Subgrafos](/es/docs/beasty-visual-novel/authoring/subgraphs/).

## Node - un beat

Un **nodo** es un beat de la historia. Hay **siete tipos**, y esa es la lista completa.

| Nodo | Su trabajo |
|---|---|
| **Dialogue Node** | Ejecuta sus bloques en orden, y luego va a su nodo siguiente predeterminado. Es el caballo de batalla: la mayor parte de tu grafo estará hecha de estos. |
| **Choice Node** | Muestra al jugador las opciones cuya condición se cumple, y va a donde apunte la elegida. |
| **Decision Node** | Enruta de forma automática e invisible. Gana la primera rama cuya condición se cumple. El jugador no ve nada. |
| **Flow (Mode Switch) Node** | Entrega el control fuera de la novela visual — a una sala, a otra escena. No tiene sucesor. |
| **SubGraph Node** | Llama a un grafo anidado y enruta según el resultado que devuelve. |
| **Return Node** | Termina un subgrafo, devolviendo una clave de resultado. |
| **Talk Menu Node** | Muestra el menú de conversación de un personaje. |

Haz clic derecho en el lienzo del grafo para crear cualquiera de ellos. Consulta [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/).

## Block - una instrucción

Un **bloque** es una instrucción dentro de un nodo. Un nodo contiene una pila de ellos, y se ejecutan **de
arriba a abajo**.

Los bloques son todo el vocabulario de creación. No hay ningún lenguaje de scripting por debajo — un bloque
es lo más pequeño que la historia puede hacer:

| Categoría | Qué vive ahí |
|---|---|
| **Dialogue** | El bloque Dialogue. Una línea hablada o narrada. El único bloque con texto libre dentro. |
| **Scene** | Backdrop, Show character, Expression, Hide character, Props. |
| **Clear** | Characters, Backdrop, Props. |
| **State** | Set variable, Set dictionary, Character variable, Character name. |
| **Quests** | Update quest, Deliver items. |
| **World** | Wait, Advance time, Open screen, Routine override. |
| **Items** | Give, Take, Set quantity, Use. |
| **Audio** | Music, Ambient, Voice, Sound effect, Stop channel. |
| **Input** | Ask, hacia una variable, hacia un token de diccionario, o hacia el nombre de un personaje. |
| **Flow** | Go to FreeRoam, Return to room, Choose room, Go to VN scene. |

Hay tres cosas de los bloques que conviene interiorizar desde el principio.

**Un bloque Dialogue se detiene.** Muestra su línea y espera al jugador. Todo lo demás se ejecuta seguido.
Por eso dos bloques Dialogue son dos líneas, y por eso un bloque Backdrop seguido de un bloque Dialogue es
un momento, no dos.

**Un bloque sin asset asignado no hace nada.** Un bloque Backdrop vacío o un bloque Music sin clip se
omite — lo que esté en pantalla se queda en pantalla, lo que esté sonando sigue sonando. Para borrar el
backdrop o silenciar un canal **a propósito**, usa el bloque Clear Backdrop o el bloque Stop channel. Es un
diseño deliberado: significa que puedes dejar un bloque a medio completar sin romper la escena, pero
también significa que un bloque vacío nunca es un error y nunca te avisa.

**Algunos bloques describen la escena, otros cambian el mundo.** Los bloques de escena (backdrop,
personajes, props) son declarativos: dicen cómo se ve el stage, y simplemente se reconstruyen cuando el
jugador rebobina. Los bloques que cambian el mundo (fijar una variable, dar un ítem, avanzar el tiempo) se
disparan una vez, y rebobinar los restaura desde una instantánea. No tienes que pensar en esto — pero por
eso el rebobinado es exacto y no aproximado.

Lista completa con cada campo: [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/).

## El almacén de variables - el que importa

Esta es la decisión de diseño sobre la que descansa todo el paquete. Todo lo demás se deriva de ella.

**Hay un único almacén plano de clave/valor, y todo vive en él.**

No "las variables viven aquí y las misiones viven allá". Un solo almacén:

| Qué | La clave bajo la que vive |
|---|---|
| Tus variables | `gold`, `saw_intro` — sin prefijo |
| Variables de personaje | `@char:juan:affection` |
| Tiempo de juego | `@time:daypart`, `@time:hour`, `@time:day`, `@time:weekday`, `@time:season` |
| Misiones | `@quest:ana_m1:@state`, `@quest:ana_m1:@stage` |
| Inventario | `item.potion` |
| Diccionario | la propia clave del token |

El editor las muestra con etiquetas amigables — eliges `time.daypart` de un desplegable, no `@time:daypart`
de memoria. Pero por debajo, todas son el mismo tipo de cosa, y ahí está la clave.

**Por qué importa.** Tres consecuencias, y cada una es una característica que de otro modo tendrías que
construir tú:

1. **El tiempo y las rutinas se pueden usar en cualquier condición.** Una elección puede requerir
   `time.daypart == Evening`. Una puerta puede estar bloqueada a menos que `maya.location == Bakery`. Una
   misión puede empezar cuando `gold >= 100`. No hay trabajo de integración entre el sistema de tiempo y el
   sistema de condiciones, porque el sistema de tiempo no tiene su propio almacenamiento — escribe en el
   mismo almacén que lee el sistema de condiciones.

2. **Todo se guarda automáticamente.** Un guardado captura el almacén. Eso es una sola operación, y
   recoge tus variables, el reloj, el estado de cada misión, el inventario y el diccionario, porque nunca
   fueron cosas separadas. Agrega una misión nueva a tu juego y se guarda correctamente sin que hagas nada.
   Consulta [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/).

3. **El rebobinado funciona.** Retroceder una línea significa restaurar el almacén a lo que era. De nuevo:
   una sola operación, todo el mundo, sin lógica de deshacer por sistema que alguien olvidó escribir para
   el sistema que agregaste la semana pasada.

Si te llevas una idea de esta página, que sea esta. Cuando te preguntes "¿puedo usar X en una condición?", la
respuesta es casi siempre sí, y esta es la razón.

Detalle completo: [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/), y
[Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/) para cada namespace reservado.

## BeastyManager - el único objeto

**BeastyManager** es el único GameObject que arrastras a una escena de Unity. Posee cada manager — el
director de la historia, el stage, el audio, la entrada, el sistema de guardado, el controlador de mundo
libre — como subcomponentes ocultos. No tienes que agregarlos, cablearlos ni pensar en ellos.

Por eso la escena del asistente de configuración tiene cinco objetos en lugar de treinta, y por eso
"auto-wire" es un botón que funciona en lugar de una promesa. Consulta [Controladores](/es/docs/beasty-visual-novel/scripting/controllers/) si quieres
acceder a él desde código.

## Cómo fluye un frame del juego

Juntando todo lo anterior, esto es lo que pasa mientras el jugador juega:

1. La reproducción está **en un nodo**. El grafo le entregó el nodo de entrada cuando empezó la historia, o
   el nodo anterior le entregó este.
2. El nodo **ejecuta sus bloques, de arriba a abajo**. Fija el backdrop. Muestra a Juan. Le da una poción
   al jugador. Avanza el reloj dos momentos del día. Cada bloque que cambia el mundo escribe en el
   **almacén de variables**.
3. Un **bloque Dialogue se detiene**. La línea aparece en pantalla. El motor espera.
4. **El jugador avanza** — espacio, clic, o auto-avance. La reproducción continúa en el siguiente bloque.
5. Cuando se acaban los bloques, el nodo **entrega el control al siguiente nodo**: su siguiente
   predeterminado, o la opción que eligió el jugador, o la rama cuya condición se cumplió, o el resultado
   que devolvió un subgrafo.
6. De vuelta al paso 2, en el nodo nuevo.

El rebobinado es ese bucle ejecutado al revés: restaura el almacén, reconstruye el stage a partir de los
bloques de escena, y muestra la línea anterior.

## Ver también

- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/) — el lienzo y los siete tipos de nodo
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — cada bloque, por categoría
- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/)
- [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/)
- [Resumen de scripting](/es/docs/beasty-visual-novel/scripting/overview/) — el mismo modelo, desde código
