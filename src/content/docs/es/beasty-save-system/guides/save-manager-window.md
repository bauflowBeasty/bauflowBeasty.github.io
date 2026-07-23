---
title: "La ventana Save Manager"
description: "Tools > Beasty Save System > Save Manager abre la única ventana de editor del paquete: crea el BeastySaveManager de la escena, hace guardables los objetos y muestra los archivos de guardado en disco."
---

`Tools > Beasty Save System > Save Manager` abre la única ventana de editor del paquete. Hace tres
cosas: crea y configura el `BeastySaveManager` de la escena, hace que los objetos sean guardables, y te muestra
los archivos de guardado en disco para que puedas inspeccionarlos, restaurarlos o eliminarlos sin salir de Unity.

La ventana se titula **Beasty Save Manager**. Puedes anclarla donde quieras.

![La ventana Save Manager con las tres secciones](/docs-images/beasty-save-system/save-manager-window.png)

## Manager

La sección superior busca el `BeastySaveManager` en la escena abierta — incluso si está en un objeto inactivo.

![La sección Manager con el inspector del BeastySaveManager embebido](/docs-images/beasty-save-system/save-manager-inspector.png)

**Cuando no hay manager**, aparece un mensaje ("No BeastySaveManager in the open scene.") y un botón:

- **Create Beasty Save Manager** — crea un GameObject llamado `Beasty Save Manager` con el componente en
  él. Es un solo paso deshacible, así que `Ctrl+Z` lo elimina limpiamente. Esta es la forma más rápida de configurar una
  escena nueva, y es donde empieza el camino sin código.

**Cuando hay un manager**, aparece un campo de objeto que apunta a él (haz clic para seleccionarlo en la
Hierarchy) y su inspector completo incrustado debajo.

Ese inspector incrustado es donde editas **Settings** — la carpeta, la extensión, la ruta de datos,
la encriptación, el backup, la carga estricta y la versión de datos usada por `SaveAll` y `LoadAll`. Editarlo aquí es
exactamente lo mismo que seleccionar el manager y editarlo en el Inspector; está aquí para que no tengas que
cambiar tu selección mientras trabajas. Cada campo se explica en [settings.md](/es/docs/beasty-save-system/guides/settings/).

La sección **Slots on Disk** debajo lee las mismas settings, así que cambiar `Folder` aquí cambia inmediatamente
qué archivos lista la ventana.

## Saveables in Scene

La sección del medio se ocupa de qué objetos se guardan.

### La zona de arrastre

Una caja que dice **"Drag GameObjects here to make them saveable"**. Arrastra uno o más objetos desde la
Hierarchy sobre ella y cada uno recibe un componente `BeastySaveable` con un id nuevo. Se puede deshacer.

![La zona de arrastre que convierte en saveables los GameObjects que sueltas en ella](/docs-images/beasty-save-system/save-manager-dropzone.png)

Los objetos que ya tienen un `BeastySaveable` se ignoran, así que puedes arrastrar toda una selección sin
preocuparte por duplicados.

Úsala cuando estés configurando una escena y quieras marcar diez objetos a la vez en lugar de usar
`Add Component` diez veces.

> **Nota**
> La zona de arrastre añade el componente y el id. **No** marca ningún componente por ti. Selecciona cada
> objeto y marca lo que quieras guardar en su lista **Saved Components** — ver más abajo.

### La lista

Debajo de la zona de arrastre se lista cada `BeastySaveable` de la escena abierta, **incluidos los de objetos
inactivos**. Cada fila muestra tres cosas:

![La lista de saveables de la escena, con el número de componentes y los ids](/docs-images/beasty-save-system/save-manager-saveables-list.png)

- El objeto en sí, como un campo de objeto. Haz clic para seleccionar el objeto.
- Cuántos componentes guarda (`2 comp.`).
- Su **id de guardado**.

Esta lista es tu herramienta para auditar la escena. Dos cosas que conviene buscar:

- **Un saveable con `0 comp.`** — está registrado, está en el archivo de guardado, y no almacena nada. Alguien
  añadió el componente y nunca marcó nada.
- **Dos filas con el mismo id** — un duplicado. El segundo objeto no se registra en absoluto y queda fuera
  del guardado (se registra un error cuando la escena se ejecuta). Esto suele venir de copiar y pegar un objeto cuyo
  id fue escrito a mano. Dale a uno de ellos un id diferente. Consulta [scene-state.md](/es/docs/beasty-save-system/guides/scene-state/).

### El inspector de BeastySaveable

Al seleccionar un saveable ves su propio inspector, que vale la pena describir aquí porque es donde ocurre
el trabajo real:

- **Save Id** — el id, editable, con un botón **New** que genera uno nuevo. Cambiar el id deja huérfanos
  los datos ya guardados bajo el anterior.
- **Saved Components** — una lista de verificación de cada componente en el GameObject. Marca los que quieras en el
  guardado. Cada uno se etiqueta con la capa que lo convierte: `core` (siempre disponible), un id de módulo como
  `ugui` o `physics3d`, o `dev` para un convertidor que registraste tú mismo.
- **Una advertencia** cuando marcas un componente que nada puede convertir. Lo dice claramente: `SaveAll` fallará con
  `TypeUnavailable`. Desmárcalo, o lee
  [converter-modules.md](/es/docs/beasty-save-system/reference/converter-modules/).

## Slots on Disk

La sección inferior lista los archivos reales en la carpeta a la que apuntan tus settings. Esta es la parte que mantendrás
abierta mientras pruebas.

![La sección Slots on Disk con los archivos de guardado y su resumen de metadata](/docs-images/beasty-save-system/save-manager-slots.png)

Dos botones en el encabezado:

- **Refresh** — vuelve a leer la carpeta. La ventana no vigila el disco, así que después de guardar desde un
  juego en ejecución, haz clic aquí para ver el archivo nuevo. Nada se cachea entre un refresh y otro.
- **Open Folder** — abre la carpeta de guardado en el explorador de archivos de tu sistema operativo. Esta es la forma fiable
  de encontrar `persistentDataPath` sin tener que buscarlo. Úsala para abrir un archivo de guardado en un editor
  de texto, para copiar uno aparte antes de un experimento, o para enviarle uno a un colega.

Si no hay archivos, la sección lo indica ("No save files in the configured folder."). Si esperabas
archivos y no ves ninguno, comprueba `Folder` y `Extension` en la sección Manager de arriba — la ventana busca
exactamente donde dicen tus settings.

### Cada slot

Cada archivo de guardado tiene su fila:

**El nombre del slot.** El nombre que pasarías a `SaveAll`, `Load` o `Delete`. Sin extensión, sin ruta.

**Un resumen de metadatos.** El diccionario `meta` escrito con el guardado, mostrado como hasta cuatro pares `key: value`
unidos con `·`, y luego `…` si hay más. Este es el propósito de los metadatos: un nombre de capítulo, un
tiempo de juego, un número de nivel, legibles de un vistazo. Los metadatos se quedan en **texto plano incluso en un guardado
encriptado**, así que el resumen funciona esté o no encriptado el archivo, y sin la clave. Consulta
[slots-and-metadata.md](/es/docs/beasty-save-system/guides/slots-and-metadata/).

Si el archivo no se puede leer en absoluto, el resumen se reemplaza por `unreadable:` y el error — `Corrupt`,
`ParseError`, `VersionTooNew`, etcétera. Eso es un diagnóstico, y los códigos de error se explican en
[results-and-errors.md](/es/docs/beasty-save-system/reference/results-and-errors/).

**Restore Backup.** Copia el archivo `.bak` del slot sobre el slot. Pide confirmación primero ("Replace
slot 'x' with its .bak file?"), y está **desactivado cuando no hay `.bak`** — incluso para un slot que
solo se ha guardado una vez, porque el primer guardado de un slot no crea backup.

Úsalo cuando un slot se lea como `unreadable`, o cuando quieras deshacer el último guardado durante las pruebas. El `.bak`
se deja en su lugar después, así que restaurar dos veces es seguro. [backups-and-corruption.md](/es/docs/beasty-save-system/guides/backups-and-corruption/)
explica qué es un `.bak` y cuándo aparece uno.

**Delete.** Elimina el archivo de guardado **y su backup**. Pide confirmación ("Delete save file 'x' (and
its backup)?"). No hay deshacer — son archivos en disco, no assets en tu proyecto.

Úsalo para volver a un estado limpio entre pruebas. Si quieres conservar el archivo, usa **Open Folder** y
muévelo a otra carpeta.

## Ver también

- [save-without-code.md](/es/docs/beasty-save-system/getting-started/save-without-code/) — la ventana en uso, desde una escena vacía
- [scene-state.md](/es/docs/beasty-save-system/guides/scene-state/) — ids, objetos generados en tiempo de ejecución, y qué escribe realmente `SaveAll`
- [settings.md](/es/docs/beasty-save-system/guides/settings/) — cada campo en la sección Manager
- [backups-and-corruption.md](/es/docs/beasty-save-system/guides/backups-and-corruption/) — el archivo `.bak` y Restore Backup
- [slots-and-metadata.md](/es/docs/beasty-save-system/guides/slots-and-metadata/) — los metadatos detrás de los resúmenes de slot
- [components.md](/es/docs/beasty-save-system/reference/components/) — `BeastySaveable` y `BeastySaveManager`, campo por campo
