# CLAUDE.md

## Mapa del proyecto (obligatorio)

- **Antes de cualquier búsqueda** (Grep, Glob, exploración de archivos) o de planificar un cambio: leer primero `PROJECT_MAP.md`. Contiene la estructura completa, el propósito de cada carpeta/archivo clave y las reglas del proyecto. Solo buscar en el código si el mapa no responde la pregunta.
- **Después de cualquier cambio estructural** (crear, mover, renombrar o eliminar archivos/carpetas, o cambiar el propósito de algo listado en el mapa): actualizar `PROJECT_MAP.md` en el mismo turno, incluida su fecha de «Última actualización». Editar solo el contenido de un archivo existente no requiere actualizar el mapa.

## Reglas del proyecto

- Idioma con el usuario: español.
- **Este repo es la única copia de la documentación.** El proyecto Unity (`E:\Beasty\BeastyVisualNovel`)
  solo conserva el `CHANGELOG`, `README` y `LICENSE` de cada asset. Para actualizar docs tras un cambio del
  asset: comando `/sync-docs`.
- Para localizar qué página documenta un símbolo, buscar con Grep en `docs/DOC-INDEX.md` (índice inverso);
  no abrir las páginas una a una. Regenerar con `npm run doc:index` tras tocar contenido.
- EN (`src/content/docs/en/`) es el contenido canónico; ES (`src/content/docs/es/`) es espejo 1:1 con las mismas rutas.
- Página nueva de docs ⇒ registrarla en `src/data/sidebars.ts` (EN y ES).
- Toda página nueva o edición de prosa ⇒ seguir `docs/GUIA-ESTILO-DOCS.md` (estructura, voz, audiencia por sección, descriptions ≤158).
- Producto nuevo ⇒ seguir `HOW-TO-ADD-PROJECT.md`.
- No editar `dist/` (generado por el build).
