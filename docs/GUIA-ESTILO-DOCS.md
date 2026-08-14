# Guía de estilo de la documentación — Beasty Components

> Norma para TODA página nueva o edición de prosa en `src/content/docs/`. Nació de la revisión
> EN de Visual Novel del 2026-07-28 y aplica
> igual a los tres productos. EN es el idioma canónico: se escribe primero en EN siguiendo esta
> guía y luego se refleja en ES.

## Audiencia por sección

| Sección | Lector | Registro |
|---|---|---|
| getting-started, authoring, world, production, faq, troubleshooting | Escritores y creadores de juegos, NO programadores | Máxima claridad; toda jerga se glosa en línea la primera vez |
| scripting, reference | Programadores | La precisión técnica manda: nombres de API, firmas y claves exactas. La prosa alrededor sigue siendo clara |

La regla no es «prohibido lo técnico»: es saber dónde se usa. Un concepto técnico inevitable
(un API, un backend de input) se explica completo y con exactitud, pero abriendo con una frase
en lenguaje llano que diga qué es y cuándo le importa al lector.

## Estructura de una página

- **Frontmatter**: `title` y `description`. La description es 1–2 frases completas, ≤158
  caracteres, que resumen qué enseña la página. Nunca cortada a media palabra; sin comillas
  dobles sin escapar.
- **Sin H1 en el cuerpo** (el título sale del frontmatter). La página abre con 1–3 frases que
  dicen qué es esto y para quién, no con un encabezado.
- Secciones con `##`. Encabezados descriptivos: el lector debe predecir el contenido desde el
  encabezado. Una vez publicados, **no se renombran** (rompen anclas y sidebar).
- Cierre con `## See also` enlazando 3–6 páginas relacionadas.
- Hard-wrap a ~100 columnas, como el resto del contenido.
- Enlaces internos con ruta absoluta (`/docs/<producto>/...`). Imágenes en
  `/docs-images/<producto>/` con su ficha en `docs/screenshots.json`.

## Voz

- Voz activa, presente, segunda persona («you»). Imperativo en los pasos: «Click Add», no
  «You will need to click».
- Frases cortas (ideal <20 palabras). Párrafos de 2–4 frases.
- 3+ elementos enumerados en prosa → lista o tabla.
- **Prohibidas**: *easy, simple, quick, just, very, really*. Se describe concreto en su lugar.
- Sin preguntas retóricas ni transiciones de relleno («Now that we have...»).
- Vaguedades («often», «many») → dato concreto si existe.
- La voz de la casa es directa y con personalidad (frases cortas, afirmaciones rotundas tipo
  «Seven kinds, and that is the entire list»). Conservarla; no aplanar a genérico corporativo.
- **La prosa no lleva el número de versión del propio asset** (decisión de Álvaro, 2026-08-14). El sitio
  siempre describe la última versión, así que «not supported in 1.0.1» se escribe «not supported», y
  «beta in 1.0.1» es «currently in beta». Los números viven solo en las páginas de changelog. Sí se
  quedan: menciones históricas («since 1.0.0»), versiones de OTRO producto usadas como requisito
  («Beasty Save System 1.1») y versiones de paquetes de Unity («com.unity.ugui 2.0.0»).

## Términos y jerga

- Todo término se define la primera vez que aparece en la página, o se enlaza a la página que
  lo define. Ningún «it» ambiguo: si el antecedente puede confundirse, se repite el sustantivo.
- Jerga inevitable para no-programadores → glosa en línea con guiones largos:
  «referenced by GUID — Unity's permanent internal id for an asset —». Ejemplos ya glosados en
  las docs: GUID, uGUI, virtualized, atomic, PlayerPrefs, reflection, facade, Input System /
  Input Manager, app mode.
- Nombres de API, menús de Unity (`Tools > Beasty VN > ...`), claves de variables
  (`@time:daypart`) y bloques de código son **hechos, no prosa**: nunca se parafrasean ni se
  «humanizan». Si uno parece incorrecto, se verifica contra el asset antes de tocarlo.
- No inventar hechos técnicos. Lo que no se puede verificar se anota como duda, no se adivina.
- Los **nombres propios de los ejemplos** (ids de nodos como `cruce`, nombres de variables, archivos,
  personajes de ejemplo) son idénticos en EN y ES: no se traducen, no se «anglifican» ni se renombran
  al editar. Son hechos del ejemplo; cambiarlos los desalinea de las capturas y del proyecto del lector.

## Páginas de referencia

Las páginas de `reference/` (y las tipo referencia como `blocks-reference` o `vnbeasty-syntax`)
son neutras, exhaustivas y citables: tablas completas, cero tono tutorial, cada fila
autosuficiente. La calidez va en las guías, no aquí.

## Checklist de página nueva

1. Escribir EN siguiendo esta guía; registrar la página en `src/data/sidebars.ts` (EN y ES).
2. Crear el espejo ES en la misma ruta (traducción humanizada, no literal; terminología según
   `docs/specs/2026-07-13-portada-marca-y-humanizacion-es-design.md`).
3. Capturas: enlazar la imagen en EN y ES aunque el PNG no exista, ficha en
   `docs/screenshots.json`, y `npm run doc:shots`.
4. `npm run build` → `npm run doc:links` → `npm run doc:index`.

## Al editar prosa existente

- Cambiar solo lo que esté mal explicado, confuso o truncado. Lo que ya está bien no se
  reescribe.
- Todo cambio de **significado** en EN se anota en un registro de revisión (un `.md` temporal en
  `docs/` con la lista de cambios; se elimina al terminar la réplica) para replicarlo en ES. Los cambios cosméticos
  (quitar un *just*) no necesitan réplica salvo que ES arrastre la misma muletilla.
