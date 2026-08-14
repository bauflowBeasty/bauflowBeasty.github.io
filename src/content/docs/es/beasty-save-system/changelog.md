---
title: "Historial de cambios"
description: "Todos los cambios relevantes de Beasty Save System, versión por versión. El proyecto sigue Semantic Versioning."
---

Todos los cambios relevantes de Beasty Save System. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.1.0 — 6 de agosto de 2026

### Añadido

- Backends de almacenamiento conectables: los guardados pueden ir a una base de datos en vez de a un
  archivo local. Los archivos locales siguen siendo el valor por defecto y no cambian; un backend
  propio implementa `IBeastySaveStorage`.
- Módulos de Firebase — Firestore (`firestore`), Realtime Database (`realtime-db`) e inicio de sesión
  anónimo automático — que solo se compilan si el SDK de Firebase está presente. Los guardados se
  almacenan por usuario.
- El editor mantiene los scripting defines `BEASTY_HAS_FIREBASE_*` sincronizados automáticamente
  según el SDK de Firebase aparece o desaparece del proyecto.
- Costura de identidad de usuario: `IBeastyUserProvider` / `BeastySaveUsers` deciden de quién son los
  guardados; `ScopeByUser` también separa los archivos locales por usuario.
- JSON sin archivos: `BeastySave.SaveToJson`/`LoadFromJson` y `ToJson`/`FromJson`, para endpoints
  propios.
- `SaveResult<T>`: un resultado tipado que lleva un valor, devuelto por las API de JSON y de lectura.
- Utilidades asíncronas de ranura: `ExistsAsync`, `DeleteAsync`, `ListSlotsAsync`, `ReadMetaAsync`,
  `RestoreBackupAsync`, `SaveAllNowAsync`/`LoadAllNowAsync`.
- Errores tipados nuevos: `BackendRequiresAsync`, `BackendUnavailable`, `AuthRequired`,
  `NetworkError`.
- **Save Mode** en el Beasty Save Manager: Synchronous (por defecto) o Asynchronous para los puntos
  de entrada pensados para UnityEvent. Los backends en la nube siempre operan de forma asíncrona.
- Un inspector de verdad para el Beasty Save Manager: tarjeta de estado, las decisiones de Storage y
  Save Mode delante, y todo lo demás tras un desplegable de ajustes avanzados.
- La ventana Save Manager agrupa cada ajuste por su papel (Backend, Location, Security, Reliability,
  Versioning, Logging), con ayuda contextual.
- Diagnóstico de cargas en el nivel Verbose; una carga que no aplica nada ahora avisa en vez de
  terminar bien en silencio.
- Firestore: un documento de cabecera sin un recuento de fragmentos válido falla como dato corrupto
  tipado, y el nivel Verbose dice si una instantánea vino del servidor o de la caché sin conexión.
- Suite de pruebas de Firebase en vivo, que solo se compila si el SDK de Firebase está instalado.

### Cambiado

- El mensaje de error de carga por archivo no encontrado nombra la ranura en vez de la ruta del
  archivo.
- `BeastySave.GetFolderPath`/`GetSlotPath` siguen describiendo solo la disposición de archivos
  locales.
- `BeastySaveManager.SaveAll`/`LoadAll`/`DeleteSlot` derivan a la vía asíncrona automáticamente en
  backends solo asíncronos.

### Corregido

- Con el asset Beasty Console presente, `BeastySaveLog.Warning` aparece como una advertencia de
  consola de verdad.
- La etiqueta de estado del objeto de la demo está conectada a los eventos de guardado y carga, así
  que un fallo en la escena de demo se informa a sí mismo.

### Compatibilidad

- Compila sin advertencias en todas las generaciones de Unity 6, incluida la 6.5, que deprecó APIs
  que usaban los conversores y las búsquedas de escena; los guardados escritos por versiones
  anteriores siguen cargando a través de esos cambios.

## 1.0.0 — 27 de julio de 2026

Primera versión pública.

### Núcleo

- Guardado y carga por ranuras, síncronos y esperables con await, con un objeto de resultado que
  devuelve cada llamada.
- Motor JSON propio: **sin Newtonsoft, sin dependencias externas**.
- Escrituras atómicas (archivo temporal + intercambio): un cierre inesperado a mitad de escritura no
  puede dejar una ranura a medias.
- Copias de seguridad `.bak` por ranura, y recuperación desde ellas cuando una ranura se daña; una
  ranura corrupta nunca entra en la rotación de copias.
- Los nombres de ranura se validan: separadores de ruta, `..`, rutas absolutas y nombres de
  dispositivo reservados vuelven como `InvalidArgument` en vez de escribir fuera de la carpeta de
  guardado.
- Cifrado AES-256 opcional. Ofuscación, no seguridad real: la clave viaja con el juego.

### Logging

- Un desplegable **Logging** en `BeastySaveManager`: `Auto`, `On`, `Verbose`, `Off`.
- Guardados, cargas, borrados, restauraciones y migraciones lo dicen, con tamaño y tiempos; sondear
  una ranura vacía queda en silencio.
- Una ranura que falla su checksum y queda fuera de la rotación de copias avisa.
- `SaveResult.BytesWritten` y `LoadResult.MigratedFrom`, para tu propia interfaz.
- Un solo logger, `BeastySaveLog`, con un destino conectable.
- Los logs aterrizan en la ventana de **Beasty Console** cuando ese asset está en el proyecto
  (detectado por reflexión), y en la consola de Unity cuando no.

### Estado de escena

- `BeastySaveable`: captura los componentes que marques en un objeto — objetos inactivos y
  componentes repetidos del mismo tipo incluidos.
- Objetos creados en ejecución: `BeastySaveManager.Register` fija el id bajo el que se archivan sus
  datos.
- La carga estricta es todo o nada en la escena entera; la carga tolerante salta el campo conflictivo
  y conserva el resto.
- Un valor almacenado con el tipo equivocado se informa, nunca se sustituye en silencio por el valor
  vivo.
- Módulos conversores (audio, uGUI, partículas, animación), cada uno condicionado al módulo de Unity
  que necesita. Restaurar un `Slider` o un `Toggle` no dispara `onValueChanged`.

### Editor

- El ensamblado de pruebas interno solo se compila con el scripting define `BEASTY_DEV_TOOLS`.

### Plataformas

- Mono e IL2CPP (las rutas de reflexión que las builds AOT suelen romper están cubiertas por una
  escena de prueba).
