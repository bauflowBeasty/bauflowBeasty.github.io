# Beasty Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir bauflowBeasty.github.io como sitio Astro estático: home escaparate de 3 productos Unity + documentación markdown-driven (~90 páginas) en EN/ES con tema claro/oscuro, buscador y CTAs de tienda.

**Architecture:** Astro 5 con content collections (`src/content/docs/{en,es}/<producto>/...`). Datos centralizados en `src/data/` (productos/tiendas, cadenas UI, sidebars). CSS propio con tokens en un solo archivo. Build y deploy vía GitHub Actions a GitHub Pages (user page, raíz, sin base path).

**Tech Stack:** Astro 5, TypeScript en archivos de datos, CSS vanilla con custom properties, @fontsource (fuentes self-hosted), Pagefind (búsqueda estática), GitHub Actions.

## Global Constraints

- Sitio: `https://bauflowbeasty.github.io` — user page, **sin** `base` en astro.config.
- Ningún archivo de código > ~200 líneas; si crece, dividir.
- Acento de marca: rojo carmín `#e62443` (logo). Único color de acento.
- Modo oscuro por defecto = preferencia del sistema; persistencia en localStorage clave `bauflow_theme`; idioma en `bauflow_lang` (compatibles con el sitio viejo).
- Inglés = idioma por defecto (rutas sin prefijo); español bajo `/es/...`.
- Identificadores de código (clases, métodos, keywords, rutas de menú Unity) NUNCA se traducen.
- Enlaces de tienda: array `storeLinks` por producto; URLs inexistentes → `url: null` (el componente los pinta como "Coming soon", deshabilitados).
- Sin CDNs externos: fuentes self-hosted, cero requests a terceros.
- Commits frecuentes, mensajes en inglés, footer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Scaffold Astro

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore` (añadir `node_modules/`, `dist/`, `.astro/`)
- Create: `src/pages/index.astro` (placeholder mínimo)

**Steps:**
- [ ] `npm create astro@latest . -- --template minimal --no-install --no-git` (o crear archivos a mano si el CLI no acepta directorio no vacío; en ese caso: `npm init -y` + `npm i astro` + archivos manuales)
- [ ] `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://bauflowbeasty.github.io',
});
```
- [ ] `npm install` y `npm run build` → build OK con página placeholder
- [ ] Commit: `chore: scaffold Astro project`

### Task 2: Design tokens y estilos base

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/typography.css`
- Deps: `npm i @fontsource-variable/bricolage-grotesque @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono`

**Interfaces (Produces):** variables CSS `--bg`, `--surface`, `--surface-raised`, `--text`, `--text-muted`, `--border`, `--accent`, `--accent-strong`, `--accent-soft`, escala `--space-*`, `--radius-*`, `--font-display`, `--font-body`, `--font-mono`. Selector de tema: `html[data-theme="light"|"dark"]`.

**Paleta (tokens.css):**
```css
/* Dark (default): carbón cálido, texto hueso */
:root, html[data-theme="dark"] {
  --bg: #191614; --surface: #211d1b; --surface-raised: #2a2523;
  --text: #f0eae3; --text-muted: #a89e95; --border: #3a3330;
  --accent: #e94560; --accent-strong: #e62443; --accent-soft: rgba(233,69,96,.12);
}
/* Light: papel cálido, tinta casi negra, rojo oscurecido para contraste AA */
html[data-theme="light"] {
  --bg: #faf6f0; --surface: #fffdf9; --surface-raised: #ffffff;
  --text: #221d19; --text-muted: #6d635b; --border: #e6dcd0;
  --accent: #c11f3b; --accent-strong: #a31931; --accent-soft: rgba(193,31,59,.08);
}
```
**Tipografía:** display **Bricolage Grotesque Variable** (titulares/marca), cuerpo **IBM Plex Sans**, código **IBM Plex Mono**.

- [ ] Escribir los 3 css + verificar contraste AA de `--accent` sobre `--bg` en light
- [ ] Commit: `feat: design tokens, base styles, self-hosted fonts`

### Task 3: BaseLayout + Header/Footer/ThemeToggle/LangSwitch

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/ThemeToggle.astro`, `src/components/LangSwitch.astro`
- Create: `src/scripts/theme-init.js` (inline en head, anti-FOUC: lee `bauflow_theme` → si no, `prefers-color-scheme` → set `data-theme` antes del primer paint)
- Copy: logos SVG a `src/assets/` (renombrar `logo-dark.svg`, `logo-light.svg`; se muestran/ocultan por tema con CSS)

**Interfaces (Produces):** `BaseLayout` props: `{ title: string, description: string, lang: 'en'|'es', altHref: string }` (altHref = URL de la misma página en el otro idioma, usada por LangSwitch y `<link rel="alternate" hreflang>`).

- [ ] Implementar; LangSwitch = enlaces EN|ES a `altHref` (no JS de re-render: cada idioma es una URL real). Guarda `bauflow_lang` al click.
- [ ] `npm run build` OK; probar en dev ambos temas
- [ ] Commit: `feat: base layout, header, theme toggle, language switch`

### Task 4: Capa de datos

**Files:**
- Create: `src/data/products.ts`, `src/data/ui-strings.ts`, `src/data/sidebars.ts`

**Interfaces (Produces):**
```ts
// products.ts
export type StoreLink = { store: 'unity' | 'itch' | string; label: string; url: string | null };
export type Product = {
  id: 'beasty-visual-novel' | 'beasty-save-system' | 'beasty-console';
  name: string; tagline: { en: string; es: string }; blurb: { en: string; es: string };
  storeLinks: StoreLink[]; docsEntry: string; // ruta de la primera página de docs
};
export const PRODUCTS: Product[];
// ui-strings.ts
export const UI: Record<'en'|'es', Record<string, string>>;
export function t(lang: 'en'|'es', key: string): string;
// sidebars.ts
export type SidebarGroup = { label: { en: string; es: string }; items: string[] }; // items = slugs relativos al producto
export const SIDEBARS: Record<Product['id'], SidebarGroup[]>;
```
- Taglines/blurbs: derivarlos de `Documentation/README.md` y los README de cada producto.
- `storeLinks` iniciales: unity y itch con `url: null` en los 3 productos.
- SIDEBARS: espejo del árbol real de carpetas (getting-started, guides/authoring/world/etc., reference, faq, troubleshooting) en el orden lógico de lectura de los README.

- [ ] Escribir los 3 archivos; commit: `feat: products, UI strings and sidebar data`

### Task 5: Content collections + migración EN

**Files:**
- Create: `src/content.config.ts`
- Create: `scripts/migrate-docs.mjs` (Node, se ejecuta una vez con `node scripts/migrate-docs.mjs`)
- Create (generado): `src/content/docs/en/<producto>/**/*.md` (~90 archivos)

**content.config.ts:**
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({ title: z.string(), description: z.string().optional() }),
});
export const collections = { docs };
```
**migrate-docs.mjs:** para cada `.md` de `Documentation/<producto>/`: extraer primer `# H1` → frontmatter `title` (y quitar el H1 del cuerpo, el layout lo pinta); reescribir enlaces relativos `](algo.md)` / `](../x/y.md)` → ruta absoluta del sitio `/docs/<producto>/<x>/<y>/` (resolver contra la ruta del archivo; `README.md` → índice del producto `/docs/<producto>/`); copiar a `src/content/docs/en/<producto>/...` (README.md → index.md). Ignorar `images/PLACEHOLDER.txt`; copiar `Documentation/README.md` fuera de la colección (su contenido alimenta la home, no una página).

- [ ] Escribir y ejecutar el script; revisar 3-4 archivos migrados a mano (frontmatter + enlaces)
- [ ] `npm run build` OK (la colección compila aunque aún no haya páginas que la consuman)
- [ ] Commit: `feat: migrate English docs into content collection` (incluye borrar `/Documentation` — la fuente de verdad pasa a `src/content/docs/en/`; `git add -A` la conserva en historial)

### Task 6: DocLayout + páginas de docs

**Files:**
- Create: `src/layouts/DocLayout.astro`, `src/components/DocSidebar.astro`, `src/components/TableOfContents.astro`, `src/components/BuyCta.astro`, `src/components/Breadcrumbs.astro`
- Create: `src/pages/docs/[...slug].astro` (EN) y `src/pages/es/docs/[...slug].astro` (ES; hasta Task 8 puede generar 404/placeholder si no existe la traducción)
- Create: `src/styles/doc.css` (3 columnas desktop → drawer móvil; estilos de prosa, tablas, callouts, código)

**Interfaces (Consumes):** `SIDEBARS`, `PRODUCTS`, `t()`, `BaseLayout`.
**Detalles:** grid `260px minmax(0,1fr) 220px`; sidebar sticky con grupos colapsables y página activa marcada; TOC desde `headings` de `render()`; `BuyCta` = franja compacta bajo el título con nombre del producto + botones de tienda (usa `StoreButtons` de Task 7 — si aún no existe, enlaces simples y se refactoriza en Task 7); código con Shiki tema dual (`github-dark-default`/`github-light` via `shikiConfig.themes` en astro.config + CSS que alterna por `data-theme`); drawer móvil = `<details>`/botón + overlay, sin framework.

- [ ] Implementar; `npm run build` genera ~90 páginas EN
- [ ] Probar en dev: navegación sidebar, TOC, tema, móvil (viewport estrecho)
- [ ] Commit: `feat: documentation layout and pages`

### Task 7: Home escaparate

**Files:**
- Create: `src/layouts/LandingLayout.astro`, `src/components/ProductCard.astro`, `src/components/StoreButtons.astro`, `src/components/EcosystemNote.astro`
- Create: `src/pages/index.astro` (reemplaza placeholder), `src/pages/es/index.astro`
- Create: `src/styles/landing.css`

**Contenido home:** hero (logo grande + H1 posicionamiento + subfrase "Unity tools…" desde ui-strings); 3 `ProductCard` (nombre, tagline, blurb, `StoreButtons`, enlace "Read the docs" → `docsEntry`); `EcosystemNote` = sección "How they fit together" (contenido del viejo `Documentation/README.md`: Save System dentro de Visual Novel, Debug Logger opcional, Unity 6000.2+, sin WebGL); footer con contacto (email del sitio viejo `index.html`).
**StoreButtons:** pinta cada `StoreLink`; `url: null` → botón deshabilitado "Coming soon" con `aria-disabled`; unity/itch con su marca textual ("Unity Asset Store", "itch.io"). Acepta prop `compact` para BuyCta.

- [ ] Implementar EN + ES; refactorizar BuyCta para usar StoreButtons compact
- [ ] `npm run build` OK; revisar visualmente ambos temas/idiomas
- [ ] Commit: `feat: storefront landing page`

### Task 8: Traducción ES (paralelizada con subagentes)

**Files:**
- Create: `src/content/docs/es/<producto>/**/*.md` (espejo 1:1 de `en/`)

**Procedimiento:** despachar subagentes en paralelo (Agent tool), un lote por área (~10-15 archivos por agente): visual-novel×4 (getting-started+raíz / authoring / world / production+scripting+reference), save-system×2, debug-logger×1. Prompt común: traducir al español neutro técnico; NO traducir identificadores de código, bloques de código (solo comentarios dentro sí), nombres de archivos/rutas, keywords VNBeasty, rutas de menú Unity; mantener frontmatter con `title` traducido; enlaces internos `/docs/...` → `/es/docs/...`; tono profesional cercano, tú (no usted).
- [ ] Despachar agentes y esperar; verificar conteo `en/` == `es/` (`(ls -Recurse src/content/docs/en -Filter *.md).Count`)
- [ ] `npm run build` → genera también las ~90 páginas `/es/docs/`
- [ ] Spot-check de 4-5 archivos (código intacto, enlaces con prefijo /es)
- [ ] Commit: `feat: full Spanish translation of docs`

### Task 9: Pagefind

**Files:**
- Modify: `package.json` (script `"build": "astro build && pagefind --site dist"`), dep `pagefind`
- Create: `src/components/Search.astro` (input en header de DocLayout; carga `/pagefind/pagefind-ui.js` generado localmente — no es CDN)

- [ ] Integrar; atributos `data-pagefind-body` en el contenido del doc y `lang` correcto por página para índices EN/ES separados
- [ ] `npm run build` + `npx serve dist` (o `astro preview`) → buscar un término EN y otro ES
- [ ] Commit: `feat: static search with Pagefind`

### Task 10: Deploy, redirects y retirada del sitio viejo

**Files:**
- Create: `.github/workflows/deploy.yml` (checkout → setup-node 22 → npm ci → npm run build → actions/upload-pages-artifact + actions/deploy-pages; permisos pages:write id-token:write)
- Create: `public/projects/save-system/index.html`, `public/projects/debug-logger/index.html` → `<meta http-equiv="refresh" content="0; url=/docs/<producto>/">` + link canonical
- Delete: `index.html`, `assets/`, `data/`, `projects/`, `HOW-TO-ADD-PROJECT.md` viejos (logos ya copiados a src/assets en Task 3)
- Create: `HOW-TO-ADD-PROJECT.md` nuevo (cómo: añadir página .md EN+ES, añadir producto en products.ts+sidebars.ts, rellenar URL de tienda, previsualizar con npm run dev, publicar con push)

- [ ] Nota: GitHub Pages del repo debe cambiarse de "deploy from branch" a "GitHub Actions" — si no se puede via `gh api`, dejarlo documentado para Álvaro como paso manual
- [ ] Commit: `feat: GitHub Actions deploy, redirects, remove legacy site`

### Task 11: Verificación final

- [ ] `npm run build` limpio
- [ ] Link-check: script rápido sobre `dist/` que verifique que cada `href` interno existe como archivo (`scripts/check-links.mjs`)
- [ ] Revisión visual completa (skill verify/run): home y 3-4 páginas de docs × {dark, light} × {en, es} + móvil
- [ ] Revisión con web-design-guidelines (accesibilidad: focus, contraste, aria del drawer/toggle)
- [ ] Actualizar memoria del proyecto (`project_bauflow_site.md`) con la nueva arquitectura
- [ ] Commit final + push

## Self-Review (hecho)

- Cobertura del spec: idiomas✓(T4,T8) build✓(T1,T10) tiendas flexibles✓(T4,T7) identidad✓(T2) home✓(T7) docs 3col+CTA✓(T6) buscador✓(T9) temas✓(T2,T3) redirects✓(T10) HOW-TO✓(T10) verificación✓(T11).
- Sin placeholders TBD; tipos consistentes entre T4 (produce) y T6/T7 (consumen).
- Riesgo conocido: `npm create astro` sobre directorio no vacío — mitigado con alternativa manual en T1.
