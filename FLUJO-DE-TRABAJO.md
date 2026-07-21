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

## Casos típicos

| Situación | Qué haces |
|---|---|
| Cambiaste comportamiento de un asset | Lo anotas en su changelog → vienes aquí → `/sync-docs` |
| Añadiste una feature entera | Igual, pero aquí se te preguntará si va en una página existente o merece una nueva: esa decisión es tuya |
| Corregir una errata o mejorar una explicación | No toca Unity para nada. Se pide directamente aquí |
| Hiciste una captura de pantalla | La dejas en `public/docs-images/<producto>/` con el nombre exacto que pide `docs/SCREENSHOTS.md` |
| Publicar los cambios | Merge de `Develop` a `main`: el deploy solo corre al empujar a `main` |

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
4. **Decidir el nombre definitivo del tercer asset:** la documentación dice «Beasty Debug Logger» y en el
   sitio viejo lo renombraste a «BeastyConsole».
5. Cola de calidad: 59 descripciones EN truncadas · unificar «cifrado» frente a «encriptación» (54 casos
   en ES) · 12 capturas pendientes · 196 enlaces que usan el nombre de archivo como texto visible.
