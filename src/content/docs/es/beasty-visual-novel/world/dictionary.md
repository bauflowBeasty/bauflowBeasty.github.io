---
title: "El diccionario"
description: "Entradas de diccionario: tokens de texto con las palabras del propio jugador, nunca traducidas. Créalas, imprímelas en líneas y fíjalas desde la historia."
---

El diccionario guarda las palabras del propio jugador. Una entrada de diccionario es un token de texto con
nombre que colocas en una línea — su ciudad natal, el nombre de su mascota, cómo llama a su espada — y se lee
igual en todos los idiomas, porque lo escribió el jugador.

## Qué es, y qué no es

Un token de diccionario es un fragmento de texto con una clave. Escribes `[city]` en una línea, y el jugador lee
"Madrid", o "Boston", o lo que sea que haya escrito.

**No se traduce.** No tiene columna por idioma en la tabla de localización, y nunca la tendrá. Ese es todo el
sentido: cuando el jugador escribe "Madrid", la versión en alemán también debe decir "Madrid". Sus palabras son
sus palabras. Todo lo demás que lee el jugador — diálogo, elecciones, etiquetas de pantalla — pasa por las
tablas de localización descritas en [Localización](/es/docs/beasty-visual-novel/production/localization/). El diccionario es lo único
que no.

## Crear una entrada

Abre `Tools > Beasty VN > Editor`, ve a la pestaña **Dictionary** y pulsa **+ Add Term**.

![Una entrada de diccionario: clave, valor por defecto y la marca de editable por el jugador](/docs-images/beasty-visual-novel/vn-dictionary-entry.png)

| Campo | Qué es |
|---|---|
| **Key** | El nombre del token, escrito sin corchetes: `city`. Lo usas en el texto como `[city]`. |
| **Default value** | El texto que muestra el token hasta que algo lo fija. El mismo en todos los idiomas. |
| **Player editable** | Si está activado, el jugador puede cambiar este término en tiempo de ejecución desde la pantalla de personalización del juego. |

Deja **Player editable** desactivado para un token que fijas tú desde la historia y el jugador nunca toca.

## Usarlo en una línea

Escribe la clave entre corchetes, en cualquier parte del texto de un bloque **Dialogue**:

![Una línea renderizada con el token sustituido por el valor del jugador](/docs-images/beasty-visual-novel/vn-dictionary-ingame.png)

```text
maya "So you're from [city]? I've never been."
```

Lo mismo funciona en cualquier texto que escribas y resuelva tokens, incluido el nombre mostrado de un personaje.

## Fijarlo

Tres formas, según quién decida el valor.

**Tú lo decides.** Usa el bloque **Set dictionary** (categoría de paleta **State**). Elige el token, escribe el
valor. En el guion de texto:

```text
dict city = "Madrid"
```

**El jugador lo decide, en la historia.** Usa el bloque **Ask -> dictionary** (categoría de paleta **Input**).
Es una parada autocontenida: muestra una línea de pregunta — con un hablante opcional, como cualquier línea
de diálogo — y abre el cuadro de entrada en ese mismo momento. Tiene un valor por defecto que se usa si el
jugador deja el cuadro en blanco, y un indicador **required** que, en vez de eso, rechaza la respuesta en blanco.

```text
ask dict city "Where are you from?"
```

**El jugador lo decide, en las opciones.** Activa **Player editable** y el token aparece en la pantalla de
personalización del juego, donde puede fijarlo cuando quiera.

Se fije como se fije, el valor se escribe en el almacén de variables compartido bajo la clave del token, y ahí
queda por encima de tu valor por defecto. Por eso se guarda con la partida y se rebobina con todo lo demás, sin
que tú hayas hecho nada para que pase. Consulta [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/#el-almacén).

## ¿Token de diccionario o variable String?

Viven en el mismo almacén y una condición puede leer cualquiera de los dos. La diferencia está en qué representa
cada uno, y el editor respeta esa intención: los selectores de diccionario solo te ofrecen entradas de
diccionario, y los selectores de variables solo te ofrecen variables.

Usa un **token de diccionario** cuando el valor es **texto que se le muestra de vuelta al jugador**, escrito con
sus propias palabras, y que debe sobrevivir a un cambio de idioma sin traducirse:

- la ciudad de la que viene
- el nombre de su mascota
- el nombre que le dio a su nave

Usa una **variable String** cuando el valor es **estado del juego sobre el que ramificas**:

- `chapter` = `"two"`
- `faction` = `"rebels"` (una variable `Enum`, con sus valores permitidos listados)
- cualquier cosa de la que dependa una elección, una puerta o una misión

Si en algún momento estás escribiendo una condición sobre un token de diccionario, lo que querías era
probablemente una variable. Si estás imprimiendo una variable en una línea y te preocupa que el traductor la
cambie, lo que querías era un token de diccionario.

## Ver también

- [Variables y condiciones](/es/docs/beasty-visual-novel/world/variables-and-conditions/) — el almacén en el que viven ambos
- [Localización](/es/docs/beasty-visual-novel/production/localization/) — qué sí se traduce, y cómo
- [Referencia de bloques](/es/docs/beasty-visual-novel/authoring/blocks-reference/) — los bloques Set dictionary y Ask
- [Sintaxis de .vnbeasty](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/) — `dict` y `ask dict` en el guion de texto
