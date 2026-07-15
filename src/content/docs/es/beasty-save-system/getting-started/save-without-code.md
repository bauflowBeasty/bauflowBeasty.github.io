---
title: "Guardar sin escribir código"
description: "Esta página te lleva desde una escena vacía hasta un guardado y una carga funcionando sin una sola línea de C#: dos componentes, unas casillas marcadas y dos botones conectados."
---

Esta página te lleva desde una escena vacía hasta un guardado y una carga funcionando sin una sola línea de C#. Vas a
añadir dos componentes, marcar algunas casillas, y conectar dos botones. Síguela en orden y funciona.

Diez minutos. Nada aquí es desechable — esta es la forma real de hacerlo, no una demo de juguete.

## Qué vas a construir

Un cubo que puedes mover. Un botón **Save** que escribe su posición en un archivo en disco. Un botón **Load**
que lo devuelve a donde estaba, incluso después de detener el juego y volver a iniciarlo.

Una vez que eso funcione, todo lo demás en el paquete es una variación de lo mismo.

## 1. Crea una escena con algo dentro

Abre una escena nueva. Añade un cubo: `GameObject > 3D Object > Cube`. Muévelo a un lugar que reconozcas.

Ese cubo es el objeto cuyo estado quieres conservar. En tu juego real será el jugador, una puerta, un
cofre — pero los pasos son idénticos.

## 2. Añade el Save Manager

El Save Manager es la pieza que hace el guardado real. Hay uno por escena.

Abre `Tools > Beasty Save System > Save Manager`. La ventana se abre con una sección **Manager** arriba.
Como tu escena todavía no tiene un manager, muestra un mensaje y un botón: **Create Beasty Save Manager**.

Púlsalo. Aparece un GameObject llamado `Beasty Save Manager` en tu escena.

![La ventana Save Manager con el botón Create Beasty Save Manager](/docs-images/beasty-save-system/save-manager-window-empty.png)

> **Nota**
> También puedes hacerlo a mano: crea un GameObject vacío y usa
> `Add Component > Beasty > Beasty Save Manager`. Mismo resultado. La ventana es más rápida.

Selecciona el nuevo objeto y mira su inspector. Tiene un campo, **Settings**, y dentro están las
opciones sobre dónde y cómo se escriben los guardados — carpeta, extensión, encriptación, backup, carga estricta,
versión de datos. Déjalos todos como están por ahora. Los valores por defecto son los correctos. Cuando tengas
curiosidad, [settings.md](/es/docs/beasty-save-system/guides/settings/) los explica todos.

## 3. Haz que el cubo sea guardable

Selecciona el cubo. Usa `Add Component > Beasty > Beasty Saveable`.

El componente aparece con dos cosas:

- **Save Id** — un string de caracteres generado automáticamente, con un botón **New** al lado. Así es como el
  archivo de guardado reconoce este objeto en particular. No lo toques. (Importa más adelante; mira el paso 9).
- **Saved Components** — una lista de verificación de cada componente en el cubo. Nada está marcado todavía.

Marca **Transform**.

![El inspector de Beasty Saveable con el componente Transform marcado](/docs-images/beasty-save-system/save-saveable-inspector.png)

Esa es toda la configuración. Le has dicho al sistema: cuando haya un guardado, anota el Transform de este
objeto — su posición, su rotación, su escala.

Fíjate en la etiqueta junto a cada componente en la lista. Dice `core`, o `ugui`, o `animation`. Esa etiqueta
indica qué capa sabe guardarlo. Si en lugar de etiqueta un componente muestra una advertencia, el sistema no tiene
forma de guardar ese tipo y el guardado fallaría; desmárcalo, y lee
[converter-modules.md](/es/docs/beasty-save-system/reference/converter-modules/) para saber por qué.

> **Nota**
> Hay una forma más rápida de hacer esto para muchos objetos a la vez. La ventana Save Manager tiene una zona de
> arrastre — "Drag GameObjects here to make them saveable". Arrastra objetos sobre ella y cada uno obtiene un `BeastySaveable`
> con un id nuevo. Aun así tienes que marcar los componentes que quieras en cada uno.

## 4. Añade un botón Save

Crea un botón uGUI: `GameObject > UI > Button - TextMeshPro`. (Unity añadirá un Canvas y un
EventSystem por ti si la escena no tiene ninguno. Déjalo.)

Renombra el texto del botón a `Save`.

## 5. Conecta el botón Save

Selecciona el botón y busca la lista **On Click ()** al final de su inspector.

1. Pulsa el **+** para añadir una entrada.
2. Arrastra el objeto **Beasty Save Manager** desde la Hierarchy al campo de objeto que dice `None
   (Object)`.
3. Abre el desplegable de función. Elige **BeastySaveManager > SaveAll (string)**.
4. Aparece un pequeño campo de texto debajo. Escribe un nombre de slot en él: `slot1`.

![Un OnClick de Button uGUI conectado a BeastySaveManager.SaveAll con el nombre de slot slot1](/docs-images/beasty-save-system/save-button-onclick.png)

Esa es toda la conexión. `SaveAll` recoge cada objeto guardable en la escena, escribe los componentes que
marcaste, y los pone todos en un archivo llamado `slot1`.

El nombre del slot es solo el nombre del archivo. `slot1`, `autosave`, `quicksave` — lo que escribas. Algunos
nombres se rechazan (cualquiera con una barra, cualquiera con `..`, y los viejos nombres de dispositivo de Windows
como `CON` o `PRN`); las razones están en [settings.md](/es/docs/beasty-save-system/guides/settings/).

## 6. Añade un botón Load

Repite los pasos 4 y 5, con dos cambios: llama al botón `Load`, y elige **BeastySaveManager > LoadAll
(string)** en el desplegable. Escribe el mismo nombre de slot, `slot1`.

Los dos nombres de slot deben coincidir. `SaveAll("slot1")` escribe el archivo; `LoadAll("slot1")` lo vuelve a leer. Si
escribes `slot1` en un botón y `Slot1` en el otro, nada cargará y perderás veinte minutos
preguntándote por qué.

## 7. Pruébalo

Pulsa **Play**.

1. Mueve el cubo en la vista Scene mientras el juego se ejecuta. Arrástralo a algún lugar obviamente distinto.
2. Pulsa **Save**.
3. Mueve el cubo otra vez, a otro lugar completamente distinto.
4. Pulsa **Load**. El cubo vuelve exactamente a donde estaba cuando lo guardaste.

Ahora la prueba real — la que demuestra que se escribió un archivo:

5. Pulsa **Play** de nuevo para detener. El cubo vuelve a su posición del editor.
6. Pulsa **Play** de nuevo para iniciar.
7. Pulsa **Load**. El cubo vuelve a donde lo guardaste.

Ese estado sobrevivió a parar y reiniciar el juego porque está en disco, no en memoria. Tienes un sistema de guardado.

## 8. Dónde está realmente el archivo

Vuelve a la ventana Save Manager (`Tools > Beasty Save System > Save Manager`) y desplázate hasta **Slots on
Disk**. Pulsa **Refresh**. Tu slot aparece listado. Pulsa **Open Folder** y tu explorador de archivos se abre
justo en esa carpeta.

El archivo es `slot1.save`. Su ruta completa es `<persistentDataPath>/Saves/slot1.save`, donde
`persistentDataPath` es la carpeta de escritura por usuario de Unity — en Windows está bajo
`AppData\LocalLow\<tu empresa>\<tu producto>`. La carpeta `Saves` y la extensión `save` son las configuraciones
`Folder` y `Extension` en el manager; cámbialas y el archivo se mueve.

Abre `slot1.save` en cualquier editor de texto. Es JSON plano, indentado, y puedes leerlo:

```json
{
  "beasty": 2,
  "dataVersion": 1,
  "type": "Beasty.SaveGroup",
  "checksum": "…",
  "data": {
    "saveables": {
      "…the cube's save id…": {
        "UnityEngine.Transform": { "module": "core", "data": { } }
      }
    }
  }
}
```

Poder leer tu propio archivo de guardado es una característica, no un descuido. Cuando algo no vuelve como
esperabas, abre el archivo y míralo. La respuesta suele estar ahí mismo.

Si prefieres que los jugadores no puedan leerlo, activa **Encrypted** en la configuración del manager — pero lee
[encryption.md](/es/docs/beasty-save-system/guides/encryption/) primero, porque explica con honestidad qué te da la
encriptación aquí y qué no.

Guarda de nuevo desde el juego y notarás que aparece un segundo archivo: `slot1.save.bak`. Ese es el guardado
anterior, conservado automáticamente. Si un archivo de guardado se estropea alguna vez, el botón **Restore Backup**
de la ventana Save Manager devuelve el antiguo. Consulta [backups-and-corruption.md](/es/docs/beasty-save-system/guides/backups-and-corruption/).

## 9. Las dos cosas que te van a dar problemas

Todo lo anterior funciona. Estos dos puntos son donde la gente pierde una tarde, así que léelos ahora y no
después.

### Un objeto creado mientras el juego corre necesita un id que tú elijas

El Save Id de tu cubo se generó una vez, en el editor, y está almacenado en la escena. Es el mismo
id cada vez que juegas. Por eso el guardado puede volver a encontrar el cubo.

Un objeto que generas en tiempo de ejecución — un enemigo, un objeto dropeado, una bala — no tiene una escena que
lo recuerde. Cada copia que creas con `Instantiate` recibe un **id completamente nuevo, cada vez**. Así que su
estado se escribe en el archivo de guardado bajo un id que nunca volverá a existir, y nunca vuelve.

La solución es darle al objeto generado un id que tú controles, usando
`BeastySaveManager.Register(gameObject, "a.stable.id", components)`. Eso es una línea de C#, y si no
escribes C# es la única línea que necesitarás pedirle a alguien.

La explicación completa, y cómo elegir ids que se mantengan estables, está en
[scene-state.md](/es/docs/beasty-save-system/guides/scene-state/). Léela antes de construir cualquier cosa que genere objetos.

### Una referencia a un sprite o a otro objeto no se guarda

Beasty Save System no guarda referencias a objetos de Unity. Si tu script tiene un campo apuntando a un
`Sprite`, un `GameObject`, un `AudioClip` u otro componente, ese campo se omite al guardar y se deja
intacto al cargar.

Esto es deliberado, y la mayoría de las veces es una buena noticia: **la conexión que hiciste en la escena
sobrevive**. Cargar un guardado no borra tus referencias, no rompe tus enlaces de prefab ni pierde el sprite
que arrastraste. Todo lo que configuraste en el inspector sigue ahí después de una carga.

Lo que sí significa es que si la *identidad* del sprite es parte del estado de tu juego — el jugador eligió un
sombrero rojo, y ese dato debe persistir — no puedes guardar el `Sprite` en sí. Guardas algo que
lo identifica (un nombre, un id, un índice) y recuperas el sprite a partir de eso al cargar.

Las reglas completas, y qué hacer en su lugar, están en [what-gets-saved.md](/es/docs/beasty-save-system/guides/what-gets-saved/). Esa es
la página más importante de este paquete. Léela a continuación.

## Ver también

- [what-gets-saved.md](/es/docs/beasty-save-system/guides/what-gets-saved/) — qué se guarda y recupera correctamente y qué no
- [scene-state.md](/es/docs/beasty-save-system/guides/scene-state/) — ids, objetos generados en tiempo de ejecución, y el manager en profundidad
- [save-manager-window.md](/es/docs/beasty-save-system/guides/save-manager-window/) — cada botón en la ventana del editor
- [settings.md](/es/docs/beasty-save-system/guides/settings/) — carpeta, extensión, encriptación, backup, estricto, versión
- [slots-and-metadata.md](/es/docs/beasty-save-system/guides/slots-and-metadata/) — convertir slots en una pantalla real de slots de guardado
- [save-with-code.md](/es/docs/beasty-save-system/getting-started/save-with-code/) — el mismo sistema, desde un script
