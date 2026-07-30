---
title: "Plataformas y límites"
description: "Dónde corre el paquete, dónde no, y los límites con los que un juego publicado se topa en la práctica. Lee la sección de WebGL antes de planear una build web."
---

Dónde funciona el paquete, dónde no, y los límites con los que un juego publicado se topa en la práctica.
Lee la sección de WebGL antes de planear una build de navegador.

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
(smoke scene) ejecutada contra una **build IL2CPP real**, no contra el editor con el backend cambiado. Los
ciclos de ida y vuelta de los tipos soportados, los convertidores integrados, el cifrado y el guardado de
grupo se ejecutan todos ahí.

No necesitas entradas de link.xml para el paquete en sí. Tus propios tipos de datos también están a salvo,
con una excepción: un campo declarado como **interfaz de colección** cuyo elemento es uno de tus structs —
digamos `ISet<ItemStack> items;` — hace que el mapper construya `HashSet<ItemStack>` por reflexión al
cargar. Si esa combinación concreta no aparece en ninguna parte de tu código, IL2CPP nunca generó código
para ella, y la carga falla en el player aunque en el editor funcionara. Declara el campo con el tipo
concreto (`HashSet<ItemStack>`, `List<ItemStack>`, `Dictionary<int, ItemStack>`) y el problema no puede
ocurrir.

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
permisos de escritura, por usuario, en todas las plataformas de la tabla. Cámbialo solo si sabes por qué lo
haces. Consulta [Configuración](/es/docs/beasty-save-system/guides/settings/).

La certificación de consolas suele tener reglas sobre las escrituras de guardado (no escribir durante la
suspensión, mostrar un ícono de guardado, comprobar que haya un espacio libre mínimo). El paquete te da las
piezas — `SaveResult`, `SaveCompleted`, `SaveAllNow` — pero no implementa por ti los requisitos de
certificación de ninguna plataforma.

## WebGL

**WebGL no está soportado en 1.0.0.** No es que esté "sin probar", ni que "funcione con un plugin". No está
soportado.

Dos razones, ambas estructurales:

1. **La escritura atómica.** Cada guardado se escribe en un archivo temporal único y luego se mueve sobre el
   slot con `File.Replace`, que es lo que produce el `.bak` y lo que garantiza que un fallo a mitad de la
   escritura no pueda dejar medio guardado. La build de navegador no ofrece esa semántica de sistema de
   archivos.
2. **Las variantes asíncronas.** `SaveAsync`, `LoadAsync` y `LoadIntoAsync` están basadas en `Task`. WebGL es
   de un solo hilo y no las ejecuta como espera el resto de la API.

No hay ninguna opción que lo active, ni ninguna solución alternativa soportada. Si necesitas guardados en
navegador, necesitas una capa de persistencia distinta — una construida sobre `PlayerPrefs`, IndexedDB o un
servidor. Planéalo antes de construir, no después.

## Límites

### Tamaño de guardado

La serialización es **síncrona**, incluso dentro de las variantes asíncronas. `SaveAsync` realiza la E/S de
archivo de forma asíncrona; construir el grafo de nodes JSON, renderizar el texto y cifrarlo se ejecutan
todos en el hilo que la llamó — que es tu hilo principal. Por eso un guardado muy grande cuesta un tirón
de frame proporcional a su tamaño, y hacerle `await` no elimina ese tirón. Las variantes asíncronas
mantienen al juego fuera del bloqueo de **E/S**, no fuera del trabajo de serialización. Consulta [Guardado asíncrono](/es/docs/beasty-save-system/guides/async-saving/).

Las consecuencias prácticas:

- Limita el guardado al estado del juego; no vuelques la escena entera. Marca solo los componentes
  que realmente llevan estado en cada `BeastySaveable`.
- Autoguarda en momentos en los que un tirón pasa desapercibido — una transición de sala, un menú abierto —
  no en medio del combate.
- Si un guardado ha crecido a un tamaño que se nota, la solución es menos componentes guardados o un objeto
  de datos más pequeño, no una llamada distinta.

### Profundidad de anidación JSON

El parser limita el anidamiento a **512 niveles** (`JsonParser.DefaultMaxDepth`). Los datos anidados a más
profundidad se guardan sin quejas, pero no pueden volver a cargarse: la carga falla con `ParseError`. En la
práctica nada legítimo llega a 512 — una lista enlazada almacenada
como objetos anidados, o una estructura profunda accidental, es lo que te lleva ahí. Un **ciclo de
referencias** es un fallo distinto y duro: el guardado falla con "save data must be acyclic". Tus datos de
guardado deben ser un árbol.

### El formato es texto

Un archivo de guardado es JSON, indentado con dos espacios, UTF-8 sin BOM. Ese es un compromiso deliberado:

- **Sin cifrar, un guardado se puede leer y editar a mano.** Bueno para depurar, bueno para
  soporte, y una invitación abierta a cualquier jugador con un editor de texto.
- **Cifrado, no lo es** — pero el cifrado tiene un costo de tamaño. El payload se cifra con AES y luego se
  codifica en Base64, lo que infla los bytes en aproximadamente un tercio, más un IV aleatorio de 16 bytes
  por guardado y relleno (padding) de bloque. El sobre y el diccionario `meta` permanecen en texto plano de
  todos modos, que es lo que permite que `ReadMeta` construya una lista de slots sin la clave.

Y sé honesto contigo mismo sobre lo que te da el cifrado: es ofuscación contra la edición casual del
guardado, no seguridad. La clave viaja dentro de tu juego. Consulta [Cifrado](/es/docs/beasty-save-system/guides/encryption/).

El texto también significa que el archivo es más grande de lo que sería un formato binario. Si tu guardado
se mide en decenas de megabytes, el formato es parte de la razón.

### Seguridad de hilos

Llama a la API desde el **hilo principal**. El paquete está construido alrededor de esa expectativa.

- Leer el estado de un componente significa tocar la API de Unity, y la API de Unity es exclusiva del hilo
  principal. Cualquier guardado que incluya estado de escena — cada `SaveAll`, cada convertidor que lee un
  componente — debe ejecutarse en el hilo principal. Esta es una restricción de Unity, no del paquete.
- Las variantes asíncronas son `async`/`await`, no jobs en segundo plano. Vuelven al contexto de quien las
  llama; no mueven tu trabajo a un hilo secundario.
- No ejecutes dos guardados al **mismo slot** a la vez. La escritura atómica hace que una escritura
  concurrente al mismo slot sea segura contra la corrupción en disco — un archivo escrito a medias nunca
  reemplaza a uno bueno — pero cuál de los dos gana no es algo en lo que debas confiar.

Dos partes internas están construidas para ser seguras entre hilos: la resolución de convertidores se cachea
en un diccionario concurrente, y el estado de tolerancia por carga del mapper es local al hilo
(thread-local). Eso
alcanza para que los caminos asíncronos sean sólidos. No es una licencia para serializar una escena desde un
hilo secundario.

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
