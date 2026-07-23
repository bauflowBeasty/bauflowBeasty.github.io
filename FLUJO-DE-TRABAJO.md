# Flujo de trabajo de la documentación

> **Para quién es esto:** para Álvaro. Es el resumen humano de cómo se mantiene la documentación de los
> assets Beasty entre los dos proyectos. Las instrucciones equivalentes para Claude están en `CLAUDE.md`
> (aquí y en el proyecto Unity) y en `.claude/skills/sync-docs/SKILL.md`; si cambias el flujo, cambia
> también ahí.
>
> Establecido el 2026-07-21.

## La regla de oro

**En Unity vive el código y el changelog. En el sitio vive el texto de la documentación.**

Cada cosa en un sitio y solo en uno.

## Los dos proyectos

| Proyecto | Ruta | Qué guarda |
|---|---|---|
| **Unity** | `E:\Beasty\BeastyVisualNovel` | El código de los 3 assets. De texto, solo lo que viaja dentro del `.unitypackage`: `CHANGELOG`, `README` y `LICENSE` de cada asset. Control de versiones: **Plastic SCM**. |
| **Sitio** (este) | `D:\Beasty\BeastyDocumentationPage` | **Toda** la documentación, en EN (canónico) y ES (espejo humanizado). Se publica en https://bauflowbeasty.github.io. Control de versiones: **git**. |

## Qué haces en el proyecto Unity

Tu única obligación documental ahí es **anotar en el changelog del asset** lo que cambie de comportamiento:

```
Assets/BeastyComponents/<asset>/<Asset>_CHANGELOG.md
```

Merece la pena anotarlo bien, porque de esa viñeta sale la documentación. Describe **el efecto para quien
usa el asset**, no cómo lo implementaste:

- ✅ «Probar un slot que no existe ya no imprime un aviso por slot.»
- ❌ «Refactorizado `SlotProbe`.» — no dice nada que se pueda documentar.

**Lo que NO se hace ahí:**

- No escribir documentación.
- No recrear la carpeta `Documentation/` (se vació a propósito; solo queda un README que lo explica).
- No dejar archivos de traspaso tipo `DOC-UPDATES-*.md`.

## Qué haces en el repo del sitio

Escribes un solo comando:

```
/sync-docs
```

Claude detecta qué changelogs no están reflejados y qué `.cs` tocaste, localiza las páginas afectadas con
el índice, edita EN, espeja ES, registra las páginas nuevas en el sidebar y verifica con build y enlaces.

Si quieres mirar el estado sin que se toque nada:

| Comando | Para qué |
|---|---|
| `npm run doc:sync` | ¿Se ha quedado algo atrás respecto al proyecto Unity? |
| `npm run doc:index` | Regenerar `docs/DOC-INDEX.md` tras tocar contenido |
| `npm run build` | Construir el sitio |
| `npm run doc:links` | Enlaces rotos — **siempre después del build**, porque lee `dist/` |
| `npm run dev` | Servidor local en localhost:4321 |

## En qué orden se usan los comandos

El orden importa por dos motivos: `doc:links` lee `dist/`, así que **sin build antes mide la versión
anterior**; y `doc:index` debe correr después de editar contenido, o el índice apunta a lo viejo.

### Ciclo normal: cambiaste algo en el asset

```
                    ┌─ en el proyecto Unity ─┐   ┌────── en el repo del sitio ──────┐
   cambias código →  /changelog               →   /sync-docs  →  commit  →  merge a main
```

`/sync-docs` ya ejecuta por dentro, y en este orden, los cuatro comandos:

| # | Comando | Por qué en ese punto |
|---|---|---|
| 1 | `npm run doc:sync` | **Antes de tocar nada**: dice qué se ha quedado atrás |
| 2 | *(edición de páginas EN y ES)* | El trabajo en sí |
| 3 | `npm run doc:index` | Después de editar, para que el índice incluya los símbolos nuevos |
| 4 | `npm run build` | Genera `dist/` con el contenido nuevo |
| 5 | `npm run doc:links` | **Después del build**, nunca antes: lee `dist/` |
| 6 | `npm run doc:sync` | Cierre: debe quedar en «Todo sincronizado» |

### Ciclo de publicación

```
   /release  →  check-in en Plastic  →  commit  →  merge a main  →  subir el paquete a la tienda
```

`/release` hace su propia verificación con los mismos pasos 3-6. El merge a `main` es lo que dispara el
deploy: sin él, la web publicada sigue mostrando la versión anterior.

### Si solo quieres mirar sin cambiar nada

```
npm run doc:sync
```

Es de solo lectura y contesta las cuatro preguntas de una vez: si hay changelogs sin reflejar, si hay
código tocado en Unity, si las versiones cuadran en los cuatro sitios, y si el índice está fresco.

### Cuándo NO hace falta nada de esto

Corregir una errata, mejorar una explicación o retocar el estilo de una página: se pide aquí directamente y
ya está. Solo conviene lanzar `npm run doc:index` al final si tocaste nombres de API dentro del texto.

## Casos típicos

| Situación | Qué haces |
|---|---|
| Cambiaste comportamiento de un asset | Lo anotas en su changelog → vienes aquí → `/sync-docs` |
| Añadiste una feature entera | Igual, pero aquí se te preguntará si va en una página existente o merece una nueva: esa decisión es tuya |
| Corregir una errata o mejorar una explicación | No toca Unity para nada. Se pide directamente aquí |
| Hiciste una captura de pantalla | La dejas en `public/docs-images/<producto>/` con el nombre exacto que pide `docs/SCREENSHOTS.md` |
| Publicar los cambios | Merge de `Develop` a `main`: el deploy solo corre al empujar a `main` |

## Versiones

**Cada asset se versiona por separado.** Hoy los tres están en 1.0.0 sin publicar, pero se venden sueltos:
el Save System puede ir por la 1.0.1 mientras la novela visual sigue en la 1.0.0. Nunca se sube la versión
de un asset que no cambió.

**El sitio describe siempre la última versión.** No hay documentación versionada: si una página deja de ser
cierta, se reescribe. La historia la lleva el changelog, que se publica como una página más.

El número de versión vive en cuatro sitios, y `npm run doc:sync` comprueba que coinciden:

| Dónde | Qué |
|---|---|
| Changelog del asset (Unity) | La cabecera `## X.Y.Z — unreleased` |
| README del asset (Unity) | La línea `**Version X.Y.Z**` |
| `src/data/products.ts` (sitio) | El campo `version` del producto |
| Páginas de changelog EN y ES | El reflejo de todo lo anterior |

### Cómo trabaja el ciclo

Mientras la versión está **sin publicar**, todo lo que anotes va a `## X.Y.Z — unreleased`. Los cambios de
comportamiento respecto a builds anteriores van a `### Pre-release changes`.

Cuando la publiques, en este repo ejecutas:

```
/release
```

Eso cierra el changelog con la fecha real, **elimina `### Pre-release changes`** —quien compra la versión
publicada nunca tuvo las builds anteriores, así que esas viñetas hablan de algo que no vivió; lo que siga
siendo información útil se funde en las secciones temáticas—, sube el número en los cuatro sitios, revisa
las menciones sueltas de la versión en las páginas, y te pregunta por las URLs de tienda si aún estaban
como «Coming soon».

Después de publicar, la siguiente vez que anotes algo con `/changelog` en Unity, Claude verá que la versión
de arriba ya tiene fecha y te preguntará qué número abrir: parche, menor o mayor.

**No olvides el merge.** El deploy solo corre al empujar a `main`, así que sin él la documentación publicada
sigue mostrando la versión anterior.

## Por qué el flujo es así

Hasta el 2026-07-21 la documentación existía **dos veces**: un árbol en el proyecto Unity y este sitio.
Las dos copias se desincronizaron en silencio y en ambos sentidos — la guía de Logging existía en Unity y
faltaba en el sitio; una entrada del changelog existía en el sitio y faltaba en Unity — y nadie se enteró
hasta que se comparó archivo a archivo. Además, aquel árbol estaba **fuera de `Assets/`**, así que nunca
viajaba dentro del `.unitypackage`: eran 81 archivos que no servían a nadie salvo para divergir.

Una sola copia elimina esa clase de problema entera. Y como el changelog es lo único que ya mantenías por
obligación (viaja con el asset), es el canal natural para avisar de qué hay que documentar.

## Piezas que sostienen el flujo

| Pieza | Qué hace |
|---|---|
| `docs/DOC-INDEX.md` | **Generado.** Índice inverso símbolo → página: responde «¿qué páginas documentan `MigratedFrom`?» sin abrir las 83. Se consulta con búsqueda, no se lee entero |
| `scripts/sync-check.mjs` | Compara changelogs (Unity ↔ copia local ↔ páginas EN/ES) viñeta a viñeta y consulta Plastic por los `.cs` tocados |
| `scripts/doc-index.mjs` | Genera el índice |
| `.claude/skills/sync-docs/SKILL.md` | El procedimiento que sigue Claude con `/sync-docs` |
| `docs/sync-state.json` | Rutas del proyecto Unity y de `cm.exe` |
| `PROJECT_MAP.md` | Mapa de este repo. Se lee antes de buscar y se actualiza al cambiar la estructura |

## Dos detalles que conviene no olvidar

- **`*.md` está en el `.plasticignore` del proyecto Unity.** Los `CHANGELOG`, `README` y `LICENSE` de los
  assets sí están versionados (se añadieron antes de esa regla), pero cualquier `.md` **nuevo** que se cree
  allí nace privado: no se versiona ni se respalda salvo que se añada a mano.
- **Las descripciones del frontmatter en EN están cortadas** a 155 caracteres en 59 de 82 páginas. Es
  herencia de `scripts/migrate-docs.mjs` (`.slice(0, 158)`). Al crear una página nueva, escribe una
  descripción completa; no imites a las vecinas.

## Estado a 2026-07-21 (esto sí caduca)

Pendiente, por orden de importancia:

1. **Nada está publicado.** `Develop` va por delante de `main` y el deploy solo corre al empujar a `main`.
   Falta además activar en GitHub → Settings → Pages el origen «GitHub Actions» (ajuste manual, una vez).
2. Commitear en este repo el trabajo de sincronización de Logging y la maquinaria nueva.
3. Confirmar en Plastic los borrados pendientes del proyecto Unity.
4. **Terminar el renombrado a Beasty Console.** El sitio ya está renombrado por completo: URLs
   (`/docs/beasty-console/`), textos e identificadores de código. Falta el proyecto Unity, que exige cerrar
   Unity antes: carpeta `BeastyDebugLogger` → `BeastyConsole`, los dos `.asmdef` a `Beasty.Console` y
   `Beasty.Console.Editor`, namespace `BeastyDebugLoggerConsole` → `BeastyConsoleLogger`, clase
   `BeastyDebugLogger` → `BeastyConsole`, y la cadena de detección por reflexión de `BeastySaveLog.cs:147`.
   Hasta que eso ocurra, la documentación describe nombres que el código todavía no tiene.
5. Cola de calidad: 59 descripciones EN truncadas · unificar «cifrado» frente a «encriptación» (54 casos
   en ES) · 12 capturas pendientes · 196 enlaces que usan el nombre de archivo como texto visible.
