---
title: "Historial de cambios"
description: "Resumen de lo que cambió en Beasty Console, versión por versión. El proyecto sigue Semantic Versioning."
---

Resumen de lo que cambió en Beasty Console, versión por versión. Cada novedad se explica a fondo en su
propia página de esta documentación. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.0.0 — 27 de julio de 2026

Primera versión pública.

### Nuevo
- **Once niveles de registro**, de info a exception, para que cada mensaje diga qué clase de mensaje es.
- **Solo los avisos, errores y excepciones cuentan como problemas** para Unity: los niveles más suaves
  nunca activan Error Pause.
- **Registros legibles en todas partes**: colores e iconos en el editor, texto plano en el log de una
  build.
- **Entradas en las que se puede hacer clic** y que señalan el objeto del que vienen.
- **La ventana Beasty Console**: filtros por nivel, búsqueda y trazas de pila que abren tu código en la
  línea exacta.
- **Sin dependencias**, en Mono e IL2CPP. Funciona por sí solo o junto a Beasty Save System.
