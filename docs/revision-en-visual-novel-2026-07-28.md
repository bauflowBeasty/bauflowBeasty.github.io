# Revisión EN — Beasty Visual Novel (2026-07-28)

Registro de la revisión general de las 49 páginas EN de Beasty Visual Novel (se excluyó
`changelog.md`, que es registro histórico). Objetivos: corregir lo mal explicado, humanizar el
lenguaje para no-programadores (manteniendo precisión técnica en scripting/reference) y reescribir
las `description` truncadas por la migración (`.slice(0, 158)`).

**Cómo usar este documento para la traducción ES:** cada entrada lista los cambios de significado
de esa página. La ES es espejo 1:1, así que cada cambio de aquí tiene que reflejarse en el archivo
ES de la misma ruta. Los marcados como «cosmético» (quitar *just*, *simply*…) solo aplican a ES si
la traducción arrastró la muletilla. Las `description` ES conviene revisarlas todas contra las
nuevas EN (las ES podrían venir del mismo defecto de truncado).

> **Réplica ES completada el 2026-07-29.** Las 49 páginas ES reflejan la EN revisada, incluidos
> los cambios post-verificación. Todas las descriptions ES quedaron ≤158 caracteres y completas
> (verificado por script). Divergencias extra corregidas de paso: «encriptación» → «cifrado» en
> index.md y faq.md ES; sentido invertido en la tabla de modos de interactables-and-doors.md ES
> («built for you»); descriptions ES largas en quests, free-roam-rooms, logging y overview.

**Patrones globales aplicados** (búscalos también al traducir):

- Todas las `description` truncadas a media palabra → reescritas como 1–2 frases completas ≤158 caracteres.
- Jerga glosada en línea la primera vez que aparece en páginas para no-programadores: GUID, uGUI,
  virtualized, atomic, idempotent, reflection, facade, PlayerPrefs, serialized, master-detail,
  input backends, app mode, file IO, kinetic novel.
- Muletillas eliminadas: *just*, *simply*, *simple*.
- Términos usados antes de definirse → definición o enlace adelantado.

---

## Portada y primeros pasos

### index.md
- **[description]** Reescrita: "You write the story. Beasty Visual Novel plays it. A complete visual novel engine for Unity: authoring editor, runtime and no code required."
- **[Two views of the same scene]** Glosado GUID: "Art is referenced by GUID — Unity's permanent internal id for an asset — so renaming or moving a sprite does not break a synced node."
- **[More than a dialogue player]** Glosado uGUI: "Everything the player sees is a standard Unity UI (uGUI) prefab you can restyle."
- **[You are a programmer]** Frase rota arreglada: "in its own assembly from the view layer" → "in its own assembly, separate from the view layer".

### getting-started/installation.md
- **[description]** Reescrita: "What you need before importing Beasty Visual Novel, what the import creates, and what each folder in the package is for. No pipeline or input setup required."
- **[Render pipeline / Save System bundled]** Cosmético: puntuación y coherencia de tiempos verbales.

### getting-started/your-first-scene.md
- **[description]** Reescrita: "From an empty Unity project to a playable scene: a backdrop, a character who speaks two lines, and a choice that branches. No code, about ten minutes."
- **[2. Get the assets]** "The wizard also creates…" → "**Create Scene** also creates…" («the wizard» nunca se había presentado; ahora el referente es el comando del paso 1).
- **[2. Get the assets]** "If those four words mean nothing" → "If those four names mean nothing" (se refiere a los nombres de los cuatro assets).
- **[Where to go next]** Añadida frase tras el script de ejemplo: "The words after `label` and `choice` are node names, so yours will show whatever your nodes are called." (el ejemplo usa nombres que el tutorial nunca pidió crear).

### getting-started/core-concepts.md
- **[description]** Reescrita: "The seven ideas behind the whole package, from scenes and nodes to the variable store. Hold them and every other page is detail."
- **[intro]** **"Six ideas." → "Seven ideas."** — la página desarrolla siete conceptos (DialogueScene, VNContext, StoryGraph, Node, Block, variable store, BeastyManager) y decía seis. También quitado un *just*.

### getting-started/editor-tour.md
- **[description]** Reescrita: "A walk through the Beasty VN window — the top bar, the nine tabs and the companion windows — so you know where everything is before you need it."
- **[Variables]** "It is a master-detail list… move between casts quickly" → "It is a list with a detail panel… move between characters quickly" (jerga fuera, y «casts» era incorrecto: hay un solo cast).

### faq.md
- **[description]** Reescrita: "Short answers to common questions: code, render pipelines, saves, localization, custom UI and migrating from Ren'Py. Each links to the full page."
- Sin más cambios.

### troubleshooting.md
- **[description]** Reescrita: "Symptom, cause, fix for the most common problems: black screen, silent blocks, refused imports, missing characters, stale translations."
- Sin más cambios.

---

## Authoring

### authoring/story-graph.md
- **[description]** Reescrita: "The canvas where you build a scene: how to create, wire and colour nodes, and what each of the seven node types is for."
- **[Dialogue Node]** Cosmético: "just needs to be told" → "**only** needs to be told".

### authoring/blocks-reference.md
- **[description]** Reescrita: "Every block a Dialogue Node can hold, category by category: what each one does, its options, and the behaviours that surprise people."
- **[How blocks run]** **Contradicción numérica corregida:** "Three blocks besides Dialogue also stop:" → "Four blocks besides Dialogue also stop:" (la lista suma cuatro: los tres bloques Input + Wait a 0 segundos).
- **[Flow > Go to VN scene]** Inciso críptico aclarado: "— Intro to Chapter 1 —" → "— from the Intro to Chapter 1, say —".

### authoring/choices-and-decisions.md
- **[description]** Reescrita: "Choice Nodes ask the player, Decision Nodes ask the world. How to build both, plus the conditions and effects that gate and drive them."
- **[Effects]** "Effects exist in three places in this page's scope:" → "Effects live in three places:".

### authoring/dialogue-and-stage.md
- **[description]** Reescrita: "How to write a line and dress the scene around it: speakers, delivery states, backdrops, characters, props and the art fallback chain."
- Sin más cambios (ver Dudas).

### authoring/dialogue-preview.md
- **[description]** Reescrita: "See a node as the player will — backdrop, characters, dialogue box — without entering Play Mode, and jump straight to any block."
- Sin más cambios.

### authoring/subgraphs.md
- **[description]** Reescrita: "Fold a stretch of story into one node, reuse it from several places, and route on the outcome its Return node hands back."
- **[A worked example, paso 4]** "point each one's `subGraph` at…" → "point each one's `subGraph` field at…" (sin «field» no se entendía que es un campo del inspector).

### authoring/transitions.md
- **[description]** Reescrita: "The four exits that hand control out of the visual novel, as blocks or as a Flow node, and how to pick between the two forms."
- **[Go to VN scene]** Mismo arreglo que en blocks-reference: "— from the Intro to Chapter 1, say —".

### authoring/text-script.md
- **[description]** Reescrita: "Write a scene as a plain-text .vnbeasty script that stays in two-way sync with the story graph, with an in-editor tab and a safety contract."
- Sin más cambios (ver Dudas).

### authoring/vnbeasty-syntax.md
- **[description]** Reescrita: "The complete grammar of the .vnbeasty script: every statement, node header, condition and effect, with examples, for lookup."
- **[File structure > Node kinds]** "This kind-first form is what the writer emits…" → "This kind-first form is the canonical one: on the next graph sync, a linked script is rewritten to use it." («the writer» era el serializador, pero se leía como el escritor humano).
- **[Backdrops]** "Each modifier turns one of those off:" → "Each modifier overrides one of those defaults:" (el modificador `volume` no «apaga» nada).

---

## World

### world/characters.md
- **[description]** Reescrita: "What a character is made of: identity, sprites, delivery styles, aliases and stats — everything you author on a Character Definition."
- **[Identity]** "A delivery style can override it" → "A delivery style (below) can override it" (término usado antes de definirse).
- **[Delivery styles / Aliases]** Cosmético: *simply* y *just* eliminados.

### world/dictionary.md
- **[description]** Reescrita: "Dictionary entries are named text tokens holding the player's own words — never translated. Create them, print them in lines, and set them from the story."
- **[Setting it]** "where it shadows your default" → "where it overrides your default" («shadows» es jerga de programación).

### world/variables-and-conditions.md
- **[description]** Reescrita: "Variables are what your game remembers; conditions are how it decides. The shared store, the Set variable block, clauses, effects and @self."
- **[And, Or, and precedence]** "This is ordinary boolean precedence…" → "AND-before-OR is the standard grouping…" (sin jerga, mismo dato).
- **[The two rules that catch everyone out]** Cosmético: *just* eliminado.

### world/game-time.md
- **[description]** Reescrita: "Dayparts, an optional clock, weekdays and seasons. Author-driven time that powers character routines, conditional backgrounds and recurring quests."
- Sin más cambios.

### world/items-and-inventory.md
- **[description]** Reescrita: "Define the items the player carries, hand them out with blocks, and gate choices and doors on them. Includes the ready-made inventory screen."
- Sin más cambios.

### world/character-screens.md
- **[description]** Reescrita: "The cast list, profile, stats, routine calendar and quest log — ready-made screens about each character, and the settings that decide what they show."
- **[The cast list]** Glosado: "The list is virtualized — only the rows on screen are drawn — so a cast of a thousand opens instantly."

### world/quests.md
- **[description]** Sin cambios (ya era válida).
- **[The map marker]** Frase rota arreglada: "you can say what she looks like where she has been moved to" → "you can choose what she looks like in the room she has been moved to".
- **[Completion]** Paréntesis ambiguo aclarado: el umbral sin `required` se mide contra **todos** los objetivos: "the threshold is measured against all the objectives instead: every one of them at threshold 0, or at least N."
- **[Rewards and penalties / Objectives]** Cosmético: tres *just* eliminados.

### world/screens-and-hud.md
- **[description]** Sin cambios (ya era válida).
- Sin más cambios.

### world/free-roam-rooms.md
- **[description]** Sin cambios (ya era válida).
- **[intro]** Glosado: "A pure kinetic novel — a story with no choices — never touches it."
- **[The room prefab]** ⚠️ Cambio con suposición (ver Dudas): "renaming a GameObject in the prefab renames the object the room's logic is attached to" → "renaming a GameObject in the prefab changes the id the room's logic looks for".

### world/interactables-and-doors.md
- **[description]** Sin cambios (ya era válida).
- **[Hover feedback]** "so the sprite path actually runs" → "so the sprite-based feedback takes over again" (jerga de implementación fuera).
- **[Art and placement]** Cosmético: *just* eliminado.

### world/character-routines.md
- **[description]** Reescrita: "A routine puts each character in the right room at the right time: profiles, first-match rules, the grid editor, and the variables they publish."
- **[Profiles]** Cosmético: *just* eliminado.

### world/talk-menu.md
- **[description]** Reescrita: "The per-character conversation hub: quest entries appear on their own, you add the permanent ones, and each entry decides how it ends."
- **[How an entry ends]** El párrafo del ajuste **Clock** de `GoToRoom` convertido en lista de tres viñetas (vacío = avanza un daypart; «keep the clock» = no se mueve; nombrar un daypart = salta a él). Mismos hechos.

---

## Production

### production/localization.md
- **[description]** Reescrita: "Translate a finished game: the two translation tables, stale-translation tracking, spreadsheet import and export, and switching language in game." (la anterior era completa pero de ~280 caracteres).
- **[Languages, and which one is the source]** "Renaming is a delayed field on the language row" → "Renaming happens on the language row".
- **[Import and export]** Nueva frase de apertura en llano: "The table travels as a spreadsheet file, so a translator never needs Unity." (el texto sobre CSV/TSV y RFC 4180 queda intacto).
- **[Localizing the interface]** "a node stores a key, and the view resolves it" → "a node stores a key, and the game looks up the active language's text when the line is shown".
- **[Bake Localized UI Labels]** "with its key already serialized" → "with its key already filled in".

### production/saving-and-loading.md
- **[description]** Reescrita: "Saves work out of the box. What a slot is, what a save contains, how autosave behaves, and what the player sees when a save is damaged."
- **[Slots]** Tabla, fila Written by: "The autosave queue" → "The game, automatically (see [Autosave](#autosave))" («queue» no se definía en ninguna parte).
- **[Loading, and a damaged save]** Glosado: "Every write is atomic — the new file is fully written or not written at all — and the previous good file is kept beside it as a `.bak` backup."

### production/vn-settings.md
- **[description]** Sin cambios (ya era válida).
- **[Saving]** En `saveManualPages`: "The index grows automatically past this" → "The number of pages grows automatically past this".

### production/ui-prefabs.md
- **[description]** Reescrita: "Every screen the player sees is a Unity UI prefab you can open and edit. The prefab list, two ways to restyle, and the fix for the black-screen boot."
- **[intro]** Glosado: "…is a uGUI prefab (uGUI is Unity's built-in UI system).".
- **[How to restyle]** Opción 1: "through their serialized fields" → "through the references you see in the Inspector". Opción 2: "ordinary MonoBehaviours — plain Unity components — with references you wire in the Inspector".

### production/validation-and-ids.md
- **[description]** Reescrita: "The validator sweeps a project for references that point at nothing, and the id tools fix duplicate ids — the mistakes your players would otherwise find."
- **[Cleaning up after a deletion]** "It is idempotent and cheap…" → "It is cheap, and running it twice does no more than running it once — so it is never a risk."

### production/input-and-controls.md
- **[description]** Reescrita: "Every action a visual novel needs is bound out of the box on both input backends. The defaults, where you change them, and how the player rebinds."
- **[intro]** "on both of Unity's input backends." → "…— the new Input System and the classic Input Manager." (término definido en su primera aparición).
- **[Rebinding by the player]** Glosado: "saved to `PlayerPrefs` (Unity's per-machine settings storage)".

### production/audio-and-music.md
- **[description]** Reescrita: "Two layers of sound: cues fired from story blocks, and a background music queue per app mode. The four channels, the mixer, and per-room overrides."
- **[The four channels]** "drive the mixer's exposed parameters" → "drive the mixer's channel volumes"; "two physical AudioSources" → "two AudioSources — Unity's sound players —".
- **[Background music per app mode]** "one queue per top-level app mode:" → "…— the part of the game the player is in:".

### production/streaming.md
- **[description]** Reescrita: "Load art on demand instead of holding the whole game in memory. Streaming via Addressables is opt-in and beta in 1.0.0: the model, setup, and limits."
- **[The gotcha you must know]** Frase circular arreglada: "**After you rebuild, you must rebuild the Addressables content.**" → "**Every time you build the game, rebuild the Addressables content too.**" (ver Dudas).

### production/building-and-platforms.md
- **[description]** Sin cambios (ya era válida).
- **[Render pipelines]** Nueva apertura en llano: "A render pipeline is the part of Unity that draws the screen. You do not have to care which one your project uses:". Además "The reason is simple:" → "The reason:".
- **[Scripting backends]** Nueva apertura: "Mono and IL2CPP are the two ways Unity turns code into a build. **Both are supported**…".
- **[Platforms]** "Anything with regular file IO" → "Anything where the game can read and write ordinary files".

### production/large-projects.md
- **[description]** Reescrita: "A twenty-hour game is not a two-hour game with more nodes. The parts of the package built for scale, and the habits that keep a long production moving."
- Sin más cambios.

### production/logging.md
- **[description]** Sin cambios (ya era válida).
- **[Everything goes through one facade]** Glosados «facade» ("— one front door for every message —") y «reflection» ("— it looks the console up at runtime instead of referencing it directly —").

---

## Scripting y Reference

### scripting/overview.md
- **[description]** Sin cambios (ya era válida).
- Sin más cambios.

### scripting/vn-api.md
- **[description]** Reescrita: "VN is the static entry point to the running story: flow control, variables and events from any script, with no controller reference needed."
- **[Events]** Antecedente ambiguo resuelto: "…`Effect` and `Portrait`. It may be null." → "The line itself can be null — guard for it." (el «it» podía leerse como referido a `Portrait`).

### scripting/controllers.md
- **[description]** Reescrita: "The three MonoBehaviours you call from code: BeastyManager, VNGameController and VisualNovelController, and what each one owns." (la anterior tenía espacios rotos, restos de backticks de la migración).
- **[Moving between modes]** Frase agramatical arreglada: "switches project keeping the shared store…" → "switches to that project while keeping the shared store, so progress carries over."

### scripting/gameplay-apis.md
- **[description]** Reescrita: "BeastyTime, BeastyRoutines, BeastyQuests and Inventory: the static classes that read and write the world systems from code, in every app state."
- Sin más cambios.

### scripting/custom-mode.md
- **[description]** Reescrita: "VNAppState.Custom hands the screen to your own mode. How to enter it, leave it, and make your minigame save, load and rewind with the rest of the game."
- **[Saving your mode]** Añadida la frase "Both hooks are fields on `VNGameController`:" antes del bloque de `CaptureCustomStateJson`/`RestoreCustomStateJson` (la página no decía dónde viven; su propio ejemplo lo confirma).

### scripting/generated-accessors.md
- **[description]** Reescrita: "VNVars and VNChars are generated C# accessors for your variables and characters. They turn a key typo into a compile error instead of a silent fallback."
- Sin más cambios.

### reference/variable-keys.md
- **[description]** Reescrita: "Every key in the variable store - variables, characters, time, quests, inventory - and how to write a condition against each one."
- Sin más cambios.

### reference/menu-items.md
- **[description]** Sin cambios (ya era válida).
- Sin más cambios.

### reference/assets.md
- **[description]** Reescrita: "Every ScriptableObject Beasty Visual Novel uses, its exact Create menu path, and its main fields. A lookup page, not a tutorial."
- **[Lookup table]** Celda de `LocalizationTable`: "Key by language." → "A grid of keys by language."

### reference/prefabs.md
- **[description]** Sin cambios (ya era válida).
- **[The menu prefabs]** Concordancia: "are what makes the menus follow…" → "make the menus follow…".

---

## Verificación en código — 2026-07-29

Los 14 puntos de duda se resolvieron sin Play Mode: 12 se verificaron leyendo el código fuente del
asset (`E:\Beasty\BeastyVisualNovel`) con agentes de solo lectura; los 2 restantes (11 y 14) son
decisiones de Álvaro y siguen pendientes. Veredicto por punto:

| # | Punto | Veredicto |
|---|---|---|
| 1 | Renombrar GameObjects de sala | Suposición parcialmente errónea. El editor rellena `buttonId` (`FreeRoamInteractable.cs:18-23`), así que renombrar es inocuo en el caso normal; solo rompe el vínculo si `buttonId` está vacío (objeto añadido a mano). **Página corregida.** |
| 2 | Fallback de arte | Dos cadenas separadas. Escenario: expresión pedida → `base` → invisible sin aviso (no hay tercer paso). Retrato: clave → portrait `base` → panel oculto; nunca reutiliza el sprite de escenario en diálogo. **Sección reescrita.** |
| 3 | Import automático del `.vnbeasty` | Sin Undo (prohibido durante asset import; `VnbeastyLink.cs:395`); la red es el `.bak` con timestamp. Conflicto: el tick automático no elige ganador; al guardar el script fuera, gana el script y el graph previo va al `.bak`. **Página corregida.** |
| 4 | `time weekday` con el día actual | «Forward-or-same» (`TimeService.cs:128`): si hoy ya es el día pedido, avanza 0 días. El módulo usa los días del calendario del proyecto, no 7 fijo. **Fila aclarada.** |
| 5 | Create Base Assets | La ruta de menú de la página ya era correcta (`Content > ...`). El conteo no: crea solo lo que falta y en proyecto virgen llega a 7 ficheros (`intro` con graph y nodo Start embebidos, `intro_Context`, `intro_Localization`, `intro_CharacterVariables`, `intro_Music`, `freeroammapscheme`, `VNSettings`). **Paso 2 corregido.** |
| 6 | Menús de validación | `Validate > Find duplicate ids` y `Maintenance > Validate Selected Project` son literales (`BeastyIdAudit.cs:142`, `VNProjectValidator.cs:15`). Sin cambios. |
| 7 | `ChoiseRoot` / `ChoiseBtn` | Los prefabs se llaman así de verdad en `BeastyVN/Prefabs/`. Errata del asset, no de la doc. Sin cambios (renombrarlos sería cambio del asset → changelog + `/sync-docs`). |
| 8 | `OnLineShown` null | La narración nunca llega null (llega con `SpeakerName` vacío). Null solo si el `DialogueView` fue destruido con la sesión viva (`VNSession.cs:276`). **Bullet corregido.** |
| 9 | Hooks FreeRoam | Los cuatro delegados del apartado son campos de `VNGameController` (líneas 59-67 y 86/176). Ojo: dos son FreeRoam (`Capture/RestoreFreeRoamState`) y dos del modo Custom. **Matiz añadido.** |
| 10 | Advance time on click | No está expuesto en el drill-in (cero referencias en `Editor/`); solo se edita en el inspector del asset del Map Graph. La nota de la página es correcta. Sin cambios. |
| 12 | Idiomas curados | Exactamente 15 (`LanguageCatalog.cs:28-45`), los mismos que lista la página. Sin cambios. |
| 13 | Rebuild de Addressables | Siempre manual: no existe ningún hook de build en el paquete. La frase nueva de streaming.md se queda. Sin cambios. |

### Cambios EN aplicados tras la verificación (replicar en ES)

- **world/free-roam-rooms.md** — Fila `FreeRoamInteractable` de la tabla: «Its **id is the
  GameObject's name**…» → «Its id links it to the logic record in the map graph: the **Button Id**
  field if set, otherwise the GameObject's name.» El párrafo «Because ids are names, renaming a
  GameObject…» se sustituyó por uno nuevo: los objetos creados por el editor llevan Button Id
  relleno (renombrar es inocuo; el siguiente sync reescribe el nombre al Display Name); un objeto
  añadido a mano con Button Id vacío se busca por nombre y renombrarlo rompe el clic con solo un
  aviso en consola.
- **authoring/dialogue-and-stage.md** — Sección «The expression and portrait fallback chain»
  reescrita (mismo encabezado): escenario = expresión pedida → `base`, sin tercer paso; dos edges
  nuevos (sin `base` → hueco invisible sin aviso; entrada existente con sprite sin asignar no cae
  a `base`); retratos = clave pedida → portrait `base` → panel oculto, nunca toma el sprite de
  escenario.
- **authoring/text-script.md** — «Automatic imports … are unchanged» → ahora explica que Ctrl+Z no
  puede revertir el import automático (Unity lo prohíbe durante un asset import) y que su red es
  el `.bak`. En «When the two diverge» se añadió la frase puente: el empate dura hasta que un lado
  guarda; guardar el `.vnbeasty` fuera dispara el import, gana el script y el estado previo del
  graph va al `.bak`. En el safety contract, «the most recent save wins» ampliado con esa misma
  mecánica.
- **authoring/vnbeasty-syntax.md** — Fila `time weekday`: «Set the weekday. Always forward; the
  same day counts.» → «Advance to the next matching weekday. If today already matches, the date
  does not move.»
- **getting-started/your-first-scene.md** — «Either way you end up with four assets…» → «…a small
  family of assets. Four of them are the ones to understand:». Tras la tabla, párrafo nuevo: el
  StoryGraph y su primer nodo viven dentro del asset `intro`; el resto de la familia es soporte
  (`intro_Music`, `intro_CharacterVariables`, `freeroammapscheme`, `VNSettings` en `Resources`).
- **scripting/vn-api.md** — Bullet `OnLineShown`: «The line itself can be null — guard for it.» →
  la narración no es null (llega con `SpeakerName` vacío); solo es null si la vista de diálogo fue
  destruida (descarga de escena a mitad de sesión).
- **scripting/custom-mode.md** — «Same pattern, but the engine ships…» → «Same pattern — these are
  fields on `VNGameController` too — but the engine ships…».

### Decisiones resueltas por Álvaro — 2026-07-29

11. **Renombrado.** «## The FreeRoam sprite» → «## The free-roam sprite» en world/characters.md
    (no había ningún enlace entrante al ancla `#the-freeroam-sprite`, verificado con Grep). En la
    prosa, el negrita ahora cita la etiqueta real del inspector: «The **Free Roam Sprite** field
    holds…» (el campo `freeRoamSprite` se dibuja con el inspector por defecto de Unity). Para ES:
    el espejo tiene su propio encabezado traducido; replicar solo la mención **Free Roam Sprite**
    como etiqueta de UI.

14. **`cruce` se queda.** Los nombres propios de los ejemplos (ids de nodos, variables, archivos)
    no se traducen ni se renombran: regla añadida a `docs/GUIA-ESTILO-DOCS.md` (sección «Términos
    y jerga»).
