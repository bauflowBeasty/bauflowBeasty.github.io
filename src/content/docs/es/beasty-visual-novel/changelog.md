---
title: "Historial de cambios"
description: "Todos los cambios relevantes de Beasty Visual Novel, versión por versión. El proyecto sigue Semantic Versioning."
---

Todos los cambios relevantes de Beasty Visual Novel. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.0.0 — sin publicar

Primera versión pública.

### Escritura de la historia

- Grafo de nodos (diálogo, elección, decisión, subgrafo, flujo) con un editor basado en bloques.
- Script de texto `.vnbeasty`: escribe escenas como un script estilo Ren'Py, sincronizado en ambos sentidos con
  el grafo. El grafo sigue siendo la fuente de verdad — un script vacío, imposible de parsear o irrepresentable
  nunca lo sobrescribe, y una importación destructiva deja un `.bak` con marca de tiempo.
- Vista previa en el editor de cualquier nodo, hasta cualquier bloque.

### Mundo

- Salas de mundo libre con fondos condicionales, puertas e interactuables.
- Tiempo de juego (momentos del día o reloj), rutinas de personajes con perfiles, y un editor de rutinas en
  cuadrícula.
- Misiones con etapas, objetivos, recompensas y un menú de conversación por personaje.

### Presentación

- Pantallas de diálogo, elecciones, backlog, historial, guardar/cargar, preferencias y ayuda, todas localizables.
- Tablas de localización con seguimiento de desactualización por celda e importación y exportación CSV/TSV.
- Streaming opcional de assets de nodos con Addressables (**beta**).

### Persistencia

- Guardados por slot con miniaturas, autoguardados, copias de seguridad y encriptación opcional.
- El estado de los objetos de escena (`BeastySaveable`) viaja dentro del guardado.
