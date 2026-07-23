# Portada de la documentación (texto rescatado)

> **Qué es esto:** era el `README.md` raíz del antiguo árbol canónico
> (`E:\Beasty\BeastyVisualNovel\Documentation\README.md`), eliminado el 2026-07-21 al pasar la
> documentación a vivir solo en este repositorio. Su texto no tiene equivalente en el sitio: la portada
> (`LandingPage.astro`) presenta los productos, pero no explica cómo se relacionan entre sí ni para qué
> lector es cada carpeta.
>
> **Pendiente:** el sitio no tiene ruta `/docs/` (solo `/docs/<producto>/…`). Este texto es el candidato
> natural para esa página índice, en EN y ES. Mientras no exista, se guarda aquí para no perderlo.

---

Three Unity packages. Each one works on its own, and they fit together when you own more than one.

| Package | What it does | Start here |
|---|---|---|
| **[Beasty Visual Novel](/docs/beasty-visual-novel/)** | A complete visual novel engine: a story graph and a Ren'Py-like text script kept in sync, free-roam rooms, quests, game time, character routines, localization and saves. | [Your first scene](/docs/beasty-visual-novel/getting-started/your-first-scene/) |
| **[Beasty Save System](/docs/beasty-save-system/)** | Slot-based save and load with its own JSON engine and no external dependencies. Atomic writes, per-slot backups, optional encryption, and scene state from a component you tick. | [Save without writing code](/docs/beasty-save-system/getting-started/save-without-code/) |
| **[Beasty Console](/docs/beasty-console/)** | A logging API with semantic levels, plus an editor console that classifies, filters and searches everything your project logs. | [Getting started](/docs/beasty-console/getting-started/) |

## How the three relate

Beasty Save System **ships inside** Beasty Visual Novel. If you bought the novel engine, the save system
is already there — do not import it a second time.

Beasty Console is optional for the save system, which detects it at runtime and falls back to Unity's
own console when it is absent. That is why each package can be bought and imported on its own.

## Who each page is for

The documentation is written for two readers at once, and every page says which one it is talking to.

- **You do not write code.** Everything you need is in *Getting started* and the guides. In Beasty Visual
  Novel that means `getting-started/`, `authoring/`, `world/` and `production/`; in Beasty Save System,
  `getting-started/` and `guides/`. You can build and ship a game without opening a C# file.
- **You write code.** The `reference/`, `advanced/` and `scripting/` folders give you exact signatures,
  the file formats, and the extension points. Full C# source is included in every package.

## Requirements

Unity **6000.2 or newer**. Mono and IL2CPP. Windows, macOS, Linux, Android, iOS and consoles.

**WebGL is not supported** in 1.0.0, because the save pipeline relies on file-system semantics the browser
build does not provide. This applies to Beasty Save System and, through it, to Beasty Visual Novel.
