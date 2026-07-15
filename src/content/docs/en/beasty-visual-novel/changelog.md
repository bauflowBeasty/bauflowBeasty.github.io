---
title: "Changelog"
description: "All notable changes to Beasty Visual Novel, version by version. The project follows Semantic Versioning."
---

All notable changes to Beasty Visual Novel. This project follows [Semantic Versioning](https://semver.org/).

## 1.0.0 — unreleased

First public release.

### Story authoring

- Node graph (dialogue, choice, decision, subgraph, flow) with a block-based editor.
- `.vnbeasty` text script: write scenes as a Ren'Py-like script, kept in two-way sync with the graph. The graph
  stays the source of truth — an empty, unparseable or unrepresentable script never overwrites it, and a
  destructive import leaves a timestamped `.bak`.
- In-editor preview of any node, up to any block.

### World

- Free-roam rooms with conditional backgrounds, doors and interactables.
- Game time (dayparts or clock), character routines with profiles, and a routine grid editor.
- Quests with stages, objectives, rewards and a talk-menu hub per character.

### Presentation

- Dialogue, choices, backlog, history, save/load, preferences and help screens, all localizable.
- Localization tables with per-cell staleness tracking and CSV/TSV import and export.
- Optional Addressables streaming of node assets (**beta**).

### Persistence

- Slot saves with thumbnails, autosaves, backups, and optional encryption.
- Scene-object state (`BeastySaveable`) rides inside the save.
