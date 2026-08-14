---
title: "Preguntas frecuentes"
description: "Respuestas cortas, con un enlace a la página donde está la explicación completa."
---

Respuestas cortas, con un enlace a la página donde está la explicación completa.

## ¿Necesita Newtonsoft, o algún otro paquete?

No. El paquete tiene **cero dependencias externas**. Incluye su propio motor JSON, así que no hay nada que
instalar y nada que entre en conflicto con una versión de Newtonsoft que tu proyecto ya use. Los módulos
convertidores opcionales dependen de los módulos propios de Unity (física, audio, uGUI, etc.), y si alguno falta,
ese módulo simplemente no compila y el resto del paquete sigue funcionando.

Consulta [Instalación](/es/docs/beasty-save-system/getting-started/installation/) y
[Módulos convertidores](/es/docs/beasty-save-system/reference/converter-modules/).

## ¿Puedo usarlo con mis datos de guardado existentes?

No directamente. Un guardado de Beasty es un sobre (envelope) con su propia versión, checksum y payload, así que el sistema no puede
leer un archivo escrito por otro asset de guardado o por tu propio serializador hecho a mano.

La migración es un paso único en tu código: lee el archivo antiguo con el código que lo escribió, arma tu objeto
de datos a partir de él, y llama a `BeastySave.Save`. Desde ese momento el archivo es un guardado de Beasty.
`BeastySave.RegisterMigration` sirve para moverse **entre versiones de tus propios guardados de Beasty**, no para
importar un formato ajeno. Consulta [Versionado y migraciones](/es/docs/beasty-save-system/guides/versioning-and-migrations/).

## ¿Funciona con IL2CPP?

Sí. Tanto Mono como IL2CPP están soportados, y las rutas de serialización — las que suelen romperse en builds AOT —
se prueban con una escena de humo que corre contra un build real de IL2CPP, no contra el editor con el backend
cambiado. Consulta [Plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/).

## ¿Funciona en WebGL?

**No.** WebGL no está soportado. La escritura atómica depende de la semántica del sistema de archivos que el build de
navegador no proporciona, y las variantes asíncronas están basadas en `Task`. No hay ninguna opción que lo active
ni ningún workaround soportado; un build de navegador necesita una capa de persistencia diferente.
[Plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/) explica exactamente por qué.

## ¿Es segura la encriptación?

**No, y no deberías tratarla como si lo fuera.** Es AES-256, y es AES-256 real — pero la clave
viene incluida dentro de tu juego y puede extraerse del build. Eso la convierte en ofuscación contra un jugador que
edita su guardado en el Bloc de notas, no en seguridad contra un atacante decidido. No va a proteger una
tabla de clasificación ni una compra dentro del juego.

Úsala para frenar las trampas casuales, y haz que cualquier dato que deba ser confiable se valide en un servidor.
Consulta [Cifrado](/es/docs/beasty-save-system/guides/encryption/).

## ¿Puedo guardar un Dictionary?

Sí. `Dictionary`, `HashSet`, `SortedSet`, `Queue`, `Stack`, `List` y los arrays se guardan y recuperan correctamente. Las
claves de un Dictionary deben ser strings, primitivos o enums — una clave de cualquier otro tipo hace fallar el guardado. Consulta
[Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/).

## ¿Puedo guardar una referencia a un ScriptableObject? ¿Un sprite? ¿Un prefab?

No. Las referencias a `UnityEngine.Object` **nunca** se escriben en un archivo de guardado — ni como campos, ni
dentro de colecciones. Es la restricción más dura del paquete, y es deliberada.

La ventaja es que tampoco se sobrescriben al cargar: las referencias que conectaste en la escena sobreviven
intactas. El patrón es guardar un **id** — un string — y resolver el asset tú mismo después de cargar.
Consulta [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/).

## ¿Puedo tener configuraciones distintas para el autoguardado y el guardado manual?

Sí, desde código. `BeastySaveSettings` es una clase serializable normal y cada llamada a `BeastySave` recibe una
instancia, así que puedes pasarle una diferente a cada llamada — una carpeta distinta, una extensión distinta,
cifrado activado para una y desactivado para la otra.

El camino sin código usa un solo objeto de settings: `BeastySaveManager` mantiene un único campo `settings` que
usan tanto `SaveAll` como `LoadAll`. Ten en cuenta que cambiar `Folder` o `Extension` cambia lo que `ListSlots`
encuentra. Consulta [Settings](/es/docs/beasty-save-system/guides/settings/).

## ¿Cuán grande puede ser un guardado?

No hay un límite estricto, pero la serialización es **síncrona** — incluso dentro de `SaveAsync`, que hace la
IO de archivos de forma asíncrona mientras construye y cifra el JSON en el hilo que llama. Así que un guardado
muy grande cuesta un hitch de frame proporcional a su tamaño, y hacer `await` no elimina ese hitch.

Guarda el estado del juego, no la escena completa, y autoguarda en momentos donde un hitch pase desapercibido. Consulta
[Plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/) y [Guardado asíncrono](/es/docs/beasty-save-system/guides/async-saving/).

## ¿Puedo leer un archivo de guardado a mano?

Sí, a menos que lo hayas cifrado. Un guardado es JSON, indentado con dos espacios, UTF-8 sin BOM, y puedes
abrirlo en cualquier editor de texto. Eso es útil para depurar y para dar soporte, y también es una invitación
abierta para cualquier jugador con un editor de texto — justo para eso existe la opción de cifrado.

El diccionario `meta` se queda en texto plano **incluso cuando el guardado está cifrado**, así que una pantalla
de selección de slot puede mostrar el nivel y el tiempo de juego sin la clave. Trátalo como datos de visualización
en los que no se puede confiar: se lee antes de verificar el checksum. Consulta [El formato del archivo de guardado](/es/docs/beasty-save-system/reference/save-file-format/) y
[Slots y metadatos](/es/docs/beasty-save-system/guides/slots-and-metadata/).

## ¿Pueden ir los guardados a la nube?

Sí. Pon el desplegable **Storage** (o `BeastySaveSettings.StorageId`) en un backend registrado y las mismas
llamadas escriben ahí en lugar de en disco. Los backends de Firestore y Realtime Database vienen con el
asset y se compilan solos cuando el SDK de Firebase está en el proyecto; los guardados se almacenan por
usuario, con el inicio de sesión anónimo resuelto por ti. Los archivos locales siguen siendo el valor por
defecto. Consulta [Backends de almacenamiento](/es/docs/beasty-save-system/guides/storage-backends/) y
[Firebase](/es/docs/beasty-save-system/guides/firebase/).

## ¿Puedo mandar un guardado a mi propio servidor?

Sí, sin ningún backend: `BeastySave.SaveToJson` te entrega el texto de sobre exacto que un guardado
escribiría — checksum, versiones, cifrado opcional — como una cadena, y `LoadFromJson<T>` lo carga de
vuelta con la misma validación que recibe un archivo. `ToJson`/`FromJson<T>` hacen lo mismo con JSON
limpio, sin sobre. Transpórtalo como quieras. Consulta
[la API de BeastySave](/es/docs/beasty-save-system/reference/api-beastysave/).

## ¿Es seguro para hilos (thread-safe)?

Llámalo desde el hilo principal. Cualquier cosa que guarde el estado de la escena tiene que tocar la API de Unity, y la API de Unity
es solo para el hilo principal. Las variantes asíncronas son `async`/`await`, no trabajos en segundo plano — te evitan
el bloqueo de la IO, no mueven tu trabajo a un hilo de trabajo (worker thread). Consulta
[Plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/).

## ¿Puedo usar solo el motor JSON?

Sí. `JsonNode`, `JsonMapper`, `JsonParser` y `JsonWriter` son públicos y utilizables por sí solos, sin
dependencia del pipeline de guardado. Parsea, construye un DOM, mapea objetos hacia y desde él, y vuelve a escribirlo. Consulta
[El motor JSON](/es/docs/beasty-save-system/reference/json-engine/).

## ¿Funciona sin el paquete de novela visual?

Sí. Beasty Save System es un paquete independiente, vendido por separado, que además viene incluido dentro de
[Beasty Visual Novel](/es/docs/beasty-visual-novel/). No tiene ninguna dependencia del código de la novela visual y
nada en él asume un proyecto de VN.

## ¿Tengo que escribir código para usarlo?

No. Añade un `BeastySaveManager` a la escena, añade un `BeastySaveable` a los objetos que quieras recordar, marca
los componentes que llevan su estado, y conecta `SaveAll` y `LoadAll` directamente al OnClick de un Button uGUI
con el nombre del slot escrito en el inspector. Consulta
[Guardar sin código](/es/docs/beasty-save-system/getting-started/save-without-code/).

## ¿Qué pasa si un archivo de guardado se daña?

La escritura es atómica — un cierre inesperado a mitad de la escritura no puede dejar un guardado a medias — y el archivo
anterior se rota a `<slot>.<ext>.bak` en cada guardado después del primero. Un archivo corrupto nunca se rota hacia
la copia de seguridad, así que el `.bak` siempre es la última copia que pasó la verificación.

Un archivo dañado falla al cargar con `Corrupt`, y todo `LoadResult` lleva `BackupAvailable`. Ofrécele al
jugador `BeastySave.RestoreBackup`. Consulta [Copias de seguridad y corrupción](/es/docs/beasty-save-system/guides/backups-and-corruption/).

## ¿Lanza excepciones?

No. Cada llamada en `BeastySave` devuelve un resultado tipado — `SaveResult` o `LoadResult<T>` — con un flag
`Success`, un código `BeastySaveError` y un mensaje. Nunca tienes que envolver un guardado en un try/catch. Sí tienes que
comprobar el resultado. Consulta [Resultados y errores](/es/docs/beasty-save-system/reference/results-and-errors/).

## ¿Puedo añadir soporte para un tipo que no conoce?

Sí, y también puedes reemplazar lo que guarda un convertidor incorporado. Implementa `IBeastyConverter` y regístralo
con `BeastySave.RegisterConverter` (prioridad más alta) o `BeastySave.RegisterModule` (un grupo con nombre,
idempotente). Regístralo desde un `[RuntimeInitializeOnLoadMethod]` — entrar en Play Mode reinicia las
variables estáticas. Consulta [Convertidores personalizados](/es/docs/beasty-save-system/advanced/custom-converters/).

## Ver también

- [Solución de problemas](/es/docs/beasty-save-system/troubleshooting/)
- [Qué se guarda](/es/docs/beasty-save-system/guides/what-gets-saved/)
- [Plataformas y límites](/es/docs/beasty-save-system/advanced/platforms-and-limits/)
