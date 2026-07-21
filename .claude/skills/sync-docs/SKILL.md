---
name: sync-docs
description: Actualiza la documentación del sitio a partir de los cambios del proyecto Unity (E:\Beasty\BeastyVisualNovel). Úsalo cuando Álvaro diga "actualiza la documentación", "sincroniza los docs", "cambié X en el asset" o invoque /sync-docs. Detecta qué cambió por changelog y por Plastic, localiza las páginas afectadas con DOC-INDEX y edita EN + ES.
---

# Sincronizar la documentación con el proyecto Unity

La documentación tiene **una sola copia**, y está en este repositorio. El proyecto Unity
(`E:\Beasty\BeastyVisualNovel`) ya no guarda documentación: solo el `CHANGELOG`, el `README` y la
`LICENSE` de cada asset, que son los que viajan dentro del `.unitypackage`.

## Reglas que no se rompen

1. **EN es canónico, ES es espejo 1:1.** Toda página EN tiene su gemela en la misma ruta bajo `es/`.
   Nunca dejes una sin la otra. El ES es traducción humanizada, no literal.
2. **Página nueva ⇒ registrarla en `src/data/sidebars.ts`.** El sidebar es único y sus etiquetas son
   bilingües, así que basta una entrada por página.
3. **No leas las 83 páginas para saber qué tocar.** Para eso está `docs/DOC-INDEX.md`.
4. **No inventes comportamiento.** Si el changelog no basta, lee el código en el proyecto Unity
   (`Assets/BeastyComponents/...`) usando su `docs/codemap/CODEMAP.md` como mapa. Si sigue sin estar
   claro, pregunta antes de escribir.
5. **Terminología ES fijada:** «cifrado» (no «encriptación»), «Consulta [enlace]», «momento del día»,
   «grilla», «sala», «mundo libre», «ejecución», «estilos de entrega», «mouse», «rebobinado».

## Procedimiento

### 1. Detectar qué cambió

```
npm run doc:sync
```

Informa de tres cosas: viñetas de changelog que no están reflejadas (en cualquiera de los dos sentidos),
archivos `.cs` tocados en el proyecto Unity según Plastic, y si el índice está obsoleto.

Si Plastic da error de certificado, pide a Álvaro que ejecute `! cm status` una vez y responda `Y`.

### 2. Localizar las páginas afectadas

Para cada cambio, busca sus símbolos en `docs/DOC-INDEX.md` con Grep — **no lo leas entero**, son 65 KB:

```
Grep pattern="MigratedFrom|BeastySaveLog" path="docs/DOC-INDEX.md"
```

El índice inverso devuelve identificadores como `SS/reference/results-and-errors`, que es
`src/content/docs/en/beasty-save-system/reference/results-and-errors.md`. Siglas: `SS` = save system,
`VN` = visual novel, `DL` = debug logger.

Si el símbolo no aparece en el índice, es funcionalidad **nueva**: decide con Álvaro si va en una página
existente o en una nueva.

### 3. Editar

1. Edita las páginas **EN**.
2. Espeja cada edición en **ES**, con la terminología de arriba. Ojo: en ES los enlaces internos llevan
   prefijo `/es/docs/...`; las imágenes no (`/docs-images/...` en los dos idiomas).
3. Si hay página nueva: frontmatter con `title` y una `description` **completa** (una frase que termine;
   no la cortes a 155 caracteres, que es el defecto heredado de `migrate-docs.mjs`), y registro en
   `src/data/sidebars.ts`.
4. Si el cambio toca el changelog: refléjalo en `docs/changelogs/<Asset>_CHANGELOG.md` **y** en las dos
   páginas `<producto>/changelog.md` (EN y ES).
5. Si hace falta una captura nueva: añádela a `docs/SCREENSHOTS.md` y enlaza la imagen en la página
   (`/docs-images/<producto>/<archivo>.png`). Las que no existen se ocultan solas en el render.

### 4. Verificar (siempre, sin saltarse ninguno)

```
npm run doc:index     # regenera DOC-INDEX.md con los símbolos nuevos
npm run build         # tiene que terminar sin errores
npm run doc:links     # 0 enlaces rotos; corre contra dist/, así que va DESPUÉS del build
npm run doc:sync      # debe quedar en «Todo sincronizado»
```

El build puede soltar un aviso transitorio «Duplicate id» tras editar un `.md`: desaparece al repetirlo,
no es un duplicado real.

### 5. Cerrar

Actualiza `PROJECT_MAP.md` si cambió la estructura (archivos creados, movidos o eliminados), incluida su
fecha de «Última actualización». Resume a Álvaro qué se documentó y qué quedó pendiente. **No hagas
commit salvo que te lo pida.**
