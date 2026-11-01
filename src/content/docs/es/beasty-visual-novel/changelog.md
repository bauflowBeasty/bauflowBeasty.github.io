---
title: "Historial de cambios"
description: "Resumen de lo que cambió en Beasty Visual Novel, versión por versión. El proyecto sigue Semantic Versioning."
---

Resumen de lo que cambió en Beasty Visual Novel, versión por versión. Cada novedad se explica a fondo en su
propia página de esta documentación. Este proyecto sigue [Semantic Versioning](https://semver.org/).

## 1.1.0 — 31 de octubre de 2026

### Nuevo
- **Transiciones y efectos de pantalla.** Fundidos, disoluciones, barridos, deslizamientos y más entre
  escenas, además de destellos, temblores, tintes, filtros de color, desenfoque y zoom de cámara, con
  ajustes listos para usar.
- **Personajes por capas y vestuario.** Monta expresiones por capas en el nuevo Expression Composer y
  cambia la ropa y los conjuntos durante la historia.
- **Personajes que hablan a la vez.** De dos a cinco personajes dicen la misma línea.
- **Avisos de estadísticas.** Aparece una nota breve cuando una estadística o una variable cambia durante
  la partida.
- **Pistas de la guía.** Las opciones pueden mostrar qué hacen con las estadísticas del jugador, que activa o
  desactiva las pistas en Preferencias.
- **Pantallas de teléfono.** Un smartphone listo para usar, con apps, y versiones de teléfono de las
  pantallas de menú, inventario y personajes.
- **Traduce los textos propios de tu juego**: textos del HUD, nombres de salas, misiones, nombres de
  estadísticas e ítems, en dos pestañas nuevas de Localización.
- **Opciones nuevas para el jugador**: reducir destellos y movimiento, y empezar con el auto-avance
  activado. Los botones de pantalla también pueden cambiar las preferencias del jugador.
- **House Demo: capítulo nuevo *Party night***, que luce el vestuario, los efectos, el teléfono, los avisos
  y las pistas.

### Mejorado
- **Aspecto nuevo para toda la UI del juego**: un estilo dibujado a mano de «tinta y papel», legible a
  cualquier resolución.
- Pantallas rediseñadas: Preferencias, guardar/cargar, lista de personajes, perfil del personaje e
  inventario.
- Los menús de conversación siempre terminan con la opción **Irse**, así que el jugador nunca se queda
  atrapado en una charla.
- La expresión por defecto de un personaje es la primera de su lista.
- La sección Screens es más cómoda: un solo menú para crear pantallas, arrastrar para reordenar, clic en la
  vista previa para seleccionar y deshacer en cada paso.
- La ventana Beasty VN se puede usar a cualquier ancho, con paneles laterales que puedes redimensionar.
- El idioma del jugador se mantiene al rebobinar o al cargar una partida.
- Los ajustes y las traducciones de los menús viven ahora en tu proyecto y se crean solos: un proyecto nuevo
  juega la House Demo sin preparar nada, y actualizar el paquete ya no sobrescribe tus traducciones.
- Los personajes en escena ahora se construyen por partes: los scripts propios que leen directamente el
  sprite de un personaje necesitan un ajuste.

### Corregido
- La vista previa de diálogo ya no muestra el escenario vacío tras algunas opciones, y ahora dibuja la caja
  de diálogo.
- La ventana de mundo libre ya no deshace lo que mueves a mano en el prefab de una sala.
- La vista previa de la sección Screens vuelve a mostrar el contenido de la pantalla.
- La caja de diálogo de serie ya no muestra un texto de relleno antes de la primera línea.

## 1.0.1 — 14 de agosto de 2026

### Corregido
- El editor de texto de los guiones ya no llena la consola de errores en proyectos creados con Unity 6.3 o
  posterior.

## 1.0.0 — 13 de agosto de 2026

Primera versión pública.

### Nuevo
- **Grafo de la historia** con un editor por bloques, y un guion de texto, al estilo de Ren'Py, que se
  mantiene sincronizado con el grafo.
- **Vista previa en vivo** de cualquier línea de la historia dentro del editor.
- **Salas de mundo libre** con puertas, objetos y personajes que siguen una rutina semanal a lo largo del
  día.
- **Tiempo de juego, misiones y menús de conversación** para cada personaje.
- **Pantallas de juego listas para usar**: diálogo, opciones, historial, guardar/cargar, preferencias y
  ayuda.
- **Localización**, con los menús ya traducidos a 15 idiomas, e importación y exportación en hoja de
  cálculo.
- **Guardado** con ranuras, miniaturas, autoguardados, copias de seguridad y cifrado opcional, también en la
  nube con Firebase.
- **Música para cada modo de juego**, y streaming opcional de los recursos pesados (beta).
- **House Demo**: un minijuego completo que enseña todas las piezas funcionando juntas.
- Incluye Beasty Save System y no necesita nada más.
