---
title: "Entrada y controles"
description: "Cada acción de una novela visual viene enlazada de fábrica en ambos backends de entrada. Valores por defecto, dónde cambiarlos y cómo reasigna el jugador."
---

Cada acción que una novela visual necesita viene enlazada de fábrica, en los dos backends de entrada de
Unity — el nuevo Input System y el Input Manager clásico. Esta página lista las acciones y sus valores
predeterminados, muestra dónde los cambias, y explica cómo el jugador los reasigna.

## Las acciones y sus valores predeterminados

| Acción | Primaria | Secundaria | Mouse |
|---|---|---|---|
| Avanzar | Space | Enter | Clic izquierdo |
| Retroceder | Page Up | Backspace | (rueda del mouse hacia arriba) |
| Reavanzar | Page Down | — | (rueda del mouse hacia abajo) |
| Saltar (mantener) | Left Ctrl | Right Ctrl | — |
| Saltar (alternar) | Tab | — | — |
| Automático | A | — | — |
| Menú | Escape | — | Clic derecho |
| Historial | B | — | — |
| Ocultar UI | H | — | — |
| Guardado rápido | F5 | — | — |
| Carga rápida | F9 | — | — |
| Elección 1-9 | Dígitos 1-9 (y numpad 1-9) | — | — |

Retroceder con la rueda del mouse (hacia arriba para retroceder, hacia abajo para reavanzar) y las teclas de
elección son fijas. Las demás filas de la tabla las puedes cambiar libremente.

## Reasignar en el editor

Selecciona el GameObject **BeastyManager** en tu escena y abre la sección **Controls** de su inspector. Cada
acción es una fila con tres desplegables: **Primary**, **Secondary** y **Mouse**. Elige una tecla de la lista;
una casilla vacía (—) significa que esa casilla queda sin enlace.

![El asset de configuración de entrada: las acciones y sus asignaciones por defecto](/docs-images/beasty-visual-novel/vn-input-config.png)

Hay tres botones debajo de la tabla:

- **Edit controls (load defaults)** — rellena la tabla con los valores predeterminados incluidos para que
  puedas empezar a editar.
- **Restore default values** — devuelve la tabla a los valores predeterminados.
- **Clear (use engine defaults)** — vacía la tabla. Una configuración vacía no es "sin controles": significa
  que se aplican los valores predeterminados incorporados, que son algo más completos de lo que la tabla
  amigable puede expresar (Enter del numpad para Avanzar, ambas teclas Ctrl para Saltar).

> **Nota**
> Esta es una configuración serializada en el BeastyManager, **no** un asset `.inputactions`. No hay nada que
> crear, nada que asignar, y nada que mantener sincronizado.

## Los dos backends de entrada

El paquete funciona con el **nuevo Input System**, el **Input Manager clásico**, o un proyecto que tiene
ambos.

Tú no eliges. La propia configuración **Active Input Handling** de Unity (en `Edit > Project Settings > Player`)
elige la capa:

- Con el paquete Input System instalado y habilitado, el backend de Input System se registra solo al
  arrancar y gestiona los enlaces.
- De lo contrario, el backend clásico de Input Manager lee los mismos enlaces.

El código de Input System vive en su propio assembly, que Unity solo compila cuando el paquete está presente.
Así que el paquete **compila y se ejecuta en un proyecto que nunca instaló el paquete Input System** — no
estás obligado a agregar una dependencia que no querías.

Ambos backends leen la misma tabla de enlaces, así que los controles que mapeas en la sección Controls se
comportan de manera idéntica en cualquiera de los dos. Una consecuencia que vale la pena conocer: un enlace de
gamepad no tiene equivalente en el Input Manager clásico, así que en ese backend se omite — la acción
simplemente tiene un enlace menos en lugar de romperse. Un proyecto en el backend antiguo que quiera un gamepad
lo configura en el propio Input Manager de Unity.

## Reasignación por parte del jugador

Los enlaces de arriba son los valores PREDETERMINADOS con los que se lanza tu juego. Las reasignaciones del
jugador son una capa aparte que se aplica encima, y persisten: se guardan en `PlayerPrefs` (el almacén de
ajustes por máquina de Unity) y se vuelven a aplicar en el siguiente arranque. Una pantalla de controles puede guardarlas, recargarlas o borrarlas
(`SaveOverrides`, `LoadOverrides`, `ResetOverrides` en las acciones de entrada), y borrarlas devuelve el juego a
tus valores predeterminados.

![El jugador reasignando una tecla en el juego](/docs-images/beasty-visual-novel/vn-input-rebind-ingame.png)

Cada backend almacena sus reasignaciones bajo su propia clave, así que un proyecto que cambia de backend
empieza de nuevo desde tus valores predeterminados en lugar de intentar leer el formato del otro backend.

## Escribir suprime cada atajo

Este es el detalle que ahorra tickets de soporte. **Mientras el jugador escribe en un campo de texto, todas
las acciones de entrada se suprimen.** Presionar `b` mientras nombra a su personaje escribe una `b` — no abre
el historial. Presionar `a` no alterna Auto. Space no avanza la línea. Las teclas de elección no hacen nada.

Se aplica tanto a TextMeshPro como a los campos de entrada uGUI antiguos, lo que cubre el prompt de nombrado, el
campo de nombre de partida y cualquier campo que agregues tú mismo.

## Ver también

- [VN settings](/es/docs/beasty-visual-novel/production/vn-settings/) — velocidad de texto, auto-avance y los otros rangos de preferencias.
- [UI prefabs](/es/docs/beasty-visual-novel/production/ui-prefabs/) — la pantalla de preferencias desde la que el jugador reasigna.
- [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/) — qué hacen el guardado rápido y la carga rápida.
