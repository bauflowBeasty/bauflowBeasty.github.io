# DOC-INDEX — índice de contenido de la documentación

> Generado por `scripts/doc-index.mjs` — **no editar a mano**. Regenerar: `npm run doc:index`.
>
> **Cómo se usa:** ante un cambio de código, buscar el símbolo en el «Índice inverso» de abajo;
> ahí están los identificadores de las páginas que lo documentan.

**Identificadores.** `SS/guides/logging` es `src/content/docs/en/beasty-save-system/guides/logging.md`,
y su espejo español es el mismo archivo bajo `es/`. Siglas: `BC` = beasty-console · `SS` = beasty-save-system · `VN` = beasty-visual-novel.

Cobertura: **85 páginas** EN (y sus 85 espejos ES), **655 símbolos** indexados.

## Páginas

### beasty-console — `BC` (9 páginas)

| Página | Título | Secciones |
|---|---|---|
| `BC/changelog` | Changelog | 1.0.0 — unreleased |
| `BC/faq` | FAQ | Does it replace Unity's Console? · Does it write a log file? · Does it cost performance in a release build? · Do I need the other Beasty packages? · Can I add my own level? · Why is my message missing a piece? · Why did my logs disappear? · The console used to be under the Beasty VN menu. Where is it now? |
| `BC/getting-started` | Getting started | Requirements · Import · Your first log · Open the console · Next |
| `BC/guides/beasty-integration` | Working with the other Beasty packages | Beasty Visual Novel · Beasty Save System · See also |
| `BC/guides/console-window` | The Beasty Console window | The toolbar · The level filters · The list · Opening the file · The splitter · Behaviours worth knowing · See also |
| `BC/guides/logging` | Logging | The call · The levels, and when to use each one · Only three levels raise Unity's severity · The context object · The canPrint flag · Colour without a level · Very long messages · Emoji in the editor, ASCII in a build · See also |
| `BC/guides/release-builds` | Release builds | The master switch · What it does not do · What to do instead · The package never writes a file · See also |
| `BC/index` | Beasty Console | Zero dependencies · What you get · Where to start |
| `BC/reference/api` | API reference | Fields · Methods · LogColor · Levels · Editor window · See also |

### beasty-save-system — `SS` (26 páginas)

| Página | Título | Secciones |
|---|---|---|
| `SS/advanced/custom-converters` | Custom converters | The interface · The contract · A worked example · Overriding a built-in · ConverterUtil · Registration · See also |
| `SS/advanced/platforms-and-limits` | Platforms and limits | Unity version · Scripting backends · Platforms · WebGL · Limits · See also |
| `SS/changelog` | Changelog | 1.0.0 — unreleased |
| `SS/faq` | FAQ | Does it need Newtonsoft, or any other package? · Can I use it with my existing save data? · Does it work with IL2CPP? · Does it work on WebGL? · Is the encryption secure? · Can I save a Dictionary? · Can I save a ScriptableObject reference? A sprite? A prefab? · Can I have different settings for autosave and manual save? · How big can a save be? · Can I read a save file by hand? · Is it thread-safe? · Can I use just the JSON engine? · Does it work without the visual novel package? · Do I have to write code to use it? · What happens if a save file gets damaged? · Does it throw exceptions? · Can I add support for a type it does not know? · See also |
| `SS/getting-started/installation` | Installation | Requirements · Import · What is in the folder · After importing · The converter modules · Platforms · See also |
| `SS/getting-started/save-with-code` | Save with code | The two namespaces · 1. A data class · 2. Settings · 3. Save · 4. Load, and handle failure properly · 5. LoadInto — load onto an object you already have · 6. Exists, Delete, ListSlots · 7. Async · Where to go next |
| `SS/getting-started/save-without-code` | Save without writing code | What you are about to build · 1. Make a scene with something in it · 2. Add the Save Manager · 3. Make the cube saveable · 4. Add a Save button · 5. Wire the Save button · 6. Add a Load button · 7. Try it · 8. Where the file actually is · 9. The two things that will bite you · See also |
| `SS/guides/async-saving` | Async saving and loading | The three methods · What they actually do · When to use them · Awaiting them · Disabling the save button while a save is in flight · Scene saves are synchronous · WebGL · See also |
| `SS/guides/backups-and-corruption` | Backups and corruption | Two defences · Atomic writes: a half-written save cannot exist · Backups: the previous version, kept · Recovery: what to do when a load fails · Corruption you can see coming · Doing it from the editor · See also |
| `SS/guides/encryption` | Encryption | Read this first · Turning it on · What it does · If you leave the key empty · The Encrypted flag must match the file · If you have to switch anyway · See also |
| `SS/guides/logging` | Logging | The toggle · What it looks like · From code · Sending the logs somewhere else · Performance |
| `SS/guides/save-manager-window` | The Save Manager window | Manager · Saveables in Scene · Slots on Disk · See also |
| `SS/guides/scene-state` | Scene state | The two components · Ids · Inactive objects are saved · Several components of the same type · Saving and loading · What actually ends up in the file · Ticking a component you cannot save · See also |
| `SS/guides/settings` | Settings | Settings are per call, not per project · The fields · Slot names · See also |
| `SS/guides/slots-and-metadata` | Slots and metadata | What a slot is · Naming rules · Exists, Delete, ListSlots · Metadata: what a slot list actually needs · Metadata is plain text, even when the save is encrypted · A worked example: slot summaries for a UI · See also |
| `SS/guides/strict-vs-tolerant` | Strict vs tolerant loading | The short version · Strict: all or nothing · Tolerant: skip the bad field, keep the rest · Reading the warnings · When to use tolerant · The caveat you need to know · See also |
| `SS/guides/versioning-and-migrations` | Versioning and migrations | The situation · DataVersion · Registering a migration · Migrations chain · The gotcha: migrations do not survive Play Mode · Migrating a scene save · Practical advice · See also |
| `SS/guides/what-gets-saved` | What gets saved | The short version · What is saved · What is NOT saved · The errors that fail a save · Checklist for a save class · See also |
| `SS/index` | Beasty Save System | What makes it different · Features · Where to start · The one page everybody should read · Guides · Reference · Advanced · When something goes wrong |
| `SS/reference/api-beastysave` | BeastySave API | Namespaces · Slot names · Saving · Loading · Slots · Extension points · Paths · Logging · See also |
| `SS/reference/components` | Components | BeastySaveable · BeastySaveManager · See also |
| `SS/reference/converter-modules` | Converter modules | The modules · Rules that apply to all of them · Core · Animation · Audio · Particles · Physics2D · Physics3D · TMPro · UGUI · When a module is not there · See also |
| `SS/reference/json-engine` | The JSON engine | Why it exists · JsonNode · JsonParser · JsonWriter · JsonMapper · Exceptions · IJsonConverterResolver · A worked example · See also |
| `SS/reference/results-and-errors` | Results and errors | The design principle · SaveResult · LoadResult · LoadResult&lt;T&gt; · The error codes · See also |
| `SS/reference/save-file-format` | Save file format | Where the file lives · The envelope · The group (scene) format · The write pipeline · The load pipeline · Slot utilities · See also |
| `SS/troubleshooting` | Troubleshooting | My save loaded, but the sprite / prefab / component reference is gone · The object I spawned at runtime does not remember anything · One of my objects is silently missing from the save · SaveAll fails with TypeUnavailable · Loading fails with Corrupt · Loading fails with DecryptFailed · Loading fails with VersionTooNew · My load silently does nothing · It worked in the editor and broke in the build · My custom converter stopped working after I pressed Play · Nothing saves on WebGL · Other failures worth naming · See also |

### beasty-visual-novel — `VN` (50 páginas)

| Página | Título | Secciones |
|---|---|---|
| `VN/authoring/blocks-reference` | Blocks reference | The Add blocks panel · How blocks run · Dialogue · Scene · Clear · State · Quests · World · Items · Audio · Input · Flow · See also |
| `VN/authoring/choices-and-decisions` | Choices and decisions | The Choice node · The Decision node · Conditions · Effects · See also |
| `VN/authoring/dialogue-and-stage` | Dialogue and the stage | The Dialogue block · The stage · The expression and portrait fallback chain · See also |
| `VN/authoring/dialogue-preview` | Dialogue preview | Using it · The per-block preview button · Inherited scenery · What it does not do · When you still need to press Play · See also |
| `VN/authoring/story-graph` | The story graph | The canvas · Dialogue Node · Choice Node · Decision Node · Flow (Mode Switch) Node · SubGraph Node · Return Node · Talk Menu Node · See also |
| `VN/authoring/subgraphs` | Subgraphs | Why · Creating a subgraph · Navigating in and out · The Return node · Routing the outcome · A worked example · See also |
| `VN/authoring/text-script` | The text script | What it is · Why you would use it · Turning it on · The Text tab · How the two stay in sync · The safety contract · The limits · A worked example · See also |
| `VN/authoring/transitions` | Transitions: leaving the novel | The four exits · The variable store survives the jump · Exit block or Flow node? · Exits as the target of a choice or a decision · See also |
| `VN/authoring/vnbeasty-syntax` | .vnbeasty syntax reference | Contents · File structure · Dialogue and narration · Backdrops · Props · Characters · Audio · State and inventory · Quests, screens and routines · Game time · Prompts · Character names · Flow and transitions · Choices and decisions · The talk menu · Subgraphs and return · Conditions and effects · Notes · See also |
| `VN/changelog` | Changelog | 1.0.0 — unreleased |
| `VN/faq` | FAQ | Do I need to know how to code? · Which render pipelines are supported? · Which Unity version do I need? · Does it work with the Input System? · Do I need Addressables? · Do I need Newtonsoft, or any other package? · Does it include a save system? · Can my writer work in a text file while I build in the graph? · Can I use my own UI? · Can I use it for a dating sim, a life sim or a detective game? · Is WebGL supported? · Can I localize into any number of languages? · Can the player switch language mid-game? · Can I add my own minigame? · Is the C# source included? · How do I migrate from Ren'Py? · See also |
| `VN/getting-started/core-concepts` | Core concepts | DialogueScene - one story · VNContext - the one shared world · StoryGraph - a canvas of nodes · Node - one beat · Block - one instruction · The variable store - the one that matters · BeastyManager - the one object · How a frame of the game flows · See also |
| `VN/getting-started/editor-tour` | Editor tour | The top bar · The nine tabs · The other windows · See also |
| `VN/getting-started/installation` | Installation | Requirements · Render pipeline: any of them, unchanged · Input: it compiles either way · Required Unity packages · Beasty Save System and Beasty Console are bundled · Platforms · Importing · What is in the package · See also |
| `VN/getting-started/your-first-scene` | Your first scene | 1. Build the scene · 2. Get the assets · 3. Open the editor · 4. Create a character · 5. Write two lines · 6. Add a choice · 7. Press Play · 8. Two things to do before you go further · Where to go next · See also |
| `VN/index` | Beasty Visual Novel | Two views of the same scene · More than a dialogue player · Where to start · Saves are built in · See also |
| `VN/production/audio-and-music` | Audio and music | The four channels · The audio blocks · Background music per app mode · Overrides: a room, or a story · Pausing the background for a scene's own track · See also |
| `VN/production/building-and-platforms` | Building and platforms | Requirements · Render pipelines · Scripting backends · Platforms · Before you build · Aspect ratio and resolution · The loading screen · See also |
| `VN/production/input-and-controls` | Input and controls | The actions and their defaults · Rebinding in the editor · The two input backends · Rebinding by the player · Typing suppresses every shortcut · See also |
| `VN/production/large-projects` | Large projects | What the editor already does for you · Splitting the story across scenes · Reuse with subgraphs · Keeping localization manageable · When to turn on streaming · Run the validator regularly · See also |
| `VN/production/localization` | Localization | The two tables · Languages, and which one is the source · Staleness: knowing which translations went out of date · Working in the grid · Import and export · Localizing the interface · Switching language while the game runs · The authoring language is not the game's language · See also |
| `VN/production/logging` | Logging | Everything goes through one facade · Categories · The master switch · Setting the switches so they stick · Two switches, not one · Logging from your own code · See also |
| `VN/production/saving-and-loading` | Saving and loading | Slots · Autosave · What a save actually holds · Loading, and a damaged save · Where the files are, and what powers this · Saving your own game state · See also |
| `VN/production/streaming` | Streaming (Addressables) | Why you would want it · The model, and why it is safe · Turning it on · What is NOT streamed · Node streaming · The gotcha you must know · See also |
| `VN/production/ui-prefabs` | UI prefabs | The prefabs · How to restyle · The two prefab menu items · The black screen, and the button that fixes it · See also |
| `VN/production/validation-and-ids` | Validation and ids | The validator · Ids · Cleaning up after a deletion · Auto-wire · See also |
| `VN/production/vn-settings` | VN settings | Shared context · Localization · Saving · Rollback · Text scripts (.vnbeasty) · Dialogue and text defaults · Text speed and auto-forward ranges · Stage · Resolution and sprite sizing · Free-roam button feedback · Soft limits · See also |
| `VN/reference/assets` | Assets reference | How many of each · Lookup table · DialogueScene · VNContext · StoryGraph · VNSettings · VNMusicConfig · VNTimeConfig · CharacterDefinition · CharacterVariableSchema · LocalizationTable · FreeRoamMapGraph · QuestCatalog · The seven node types · Inline data: what is NOT an asset · See also |
| `VN/reference/menu-items` | Menu items | Windows · Setup · Content · Codegen · Maintenance · Validate · Settings · Streaming · Export · Assets right-click · Add Component · The one button to remember · See also |
| `VN/reference/prefabs` | Prefabs | Lookup table · The scene prefabs · The dialogue and choice prefabs · The menu prefabs · The gameplay screens · The mixer · See also |
| `VN/reference/variable-keys` | Variable keys | One store for everything · How you write a condition · Your own variables · Character variables · Routine keys · Time keys · Quest keys · Inventory keys · Dictionary keys · See also |
| `VN/scripting/controllers` | Controllers | Which one do I call · BeastyManager · VNGameController · VisualNovelController · See also |
| `VN/scripting/custom-mode` | Custom mode | Entering and leaving · Saving your mode · The FreeRoam hooks · The save hooks · Persisting your own MonoBehaviour · Worked example: a scored minigame that returns to the room · See also |
| `VN/scripting/gameplay-apis` | Gameplay APIs | BeastyTime · BeastyRoutines · BeastyQuests · Inventory · See also |
| `VN/scripting/generated-accessors` | Generated accessors: VNVars and VNChars | The problem they solve · What they look like · Regenerating · Using them alongside the string API · ItemIds · See also |
| `VN/scripting/overview` | Scripting overview | Assemblies · The runtime objects · The four app states · I want to X -> use Y · See also |
| `VN/scripting/vn-api` | The VN static API | VN and VNSession · State · Events · Control · Variables · Character variables · Tokens and names · Background music · Example: drive a voice-over system from OnLineShown · Example: log choices to analytics · Example: read and write a variable from a gameplay script · Example: drive a HUD from OnVariableChanged · See also |
| `VN/troubleshooting` | Troubleshooting | The game boots to a black screen. The engine is running. There are zero errors in the console. · My time conditions are all false · My character never appears in a room · A block does nothing · Saving the text script deleted a block · My script will not import · The graph and the text disagree · A choice never shows up · My variable condition never fires · The streamed art is missing · Two assets behave as one · A translation looks out of date · Nothing here matches · See also |
| `VN/world/character-routines` | Character routines | Where a routine lives · Profiles: swapping a whole schedule in one block · Rules: first match wins · The routine grid editor · Rooms are not the only way to be somewhere · What the character looks like in the room · When routines recompute · Clicking a character in a room · Quest routine overrides · The in-game routine calendar · Worked example: a baker · See also |
| `VN/world/character-screens` | Character screens | Adding them · The cast list · The profile · The stats screen · The routine calendar · The quest log · How the player gets there · See also |
| `VN/world/characters` | Characters | Creating a character · Identity · Expressions and portraits · Delivery styles · Aliases: showing a different name · Character variables (stats) · The FreeRoam sprite · Appearing in the cast list · The talk menu · See also |
| `VN/world/dictionary` | The dictionary | What it is, and what it is not · Creating an entry · Using it in a line · Setting it · Dictionary token or String variable? · See also |
| `VN/world/free-roam-rooms` | Free-roam rooms | The map graph · What a room is · Creating a room and its prefab together · Conditional backgrounds · The room prefab · Entering a room from the story, and leaving again · Music per room · See also |
| `VN/world/game-time` | Game time | The design decision, stated up front · Turning time on · The two modes · Every field of the Time Config · Advancing time · The reserved time variables · Common mistakes · See also |
| `VN/world/interactables-and-doors` | Interactables and doors | Kind and function · Art and placement · Hover feedback · Visibility · Doors · Conditional VN: the same object, a different scene · Character poses · Advance time on click · Tight click shapes · See also |
| `VN/world/items-and-inventory` | Items and inventory | Defining an item · The blocks · An item's count is just a variable · The inventory screen · See also |
| `VN/world/quests` | Quests | A quest · Stages, and what "ordered" means · Objectives · Completion · Recurring quests · Worked example: five apples for Ana, every day · See also |
| `VN/world/screens-and-hud` | Screens and HUD | Two kinds of screen · Where a screen shows up · Items · Actions · The secondary stack · Opening a screen from the story · Preview · See also |
| `VN/world/talk-menu` | The talk menu | The key idea · Where you author it · Handing items over from a conversation · How the player reaches the menu · The order of the list · A pattern worth copying · See also |
| `VN/world/variables-and-conditions` | Variables and conditions | Creating a variable · Changing a variable · The store · Conditions · Effects · Shared conditions and @self · For programmers · See also |

## Índice inverso: símbolo → páginas que lo documentan

| Símbolo | Páginas |
|---|---|
| `Activator.CreateInstance` | SS/advanced/platforms-and-limits |
| `Active.CurrentChoiceSprite` | VN/scripting/vn-api |
| `Active.CurrentNode` | VN/scripting/vn-api |
| `Active.Director` | VN/scripting/vn-api |
| `Active.OnTalkEntryChosen` | VN/scripting/vn-api |
| `Active.State` | VN/scripting/vn-api |
| `Active.Stop` | VN/scripting/vn-api |
| `Add` | SS/reference/json-engine SS/reference/results-and-errors VN/authoring/blocks-reference VN/authoring/choices-and-decisions |
| `Advanced` | VN/reference/assets |
| `AdvanceDayparts` | VN/authoring/blocks-reference VN/world/game-time |
| `AdvanceDays` | VN/authoring/blocks-reference VN/world/game-time |
| `AdvanceHours` | VN/authoring/blocks-reference VN/world/game-time |
| `AdvanceTime` | VN/world/screens-and-hud |
| `Afternoon` | VN/world/character-routines |
| `Ambient` | VN/authoring/blocks-reference |
| `Ambush` | VN/authoring/subgraphs |
| `Ana_Delivery` | VN/world/quests |
| `And` | VN/authoring/choices-and-decisions VN/reference/variable-keys |
| `Animator` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `Application.persistentDataPath` | SS/advanced/platforms-and-limits SS/getting-started/installation SS/guides/settings |
| `ApplyGroupNode` | SS/reference/components |
| `ArgumentException` | SS/changelog SS/reference/api-beastysave SS/reference/components |
| `ArgumentNullException` | SS/reference/api-beastysave SS/reference/components |
| `Ask` | VN/authoring/dialogue-preview |
| `Assets` | SS/getting-started/installation |
| `Assign` | VN/authoring/blocks-reference VN/authoring/choices-and-decisions |
| `Audio` | VN/production/vn-settings VN/scripting/overview |
| `AudioClip` | SS/getting-started/save-without-code SS/guides/what-gets-saved |
| `AudioSource` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `AudioSource.clip` | SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `Auto` | SS/changelog SS/guides/logging SS/reference/components |
| `Autosaves` | SS/guides/settings |
| `AUX` | SS/guides/settings SS/guides/slots-and-metadata SS/reference/api-beastysave SS/reference/results-and-errors |
| `Awake` | SS/advanced/custom-converters SS/guides/versioning-and-migrations SS/troubleshooting VN/scripting/controllers |
| `Back` | VN/authoring/dialogue-preview VN/production/saving-and-loading VN/production/streaming VN/production/vn-settings VN/scripting/custom-mode VN/world/screens-and-hud |
| `Background` | VN/world/free-roam-rooms |
| `Backlog` | VN/scripting/vn-api |
| `BackToMenu` | VN/world/talk-menu |
| `Backup` | SS/guides/backups-and-corruption SS/guides/settings |
| `BackupAvailable` | SS/faq SS/getting-started/save-with-code SS/guides/backups-and-corruption SS/reference/results-and-errors SS/troubleshooting |
| `Bakery` | VN/world/character-routines |
| `Beasty_SaveSystem` | SS/reference/components |
| `Beasty_SaveSystem.BeastySave` | SS/advanced/custom-converters |
| `Beasty_SaveSystemCore.BeastySaveError` | SS/reference/results-and-errors |
| `Beasty_SaveSystemCore.ConverterUtil` | SS/advanced/custom-converters |
| `Beasty_SaveSystemCore.IBeastyConverter` | SS/advanced/custom-converters |
| `Beasty_SaveSystemCore.Json` | SS/reference/json-engine |
| `Beasty.Console` | BC/changelog BC/index BC/reference/api VN/changelog |
| `Beasty.Console.Editor` | BC/changelog BC/index BC/reference/api |
| `Beasty.DebugLogger` | BC/changelog |
| `Beasty.DebugLogger.Editor` | BC/changelog |
| `Beasty.SaveGroup` | SS/guides/scene-state |
| `Beasty.VN.Addressables` | VN/scripting/overview |
| `Beasty.VN.Core` | VN/production/logging VN/scripting/overview |
| `Beasty.VN.Editor` | VN/scripting/overview |
| `Beasty.VN.Runtime` | VN/scripting/controllers VN/scripting/gameplay-apis VN/scripting/generated-accessors VN/scripting/overview VN/scripting/vn-api |
| `Beasty.VN.Runtime.InputSystem` | VN/scripting/overview |
| `Beasty.VN.Runtime.VN` | VN/scripting/controllers |
| `BeastyAspectRatioEnforcer` | VN/reference/prefabs |
| `BeastyConsole` | BC/changelog BC/guides/beasty-integration VN/production/logging |
| `BeastyConsole.IsEnabled` | VN/production/logging |
| `BeastyConsoleLogger` | BC/changelog |
| `BeastyConsoleLogger.BeastyConsole` | BC/reference/api |
| `BeastyDebugLogger` | BC/changelog |
| `BeastyDebugLoggerConsole` | BC/changelog |
| `BeastyLoadingScreen` | VN/reference/prefabs |
| `BeastyManager` | VN/changelog VN/index VN/production/localization VN/reference/prefabs VN/scripting/controllers VN/scripting/gameplay-apis VN/scripting/overview |
| `BeastyManager.Instance` | VN/scripting/controllers VN/scripting/overview |
| `BeastyManager.Instance.Game` | VN/scripting/overview |
| `BeastyManager.Instance.VN` | VN/scripting/controllers VN/scripting/overview |
| `BeastyManager.RegisterBootBarrier` | VN/scripting/controllers VN/scripting/overview |
| `BeastyManager.VN` | VN/scripting/controllers |
| `BeastyQuests` | VN/index VN/scripting/gameplay-apis VN/scripting/overview VN/scripting/vn-api VN/world/quests |
| `BeastyRoutines` | VN/index VN/scripting/gameplay-apis VN/scripting/overview VN/scripting/vn-api VN/world/character-routines |
| `BeastySave` | SS/faq SS/getting-started/save-with-code SS/guides/logging SS/guides/settings SS/index SS/reference/api-beastysave |
| `BeastySave.Exists` | SS/reference/results-and-errors |
| `BeastySave.ReadMeta` | SS/getting-started/save-with-code SS/reference/components SS/reference/save-file-format |
| `BeastySave.RegisterConverter` | SS/faq SS/troubleshooting |
| `BeastySave.RegisterMigration` | SS/faq SS/reference/results-and-errors SS/troubleshooting |
| `BeastySave.RegisterModule` | SS/faq SS/troubleshooting |
| `BeastySave.RestoreBackup` | SS/faq SS/guides/logging SS/guides/settings SS/reference/results-and-errors |
| `BeastySave.Save` | SS/faq SS/getting-started/save-with-code SS/guides/settings SS/guides/versioning-and-migrations SS/guides/what-gets-saved SS/index |
| `BeastySave.SaveAsync` | SS/guides/async-saving |
| `BeastySaveable` | SS/advanced/custom-converters SS/advanced/platforms-and-limits SS/changelog SS/faq SS/getting-started/installation SS/getting-started/save-without-code SS/guides/save-manager-window SS/guides/scene-state SS/guides/what-gets-saved SS/index SS/reference/components SS/reference/converter-modules SS/troubleshooting VN/changelog VN/faq VN/production/saving-and-loading VN/scripting/controllers VN/scripting/custom-mode VN/scripting/overview |
| `BeastySaveable.Id` | SS/reference/save-file-format |
| `BeastySaveError` | SS/faq SS/getting-started/save-with-code SS/reference/results-and-errors |
| `BeastySaveError.VersionTooNew` | SS/troubleshooting |
| `BeastySaveLog` | SS/changelog SS/guides/logging SS/reference/api-beastysave |
| `BeastySaveLog.EnableLogs` | SS/guides/logging |
| `BeastySaveLogLevel.Verbose` | SS/reference/api-beastysave |
| `BeastySaveLogMode` | SS/reference/components |
| `BeastySaveManager` | SS/changelog SS/faq SS/getting-started/installation SS/guides/encryption SS/guides/logging SS/guides/save-manager-window SS/guides/scene-state SS/guides/settings SS/index SS/reference/api-beastysave SS/reference/components |
| `BeastySaveManager.ApplyGroupNode` | SS/reference/results-and-errors |
| `BeastySaveManager.CaptureGroupNode` | SS/reference/results-and-errors |
| `BeastySaveManager.LastLoadResult` | SS/troubleshooting |
| `BeastySaveManager.LoadAllNow` | SS/reference/results-and-errors |
| `BeastySaveManager.LoadCompleted` | SS/reference/converter-modules |
| `BeastySaveManager.SaveAll` | SS/guides/async-saving SS/guides/what-gets-saved SS/reference/save-file-format |
| `BeastySaveManager.SaveAllNow` | SS/reference/results-and-errors |
| `BeastySaveSettings` | SS/faq SS/getting-started/save-with-code SS/guides/scene-state SS/guides/settings SS/index SS/reference/api-beastysave SS/reference/components SS/troubleshooting |
| `BeastySaveSettings.DataPath` | SS/advanced/platforms-and-limits |
| `BeastySaveSettings.DataVersion` | SS/guides/versioning-and-migrations SS/reference/api-beastysave SS/reference/results-and-errors SS/reference/save-file-format |
| `BeastySaveSettings.Encrypted` | SS/reference/results-and-errors |
| `BeastySaveSettings.SharedDefaultEncryptionKey` | SS/changelog SS/guides/settings |
| `BeastySaveSettings.Strict` | SS/reference/api-beastysave |
| `BeastySaveSystem.asmdef` | SS/getting-started/installation |
| `BeastyTime` | VN/index VN/scripting/gameplay-apis VN/scripting/overview VN/scripting/vn-api VN/world/game-time |
| `BeastyVNMixer` | VN/production/audio-and-music VN/production/ui-prefabs VN/reference/prefabs |
| `BeforeSceneLoad` | SS/advanced/custom-converters |
| `Bench` | VN/world/character-routines |
| `Body` | VN/scripting/vn-api |
| `Bool` | VN/reference/assets VN/reference/variable-keys VN/world/characters VN/world/variables-and-conditions |
| `Both` | VN/world/screens-and-hud |
| `Bounds` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules |
| `BoxCollider` | SS/getting-started/installation SS/guides/scene-state SS/reference/converter-modules |
| `BoxCollider2D` | SS/getting-started/installation SS/reference/converter-modules |
| `Button` | VN/world/screens-and-hud |
| `BytesWritten` | SS/reference/results-and-errors |
| `Camera` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `CanConvert` | SS/advanced/custom-converters |
| `CanUse` | VN/scripting/gameplay-apis |
| `CanvasGroup` | SS/getting-started/installation SS/reference/converter-modules |
| `CapsuleCollider` | SS/getting-started/installation SS/reference/converter-modules |
| `CapsuleCollider2D` | SS/getting-started/installation SS/reference/converter-modules |
| `CaptureCurrent` | VN/scripting/custom-mode |
| `CaptureCustomStateJson` | VN/scripting/custom-mode VN/scripting/overview |
| `CaptureGroupNode` | SS/reference/components SS/reference/results-and-errors |
| `Caution` | BC/guides/logging |
| `Center` | VN/authoring/blocks-reference VN/authoring/dialogue-and-stage |
| `CenterLeft` | VN/authoring/blocks-reference VN/authoring/dialogue-and-stage |
| `CenterRight` | VN/authoring/blocks-reference VN/authoring/dialogue-and-stage |
| `CharacterDefinition` | VN/reference/assets |
| `CharacterListRow` | VN/reference/prefabs |
| `CharacterListScreen` | VN/reference/prefabs |
| `CharacterProfile` | VN/production/ui-prefabs VN/reference/prefabs |
| `CharacterProfileScreen` | VN/reference/prefabs |
| `CharacterQuestRow` | VN/reference/prefabs |
| `CharacterQuestsScreen` | VN/reference/prefabs |
| `CharacterRoutine` | VN/production/ui-prefabs VN/reference/assets |
| `CharacterRoutineScreen` | VN/reference/prefabs |
| `Characters` | VN/world/quests |
| `CharactersMenu` | VN/production/ui-prefabs VN/reference/prefabs |
| `CharacterStatRow` | VN/reference/prefabs |
| `CharacterStats` | VN/production/ui-prefabs VN/reference/prefabs |
| `CharacterStatsScreen` | VN/reference/prefabs |
| `CharacterVariableField` | VN/reference/assets |
| `CharacterVariableSchema` | VN/reference/assets VN/reference/variable-keys |
| `ChoiceNode` | VN/authoring/vnbeasty-syntax |
| `ChoiceOption` | VN/scripting/vn-api |
| `ChoiceView` | VN/reference/prefabs |
| `ChoiseBtn` | VN/production/ui-prefabs VN/reference/prefabs |
| `ChoiseRoot` | VN/production/ui-prefabs VN/reference/prefabs |
| `CircleCollider2D` | SS/getting-started/installation SS/reference/converter-modules |
| `Clock` | VN/reference/assets VN/world/game-time |
| `Close` | VN/world/screens-and-hud |
| `Color` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules |
| `COM1` | SS/changelog SS/guides/settings SS/guides/slots-and-metadata SS/reference/api-beastysave SS/reference/results-and-errors |
| `COM9` | SS/guides/settings SS/guides/slots-and-metadata SS/reference/api-beastysave SS/reference/results-and-errors |
| `Computed` | VN/reference/assets |
| `CON` | SS/changelog SS/getting-started/save-without-code SS/guides/settings SS/guides/slots-and-metadata SS/reference/api-beastysave SS/reference/results-and-errors |
| `CON.save` | SS/guides/settings |
| `Consumable` | VN/reference/assets VN/reference/variable-keys VN/world/items-and-inventory |
| `Contains` | VN/reference/variable-keys VN/world/variables-and-conditions |
| `ContinueIndicatorBlink` | VN/reference/prefabs |
| `ConverterResolver` | SS/reference/json-engine |
| `Core` | VN/faq VN/index VN/scripting/overview |
| `Corrupt` | SS/faq SS/guides/backups-and-corruption SS/guides/encryption SS/guides/save-manager-window SS/reference/api-beastysave SS/reference/components SS/reference/results-and-errors SS/reference/save-file-format SS/troubleshooting |
| `Count` | VN/scripting/gameplay-apis |
| `Counter` | VN/world/character-routines |
| `Create` | VN/authoring/story-graph VN/getting-started/editor-tour VN/reference/assets |
| `CreditsScreen` | VN/reference/prefabs |
| `Custom` | VN/authoring/blocks-reference VN/authoring/dialogue-and-stage VN/faq VN/scripting/custom-mode VN/scripting/overview VN/world/screens-and-hud |
| `Daily` | VN/world/quests |
| `Data` | VN/production/logging |
| `DataPath` | SS/guides/encryption SS/guides/settings SS/guides/slots-and-metadata |
| `DataVersion` | SS/guides/encryption SS/guides/settings SS/guides/versioning-and-migrations SS/troubleshooting |
| `DateTime` | SS/getting-started/save-with-code SS/guides/what-gets-saved SS/reference/json-engine |
| `Day` | VN/scripting/gameplay-apis |
| `Daypart` | VN/scripting/gameplay-apis |
| `DaySchedule` | VN/scripting/gameplay-apis |
| `Debug` | BC/guides/logging |
| `Debug.Log` | BC/getting-started BC/guides/console-window BC/guides/logging BC/index |
| `DebugLogger` | SS/changelog |
| `DecisionNode` | VN/authoring/vnbeasty-syntax |
| `Decoration` | VN/world/screens-and-hud |
| `DecryptFailed` | SS/guides/backups-and-corruption SS/guides/encryption SS/reference/api-beastysave SS/reference/results-and-errors SS/reference/save-file-format |
| `Default` | BC/guides/logging VN/world/character-routines |
| `DefaultLevel` | SS/reference/api-beastysave |
| `Delete` | SS/getting-started/save-with-code SS/guides/backups-and-corruption SS/guides/save-manager-window SS/guides/slots-and-metadata SS/reference/save-file-format |
| `Deliver` | VN/scripting/gameplay-apis |
| `DialogPanel` | VN/production/ui-prefabs VN/reference/prefabs |
| `DialogueBacklog.Entry` | VN/scripting/vn-api |
| `DialogueBlock` | VN/world/quests VN/world/talk-menu |
| `DialogueLine` | VN/scripting/vn-api |
| `DialogueNode` | VN/authoring/vnbeasty-syntax |
| `DialogueScene` | VN/authoring/dialogue-preview VN/authoring/story-graph VN/authoring/text-script VN/production/audio-and-music VN/production/building-and-platforms VN/production/large-projects VN/production/validation-and-ids VN/reference/assets VN/scripting/overview |
| `DialogueTextEffect` | VN/reference/prefabs |
| `DialogueView` | VN/reference/prefabs |
| `Dictionary` | SS/faq SS/getting-started/save-with-code SS/guides/strict-vs-tolerant SS/guides/what-gets-saved |
| `DictionaryEntry` | VN/reference/assets |
| `Director` | VN/production/logging |
| `Editor` | VN/faq |
| `Effect` | VN/scripting/vn-api |
| `Enabled` | VN/scripting/gameplay-apis |
| `EncodeToPNG` | SS/reference/converter-modules |
| `Encrypted` | SS/guides/encryption SS/guides/settings SS/troubleshooting |
| `EncryptionKey` | SS/guides/encryption SS/guides/settings SS/reference/results-and-errors SS/troubleshooting |
| `Enqueue` | SS/reference/json-engine SS/reference/results-and-errors |
| `EnterCustom` | VN/faq VN/scripting/controllers VN/scripting/custom-mode |
| `EnterVN` | VN/world/screens-and-hud |
| `Enum` | VN/reference/assets VN/reference/variable-keys VN/world/dictionary |
| `Equals` | VN/reference/variable-keys VN/world/variables-and-conditions |
| `Error` | SS/index SS/reference/results-and-errors |
| `Evening` | VN/world/character-routines |
| `Exception` | BC/guides/logging |
| `Exists` | SS/reference/save-file-format |
| `Export` | VN/production/localization VN/troubleshooting |
| `Extension` | SS/faq SS/getting-started/save-without-code SS/guides/encryption SS/guides/save-manager-window SS/guides/settings SS/guides/slots-and-metadata |
| `Fade` | VN/authoring/dialogue-and-stage VN/world/characters |
| `Failed` | VN/scripting/controllers |
| `FailedBackupAvailable` | VN/scripting/controllers |
| `FieldMapFailed` | SS/advanced/custom-converters SS/changelog SS/guides/backups-and-corruption SS/guides/strict-vs-tolerant SS/reference/api-beastysave SS/reference/components SS/reference/converter-modules SS/reference/results-and-errors SS/reference/save-file-format SS/troubleshooting |
| `FieldSkipReporter` | SS/reference/json-engine |
| `File.Replace` | SS/advanced/platforms-and-limits SS/getting-started/installation SS/reference/save-file-format VN/production/building-and-platforms |
| `FileNotFound` | SS/guides/backups-and-corruption SS/reference/api-beastysave SS/reference/results-and-errors SS/reference/save-file-format SS/troubleshooting |
| `Fired` | VN/world/character-routines |
| `Fixed` | VN/reference/assets |
| `FlexibleGridLayout` | VN/reference/prefabs |
| `Float` | VN/reference/assets VN/reference/variable-keys VN/world/characters VN/world/variables-and-conditions |
| `FlowNode` | VN/authoring/vnbeasty-syntax |
| `Folder` | SS/faq SS/getting-started/save-without-code SS/guides/encryption SS/guides/save-manager-window SS/guides/settings SS/guides/slots-and-metadata |
| `Font` | VN/scripting/vn-api |
| `FontSizeMultiplier` | VN/scripting/vn-api |
| `Forward` | VN/authoring/dialogue-preview |
| `Free` | VN/world/quests |
| `FreeRoam` | VN/scripting/overview VN/world/screens-and-hud |
| `FreeRoamCharacterSpot` | VN/world/character-routines VN/world/free-roam-rooms |
| `FreeRoamController` | VN/reference/prefabs |
| `FreeRoamInteractable` | VN/world/free-roam-rooms |
| `FreeRoamMapGraph` | VN/reference/assets VN/reference/prefabs VN/scripting/overview |
| `FreeRoamRoom` | VN/production/audio-and-music VN/world/free-roam-rooms |
| `FreeRoamScenario` | VN/reference/assets VN/reference/prefabs |
| `FreeRoamScreenController` | VN/reference/prefabs |
| `FreeRoamScreenElement` | VN/reference/prefabs |
| `Furnace` | SS/advanced/custom-converters |
| `Game` | VN/scripting/overview |
| `GameMenuScreen` | VN/production/ui-prefabs VN/reference/prefabs |
| `GameObject` | BC/changelog SS/getting-started/save-without-code SS/guides/what-gets-saved SS/reference/results-and-errors SS/troubleshooting VN/production/logging |
| `GameState` | SS/guides/strict-vs-tolerant |
| `GatherDeliver` | VN/scripting/gameplay-apis VN/world/quests |
| `GetBool` | VN/scripting/overview |
| `GetCharacterAliases` | VN/scripting/vn-api |
| `GetFloat` | VN/scripting/overview |
| `GetInstanceID` | SS/troubleshooting |
| `GetSerializableFields` | SS/reference/json-engine |
| `GetString` | VN/scripting/overview |
| `Give` | VN/scripting/gameplay-apis |
| `Goodbye` | VN/world/talk-menu |
| `GoToMainMenu` | VN/scripting/custom-mode |
| `GoToRoom` | VN/world/talk-menu |
| `Graph` | VN/authoring/text-script |
| `Greater` | VN/reference/variable-keys VN/world/variables-and-conditions |
| `GreaterOrEqual` | VN/reference/variable-keys VN/world/variables-and-conditions |
| `GridItemScreenElement` | VN/reference/prefabs |
| `GridMenu` | VN/production/ui-prefabs VN/reference/prefabs |
| `Guid.NewGuid` | SS/guides/scene-state |
| `HashSet` | SS/faq SS/getting-started/save-with-code |
| `HelpScreen` | VN/reference/prefabs |
| `Highlight` | BC/guides/logging |
| `HistoryScreen` | VN/reference/prefabs |
| `Hour` | VN/scripting/gameplay-apis |
| `IBeastyConverter` | SS/faq VN/scripting/overview |
| `IEnumerable` | SS/reference/json-engine SS/reference/results-and-errors |
| `Image` | SS/getting-started/installation SS/reference/converter-modules |
| `Image.sprite` | SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `Index` | VN/scripting/vn-api |
| `Infinity` | SS/advanced/platforms-and-limits SS/guides/what-gets-saved SS/reference/api-beastysave SS/reference/json-engine SS/reference/results-and-errors SS/troubleshooting |
| `Info` | BC/guides/logging SS/guides/logging SS/reference/api-beastysave |
| `InputConfig` | VN/scripting/controllers |
| `Instance` | SS/guides/scene-state SS/reference/components |
| `Instantiate` | SS/getting-started/save-without-code SS/guides/scene-state SS/reference/components SS/troubleshooting |
| `Int` | VN/reference/assets VN/reference/variable-keys VN/world/characters VN/world/variables-and-conditions |
| `Interaction` | VN/world/interactables-and-doors |
| `InvalidArgument` | SS/changelog SS/guides/settings SS/guides/slots-and-metadata SS/reference/api-beastysave SS/reference/results-and-errors SS/reference/save-file-format SS/troubleshooting |
| `Inventory` | VN/index VN/production/ui-prefabs VN/reference/prefabs VN/scripting/gameplay-apis VN/scripting/overview VN/scripting/vn-api VN/world/items-and-inventory |
| `InventoryDetailPopup` | VN/reference/prefabs |
| `InventoryEntry` | SS/guides/strict-vs-tolerant |
| `InventoryScreen` | VN/reference/prefabs |
| `InventorySlot` | VN/reference/prefabs |
| `IoError` | SS/guides/async-saving SS/guides/backups-and-corruption SS/guides/settings SS/reference/api-beastysave SS/reference/results-and-errors SS/reference/save-file-format SS/troubleshooting |
| `IsEnabled` | BC/changelog BC/faq BC/guides/beasty-integration BC/guides/logging BC/guides/release-builds BC/index |
| `IsReady` | VN/scripting/controllers |
| `ItemHandle` | VN/scripting/gameplay-apis |
| `ItemIds` | VN/scripting/gameplay-apis VN/scripting/generated-accessors |
| `ItemScreenElement` | VN/reference/prefabs |
| `JsonException` | SS/advanced/custom-converters SS/reference/json-engine |
| `JsonMapper` | SS/advanced/custom-converters SS/faq SS/index |
| `JsonNode` | SS/advanced/custom-converters SS/faq SS/guides/versioning-and-migrations SS/index SS/reference/api-beastysave SS/reference/components SS/reference/json-engine SS/reference/save-file-format |
| `JsonParseException` | SS/reference/json-engine |
| `JsonParser` | SS/advanced/custom-converters SS/faq SS/index |
| `JsonParser.DefaultMaxDepth` | SS/advanced/platforms-and-limits |
| `JsonUtility` | SS/index |
| `JsonUtility.ToJson` | VN/scripting/custom-mode |
| `JsonWriter` | SS/advanced/custom-converters SS/faq SS/index |
| `Juan` | VN/getting-started/your-first-scene |
| `JumpTo` | VN/scripting/vn-api |
| `Key` | VN/reference/assets VN/reference/variable-keys VN/world/items-and-inventory |
| `Kind` | SS/guides/versioning-and-migrations |
| `LastLoadResult` | SS/reference/components |
| `LastSaveResult` | SS/reference/components |
| `Left` | VN/authoring/blocks-reference VN/authoring/dialogue-and-stage |
| `Less` | VN/reference/variable-keys VN/world/variables-and-conditions |
| `LessOrEqual` | VN/reference/variable-keys VN/world/variables-and-conditions |
| `Level` | SS/reference/api-beastysave |
| `Light` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `Light.cookie` | SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `Light.lightmapBakeType` | SS/troubleshooting |
| `List` | SS/faq SS/getting-started/save-with-code SS/guides/strict-vs-tolerant SS/guides/what-gets-saved |
| `ListSlots` | SS/faq SS/getting-started/save-with-code SS/guides/settings SS/guides/slots-and-metadata SS/reference/save-file-format |
| `Load` | SS/changelog SS/getting-started/save-with-code SS/getting-started/save-without-code SS/guides/backups-and-corruption SS/guides/encryption SS/guides/save-manager-window VN/scripting/vn-api |
| `LoadAll` | SS/faq SS/guides/async-saving SS/guides/encryption SS/guides/save-manager-window SS/guides/scene-state SS/guides/settings SS/guides/strict-vs-tolerant SS/reference/components SS/reference/results-and-errors SS/troubleshooting |
| `LoadAllNow` | SS/guides/async-saving SS/guides/backups-and-corruption SS/guides/scene-state |
| `LoadAsync` | SS/advanced/platforms-and-limits |
| `LoadCompleted` | SS/guides/scene-state SS/reference/components SS/troubleshooting |
| `Loaded` | VN/scripting/controllers |
| `Loading` | VN/scripting/controllers |
| `LoadInto` | SS/getting-started/save-with-code SS/guides/backups-and-corruption SS/reference/converter-modules SS/reference/results-and-errors |
| `LoadIntoAsync` | SS/advanced/platforms-and-limits SS/reference/results-and-errors |
| `LoadOverrides` | VN/production/input-and-controls |
| `LoadResult` | SS/faq SS/getting-started/save-with-code SS/guides/backups-and-corruption SS/reference/results-and-errors SS/troubleshooting |
| `LoadResult.BackupAvailable` | SS/guides/scene-state SS/reference/save-file-format |
| `LoadResult.Error` | SS/guides/strict-vs-tolerant |
| `LoadResult.MigratedFrom` | SS/changelog SS/guides/versioning-and-migrations |
| `LoadResult.Warnings` | SS/advanced/custom-converters SS/guides/settings SS/guides/strict-vs-tolerant SS/reference/api-beastysave SS/reference/converter-modules |
| `LoadSlotDetailed` | VN/scripting/controllers VN/scripting/overview |
| `LocalizationTable` | VN/production/localization VN/reference/assets |
| `LocationOf` | VN/scripting/gameplay-apis |
| `Log` | BC/faq BC/guides/logging BC/reference/api |
| `LogCaution` | BC/changelog BC/guides/beasty-integration BC/guides/console-window BC/guides/logging BC/reference/api |
| `LogColor` | BC/faq BC/guides/logging |
| `LogDebug` | BC/guides/logging BC/reference/api |
| `LogError` | BC/guides/logging BC/reference/api |
| `LogException` | BC/guides/logging BC/reference/api |
| `LogHighlight` | BC/guides/logging BC/reference/api |
| `LogInfo` | BC/guides/logging BC/reference/api |
| `LogNotice` | BC/guides/logging BC/reference/api |
| `LogSuccess` | BC/guides/logging BC/reference/api |
| `LogTrace` | BC/guides/logging BC/reference/api |
| `LogVerbose` | BC/guides/logging BC/reference/api |
| `LogWarning` | BC/guides/logging BC/reference/api |
| `LPT1` | SS/guides/settings SS/guides/slots-and-metadata SS/reference/api-beastysave SS/reference/results-and-errors |
| `LPT9` | SS/guides/settings SS/guides/slots-and-metadata SS/reference/api-beastysave SS/reference/results-and-errors |
| `Main` | VN/reference/assets VN/world/characters VN/world/quests |
| `MainCamera` | VN/scripting/controllers |
| `MainCanvas` | VN/scripting/controllers |
| `MainMenu` | VN/scripting/overview |
| `MainMenuScreen` | VN/production/ui-prefabs VN/reference/prefabs |
| `Material` | SS/guides/what-gets-saved SS/troubleshooting |
| `Max` | VN/scripting/gameplay-apis |
| `Menus` | VN/scripting/overview |
| `MeshCollider` | SS/getting-started/installation SS/reference/converter-modules |
| `MeshCollider.sharedMesh` | SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `Message` | SS/reference/results-and-errors |
| `MigratedFrom` | SS/reference/results-and-errors |
| `MigrationFailed` | SS/guides/versioning-and-migrations SS/reference/api-beastysave SS/reference/results-and-errors SS/reference/save-file-format SS/troubleshooting |
| `Missing` | VN/production/localization |
| `Money` | VN/world/screens-and-hud |
| `MonoBehaviour` | SS/getting-started/installation SS/getting-started/save-with-code SS/guides/what-gets-saved SS/reference/api-beastysave SS/reference/converter-modules SS/reference/json-engine SS/reference/results-and-errors SS/troubleshooting VN/production/logging |
| `Morning` | VN/reference/variable-keys VN/world/character-routines VN/world/game-time |
| `Music` | VN/authoring/blocks-reference |
| `NameColor` | VN/scripting/vn-api |
| `NaN` | SS/advanced/platforms-and-limits SS/guides/what-gets-saved SS/reference/api-beastysave SS/reference/json-engine SS/reference/results-and-errors SS/troubleshooting |
| `Navigation` | VN/world/interactables-and-doors |
| `Night` | VN/world/character-routines |
| `None` | SS/reference/results-and-errors VN/authoring/dialogue-and-stage VN/world/characters VN/world/talk-menu |
| `Normal` | SS/guides/logging VN/authoring/dialogue-and-stage VN/production/vn-settings |
| `NotEquals` | VN/reference/variable-keys VN/world/variables-and-conditions |
| `Notice` | BC/guides/logging |
| `NUL` | SS/changelog SS/guides/settings SS/guides/slots-and-metadata SS/reference/api-beastysave SS/reference/results-and-errors |
| `Object` | BC/reference/api |
| `Off` | SS/changelog SS/guides/logging SS/reference/components |
| `OnBranchEnd` | VN/world/quests VN/world/talk-menu |
| `OnCaptureSave` | VN/scripting/custom-mode |
| `Once` | VN/production/audio-and-music VN/world/quests |
| `OnChoiceChosen` | VN/scripting/vn-api |
| `OnChoicePresented` | VN/scripting/vn-api |
| `OnDestroy` | SS/guides/scene-state SS/reference/components VN/scripting/vn-api |
| `OnDisable` | SS/guides/scene-state SS/reference/components |
| `OnEnable` | SS/guides/logging SS/guides/scene-state SS/reference/api-beastysave SS/reference/components |
| `OnLineShown` | VN/scripting/vn-api |
| `OnNodeChanged` | VN/scripting/vn-api |
| `OnPick` | VN/world/quests VN/world/talk-menu |
| `OnRestoreSave` | VN/scripting/custom-mode |
| `OnSceneRestoreFailed` | VN/scripting/custom-mode |
| `OnValidate` | SS/guides/logging SS/reference/api-beastysave SS/reference/components |
| `OnVariableChanged` | VN/scripting/vn-api |
| `OnVisualNovelEnded` | VN/scripting/controllers |
| `OnVisualNovelStarted` | VN/scripting/controllers |
| `OpenScreen` | VN/world/screens-and-hud |
| `Order` | VN/scripting/gameplay-apis |
| `Ordered` | VN/reference/variable-keys VN/world/quests |
| `Owned` | VN/scripting/gameplay-apis |
| `Park` | VN/world/character-routines |
| `Parse` | SS/reference/json-engine |
| `ParseError` | SS/guides/backups-and-corruption SS/guides/save-manager-window SS/reference/api-beastysave SS/reference/results-and-errors SS/reference/save-file-format SS/troubleshooting |
| `ParticleSystem` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `PasswordGenerator` | SS/changelog |
| `PersistentStage` | VN/scripting/controllers |
| `PersistentStage.Reset` | VN/scripting/controllers |
| `Plain` | BC/guides/logging |
| `Player.log` | BC/changelog BC/faq BC/guides/logging BC/guides/release-builds BC/index BC/reference/api |
| `PlayerData` | SS/guides/strict-vs-tolerant SS/guides/versioning-and-migrations |
| `PlayerData.health` | SS/guides/strict-vs-tolerant |
| `PlayerData.hp` | SS/guides/strict-vs-tolerant |
| `PlayerInput` | VN/reference/assets |
| `PlayerPrefs` | SS/advanced/platforms-and-limits VN/production/input-and-controls |
| `PlayVisualNovelThenReturn` | VN/scripting/controllers |
| `Populate` | SS/reference/json-engine |
| `PopulateFields` | SS/reference/json-engine |
| `Portrait` | VN/scripting/vn-api |
| `PreferencesScreen` | VN/reference/prefabs |
| `Present` | VN/scripting/gameplay-apis |
| `PresentTalkMenu` | VN/scripting/controllers |
| `PrintLongMessage` | BC/changelog BC/guides/logging BC/index BC/reference/api |
| `PRN` | SS/getting-started/save-without-code SS/guides/settings SS/guides/slots-and-metadata SS/reference/api-beastysave SS/reference/results-and-errors |
| `Profiles` | SS/guides/settings |
| `PromptVariable` | VN/scripting/vn-api |
| `Pulse` | VN/authoring/dialogue-and-stage VN/world/characters |
| `Push` | SS/reference/json-engine SS/reference/results-and-errors |
| `PushCustomRollback` | VN/scripting/custom-mode |
| `Quaternion` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules |
| `QuestCatalog` | VN/reference/assets VN/world/quests |
| `Quests` | VN/world/quests |
| `Queue` | SS/faq SS/getting-started/save-with-code |
| `RawImage` | SS/getting-started/installation SS/reference/converter-modules |
| `Read` | SS/advanced/custom-converters VN/scripting/gameplay-apis |
| `ReadMeta` | SS/advanced/platforms-and-limits SS/guides/backups-and-corruption SS/guides/slots-and-metadata SS/reference/results-and-errors SS/reference/save-file-format |
| `Ready` | VN/scripting/controllers |
| `Rect` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules |
| `RectTransform` | SS/getting-started/installation SS/reference/converter-modules |
| `Register` | SS/guides/scene-state |
| `RegisterConverter` | SS/advanced/custom-converters SS/guides/versioning-and-migrations SS/reference/api-beastysave SS/reference/results-and-errors |
| `RegisterMigration` | SS/advanced/custom-converters SS/guides/versioning-and-migrations SS/reference/results-and-errors |
| `RegisterModule` | SS/advanced/custom-converters SS/guides/versioning-and-migrations SS/reference/api-beastysave SS/reference/results-and-errors |
| `Rename` | VN/authoring/story-graph VN/getting-started/editor-tour |
| `Reset` | SS/reference/components |
| `ResetOverrides` | VN/production/input-and-controls |
| `ResolveAt` | VN/scripting/gameplay-apis |
| `ResolveIn` | VN/scripting/gameplay-apis |
| `ResolveRoomBackground` | VN/scripting/custom-mode |
| `Resources` | SS/reference/converter-modules VN/getting-started/installation VN/production/localization VN/production/vn-settings VN/reference/assets |
| `Resources.Load` | SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `RestoreBackup` | SS/getting-started/save-with-code SS/reference/results-and-errors SS/reference/save-file-format SS/troubleshooting |
| `RestoreCustomStateJson` | VN/scripting/custom-mode VN/scripting/overview |
| `RestoreSlotBackup` | VN/scripting/controllers |
| `RestoreVisualNovel` | VN/scripting/controllers |
| `Resume` | VN/scripting/vn-api |
| `ReturnNode` | VN/authoring/vnbeasty-syntax |
| `ReturnToRoom` | VN/world/talk-menu |
| `Right` | VN/authoring/blocks-reference VN/authoring/dialogue-and-stage |
| `RollbackFromCustom` | VN/scripting/custom-mode |
| `RoomId` | VN/scripting/gameplay-apis |
| `RoomSelectionRequested` | VN/scripting/custom-mode |
| `RoutinePlacement` | VN/scripting/gameplay-apis |
| `Run` | VN/getting-started/your-first-scene |
| `Runtime` | VN/faq VN/scripting/overview |
| `RuntimeInitializeOnLoadMethod` | BC/guides/release-builds VN/production/logging |
| `Save` | SS/getting-started/save-without-code SS/guides/encryption SS/guides/slots-and-metadata SS/reference/results-and-errors SS/reference/save-file-format VN/production/logging VN/scripting/vn-api |
| `SaveAll` | SS/advanced/platforms-and-limits SS/faq SS/getting-started/save-without-code SS/guides/encryption SS/guides/save-manager-window SS/guides/scene-state SS/guides/settings SS/guides/versioning-and-migrations SS/reference/components |
| `SaveAllNow` | SS/advanced/platforms-and-limits SS/guides/async-saving SS/guides/scene-state |
| `SaveAsync` | SS/advanced/platforms-and-limits SS/faq SS/guides/async-saving SS/reference/results-and-errors |
| `SaveCompleted` | SS/advanced/platforms-and-limits SS/guides/scene-state SS/reference/components |
| `SaveLoadScreen` | VN/reference/prefabs |
| `SaveOverrides` | VN/production/input-and-controls |
| `SaveResult` | SS/advanced/platforms-and-limits SS/faq SS/getting-started/save-with-code SS/guides/what-gets-saved SS/index SS/troubleshooting |
| `SaveResult.BytesWritten` | SS/changelog |
| `SaveResult.Ok` | SS/reference/api-beastysave |
| `Saves` | SS/getting-started/save-without-code SS/guides/settings |
| `SaveSlotView` | VN/reference/prefabs |
| `SaveToSlot` | VN/scripting/controllers |
| `ScriptableObject` | SS/guides/what-gets-saved VN/production/logging |
| `Scripts` | VN/authoring/text-script |
| `Season` | VN/scripting/gameplay-apis |
| `Secondary` | VN/reference/assets VN/world/characters |
| `SequentialLoop` | VN/production/audio-and-music |
| `SerializationFailed` | SS/guides/what-gets-saved SS/reference/api-beastysave SS/reference/results-and-errors SS/reference/save-file-format SS/troubleshooting |
| `Set` | VN/scripting/gameplay-apis |
| `SetBool` | VN/scripting/overview |
| `SetCharacterNameToAlias` | VN/scripting/vn-api |
| `SetDaypart` | VN/authoring/blocks-reference VN/world/game-time |
| `SetFloat` | VN/scripting/overview |
| `SetHour` | VN/authoring/blocks-reference VN/world/game-time |
| `SetIsOnWithoutNotify` | SS/reference/converter-modules |
| `SetState` | VN/scripting/gameplay-apis |
| `SetString` | VN/scripting/overview |
| `SetValueWithoutNotify` | SS/reference/converter-modules |
| `SetWeekday` | VN/authoring/blocks-reference VN/scripting/gameplay-apis VN/world/game-time |
| `Sfx` | VN/authoring/blocks-reference |
| `Shake` | VN/authoring/dialogue-and-stage VN/world/characters |
| `SharedVariables` | VN/scripting/controllers |
| `SharedVariableStore` | VN/scripting/controllers |
| `Shout` | VN/authoring/dialogue-and-stage |
| `Shuffle` | VN/production/audio-and-music |
| `Sick` | VN/world/character-routines |
| `Side` | VN/world/quests |
| `Simple` | SS/reference/converter-modules |
| `SingleInfinite` | VN/production/audio-and-music |
| `Slider` | SS/changelog SS/getting-started/installation SS/reference/converter-modules |
| `Slot1` | SS/getting-started/save-without-code |
| `SlotsOnly` | VN/reference/assets VN/world/character-routines VN/world/game-time |
| `Snapshot` | VN/scripting/gameplay-apis |
| `SortedSet` | SS/faq SS/getting-started/save-with-code |
| `Source` | VN/production/localization |
| `Speaker` | VN/scripting/vn-api |
| `SpeakerName` | VN/scripting/vn-api |
| `SpecificDays` | VN/production/validation-and-ids VN/world/quests |
| `SphereCollider` | SS/getting-started/installation SS/reference/converter-modules |
| `SpotId` | VN/scripting/gameplay-apis |
| `Sprite` | SS/getting-started/save-without-code SS/guides/what-gets-saved SS/reference/results-and-errors SS/troubleshooting |
| `SpriteRenderer` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `Sprites` | VN/production/vn-settings |
| `Stack` | SS/faq SS/getting-started/save-with-code |
| `Stage` | VN/getting-started/installation VN/production/logging VN/production/ui-prefabs VN/reference/prefabs VN/scripting/overview |
| `StageController` | VN/reference/prefabs VN/scripting/overview |
| `StageMemory` | VN/scripting/controllers |
| `StageRoot` | VN/scripting/controllers |
| `Stale` | VN/production/localization |
| `Start` | VN/scripting/controllers |
| `StartNewGame` | VN/scripting/controllers |
| `StartQuest` | VN/scripting/gameplay-apis |
| `State` | VN/scripting/custom-mode |
| `StateChanged` | VN/scripting/custom-mode |
| `StoryGraph` | VN/authoring/text-script VN/authoring/vnbeasty-syntax VN/reference/assets |
| `Streaming` | VN/production/logging |
| `Strict` | SS/guides/settings SS/guides/strict-vs-tolerant SS/troubleshooting |
| `StrictPopulate` | SS/reference/json-engine |
| `String` | VN/reference/assets VN/reference/variable-keys VN/world/variables-and-conditions |
| `SubGraphNode` | VN/authoring/vnbeasty-syntax |
| `SubsystemRegistration` | SS/advanced/custom-converters VN/scripting/custom-mode VN/scripting/vn-api |
| `Subtract` | VN/authoring/blocks-reference VN/authoring/choices-and-decisions |
| `Success` | BC/guides/logging SS/faq SS/index SS/reference/results-and-errors |
| `Suspend` | VN/scripting/vn-api |
| `Tab` | VN/authoring/text-script VN/authoring/vnbeasty-syntax |
| `Take` | VN/scripting/gameplay-apis |
| `Talk` | VN/world/talk-menu |
| `TalkMenuNode` | VN/authoring/vnbeasty-syntax |
| `TargetNodeId` | VN/scripting/vn-api |
| `Task` | SS/advanced/platforms-and-limits SS/faq SS/getting-started/installation SS/guides/async-saving SS/troubleshooting VN/production/building-and-platforms |
| `Tests` | SS/getting-started/installation |
| `Text` | VN/scripting/vn-api |
| `TextColor` | VN/scripting/vn-api |
| `Texture2D` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `Thinking` | VN/authoring/dialogue-and-stage |
| `TimeConfig` | VN/scripting/controllers |
| `TMP_Text` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules SS/troubleshooting |
| `Toggle` | SS/changelog SS/getting-started/installation SS/reference/converter-modules VN/authoring/blocks-reference VN/authoring/choices-and-decisions |
| `ToNode` | SS/reference/json-engine |
| `ToObject` | SS/reference/json-engine |
| `ToString` | BC/guides/release-builds SS/reference/results-and-errors |
| `Trace` | BC/guides/logging |
| `Transform` | SS/advanced/custom-converters SS/getting-started/installation SS/guides/what-gets-saved SS/reference/components SS/reference/converter-modules SS/troubleshooting |
| `Translated` | VN/production/localization |
| `Type.FullName` | SS/reference/save-file-format |
| `TypeMismatch` | SS/reference/api-beastysave SS/reference/results-and-errors SS/reference/save-file-format SS/troubleshooting |
| `TypeUnavailable` | SS/advanced/custom-converters SS/getting-started/installation SS/guides/save-manager-window SS/guides/scene-state SS/reference/components SS/reference/converter-modules SS/reference/results-and-errors |
| `UILocalization` | VN/changelog |
| `UILocalization.asset` | VN/getting-started/installation |
| `UnityEngine.Debug` | BC/faq BC/guides/beasty-integration BC/guides/release-builds SS/guides/logging VN/changelog VN/production/logging |
| `UnityEngine.Object` | BC/guides/logging BC/reference/api SS/advanced/platforms-and-limits SS/faq SS/getting-started/save-with-code SS/guides/what-gets-saved SS/reference/api-beastysave SS/reference/converter-modules SS/reference/json-engine SS/reference/results-and-errors SS/troubleshooting |
| `UnityEvent` | SS/guides/scene-state |
| `Unreadable` | SS/guides/slots-and-metadata |
| `Unregister` | SS/reference/components |
| `UnregisterAll` | SS/reference/components |
| `Use` | VN/scripting/gameplay-apis |
| `V1ToV2` | SS/guides/versioning-and-migrations |
| `V2ToV3` | SS/guides/versioning-and-migrations |
| `Value` | SS/getting-started/save-with-code SS/reference/api-beastysave SS/reference/results-and-errors |
| `VariableBoundLabel` | VN/reference/prefabs |
| `VariableDefinition` | VN/reference/assets |
| `VariableStore` | VN/scripting/gameplay-apis VN/scripting/generated-accessors VN/scripting/overview |
| `VariableStore.Changed` | VN/scripting/overview |
| `Vector2` | SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules |
| `Vector3` | SS/advanced/custom-converters SS/getting-started/installation SS/guides/what-gets-saved SS/reference/converter-modules |
| `Vector4` | SS/guides/what-gets-saved SS/reference/converter-modules |
| `Verbose` | BC/guides/logging SS/changelog SS/reference/api-beastysave SS/reference/components VN/production/logging |
| `VersionTooNew` | SS/guides/backups-and-corruption SS/guides/save-manager-window SS/guides/settings SS/guides/versioning-and-migrations SS/reference/api-beastysave SS/reference/results-and-errors SS/reference/save-file-format |
| `VerticalItemScreenElement` | VN/reference/prefabs |
| `VerticalMenu` | VN/production/ui-prefabs VN/reference/prefabs |
| `Visual` | VN/scripting/gameplay-apis |
| `VisualNovel` | VN/production/saving-and-loading VN/scripting/overview VN/world/screens-and-hud |
| `VisualNovelController` | VN/index VN/reference/prefabs VN/scripting/controllers VN/scripting/overview VN/scripting/vn-api |
| `VisualNovelController.Instance` | VN/scripting/controllers VN/scripting/overview |
| `VisualNovelController.PersistentStage` | VN/scripting/overview |
| `VisualNovelSaveData.customStateJson` | VN/scripting/custom-mode |
| `VisualNovelScene` | VN/production/ui-prefabs VN/reference/prefabs |
| `VN_Canvas` | VN/changelog VN/getting-started/your-first-scene VN/production/ui-prefabs VN/reference/prefabs |
| `VN_Characters` | VN/production/streaming |
| `VN_Items` | VN/production/streaming |
| `VN_Rooms` | VN/production/streaming |
| `VN.Active` | VN/scripting/vn-api |
| `VN.Active.CurrentNode` | VN/scripting/vn-api |
| `VN.Advance` | VN/scripting/overview VN/scripting/vn-api |
| `VN.Back` | VN/scripting/overview |
| `VN.GetInt` | VN/scripting/overview |
| `VN.OnChoiceChosen` | VN/scripting/overview |
| `VN.OnChoicePresented` | VN/scripting/overview |
| `VN.OnLineShown` | VN/scripting/overview VN/scripting/vn-api |
| `VN.OnVariableChanged` | VN/scripting/overview |
| `VN.SetInt` | VN/scripting/custom-mode VN/scripting/overview |
| `VNAppState` | VN/scripting/controllers VN/scripting/overview |
| `VNAppState.Custom` | VN/scripting/custom-mode |
| `VNAudioManager` | VN/reference/prefabs |
| `VNBacklogEntry` | VN/production/ui-prefabs VN/reference/prefabs |
| `VNChars` | VN/index VN/production/validation-and-ids VN/reference/menu-items VN/reference/variable-keys VN/scripting/generated-accessors VN/world/variables-and-conditions |
| `VNChars.Maya.Affection` | VN/scripting/overview |
| `VNConfirmDialog` | VN/reference/prefabs |
| `VNContext` | VN/production/localization VN/production/vn-settings VN/reference/assets |
| `VNGameController` | VN/index VN/reference/prefabs VN/scripting/controllers VN/scripting/overview VN/scripting/vn-api |
| `VNGameController.EnterCustom` | VN/scripting/overview |
| `VNGameController.Instance` | VN/scripting/controllers VN/scripting/overview |
| `VNGameController.Instance.RollbackFromCustom` | VN/scripting/custom-mode |
| `VNGameController.Instance.SharedVariables` | VN/scripting/generated-accessors VN/scripting/overview VN/scripting/vn-api |
| `VNGameController.Instance.SharedVariables.Changed` | VN/scripting/vn-api |
| `VNGameController.SaveToSlot` | VN/scripting/overview |
| `VNGameController.SharedVariables` | VN/scripting/controllers VN/scripting/gameplay-apis |
| `VNGameController.State` | VN/scripting/overview |
| `VNGameController.StateChanged` | VN/scripting/overview |
| `VNInputModuleInstaller` | VN/reference/prefabs |
| `VNLocalizedText` | VN/changelog VN/production/localization VN/reference/menu-items VN/reference/prefabs |
| `VNLog` | BC/guides/beasty-integration VN/changelog VN/production/logging |
| `VNLog.Enabled` | VN/changelog VN/production/logging |
| `VNMenuManager` | VN/reference/prefabs |
| `VNMenuRoot` | VN/production/ui-prefabs VN/reference/prefabs |
| `VNMusicConfig` | VN/reference/assets |
| `VNSaveSlot` | VN/production/ui-prefabs VN/reference/prefabs |
| `VNSession` | VN/scripting/overview VN/scripting/vn-api |
| `VNSettings` | VN/production/vn-settings VN/reference/assets |
| `VNSettings.asset` | VN/getting-started/installation |
| `VNSettings.defaultLanguage` | VN/changelog VN/production/localization |
| `VNSettings.gameContext` | VN/reference/assets |
| `VNSettings.uiLocalization` | VN/production/localization |
| `VNSlotLoadOutcome` | VN/scripting/controllers |
| `VNTimeConfig` | VN/reference/assets VN/scripting/gameplay-apis |
| `VNTimeSnapshot` | VN/scripting/gameplay-apis |
| `VNVars` | VN/index VN/production/validation-and-ids VN/reference/menu-items VN/reference/variable-keys VN/scripting/generated-accessors VN/world/variables-and-conditions |
| `VNVars.Money` | VN/scripting/generated-accessors VN/scripting/overview |
| `Voice` | VN/authoring/blocks-reference |
| `Wait` | VN/authoring/dialogue-preview |
| `Warnings` | SS/guides/strict-vs-tolerant SS/reference/results-and-errors |
| `Wave` | VN/authoring/dialogue-and-stage VN/world/characters |
| `Weekday` | VN/scripting/gameplay-apis |
| `Weekly` | VN/world/quests |
| `Whisper` | VN/authoring/dialogue-and-stage |
| `Working` | VN/world/character-routines |
| `Write` | SS/reference/json-engine |
