---
title: "Misiones"
description: "El catálogo de misiones: qué se supone que debe hacer el jugador, cómo compruebas que lo hizo y qué obtiene por ello. Para guionistas y diseñadores."
---

El catálogo de misiones: qué se supone que debe hacer el jugador, cómo compruebas que lo hizo, y qué obtiene por
ello. Esta página es para guionistas y diseñadores.

Autoras misiones en la ventana Beasty VN (`Tools > Beasty VN > Editor`), pestaña **Characters**, subpestaña
**Quests**. La lista de la izquierda se filtra por **Owner** y se agrupa por tipo o recurrencia; el editor de la
derecha es la misión seleccionada. **+ Quest** añade una. El catálogo en sí es un asset `QuestCatalog`, creado y
conectado a tu contexto compartido la primera vez que abres la pestaña.

## Una misión

![La sub-pestaña Quests: la lista de misiones y los campos de la seleccionada](/docs-images/beasty-visual-novel/vn-quest-editor.png)

| Campo | Qué es |
|---|---|
| **Id** | El id estable. Los bloques y las condiciones nombran la misión por él. Editable; al renombrarlo se actualiza todo lo que lo referenciaba. |
| **Title** | Lo que ve el jugador en el registro de misiones. |
| **Description** | El texto más largo. |
| **Owner** | El personaje al que pertenece esta misión. **Déjalo vacío para una misión global, de la historia principal.** |
| **Category** | `Main` o `Side`. |
| **Order mode** | `Ordered` o `Free`. Consulta [Etapas](#etapas-y-qué-significa-ordenado). |
| **Recurrence** | `Once`, `Daily`, `Weekly` o `SpecificDays`. Consulta [Misiones recurrentes](#misiones-recurrentes). |
| **Completion threshold** | Cuántos objetivos requeridos cuentan como hechos. **0 = todos ellos.** |
| **Starts when** | La condición que activa la misión. **Vacío = activa desde el principio.** |
| **Fails when** | Opcional. Mientras la misión está activa, si esto se cumple, la misión falla. |
| **Reward on completion** | Efectos de variable aplicados una vez, cuando la misión se completa. |
| **Penalty on failure** | Efectos de variable aplicados una vez, cuando la misión falla. |
| **Objectives** | Los pasos. Ver más abajo. |

El propietario es lo que hace que una misión aparezca en el perfil de ese personaje. Una misión con propietario es
"el encargo de Maya"; una misión sin propietario es "la historia principal".

### Estados

Una misión está siempre en exactamente uno de cuatro estados, y el estado es una variable ordinaria
(`@quest:<id>:@state`), así que puedes leerlo en cualquier condición:

| Estado | Significado |
|---|---|
| `notstarted` | Esperando **Starts when**. |
| `active` | En curso. |
| `completed` | Hecha. Se ha pagado la recompensa. |
| `failed` | Perdida. Se ha pagado la penalización. |

No tienes que manejar el estado a mano. **Starts when** la activa; los objetivos la completan. Pero puedes
manejarlo desde una escena cuando la historia lo requiera, con el bloque **Update quest** (categoría de paleta
**Quests**): fija el estado, fija la etapa, avanza la etapa, o marca un objetivo como hecho. Llegar a `completed`
o `failed` de esa forma sigue pagando la recompensa o la penalización, exactamente una vez.

No hay un botón de "iniciar misión" que recordar: **un inicio manual se define como una condición.** Fija una variable en
la escena donde el jugador acepta el encargo, y haz que esa variable sea el **Starts when** de la misión.

### Recompensas y penalizaciones

Ambas son listas de efectos de variable: `gold += 50`, `maya.affection += 1`, `item.bread = 3`. Dar objetos es
un efecto sobre el contador del objeto. Cada una se **traba (latch)** — se dispara una sola vez, sin
importar cuántas veces se recalcule la misión.

## Etapas, y qué significa "ordenado"

En una misión **Ordered** los objetivos se desbloquean de arriba a abajo. **El objetivo actual es el que está en el
índice de la etapa** — el primer objetivo que aún no está hecho. La etapa se publica como `@quest:<id>:@stage`, así que una
condición puede preguntar "¿ya está el jugador en el paso 2?".

![La lista de objetivos de una misión Ordered, con la etapa actual resaltada](/docs-images/beasty-visual-novel/vn-quest-stages.png)

El bloqueo por orden solo espera a los objetivos **requeridos**. Un objetivo opcional que el jugador se saltó no
bloquea el resto de la misión para siempre.

En una misión **Free** no hay etapa: todos los objetivos están abiertos desde el momento en que la misión se activa, y
el jugador puede hacerlos en cualquier orden.

Puedes mover la etapa tú mismo con el bloque **Update quest** — **Set stage** para saltar a un paso, **Advance
stage** para sumar uno. Así es como una conversación empuja una misión hacia adelante sin que el jugador tenga que
activar una condición:

```text
[Dialogue]      Maya: "Good. Now take this to the miller."
[Update quest]  quest = bread_run, action = AdvanceStage, stage = 1
```

En el guion de texto:

```text
quest bread_run stage += 1
quest bread_run state = completed
quest bread_run objective run = true
```

## Objetivos

![Un objetivo, con su desplegable de tipo abierto mostrando los ocho tipos](/docs-images/beasty-visual-novel/vn-quest-objective.png)

| Campo | Qué es |
|---|---|
| **Id** | Estable dentro de la misión. |
| **Description** | El "qué hacer" en una línea; se muestra en el registro de misiones y sirve de etiqueta en el menú de conversación. |
| **Hint** | El texto de guía que muestra el registro de misiones. Consulta [La pista](#la-pista). |
| **Type** | Uno de los ocho de abajo. |
| **Required** | Desactivado = opcional. Los objetivos opcionales no bloquean la finalización. |

### Los ocho tipos de objetivo

Cada tipo es una plantilla que escribe por debajo una **condición de finalización**. La condición sigue siendo la
fuente de verdad; el tipo te da los selectores adecuados en lugar de claves en bruto. **Todos se traducen en
una condición de finalización excepto GatherDeliver**, que se completa entregando los objetos.

| Tipo | Úsalo cuando | Qué pide |
|---|---|---|
| **InteractObject** | El jugador debe clicar una cosa específica. | Una variable de bandera que la escena del objeto fija. Hecho cuando la bandera es verdadera. |
| **TalkTo** | El jugador debe ir a hablar con alguien. | Nada más que su **paso de conversación** de abajo. Se completa cuando esa conversación termina (**Complete on talk** está activado por defecto para este tipo). |
| **AcquireItem** | El jugador debe tener algo en su poder. | Un objeto y un contador. Hecho cuando el inventario contiene esa cantidad. |
| **InteractMany** | El jugador debe hacer lo mismo N veces. | Una variable contador y un número. Hecho cuando el contador lo alcanza. La escena que hace la acción incrementa el contador con un bloque Set variable. |
| **GatherDeliver** | El jugador debe conseguir cosas y entregarlas. | Los objetos y los contadores. **No** es una condición — ver más abajo. |
| **SubQuest** | Este paso es toda otra misión. | Una misión. Hecho cuando esa misión está `completed`. |
| **Condition** | Nada de lo anterior encaja. | La condición en bruto, la que quieras. La vía de escape. |
| **WaitTime** | El jugador tiene que dejar pasar el tiempo. | **Wait days** y/o **Wait dayparts**, contados desde el momento en que se desbloqueó el objetivo. Ambos deben transcurrir. |

> **Nota**
> **WaitTime con ambos valores en 0 se completa de inmediato.** El editor te avisa.

Si escribes a mano una condición que no coincide con la plantilla del tipo, el editor la muestra tal cual con un
botón **Rewrite from the type's pickers** en lugar de sobrescribir tu trabajo.

### GatherDeliver: la que no es una condición

Un objetivo **GatherDeliver** no se completa con una condición — se completa **entregando los objetos**.
Tenerlos no basta; el jugador tiene que dárselos a alguien.

- **Items to deliver** — una lista de objeto y cantidad.
- **Any-of total** — si es mayor que 0, exige esa cantidad de objetos en **total** de entre los ids listados, e
  ignora los contadores individuales. "Tráeme cinco hierbas, las que sean."
- **Delivery timing** — cuándo se hace efectiva la entrega:

| Timing | Qué ocurre |
|---|---|
| `OnPick` | Los objetos se consumen en el instante en que se elige la entrada del menú, así que el diálogo que sigue ya ve el objetivo hecho. |
| `OnBranchEnd` | El diálogo se reproduce primero; la entrega se hace efectiva cuando termina la rama. |
| `DialogueBlock` | Nada automático. Pones un bloque **Deliver items** dentro del diálogo, justo donde el personaje toma la cesta. |

La entrega en sí ocurre desde el [menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/) del personaje — aparece una entrada ahí
automáticamente, pero **solo cuando el jugador realmente tiene los objetos** — o desde un bloque **Deliver items**
dentro de una escena.

> **Advertencia**
> El bloque **Deliver items** no hace nada, en silencio, si el jugador no tiene los objetos. No es un
> error y no detiene la escena. Protege la rama que lo contiene con una condición sobre el inventario, o
> deja que el menú de conversación haga ese filtrado por ti.

### La pista

La **Hint** es el texto de guía: "El molinero trabaja el turno de mañana, y no abre los domingos."
El registro de misiones del juego la muestra, y **en una misión ordenada solo se revela la pista del objetivo actual** — así que
un registro de misiones es un sistema de pistas, no un spoiler. Consulta [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/).

### El paso de conversación

Un objetivo puede ser algo que le dices a alguien. Abre **Talk step (character menu)** en el objetivo:

![La sección Talk step de un objetivo](/docs-images/beasty-visual-novel/vn-quest-talk-step.png)

| Campo | Qué es |
|---|---|
| **Talks to** | A quién. Vacío = el propietario de la misión. |
| **Dialogue** | La escena que se ofrece desde el menú de conversación de ese personaje mientras este paso es el actual. |
| **Node** | Qué nodo de ella. |
| **Menu label (optional)** | La etiqueta en el menú. Vacío = la descripción del objetivo, o el título de la misión. |
| **Complete on talk** | Marca este objetivo como hecho cuando termina la rama. |

**Los pasos de conversación de una misión se insertan automáticamente en el menú de conversación de ese personaje** — nunca
mantienes un menú. Consulta [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/), que trata esa idea en detalle.

### El marcador de mapa

Cuando un paso mueve a un personaje (ver más abajo), puedes decidir qué aspecto tiene en la sala a la que
lo moviste:

![El marcador de mapa de un paso de misión: sprite, posición, escala y orden de dibujo](/docs-images/beasty-visual-novel/vn-quest-marker.png)

- **Marker sprite** — el arte. Fijar uno aquí hace que gane sobre todo lo demás.
- **Conditional marker sprites** — una lista ordenada; **gana el primer caso cuya condición se cumpla**, si no, el
  sprite por defecto. Una pose distinta por momento del día, o por variable.
- **Position**, **Scale**, **Sorting order** — en qué punto de la sala, qué tamaño tiene y qué tan al frente se
  dibuja. Sorting order 0 significa "justo encima del fondo de la sala".

Deja el sprite vacío y el marcador usa lo visual propio de la rutina y, si no lo hay, un punto de personaje en la
sala con el sprite de mundo libre del personaje.

### La anulación de rutina

Mientras la misión está **activa** y este paso es **el actual**, el paso puede **mover a su personaje de conversación a
otra sala**, anulando su rutina por completo.

![Mover al personaje mientras es el paso actual: el paso de misión que anula una rutina](/docs-images/beasty-visual-novel/vn-quest-routine-override.png)

| Campo | Qué es |
|---|---|
| **Move character while current** | Activa la anulación. |
| **Room** | Adónde va. |
| **Days** | Lista de casillas de días de la semana. Vacía = todos los días. |
| **Dayparts** | Lista de casillas de momentos del día. Vacía = todos los momentos del día. |

La variable `location` del personaje sigue la anulación, así que toda condición del juego coincide con lo que
puede ver el jugador. Si varios pasos podrían mover al mismo personaje, **gana el primer paso que coincida** (orden
del catálogo). Cuando el paso termina, o la misión acaba, el personaje vuelve a su rutina.

Así es como funciona "encuéntrame en los muelles a medianoche" sin una sola línea de scripting. Consulta
[Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/).

## Finalización

Una misión se completa cuando **hay suficientes objetivos requeridos hechos**:

- **Completion threshold 0** (el valor por defecto) significa *todos* los objetivos requeridos.
- Un umbral de N significa *al menos N* de ellos — "limpia 3 de las 4 salas, las que sean".
- Si **ningún** objetivo está marcado como requerido, el umbral se mide entonces contra **todos** los
  objetivos: cada uno de ellos con umbral 0, o al menos N. Una misión con solo objetivos opcionales no es
  dinero gratis.

Cuando se completa, la recompensa se dispara una vez. Cuando **Fails when** se cumple mientras está activa, la misión falla y
la penalización se dispara una vez.

## Misiones recurrentes

`Once` es una misión normal de un solo uso. Las otras tres se repiten.

| Recurrence | El periodo |
|---|---|
| `Daily` | Un periodo por día de juego. |
| `Weekly` | Un periodo por semana de juego. Una semana dura tanto como tu lista de días de la semana (7 si no tienes ninguna). |
| `SpecificDays` | Como Daily, pero la misión solo se ejecuta en los días de la semana que marques. |

El periodo se deriva del día de juego, así que necesita [tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/) y solo se mueve
cuando avanzas el tiempo.

**Qué pasa en una renovación.** Cuando empieza un nuevo periodo, el periodo que acaba de terminar se liquida primero:

- si la misión estaba `completed`, su resultado se registra como `completed`;
- si estaba activa y no completada, **se paga la penalización** y su resultado se registra como `failed`;
- una misión que nunca empezó no tiene nada que liquidar — simplemente sigue esperando su **Starts when**.

Luego la misión se reinicia para el nuevo periodo: se limpia cada objetivo, la etapa vuelve a 0, y las trabas de
recompensa y penalización se liberan para que puedan dispararse de nuevo. Una misión `Daily`/`Weekly` se reactiva
de inmediato; una misión `SpecificDays` solo se rearma en uno de sus días de la semana programados y permanece
inactiva el resto.

El resultado del último periodo liquidado se puede leer como `@quest:<id>:@lastResult` (`completed` o `failed`), que
es lo que compruebas cuando la consecuencia llega a la mañana siguiente: "No entregaste ayer. Mi prima se
va a enterar de esto."

> **Advertencia**
> Una misión `SpecificDays` **sin ningún día marcado nunca se ejecuta**. El editor te avisa. También necesita días de la semana en
> tu Time Config para tener algo que marcar.

## Ejemplo trabajado: cinco manzanas para Ana, cada día

**Objetivo.** Cada día, el jugador debe traerle a Ana cinco manzanas. Ella da 20 monedas de recompensa. Si el día
termina sin la entrega, su afecto baja un poco.

**Antes de empezar**, asegúrate de tener: un Time Config en el BeastyManager con momentos del día y días de la semana
([tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/)), un objeto `apple` ([objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/)), un personaje
`ana` con una rutina para que esté en algún sitio donde el jugador pueda encontrarla
([rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/)), y una variable `gold`.

**1. Crea la misión.** Pestaña `Characters`, subpestaña `Quests`, **+ Quest**.

| Campo | Valor |
|---|---|
| Id | `ana_apples` |
| Title | `Apples for Ana` |
| Description | `Ana needs five apples every day for the pies.` |
| Owner | `ana` |
| Category | `Side` |
| Order mode | `Ordered` |
| Recurrence | `Daily` |
| Completion threshold | `0` (todos los objetivos requeridos) |
| Starts when | *(vacío — disponible desde el principio)* |
| Fails when | *(vacío — la renovación diaria gestiona el fallo)* |
| Reward on completion | `gold` Add `20` |
| Penalty on failure | `ana.affection` Subtract `1` |

**2. Añade el objetivo.** **+ Objective**.

| Campo | Valor |
|---|---|
| Id | `deliver_apples` |
| Description | `Bring Ana five apples` |
| Hint | `Ana is at the bakery in the morning. Apples grow in the orchard.` |
| Type | `GatherDeliver` |
| Required | activado |
| Items to deliver | `apple` x `5` |
| Any-of total | `0` |
| Delivery timing | `OnPick` |

**3. Dale una conversación.** Abre **Talk step (character menu)** en el objetivo:

| Campo | Valor |
|---|---|
| Talks to | *(vacío — Ana, la propietaria de la misión)* |
| Dialogue | `Ana_Delivery` (una escena pequeña: ella toma la cesta y agradece al jugador) |
| Node | su nodo de entrada |
| Menu label | *(vacío — se usa la descripción del objetivo)* |

**4. Esa es toda la misión.** Ahora juégala.

- El jugador recoge manzanas en el huerto hasta que el inventario tiene cinco.
- Entra en la panadería y clica a Ana. Se abre su [menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/) — y como el jugador ahora
  tiene cinco manzanas, ha aparecido una nueva entrada arriba del todo: **"Bring Ana five apples"**. No estaba ahí esta
  mañana, y tú no la añadiste.
- La elige. Como el timing de entrega es `OnPick`, las manzanas desaparecen del inventario antes de que se reproduzca la
  primera línea, así que `Ana_Delivery` ya puede decir "son perfectas".
- La rama termina. El objetivo está hecho, así que la misión queda `completed`: `gold` sube en 20, una vez.
- El jugador se duerme. El bloque **Advance time** de la escena de sueño hace avanzar el día. La misión se reinicia: el
  objetivo se limpia, la traba de recompensa se libera, y vuelve a estar activa. La entrada del menú de conversación desaparece hasta que
  el jugador vuelve a llevar cinco manzanas.
- Si el jugador se duerme **sin** entregar, la renovación liquida el periodo anterior como `failed`:
  `ana.affection` baja en uno, y `@quest:ana_apples:@lastResult` es `failed` — algo que puedes leer en la
  siguiente conversación de Ana para que lo mencione.

**Variaciones que vale la pena conocer.**

- Hazla **Weekly** y se convierte en un encargo fijo que se liquida cada semana.
- Hazla **SpecificDays** y marca martes y viernes, y Ana solo querrá manzanas en días de mercado.
- Pon **Any-of total** en 5 y lista `apple`, `pear`, `plum`, y servirán cinco frutas cualesquiera de esas.
- Pon **Delivery timing** en `DialogueBlock` y coloca un bloque **Deliver items** a mitad de `Ana_Delivery`,
  y la cesta cambia de manos en la línea exacta en que ella se estira para tomarla.

## Ver también

- [El menú de conversación](/es/docs/beasty-visual-novel/world/talk-menu/) — dónde aparecen automáticamente los pasos de conversación de una misión.
- [Objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/) — objetos, contadores, el bloque Deliver items.
- [Rutinas de personajes](/es/docs/beasty-visual-novel/world/character-routines/) — anulaciones de rutina por misión.
- [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) — el registro de misiones dentro del juego y sus pistas.
- [Tiempo de juego](/es/docs/beasty-visual-novel/world/game-time/) — el contador de días que impulsa la recurrencia.
- [API de gameplay](/es/docs/beasty-visual-novel/scripting/gameplay-apis/) — `BeastyQuests` para programadores.
