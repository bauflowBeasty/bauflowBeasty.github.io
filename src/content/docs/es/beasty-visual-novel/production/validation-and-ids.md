---
title: "Validación e ids"
description: "Dos herramientas que encuentran por ti los problemas que, de otro modo, encontrarían tus jugadores: el validador, que recorre el proyecto en busca de referencias que apuntan a nada, y las herramientas de ids, que arreglan el único error que rompe una historia en silencio."
---

Dos herramientas que encuentran por ti los problemas que, de otro modo, encontrarían tus jugadores: el validador,
que recorre el proyecto en busca de referencias que apuntan a nada, y las herramientas de ids, que arreglan el
único error que rompe una historia en silencio.

## El validador

Ejecútalo desde el botón **Validate** en la ventana de Beasty VN, o selecciona un `DialogueScene` en la ventana
Project y usa `Tools > Beasty VN > Maintenance > Validate Selected Project`.

Recorre el grafo raíz y **cada subgrafo alcanzable desde él**, e informa lo que encuentra en la consola — y,
por nodo, como una insignia en el lienzo del grafo, así que puedes ver qué nodo se está quejando sin leer un
log.

Qué comprueba:

- **Referencias colgantes.** Un bloque que nombra un id de personaje, una clave de variable, un token de
  diccionario o un campo de personaje que no existe. Estas son las que duelen: un error de tipeo en un id de
  hablante no arroja excepción, simplemente narra la línea en silencio.
- **Rutas rotas.** Un nodo que apunta a un id de nodo que no está en su grafo. Un nodo de decisión sin
  respaldo. Un nodo de elección sin ninguna elección utilizable. Un nodo de flujo sin acción.
- **Nodos inalcanzables** — un nodo al que ninguna ruta desde el nodo de entrada puede llegar.
- **Subgrafos.** Un nodo de subgrafo sin grafo, un subgrafo sin un nodo de entrada válido, y cualquier
  resultado que el subgrafo pueda DEVOLVER que el llamador ni enrute ni cubra con un respaldo.
- **Misiones y menús de conversación.** Un bloque de actualización de misión o de entrega que nombra una misión
  u objetivo desconocido, un bloque de entrega que apunta a un objetivo que no es de tipo reunir-y-entregar, un
  bloque de abrir pantalla que nombra una pantalla que no existe, un paso de conversación con un diálogo pero
  sin nodo de inicio, una misión `SpecificDays` sin días seleccionados (nunca se ejecutaría).
- **Localización.** Claves sin texto en el idioma de origen, los totales de traducciones faltantes y
  desactualizadas, y claves que la tabla contiene pero que ya nada referencia. Consulta [Localización](/es/docs/beasty-visual-novel/production/localization/).
- **Colisiones de tokens.** Un nombre de `[token]` definido en más de una fuente (una variable, el diccionario,
  la tabla de localización, un id de personaje), lo que te dice cuál gana antes de que te sorprenda.

Ejecútalo antes de una compilación, y ejecútalo después de una refactorización grande. Es rápido y nunca cambia
nada.

## Ids

Cada asset de Beasty lleva un id: nodos de historia, grafos, escenas de diálogo, personajes. A esos ids
apuntan los saltos, las elecciones, las rutinas y las puertas de mundo libre.

**Se generan automáticamente, pero puedes editarlos.** Renombrar un id se propaga en cascada: las
referencias que lo usaban se reescriben con él. Así que un id generado por máquina puede convertirse en
`chapter1_intro` si eso es más fácil de manejar.

### Ids duplicados

Un id solo se autogenera cuando está VACÍO. Así que cuando duplicas un asset en la ventana Project (Ctrl+D), la
copia lleva el id del original — y a partir de ahí nada puede distinguir a los dos. Un salto enruta hacia el que
la búsqueda encuentre primero. Dos personajes se convierten en alias el uno del otro.

Dos herramientas:

- **`Tools > Beasty VN > Validate > Find duplicate ids`** informa cada id usado por más de un asset, con las
  rutas que lo usan, en la consola.
- **Haz clic derecho en el asset problemático en la ventana Project y elige
  `Assets > Beasty VN > Give this asset fresh ids (fix a duplicate)`.** Le da a cada id dentro de ese asset un
  valor nuevo y reescribe las referencias a ellos DENTRO del mismo asset — así que la copia deja de
  suplantar al original y su propio cableado interno (saltos, objetivos de elección, ramas de decisión, el nodo
  de entrada) sigue apuntando a donde lo pusiste.

> **Advertencia**
> La reparación no puede conocer las referencias de OTROS assets — un botón de mundo libre que nombra un
> id de nodo dentro de la escena a la que acabas de regenerar los ids, o un bloque `Go to VN scene`. Te dice
> cuántos ids cambió; esas referencias externas tendrás que reapuntarlas a mano.

## Limpiar después de una eliminación

`Tools > Beasty VN > Maintenance > Clean Deleted-Asset Residue` elimina lo que Unity deja atrás cuando eliminas
un asset de Beasty:

- Slots nulos que quedan en la lista de personajes del contexto y en la lista de nodos de un grafo.
- Strings de id de nodo colgantes que apuntan a un nodo cuyo asset ya no existe. Son ids, no referencias
  a objetos, así que Unity no puede vaciarlos por ti.
- Código generado desactualizado: `VNVars` y `VNChars` se reconstruyen, así que una variable o personaje que
  eliminaste deja de existir también en tu C# (ver [Accesores generados](/es/docs/beasty-visual-novel/scripting/generated-accessors/)).

Es idempotente y ligero, así que ejecutarlo nunca es un riesgo.

## Auto-wire

Selecciona el **BeastyManager** en tu escena y presiona **Auto-wire / Repair**.

Qué garantiza:

- Cada gestor que el juego necesita existe, como un subcomponente oculto del BeastyManager.
- Las vistas de la escena se resuelven por tipo y se conectan.

**La regla que lo hace seguro: auto-wire solo rellena referencias VACÍAS. Nunca sobrescribe un cableado que
hiciste tú mismo.** Así que puedes presionarlo en cualquier momento, en cualquier escena, sin perder una
conexión deliberada.

También es lo primero que conviene probar cuando el juego arranca en una pantalla negra sin errores — consulta
[UI prefabs](/es/docs/beasty-visual-novel/production/ui-prefabs/).

## Ver también

- [Localización](/es/docs/beasty-visual-novel/production/localization/) — los informes de faltantes/desactualizadas que muestra el validador.
- [UI prefabs](/es/docs/beasty-visual-novel/production/ui-prefabs/) — el síntoma de pantalla negra que arregla auto-wire.
- [Referencia de elementos de menú](/es/docs/beasty-visual-novel/reference/menu-items/) — cada elemento de menú en una sola tabla.
- [Solución de problemas](/es/docs/beasty-visual-novel/troubleshooting/).
