---
title: "Plataformas y límites"
description: "Dónde funciona el paquete, dónde no, y los límites que un juego publicado realmente encuentra. Lee la sección de WebGL antes de planear una build de navegador."
---

Dónde funciona el paquete, dónde no, y los límites que un juego publicado realmente encuentra. Lee la sección
de WebGL antes de planear una build de navegador.

## Versión de Unity

Unity **6000.2 o más reciente**.

El paquete tiene **cero dependencias externas**. Incluye su propio motor JSON, así que no hay ningún paquete
Newtonsoft que instalar y nada que entre en conflicto con una versión de Newtonsoft que tu proyecto ya use.

## Backends de scripting

Se soportan tanto **Mono** como **IL2CPP**.

IL2CPP importa aquí porque el paquete usa reflexión para mapear campos, y la compilación AOT es donde el
código de reflexión ingenuo se rompe: los caminos genéricos de tipos de valor se eliminan (stripping),
`Activator.CreateInstance` en un tipo al que nada hace referencia estáticamente falla, y una librería que
funciona en el editor explota en el player. Los caminos de serialización se ejercitan con una escena de humo
(smoke scene) corrida contra una **build IL2CPP real**, no contra el editor con el backend cambiado. Los
ciclos de ida y vuelta de los tipos soportados, los convertidores integrados, el cifrado y el guardado de
grupo se ejecutan todos ahí.

No necesitas entradas de link.xml para el paquete en sí. Si tu propio tipo de datos de guardado solo se
referencia a través de `Load<T>` y nada más, las reglas de stripping estándar de IL2CPP se aplican a él como
a cualquier otro tipo de tu juego.

## Plataformas

Cualquier plataforma con un `Application.persistentDataPath` con permisos de escritura:

| Plataforma | Soportada |
|---|---|
| Windows | Sí |
| macOS | Sí |
| Linux | Sí |
| Android | Sí |
| iOS | Sí |
| Consolas | Sí, donde `persistentDataPath` tenga permisos de escritura |
| WebGL | **No** — ver más abajo |

Los guardados viven en `{DataPath o Application.persistentDataPath}/{Folder}/{slot}.{Extension}`. Deja
`BeastySaveSettings.DataPath` vacío y obtienes `persistentDataPath`, que es la ubicación correcta, con
permisos de escritura, por usuario, en todas las plataformas anteriores. Configúralo solo cuando sepas por
qué. Consulta [Configuración](/es/docs/beasty-save-system/guides/settings/).

La certificación de consolas a menudo tiene reglas sobre las escrituras de guardado (sin escrituras durante
la suspensión, un ícono de guardado requerido, una comprobación de espacio libre mínimo requerida). El
paquete te da las piezas — `SaveResult`, `SaveCompleted`, `SaveAllNow` — pero no implementa por ti los
requisitos de certificación de ninguna plataforma.

## WebGL

**WebGL no está soportado en 1.0.0.** No "sin probar". No "funciona con un plugin". No soportado.

Dos razones, ambas estructurales:

1. **La escritura atómica.** Cada guardado se escribe en un archivo temporal único y luego se mueve sobre el
   slot con `File.Replace`, que es lo que produce el `.bak` y lo que garantiza que un fallo a mitad de la
   escritura no pueda dejar medio guardado. La build de navegador no ofrece esa semántica de sistema de
   archivos.
2. **Las variantes asíncronas.** `SaveAsync`, `LoadAsync` y `LoadIntoAsync` están basadas en `Task`. WebGL es
   de un solo hilo y no las ejecuta como espera el resto de la API.

No hay ninguna configuración que active esto, y ninguna solución alternativa soportada. Si necesitas
guardados en navegador, necesitas una capa de persistencia distinta — una construida sobre `PlayerPrefs`,
IndexedDB o un servidor. Planifica eso antes de construir, no después.

## Límites

### Tamaño de guardado

La serialización es **síncrona**, incluso dentro de las variantes asíncronas. `SaveAsync` realiza la E/S de
archivo de forma asíncrona; construir el grafo de nodes JSON, renderizar el texto y cifrarlo se ejecutan
todos en el hilo que la llamó — que es tu hilo principal. Un guardado muy grande por lo tanto cuesta un
tirón de frame proporcional a su tamaño, y hacerle `await` no elimina ese tirón. Las variantes asíncronas
mantienen al juego fuera del bloqueo de **E/S**, no fuera del trabajo de serialización. Consulta [Guardado asíncrono](/es/docs/beasty-save-system/guides/async-saving/).

Las consecuencias prácticas:

- Mantén el guardado limitado al estado del juego, no a un volcado de la escena. Marca solo los componentes
  que realmente llevan estado en cada `BeastySaveable`.
- Autoguarda en momentos donde un tirón es invisible — una transición de sala, un menú abierto — no en medio
  del combate.
- Si un guardado ha crecido a un tamaño que se nota, la solución es menos componentes guardados o un objeto
  de datos más pequeño, no una llamada distinta.

### Profundidad de anidación JSON

El parser limita el anidamiento a **512 niveles** (`JsonParser.DefaultMaxDepth`). Los datos anidados más
profundo que eso fallan al guardar. En la práctica nada legítimo llega a 512 — una lista enlazada almacenada
como objetos anidados, o una estructura profunda accidental, es lo que te lleva ahí. Un **ciclo de
referencias** es un fallo distinto y duro: el guardado falla con "save data must be acyclic". Tus datos de
guardado deben ser un árbol.

### El formato es texto

Un archivo de guardado es JSON, indentado con dos espacios, UTF-8 sin BOM. Ese es un compromiso deliberado:

- **Sin cifrar, un guardado es legible y editable a mano por humanos.** Bueno para depurar, bueno para
  soporte, y una invitación abierta a un jugador con un editor de texto.
- **Cifrado, no lo es** — pero el cifrado tiene un costo de tamaño. El payload se cifra con AES y luego se
  codifica en Base64, lo que infla los bytes en aproximadamente un tercio, más un IV aleatorio de 16 bytes
  por guardado y relleno (padding) de bloque. El sobre y el diccionario `meta` permanecen en texto plano de
  todos modos, que es lo que permite que `ReadMeta` construya una lista de slots sin la clave.

Y sé honesto contigo mismo sobre lo que compra el cifrado: es ofuscación contra la edición casual del
guardado, no seguridad. La clave viaja dentro de tu juego. Consulta [Cifrado](/es/docs/beasty-save-system/guides/encryption/).

El texto también significa que el archivo es más grande de lo que sería un formato binario. Si tu guardado
se mide en decenas de megabytes, el formato es parte de la razón.

### Seguridad de hilos

Llama a la API desde el **hilo principal**. Esa es la expectativa alrededor de la cual está construido el
paquete.

- Leer el estado de un componente significa tocar la API de Unity, y la API de Unity es exclusiva del hilo
  principal. Cualquier guardado que incluya estado de escena — cada `SaveAll`, cada convertidor que lee un
  componente — debe ejecutarse en el hilo principal. Esta es una restricción de Unity, no del paquete.
- Las variantes asíncronas son `async`/`await`, no jobs en segundo plano. Vuelven al contexto de quien las
  llama; no mueven tu trabajo a un hilo secundario.
- No ejecutes dos guardados al **mismo slot** a la vez. La escritura atómica hace que una escritura
  concurrente al mismo slot sea segura contra la corrupción en disco — un archivo escrito a medias nunca
  reemplaza a uno bueno — pero cuál de los dos gana no es algo en lo que debas confiar.

Las partes internas que deben ser seguras son: la resolución de convertidores se cachea en un diccionario
concurrente, y el estado de tolerancia por carga del mapper es local al hilo (thread-local). Eso es
suficiente para que los caminos asíncronos sean sólidos. No es una licencia para serializar una escena desde
un hilo secundario.

### Límites de datos

Un puñado de cosas simplemente no pueden representarse:

- Floats `NaN` e `Infinity` — no son JSON válido. El guardado falla.
- Las claves de diccionario deben ser strings, primitivos o enums.
- Valores `ulong` mayores que `long.MaxValue`.
- Referencias a `UnityEngine.Object` — nunca se guardan, en ninguna plataforma. Consulta
  [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/).

## Ver también

- [Instalación](/es/docs/beasty-save-system/getting-started/installation/) — requisitos y qué hay en la carpeta.
- [Guardado asíncrono](/es/docs/beasty-save-system/guides/async-saving/) — qué hace realmente `SaveAsync`.
- [Cifrado](/es/docs/beasty-save-system/guides/encryption/) — los límites honestos.
- [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/) — tipos soportados y errores duros.
- [El formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/) — el sobre y el pipeline de escritura.
- [Solución de problemas](/es/docs/beasty-save-system/troubleshooting/)
