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

## Paso 3: Agregar las traducciones del nuevo proyecto

Las traducciones están modularizadas en `data/translations/`. Cada proyecto tiene un archivo por idioma.

### 3.1 Crear los archivos de traducción

Crea dos archivos nuevos (uno por idioma):

```
data/translations/en/inventory-system.js
data/translations/es/inventory-system.js
```

**Estructura de cada archivo** — en inglés (`en/inventory-system.js`):

```js
var _T_EN_INVENTORY = {
  // Usa la clave que quieras; aquí "inv" como ejemplo
  inv: {
    cover: {
      sub1: "Technical Documentation",
      // ... resto de claves de portada
    },
    sidebar: {
      heading: "Contents",
      s1: "1. Overview",
      // ...
    },
    s1: {
      title: "1. Overview",
      // ...
    }
    // ...
  }
};
```

En español (`es/inventory-system.js`), la misma estructura con variable `_T_ES_INVENTORY` y textos traducidos.

### 3.2 Registrar en el ensamblador

Abre `data/translations.js` y agrega las nuevas variables al `Object.assign` de cada idioma:

```js
var TRANSLATIONS = {
  en: Object.assign({},
    typeof _T_EN_SHARED    !== 'undefined' ? _T_EN_SHARED    : {},
    typeof _T_EN_SAVE      !== 'undefined' ? _T_EN_SAVE      : {},
    typeof _T_EN_DL        !== 'undefined' ? _T_EN_DL        : {},
    typeof _T_EN_INVENTORY !== 'undefined' ? _T_EN_INVENTORY : {}  // ← nuevo
  ),
  es: Object.assign({},
    typeof _T_ES_SHARED    !== 'undefined' ? _T_ES_SHARED    : {},
    typeof _T_ES_SAVE      !== 'undefined' ? _T_ES_SAVE      : {},
    typeof _T_ES_DL        !== 'undefined' ? _T_ES_DL        : {},
    typeof _T_ES_INVENTORY !== 'undefined' ? _T_ES_INVENTORY : {}  // ← nuevo
  )
};
```

### 3.3 Cargar los scripts en la página del proyecto

En `projects/inventory-system/index.html`, reemplaza el bloque de scripts de traducciones para incluir los módulos nuevos antes del ensamblador:

```html
<script src="/data/translations/en/shared.js"></script>
<script src="/data/translations/en/inventory-system.js"></script>
<script src="/data/translations/es/shared.js"></script>
<script src="/data/translations/es/inventory-system.js"></script>
<script src="/data/translations.js"></script>
<script src="/assets/js/i18n.js"></script>
```

> **Nota:** `shared.js` contiene nav, footer y home — siempre se carga en todas las páginas.
> Los módulos del proyecto solo se cargan en la página de ese proyecto.

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
