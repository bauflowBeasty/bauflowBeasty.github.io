---
title: "Tu primera escena"
description: "De un proyecto de Unity vacío a una escena en la que puedes pulsar Play: un backdrop, un personaje que dice dos líneas, y una elección que se ramifica. Sin escribir una sola línea de código."
---

De un proyecto de Unity vacío a una escena en la que puedes pulsar Play: un backdrop, un personaje que dice
dos líneas, y una elección que se ramifica. No escribirás ni una sola línea de código, y te tomará unos
diez minutos.

Antes de empezar, asegúrate de que el paquete está importado y de que existe el menú **Tools > Beasty VN**.
Consulta [Instalación](/es/docs/beasty-visual-novel/getting-started/installation/).

## 1. Construye la escena

Crea o abre una escena, y luego ejecuta:

![El menú Setup con Create Scene dentro](/docs-images/beasty-visual-novel/vn-create-scene-menu.png)

```text
Tools > Beasty VN > Setup > Create Scene
```

Esto construye todo el rig por ti. Cuando termina tienes cinco objetos en la Hierarchy:

| Objeto | Qué es |
|---|---|
| **BeastyManager** | El único objeto que ejecuta todo. Cada manager vive dentro de él como un subcomponente oculto. |
| **Stage** | Donde se dibujan el backdrop, los personajes y los props. También lleva el escenario de mundo libre. |
| **Canvas** | Toda la UI, a partir del prefab `VN_Canvas`: cuadro de diálogo, elecciones, menú principal, menú de juego, guardar/cargar, preferencias, historial, créditos, ayuda, y la pantalla de carga. |
| **Main Camera** | Una cámara ortográfica, si la escena todavía no tenía una. |
| **EventSystem** | Para que la UI reciba clics. El módulo de entrada correcto se instala al arrancar, sea cual sea el backend de entrada que use tu proyecto. |

Luego se auto-cablea: todas las referencias que la escena necesita se resuelven solas.

**Create Scene se puede volver a ejecutar sin riesgo.** Reutiliza la cámara, el EventSystem y el canvas que ya
están ahí en lugar de duplicarlos, y auto-wire **solo rellena referencias vacías — nunca sobrescribe tu
cableado**. Si alguna vez una escena aparece rota, volver a ejecutarlo es lo primero que hay que probar.

![La Hierarchy después de Create Scene: BeastyManager, Stage, Canvas, Main Camera, EventSystem](/docs-images/beasty-visual-novel/vn-first-scene-hierarchy.png)

## 2. Consigue los assets

El asistente también crea los assets de datos que tu escena necesita, y te pregunta dónde guardarlos. Si no
te lo preguntó (porque ya tenías assets), o quieres hacer este paso por tu cuenta, ejecuta:

```text
Tools > Beasty VN > Content > Create Base Assets (intro + FreeRoam map)
```

Crea **solo lo que falta**, lo cablea, y nunca duplica ni sobrescribe nada. Si quieres un proyecto de
historia y nada más — sin mapa de mundo libre — usa mejor `Tools > Beasty VN > Setup > Blank Canvas`.
En ambos casos terminas con cuatro assets. Esto es lo que **es** cada uno:

| Asset | Qué es |
|---|---|
| **DialogueScene** (llamado `intro`) | Una historia. Este es el asset raíz — lo que abres en el editor y lo que el juego reproduce. |
| **VNContext** | El único mundo compartido: el reparto, las variables, el diccionario, los ítems, las misiones, las pantallas. Cada DialogueScene de tu juego lo comparte. Solo existe uno. |
| **StoryGraph** | El lienzo donde viven tus nodos. Viene con un nodo Dialogue ya puesto, marcado como el nodo de entrada — ahí es donde empieza la reproducción. |
| **LocalizationTable** | Cada línea de texto de la historia, con su clave y una columna por idioma. Tu diálogo vive aquí incluso si nunca lo traduces. |

Si esas cuatro palabras no significan nada para ti todavía, no pasa nada — sigue adelante, y lee
[Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/) después.

## 3. Abre el editor

```text
Tools > Beasty VN > Editor
```

La ventana Beasty VN se abre con tu DialogueScene ya puesta en el campo de la barra superior. Nueve
pestañas arriba. Hoy necesitas dos de ellas: **Characters** y **Story**. Para el resto, consulta el
[Recorrido del editor](/es/docs/beasty-visual-novel/getting-started/editor-tour/).

## 4. Crea un personaje

Ve a la pestaña **Characters**, sub-pestaña **Cast**.

![Un personaje recién creado en la sub-pestaña Cast, con id y expresión base](/docs-images/beasty-visual-novel/vn-first-character.png)

1. Presiona **+ New Character**. Elige dónde guardarlo. El personaje aparece en la lista de la izquierda y
   se abre a la derecha.
2. **Id (stable)** — el nombre interno que usa la historia para referirse a este personaje, por ejemplo
   `juan`. Se genera a partir del nombre del asset. Todo lo que hace referencia a este personaje usa este
   id, así que elígelo ahora y no lo cambies después.
3. **Display name** — el nombre que ve el jugador, por ejemplo `Juan`. Cambia esto cuando quieras.
4. Baja hasta **Expressions (key -> stage sprite)** y presiona **+ Add expression**. Aparece una fila con
   la clave `base`. Arrastra un sprite al campo de al lado.

`base` es la expresión predeterminada: cuando un bloque no dice qué expresión usar, esta es la que se
muestra. Con una expresión alcanza para terminar esta página. Agrega `happy` y `sad` más adelante.

> **Nota**
> Cualquier sprite sirve por ahora — el paquete incluye arte de relleno en `Sprites/`. Da igual qué imagen
> sea.

Detalle completo: [Personajes](/es/docs/beasty-visual-novel/world/characters/).

## 5. Escribe dos líneas

Ve a la pestaña **Story**. Tres paneles:

- **Izquierda: la paleta Add blocks.** Cada instrucción que puedes poner en un nodo, agrupada por
  categoría.
- **Centro: el lienzo del grafo.** Tus nodos. Ya hay uno, desde el paso 2.
- **Derecha: el inspector de nodo.** Los bloques del nodo seleccionado, en el orden en que se ejecutan.

Haz clic en el nodo del grafo para seleccionarlo. Ahora construye el nodo, de arriba a abajo.

1. En la paleta, bajo **Scene**, haz clic en **Backdrop**. Se agrega al final del nodo. En el inspector,
   asigna **Background sprite** a un sprite.
2. En la paleta, bajo **Scene**, haz clic en **Show character**. Asigna **Character** a Juan. Deja el resto.
3. En la paleta, bajo **Dialogue**, haz clic en **Dialogue**. En el inspector, asigna **Speaker** a Juan y
   escribe en **Line text**: `Hello. Are you lost?`
4. Haz clic en **Dialogue** otra vez. Speaker Juan. Line text: `You should not be out here after dark.`

Ese es todo el nodo: un backdrop, un personaje, y dos líneas. Los bloques se ejecutan **de arriba a abajo**,
y un bloque Dialogue **se detiene y espera al jugador** — por eso son dos líneas separadas en lugar de un
muro de texto.

Al hacer clic en un bloque de la paleta se agrega al final. Si quieres insertarlo en un punto intermedio,
**arrástralo sobre la lista de bloques** hasta la posición que quieras.

![La pestaña Story: la paleta Add blocks, el grafo, y el inspector de nodo con cuatro bloques](/docs-images/beasty-visual-novel/vn-story-tab-first-node.png)

> **Nota**
> Deja el campo **Speaker** vacío y la línea es narración — sin nombre, sin retrato. Así es como escribes
> "La habitación quedó en silencio."

Detalle completo: [Diálogo y el escenario](/es/docs/beasty-visual-novel/authoring/dialogue-and-stage/) y
[Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/).

## 6. Agrega una elección

Haz clic derecho en un punto vacío del lienzo del grafo:

![El primer nodo Choice con dos opciones, conectado a dos nodos de diálogo](/docs-images/beasty-visual-novel/vn-first-choice-node.png)

```text
Create > Choice Node
```

Un nodo Choice le muestra al jugador algunas opciones y va a donde apunte la que elija.

**Cablea el primer nodo hacia él.** Arrastra desde el puerto de salida en el borde derecho de tu nodo
Dialogue hasta el puerto de entrada en el borde izquierdo del nodo Choice. Ahora se reproducen las dos
líneas, y luego aparece la elección.

**Dale dos opciones.** Selecciona el nodo Choice. En el inspector, bajo **Choices**, presiona **+ choice**
dos veces. Para cada una:

- **Button text** — lo que el jugador lee en el botón. Escribe `Run` en la primera y `Talk to him` en la
  segunda.
- El **target** — a dónde va esa opción. Déjalo vacío por ahora; lo apuntarás a un nodo en un momento.

**Dales un destino a las opciones.** Haz clic derecho en el lienzo dos veces más y crea dos
nodos **Dialogue**. Pon un bloque Dialogue en cada uno con una línea distinta (`You run.` / `You stay.`).
Luego vuelve al nodo Choice y asigna el target de cada opción a uno de ellos — ya sea desde el campo target
de la opción, o arrastrando desde el puerto de esa opción en el grafo hasta el nodo.

Debajo de las opciones está **Default next (no choice available)**. Ahí es donde va el nodo si todas las
opciones están ocultas por una condición. Ninguna de tus opciones tiene una condición, así que hoy no se
disparará, pero configurarlo es un buen hábito — es lo que evita que una historia se quede muerta en un
callejón sin salida.

Detalle completo: [Elecciones y decisiones](/es/docs/beasty-visual-novel/authoring/choices-and-decisions/).

## 7. Presiona Play

Guarda la escena, y luego presiona Play.

![La primera escena en marcha: fondo, personaje, placa de nombre y caja de diálogo](/docs-images/beasty-visual-novel/vn-first-play.png)

Aparece el **menú principal**. Presiona **Start**. Tu backdrop aparece, Juan aparece, y dice su primera
línea. Haz clic, o presiona Espacio, para avanzar. Después de la segunda línea aparecen los dos botones.
Haz clic en uno, y caes en el nodo al que apunta.

Eso es una novela visual.

Avanzar es **Espacio**, **Enter** o **clic izquierdo**. **Escape** o clic derecho abre el menú de juego,
donde **Save** y **Load** ya funcionan. Consulta [Entrada y controles](/es/docs/beasty-visual-novel/production/input-and-controls/).

## 8. Dos cosas para hacer antes de seguir avanzando

### Previsualiza un nodo sin entrar en Play Mode

Esperar a Play Mode para ver una línea se vuelve pesado enseguida.

```text
Tools > Beasty VN > Dialogue Preview
```

Esto reproduce un nodo — backdrop, personajes, props, cuadro de diálogo — dentro de una ventana de editor,
sin entrar en Play Mode. Puedes adelantarte hasta un bloque específico para ver el momento exacto en el que
estás trabajando. No toca nada de tu escena y no guarda nada. Consulta
[Vista previa de diálogo](/es/docs/beasty-visual-novel/authoring/dialogue-preview/).

### Valida

En la barra superior de la ventana Beasty VN, presiona **Validate**.

![El informe del validador después de recorrer el grafo](/docs-images/beasty-visual-novel/vn-validate-report.png)

El validador recorre el grafo raíz y cada subgrafo y reporta referencias colgantes: una línea hablada por
un id de personaje que ya no existe, una condición sobre una variable que borraste, un token de diccionario
que no está definido. Tarda un segundo. Ejecútalo antes de que tus jugadores encuentren el problema por ti.
Consulta [Validación e ids](/es/docs/beasty-visual-novel/production/validation-and-ids/).

## Hacia dónde ir después

Tres direcciones, elige la que necesite tu juego.

**Agrega una sala.** Deja que el jugador salga de la novela, camine, haga clic en una puerta y vuelva. Pon
un bloque **Go to FreeRoam** al final de un nodo y lee [Salas de mundo libre](/es/docs/beasty-visual-novel/world/free-roam-rooms/).

**Agrega una variable.** Dale al jugador algo que la historia recuerde. Defínela en la pestaña
**Variables**, asígnala con un bloque **Set variable**, y pon una condición en una elección para que solo
aparezca cuando la variable lo indique. Lee [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/).

**Escribe la misma escena como texto.** En la pestaña Story, activa el alternador **Graph / Text**. Tu
escena está ahí, como un script:

```text
label intro:
    backdrop bedroom
    show juan base
    juan "Hello. Are you lost?"
    juan "You should not be out here after dark."
    jump cruce

choice cruce:
    choice "Run" -> ran
    choice "Talk to him" -> stayed
```

Una vez que puedas leer eso, puedes escribir diálogo tan rápido como puedas teclear. Lee
[El script de texto](/es/docs/beasty-visual-novel/authoring/text-script/).

## Ver también

- [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/) — lee esto a continuación
- [Recorrido del editor](/es/docs/beasty-visual-novel/getting-started/editor-tour/)
- [El grafo de la historia](/es/docs/beasty-visual-novel/authoring/story-graph/)
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/)
- [Solución de problemas](/es/docs/beasty-visual-novel/troubleshooting/)
