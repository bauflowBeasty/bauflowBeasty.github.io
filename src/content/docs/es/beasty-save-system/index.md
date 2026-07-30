---
title: "Beasty Save System"
description: "Guarda y carga los datos del juego como JSON en disco. Sin dependencias ni excepciones: resultados tipados, escritura atómica, backups, cifrado, migraciones."
---

Beasty Save System guarda y carga los datos de tu juego como archivos JSON en disco, sin dependencias externas
y sin excepciones inesperadas. Funciona de dos maneras: coloca dos componentes en una escena y conecta un botón, o
llama a una API de C# de cinco líneas desde tu propio código.

## Qué lo hace diferente

**Cero dependencias.** El paquete incluye su propio motor JSON. Sin Newtonsoft, sin los límites de `JsonUtility`, sin
entradas del package manager que tengas que cuadrar con el resto de tu proyecto.

**Cada llamada devuelve un resultado tipado.** `BeastySave.Save` devuelve un `SaveResult`. `BeastySave.Load<T>`
devuelve un `LoadResult<T>`. Nada lanza excepciones. Compruebas `Success`, lees el código de `Error` y decides
qué ve el jugador — por ejemplo, ofrecer la copia de seguridad automática cuando un archivo resulta estar corrupto.

**Seguro por defecto.** Los guardados se escriben de forma atómica: en un archivo temporal, que luego se
intercambia por el slot. Un cierre inesperado a mitad de la escritura no puede dejarte con un guardado a medias. El
archivo anterior se rota a `.bak`, y un archivo que falla su checksum nunca puede sobrescribir la última copia
buena.

## Características

- Guarda cualquier objeto C# plano, o el estado de los componentes en tu escena.
- Un camino sin código: `BeastySaveManager` + `BeastySaveable` + un botón uGUI.
- Escrituras atómicas, copias de seguridad `.bak` automáticas, checksums SHA-256 y restauración de copia de seguridad con una sola llamada.
- Cifrado AES-256 opcional. Lee [encryption.md](/es/docs/beasty-save-system/guides/encryption/) para conocer sus límites reales.
- Metadatos en texto plano (nivel, tiempo de juego, capítulo) legibles sin descifrar el archivo, para que una
  pantalla de slots de guardado pueda listarlos a bajo costo.
- Carga estricta (todo o nada, con rollback) o tolerante (omitir y advertir).
- Versionado de datos con migraciones registradas, para que una actualización pueda leer los guardados que tus jugadores ya tienen.
- Variantes asíncronas para la IO de archivos.
- Siete módulos convertidores opcionales (Animation, Audio, Particles, Physics2D, Physics3D, TMPro, UGUI), cada
  uno de los cuales compila solo cuando el módulo de Unity correspondiente está en el proyecto.
- Una ventana de editor que lista los saveables en tu escena y los archivos de guardado en disco.
- Unity 6000.2+, Mono e IL2CPP. WebGL no está soportado.

## Por dónde empezar

**Si no escribes C#**, ve a [save-without-code.md](/es/docs/beasty-save-system/getting-started/save-without-code/). Te lleva
desde una escena vacía hasta un guardado y una carga funcionando, solo con clics.

**Si sí escribes C#**, ve a [save-with-code.md](/es/docs/beasty-save-system/getting-started/save-with-code/). Cinco minutos, una clase de
datos y un archivo de guardado en disco.

En cualquiera de los dos casos, primero instala: [installation.md](/es/docs/beasty-save-system/getting-started/installation/).

## La única página que todos deberían leer

[what-gets-saved.md](/es/docs/beasty-save-system/guides/what-gets-saved/). Te dice qué tipos se guardan y recuperan correctamente y — lo más
importante — que las referencias a objetos de Unity (un sprite, un prefab, otro componente) **no** se guardan.
Eso es deliberado, y hay una forma correcta de trabajar con ello. Leer esa página antes de armar una pantalla
de guardado bien vale los diez minutos.

## Guías

Escritas para cualquiera, con o sin código.

| Página | Qué cubre |
|---|---|
| [what-gets-saved.md](/es/docs/beasty-save-system/guides/what-gets-saved/) | Tipos soportados, qué no se guarda, los errores que hacen fallar un guardado |
| [settings.md](/es/docs/beasty-save-system/guides/settings/) | Cada campo de `BeastySaveSettings` y cuándo cambiarlo |
| [scene-state.md](/es/docs/beasty-save-system/guides/scene-state/) | `BeastySaveable`, `BeastySaveManager`, ids, objetos generados en tiempo de ejecución |
| [slots-and-metadata.md](/es/docs/beasty-save-system/guides/slots-and-metadata/) | Slots, cómo listarlos y cómo construir una pantalla de slots de guardado |
| [backups-and-corruption.md](/es/docs/beasty-save-system/guides/backups-and-corruption/) | Escrituras atómicas, archivos `.bak`, restaurar uno |
| [encryption.md](/es/docs/beasty-save-system/guides/encryption/) | AES, y qué protege y qué no protege el cifrado |
| [strict-vs-tolerant.md](/es/docs/beasty-save-system/guides/strict-vs-tolerant/) | Los dos modos de carga |
| [versioning-and-migrations.md](/es/docs/beasty-save-system/guides/versioning-and-migrations/) | Publicar una actualización que lee guardados antiguos |
| [async-saving.md](/es/docs/beasty-save-system/guides/async-saving/) | Qué hacen realmente los métodos asíncronos |
| [save-manager-window.md](/es/docs/beasty-save-system/guides/save-manager-window/) | La ventana del editor, sección por sección |
| [logging.md](/es/docs/beasty-save-system/guides/logging/) | El interruptor Logging, qué imprime cada modo, y cómo mandar los logs a otro sitio |

## Referencia

Firmas exactas, comportamiento exacto.

| Página | Qué cubre |
|---|---|
| [api-beastysave.md](/es/docs/beasty-save-system/reference/api-beastysave/) | Cada método de la fachada `BeastySave` |
| [results-and-errors.md](/es/docs/beasty-save-system/reference/results-and-errors/) | `SaveResult`, `LoadResult<T>`, los códigos de error |
| [components.md](/es/docs/beasty-save-system/reference/components/) | `BeastySaveable` y `BeastySaveManager`, campo por campo |
| [converter-modules.md](/es/docs/beasty-save-system/reference/converter-modules/) | Los siete módulos y exactamente qué guarda cada uno |
| [save-file-format.md](/es/docs/beasty-save-system/reference/save-file-format/) | El sobre (envelope), el formato de grupo, los pipelines |
| [json-engine.md](/es/docs/beasty-save-system/reference/json-engine/) | `JsonNode`, `JsonMapper`, `JsonParser`, `JsonWriter` |

## Avanzado

| Página | Qué cubre |
|---|---|
| [custom-converters.md](/es/docs/beasty-save-system/advanced/custom-converters/) | Enseñar al sistema a guardar tus propios tipos |
| [platforms-and-limits.md](/es/docs/beasty-save-system/advanced/platforms-and-limits/) | Versiones de Unity, IL2CPP, WebGL, rendimiento |

## Cuando algo sale mal

[troubleshooting.md](/es/docs/beasty-save-system/troubleshooting/) relaciona un síntoma con una causa y con una solución. [faq.md](/es/docs/beasty-save-system/faq/) responde las
preguntas que surgen con más frecuencia.
