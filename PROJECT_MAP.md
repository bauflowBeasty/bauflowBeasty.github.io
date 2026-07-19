# PROJECT_MAP.md — Mapa del proyecto

> **Regla:** Leer este archivo ANTES de cualquier búsqueda en el proyecto. Si un cambio agrega, mueve, renombra o elimina archivos/carpetas (o cambia el propósito de algo listado aquí), actualizar este mapa en el mismo turno.
>
> Última actualización: 2026-07-17

## Qué es este proyecto

Sitio de documentación y portfolio **Beasty Components** (marca de bauflow) hecho con **Astro 5**. Documenta 3 assets de Unity: **Beasty Save System**, **Beasty Visual Novel** y **Beasty Debug Logger**. Bilingüe EN/ES (inglés es el idioma canónico; español es traducción humanizada). Se publica en GitHub Pages (`https://bauflowbeasty.github.io`) vía GitHub Actions. Búsqueda con Pagefind (se indexa en el build).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (localhost:4321) |
| `npm run build` | Build a `dist/` + índice Pagefind |
| `npm run preview` | Previsualizar el build |
| `node scripts/check-links.mjs` | Verificar enlaces internos rotos |

## Estructura

```
astro.config.mjs          → Config Astro: site URL, temas Shiki (github-light/dark)
package.json              → Deps: astro 5, fuentes (Bricolage Grotesque, IBM Plex), pagefind, puppeteer-core
tsconfig.json             → Config TypeScript
HOW-TO-ADD-PROJECT.md     → Guía manual: cómo agregar un producto nuevo al sitio
PROJECT_MAP.md            → Este archivo
CLAUDE.md                 → Reglas para Claude: leer el mapa antes de buscar, mantenerlo actualizado

.claude/
├── settings.json         → Config del proyecto: hook PostToolUse que recuerda actualizar este mapa
├── settings.local.json   → Permisos locales (no se commitea)
└── hooks/project-map-reminder.mjs → Script del hook (detecta cambios estructurales)

.github/workflows/deploy.yml  → CI: build + deploy a GitHub Pages

src/
├── content.config.ts     → Define la colección de contenido `docs` (schema del frontmatter)
├── content/docs/
│   ├── en/               → Docs en inglés (canónico) — 3 productos, ~80 páginas
│   │   ├── beasty-save-system/    → getting-started/, guides/, advanced/, reference/, faq, troubleshooting, changelog, index
│   │   ├── beasty-visual-novel/   → getting-started/, authoring/, scripting/, world/, production/, reference/, faq, troubleshooting, changelog, index
│   │   └── beasty-debug-logger/   → guides/, reference/, getting-started, faq, index
│   └── es/               → Espejo 1:1 de en/ en español (mismas rutas y nombres de archivo)
├── data/
│   ├── products.ts       → Fuente de verdad de los productos: nombres, descripciones, precios, links de tienda, estado
│   ├── sidebars.ts       → Estructura de navegación lateral de las docs (por producto, EN y ES)
│   └── ui-strings.ts     → Strings de UI traducidos (labels, botones, textos fijos EN/ES)
├── layouts/
│   ├── BaseLayout.astro  → Layout raíz: <head>, fuentes, theme-init, header/footer
│   └── DocLayout.astro   → Layout de páginas de docs: sidebar + contenido + TOC + CTA compra
├── pages/
│   ├── index.astro           → Portada EN (usa LandingPage.astro)
│   ├── docs/[...slug].astro  → Ruta dinámica de todas las docs EN
│   └── es/                   → index.astro + docs/[...slug].astro (equivalentes ES)
├── components/
│   ├── LandingPage.astro     → Portada completa (hero, grid de productos) — compartida EN/ES
│   ├── Header.astro / Footer.astro
│   ├── DocSidebar.astro      → Sidebar de navegación de docs
│   ├── TableOfContents.astro → TOC de la página actual
│   ├── BuyCta.astro / StoreButtons.astro → Botones de compra (Asset Store / itch.io)
│   ├── ProductCard.astro     → Tarjeta de producto en la portada
│   ├── LangSwitch.astro / ThemeToggle.astro → Cambio idioma / tema claro-oscuro
│   ├── HeroScript.astro      → Animación/script del hero
│   └── EcosystemNote.astro   → Nota de integración entre productos Beasty
├── styles/
│   ├── tokens.css        → Design tokens (colores, espaciado, tipografía) — base del sistema visual
│   ├── base.css / typography.css → Reset + tipografía global
│   ├── landing.css       → Estilos de la portada
│   └── doc.css           → Estilos de páginas de documentación
├── scripts/theme-init.js → Anti-flash de tema (se ejecuta inline antes del render)
└── assets/               → logo-on-dark.svg, logo-on-light.svg

public/
├── docs-images/          → Capturas usadas en las docs, por producto (beasty-save-system/, beasty-visual-novel/, beasty-debug-logger/)
└── projects/             → Imágenes legacy de productos (save-system/, debug-logger/)

scripts/
├── check-links.mjs       → Chequeo de enlaces internos
└── migrate-docs.mjs      → Migración one-shot de docs viejas (histórico)

docs/  (documentación INTERNA del repo, no se publica)
├── changelogs/           → Changelogs fuente de los assets Unity (SaveSystem, VN)
├── superpowers/plans/    → Planes de implementación (2026-07-13 site-redesign)
├── superpowers/specs/    → Specs de diseño (redesign, portada/marca/humanización ES)
└── SCREENSHOTS.md        → Notas sobre capturas

projects/Inventory/       → Vacío (legacy)
dist/                     → Salida del build (generado, no editar)

DOC-UPDATES-Save-System-Logging-2026-07-17.md → Notas pendientes de actualización de docs (sin commit)
PLAN-DE-PRUEBAS-TESTER.md                     → Plan de pruebas manual (sin commit)
```

## Reglas clave del proyecto

- **EN es canónico**: todo cambio de contenido se hace primero en `src/content/docs/en/` y luego se refleja en `es/` (misma ruta de archivo).
- **Un producto nuevo** requiere tocar: `src/data/products.ts`, `src/data/sidebars.ts`, contenido en `en/` y `es/`, e imágenes en `public/docs-images/`. Ver `HOW-TO-ADD-PROJECT.md`.
- **La navegación lateral NO se genera sola**: agregar una página nueva exige registrarla en `src/data/sidebars.ts` (EN y ES).
- **Terminología ES**: unificada según spec `docs/superpowers/specs/2026-07-13-portada-marca-y-humanizacion-es-design.md` (p. ej. «cifrado», no «encriptación»).
