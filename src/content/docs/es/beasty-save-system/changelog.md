---
title: "Historial de cambios"
description: "Todos los cambios relevantes de Beasty Save System, versión por versión. El proyecto sigue Semantic Versioning."
---

Todos los cambios relevantes de Beasty Save System. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.1.0 — 6 de agosto de 2026

### Añadido

- Backends de almacenamiento conectables: los guardados ahora pueden ir a una base de datos en lugar
  de a un archivo local. `BeastySaveSettings.StorageId` elige el backend (desplegable en el Beasty
  Save Manager); los archivos locales siguen siendo el valor por defecto y no cambian. Un backend
  propio implementa `IBeastySaveStorage` y se registra en `BeastySaveStorageRegistry`.
- Módulos de Firebase (solo compilan cuando el SDK de Firebase está presente — no hay más
  configuración que importarlo): Firestore (`firestore`), Realtime Database (`realtime-db`) e inicio
  de sesión anónimo automático vía Firebase Auth. Los guardados se almacenan por usuario bajo
  users/{uid}/saves/{slot}. Reglas de seguridad recomendadas: cada uid solo puede leer y escribir su
  propio subárbol.
- El editor mantiene sincronizados los scripting defines `BEASTY_HAS_FIREBASE_*` automáticamente:
  los añade y los quita por build target activo según el SDK de Firebase aparece o desaparece del
  proyecto, así que instalar (o quitar) el SDK desde un `.unitypackage` no exige tocar los Player
  Settings a mano.
- Punto de extensión de identidad de usuario: `IBeastyUserProvider` / `BeastySaveUsers` deciden de
  quién son estos guardados; `BeastySaveSettings.ScopeByUser` también separa los archivos locales
  por usuario.
- JSON sin archivos: `BeastySave.SaveToJson`/`LoadFromJson` (con el sobre de integridad completo) y
  `BeastySave.ToJson`/`FromJson` (payload limpio) para endpoints propios.
- `SaveResult<T>`: un resultado tipado que lleva un valor, devuelto por las APIs de JSON y de
  lectura.
- Utilidades de slot asíncronas: `ExistsAsync`, `DeleteAsync`, `ListSlotsAsync`, `ReadMetaAsync`,
  `RestoreBackupAsync`; `BeastySaveManager.SaveAllNowAsync`/`LoadAllNowAsync`. Una llamada síncrona
  sobre un backend solo asíncrono devuelve el nuevo error `BackendRequiresAsync` en lugar de
  bloquear.
- Errores tipados nuevos: `BackendRequiresAsync`, `BackendUnavailable`, `AuthRequired`,
  `NetworkError`.
- **Save Mode** en el Beasty Save Manager: Synchronous (por defecto, sin cambios) o Asynchronous
  para los puntos de entrada pensados para UnityEvent — `SaveAll`/`LoadAll`/`DeleteSlot`. Los
  backends en la nube siempre trabajan de forma asíncrona; elegir Synchronous con un backend en la
  nube sigue yendo por la vía asíncrona (nunca se pierde nada) y avisa una vez por sesión. Desde
  código se sigue eligiendo explícitamente con `*Now`/`*NowAsync`.
- Un inspector de verdad para el Beasty Save Manager: tarjeta de estado (backend activo, sesión de
  usuario, resultado del último guardado/carga), las dos decisiones al frente (Storage y Save Mode),
  todo lo demás tras un foldout de ajustes avanzados, y un botón a la ventana completa del Save
  Manager.
- La ventana del Save Manager ahora agrupa cada ajuste por función (Backend, Location, Security,
  Reliability, Versioning, Logging) con ayuda contextual: los campos que no aplican al backend
  activo se ocultan o deshabilitan con una nota, y activar el cifrado sin clave avisa de la clave
  compartida por defecto.
- Diagnóstico de cargas en nivel Verbose: cada carga registra cuánto texto devolvió el backend y
  cuántos ids/entradas guardables lleva el documento; cada operación en la nube registra el id de
  usuario resuelto; y una carga que no aplica nada ahora avisa con todo el detalle en lugar de
  terminar bien en silencio.
- Firestore: un documento de cabecera sin un recuento de trozos válido ahora falla como Corrupt
  data tipado en lugar de aflorar como un error de parseo confuso, y el registro Verbose dice si un
  snapshot vino del servidor o de la caché sin conexión del SDK.
- Suite de tests de Firebase en vivo (`BeastySaveSystem.Firebase.Tests`) que solo compila con el
  SDK de Firebase instalado — idas y vueltas reales a Firestore, frescura con doble lectura, inicio
  de sesión anónimo y detección de cabecera corrupta contra el proyecto configurado. Con puerta
  para las dos instalaciones: `versionDefines` para un paquete UPM, y los scripting defines
  globales gobernados por `FirebaseSdkDetector` para una instalación por `.unitypackage`. Cada paso
  de Firebase que se espera tiene un timeout duro que hace fallar el test nombrando el paso
  atascado, y la limpieza cede el control en lugar de bloquear: las finalizaciones de Firestore
  pasan por el hilo principal del editor, así que una espera bloqueante en el desmontaje dejaba el
  Test Runner colgado en un bloqueo infinito y sin logs.

### Cambiado

- El mensaje de error de archivo no encontrado de Load ahora nombra el slot en lugar de la ruta del
  archivo (un backend de almacenamiento puede no tener ruta de archivo en absoluto).
- `BeastySave.GetFolderPath`/`GetSlotPath` siguen describiendo solo la disposición de archivos
  locales; no se separan por usuario y no aplican a backends no locales.
- `BeastySaveManager.SaveAll`/`LoadAll`/`DeleteSlot` van por la vía asíncrona automáticamente en
  backends solo asíncronos (dispara y olvida; el resultado sigue llegando por
  `SaveCompleted`/`LoadCompleted` y `LastSaveResult`).

### Corregido

- Con el asset Beasty Console presente, `BeastySaveLog.Warning` ahora aflora como una advertencia de
  consola de verdad (antes se enlazaba a un canal con color de información, invisible para el filtro
  de advertencias).
- La etiqueta de estado del objeto de la demo ahora está conectada a los eventos de guardado y
  carga, así que un guardado o una carga fallidos en la escena de demo se anuncian en lugar de
  fallar en silencio.

### Compatibilidad

- Compila sin advertencias en todas las generaciones de Unity 6, incluida la 6.5, que marcó como deprecadas
  varias APIs que usaban los conversores y las búsquedas en escena. Los guardados de `Light` almacenan el
  tamaño del cookie direccional como `cookieSize2D` (un `Vector2`) en Unity 6.4+; un guardado escrito por una
  versión anterior sigue cargando — su `cookieSize` de tipo float se aplica como tamaño cuadrado. Los
  guardados de `Collider2D` dependen ahí solo de `compositeOperation` (que ya se guardaba junto al bool
  deprecado `usedByComposite` desde la 1.0.0), y un guardado antiguo que solo trae el bool sigue cargando:
  `true` se traduce a `Merge`. Las búsquedas en escena pasaron de `FindFirstObjectByType` a
  `FindAnyObjectByType` y a las sobrecargas sin ordenar de `FindObjectsByType` — resultados idénticos, cada
  búsqueda apuntaba a un solo objeto. En Unity 6.2/6.3 — donde `cookieSize` y `usedByComposite` ya están
  marcadas como deprecadas pero siguen siendo las APIs correctas (sus reemplazos llegaron en 6.4) — las
  advertencias de deprecación se suprimen en los puntos de llamada, así que esas versiones también importan
  sin advertencias.

## 1.0.0 — 27 de julio de 2026

Primera versión pública.

### Núcleo

- Guardado y carga por slots, síncronos y con `await`, con un objeto de resultado que devuelve cada llamada:
  un guardado que falla te dice por qué, en lugar de parecer uno que tuvo éxito.
- Motor JSON propio: **sin Newtonsoft, sin dependencias externas**.
- Escrituras atómicas (archivo temporal + intercambio), así que un crash a mitad de escritura no puede dejar
  un slot a medio escribir. El archivo temporal es único por escritura, así que dos escrituras sobre el mismo
  slot (un autoguardado que llega mientras el jugador guarda) no pueden pisarse el temporal.
- Copias de seguridad `.bak` por slot, y recuperación desde ellas cuando un slot está dañado. Un slot que
  falla su checksum o no se puede parsear nunca entra en la rotación de copias: se sobrescribe en el sitio,
  así que guardar encima de un slot corrupto conserva intacto el último `.bak` bueno.
- Los nombres de slot se validan: nombres vacíos, separadores de ruta, `..`, rutas absolutas y nombres de
  dispositivo reservados de Windows (`CON`, `NUL`, `COM1`…) devuelven un resultado `InvalidArgument` en lugar
  de escribir fuera de la carpeta de guardado o producir un archivo que el sistema operativo no puede abrir.
  `SaveFileInfo.GetFullPath(fileName)` aplica las mismas reglas y lanza `ArgumentException` ante un nombre
  que rechaza.
- Cifrado AES-256 opcional con IV aleatorio y clave derivada mediante SHA-256 a partir de cualquier string no
  vacío. Ofuscación, no seguridad real: la clave viaja dentro del juego, y la clave por defecto,
  `BeastySaveSettings.SharedDefaultEncryptionKey`, es pública — idéntica en cada copia del asset. Con el
  cifrado activado y sin una clave propia, el editor y los builds de desarrollo avisan una vez por sesión.

### Logging

- Un desplegable **Logging** en `BeastySaveManager`: `Auto` (activo en el editor y en builds de desarrollo,
  apagado en release), `On`, `Verbose`, `Off`. Cambiarlo en Play surte efecto al momento.
- Los guardados, cargas, borrados, restauraciones y migraciones lo dicen, con tamaño y tiempo. Sondear un
  slot que no existe — lo que hace una pantalla de ranuras de guardado con cada slot vacío cada vez que se
  abre — no dice nada; un `Load` real de un slot ausente sí avisa.
- Un slot que no pasa su checksum y por tanto se queda fuera de la rotación de copias de seguridad avisa —
  ese es el momento en que el `.bak` es la última copia del jugador.
- `SaveResult.BytesWritten` y `LoadResult.MigratedFrom`: el tamaño que escribió un guardado, y la versión
  desde la que migró una carga, para tu propia UI.
- Un solo logger, `BeastySaveLog`, con sink intercambiable.
- Los logs aterrizan en la ventana **Beasty Console** cuando ese asset está en el proyecto, y en la consola de
  Unity cuando no lo está. La detección es por reflexión, sin referencia de ensamblado en ninguna dirección,
  así que ninguno de los dos paquetes necesita al otro y cada uno se puede importar por separado.

### Estado de escena

- `BeastySaveable`: captura los componentes que marcas en un objeto — incluidos objetos inactivos, y varios
  componentes del mismo tipo en un mismo objeto.
- Objetos creados en runtime: `BeastySaveManager.Register(go, "tu.id.estable", components)` fija el id bajo el
  que se archivan sus datos, para que un cofre o un enemigo instanciado encuentre su estado en la siguiente sesión.
- La carga estricta es todo-o-nada en la escena completa: un fallo en un componente revierte los ya aplicados
  en lugar de dejar el mundo cargado a medias. La carga tolerante (`Strict = false`) omite el campo problemático
  y conserva el resto del componente.
- Un valor almacenado del tipo equivocado se reporta, nunca se sustituye en silencio por el valor en vivo:
  una carga estricta falla con `FieldMapFailed`, una tolerante omite el campo con una advertencia. Un miembro
  ausente — o almacenado como null — toma el valor por defecto.
- Módulos de conversores, cada uno condicionado al módulo de Unity que necesita, para que un proyecto sin él
  siga compilando: audio, uGUI, partículas, animación. Restaurar un `Slider` o un `Toggle` no dispara
  `onValueChanged`, así que cargar un guardado no vuelve a activar la lógica de juego conectada a ellos (SFX,
  cambios de volumen, callbacks).

### Editor

- El ensamblado de tests internos del asset solo compila cuando está definido el símbolo de scripting
  `BEASTY_DEV_TOOLS`, así que importar el asset no llena la ventana Test Runner con sus tests internos. Para
  ejecutarlos, agrega `BEASTY_DEV_TOOLS` en `Project Settings ▸ Player ▸ Scripting Define Symbols`.

### Plataformas

- Mono e IL2CPP (las rutas de reflexión que los builds AOT suelen romper están cubiertas por una escena de humo).
