---
title: "El menú de conversación"
description: "El centro de conversación de cada personaje: el menú de \"qué puedo decirle a esta persona ahora mismo\". Clica un personaje en una sala y esto es lo que se abre. Esta página es pa"
---

El centro de conversación de cada personaje: el menú de "qué puedo decirle a esta persona ahora mismo". Clica un personaje en una
sala y esto es lo que se abre. Esta página es para guionistas y diseñadores.

Si has jugado a un dating sim de Ren'Py, conoces la forma: te acercas a alguien y obtienes una lista corta de
cosas que podrías comentar — el encargo que te pidió, el rumor que acabas de oír, "cómo te fue el día", "adiós".
La lista es distinta cada vez, porque el mundo se ha movido.

## La idea clave

**Los pasos de conversación de una misión se insertan en el menú automáticamente, antes de tus entradas manuales.**

Nunca mantienes el menú. No escribes "si la misión de la manzana está activa y el jugador tiene cinco
manzanas, muestra una opción de Deliver". Le das al objetivo un paso de conversación que apunta a Ana, y la entrada aparece en
el menú de Ana exactamente cuando debe — y desaparece en el momento en que se completa.

Lo que eso significa en la práctica:

- El menú siempre enumera **exactamente de qué puede hablar este personaje ahora mismo**.
- Añadir una misión a un personaje añade una línea a su menú. Quitarla quita la línea.
- Un personaje con diez misiones a lo largo del juego sigue teniendo un menú pequeño en cualquier momento, porque solo se
  ofrece el paso **actual** de cada misión **activa**.

Las entradas manuales de abajo son para lo que el personaje puede hablar *siempre*: la charla trivial, la tienda, el
adiós.

## Dónde lo autoras

`Tools > Beasty VN > Editor`, pestaña **Characters**, subpestaña **Talk Menu**. Elige un personaje arriba.

La pestaña te muestra dos cosas:

1. **Mission steps (automatic)** — una vista previa de solo lectura de los pasos de misión que aparecerán en el menú de
   este personaje. Si está vacía, ningún objetivo de misión tiene un paso de conversación que apunte aquí.
2. **Las entradas propias del personaje** — la lista que mantienes tú. **Create talk menu** siembra una primera entrada (un
   "Adiós" que vuelve a la sala); **+ Entry** añade más.

### El aviso

La **Prompt line (optional)** es lo que dice el personaje mientras el menú está abierto — "¿Qué necesitas?". Déjala
vacía y no se muestra ningún cuadro de diálogo en absoluto: solo las opciones.

También puedes darle al menú una **imagen de personaje** (una pose que se muestra junto a las opciones), con una lista ordenada
de **imágenes condicionales**: gana el primer caso cuya condición se cumpla, si no, la por defecto. Una pose distinta por
franja horaria, por sala, por estado de ánimo.

### Una entrada

| Campo | Qué es |
|---|---|
| **Label** | La línea en la que clica el jugador. Localizada, de la misma tabla que tus textos de elección. |
| **Visible when** | La condición. **Vacío = siempre visible.** Está disponible todo el catálogo: salas, franjas horarias, misiones, objetos, variables de personaje. |
| **Dialogue** | La escena que se ejecuta cuando se elige la entrada. **Vacío = sin diálogo: se aplica el final de inmediato.** |
| **Node** | Qué nodo de esa escena iniciar. |
| **Ends by** | Qué pasa cuando termina la rama. Ver más abajo. |

### Cómo termina una entrada

**Ends by** es lo que pasa cuando la rama elegida se agota — cuando ningún bloque de flujo explícito dentro de ella dice
lo contrario. Un bloque de flujo dentro de la rama siempre gana.

| Final | Qué pasa |
|---|---|
| `ReturnToRoom` | Vuelve a la sala en la que estaba el jugador. La opción normal. |
| `BackToMenu` | Vuelve al menú de conversación, reevaluado. Úsalo para ramas de "¿algo más?". |
| `GoToRoom` | Directo a otra sala. |
| `None` | Nada. La rama decide por sí misma. |

`GoToRoom` también toma un ajuste **Clock** para la llegada: déjalo vacío y el tiempo avanza **una franja horaria**
(el clásico "pasáis la tarde juntos" de los dating sims); fíjalo para mantener el reloj y que nada se mueva; o
nombra una franja horaria para saltar directamente a ella.

Vale la pena entender `BackToMenu`: el menú se **reevalúa** cuando vuelves a él, así que una entrada que acaba de
volverse falsa desaparece, y una que acaba de volverse verdadera está ahí. Entrega las manzanas, vuelve al menú, y
la entrada de la entrega se ha desvanecido.

## Entregar objetos desde una conversación

Un objetivo **GatherDeliver** ([Misiones](/es/docs/beasty-visual-novel/world/quests/)) se completa dando los objetos al propietario de la misión, y
el menú de conversación es donde eso ocurre.

Una entrada para ello aparece en el menú del personaje **automáticamente, pero solo cuando el jugador realmente tiene
los objetos**. Hasta entonces no hay nada que elegir — que es exactamente el comportamiento que quieres, y nada de
eso está autorado.

Cuando el jugador la elige, el **Delivery timing** del objetivo decide cuándo cambia de manos la cesta:

| Timing | Qué pasa |
|---|---|
| `OnPick` | Los objetos se consumen en el instante en que se elige la entrada. El diálogo que sigue ya ve el objetivo como hecho — así que puede empezar con "son perfectas". |
| `OnBranchEnd` | El diálogo se reproduce primero; la entrega se asienta cuando termina la rama. |
| `DialogueBlock` | Nada automático en absoluto. **Tú** pones un bloque **Deliver items** dentro del diálogo, en la línea exacta en la que ella se estira para tomar la cesta. |

El bloque **Deliver items** (categoría de paleta **Quests**) nombra una misión y un objetivo. Verifica el
inventario, consume los objetos, y marca el objetivo como hecho.

> **Advertencia**
> **Deliver items no hace nada, en silencio, si el jugador no tiene los objetos.** No es un error y
> no detiene la escena. Eso es seguro por diseño, pero significa que un bloque mal conectado falla en silencio. Coloca el
> bloque en una rama que el menú de conversación solo ofrezca cuando se tienen los objetos, o protégelo con una condición propia.

En el guion de texto el bloque es una línea:

```text
deliver ana_apples deliver_apples
```

Una entrada de entrega **sin diálogo conectado** sigue funcionando: elegirla entrega los objetos y vuelve al
menú reevaluado, así que el jugador ve desaparecer la entrada.

## Cómo llega el jugador al menú

Dos formas, y usarás ambas.

**Desde una sala** — la habitual. Cualquier objeto de una sala cuyo **personaje propietario** esté definido, con la función
**Talk menu**, abre el menú de ese personaje. Y lo obtienes gratis de todos modos: **clicar a un personaje de pie en
una sala abre su menú de conversación**, siempre que tenga entradas y las escenas de interacción de su rutina no reclamen el
clic primero. Consulta [Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/) y
[Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).

**Desde la historia** — un **nodo Talk Menu** en un grafo de historia. Haz clic derecho en el lienzo, `Create > Talk Menu Node`,
y di el menú de quién mostrar. También toma un **nodo siguiente por defecto**: adónde continúa el flujo cuando el menú
resuelve en ninguna entrada visible en absoluto. Esa es la protección contra callejones sin salida — configúrala.

## El orden de la lista

1. Los pasos automáticos de misión, en orden de catálogo. Para una misión **Ordered**, solo se ofrece el objetivo
   **actual**; para una misión **Free**, cada uno que no esté terminado.
2. Tus entradas manuales, en el orden en que las escribiste, filtradas por sus condiciones.

Un paso de misión solo aparece si su misión está **activa**, su objetivo **no está hecho**, y — para una entrega — el
jugador tiene los objetos. Un paso normal (que no sea de entrega) también necesita su nodo de diálogo conectado; un paso sin diálogo
no es una entrada de menú.

## Un patrón que vale la pena copiar

La lista manual de un personaje rara vez necesita ser larga. Tres entradas sostienen la mayor parte de un juego:

| Label | Visible when | Dialogue | Ends by |
|---|---|---|---|
| `Talk` | *(vacío)* | una escena de charla trivial, normalmente un subgrafo con variaciones | `BackToMenu` |
| `Spend the afternoon together` | `maya.affection >= 3` y `time.daypart == Afternoon` | una escena de cita | `GoToRoom` (el parque) |
| `Goodbye` | *(vacío)* | *(vacío)* | `ReturnToRoom` |

Todo lo demás — cada encargo, cada entrega, cada "encuéntrame en los muelles" — llega por sí solo, desde
las misiones.

## Ver también

- [Misiones](/es/docs/beasty-visual-novel/world/quests/) — pasos de conversación, objetivos GatherDeliver, timing de entrega.
- [Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/) — la acción Talk menu y las poses de personaje.
- [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/) — dónde está de pie el personaje cuando el jugador quiere hablar.
- [Personajes](/es/docs/beasty-visual-novel/world/characters/) — el reparto, y la definición de cada personaje.
- [Localización](/es/docs/beasty-visual-novel/production/localization/) — la tabla de la que provienen las etiquetas y el aviso.
