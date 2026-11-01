---
title: "Pantallas de teléfono"
description: "Un smartphone ya hecho, con apps, y versiones de teléfono de las pantallas de menú, inventario y personajes, editables como cualquier otra pantalla."
---

El teléfono es una superposición ya hecha con forma de smartphone: un reloj, una grilla de apps, una barra de
inicio. Cada app es un elemento de pantalla normal, así que cambias, añades y quitas apps en la sección
[Screens](/es/docs/beasty-visual-novel/world/screens-and-hud/) como cualquier otra cosa. Las versiones de
teléfono de las pantallas de menú, inventario y personajes se abren dentro del mismo cuerpo de teléfono.

![El teléfono ya hecho en Play: el reloj y la fecha arriba, la grilla de apps y el dock](/docs-images/beasty-visual-novel/vn-phone-home.png)

## Crear el teléfono

En la sección Screens, elige **+ New screen ▸ Phone**. Beasty:

- copia `Prefabs/Phone.prefab` en tu carpeta de Screens;
- lo registra como pantalla secundaria en los dos modos, colocada bajo `VN_Canvas`;
- si tienes una pantalla de HUD primaria, le añade un botón **Phone** que abre el teléfono.

## Qué hay en el teléfono

- Una **barra de estado** con la hora y un icono de batería.
- Un **reloj grande con la fecha**, a partir de `@time:clock.label` y `@time:weekday.label`.
- Una **grilla de apps** con scroll que se ajusta al ancho del teléfono, un **dock** y una **barra de inicio**
  que funciona como Back.

Las apps que trae:

| App | Qué hace |
|---|---|
| **People** | Abre la lista de personajes del teléfono. Si el proyecto no tiene, la crea, con su perfil. |
| **Hints** | Activa y desactiva las [pistas de la guía](/es/docs/beasty-visual-novel/world/notifications-and-walkthrough/). Se oculta si el proyecto tiene la guía apagada; su icono sale tachado mientras las pistas están desactivadas. |
| **Music** | Silencia y recupera la música. Su icono sale tachado mientras está en silencio. |
| **Settings** | Abre el menú de juego en Preferencias. El teléfono se queda debajo. |
| **Save** | Abre el menú de juego en Guardar/Cargar. El teléfono se queda debajo. |
| Notes, Camera, Messages, Weather, Calls | Decoración, lista para que le des una función. |

Las etiquetas de las apps vienen en todos los idiomas que los textos de UI de serie tienen para ellas
(Settings, Save, Music…). Las demás vienen en inglés y español (People, Hints, Notes). Tradúcelas en
**Localization › Game UI**, como cualquier texto de pantalla.

**+ Button** dentro del teléfono añade una app con el mismo aspecto que las demás: una copia del `ItemTemplate`
de la grilla.

## Apps de teléfono

El menú **+ New screen** tiene versiones de teléfono de las plantillas de pantalla:

| Entrada | Qué crea |
|---|---|
| **Secondary ▸ Phone app** | Una app vacía. |
| **Menu ▸ Phone grid** / **Phone list** | Un menú de botones dentro del teléfono. |
| **Inventory ▸ Phone** | El inventario dentro del teléfono. |
| **Characters ▸ Phone** | La lista People y el perfil del personaje. |

Cada app de teléfono muestra el cuerpo del teléfono con barra de estado, un título con flecha de volver y una
barra de inicio; tanto la flecha como la barra vuelven atrás. Se registra como pantalla secundaria en los dos
modos y se coloca bajo `VN_Canvas`.

- Las pantallas People se titulan "People" (en español, "Personas").
- El inventario se titula "Inventory", rellenado en todos los idiomas de la tabla de textos del juego a partir
  de los textos de UI de serie. Se cambia en la pestaña Game UI como cualquier otro texto de pantalla.
- Los menús y la app vacía toman el nombre de la pantalla al crearse. Renombrar la pantalla después no cambia
  el título; edita el elemento Title.
- En el inventario del teléfono, una descripción larga termina en "...", para que el nombre del ítem y los
  botones **Cancel** / **Use** se queden dentro de la pantalla del teléfono.

### Una app se abre justo encima de tu teléfono

Una app nueva copia el cuerpo de tu teléfono: su tamaño y posición (también si lo moviste a mano), el margen
de la pantalla, el sprite del marco y del fondo con su color y su troceado, y el color de fondo. Copia el
primer teléfono de Screens, o el del paquete si no hay ninguno. Cambiar el teléfono después no actualiza las
apps que ya existen.

Crear una app de teléfono es un paso de Ctrl+Z. Deshacer deja los prefabs copiados en tu carpeta de Screens.

## Para programadores

El componente `PhoneAppScreen` marca un prefab de pantalla como la versión de teléfono de una plantilla.

## Ver también

- [Pantallas y HUD](/es/docs/beasty-visual-novel/world/screens-and-hud/) — elementos, acciones y la pila
  secundaria.
- [Pantallas de personaje](/es/docs/beasty-visual-novel/world/character-screens/) — la lista de personajes y
  el perfil.
- [Objetos e inventario](/es/docs/beasty-visual-novel/world/items-and-inventory/) — la pantalla de
  inventario.
- [Localización](/es/docs/beasty-visual-novel/production/localization/#la-pestaña-game-ui) — traducir las
  etiquetas de las apps.
- [House Demo](/es/docs/beasty-visual-novel/getting-started/house-demo/) — el teléfono del HUD con People,
  Hints, Music, Settings y Save.
