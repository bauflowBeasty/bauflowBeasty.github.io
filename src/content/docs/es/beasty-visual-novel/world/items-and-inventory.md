---
title: "Objetos e inventario"
description: "Define los objetos que lleva el jugador, entrégalos con bloques y condiciona elecciones y puertas a ellos. Incluye la pantalla de inventario ya hecha."
---

Los objetos son cosas que lleva el jugador. Una llave que abre una puerta, una poción que se bebe, tres flores que le
pidieron recolectar. Esta página cubre cómo definir un objeto, entregarlo, y la pantalla de inventario que el jugador
abre.

## Definir un objeto

Abre `Tools > Beasty VN > Editor`, ve a la pestaña **Items** y pulsa **+ Item**. Los objetos viven en el
contexto compartido, así que una sola lista sirve a todas las escenas del juego.

![La definición de un ítem: id, icono, kind, cantidad máxima y sus claves de texto](/docs-images/beasty-visual-novel/vn-items-tab.png)

| Campo | Qué es |
|---|---|
| **Id** | El nombre estable (`potion`). Se genera automáticamente, y es editable. Todo apunta a él. |
| **Icon** | El sprite que se muestra en la grilla del inventario y en el popup de detalle. |
| **Kind** | `Key` o `Consumable`. |
| **Max quantity** | Cuánto se puede apilar un consumible. Un objeto `Key` siempre está limitado a 1, diga lo que diga este campo. |
| **Name key** | La clave de localización del nombre mostrado del objeto, en la tabla de UI global. Escribes el texto directamente en la pestaña Items. |
| **Description key** | La clave de localización de la descripción mostrada en el popup de detalle. |

Un objeto **Key** es una bandera de posesión: el jugador lo tiene o no lo tiene. Un **Consumable** se apila desde
0 hasta su máximo.

### Al usar

Todo objeto tiene una sección **on use**. Es lo que ocurre cuando el jugador pulsa Use en el inventario, o
cuando se ejecuta un bloque **Use**.

![La sección «al usar» de un ítem: condición, efectos, escena de salto y cantidad consumida](/docs-images/beasty-visual-novel/vn-item-onuse.png)

| Campo | Qué hace |
|---|---|
| **Use condition** | Usar solo se permite cuando esta condición se cumple. Vacío = usable en cualquier sitio. |
| **Cannot use message** | La clave de localización del mensaje mostrado cuando la condición falla. Vacío = un mensaje integrado. |
| **Effects** | Cambios de variable aplicados al usar: `health += 20`, `door_unlocked = true`. |
| **Jump to scene** (+ **start node**) | Una escena VN a la que saltar cuando se usa el objeto — una cinemática de "beber la poción". Vacío = te quedas donde estás. |
| **Consume amount** | Cuántos se eliminan. Los consumibles usan 1 por defecto. Ponlo en 0 para un objeto llave, que se usa pero no se gasta. |

Son la misma condición y los mismos efectos que usa el resto del motor, así que la lógica de los objetos se
comporta exactamente igual que la de una elección. Consulta [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/).

## Los bloques

Cuatro operaciones, todas en la categoría **Items** de la paleta:

| Bloque | Qué hace |
|---|---|
| **Give** | Añade N. Limitado al máximo del objeto. |
| **Take** | Quita N. Limitado a 0. |
| **Set quantity** | Fija el número exacto que se tiene. Limitado a `0..max`. |
| **Use** | Ejecuta la lógica on-use del objeto: comprueba la condición, aplica los efectos, consume, y salta si hay una escena fijada. |

Give y Take nunca se desbordan ni bajan de cero, así que no puedes acabar con -2 pociones por quitar una
de más.

En el guion de texto estas son `give 3 potion`, `take 1 potion`, `item potion = 5` y `use key`.

## El contador de un objeto es solo una variable

La cantidad que el jugador tiene de un objeto vive en el almacén de variables compartido bajo la clave
`item.<id>`. Es un número simple: `item.potion` es `3`, `item.rusty_key` es `0` o `1`.

Eso es todo el inventario. No hay un archivo de guardado del inventario aparte, ni un sistema de inventario al
que consultarle nada. Eso significa que:

- **Cualquier condición puede preguntar sobre objetos.** `item.potion >= 3` es una cláusula como cualquier otra. Ponla en
  una elección, una puerta, un objetivo de misión, una regla de rutina, un botón de pantalla.
- **El inventario está en cada partida guardada**, porque el almacén lo está.
- **Se rebobina.** Retrocede más allá del bloque que quitó la llave y el jugador vuelve a tener la llave.

### Filtrar por un objeto

Dale a una elección una condición de `item.rusty_key >= 1` y la elección "Desbloquear la verja" solo aparece cuando el
jugador realmente tiene la llave. Haz lo mismo en la excepción de acceso de una puerta y la puerta permanece cerrada, con una línea
que explica por qué, hasta que la encuentren. Consulta
[Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) y
[Interactuables y puertas](/es/docs/beasty-visual-novel/world/interactables-and-doors/).

> **Nota**
> El bloque **Deliver items** no hace nada, en silencio, cuando al jugador le faltan los objetos. Si una rama
> debe tener la certeza de que la entrega ocurrió, protege esa rama primero con el contador del objeto. Consulta
> [Misiones](/es/docs/beasty-visual-novel/world/quests/).

## La pantalla de inventario

El prefab `Inventory` es una superposición ya hecha: una grilla de los objetos que el jugador lleva en ese
momento, y un popup de detalle.

![La pantalla de inventario en el juego: la grilla de ítems y el popup de detalle](/docs-images/beasty-visual-novel/vn-inventory-ingame.png)

- **La grilla** es dinámica. Muestra una ranura por cada objeto con una cantidad de al menos 1, en el orden de
  ranura guardado del jugador. Usa la última poción y la ranura desaparece y la grilla se recoloca. Recoge algo
  nuevo y se añade al final.
- **Una ranura** muestra el icono del objeto y cuántos se tienen.
- **El popup de detalle** se abre cuando el jugador clica una ranura. Muestra el icono, el nombre, la descripción
  y un botón Use, que ejecuta exactamente la lógica on-use de arriba — incluido el rechazo, con tu mensaje,
  cuando la condición de uso falla.

Es un prefab uGUI normal. Restilízalo, mueve cosas de sitio, reemplaza el arte; consulta
[Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/).

### Añadirla y abrirla

En la pestaña **Screens** del editor, pulsa **+ Inventory (ready-made)**. Eso copia el prefab a tu
proyecto y lo registra como pantalla secundaria con un id. Solo se crea un inventario: si pulsas el botón
dos veces, se selecciona el que ya existe.

![El botón + Inventory (ready-made) en la pestaña Screens](/docs-images/beasty-visual-novel/vn-screens-add-inventory.png)

El jugador llega a ella de dos formas:

- **Un botón del HUD.** Añade un elemento a tu pantalla de HUD con la acción **OpenScreen**, apuntando al id de pantalla
  del inventario. Esta es la forma habitual.
- **El bloque Open screen** (categoría de paleta **World**). La abre desde dentro de la historia — después de que
  el jugador reciba su primer objeto, por ejemplo.

Las pantallas secundarias forman una pila con Back y Close automáticos, así que un inventario abierto sobre una sala se cierra
de vuelta a la sala. Consulta [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/).

## Ver también

- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — `item.<id>` y el almacén en el que vive
- [Misiones](/es/docs/beasty-visual-novel/world/quests/) — objetivos de recolectar y entregar, y el bloque Deliver items
- [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/) — botones del HUD, superposiciones y la pila de pantallas
- [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) — restilizar el inventario
- [API de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) — la API `Inventory` para programadores
