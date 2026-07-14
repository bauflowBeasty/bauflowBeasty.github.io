---
title: "Streaming (Addressables)"
description: "Carga el arte bajo demanda en lugar de cargar todo el juego en memoria. El streaming es opcional, y es beta en 1.0.0 — funciona, y las pruebas lo cubren, pero la API"
---

Carga el arte bajo demanda en lugar de cargar todo el juego en memoria. El streaming es **opcional**, y es
**beta en 1.0.0** — funciona, y las pruebas lo cubren, pero la API puede cambiar en una versión menor. Si ese no
es un riesgo que quieras en un proyecto que vas a lanzar, déjalo desactivado: todo lo de abajo está desactivado
por defecto y no te cuesta nada.

## Por qué lo querrías

Un juego largo tiene mucho arte. Sin streaming, cada fondo, cada expresión de cada personaje y cada ícono de
ítem es una referencia directa desde un asset que el juego carga al arrancar, así que todo entra en memoria sin
importar si el jugador llega a ese capítulo o no. En un teléfono, o en un juego con cientos de fondos, esa es la
diferencia entre poder lanzarlo y no poder.

El streaming reemplaza esas referencias directas por direcciones, y carga un sprite cuando la escena que lo
necesita está a punto de mostrarse, liberándolo cuando el ámbito que lo solicitó se cierra.

## El modelo, y por qué es seguro

Cada campo de arte transmisible es un **par**: una referencia directa, y una dirección.

**La referencia directa siempre gana, y se resuelve de forma síncrona.** Ese es el valor predeterminado, y es
exactamente el comportamiento de un proyecto que nunca ha oído hablar de Addressables. Nada se difiere, nada es
asíncrono, nada puede aparecer con un frame de retraso.

La resolución solo se vuelve asíncrona cuando las tres condiciones siguientes son verdaderas:

1. La referencia directa está vacía, Y
2. hay una dirección configurada en ese campo, Y
3. hay un proveedor registrado — lo cual sucede automáticamente cuando el paquete Addressables está instalado.

Si alguna de ellas es falsa, obtienes la referencia directa, de forma síncrona. Por eso activar el streaming no
es un salto de fe: un campo que no migraste sigue comportándose exactamente igual que antes, junto a uno que sí.

El propio módulo de streaming solo compila cuando `com.unity.addressables` está en el proyecto. Sin el paquete,
el módulo no existe y no hay nada que pueda salir mal.

## Cómo activarlo

1. Instala el paquete **Addressables** (`com.unity.addressables`) desde el Package Manager.
2. Ejecuta `Tools > Beasty VN > Streaming > Convert To Streamed Content`.

El conversor recorre cada campo de arte migrable en el proyecto — expresiones de personajes, retratos y sprites
de deambulación libre, íconos de ítems, marcadores de mapa de misión, fondos de sala y sus casos condicionales,
y las capas de fondo y props dentro de tus nodos de diálogo —, marca cada sprite como Addressable, y limpia la
referencia directa.

Los sprites se colocan en tres grupos:

| Grupo | Qué entra en él |
|---|---|
| `VN_Characters` | Expresiones, retratos, sprites de personaje de deambulación libre. |
| `VN_Rooms` | Fondos de sala, capas de fondo y props, marcadores de mapa de misión. |
| `VN_Items` | Íconos de ítems. |

Las direcciones son el GUID del asset con el nombre del sprite entre corchetes, así que mover o renombrar el
archivo no rompe la referencia.

### No es una puerta de un solo sentido

`Tools > Beasty VN > Streaming > Convert To Direct References` hace lo inverso: resuelve cada dirección de
vuelta a su sprite y restaura la referencia directa. **Ese comando siempre está disponible, incluso si
desinstalas el paquete Addressables**, precisamente para que un proyecto siempre pueda recuperar sus
referencias directas.

## Qué NO se transmite

Solo se migran los sprites en los campos listados arriba. Estos siguen siendo referencias directas, y siguen
funcionando exactamente como siempre:

- Clips de audio.
- Clips de video.
- Fuentes.
- Arte de objetos de deambulación libre y arte de hover.
- Imágenes de elecciones e imágenes de menú de conversación.
- Íconos de HUD y de pantalla.
- Miniaturas de guardado.

## Streaming de nodos

Por separado del arte, los nodos se cargan a través de una ventana deslizante: el nodo actual, el anterior (para
que `Back` siga funcionando), y los nodos que el actual puede alcanzar — una **lista de precarga por nodo**,
mantenida en el propio nodo. Los nodos que quedan fuera de esa ventana se liberan. Con todo en memoria esto es
solo contabilidad; con un proveedor de streaming detrás, es gestión de memoria real.

## El detalle que debes conocer

> **Advertencia**
> **Después de reconstruir, debes reconstruir el contenido de Addressables.** El arte transmitido se resuelve
> a través del catálogo de Addressables, y un catálogo desactualizado no sabe nada de los sprites que acabas de
> migrar o cambiar — así que el arte no se resolverá en tiempo de ejecución. Haz de "Build Addressables
> content" un paso en tu checklist de compilación, justo al lado de ejecutar el validador. Ver
> [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/).

## Ver también

- [Proyectos grandes](/es/docs/beasty-visual-novel/production/large-projects/) — cuándo vale la pena activar el streaming, y qué más hacer primero.
- [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/) — la checklist previa a la compilación.
