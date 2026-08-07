# Diseño: portada con marca Beasty Components + humanización de docs en español

**Fecha:** 2026-07-13
**Estado:** aprobado por Álvaro

## Contexto

Dos problemas en el sitio actual:

1. La portada dice explícitamente que hay **tres** paquetes ("Tres paquetes para Unity…",
   "Cómo encajan los tres"). Álvaro irá agregando assets de a poco, así que la portada debe
   ser agnóstica al número: agregar un producto a `products.ts` no debe obligar a retocar copy.
2. Las 80 páginas de documentación en español (`src/content/docs/es/`) se leen robóticas:
   calcos del inglés ("cada otra página", "en lugar de crear nunca un segundo"), orden de
   frase calcado del inglés. El contenido técnico es correcto; el fraseo no suena a español
   escrito por una persona.

Además, la marca paraguas se llama **Beasty Components** y el sitio debe presentarse con
ese nombre. El logo del header es solo la letra "B" (marca gráfica), no se toca.

## Parte 1 — Portada y marca

Todos los cambios de texto en `src/data/ui-strings.ts` salvo donde se indica.

| Clave / lugar | EN | ES |
|---|---|---|
| `hero.eyebrow` | Beasty Components | Beasty Components |
| `hero.sub` | Unity tools — a visual novel engine, a save system, a logger — each documented page by page, so you know exactly what you are buying before you buy it. | Herramientas para Unity — un motor de novela visual, un sistema de guardado, un logger — cada una documentada página a página, para que sepas exactamente qué compras antes de comprarlo. |
| `ecosystem.heading` | How they fit together | Cómo encajan entre sí |
| `footer.tagline` | Beasty Components — Unity tools by bauflow. | Beasty Components — herramientas para Unity por bauflow. |
| `<title>` home (`LandingPage.astro`) | Beasty Components — Unity tools by bauflow | Beasty Components — Herramientas para Unity por bauflow |
| Alt del logo (`Header.astro`) | Beasty Components — home | Beasty Components — inicio |

Nota: el alt del logo hoy está hardcodeado en inglés; al cambiarlo, usar la cadena según
`lang` (vía `ui-strings.ts`) para que el ES no quede en inglés.

Verificar con búsqueda que no queda ninguna otra mención a la cantidad de paquetes en
`src/` fuera del contenido técnico de los docs (donde "three panels" etc. es legítimo).

## Parte 2 — Humanización de los docs en español

**Enfoque: pasada de edición, no re-traducción.** Se conserva el contenido técnico y se
reescribe la prosa que suena a traducción automática.

**Tono elegido:** español latino neutro, tuteo, natural y cercano. Sin agregar humor ni
personalidad extra; sin volverlo más formal.

### Guía de estilo (criterios para la edición)

- Eliminar calcos: "cada otra página" → "las demás páginas"; construcciones como
  "en lugar de crear nunca un segundo" se reescriben a español natural.
- Reordenar frases que siguen el orden del inglés cuando en español suenan forzadas.
- Mantener intactos: bloques de código, comandos, rutas, nombres de UI en inglés
  (**Story**, **Controls**, `Create > Beasty VN > …`), enlaces (URLs y anchors),
  frontmatter salvo `description` (ver abajo), nombres de producto.
- Terminología consistente en todo el sitio (p. ej. "sistema de guardado", "misión",
  "sala") — la que ya usan las páginas, unificada.
- `description` del frontmatter: además de humanizarla, arreglar las que están truncadas
  a mitad de palabra (p. ej. core-concepts termina en "deja de sorpr").

### Proceso

1. **Muestra primero:** reescribir 1 página (FAQ de Beasty Visual Novel) y mostrársela a
   Álvaro para calibrar el tono antes de lanzar el resto.
2. **Edición en paralelo por lotes:** agentes en paralelo, ~10 páginas cada uno. Cada agente
   recibe la guía de estilo, el archivo ES a editar y el EN homólogo como referencia de
   significado. Solo tocan prosa.
3. **Verificación:** `node scripts/check-links.mjs` (enlaces internos), `npm run build`
   (que compile y Pagefind indexe), y revisión manual de muestras al azar.

## Fuera de alcance

- No se re-traduce desde cero ni se toca el contenido en inglés.
- No se rediseña nada visual; solo textos.
- No se cambia el logo gráfico.

## Criterio de éxito

- La portada no menciona cuántos paquetes hay y presenta la marca Beasty Components.
- Las páginas ES se leen como escritas en español, verificado por Álvaro sobre muestras.
- Link checker y build pasan sin errores.
