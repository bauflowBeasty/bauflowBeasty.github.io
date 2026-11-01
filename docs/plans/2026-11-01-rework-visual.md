# Rework visual del sitio — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cambiar todo el aspecto visual del sitio (paleta «Rojo protagonista», movimiento «modo juego», Unbounded + Manrope) y prepararlo para muchos proyectos de varias plataformas: proyecto destacado + catálogo con filtros dinámicos y widgets de tienda con permiso, sin tocar ni un texto de contenido.

**Architecture:**
- **Lógica pura** (catálogo, widgets, consentimiento, callouts, ángulos de inclinación) en módulos TS/JS sin dependencias de Astro. Se prueba con `node --test`; Node 24 ejecuta `.ts` directamente.
- **Componentes Astro** solo para la presentación, con scripts cliente pequeños por componente.
- **Verificación de la salida:**
  - tests que leen el HTML de `dist/`;
  - `scripts/ui-check.mjs`, que sirve `dist/` y recorre páginas, anchos y temas con el Chrome del sistema (puppeteer-core, ya instalado), comprobando desbordes, errores JS y movimiento reducido, y guardando capturas.

**Tech Stack:** Astro 5, CSS con tokens, TypeScript, `node:test`, puppeteer-core, Pagefind, `@fontsource-variable/{unbounded,manrope,jetbrains-mono}`.

**Spec:** `docs/specs/2026-11-01-rework-visual-design.md`. Léela antes de cada tarea; las secciones citadas (§) son de ahí.
**Maquetas de referencia** (locales): `.superpowers/brainstorm/874-1793550757/content/`:
- `juice.html`, nivel 3: movimiento
- `docs.html`, variante A: docs
- `layout-v2.html`: portada
- `widgets.html`, opción A: widgets
- `typography.html`, opción A: tipografía

## Global Constraints

- **Rama `Develop`. Nunca ejecutar `git commit`, push, merge ni amend: todos los commits los hace Álvaro a mano.** Cada paso «Commit» de este plan significa **avisar a Álvaro** con la lista de archivos de la tarea y el mensaje sugerido (en español), y no empezar la tarea siguiente hasta que confirme. El paso a `main` lo hace él cuando Unity apruebe VN 1.1.0.
- **Ningún texto existente cambia:**
  - Ni `src/content/docs/**`, ni los valores actuales de `src/data/ui-strings.ts`, ni `name`/`tagline`/`blurb`/`label` de `src/data/products.ts`.
  - Las strings nuevas de interfaz se añaden en EN **y** ES.
  - El test `content-guard` (Tarea 1) lo vigila.
- **Contraste AA** (≥ 4.5:1 en texto) en ambos temas. El test `contrast` (Tarea 4) lo vigila.
- **Movimiento:**
  - Con `prefers-reduced-motion: reduce` no corre ninguna animación ni transición; lo comprueba `ui-check`.
  - Las animaciones de entrada usan `animation-fill-mode: backwards`, **nunca `both`/`forwards`**: un `transform` retenido anula después los efectos de hover.
- **Sin JS el sitio está completo:**
  - catálogo visible;
  - filtros ocultos;
  - menús con `<details>`;
  - widgets como enlaces a la tienda.
- **Módulos importados por tests** (`src/data/*.ts`, `src/lib/*.ts`, `src/plugins/*.mjs`):
  - No importan nada de Astro, `astro:*` ni imágenes.
  - Entre sí usan `import type` o, si necesitan un valor, la ruta con extensión **`.ts` explícita** (Vite y Node la resuelven).
- **No romper:**
  - `npm run build` (incluye Pagefind)
  - `npm run doc:links`
  - `npm run doc:pdf`: depende de `<article class="doc-content"`, del `<p … doc-crumb>` y de `<aside class="buy-cta"`
  - el cajón móvil de docs
  - el script anti-flash de tema
- **Reglas del repo:**
  - Toda tarea que cree, mueva o borre archivos actualiza `PROJECT_MAP.md` (estructura + fecha «Última actualización») en su mismo commit.
  - No editar `dist/`.
- **Paleta fija** (de §6.1, ajustada para AA, ya verificada):

| Token | Oscuro | Claro |
|---|---|---|
| `--bg` | `#121212` | `#f7f7f5` |
| `--surface` | `#1a1a1a` | `#ffffff` |
| `--surface-raised` | `#222222` | `#f0f0ee` |
| `--surface-code` | `#0b0b0b` | `#0b0b0b` |
| `--border` / `--border-strong` | `#2c2c2c` / `#3a3a3a` | `#e3e3e0` / `#cfcfcb` |
| `--text` / `--text-muted` / `--text-faint` | `#f2f2f2` / `#a0a0a0` / `#858585` | `#151515` / `#5a5a5a` / `#6b6b6b` |
| `--accent` (rellenos con texto blanco) | `#d91e3f` | `#d11a39` |
| `--accent-strong` (decorativo: barras, contornos, brillo) | `#e62443` | `#d11a39` |
| `--accent-text` (enlaces) | `#ff5a72` | `#c0122f` |
| `--accent-soft` | `rgba(230,36,67,.12)` | `rgba(209,26,57,.08)` |
| `--accent-on` | `#ffffff` | `#ffffff` |
| `--brand-surface` (bloque destacado) / `--brand-on` | `#d91e3f` / `#ffffff` | `#d11a39` / `#ffffff` |
| `--brand-ink` (pastillas negras sobre rojo) | `#121212` | `#121212` |
| `--code-inline` | `#ff8a9b` | `#b3102b` |
| `--note` / `--note-soft` | `#9fb3c8` / `rgba(159,179,200,.10)` | `#3d5a73` / `rgba(61,90,115,.08)` |
| `--warn` / `--warn-soft` | `#e0a43a` / `rgba(224,164,58,.10)` | `#8a5a00` / `rgba(138,90,0,.09)` |

  Nota: el blanco sobre `#e62443` (rojo del logo) da 4.47:1 (no pasa), por eso los rellenos con texto usan `#d91e3f`. La etiqueta «NUEVO · vX» va como **pastilla `--brand-ink` con texto blanco**, no como texto negro sobre rojo.
- **Easing y duración:**
  - `--ease-out: cubic-bezier(.22,1,.36,1)`
  - `--ease-bounce: cubic-bezier(.34,1.56,.64,1)`
  - `--dur-fast: 140ms`, `--dur-base: 220ms`, `--dur-slow: 450ms`
- **Fuentes:**
  - `--font-display: 'Unbounded Variable', system-ui, sans-serif`
  - `--font-body: 'Manrope Variable', system-ui, sans-serif`
  - `--font-mono: 'JetBrains Mono Variable', ui-monospace, Consolas, monospace`
- **Strings nuevas** (claves exactas; EN / ES). `{store}` se sustituye en el componente.

| Clave | EN | ES |
|---|---|---|
| `nav.projects` | Projects | Proyectos |
| `search.open` | Search | Buscar |
| `search.close` | Close search | Cerrar búsqueda |
| `catalog.all` | All | Todo |
| `catalog.filterLabel` | Filter by platform | Filtrar por plataforma |
| `catalog.others` | Other projects | Otros proyectos |
| `featured.new` | New | Nuevo |
| `where.heading` | Where to get it | Dónde conseguirlo |
| `widget.show` | Show {store} widget | Mostrar widget de {store} |
| `widget.notice` | Loads content from {store}, which may set cookies. | Carga contenido de {store}, que puede usar cookies. |
| `widget.remember` | Remember my choice | Recordar mi elección |
| `widget.revoke` | Stop loading store widgets automatically | Dejar de cargar los widgets automáticamente |
| `code.copy` | Copy | Copiar |
| `code.copied` | Copied! | ¡Copiado! |
| `docs.projectSwitch` | Switch project | Cambiar de proyecto |
| `ecosystem.includes` | includes | incluye |
| `ecosystem.optional` | optional | opcional |

## Review Focus

1. **Proyecto sin portada** (aún no hay imagen en `src/assets/covers/`). Tarjeta, destacado, menú y página de proyecto muestran un marcador (rombo rojo con la inicial), nunca una imagen rota. Lo prueba el test guiado por datos de la Tarea 8, que se ejerce de verdad en el ensayo de la Tarea 12 con productos sin portada.
2. **Sin JS o con un script roto:**
   - catálogo completo con el destacado oculto en «Todo»;
   - filtros no visibles;
   - «Proyectos» y el selector de docs funcionan como `<details>`;
   - los widgets son enlaces a la tienda.
   - Lo prueban los tests de `dist/` de las Tareas 6, 7 y 9.
3. **`localStorage` bloqueado** (modo privado o navegador estricto). Nada lanza error; el widget carga al pulsar, pero no se recuerda. Lo prueba la Tarea 2 (`consent` con un storage que lanza).
4. **Nombres largos a 375 px.** «Beasty Visual Novel» en Unbounded, o un nombre ficticio largo, no provocan scroll horizontal. Lo vigila la aserción de desborde de `ui-check` (Tarea 3), y la Tarea 12 añade un nombre largo de ensayo.
5. **Cambiar de tema con widgets ya cargados.** Los iframes pasan a su variante clara u oscura sin recargar la página y sin desbordar a 375 px. Lo prueban la Tarea 2 (URLs por tema) y `ui-check --consent` (Tarea 9).

---

### Tarea 1: Arnés de tests y guardia de contenido

**Files:**
- Create: `scripts/content-baseline.mjs`, `tests/fixtures/content-baseline.json` (generado), `tests/unit/content-guard.test.mjs`, `tests/dist/helpers.mjs`
- Modify: `package.json` (scripts), `PROJECT_MAP.md`

**Interfaces:**
- Produces:
  - `npm test` → `node --test "tests/unit/**/*.test.mjs"`
  - `npm run test:dist` → `node --test "tests/dist/**/*.test.mjs"`
  - `npm run content:baseline` → regenera la línea base. Solo se usa si Álvaro cambia contenido a propósito, por ejemplo con `/sync-docs` en mitad del rework.
  - `tests/dist/helpers.mjs`:
    - `page(route: string): string` → contenido de `dist${route}index.html`, con `route` acabado en `/`. Lanza un error claro si falta `dist/`.
    - `count(html: string, re: RegExp): number`

- [ ] **Step 1: Escribir `scripts/content-baseline.mjs`.** Importa `../src/data/ui-strings.ts` (`UI`) y `../src/data/products.ts` (`PRODUCTS`) y escribe `tests/fixtures/content-baseline.json` con:
  - `ui`: copia completa de `UI`;
  - `products`: `{ [id]: { name, tagline, blurb, labels: storeLinks.map(l => l.label) } }`;
  - `docsHash`: sha256 hex sobre la concatenación, ordenada por ruta relativa con `/`, de `ruta + "\0" + bytes` de cada archivo bajo `src/content/docs`.
- [ ] **Step 2: Generar la línea base.** Run: `npm run content:baseline`. Expected: crea `tests/fixtures/content-baseline.json` con 2 idiomas en `ui`, 3 productos y un `docsHash` de 64 caracteres hex.
- [ ] **Step 3: Escribir `tests/unit/content-guard.test.mjs`.** Recalcula los tres valores con la misma lógica, importando una función exportada `computeBaseline()` del script; el script solo escribe el JSON si se ejecuta directamente. Tests:
  - `every baseline UI string is unchanged`: para cada idioma y cada clave de la base, `UI[lang][key] === base.ui[lang][key]`. Las claves nuevas están permitidas.
  - `product texts are unchanged`: `name`, `tagline`, `blurb` y `labels` iguales por id. Ids nuevos permitidos.
  - `docs content is unchanged`: `docsHash` igual. Si falla, el mensaje dice: «Si el cambio de contenido es intencionado, ejecuta npm run content:baseline».
- [ ] **Step 4: Ejecutar.** Run: `npm test`. Expected: 3 tests PASS.
- [ ] **Step 5: Comprobar que el guardia muerde.** Cambia temporalmente un carácter de `hero.title` (EN), ejecuta `npm test` (Expected: FAIL en `every baseline UI string is unchanged`) y revierte con `git checkout src/data/ui-strings.ts`.
- [ ] **Step 6: Punto de commit (lo hace Álvaro).** Avisar (incluye `PROJECT_MAP.md` con `tests/` y el script nuevo) con el mensaje sugerido «test: arnés node:test y guardia de contenido para el rework»; esperar su confirmación.

### Tarea 2: Modelo de datos y lógica pura (catálogo, widgets, consentimiento)

**Files:**
- Create:
  - `src/data/platforms.ts`, `src/data/stores.ts`
  - `src/lib/catalog.ts`, `src/lib/widgets.ts`, `src/lib/consent.ts`
  - `src/data/covers.ts`, `src/assets/covers/<id>.png` (×3)
  - tests: `tests/unit/catalog.test.mjs`, `tests/unit/widgets.test.mjs`, `tests/unit/consent.test.mjs`, `tests/unit/products.test.mjs`
- Modify: `src/data/products.ts`, `src/data/sidebars.ts:27` (tipo de `SIDEBARS`), `src/components/DocSidebar.astro:8` (tipo de `productId` → `string`), `PROJECT_MAP.md`

**Interfaces:**
- Produces (exactas; las tareas siguientes las usan):

```ts
// src/data/platforms.ts
export const PLATFORMS = { unity: { label: 'Unity' }, android: { label: 'Android' }, ios: { label: 'iOS' }, pc: { label: 'PC' } } as const;
export type PlatformId = keyof typeof PLATFORMS;
export const PLATFORM_ORDER: PlatformId[]; // ['unity','android','ios','pc']

// src/data/stores.ts
export const STORES: Record<StoreId, { label: string; widget: WidgetKind | null }>;
export type StoreId = 'unity' | 'itch' | 'google-play' | 'app-store' | 'steam';
export type WidgetKind = 'unity' | 'itch';

// src/data/products.ts (cambios)
export type StoreLink = { store: StoreId; label: string; url: string | null; widgetId?: string };
export type Product = { id: string; name: string; version: string; tagline: Record<Lang,string>; blurb: Record<Lang,string>;
  platforms: PlatformId[]; featured?: boolean; storeLinks: StoreLink[]; docsEntry?: string };

// src/lib/catalog.ts
export type Filter = 'all' | PlatformId;
export function getFeatured(products: readonly Product[]): Product;           // featured:true o, si no hay, products[0]; lanza Error('No products') si vacío
export function platformFilters(products: readonly Product[]): { id: PlatformId; count: number }[]; // en PLATFORM_ORDER; [] si hay < 2 plataformas distintas
export function isCardVisible(card: { platforms: readonly string[]; featured: boolean }, filter: Filter): boolean;
export function projectHref(product: { id: string; docsEntry?: string }, lang: Lang): string; // docs → prefijo+docsEntry; sin docs → `${prefijo}/projects/${id}/`; prefijo '' (en) | '/es'

// src/lib/widgets.ts
export type Theme = 'dark' | 'light';
export function unityWidget(packageId: string, theme: Theme, size: 'wide' | 'narrow'): { src: string; width: number; height: number };
export function itchWidget(gameId: string, theme: Theme): { src: string; width: number; height: number };

// src/lib/consent.ts
export const CONSENT_KEY = 'beasty_widgets_consent';
type KV = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export function hasConsent(storage: KV | null): boolean;    // nunca lanza
export function rememberConsent(storage: KV | null): void;  // guarda 'granted'; nunca lanza
export function revokeConsent(storage: KV | null): void;    // nunca lanza

// src/data/covers.ts (solo Vite; NO lo importan tests)
export function getCover(id: string): ImageMetadata | undefined; // import.meta.glob('../assets/covers/*.{png,jpg,jpeg,webp}', { eager: true })
```

- [ ] **Step 1: Escribir los tests que fallan.**
  - `catalog.test.mjs`, con productos falsos A(`['unity']`), B(`['android','ios']`, `featured:true`), C(`['pc','unity']`):
    - `getFeatured` → B; sin ninguno marcado → el primero; `[]` → lanza.
    - `platformFilters([A,B,C])` → `[{unity,2},{android,1},{ios,1},{pc,1}]`; `platformFilters([A])` → `[]`.
    - `isCardVisible({platforms:['unity'],featured:true},'all')` → `false`; `(…,'unity')` → `true`; `({platforms:['android','ios'],featured:false},'ios')` → `true`; `(…,'pc')` → `false`.
    - `projectHref({id:'x',docsEntry:'/docs/x/'},'es')` → `'/es/docs/x/'`; `projectHref({id:'y'},'en')` → `'/projects/y/'`.
  - `widgets.test.mjs`:
    - `unityWidget('393138','dark','wide')` → `{src:'https://assetstore.unity.com/linkmaker/embed/package/393138/widget-wide', width:600, height:130}`.
    - `('393138','light','wide')` → `…/widget-wide-light`.
    - `('393138','dark','narrow')` → `…/widget`, 202×260; `('393138','light','narrow')` → `…/widget-light`.
    - `itchWidget('4897713','dark')` → `{src:'https://itch.io/embed/4897713?linkback=true&dark=true', width:552, height:167}`; `('4897713','light')` → `src` sin `&dark=true`.
  - `consent.test.mjs`:
    - Con un `Map` falso: `hasConsent` es `false` → `rememberConsent` → `true` → `revokeConsent` → `false`.
    - Con un storage cuyos métodos lanzan, y con `null`: las tres funciones no lanzan y `hasConsent` devuelve `false`.
  - `products.test.mjs`, sobre los `PRODUCTS` reales:
    - ids únicos;
    - `platforms` no vacío y con claves de `PLATFORMS`;
    - cada `store` es clave de `STORES`;
    - todo enlace con `url` cuya tienda tenga `widget` lleva `widgetId`;
    - como máximo un `featured`.
- [ ] **Step 2: Ejecutar.** Run: `npm test`. Expected: FAIL (módulos inexistentes).
- [ ] **Step 3: Implementar `platforms.ts`, `stores.ts`, `catalog.ts`, `widgets.ts`, `consent.ts`** con las firmas de arriba.
  - Etiquetas de `STORES`: `'Unity Asset Store'`, `'itch.io'`, `'Google Play'`, `'App Store'`, `'Steam'`.
  - `widget`: `unity → 'unity'`, `itch → 'itch'`, el resto `null`.
- [ ] **Step 4: Ampliar `products.ts` sin tocar textos.**
  - `platforms: ['unity']` en los tres productos.
  - `featured: true` en Visual Novel.
  - `widgetId` en cada enlace: Visual Novel unity `'393138'` / itch `'4897713'`; Save System `'301626'` / `'4790139'`; Console `'386438'` / `'4846251'`.
  - En la cabecera del archivo, comentario: «el orden del array es el orden del catálogo; el primero es el destacado si ninguno lleva `featured`». Esto sustituye a la «fecha de lanzamiento» de §6.6 sin inventar fechas.
  - `SIDEBARS: Record<string, SidebarGroup[]>`.
- [ ] **Step 5: Portadas.**
  - Para cada producto, descargar la imagen `og:image` de su página de itch.io (`https://beastycomponents.itch.io/<slug>`, meta `property="og:image"`) a `src/assets/covers/<product.id>.png`.
  - Implementar `src/data/covers.ts`.
- [ ] **Step 6: Ejecutar.** Run: `npm test && npm run build`. Expected: todos los tests PASS; build sin errores.
- [ ] **Step 7: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «feat: modelo de plataformas/tiendas, lógica de catálogo, widgets y consentimiento»; esperar su confirmación.

### Tarea 3: Herramienta `ui-check` (capturas + aserciones en navegador)

**Files:**
- Create: `scripts/lib/chrome.mjs`, `scripts/lib/serve-dist.mjs`, `scripts/ui-check.mjs`
- Modify: `scripts/build-pdf.mjs` (usar `findChrome` compartido), `package.json` (`"ui:check": "node scripts/ui-check.mjs"`), `.gitignore` (`dist-shots/`), `PROJECT_MAP.md`

**Interfaces:**
- Produces:
  - `findChrome(): string`: se mueve tal cual desde `build-pdf.mjs`, respetando `BEASTY_CHROME`.
  - `serveDist(dir = 'dist', port = 0): Promise<{ url: string; close(): Promise<void> }>`:
    - servidor estático con `node:http`;
    - `/ruta/` → `index.html`;
    - tipos para html, css, js, mjs, svg, png, jpg, webp, woff2, json y wasm; el resto como `application/octet-stream` (Pagefind sirve `.pf_*`);
    - 404 si no existe.
  - CLI `node scripts/ui-check.mjs [--consent] [--routes /a/,/b/]`:
    - Rutas por defecto: `/`, `/es/`, `/docs/beasty-save-system/getting-started/save-with-code/`, `/es/docs/beasty-visual-novel/`, `/contact/`, y cada `dist/projects/*/` y `dist/es/projects/*/` que exista.
    - Anchos: 375, 768 y 1280. Temas: `dark` y `light`, fijados con `localStorage.bauflow_theme` vía `evaluateOnNewDocument`.
    - Por combinación:
      - (a) `document.documentElement.scrollWidth <= innerWidth`;
      - (b) ningún `pageerror` ni `console.error`, ignorando fallos de red de dominios externos;
      - captura de página completa en `dist-shots/<slug>__<ancho>__<tema>.png`.
    - Pase de movimiento reducido a 1280/oscuro: `emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])`; tras `load` + 1500 ms, `document.getAnimations().filter(a => a.playState === 'running').length === 0`.
    - `--consent` fija `beasty_widgets_consent='granted'` antes de navegar.
    - Imprime un resumen y sale con código 1 si alguna aserción falla.

- [ ] **Step 1: Extraer `findChrome`** a `scripts/lib/chrome.mjs` e importarlo en `build-pdf.mjs`.
- [ ] **Step 2: Implementar `serve-dist.mjs` y `ui-check.mjs`.**
- [ ] **Step 3: Ejecutar contra el sitio actual.** Run: `npm run build && npm run ui:check`. Expected: PASS y 30 PNG en `dist-shots/`. El sitio actual no tiene animaciones con keyframes y no desborda, así que sirve de referencia. Si algo falla aquí, el fallo está en `ui-check`, no en el sitio.
- [ ] **Step 4: Comprobar que `doc:pdf` sigue funcionando.** Run: `npm run doc:pdf`. Expected: 3 PDF generados.
- [ ] **Step 5: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «chore: ui-check (capturas y aserciones en navegador) y findChrome compartido»; esperar su confirmación.

### Tarea 4: Base visual: tokens, fuentes, movimiento

**Files:**
- Modify: `src/styles/tokens.css` (reescritura), `src/styles/base.css`, `src/styles/typography.css`, `src/layouts/BaseLayout.astro:2-9` (imports de fuentes), `package.json` (dependencias)
- Create: `src/styles/motion.css`, `src/scripts/juice.ts`, `tests/unit/contrast.test.mjs`, `tests/unit/juice.test.mjs`

**Interfaces:**
- Consumes: paleta, fuentes y easing de Global Constraints.
- Produces:
  - **Tokens:** los nombres actuales más `--accent-strong`, `--brand-surface`, `--brand-on`, `--brand-ink`, `--code-inline`, `--ease-bounce`, `--dur-slow`.
  - **`motion.css`:**
    - keyframes `rise`, `pop`, `slam`, `spin-in`, `wiggle`, `squash`;
    - utilidad `.reveal`: `animation: var(--reveal-name, rise) .55s var(--ease-bounce) backwards; animation-delay: calc(var(--reveal-base, 0ms) + var(--i, 0) * 70ms)`;
    - bloque global `@media (prefers-reduced-motion: reduce)` que anula `animation`/`transition` (duración `.001ms`, una iteración) en `*, *::before, *::after`.
  - **`src/scripts/juice.ts`:**
    - `prefersReducedMotion(): boolean`
    - `tiltAngles(px: number, py: number, maxDeg: number): { rx: number; ry: number }`: `ry = (px - .5) * 2 * maxDeg`, `rx = (.5 - py) * 2 * maxDeg`.
    - `attachTilt(el: HTMLElement, maxDeg = 7): void`: escribe `--rx`, `--ry` (deg) y `--sx`, `--sy` (%) al mover el puntero; los vuelve a 0 al salir; no hace nada con movimiento reducido o puntero `coarse`.
    - `attachSpotlight(el: HTMLElement): void`: escribe `--mx`/`--my` en px.

- [ ] **Step 1: Tests que fallan.**
  - `contrast.test.mjs` lee `tokens.css`, extrae los valores hex de `:root,html[data-theme='dark']` y de `html[data-theme='light']`, y comprueba ≥ 4.5 en ambos temas para:
    - `text`, `text-muted`, `text-faint`, `accent-text`, `note` y `warn` contra `bg` y contra `surface`;
    - `accent-on` contra `accent`;
    - `brand-on` contra `brand-surface`;
    - `code-inline` contra `bg`.
  - `juice.test.mjs`: `tiltAngles(.5,.5,7)` → `{rx:0, ry:0}`; `(1,0,7)` → `{rx:7, ry:7}`; `(0,1,7)` → `{rx:-7, ry:-7}`.
- [ ] **Step 2: Ejecutar.** Run: `npm test`. Expected: FAIL (`juice.ts` no existe; tokens sin `--brand-surface`).
- [ ] **Step 3: Fuentes.**
  - `npm i @fontsource-variable/unbounded @fontsource-variable/manrope @fontsource-variable/jetbrains-mono`
  - `npm uninstall @fontsource-variable/bricolage-grotesque @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono`
  - En `BaseLayout.astro`, importar los tres paquetes nuevos y `../styles/motion.css`.
- [ ] **Step 4: Reescribir `tokens.css`** con la paleta, las fuentes y el easing exactos de Global Constraints. Escala de tamaños de partida (Unbounded es ancha):
  - `--text-hero: clamp(2rem, 1.4rem + 3vw, 3.6rem)`
  - `--text-xl: clamp(1.5rem, 1.2rem + 1.5vw, 2.2rem)`
  - Ajustar `base.css`/`typography.css`: títulos en `--font-display` 800/600 con `letter-spacing: -0.01em`; cuerpo en `--font-body`; quitar referencias a Bricolage/Plex.
- [ ] **Step 5: Implementar `motion.css` y `juice.ts`.**
- [ ] **Step 6: Ejecutar.** Run: `npm test && npm run build && npm run ui:check`. Expected: tests PASS; build OK; `ui-check` sin desbordes ni errores, y el pase de movimiento reducido ya PASS.
- [ ] **Step 7: Revisión visual.** Abrir `dist-shots/index__1280__dark.png` y `…__light.png`: fondo negro neutro y blanco roto, sin marrón, títulos en Unbounded.
- [ ] **Step 8: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «feat: base visual Rojo protagonista, Unbounded+Manrope y tokens de movimiento»; esperar su confirmación.

### Tarea 5: Piezas compartidas: portada, logos de tienda, botones, plataformas

**Files:**
- Create: `src/components/Cover.astro`, `src/components/StoreLogo.astro`, `src/components/PlatformBadges.astro`, `tests/unit/ui-strings.test.mjs`
- Modify: `src/components/StoreButtons.astro` (mismas props: `product`, `lang`, `compact?`), `src/data/ui-strings.ts` (todas las claves nuevas de Global Constraints, EN+ES), `PROJECT_MAP.md`

**Interfaces:**
- Consumes: `getCover` (T2), `STORES`, `PLATFORMS` (T2).
- Produces:
  - `<Cover id: string, name: string, size: 'thumb' | 'card' | 'hero', eager?: boolean />`:
    - con portada: `<Image>` de `astro:assets` con relación 315:250, `alt=""` (decorativa: el nombre va al lado) y anchos por tamaño (`thumb` 64, `card` 400, `hero` 720);
    - sin portada: `<div class="cover cover--placeholder">` con la inicial de `name` sobre `--brand-surface`.
  - `<StoreLogo store: StoreId />`: SVG en línea monocromo (`currentColor`) por tienda, con genérico para tiendas desconocidas.
  - `<PlatformBadges platforms: PlatformId[] />`: `<ul class="platform-badges">` con `PLATFORMS[id].label`.
  - `StoreButtons`:
    - pastillas con `StoreLogo` + `label`, todas con el mismo estilo (`--brand-ink` sobre fondos rojos, `--surface-raised` en el resto);
    - `:active` aplica `squash`;
    - el estado «Próximamente» (`url: null`) se conserva.
  - Utilidad `t()` con sustitución: `tf(lang, key, vars: Record<string,string>): string` en `ui-strings.ts` (reemplaza `{nombre}`).

- [ ] **Step 1: Test que falla** (`ui-strings.test.mjs`):
  - cada clave de `UI.en` existe en `UI.es` y al revés;
  - las 17 claves nuevas de Global Constraints existen con los valores exactos de la tabla;
  - `tf('es','widget.show',{store:'itch.io'})` → `'Mostrar widget de itch.io'`;
  - `tf('en','widget.notice',{store:'Unity Asset Store'})` → `'Loads content from Unity Asset Store, which may set cookies.'`.
- [ ] **Step 2: Ejecutar.** Run: `npm test`. Expected: FAIL (`tf` y las claves nuevas no existen).
- [ ] **Step 3: Implementar** `Cover`, `StoreLogo`, `PlatformBadges`, `tf()`, las strings nuevas y el nuevo estilo de `StoreButtons`. El marcador de `Cover` se comprueba con datos en la Tarea 8 y se ejerce en la Tarea 12.
- [ ] **Step 4: Ejecutar.** Run: `npm test && npm run build && npm run ui:check`. Expected: todo PASS (`content-guard` incluido: solo hay claves nuevas). Las capturas de docs muestran el `BuyCta` con las pastillas nuevas.
- [ ] **Step 5: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «feat: portada con marcador, logos de tienda, insignias de plataforma y botones de tienda»; esperar su confirmación.

### Tarea 6: Cabecera, búsqueda global, pie y contacto

**Files:**
- Create: `src/components/ProjectsMenu.astro`, `src/components/SiteSearch.astro`, `tests/dist/chrome.test.mjs`
- Modify:
  - `src/components/Header.astro` (reescritura; desaparecen `shortNames` y la lista de productos)
  - `src/components/Footer.astro`, `src/components/LangSwitch.astro`, `src/components/ThemeToggle.astro` (solo estilo)
  - `src/components/ContactPage.astro` (solo estilo)
  - `src/layouts/DocLayout.astro:54-58,96-110`: quitar `#search`, el `<link>`/`<script>` de Pagefind y su init
  - `src/styles/doc.css`: el bloque `.doc-search` pasa a `SiteSearch` como estilos del diálogo
  - `PROJECT_MAP.md`

**Interfaces:**
- Consumes: `PRODUCTS`, `projectHref`, `Cover size="thumb"`, `t`.
- Produces:
  - `<ProjectsMenu lang />`: `<details class="projects-menu"><summary>{t('nav.projects')}</summary><ul>…</ul></details>`, un `<li><a href={projectHref(p)}>` con miniatura + nombre por producto. El script cierra con Esc y al hacer clic fuera; la lista se despliega con `pop`.
  - `<SiteSearch lang />`:
    - botón `data-search-open` con lupa, texto `t('search.open')` y `<kbd>Ctrl K</kbd>`; en < 760 px solo icono, con el texto como `visually-hidden`;
    - `<dialog class="search-dialog" data-search-dialog aria-label={t('search.open')}>` con `<div id="search" data-placeholder={t('docs.searchPlaceholder')}>` y botón de cerrar (`t('search.close')`);
    - script:
      - la primera vez que se abre, inyecta `/pagefind/pagefind-ui.css` y `/pagefind/pagefind-ui.js` y crea `new PagefindUI({ element:'#search', showImages:false, showSubResults:true, translations:{ placeholder } })`;
      - Ctrl/⌘+K abre, salvo si el foco está en `input`, `textarea` o `[contenteditable]`;
      - al abrir, foco en el input de Pagefind;
      - en `npm run dev` (sin Pagefind) el diálogo abre vacío sin errores.
  - **Cabecera:** logo · `ProjectsMenu` · enlace a Contacto (`t('contact.title')`) · `SiteSearch` · `LangSwitch` · `ThemeToggle`. Pegajosa y con fondo translúcido como hoy.

- [ ] **Step 1: Tests que fallan** (`chrome.test.mjs`, sobre `dist/`):
  - `/`, `/es/` y `/contact/` contienen `<details class="projects-menu` y `data-search-dialog`;
  - el menú de `/es/` tiene 3 enlaces que empiezan por `/es/docs/`;
  - `/` no contiene `pagefind-ui.js` en ningún `<script src>` (carga diferida);
  - `/docs/beasty-save-system/getting-started/save-with-code/` no contiene `class="doc-search"`.
- [ ] **Step 2: Ejecutar.** Run: `npm run build && npm run test:dist`. Expected: FAIL.
- [ ] **Step 3: Implementar** los componentes y los cambios de estilo (pie, idioma, tema, contacto) con los tokens nuevos.
- [ ] **Step 4: Ejecutar.** Run: `npm test && npm run build && npm run test:dist && npm run ui:check`. Expected: PASS.
- [ ] **Step 5: Verificar la búsqueda a mano.**
  - Run: `npm run preview`; en `/es/`, Ctrl+K y buscar `BeastySave`.
  - Expected: resultados en español con el nombre del producto; Esc cierra; el formulario de contacto envía igual que antes (sin enviar de verdad: comprobar que el `fetch` a Web3Forms sigue presente).
- [ ] **Step 6: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «feat: cabecera con menú Proyectos y búsqueda global Ctrl K; pie y contacto con el nuevo sistema»; esperar su confirmación.

### Tarea 7: Tarjeta de proyecto y catálogo con filtros

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/ProjectCatalog.astro`, `tests/dist/catalog.test.mjs`
- Modify: `src/components/LandingPage.astro`: el bloque `.products` / `.product-grid` se sustituye por `ProjectCatalog`. El resto de la portada se rehace en la Tarea 8. Hasta entonces, Visual Novel queda oculta en «Todo» por ser la destacada; es un estado intermedio aceptable en `Develop`.
- Modify: `src/styles/landing.css` (quitar `.product-grid`), `PROJECT_MAP.md`
- Delete: `src/components/ProductCard.astro`

**Interfaces:**
- Consumes: `platformFilters`, `isCardVisible`, `projectHref`, `PLATFORMS`, `Cover`, `PlatformBadges`, `attachTilt`, `t`.
- Produces:
  - `<ProjectCard product lang featured: boolean index: number />`:
    - `<a class="project-card reveal" href={projectHref} data-platforms="unity,ios" data-featured={featured ? '' : undefined} hidden={featured} style="--i:{index}" data-tilt>`;
    - dentro: `Cover size="card"`, nombre (`h3`, Unbounded), lema y `PlatformBadges`;
    - sin botones de tienda.
  - `<ProjectCatalog products lang heading: string featuredId?: string withFilters?: boolean id?: string />`:
    - `<section class="catalog" id={id}>` con un `h2`;
    - si `withFilters` y `platformFilters(products).length > 0`: `<div class="catalog-filters" role="group" aria-label={t('catalog.filterLabel')} hidden>` con un botón `data-filter="all"` (`t('catalog.all')`, sin contador, `aria-pressed="true"`) y uno por plataforma con contador;
    - rejilla `<div class="catalog-grid">` con `repeat(auto-fill, minmax(15rem, 1fr))`;
    - script:
      - quita `hidden` a los filtros;
      - al pulsar uno, `aria-pressed` y, con `isCardVisible`, `hidden` en cada tarjeta;
      - las visibles se renumeran (`--i`) y se reanima su entrada: quitar `reveal`, forzar un reflow y volver a ponerlo, con `--reveal-name: pop; --reveal-base: 0ms`;
      - `attachTilt` en cada `[data-tilt]`.
  - **Estilo de tarjeta** (de `juice.html`, nivel 3):
    - `transform: perspective(700px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(var(--ty,0)) scale(var(--sc,1))`;
    - hover: `--ty:-8px; --sc:1.03`, borde `--accent-strong`, sombra roja suave, zoom de imagen 1.08 y capa de brillo radial en `--sx`/`--sy`;
    - al salir, transición de rebote (`--ease-bounce`, 450 ms);
    - `:focus-visible` con el mismo realce que el hover, sin inclinación.

- [ ] **Step 1: Tests que fallan** (`catalog.test.mjs`, sobre `/` y `/es/`):
  - hay 3 `class="project-card`;
  - exactamente 1 lleva `data-featured` y `hidden`, y es la de Visual Novel;
  - no aparece `catalog-filters` (con los datos actuales hay una sola plataforma);
  - los `href` de `/es/` empiezan por `/es/docs/`;
  - no aparece `product-grid`.
- [ ] **Step 2: Ejecutar.** Run: `npm run build && npm run test:dist`. Expected: FAIL.
- [ ] **Step 3: Implementar** `ProjectCard` y `ProjectCatalog`, montarlos en `LandingPage` (`featuredId={getFeatured(PRODUCTS).id}`, `withFilters`, `id="catalog"`, `heading={t(lang,'products.heading')}`) y borrar `ProductCard.astro`.
- [ ] **Step 4: Ejecutar.** Run: `npm test && npm run build && npm run test:dist && npm run ui:check`. Expected: PASS. En `npm run preview`, las tarjetas se inclinan siguiendo el ratón y el teclado (Tab) las realza sin inclinarlas.
- [ ] **Step 5: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «feat: tarjeta de proyecto con inclinación y catálogo con filtros dinámicos»; esperar su confirmación.

### Tarea 8: Portada

**Files:**
- Create: `src/components/FeaturedProject.astro`, `src/components/HomeIntro.astro`, `tests/dist/landing.test.mjs`
- Modify: `src/components/LandingPage.astro` (reescritura), `src/components/EcosystemNote.astro` (diagrama visual; textos iguales), `src/styles/landing.css` (reescritura), `PROJECT_MAP.md`
- Delete: `src/components/HeroScript.astro`

**Interfaces:**
- Consumes: `getFeatured`, `ProjectCatalog`, `Cover size="hero" eager`, `StoreButtons`, `attachSpotlight`, `t`.
- Produces:
  - `<HomeIntro lang />`: eyebrow, `h1` y subtítulo con `hero.*`, más dos botones: `hero.ctaDocs` → `#catalog` y `hero.ctaStore` → `#featured`. Entra con `.reveal`.
  - `<FeaturedProject product lang />`:
    - `<section id="featured" class="featured" data-spotlight>` sobre `--brand-surface`;
    - portada grande;
    - pastilla `--brand-ink` con `{t('featured.new')} · v{version}` (mayúsculas por CSS);
    - nombre (Unbounded 800), lema y `StoreButtons`;
    - toda la portada y el nombre enlazan a `projectHref`;
    - entrada con `slam`; el foco radial sigue al cursor (`::before` con `--mx`/`--my`).
  - **`LandingPage`:** `HomeIntro` → `FeaturedProject(getFeatured(PRODUCTS))` → `ProjectCatalog products={PRODUCTS} featuredId withFilters id="catalog" heading={t('products.heading')}` → `EcosystemNote`.
  - **`EcosystemNote`:** los mismos `ecosystem.heading`, `note1`, `note2` y `requirements`. El `<pre>` ASCII se sustituye por un diagrama con 3 miniaturas (`Cover size="thumb"`) unidas por flechas: VN → SS con `t('ecosystem.includes')` en línea continua y SS → Console con `t('ecosystem.optional')` en línea discontinua. En < 640 px pasa a vertical.

- [ ] **Step 1: Tests que fallan** (`landing.test.mjs`, sobre `/` y `/es/`):
  - contiene el texto exacto de `hero.title` de su idioma;
  - `id="featured"` con `Beasty Visual Novel` y `v1.1.0`;
  - no contiene `welcome.vnbeasty`;
  - contiene los 3 textos `ecosystem.note1/note2/requirements` de su idioma;
  - no contiene `eco-diagram`;
  - **portada o marcador, guiado por datos:** para cada producto de `PRODUCTS`, si existe `src/assets/covers/<id>.{png,jpg,jpeg,webp}`, su tarjeta (o el bloque `#featured` si es el destacado) contiene `<img`; si no existe, contiene `cover--placeholder` y ningún `<img`. Para aislar el HTML de cada tarjeta, partir por `class="project-card` y localizar la de `href` = `projectHref`.
- [ ] **Step 2: Ejecutar.** Run: `npm run build && npm run test:dist`. Expected: FAIL.
- [ ] **Step 3: Implementar** y borrar `HeroScript.astro`.
- [ ] **Step 4: Ejecutar.** Run: `npm test && npm run build && npm run test:dist && npm run ui:check`. Expected: PASS (incluye `catalog.test.mjs` de la Tarea 7).
- [ ] **Step 5: Revisión visual.**
  - Abrir `dist-shots/index__1280__dark.png`, `index__375__dark.png` e `index__1280__light.png` y compararlas con `layout-v2.html` + `juice.html`.
  - En `npm run preview`, comprobar a mano el rebote de entrada, la inclinación de las tarjetas, el foco sobre el bloque rojo y el aplastamiento de los botones.
- [ ] **Step 6: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «feat: portada con proyecto destacado, catálogo y diagrama del ecosistema»; esperar su confirmación.

### Tarea 9: «Dónde conseguirlo» y widgets con permiso

**Files:**
- Create: `src/components/WhereToGet.astro`, `src/components/StoreWidget.astro`, `src/scripts/store-widgets.ts`, `tests/dist/where-to-get.test.mjs`
- Modify:
  - `src/layouts/DocLayout.astro`: solo en `pageSlug === 'index'`, `WhereToGet` dentro del `<article>`, tras `.prose` y antes del paginador
  - `scripts/build-pdf.mjs:84`: eliminar también `/<section class="where-to-get"[\s\S]*?<\/section>/g`
  - `PROJECT_MAP.md`

**Interfaces:**
- Consumes: `STORES`, `unityWidget`, `itchWidget`, `hasConsent`, `rememberConsent`, `revokeConsent`, `StoreLogo`, `StoreButtons`, `tf`.
- Produces:
  - `<WhereToGet product lang />`:
    - `<section class="where-to-get" data-pagefind-ignore="all">`, **sin `<section>` anidadas** (por el regex del PDF), con `h2` `t('where.heading')`;
    - una rejilla con un `StoreWidget` por enlace con `url` cuya tienda tenga `widget`;
    - las demás tiendas, como `StoreButtons`;
    - una casilla `<input type="checkbox" data-widget-remember checked>` con `t('widget.remember')`;
    - un botón `data-widget-revoke hidden` con `t('widget.revoke')`.
  - `<StoreWidget link product lang />`:
    - `<div class="store-widget" data-kind data-widget-id data-store-label>`;
    - fachada `<a href={link.url}>` con `StoreLogo`, `Cover size="thumb"` y la etiqueta de la tienda;
    - botón `data-widget-load` con `tf('widget.show', {store})`;
    - aviso `tf('widget.notice', {store})`;
    - contenedor `.store-widget__frame` vacío.
  - `initStoreWidgets(doc: Document): void` en `store-widgets.ts`:
    - si `hasConsent(localStorage)` → carga todos los widgets y muestra «retirar»;
    - al pulsar «Mostrar»: carga **ese** widget y, si la casilla está marcada, `rememberConsent` y carga todos los demás;
    - «retirar» → `revokeConsent`, vacía los iframes y vuelve a mostrar las fachadas.
    - **El iframe:** `loading="lazy"`, `title` = etiqueta de la tienda, sin borde.
      - Unity: `size = frame.clientWidth >= 600 ? 'wide' : 'narrow'`.
      - itch: `width:100%; max-width:552px; height:167px`.
      - El tema sale de `document.documentElement.dataset.theme`.
    - Un `MutationObserver` sobre `data-theme` vuelve a asignar el `src` de los iframes cargados.

- [ ] **Step 1: Tests que fallan** (`where-to-get.test.mjs`):
  - `/docs/beasty-visual-novel/` y `/es/docs/beasty-visual-novel/` tienen exactamente 1 `class="where-to-get"` con 2 `class="store-widget"`;
  - **ningún `<iframe`** en el HTML estático;
  - cada `store-widget` contiene un `<a ` cuyo `href` es la `url` de su tienda en `products.ts` (la fachada funciona sin JS);
  - la sección está dentro del `<article class="doc-content"` y lleva `data-pagefind-ignore`;
  - `/docs/beasty-save-system/getting-started/save-with-code/` no contiene `where-to-get`.
- [ ] **Step 2: Ejecutar.** Expected: FAIL.
- [ ] **Step 3: Implementar.**
- [ ] **Step 4: Ejecutar.** Run: `npm test && npm run build && npm run test:dist && npm run ui:check && npm run ui:check -- --consent --routes /docs/beasty-visual-novel/,/es/docs/beasty-save-system/`. Expected: PASS. Con `--consent` no hay desborde a 375 px y las capturas muestran los widgets cargados.
- [ ] **Step 5: Verificar a mano** en `npm run preview`:
  1. Con el almacenamiento limpio no se carga ningún iframe hasta pulsar.
  2. Al pulsar con «Recordar» marcado, aparecen ambos widgets y al recargar siguen apareciendo.
  3. Al cambiar de tema, los widgets pasan a su variante.
  4. «Retirar» los quita.
- [ ] **Step 6: PDF.** Run: `npm run doc:pdf`. Expected: 3 PDF sin el texto «Dónde conseguirlo» / «Where to get it» (comprobar con `pdftotext` o abriendo uno).
- [ ] **Step 7: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «feat: sección Dónde conseguirlo con widgets de Asset Store e itch.io cargados con permiso»; esperar su confirmación.

### Tarea 10: Páginas de documentación (variante A)

**Files:**
- Create:
  - `src/components/ProjectSwitcher.astro`
  - `src/plugins/rehype-callouts.mjs`
  - `src/scripts/code-blocks.ts`
  - tests: `tests/unit/callouts.test.mjs`, `tests/unit/code-blocks.test.mjs`, `tests/dist/docs.test.mjs`
- Modify:
  - `astro.config.mjs` (Shiki de un solo tema + plugin)
  - `src/layouts/DocLayout.astro` (miga legible, script de bloques de código, «Otros proyectos» en el índice)
  - `src/components/DocSidebar.astro`: `.product-switch` → `ProjectSwitcher`
  - `src/components/TableOfContents.astro` (estilo)
  - `src/components/BuyCta.astro` (estilo; conservar `<aside class="buy-cta"`)
  - `src/styles/doc.css`
  - `scripts/build-pdf.mjs:83`: regex de miga → `/<p class="[^"]*\bdoc-crumb\b[^"]*"[^>]*>[\s\S]*?<\/p>/g`
  - `PROJECT_MAP.md`

**Interfaces:**
- Consumes: `SIDEBARS`, `PRODUCTS`, `Cover`, `ProjectCatalog`, `t`.
- Produces:
  - `classifyCallout(label: string): 'note' | 'warn'`: `'warn'` si `label`, sin espacios ni puntuación final y sin distinguir mayúsculas, es `warning`, `advertencia`, `important` o `importante`; en cualquier otro caso `'note'`.
  - `rehypeCallouts()` (export default): para cada elemento `blockquote` del árbol HAST, toma el texto del primer `strong` de su primer `p` y añade `className` `['callout', 'callout--note' | 'callout--warn']`. El recorrido del árbol es propio, sin dependencias nuevas.
  - `languageLabel(lang?: string): string`: `csharp`/`cs` → `C#`, `json` → `JSON`, `js`/`javascript` → `JavaScript`, `ts`/`typescript` → `TypeScript`, `bash`/`sh`/`shell` → `Shell`, `powershell`/`ps1` → `PowerShell`, `yaml`/`yml` → `YAML`, `xml` → `XML`; `text`, `plaintext`, `txt` o vacío → `''`; cualquier otro → en mayúsculas.
  - `enhanceCodeBlocks(root: ParentNode, labels: { copy: string; copied: string }): void`:
    - envuelve cada `.prose pre.astro-code` en `<div class="code-block">` con una cabecera (`languageLabel(pre.dataset.language)` + botón Copiar);
    - el botón copia `pre.innerText`, con la clase `is-copied` y el texto `labels.copied` durante 1400 ms;
    - las etiquetas llegan por `data-copy`/`data-copied` en el `<article>`.
  - `<ProjectSwitcher current: string lang />`: `<details class="project-switcher">` con la miniatura y el nombre del actual en `<summary>` (`aria-label` `t('docs.projectSwitch')`) y la lista de los productos con `docsEntry`. Se despliega con `pop`.
  - **Miga:** `<p class="doc-crumb">{nombre sin "Beasty "} › {etiqueta del grupo de SIDEBARS que contiene el slug | t('docs.overview') en el índice}</p>`.
  - **Shiki:** `shikiConfig: { theme: 'github-dark-default' }`. En `doc.css`, `.prose pre.astro-code { background-color: var(--surface-code) !important; }`; se borra el bloque «Shiki dual themes».

- [ ] **Step 1: Tests que fallan.**
  - `callouts.test.mjs`:
    - `classifyCallout('Warning')`, `('Advertencia')`, `('Importante')` → `'warn'`; `('Note')`, `('Nota')`, `('WebGL is not supported.')` → `'note'`;
    - `rehypeCallouts()` sobre un árbol HAST mínimo `{type:'root',children:[{type:'element',tagName:'blockquote',properties:{},children:[{type:'element',tagName:'p',properties:{},children:[{type:'element',tagName:'strong',properties:{},children:[{type:'text',value:'Advertencia'}]}]}]}]}` deja `properties.className` = `['callout','callout--warn']`.
  - `code-blocks.test.mjs`: `languageLabel('csharp')` → `'C#'`, `('text')` → `''`, `(undefined)` → `''`, `('gdscript')` → `'GDSCRIPT'`.
  - `docs.test.mjs`:
    - `/es/docs/beasty-save-system/getting-started/save-with-code/` contiene `Save System › Primeros pasos`, no contiene `doc-search` ni `product-switch`, y sí `project-switcher`;
    - alguna página con `> **Advertencia**` contiene `callout--warn`;
    - `/docs/beasty-visual-novel/` contiene `catalog.others` renderizado («Other projects») con 2 tarjetas;
    - ningún `pre.astro-code` lleva `--shiki-dark`.
- [ ] **Step 2: Ejecutar.** Run: `npm test`. Expected: FAIL.
- [ ] **Step 3: Implementar.**
  - Estilos de `docs.html` variante A:
    - lateral: hover que desplaza 3 px con una barra `--accent-strong` que crece; la página activa con `--accent-soft` y barra;
    - `h2` con un rombo `--accent-strong` (`::before` rotado 45°), quitando el `border-top` actual;
    - enlaces `--accent-text` con subrayado al 45 %;
    - código en línea con `--code-inline` sobre `--accent-soft`.
  - Callouts:
    - `.callout--note`: `--note` / `--note-soft`;
    - `.callout--warn`: `--warn` / `--warn-soft`;
    - con borde izquierdo de 3 px e icono por `::before`.
  - En el índice, «Otros proyectos»: `ProjectCatalog products={PRODUCTS.filter(p => p.id !== product.id)} heading={t('catalog.others')}` **fuera** de `.doc-shell`, a todo el ancho.
- [ ] **Step 4: Ejecutar.** Run: `npm test && npm run build && npm run test:dist && npm run doc:links && npm run doc:pdf && npm run ui:check`. Expected: todo PASS; los PDF sin la miga.
- [ ] **Step 5: Revisión visual.**
  - Capturas `docs-…save-with-code__1280__light.png` y `__375__dark.png` frente a `docs.html` A.
  - Cajón móvil operativo a 375 px (en `npm run preview`).
  - El código es oscuro también en tema claro.
- [ ] **Step 6: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «feat: docs variante Limpia: selector de proyecto, miga legible, callouts nota/advertencia, código oscuro con Copiar»; esperar su confirmación.

### Tarea 11: Página de proyecto para productos sin documentación

**Files:**
- Create: `src/components/ProjectPage.astro`, `src/pages/projects/[id].astro`, `src/pages/es/projects/[id].astro`, `tests/dist/project-pages.test.mjs`
- Modify: `PROJECT_MAP.md`

**Interfaces:**
- Consumes: `PRODUCTS`, `Cover size="hero"`, `PlatformBadges`, `StoreButtons`, `WhereToGet`, `ProjectCatalog`, `projectHref`.
- Produces:
  - Rutas: `getStaticPaths` → `PRODUCTS.filter(p => !p.docsEntry).map(p => ({ params: { id: p.id }, props: { product: p } }))`.
  - `<ProjectPage product lang />` dentro de `BaseLayout`:
    - `title`: `${product.name} — Beasty Components`; `description`: `product.tagline[lang]`; `altHref` hacia el otro idioma;
    - cabecera de proyecto sobre `--brand-surface`, con portada, nombre, lema, `PlatformBadges` y `StoreButtons`;
    - `blurb`;
    - `WhereToGet`;
    - `ProjectCatalog` de los demás con `t('catalog.others')`.

- [ ] **Step 1: Test** (`project-pages.test.mjs`):
  - para cada producto de `PRODUCTS` sin `docsEntry`, existen `dist/projects/<id>/index.html` y `dist/es/projects/<id>/index.html` con su `name` y `where-to-get`;
  - para los productos con docs **no** existe `dist/projects/<id>/`.
  - Con los datos actuales, la primera parte es trivial; la Tarea 12 la ejerce.
- [ ] **Step 2: Implementar.**
- [ ] **Step 3: Ejecutar.** Run: `npm run build && npm run test:dist`. Expected: PASS.
- [ ] **Step 4: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «feat: página de proyecto generada para productos sin documentación»; esperar su confirmación.

### Tarea 12: Ensayo de escalado, documentación del repo y verificación final

**Files:**
- Modify: `HOW-TO-ADD-PROJECT.md`, `PROJECT_MAP.md`, `src/data/products.ts` (solo temporalmente, se revierte)

- [ ] **Step 1: Ensayo de escalado.** Añadir temporalmente al final de `PRODUCTS` dos productos ficticios sin docs y sin portada:
  - `demo-mobile`: `platforms ['android','ios']`, tiendas `google-play` y `app-store` con URLs de ejemplo y nombre «Demo Mobile Companion App».
  - `demo-pc-tool-with-a-very-long-name`: `platforms ['pc','unity']`, tienda `steam`, nombre «Beasty Extraordinarily Long Project Name Toolkit».
- [ ] **Step 2: Ejecutar con los ficticios.** Run: `npm run build && npm run test:dist && npm run ui:check`. Expected:
  - `project-pages` genera y valida `dist/projects/demo-*/` en EN y ES;
  - en la portada aparecen los filtros `Todo · Unity 2 · Android 1 · iOS 1 · PC 1`;
  - los ficticios usan el marcador de portada;
  - no hay desbordes a 375 px, tampoco con el nombre largo;
  - el test de portada o marcador de la Tarea 8 encuentra `cover--placeholder` en las tarjetas de los ficticios.
  - **Fallos esperados:** el test de la Tarea 7 que exige «no aparece `catalog-filters`» fallará, porque ahora hay 4 plataformas. Ese fallo confirma que los filtros aparecen; no se cambia el test.
- [ ] **Step 3: Revisión visual del ensayo** en `npm run preview`:
  - al pulsar «Android», la cuadrícula muestra solo `demo-mobile`, con rebote;
  - el desplegable «Proyectos» lista 5;
  - `/projects/demo-mobile/` muestra las insignias oficiales como botones, sin widgets.
- [ ] **Step 4: Revertir.** Run: `git checkout src/data/products.ts && npm run build && npm run test:dist`. Expected: PASS con los datos reales.
- [ ] **Step 5: Documentación.**
  - `HOW-TO-ADD-PROJECT.md`:
    - campos nuevos (`platforms`, `featured`, `docsEntry` opcional, `storeLinks[].store` de `STORES` y `widgetId`);
    - de dónde sacar cada `widgetId`: Asset Store, el número de la URL del paquete; itch.io, el `id` de `https://<usuario>.itch.io/<juego>/data.json`;
    - la portada en `src/assets/covers/<id>.png`;
    - la regla «el orden del array es el del catálogo».
  - `PROJECT_MAP.md`: componentes, `src/lib/`, `src/plugins/`, `tests/`, `scripts/lib/` y `ui-check`.
- [ ] **Step 6: Verificación final completa.** Run: `npm test && npm run build && npm run test:dist && npm run doc:links && npm run doc:pdf && npm run ui:check`. Expected: todo PASS.
  - Revisar las 30 capturas de `dist-shots/`: portada, docs, índice de VN y contacto, en EN/ES, claro/oscuro y 375/768/1280.
  - `git diff c63ae28 --stat -- src/content/docs` vacío.
- [ ] **Step 7: Punto de commit (lo hace Álvaro).** Avisar con los archivos de la tarea y el mensaje sugerido «docs: guía para añadir proyectos con plataformas, tiendas y widgets; mapa del proyecto»; esperar su confirmación.
