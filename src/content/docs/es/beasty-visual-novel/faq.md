---
title: "Preguntas frecuentes"
description: "Respuestas cortas, con un enlace a la página donde está la explicación completa."
---

Respuestas cortas, con un enlace a la página donde está la explicación completa.

## ¿Necesito saber programar?

No. Todo el proceso de creación se hace con ventanas, menús y prefabs.

Escribir la historia, ramificarla, definir personajes y variables, misiones, rutinas, tiempo de juego, salas y
puertas, el inventario, la localización, el guardado y la carga, los menús y el HUD: todo eso se hace en la
ventana Beasty VN y en el inspector de Unity. No necesitas abrir un solo archivo de C#, y la escena incluida
funciona sin una sola línea de código tuyo.

Solo necesitas código en tres casos:

- Quieres un **modo de juego propio** — un minijuego, un combate, una pantalla de mapa. Eso va en el estado
  de aplicación `Custom`. Consulta [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/).
- Quieres **leer o controlar el juego desde tus propios scripts** — reaccionar a una elección, consultar el
  estado de una misión, modificar una variable. Consulta [La API estática VN](/es/docs/beasty-visual-novel/scripting/vn-api/).
- Quieres un **comportamiento de UI** que los prefabs no traen. Cambiar el estilo no requiere código; un
  comportamiento nuevo, sí.

## ¿Qué render pipelines son compatibles?

Built-in, URP y HDRP. El paquete dibuja con sprites estándar de Unity, uGUI y TextMeshPro, y no incluye
shaders ni materiales propios, así que no hay nada atado a un pipeline en particular que pueda romperse.

Consulta [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/).

## ¿Qué versión de Unity necesito?

Unity 6000.2 o más reciente.

Consulta [Instalación](/es/docs/beasty-visual-novel/getting-started/installation/).

## ¿Funciona con el Input System?

Sí — y también con el Input Manager clásico, o con ambos a la vez. La capa de entrada la decide la propia
configuración **Active Input Handling** de Unity, así que el paquete compila incluso en un proyecto que nunca
instaló el paquete Input System.

Los bindings se editan con desplegables en la sección **Controls** del inspector de BeastyManager. Es una
configuración serializada, no un asset `.inputactions`. El jugador puede reasignar los controles durante la
partida, y esos cambios quedan guardados.

Consulta [Entrada y controles](/es/docs/beasty-visual-novel/production/input-and-controls/).

## ¿Necesito Addressables?

No. Por defecto se usan referencias directas, que se resuelven de forma síncrona y no cuestan nada.

Addressables solo hace falta si activas el streaming, que es opcional y está en beta en 1.0.0. Si el paquete
no está instalado, el módulo de streaming ni siquiera se compila, y todo lo demás funciona con normalidad.

Consulta [Streaming](/es/docs/beasty-visual-novel/production/streaming/).

## ¿Necesito Newtonsoft u otro paquete?

No. No hay dependencias de terceros. El sistema de guardado trae su propio motor JSON, así que no se incluye
nada que pueda chocar con un paquete que ya uses.

## ¿Incluye un sistema de guardado?

Sí. Beasty Save System viene incluido dentro de este paquete — no hay que importar nada aparte ni pagar nada
extra.

El guardado, la carga, el autoguardado, los slots, las miniaturas PNG, las copias de seguridad y la
encriptación opcional funcionan de fábrica. Una partida guardada contiene todo el almacén de variables, la
posición en la historia, el escenario, el estado del mundo libre, el historial de rebobinado y el estado de
los componentes `BeastySaveable` de tu escena.

Consulta [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/) y la
[documentación de Beasty Save System](/es/docs/beasty-save-system/).

## ¿Puede mi guionista trabajar en un archivo de texto mientras yo armo el grafo?

Sí. Cada historia puede llevar un script `.vnbeasty`: un solo archivo, una escena, texto plano, versionable y
comparable línea a línea (diffable).

Cómo funciona, en un párrafo: el grafo es la fuente de verdad. Guardar el archivo aplica el texto al grafo;
**Sync from graph** escribe el grafo en el texto. Si los dos lados cambiaron, gana el guardado más reciente,
y junto al archivo queda un `.bak` con marca de tiempo del lado sobrescrito. Si una importación no se puede
parsear, está vacía o destruiría contenido, se rechaza y el grafo queda intacto. Los assets se resuelven por
GUID, así que renombrar el arte no rompe ningún nodo sincronizado.

El límite que conviene conocer desde el principio: **un backdrop con más de una capa de sprite no tiene forma
de texto**. Esas escenas viven solo en el grafo.

Consulta [El script de texto](/es/docs/beasty-visual-novel/authoring/text-script/) y
[la sintaxis de .vnbeasty](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/).

## ¿Puedo usar mi propia UI?

Sí. Todo lo que ve el jugador es un prefab de uGUI con su arte en una sola carpeta. Puedes cambiar el estilo
de los prefabs, o apuntar las vistas a un canvas tuyo.

`Tools > Beasty VN > Setup > Upgrade UI Prefabs (keep customizations)` actualiza los prefabs incluidos sin
descartar tus cambios.

El motor de la historia (`Core`) vive en un ensamblado separado de la capa de vista, así que puedes reemplazar
toda la presentación sin tocar el motor.

Consulta [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) y [Prefabs](/es/docs/beasty-visual-novel/reference/prefabs/).

## ¿Puedo usarlo para un dating sim, un life sim o un juego de detectives?

Sí. Además de la novela visual, el paquete trae los sistemas que esos géneros necesitan:

- **Dating sim**: stats de personaje, variables de afecto, un menú de conversación por personaje, elecciones
  condicionales, alias y estilos de entrega.
- **Life sim**: tiempo de juego con momentos del día, rutinas y perfiles de personaje, salas de mundo libre,
  misiones con recurrencia diaria y semanal.
- **Juego de detectives**: un inventario con ítems clave, puertas condicionales, nodos de decisión, un
  diccionario de tokens que el jugador puede editar, objetivos de misión con pistas.

Empieza por [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/) y después revisa las páginas dentro de `world/`.

## ¿Es compatible con WebGL?

No. WebGL no es una plataforma compatible.

Consulta [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/).

## ¿Puedo localizar el juego a cuantos idiomas quiera?

Sí. Una tabla de localización es una grilla de claves por idioma, y puedes agregar tantos idiomas como
quieras. El índice 0 es el idioma de origen.

Cada celda guarda una huella del texto original del que se tradujo, así que al editar una línea sus
traducciones se marcan como **Stale**, y puedes exportar en CSV o TSV exactamente las líneas que cambiaron.

Consulta [Localización](/es/docs/beasty-visual-novel/production/localization/).

## ¿El jugador puede cambiar de idioma a mitad de partida?

Sí, en vivo. La línea actual, las elecciones y el menú de conversación se vuelven a dibujar al instante. El
idioma activo tiene una única fuente de verdad, compartida entre el texto de la historia y la interfaz.

Al arrancar, el juego usa el idioma que el jugador eligió y quedó guardado; si no hay ninguno, el del sistema
operativo (cuando `autoDetectSystemLanguage` está activado), y si no, el predeterminado.

## ¿Puedo agregar mi propio minijuego?

Sí. Para eso existe el estado de aplicación `Custom`. Entra con `EnterCustom`, guarda tu estado en
`customStateJson`, y ese estado se guarda, se carga y se rebobina junto con todo lo demás — el almacén de
variables, la posición en la historia y el tiempo se mantienen consistentes entre sí.

Consulta [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/).

## ¿Se incluye el código fuente en C#?

Sí. Código fuente completo, sin DLLs. `Core` es lógica pura sin UI de Unity, en su propio ensamblado;
`Runtime` es lo que entra en un build; `Editor` contiene las herramientas de creación.

Consulta [Resumen de scripting](/es/docs/beasty-visual-novel/scripting/overview/).

## ¿Cómo migro desde Ren'Py?

No hay un importador automático de Ren'Py: el script se reescribe a mano.

Es menos doloroso de lo que suena, porque el formato `.vnbeasty` se parece a propósito a lo que ya escribes:
`label`, `jump`, `show`, `hide`, `scene` (aquí `backdrop`), un hablante seguido de su línea entre comillas,
menús como líneas `choice` con condiciones. Pega una escena, renombra los comandos, y la pestaña Text te dirá
qué no pudo resolver.

Dos diferencias que conviene tener en cuenta:

- **La configuración no vive en el script.** Los personajes, las variables, el diccionario, los ítems y la
  localización se crean en las ventanas visuales. El script solo los referencia por nombre.
- **El grafo es la fuente de verdad.** El texto es una vista sobre él, no la copia maestra.

Consulta [la sintaxis de .vnbeasty](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/).

## Ver también

- [Solución de problemas](/es/docs/beasty-visual-novel/troubleshooting/)
- [Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/)
- [Instalación](/es/docs/beasty-visual-novel/getting-started/installation/)
