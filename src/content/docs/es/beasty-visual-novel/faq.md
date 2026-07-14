---
title: "Preguntas frecuentes"
description: "Respuestas breves, con un enlace a la página que tiene la larga."
---

Respuestas breves, con un enlace a la página que tiene la larga.

## ¿Necesito saber programar?

No. Todo el camino de creación es ventanas, menús y prefabs.

Escribir la historia, ramificarla, definir personajes y variables, misiones, rutinas, tiempo de juego, salas y
puertas, el inventario, la localización, el guardado y la carga, los menús y el HUD: todo se hace en la
ventana Beasty VN y en el inspector de Unity. Nunca abres un archivo C#, y la escena incluida se ejecuta sin
una sola línea de tu código.

El código se vuelve necesario en exactamente tres lugares:

- Quieres un **modo de juego propio** - un minijuego, un combate, una pantalla de mapa. Eso va en el estado
  de aplicación `Custom`. Ver [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/).
- Quieres **leer o dirigir el juego desde tus propios scripts** - reaccionar a una elección, leer el estado
  de una misión, escribir una variable. Ver [La API estática VN](/es/docs/beasty-visual-novel/scripting/vn-api/).
- Quieres un **comportamiento de UI** que los prefabs no tienen. Restilizar no necesita código; un
  comportamiento nuevo sí.

## ¿Qué render pipelines son compatibles?

Built-in, URP y HDRP. El paquete dibuja con sprites estándar de Unity, uGUI y TextMeshPro, y no incluye
shaders ni materiales propios, así que no hay nada específico de pipeline que se pueda romper.

Ver [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/).

## ¿Qué versión de Unity necesito?

Unity 6000.2 o más reciente.

Ver [Instalación](/es/docs/beasty-visual-novel/getting-started/installation/).

## ¿Funciona con el Input System?

Sí - y con el Input Manager clásico, y con ambos a la vez. La capa de entrada la elige la propia
configuración **Active Input Handling** de Unity, así que el paquete compila en un proyecto que nunca
instaló el paquete Input System.

Los bindings se editan en la sección **Controls** del inspector de BeastyManager, con desplegables. Es una
configuración serializada, no un asset `.inputactions`. El jugador puede reasignar controles en tiempo de
ejecución, y las anulaciones se guardan.

Ver [Entrada y controles](/es/docs/beasty-visual-novel/production/input-and-controls/).

## ¿Necesito Addressables?

No. Lo predeterminado son referencias directas, que se resuelven de forma síncrona y no cuestan nada.

Addressables solo se necesita si activas el streaming, que es opcional y beta en 1.0.0. Sin el paquete
instalado, el módulo de streaming ni siquiera compila, y todo funciona con normalidad.

Ver [Streaming](/es/docs/beasty-visual-novel/production/streaming/).

## ¿Necesito Newtonsoft, o algún otro paquete?

No. No hay dependencias de terceros. El sistema de guardado tiene su propio motor JSON, así que no se
incluye nada que pueda entrar en conflicto con un paquete que ya uses.

## ¿Incluye un sistema de guardado?

Sí. Beasty Save System viene incluido dentro de este paquete - sin importación extra, sin compra extra.

El guardado, la carga, el autoguardado, los slots, las miniaturas PNG, las copias de seguridad y la
encriptación opcional funcionan de fábrica. Un guardado contiene todo el almacén de variables, la posición
en la historia, el escenario, el estado de mundo libre, el historial de rebobinado y el estado de los
componentes `BeastySaveable` en tu escena.

Ver [Guardado y carga](/es/docs/beasty-visual-novel/production/saving-and-loading/) y la
[documentación de Beasty Save System](/es/docs/beasty-save-system/).

## ¿Mi guionista puede trabajar en un archivo de texto mientras yo construyo en el grafo?

Sí. Cada historia puede llevar un script `.vnbeasty`: un archivo, una escena, texto plano, versionable,
comparable línea a línea (diffable).

El contrato en un párrafo. El grafo es la fuente de verdad. Guardar el archivo aplica el texto al grafo;
**Sync from graph** escribe el grafo en el texto. Si ambos lados cambiaron, gana el guardado más reciente y
se deja un `.bak` con marca de tiempo del lado sobrescrito junto al archivo. Una importación que no se puede
parsear, que está vacía, o que destruiría contenido, se rechaza, y el grafo queda intacto. Los assets se
resuelven por GUID, así que renombrar arte no rompe un nodo sincronizado.

El límite que conviene conocer de antemano: **un backdrop con más de una capa de sprite no tiene forma de
texto**. Esas escenas se quedan solo en el grafo.

Ver [El script de texto](/es/docs/beasty-visual-novel/authoring/text-script/) y
[la sintaxis de .vnbeasty](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/).

## ¿Puedo usar mi propia UI?

Sí. Todo lo que ve el jugador es un prefab uGUI con su arte en una sola carpeta. Restiliza los prefabs, o
apunta las vistas a un canvas propio.

`Tools > Beasty VN > Setup > Upgrade UI Prefabs (keep customizations)` actualiza los prefabs incluidos sin
descartar tus cambios.

El motor de la historia (`Core`) es un ensamblado separado de la capa de vista, así que puedes reemplazar la
presentación sin tocar el motor.

Ver [Prefabs de UI](/es/docs/beasty-visual-novel/production/ui-prefabs/) y [Prefabs](/es/docs/beasty-visual-novel/reference/prefabs/).

## ¿Puedo usarlo para un dating sim, un life sim o un juego de detectives?

Sí. Más allá de la novela visual, el paquete incluye los sistemas que esos géneros necesitan:

- **Dating sim**: stats de personaje, variables de afecto, un menú de conversación por personaje, elecciones
  condicionales, alias y estilos de entrega.
- **Life sim**: tiempo de juego con momentos del día, rutinas y perfiles de personaje, salas de mundo libre,
  misiones con recurrencia diaria y semanal.
- **Juego de detectives**: un inventario con ítems clave, puertas condicionales, nodos de decisión, un
  diccionario de tokens editables por el jugador, objetivos de misión con pistas.

Empieza en [Conceptos fundamentales](/es/docs/beasty-visual-novel/getting-started/core-concepts/), y luego lee las páginas bajo `world/`.

## ¿Es compatible con WebGL?

No. WebGL no es una plataforma compatible.

Ver [Compilación y plataformas](/es/docs/beasty-visual-novel/production/building-and-platforms/).

## ¿Puedo localizar a cualquier número de idiomas?

Sí. Una tabla de localización es una grilla de claves por idioma, y puedes agregar tantos idiomas como
quieras. El índice 0 es el idioma de origen.

Cada celda registra una huella digital del texto de origen a partir del cual se tradujo, así que cuando
editas una línea sus traducciones se marcan como **Stale**, y puedes exportar exactamente las líneas que
cambiaron como CSV o TSV.

Ver [Localización](/es/docs/beasty-visual-novel/production/localization/).

## ¿El jugador puede cambiar de idioma a mitad de partida?

Sí, en vivo. La línea actual, las elecciones y el menú de conversación se vuelven a renderizar de
inmediato. Hay una única fuente de verdad para el idioma activo, compartida por el texto de la historia y
la interfaz.

Al iniciar, el juego usa la elección guardada del jugador, luego el idioma del sistema operativo si
`autoDetectSystemLanguage` está activado, y luego el predeterminado.

## ¿Puedo agregar mi propio minijuego?

Sí. Para eso está el estado de aplicación `Custom`. Entra en él con `EnterCustom`, captura tu estado en
`customStateJson`, y se guarda, se carga y hace rollback junto con todo lo demás - el almacén de variables,
la posición en la historia y el tiempo se mantienen consistentes.

Ver [Modo personalizado](/es/docs/beasty-visual-novel/scripting/custom-mode/).

## ¿Se incluye el código fuente en C#?

Sí. Código fuente completo, sin DLLs. `Core` es lógica pura sin UI de Unity, en su propio ensamblado;
`Runtime` es lo que se incluye en un build; `Editor` contiene las herramientas de creación.

Ver [Resumen de scripting](/es/docs/beasty-visual-novel/scripting/overview/).

## ¿Cómo migro desde Ren'Py?

No hay un importador automático de Ren'Py. Reescribes el script.

Es menos doloroso de lo que suena, porque el formato `.vnbeasty` está deliberadamente cerca de lo que ya
escribes: `label`, `jump`, `show`, `hide`, `scene` (aquí `backdrop`), un hablante seguido de una línea entre
comillas, menús como líneas `choice` con condiciones. Pega una escena, renombra los comandos, y la pestaña
Text te dice qué no puede resolver.

Dos diferencias para las que hay que planificar:

- **La configuración no está en el script.** Los personajes, las variables, el diccionario, los ítems y la
  localización se crean en las ventanas visuales. El script solo los referencia por nombre.
- **El grafo es la fuente de verdad.** El texto es una vista sobre él, no la copia maestra.

Ver [la sintaxis de .vnbeasty](/es/docs/beasty-visual-novel/authoring/vnbeasty-syntax/).

## Ver también

- [Solución de problemas](/es/docs/beasty-visual-novel/troubleshooting/)
- [Tu primera escena](/es/docs/beasty-visual-novel/getting-started/your-first-scene/)
- [Instalación](/es/docs/beasty-visual-novel/getting-started/installation/)
