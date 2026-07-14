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
| Nombre, tagline o descripción de un producto | `src/data/products.ts` |
| Textos de la interfaz (botones, menús) | `src/data/ui-strings.ts` |
| Orden y grupos del menú lateral de docs | `src/data/sidebars.ts` |
| Colores del sitio (ambos temas) | `src/styles/tokens.css` |
| Capturas de pantalla de las docs | `public/docs-images/<producto>/` (ver `docs/SCREENSHOTS.md`) |

## Rellenar un enlace de tienda

En `src/data/products.ts`, busca el producto y cambia `url: null` por la URL real:

```ts
storeLinks: [
  { store: 'unity', label: 'Unity Asset Store', url: 'https://assetstore.unity.com/packages/...' },
  { store: 'itch', label: 'itch.io', url: 'https://bauflow.itch.io/...' },
],
```

Mientras `url` sea `null`, el botón aparece como "Coming soon" deshabilitado.
Para añadir otra tienda, añade una línea más al array con su `label` y `url`.

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

1. Añádelo a `src/data/products.ts` (id, nombre, taglines, storeLinks, docsEntry).
2. Crea su árbol de docs en `src/content/docs/en/<nuevo-id>/` (con un `index.md`) y su espejo `es/`.
3. Define su menú en `src/data/sidebars.ts` bajo el mismo id.
4. Añade el nombre corto en `shortNames` de `src/components/Header.astro`.

## Capturas de pantalla

Las páginas ya referencian las imágenes. Guarda cada PNG en
`public/docs-images/<producto>/` con el nombre exacto que aparece en el Markdown
(lista completa en `docs/SCREENSHOTS.md`). Mientras no exista el archivo, la página
oculta el hueco automáticamente.
