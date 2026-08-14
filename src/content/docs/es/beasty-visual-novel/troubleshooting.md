---
title: "Solución de problemas"
description: "Síntoma, causa, solución para los problemas más comunes: pantalla negra, bloques mudos, imports rechazados, personajes ausentes, traducciones obsoletas."
---

Síntoma, causa, solución. Encuentra tu síntoma, aplica la solución, y vuelve al trabajo.

## El juego arranca en pantalla negra. El motor está corriendo. No hay errores en la consola.

**Causa.** El cableado de la escena se rompió. Reordenar la jerarquía, editar un prefab de menú o mover un
objeto puede romper una referencia que estaba conectada en la escena. Nada lanza un error, porque nada falta
en tiempo de compilación — las vistas a las que apuntaban los controladores simplemente ya no están.

**Solución.** Selecciona el **BeastyManager** en la escena y presiona **Auto-wire / Repair** en su inspector.

Eso casi siempre lo soluciona. Auto-wire garantiza que exista cada manager y vuelve a resolver las vistas de
la escena por tipo. Solo rellena referencias vacías — nunca sobrescribe un cableado que hiciste tú mismo, así
que es seguro presionarlo en cualquier momento. Que sea lo primero que pruebes cada vez que una escena se
comporte raro y la consola esté limpia.

Si a la escena le faltan objetos enteros (sin Canvas, sin Stage), vuelve a ejecutar `Tools > Beasty VN > Setup > Create Scene`.
Reutiliza la cámara, el EventSystem y el canvas que ya están ahí, así que es seguro ejecutarlo sobre una
escena existente. Consulta [Elementos de menú](/es/docs/beasty-visual-novel/reference/menu-items/).

## Mis condiciones de tiempo son todas falsas

**Causa.** No hay un **Time Config** asignado en el BeastyManager, así que el sistema de tiempo está
apagado. No escribe ninguna variable de tiempo, y cada condición sobre `@time:...` compara contra un valor
vacío.

**Solución.** Crea un Time Config (`Create > Beasty VN > Config > Time Config`) y arrástralo al campo **Time
Config** del BeastyManager. El inspector también ofrece un botón **Create & assign Time Config** cuando el
campo está vacío.

Luego recuerda que el tiempo nunca avanza por sí solo. Lo mueves con un bloque **Advance time**, con la
propiedad `advanceTimeOnClick` de un objeto de mundo libre, o desde código.

Consulta [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/) y [Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/).

## Mi personaje nunca aparece en una sala

Dos causas, en este orden.

**Causa 1: la regla que coincidió tiene una sala vacía.** Una regla de rutina sin sala significa que el
personaje está **ausente** — no en esa sala, no en ningún lugar del mapa. Si la primera regla cuya condición
se cumple tiene una sala vacía, esa es tu respuesta. Recuerda que la regla de respaldo también cuenta.

**Solución.** Abre la pestaña **FreeRoam**, cambia a **Routines**, y filtra por ese personaje. La grilla
muestra qué se resuelve en cada día y momento del día. Completa la sala en la regla que está ganando, o
reordena las reglas para que gane otra distinta.

**Causa 2: otro personaje ocupó el punto primero.** Si dos personajes resuelven al mismo punto, solo se coloca
el primero. Los demás se omiten, con un aviso en la consola.

**Solución.** Dales puntos distintos en el prefab de la sala, o mueve a uno de ellos a otra sala.

Consulta [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).

## Un bloque no hace nada

**Causa.** El bloque no tiene ningún asset asignado. Un bloque Backdrop sin sprite, un bloque Music sin
clip, un bloque Show character sin personaje: todos se omiten. Lo que esté en pantalla se queda en pantalla,
y lo que esté sonando sigue sonando.

Es deliberado: así un bloque a medio completar nunca borra tu escena por accidente.

**Solución.** Asigna el asset. Si lo que realmente querías era borrar algo a propósito, usa el bloque que
hace eso:

| Para hacer esto | Usa |
|---|---|
| Quitar el fondo | **Clear > Backdrop** |
| Quitar un personaje | **Scene > Hide character**, o **Clear > Characters** |
| Quitar todos los props | **Clear > Props** |
| Silenciar música, ambiente, SFX o voz | **Audio > Stop channel** |

Consulta [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/).

## Guardar el script de texto borró un bloque

**Causa.** Un bloque sin asset asignado no tiene nada que escribir. No aparece en el archivo `.vnbeasty`, así
que cuando el archivo se aplica de vuelta al grafo, el bloque también desaparece del grafo.

**Solución.** Asigna el asset del bloque **antes** de guardar el script. Esto va solo de bloques vacíos: un
bloque que tiene su asset siempre tiene forma de texto, fondos en capas y atrezo incluidos.

Si la importación escribió un `.bak` con marca de tiempo junto a tu script, el lado sobrescrito está ahí.

Consulta [El script de texto](/es/docs/beasty-visual-novel/authoring/text-script/).

## Mi script no se importa

**Causa.** La importación se rechazó a propósito. El grafo es la fuente de verdad: una importación que no
se puede parsear, que está vacía, o que destruiría contenido, se rechaza y el grafo queda exactamente como
estaba. No has perdido nada.

**Solución.** Lee la línea reportada. El mensaje la identifica.

El caso que sorprende a todos: un nombre de asset que no se resuelve, o que comparten varios assets, es un
**error**, no una advertencia. El importador se rehúsa antes que adivinar a qué sprite te referías.
Renombra el duplicado, o usa una ruta (`backdrop interiors/bedroom`) para desambiguar.

Los assets se resuelven por GUID una vez que un nodo está sincronizado, así que mover o renombrar arte más
tarde no rompe nada.

Consulta [El script de texto](/es/docs/beasty-visual-novel/authoring/text-script/) y [la sintaxis de .vnbeasty](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/).

## El grafo y el texto no coinciden

**Causa.** Ambos lados cambiaron desde la última sincronización. La pestaña Story muestra un marcador de
advertencia en el alternador **Graph** cuando detecta esto.

**Solución.** Decide qué lado es el correcto, y guarda ese. **Gana el guardado más reciente**, y se deja un
`.bak` con marca de tiempo del lado sobrescrito junto al script, así que la otra versión nunca se pierde.

- El grafo es el correcto: presiona **Sync from graph** para reescribir el script.
- El texto es el correcto: guarda el archivo para aplicarlo al grafo.

Acuerda una dirección con tu equipo antes de que dos personas editen la misma escena.

Consulta [El script de texto](/es/docs/beasty-visual-novel/authoring/text-script/).

## Una elección nunca aparece

**Causa.** Su condición es falsa. Una elección solo aparece en la lista cuando su condición se cumple.

**Solución.** Abre la elección y lee su condición. Dos reglas explican casi todos los casos:

- Una **condición vacía siempre es verdadera**. Si falta una elección sin condición, el problema está en
  otro lado.
- Una cláusula con **ninguna variable seleccionada está incompleta y se evalúa como falsa**. La consola lo
  reporta una vez. Una condición a medio completar oculta la elección.

Si todas las opciones quedan bloqueadas, el nodo Choice va a su nodo siguiente predeterminado, así que la
historia no se atasca — simplemente se salta el menú.

Consulta [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/) y
[Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/).

## Mi condición de variable nunca se dispara

**Causa.** Los conectores. **AND agrupa con más fuerza que OR**, y no hay paréntesis.

`a AND b OR c` significa `(a AND b) OR c`. Si querías decir `a AND (b OR c)`, no lo escribiste así.

**Solución.** Reordena las cláusulas para que el grupo AND sea lo que pretendías, o divide la rama en dos
ramas de un nodo Decision.

Ya que estás ahí, revisa el tipo de valor. El estado de una misión es un string (`active`, `completed`), no
un número.

Consulta [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/).

## Falta el arte en streaming

**Causa.** Ejecutaste `Tools > Beasty VN > Streaming > Convert To Streamed Content`, que marca los sprites
como Addressable y borra las referencias directas. Las direcciones existen, pero el contenido de
Addressables nunca se compiló, o quedó desactualizado después de que cambiaste el arte.

**Solución.** Recompila el contenido de Addressables (`Window > Asset Management > Addressables > Groups`,
y luego compila los groups). Cada vez que conviertas a contenido en streaming, o agregues arte a un grupo en
streaming, recompila.

Para volver atrás, ejecuta `Tools > Beasty VN > Streaming > Convert To Direct References`. Siempre está
disponible, y restaura las referencias directas para que el arte vuelva a cargarse de forma síncrona.

> **Advertencia**
> El streaming es opcional y está en beta. Si no estás lanzando un juego muy grande, déjalo apagado. El
> audio, el video, las fuentes, el arte de mundo libre y de hover, las imágenes de elecciones y del menú de
> conversación, los íconos del HUD y las miniaturas de guardado nunca se transmiten en streaming.

Consulta [Streaming](/es/docs/beasty-visual-novel/production/streaming/).

## Dos assets se comportan como uno

**Causa.** Comparten un id. Las condiciones, los scripts y los guardados se refieren a las cosas por su id,
así que dos assets con el mismo id son indistinguibles para el motor. Esto suele pasar después de duplicar
un asset con Ctrl+D.

**Solución.** Ejecuta `Tools > Beasty VN > Validate > Find duplicate ids`, que reporta cada colisión. Luego haz
clic derecho en el equivocado dentro de la ventana Project y elige
`Assets > Beasty VN > Give this asset fresh ids (fix a duplicate)`.

Los ids se generan automáticamente pero son editables, y renombrar uno se propaga en cascada. Hazlo antes de
que tus jugadores se topen con el problema.

Consulta [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/).

## Una traducción se ve desactualizada

**Causa.** Lo está. La celda está **Stale**. Cada celda traducida registra una huella digital del texto de
origen a partir del cual se tradujo. Cuando editas la línea de origen, cada traducción de esa línea se marca
como Stale — el texto anterior sigue ahí, pero ya no coincide.

**Solución.** Abre la pestaña **Localization**. El estado se muestra por celda. Usa `Export` y elige
**Missing or stale only** para enviarle a tu traductor exactamente las líneas que cambiaron, y luego importa
el resultado.

Consulta [Localización](/es/docs/beasty-visual-novel/production/localization/).

## Nada de esto coincide

Ejecuta `Tools > Beasty VN > Maintenance > Validate Selected Project`. Recorre el grafo raíz y cada
subgrafo, y reporta referencias colgantes: ids de personaje desconocidos, claves de variable desconocidas,
tokens de diccionario desconocidos, campos de personaje desconocidos.

Si borraste assets recientemente, ejecuta también `Tools > Beasty VN > Maintenance > Clean Deleted-Asset Residue`.

## Ver también

- [Preguntas frecuentes](/es/docs/beasty-visual-novel/faq/)
- [Elementos de menú](/es/docs/beasty-visual-novel/reference/menu-items/)
- [Claves de variables](/es/docs/beasty-visual-novel/reference/variable-keys/)
- [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/)
