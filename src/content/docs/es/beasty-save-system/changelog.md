---
title: "Historial de cambios"
description: "Resumen de lo que cambió en Beasty Save System, versión por versión. El proyecto sigue Semantic Versioning."
---

Resumen de lo que cambió en Beasty Save System, versión por versión. Cada novedad se explica a fondo en su
propia página de esta documentación. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.1.0 — 6 de agosto de 2026

### Nuevo
- **Guardado en la nube con Firebase.** Las partidas pueden ir a Firestore o a Realtime Database en vez de
  a un archivo local, con inicio de sesión anónimo automático. Los archivos locales siguen siendo la opción
  por defecto.
- **Tu propio almacenamiento.** Conecta cualquier otra base de datos o servidor.
- **Partidas por jugador.** Cada usuario con sesión iniciada tiene sus propias partidas, en la nube y en
  disco.
- **Partidas como texto, sin archivos**, para enviarlas a tu propio servidor.
- **Guardado asíncrono**, que se elige con el nuevo ajuste Save Mode.

### Mejorado
- Inspector nuevo para el Beasty Save Manager: lo importante va primero y el resto queda bajo Advanced
  settings.
- La ventana del Save Manager agrupa sus ajustes por función, con ayuda junto a cada uno.
- Mensajes más claros cuando una carga falla o no restaura nada.

### Corregido
- Los avisos aparecen como avisos de verdad cuando Beasty Console está instalado.
- La escena de demo informa cuando un guardado o una carga fallan.
- Compila sin avisos en todas las versiones de Unity 6, también en la 6.5.

## 1.0.0 — 27 de julio de 2026

Primera versión pública.

### Nuevo
- **Guardar y cargar por ranuras**, esperando el resultado o no, con un resultado claro en cada llamada.
- **Sin dependencias**: trae su propio motor JSON.
- **Guardados a prueba de cuelgues**, con copias de seguridad automáticas y recuperación de una ranura
  dañada.
- **Cifrado opcional** de los archivos de guardado.
- **Los objetos de la escena recuerdan su estado**: marca los componentes que quieres conservar, también en
  objetos creados durante la partida.
- **Registro** en modo Auto, On, Verbose u Off, que se muestra en Beasty Console cuando está instalado.
- Funciona con Mono e IL2CPP.
