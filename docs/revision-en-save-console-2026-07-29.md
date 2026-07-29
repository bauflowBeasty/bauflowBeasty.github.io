# Revisión EN — Beasty Save System y Beasty Console (2026-07-29)

Registro de la revisión general de las 33 páginas EN de Beasty Save System (25) y Beasty Console
(8); se excluyeron los dos `changelog.md`, que son registro histórico. Mismos objetivos y método
que la revisión de Visual Novel (`docs/revision-en-visual-novel-2026-07-28.md`): corregir lo mal
explicado, humanizar según la audiencia de cada sección (reference/advanced conservan precisión
técnica) y reescribir las `description` truncadas por la migración.

**Cómo usar este documento para la traducción ES:** cada entrada lista los cambios de significado
de esa página; la ES es espejo 1:1. Los cosméticos (quitar *just*, *simply*…) solo aplican si la
ES arrastra la muletilla. Revisar todas las descriptions ES contra las nuevas EN.

**Patrones globales aplicados:**

- Descriptions truncadas a media palabra → reescritas como 1–2 frases completas ≤158 caracteres.
- Jerga glosada en línea en páginas no-reference: *facade*, *reflection*.
- Muletillas eliminadas: *just*, *simply*, *very*.

---

## Save System — básicos y guías de datos

### beasty-save-system/index.md
- **[description]** Reescrita: "Save and load your game's data as JSON files on disk. No dependencies, no exceptions: typed results, atomic writes, backups, encryption, migrations."
- Sin más cambios.

### getting-started/installation.md
- **[description]** Sin cambios (ya era válida).
- **[The converter modules]** Cosmético: *simply* eliminado.

### getting-started/save-without-code.md
- **[description]** Reescrita: "From an empty scene to a working save and load without writing C#: two components, a few ticked boxes, and two wired uGUI buttons."
- **[5. Wire the Save button]** "The slot name is just the file name." → "The slot name is the file name, nothing more."

### getting-started/save-with-code.md
- **[description]** Reescrita: "The five-minute C# path: a data class, a BeastySaveSettings, then BeastySave.Save and BeastySave.Load with typed results instead of exceptions."
- **[The two namespaces]** Glosado *facade*: "`BeastySave` is a static facade — one static class that fronts the whole system — and the only entry point."

### guides/what-gets-saved.md
- **[description]** Reescrita: "Which of your data ends up in the save file, which does not, and which mistakes fail a save outright. The one page every user should read early."
- **[Assets referenced by name…]** "no error, no crash, just the old value" → "no error, no crash, the old value stays".
- Cosméticos: "very often" → "usually"; "if you really need" → "if you need".

### guides/settings.md
- **[description]** Reescrita: "Every BeastySaveSettings field, its default, and when to change it: folder, extension, encryption, backups, strict loading and data version."
- **[Slot names]** Cosmético: "not just Windows" → "not only Windows".

### guides/slots-and-metadata.md
- **[description]** Reescrita: "How slots are named, listed and deleted, and how to attach plain-text metadata so a save-slot screen never has to load a full save."
- Cosméticos: dos *just* eliminados.

### guides/scene-state.md
- **[description]** Reescrita: "Saving objects already in your scene with BeastySaveable and BeastySaveManager, and the id rules that decide whether they come back."
- Sin más cambios.

---

## Save System — guías de robustez y flujo

### guides/async-saving.md
- **[description]** Reescrita: "Save and load without blocking the main thread. What SaveAsync, LoadAsync and LoadIntoAsync move off the main thread, and what stays on it."
- Sin más cambios.

### guides/backups-and-corruption.md
- **[description]** Reescrita: "How atomic writes and .bak backups protect saves from crashes and corruption, and how to offer the player a restore when a load fails."
- **[Backups: the previous version, kept]** La captura `save-backup-files.png` partía en dos la frase «it is moved to:» y su bloque de ruta; imagen movida (misma ruta) tras el párrafo anterior. Sin cambio de significado, pero el orden de párrafos ES debe reflejarlo.

### guides/encryption.md
- **[description]** Reescrita: "Turn on AES-256 encryption so players cannot edit their saves in a text editor, and an honest note on what that protection is worth."
- **[Read this first]** Cosmético: "not just this one" → "not only this one".

### guides/logging.md
- **[description]** Reescrita (medía 161): "The Logging dropdown on BeastySaveManager: what each mode prints, how to send the lines to your own sink, and what logging costs in a release build."
- **[See also]** Sección `## See also` AÑADIDA al final (era la única página sin ella): enlaza Backups and corruption, Components, Results and errors y Troubleshooting. La ES debe añadirla igual.

### guides/save-manager-window.md
- **[description]** Reescrita: "Tour of the Save Manager window: create the manager, make objects saveable, and inspect, restore or delete the save files on disk."
- Sin más cambios.

### guides/strict-vs-tolerant.md
- **[description]** Reescrita: "Strict loading refuses a save whose fields no longer match your code; tolerant loads what it can and warns you. When to pick each."
- **[The caveat you need to know]** Cosmético: *simply* eliminado.

### guides/versioning-and-migrations.md
- **[description]** Reescrita: "How DataVersion and registered migrations let a new build open old saves without losing data, and why newer saves are refused."
- **[Registering a migration]** "For a migration you need very little of it" → "For a migration you need three operations".

---

## Save System — advanced, reference, faq, troubleshooting

### advanced/custom-converters.md
- **[description]** Reescrita: "Write an IBeastyConverter to save state the default path cannot reach, override a built-in, and register it so it survives the Play Mode reset."
- Sin más cambios.

### advanced/platforms-and-limits.md
- **[description]** Sin cambios (ya era válida).
- **[Thread safety]** Frase que no parseaba → "Two internals are built to be thread-safe: converter resolution is cached in a concurrent dictionary, and the mapper's per-load tolerance state is thread-local."

### reference/api-beastysave.md
- **[description]** Reescrita: "Complete reference for the BeastySave static facade: saving, loading, slots, registration, paths and logging, with the error codes each call returns."
- **[intro]** "Every method takes a `BeastySaveSettings`…" → "Every save, load and slot method takes a `BeastySaveSettings`…" (los métodos de registro/rutas/logging no).

### reference/components.md
- **[description]** Reescrita: "The two MonoBehaviours: BeastySaveable marks a GameObject for scene saves; BeastySaveManager holds the settings and runs SaveAll and LoadAll."
- Sin más cambios.

### reference/converter-modules.md
- **[description]** Reescrita: "The seven optional converter modules and the always-on core layer, with the exact fields each built-in converter stores and restores."
- **[TMPro]** Enumeración ambigua → "the colour as four members `r`, `g`, `b`, `a`, plus `fontStyle` and `alignment`, both stored as raw integers."

### reference/json-engine.md
- **[description]** Reescrita: "JsonNode, JsonParser, JsonWriter and JsonMapper: the zero-dependency JSON engine the save system ships, usable on its own for config files or tooling." (la anterior escribía mal el namespace: `BeastySaveSystemCore.Json` en vez de `Beasty_SaveSystemCore.Json`).
- Sin más cambios.

### reference/results-and-errors.md
- **[description]** Reescrita: "SaveResult, LoadResult and the thirteen BeastySaveError codes: what causes each one and what your game should do about it."
- **[FieldMapFailed]** Frase que no parseaba → "or a value-type field that is missing from the JSON".

### reference/save-file-format.md
- **[description]** Reescrita: "The on-disk format: the envelope, the group document, the write pipeline and the load gates. For inspecting saves and writing tools against them."
- Sin más cambios.

### faq.md
- **[description]** Sin cambios (ya era válida).
- Sin más cambios.

### troubleshooting.md
- **[description]** Sin cambios (ya era válida).
- **[Loading fails with DecryptFailed]** Contradicción con results-and-errors corregida: el caso inverso (ajustes en texto plano leyendo archivo cifrado) falla como `Corrupt`, no `DecryptFailed`: "The reverse mismatch — a plain-text setting reading an encrypted file — fails too, but as `Corrupt`, because the checksum cannot match."

---

## Console

### beasty-console/index.md
- **[description]** Reescrita: "A static logging API with eleven semantic levels you call instead of Debug.Log, plus an editor console that classifies, filters and searches every log."
- Sin más cambios.

### getting-started.md
- **[description]** Sin cambios (ya era válida).
- **[Your first log]** "Add this to any MonoBehaviour:" → "Add this to any MonoBehaviour, inside a method such as `Start()`:" (tal como estaba invitaba a pegar el snippet a nivel de clase, donde no compila).

### guides/console-window.md
- **[description]** Reescrita: "Every control of the Beasty Console window: level filters with live counts, search, Collapse, Error Pause, and stack-trace links that open your IDE."
- **[Behaviours worth knowing]** Glosa circular eliminada: "filed as Plain (a plain log) or Unknown" → "filed under Plain or Unknown".

### guides/logging.md
- **[description]** Sin cambios (ya era válida).
- Sin más cambios.

### guides/release-builds.md
- **[description]** Reescrita: "What logging costs in a shipped game, what the master switch IsEnabled does and does not do, and how to strip log calls from a release build for real."
- Sin más cambios.

### guides/beasty-integration.md
- **[description]** Sin cambios (ya era válida).
- **[Beasty Visual Novel]** Glosados *facade* y *reflection*: "logs through its own facade, `VNLog` — a thin wrapper class that forwards every message to whichever logger it finds. `VNLog` looks this logger up by reflection — by class name at runtime, without referencing the assembly — the same way the save system does".

### reference/api.md
- **[description]** Reescrita (no truncada, pero no resumía la página): "Every public member of BeastyConsoleLogger.BeastyConsole: the IsEnabled switch, the level methods, PrintLongMessage, LogColor and the tag table."
- Sin más cambios.

### faq.md
- **[description]** Reescrita (era la primera respuesta cortada): "Answers to the questions that come up most: Unity Console overlap, log files, release-build cost, custom levels and disappearing logs."
- **[apertura]** Línea de intro añadida (la página abría con un `##`): "Short answers, with a link to the page that has the long one."

---

## Verificación en código — 2026-07-29

Las 11 dudas se resolvieron leyendo el código fuente (`E:\Beasty\BeastyVisualNovel`) con agentes
de solo lectura. Veredictos:

| # | Duda | Veredicto |
|---|---|---|
| 1 | Dependencia del módulo TMPro | Imprecisa: el asmdef referencia el ensamblado `Unity.TextMeshPro` con dos versionDefines — `com.unity.textmeshpro` (cualquier versión) y `com.unity.ugui` ≥2.0.0. **Fila corregida.** |
| 2 | Envelope `"beasty": 2` | Vigente (`SaveEnvelope.ContainerVersion = 2`; se valida con igualdad estricta y falla como `VersionTooNew`). Sin cambios. |
| 3 | `Register()` sin id | Si el objeto no trae `BeastySaveable`, lo añade y genera un GUID fresco; nunca falla por id. Un id fresco no casa con saves antiguos. **Párrafo corregido en scene-state.md.** |
| 4 | Límite de 512 niveles | **La doc estaba equivocada**: solo lo comprueba el parser al CARGAR. Se guarda con `Ok` y falla al cargar con `ParseError`. **Frase corregida en platforms-and-limits.md.** |
| 5 | Frase de stripping IL2CPP | Mal enfocada: `Load<T>` es referencia estática y el ctor eliminado ya tiene fallback. El riesgo real: colecciones declaradas por interfaz con structs propios (`ISet<ItemStack>`) → `MakeGenericType` en runtime sin código AOT. **Párrafo reescrito.** |
| 6 | Códigos de error del cifrado | La doc acierta: cifrado-lee-plano → `DecryptFailed` (puerta previa al checksum, con test); plano-lee-cifrado → `Corrupt`. El arreglo de troubleshooting era correcto. **encryption.md ahora nombra `Corrupt`.** (Rincón no documentado: guardado plano con raíz string leído con `Encrypted=true` da `Corrupt`.) |
| 7 | Logging Off | Correcto: `Off` silencia también errores (mismo guard en `Error`, test incluido). `Auto` en release resuelve a `Off`. Sin cambios. |
| 8 | `RegisterMigration` | Sí, en `BeastySave` (`public static void RegisterMigration(int, int, Func<JsonNode, JsonNode>)`). Sin cambios. |
| 9 | Plain vs Unknown | `Plain` es el fallback real (todo log sin color/emoji de Beasty); `Unknown` es inalcanzable en el clasificador actual — categoría reservada, contador siempre 0. **Dos frases corregidas en console-window.md.** |
| 10 | Log sink del Save System | Campo estático público `BeastySaveLog.Sink` (`IBeastySaveLogSink`: Info/Warning/Error). Se resetea en cada Play → asignar en runtime. **beasty-integration.md ahora lo nombra.** |
| 11 | Color de Info | Correcto: `#00e676`, verde. Warning/Error/Exception usan los colores de Unity y en build no hay color. Sin cambios. |

### Cambios EN aplicados tras la verificación (replicar en ES)

- **getting-started/installation.md** — Fila TMPro de la tabla de módulos: «`com.unity.textmeshpro`,
  or `com.unity.ugui` 2.0.0 or newer» → «The TextMeshPro assembly: `com.unity.textmeshpro` (any
  version), or `com.unity.ugui` 2.0.0 or newer, which ships it».
- **advanced/platforms-and-limits.md** — (a) «Data nested deeper than that fails to save.» → «…saves
  without complaint but cannot be loaded back: the load fails with `ParseError`.»; (b) párrafo de
  stripping reescrito con el escenario real: campo declarado como interfaz de colección con struct
  propio → declarar el tipo concreto.
- **guides/encryption.md** — «The load fails.» → «The load fails as `Corrupt`, because the checksum
  cannot match.»
- **guides/scene-state.md** — «The one without an id uses whatever id the object already has, which
  is only useful for objects that came from the scene.» → mantiene el id existente; si no hay
  `BeastySaveable`, lo añade con un id fresco generado que no casa con saves antiguos.
- **guides/console-window.md (Console)** — «plus two for everything else: Plain and Unknown.» →
  Plain = todo log sin formato Beasty (un `Debug.Log` pelado); Unknown = categoría reservada que se
  queda a cero. Y «filed under Plain or Unknown» → «filed under Plain».
- **guides/beasty-integration.md (Console)** — «assign your own log sink on the save system's
  logging facade» → nombra el miembro real: implementar `IBeastySaveLogSink` y asignar
  `BeastySaveLog.Sink` en runtime (se resetea en cada Play).

### Apuntes de estilo no aplicados (decisión de Álvaro)

- Enlaces con texto de nombre de archivo (`[settings.md]`, `[logging.md]`…) en api-beastysave,
  results-and-errors, save-manager-window y logging (SS): inconsistentes con el resto del sitio.
- custom-converters.md: «Two rules, and they are not negotiable» seguido de «Third rule» — parece
  voz deliberada; se deja tal cual salvo indicación.
