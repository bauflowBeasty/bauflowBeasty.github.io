# PROJECT_MAP.md — Mapa del proyecto

> **Regla:** Leer este archivo ANTES de cualquier búsqueda en el proyecto. Si un cambio agrega, mueve, renombra o elimina archivos/carpetas (o cambia el propósito de algo listado aquí), actualizar este mapa en el mismo turno.
>
> Última actualización: 2026-08-06

## Qué es este proyecto

Sitio de documentación y portfolio **Beasty Components** (marca de bauflow) hecho con **Astro 5**. Documenta 3 assets de Unity: **Beasty Save System**, **Beasty Visual Novel** y **Beasty Console**. Bilingüe EN/ES (inglés es el idioma canónico; español es traducción humanizada). Se publica en GitHub Pages (`https://bauflowbeasty.github.io`) vía GitHub Actions. Búsqueda con Pagefind (se indexa en el build).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (localhost:4321) |
| `npm run build` | Build a `dist/` + índice Pagefind |
| `npm run preview` | Previsualizar el build |
| `npm run doc:links` | Verificar enlaces internos rotos (lee `dist/`: ejecutar DESPUÉS del build) |
| `npm run doc:index` | Regenerar `docs/DOC-INDEX.md` (índice de páginas y símbolos) |
| `npm run doc:sync` | Informar de qué documentación se ha quedado atrás respecto al proyecto Unity |
| `npm run doc:shots` | Regenerar `docs/SCREENSHOTS.md` (guion de capturas) desde las páginas + `docs/screenshots.json` |
| `npm run doc:pdf` | Generar los PDF de docs básicas por asset (lee `dist/`: ejecutar DESPUÉS del build) y copiarlos al proyecto Unity |

## Estructura

```
astro.config.mjs          → Config Astro: site URL, temas Shiki (github-light/dark)
package.json              → Deps: astro 5, fuentes (Bricolage Grotesque, IBM Plex), pagefind, puppeteer-core
tsconfig.json             → Config TypeScript
HOW-TO-ADD-PROJECT.md     → Guía manual: cómo agregar un producto nuevo al sitio
FLUJO-DE-TRABAJO.md       → Guía para Álvaro: cómo se mantiene la doc entre los dos proyectos (referencia humana)
PROJECT_MAP.md            → Este archivo (sí se versiona en el repo)
CLAUDE.md                 → Reglas para Claude (solo local: está en .gitignore, no se sube al repo)

.claude/                  → (solo local: está en .gitignore, no se sube al repo)
├── settings.json         → Config del proyecto: hook PostToolUse que recuerda actualizar este mapa
├── settings.local.json   → Permisos locales (no se commitea)
├── hooks/project-map-reminder.mjs → Script del hook (detecta cambios estructurales)
├── skills/sync-docs/SKILL.md → Comando /sync-docs: actualizar las docs desde el proyecto Unity
└── skills/release/SKILL.md   → Comando /release: publicar una versión de un asset (changelog + números)

.github/workflows/deploy.yml  → CI: build + deploy a GitHub Pages

src/
├── content.config.ts     → Define la colección de contenido `docs` (schema del frontmatter)
├── content/docs/
│   ├── en/               → Docs en inglés (canónico) — 3 productos, 89 páginas
│   │   ├── beasty-save-system/    → getting-started/, guides/, advanced/, reference/, faq, troubleshooting, changelog, index
│   │   ├── beasty-visual-novel/   → getting-started/, authoring/, scripting/, world/, production/, reference/, faq, troubleshooting, changelog, index
│   │   └── beasty-console/   → guides/, reference/, getting-started, faq, changelog, index
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
│   ├── contact.astro         → Página de contacto EN (usa ContactPage.astro)
│   ├── docs/[...slug].astro  → Ruta dinámica de todas las docs EN
│   └── es/                   → index.astro + contact.astro + docs/[...slug].astro (equivalentes ES)
├── components/
│   ├── LandingPage.astro     → Portada completa (hero, grid de productos) — compartida EN/ES
│   ├── ContactPage.astro     → Página de contacto: formulario de soporte vía Web3Forms — compartida EN/ES
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
└── docs-images/          → Capturas usadas en las docs, por producto (beasty-save-system/, beasty-visual-novel/, beasty-console/)

scripts/
├── check-links.mjs       → Chequeo de enlaces internos (lee dist/)
├── doc-index.mjs         → Genera docs/DOC-INDEX.md a partir de las páginas EN
├── sync-check.mjs        → Informa de desincronización con el proyecto Unity (changelogs + Plastic)
├── screenshots.mjs       → GENERA docs/SCREENSHOTS.md cruzando las páginas con docs/screenshots.json
└── build-pdf.mjs         → GENERA un PDF de docs básicas por asset desde dist/ (npm run doc:pdf, tras build)
                            y lo copia a Assets/BeastyComponents/<asset>/ del proyecto Unity

docs/  (documentación INTERNA del repo, no se publica)
├── changelogs/           → Copia local de los changelogs de los assets (SaveSystem, VN, Console)
├── DOC-INDEX.md          → GENERADO: página → secciones, y símbolo → páginas que lo documentan
├── sync-state.json       → Config de sync-check.mjs: ruta del proyecto Unity, cm.exe, assets
├── specs/2026-07-13-portada-marca-y-humanizacion-es-design.md → Spec de la portada/marca y la
│                           humanización ES: referencia viva de la terminología ES unificada
├── GUIA-ESTILO-DOCS.md   → Norma de estilo/estructura para toda página nueva o edición de prosa (EN canónico)
├── screenshots.json      → Catálogo de capturas: por imagen, prioridad, desde qué vista se toma y qué debe verse
├── SCREENSHOTS.md        → GENERADO (`npm run doc:shots`): guion de las 192 capturas, por producto y página
├── SCREENSHOTS-PENDIENTES.md → GENERADO (mismo comando): solo las capturas por hacer — las ⬜ pendientes
│                           y las 🔁 a rehacer (fichas con campo `rehacer` en screenshots.json: PNG tomado
│                           pero desactualizado; el campo se quita al sustituir el PNG)
└── GUIA-CAPTURAS.pdf     → Guía paso a paso (ES) para el colaborador externo que toma las capturas:
                            clonar, normas, flujo con doc:shots y entrega. Para enviar tal cual.

dist/                     → Salida del build (generado, no editar)
dist-pdf/                 → Salida de `npm run doc:pdf` (generado, no se commitea)
```

## Relación con el proyecto Unity

**Este repositorio es la única copia de la documentación** (desde 2026-07-21). El proyecto Unity real,
`E:\Beasty\BeastyVisualNovel`, ya no guarda documentación: su carpeta `Documentation/` se vació y solo
queda un `README.md` que apunta aquí. Antes había un árbol canónico duplicado ahí, y las dos copias se
desincronizaron en silencio en ambos sentidos.

Lo que sigue viviendo en el proyecto Unity, en `Assets/BeastyComponents/<asset>/` (es lo que viaja dentro
del `.unitypackage`):

| Archivo | Papel |
|---|---|
| `<Asset>_CHANGELOG.md` | **Canal de traspaso**: lo que se anota ahí es lo que hay que documentar aquí. Se copia a `docs/changelogs/` y se refleja en las páginas `<producto>/changelog.md` (EN + ES). |
| `README.md` | Presentación corta del paquete. |
| `<Asset>_LICENSE.md` | Licencia. |

El proyecto Unity tiene además su propio mapa de código, `docs/codemap/CODEMAP.md` (autogenerado, un archivo
por ensamblado), útil para localizar el código detrás de un cambio. Está bajo **Plastic SCM**, no git.

### Flujo de actualización

1. Álvaro cambia código en el proyecto Unity y anota el cambio en el `CHANGELOG` del asset.
2. Aquí se ejecuta el comando **`/sync-docs`** (`.claude/skills/sync-docs/SKILL.md`), que detecta lo
   pendiente con `npm run doc:sync`, localiza las páginas con `docs/DOC-INDEX.md`, edita EN + ES, y
   verifica con build + `doc:links` + `doc:index`.
3. Al publicar una versión: comando **`/release`** (`.claude/skills/release/SKILL.md`). Cada asset se
   versiona por separado; el sitio describe siempre la última versión (no hay docs versionadas); al publicar
   se elimina la sección `### Pre-release changes` del changelog. El número de versión vive en 4 sitios
   (changelog y README del asset en Unity, `products.ts`, páginas de changelog) y `npm run doc:sync`
   comprueba que coinciden.

Convención que sigue el contenido migrado del árbol antiguo (la migración one-shot ya se retiró):
H1 → `title`, enlaces relativos → rutas absolutas, imágenes → `/docs-images/<producto>/`.

## Reglas clave del proyecto

- **EN es canónico**: todo cambio de contenido se hace primero en `src/content/docs/en/` y luego se refleja en `es/` (misma ruta de archivo).
- **Un producto nuevo** requiere tocar: `src/data/products.ts`, `src/data/sidebars.ts`, contenido en `en/` y `es/`, e imágenes en `public/docs-images/`. Ver `HOW-TO-ADD-PROJECT.md`.
- **La navegación lateral NO se genera sola**: agregar una página nueva exige registrarla en `src/data/sidebars.ts` (EN y ES).
- **Para saber qué página documenta algo, usar `docs/DOC-INDEX.md`**, no abrir las 89 páginas: su índice
  inverso va de símbolo (`MigratedFrom`, `BeastySaveLog`…) a página. Son 65 KB: buscar con Grep, no leerlo
  entero. Regenerarlo con `npm run doc:index` después de tocar contenido.
- **Capturas**: cada imagen enlazada en una página tiene su ficha en `docs/screenshots.json` (prioridad,
  vista de Unity desde la que se toma, y qué estado hay que montar antes de disparar). Al documentar algo
  que se ve mejor en imagen se enlaza la captura en EN y ES aunque el PNG no exista todavía — se oculta
  sola al renderizar — y se regenera el guion con `npm run doc:shots`.
- **Terminología ES**: unificada según spec `docs/specs/2026-07-13-portada-marca-y-humanizacion-es-design.md` (p. ej. «cifrado», no «encriptación»).
