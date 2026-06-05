# Cómo agregar un nuevo proyecto

## Estructura general

Cada proyecto tiene dos partes:
1. Una entrada en `data/projects.js` — aparece en la home como tarjeta
2. Una carpeta en `projects/<nombre-del-proyecto>/` — contiene la documentación

---

## Paso 1: Agregar la tarjeta en la home

Abre `data/projects.js` y agrega un nuevo objeto al array `PROJECTS`.

```js
var PROJECTS = [
  // proyecto existente...
  {
    id:          "save-system",
    name:        "BeastySaveSystem",
    ...
  },

  // ← agrega el nuevo proyecto aquí, separado por coma:
  {
    id:          "inventory-system",        // identificador único (sin espacios)
    name:        "BeastyInventory",         // nombre mostrado en la tarjeta
    version:     "1.0.0",                   // versión
    description: "Descripción breve.",      // texto debajo del nombre
    tags:        ["Unity", "C#"],           // etiquetas (máximo 3-4)
    price:       "$12.99",                  // precio o "Gratis"
    freeDemo:    false,                     // true muestra badge "FREE Demo"
    docUrl:      "/projects/inventory-system/",  // ruta a la doc
    storeUrl:    "#"                        // enlace a Unity Asset Store
  }
];
```

Guarda el archivo. La nueva tarjeta aparecerá automáticamente en la home.

---

## Paso 2: Crear la carpeta de documentación

1. Crea la carpeta: `projects/inventory-system/`
2. Copia el archivo de documentación existente como base:
   ```
   projects/save-system/index.html  →  projects/inventory-system/index.html
   ```
3. Edita el nuevo `index.html`:
   - Cambia el `<title>` en el `<head>`
   - Cambia el título en `.doc-cover-title`
   - Actualiza la tabla `.doc-cover-meta` con los datos de tu proyecto
   - Reemplaza o actualiza los enlaces del sidebar `<nav class="doc-sidebar">`
   - Reemplaza el contenido de las `<section id="...">` con la documentación de tu proyecto

---

## Estructura de archivos resultante

```
projects/
├── save-system/
│   └── index.html        ← documentación del Save System
└── inventory-system/
    └── index.html        ← documentación del nuevo proyecto
```

---

## Para cambiar los colores del sitio

Abre `assets/css/base/variables.css`.

El archivo tiene dos bloques claramente etiquetados:
- `[data-theme="dark"]` — colores del modo oscuro
- `[data-theme="light"]` — colores del modo claro

Cada variable tiene un comentario que explica qué parte del sitio afecta.
Cambia el valor hexadecimal y todos los elementos que usan esa variable se actualizan solos.

---

## Para cambiar el nombre/logo

Busca `bau<span>flow</span>` en `index.html` y `projects/*/index.html`.

---

## Para agregar/editar links de contacto

En `index.html`, busca la sección `<section class="section contact-section" id="contact">`.
Cada `<a href="#">` es un enlace de contacto. Reemplaza el `#` con la URL real.
