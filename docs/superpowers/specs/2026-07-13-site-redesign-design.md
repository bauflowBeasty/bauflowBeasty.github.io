# Rediseño UX/UI del sitio Beasty (bauflowbeasty.github.io) — Diseño

**Fecha:** 2026-07-13
**Estado:** Aprobado por Álvaro (con autorización para ejecutar de forma autónoma)

## Objetivo

Rediseñar por completo el sitio de documentación/portfolio de los paquetes Unity de bauflow.
El sitio muestra la documentación de 3 productos y dirige a los lectores a comprarlos en tiendas.
Conserva modo claro/oscuro y multi-idioma (EN/ES). Todo debe quedar modular: ningún archivo
monolítico, cada pieza fácil de localizar y modificar.

## Decisiones tomadas con el usuario

1. **Idiomas:** todo traducido EN/ES, incluido el contenido de las ~90 páginas de documentación.
   Claude genera la traducción inicial al español. Los identificadores de código (clases, métodos,
   keywords, nombres de assets) NO se traducen.
2. **Arquitectura:** generador estático **Astro** con build automatizado vía GitHub Actions.
   El flujo del usuario sigue siendo "editar .md + git push". Node solo es necesario en local
   para previsualizar (`npm run dev`).
3. **Tiendas:** Unity Asset Store + itch.io, URLs aún no existen (placeholders), y el modelo de
   datos debe admitir cualquier tienda de terceros futura: array `storeLinks` por producto.
4. **Identidad visual:** se conservan el logo y el rojo carmín (#e62443) como ancla de marca;
   todo lo demás (neutros, tipografía, jerarquía, espaciado) se rediseña alrededor de ese rojo.
5. **Home:** escaparate comercial — hero de marca, una tarjeta grande por producto con CTA de
   compra y de documentación, sección de cómo se complementan los productos.

## Productos

| id | Nombre | Docs origen |
|---|---|---|
| beasty-visual-novel | Beasty Visual Novel | Documentation/beasty-visual-novel (~60 páginas) |
| beasty-save-system | Beasty Save System | Documentation/beasty-save-system (~20 páginas) |
| beasty-console | Beasty Console | Documentation/beasty-console (~8 páginas) |

Relaciones (del README de Documentation): Save System se incluye dentro de Visual Novel;
Debug Logger es opcional para Save System (detección en runtime). Requisitos: Unity 6000.2+,
sin WebGL en 1.0.0.

## Estructura del proyecto

```
/
├── src/
│   ├── components/          # una pieza de UI por archivo
│   │   Header, Footer, ThemeToggle, LangSwitch, ProductCard,
│   │   StoreButtons, DocSidebar, TableOfContents, Search, BuyCta, ...
│   ├── layouts/
│   │   BaseLayout.astro     # head común, header, footer, scripts de tema/idioma
│   │   LandingLayout.astro  # home
│   │   DocLayout.astro      # sidebar + contenido + TOC
│   ├── content/docs/
│   │   en/<producto>/...    # fuente de verdad (migrado desde /Documentation)
│   │   es/<producto>/...    # espejo traducido
│   ├── data/
│   │   products.ts          # nombre, tagline, capturas, storeLinks[{store,label,url}]
│   │   ui-strings.ts        # cadenas de interfaz EN/ES
│   │   sidebars.ts          # orden/agrupación del menú de docs por producto
│   ├── styles/
│   │   tokens.css           # paleta y variables (única "tabla de colores")
│   │   base.css, typography.css, + css por componente
│   └── pages/               # /, /es/, /docs/[...slug], /es/docs/[...slug]
└── .github/workflows/deploy.yml
```

- `/Documentation` se migra a `src/content/docs/en/` (una sola copia en inglés + espejo es).
- Ningún archivo debe superar ~200 líneas; si crece, se divide.
- Los enlaces de tienda sin URL real quedan como placeholder claramente marcado en
  `products.ts` (un solo lugar que rellenar cuando existan).

## Dirección visual

- **Paleta:** rojo carmín #e62443 como único acento (CTAs de compra, enlaces activos,
  detalles). Modo oscuro: carbón cálido (no negro puro) + texto hueso. Modo claro: papel
  cálido (no blanco puro) + tinta casi-negra. Sin azul-gris de plantilla.
- **Tipografía:** display/serif con carácter para titulares + sans limpia para cuerpo +
  monospace de calidad para código C#. Evitar el combo genérico (Inter en todo).
- **Anti-plantilla:** sin degradados morados, sin glassmorphism, sin emojis como iconos;
  sombras y bordes sobrios, espaciado generoso.
- Todos los colores como variables CSS en `tokens.css`.

## Páginas y UX

- **Home:** hero (logo + posicionamiento), 3 tarjetas de producto (captura + tagline +
  "Comprar en…" + "Ver documentación"), sección "cómo encajan los 3", footer con contacto.
- **Docs:** 3 columnas en desktop (sidebar producto / contenido / TOC de página); drawer en
  móvil; CTA discreto y persistente de compra en cada página de doc.
- **Buscador:** Pagefind (estático, multi-idioma).
- **Tema:** toggle claro/oscuro, respeta `prefers-color-scheme`, persiste en localStorage.
- **Idioma:** selector EN|ES, persiste, URLs espejo `/es/...`, cada página enlaza a su
  equivalente traducida (hreflang).

## Migración y despliegue

1. Scaffold Astro + sistema de diseño.
2. Migrar los .md ingleses (frontmatter + enlaces internos ajustados a rutas del sitio).
3. Traducción completa a español.
4. Home nueva con `products.ts`.
5. GitHub Action de build+deploy a Pages. Retirar el sitio viejo (index.html, assets/, data/,
   projects/) dejando redirects desde las rutas antiguas `projects/<id>/` a las nuevas.

## Manejo de errores y verificación

- El build de Astro falla si hay .md con frontmatter inválido o enlaces rotos de content
  collections — esa es la primera barrera.
- Verificación final: build sin warnings relevantes, chequeo de enlaces internos, prueba
  visual de ambos temas e idiomas, Lighthouse razonable.
- `HOW-TO-ADD-PROJECT.md` se reescribe para el nuevo flujo (cómo añadir producto, página de
  doc, idioma y enlace de tienda).

## Fuera de alcance

- Generar capturas/imágenes reales de los productos (hay PLACEHOLDER.txt en images/).
- Publicación en las tiendas y URLs reales.
- Idiomas adicionales al EN/ES (el sistema queda preparado para añadirlos).
