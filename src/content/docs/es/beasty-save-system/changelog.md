---
title: "Historial de cambios"
description: "Todos los cambios relevantes de Beasty Save System, versión por versión. El proyecto sigue Semantic Versioning."
---

Todos los cambios relevantes de Beasty Save System. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.0.0 — sin publicar

Primera versión pública.

### Núcleo

- Guardado y carga por slots, síncronos y con `await`, con un objeto de resultado que devuelve cada llamada:
  un guardado que falla te dice por qué, en lugar de parecer uno que tuvo éxito.
- Motor JSON propio: **sin Newtonsoft, sin dependencias externas**.
- Escrituras atómicas (archivo temporal + intercambio), así que un crash a mitad de escritura no puede dejar
  un slot a medio escribir.
- Copias de seguridad `.bak` por slot, y recuperación desde ellas cuando un slot está dañado.
- Encriptación AES-256 opcional con IV aleatorio y clave derivada mediante SHA-256. Ofuscación, no seguridad
  real: la clave viaja dentro del juego.

### Logging

- Un desplegable **Logging** en `BeastySaveManager`: `Auto` (activo en el editor y en builds de desarrollo,
  apagado en release), `On`, `Verbose`, `Off`. Cambiarlo en Play surte efecto al momento.
- Los guardados, cargas, borrados, restauraciones y migraciones ahora lo dicen, con tamaño y tiempo. Antes
  eran silenciosos: el sistema solo hablaba cuando algo fallaba.
- Un slot que no pasa su checksum y por tanto se queda fuera de la rotación de copias de seguridad ahora
  avisa en lugar de hacerlo calladamente — ese es el momento en que el `.bak` es la última copia del jugador.
- `SaveResult.BytesWritten` y `LoadResult.MigratedFrom`: el tamaño que escribió un guardado, y la versión
  desde la que migró una carga, para tu propia UI.
- Un solo logger en lugar de dos: el `DebugLogger` interno desaparece y todo pasa por `BeastySaveLog`, que
  tiene el sink intercambiable.

### Estado de escena

- `BeastySaveable`: captura los componentes que marcas en un objeto — incluidos objetos inactivos, y varios
  componentes del mismo tipo en un mismo objeto.
- Objetos creados en runtime: `BeastySaveManager.Register(go, "tu.id.estable", components)` fija el id bajo el
  que se archivan sus datos, para que un cofre o un enemigo instanciado encuentre su estado en la siguiente sesión.
- La carga estricta es todo-o-nada en la escena completa: un fallo en un componente revierte los ya aplicados
  en lugar de dejar el mundo cargado a medias. La carga tolerante (`Strict = false`) omite el campo problemático
  y conserva el resto del componente.
- Módulos de conversores, cada uno condicionado al módulo de Unity que necesita, para que un proyecto sin él
  siga compilando: audio, uGUI, partículas, animación.

### Plataformas

- Mono e IL2CPP (las rutas de reflexión que los builds AOT suelen romper están cubiertas por una escena de humo).

### Cambios previos al lanzamiento

Cambios de comportamiento hechos antes de que salga la 1.0.0. Los guardados escritos por builds anteriores
siguen cargando sin cambios.

- **Clave de encriptación.** La clave por defecto ahora es `BeastySaveSettings.SharedDefaultEncryptionKey` y
  está documentada como pública: viaja idéntica en cada copia del asset. Con la encriptación activada y sin una
  clave propia, el editor (y los development builds) ahora avisan una vez por sesión. El valor de la clave no
  cambió, así que los guardados encriptados con la clave por defecto siguen cargando.
- **Los nombres de slot** se validan en un solo sitio: nombres vacíos, separadores de ruta, `..`, rutas absolutas
  y nombres de dispositivo reservados de Windows (`CON`, `NUL`, `COM1`…) devuelven un resultado `InvalidArgument`
  en lugar de escribir fuera de la carpeta de guardado o producir un archivo que el sistema operativo no puede
  abrir. `SaveFileInfo.GetFullPath(fileName)` aplica las mismas reglas y lanza `ArgumentException` ante un nombre
  que rechaza (**breaking**: antes aceptaba cualquier cosa).
- **Las copias de seguridad** ya no rotan un slot dañado. Un archivo que falla su checksum o no se puede parsear
  se sobrescribe en el sitio, dejando el último `.bak` bueno donde está — guardar encima de un slot corrupto
  antes destruía la única copia recuperable.
- **Las escrituras atómicas** usan un archivo temporal único por escritura, así que dos escrituras sobre el mismo
  slot (un autoguardado que llega mientras el jugador guarda) ya no pueden pisarse el temporal.
- **Los conversores** reportan un valor almacenado del tipo equivocado en lugar de caer en silencio al valor en
  vivo: una carga estricta falla con `FieldMapFailed`, una tolerante omite el campo con una advertencia
  (**breaking** para conversores personalizados que dependían de que `ConverterUtil.Read*` se tragara el
  desajuste). Un miembro ausente — o almacenado como null — sigue tomando el valor por defecto.
- **uGUI:** restaurar un `Slider` o un `Toggle` ya no dispara `onValueChanged`, así que cargar un guardado no
  vuelve a activar la lógica de juego conectada a ellos (SFX, cambios de volumen, callbacks).
- **Eliminado** `PasswordGenerator`, que no se usaba, no estaba documentado y estaba sesgado (**breaking**).
  Cualquier string no vacío sirve como clave de encriptación; el cifrador deriva la clave AES a partir de él
  con SHA-256.
- **El logging ahora es más silencioso por defecto.** Los volcados de rutas de archivo (`File Path: …`,
  `Folder Path …`) que antes se imprimían con cada operación de archivo en el editor ahora son solo del nivel
  Verbose. Y sondear un slot que no existe — lo que hace una pantalla de ranuras de guardado con cada slot
  vacío cada vez que se abre — ya no registra una advertencia por slot; un `Load` real de un slot ausente
  sigue avisando.
