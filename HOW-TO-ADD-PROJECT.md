# Cómo mantener este sitio

El sitio se construye con [Astro](https://astro.build). Tú editas Markdown y archivos de
datos; GitHub Actions compila y publica solo al hacer `git push` a `main`.

## Flujo diario

```
editas archivos  →  git add -A  →  git commit -m "..."  →  git push
```

GitHub Actions publica en 1-2 minutos. No necesitas ejecutar nada más.

> **Configuración única (pendiente):** en GitHub → Settings → Pages → "Build and
> deployment" → Source, selecciona **GitHub Actions** (antes estaba "Deploy from a
> branch"). Sin este cambio el deploy nuevo no se activa.

Para previsualizar en local (opcional, requiere Node):

```
npm install        (solo la primera vez)
npm run dev        → abre http://localhost:4321
```

## Dónde vive cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Texto de una página de docs (inglés) | `src/content/docs/en/<producto>/<página>.md` |
| Texto de una página de docs (español) | `src/content/docs/es/<producto>/<página>.md` |
| Enlaces de tienda (Asset Store, itch.io…) | `src/data/products.ts` → `storeLinks` |
| Plataformas de un proyecto (filtros del catálogo) | `src/data/products.ts` → `platforms` |
| Proyecto destacado de la portada | `src/data/products.ts` → `featured: true` (solo uno) |
| Portada de un proyecto | `src/assets/covers/<id>.png` |
| Nombre, tagline o descripción de un producto | `src/data/products.ts` |
| Textos de la interfaz (botones, menús) | `src/data/ui-strings.ts` |
| Orden y grupos del menú lateral de docs | `src/data/sidebars.ts` |
| Colores del sitio (ambos temas) | `src/styles/tokens.css` |
| Capturas de pantalla de las docs | `public/docs-images/<producto>/` (ver `docs/SCREENSHOTS.md`) |

## Rellenar un enlace de tienda

En `src/data/products.ts`, busca el producto y cambia `url: null` por la URL real:

```ts
storeLinks: [
  { store: 'unity', label: 'Unity Asset Store', url: 'https://assetstore.unity.com/packages/slug/393138', widgetId: '393138' },
  { store: 'itch', label: 'itch.io', url: 'https://beastycomponents.itch.io/mi-juego', widgetId: '4897713' },
],
```

- Mientras `url` sea `null`, el botón aparece como "Coming soon" deshabilitado.
- `store` tiene que ser una de las tiendas de `src/data/stores.ts`: `unity`, `itch`, `google-play`,
  `app-store` o `steam`. Para una tienda nueva, añádela ahí (y su logo en `src/components/StoreLogo.astro`).
- `widgetId` hace que salga el widget oficial en «Dónde conseguirlo» (solo Asset Store e itch.io tienen widget;
  el resto salen como botón con su logo):
  - **Asset Store:** el número final de la URL del paquete (`.../packages/slug/393138` → `393138`).
  - **itch.io:** abre `https://<usuario>.itch.io/<juego>/data.json` y copia el número de `"id"`.
- Los widgets solo se cargan cuando el visitante lo permite (pulsando «Mostrar widget…»).

## Añadir una página de documentación

1. Crea `src/content/docs/en/<producto>/<grupo>/<mi-pagina>.md` con este encabezado:

   ```markdown
   ---
   title: "My page title"
   description: "One line for search engines."
   ---

   Content in Markdown…
   ```

2. Crea su traducción en `src/content/docs/es/<producto>/<grupo>/<mi-pagina>.md`.
3. Añade el slug (`<grupo>/<mi-pagina>`) en `src/data/sidebars.ts`, en el grupo que toque.
4. Los enlaces internos se escriben absolutos: `[texto](/docs/<producto>/<grupo>/<página>/)`
   (en la versión española: `/es/docs/...`).

## Añadir un producto nuevo

1. Añádelo a `src/data/products.ts`. **El orden del array es el orden del catálogo de la portada.** Campos:
   - `id`, `name`, `version`, `tagline` y `blurb` (EN y ES), `storeLinks` (ver arriba).
   - `platforms`: una o varias de `unity`, `android`, `ios`, `pc` (`src/data/platforms.ts`). Los filtros
     del catálogo salen solos de lo que haya: si nadie tiene Android, no aparece el filtro «Android».
   - `featured: true` si debe ser el proyecto destacado de la portada (solo uno; si ninguno lo lleva,
     se destaca el primero del array).
   - `docsEntry` (p. ej. `'/docs/<id>/'`) **solo si tiene documentación**.
2. Portada: guarda `src/assets/covers/<id>.png` con proporción 315:250 (por ejemplo 630×500 o 1260×1000).
   Sin portada, la web muestra la inicial del proyecto en un rombo rojo.
3. **Con documentación:** crea su árbol en `src/content/docs/en/<id>/` (con un `index.md`) y su espejo `es/`,
   y define su menú en `src/data/sidebars.ts` bajo el mismo id. Su `index.md` hace de página de proyecto.
4. **Sin documentación** (por ejemplo una app): no hace falta nada más; se genera sola la página
   `/projects/<id>/` (y `/es/projects/<id>/`) con portada, descripción, «Dónde conseguirlo» y otros proyectos.
5. El menú «Proyectos» de la cabecera y el selector de las docs se actualizan solos.

## Capturas de pantalla

Las páginas ya referencian las imágenes. Guarda cada PNG en
`public/docs-images/<producto>/` con el nombre exacto que aparece en el Markdown
(lista completa en `docs/SCREENSHOTS.md`). Mientras no exista el archivo, la página
oculta el hueco automáticamente.
