---
title: "Historial de cambios"
description: "Todos los cambios relevantes de Beasty Save System, versión por versión. El proyecto sigue Semantic Versioning."
---

Todos los cambios relevantes de Beasty Save System. Este proyecto sigue [Semantic Versioning](https://semver.org/).

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
