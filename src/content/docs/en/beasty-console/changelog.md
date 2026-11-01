---
title: "Changelog"
description: "A summary of what changed in Beasty Console, version by version. The project follows Semantic Versioning."
---

A summary of what changed in Beasty Console, version by version. Each feature is explained in full on its
own page of these docs. This project follows [Semantic Versioning](https://semver.org/).

## 1.0.0 — 2026-07-27

First public release.

### New
- **Eleven log levels**, from info to exception, so every message says what kind of message it is.
- **Only warnings, errors and exceptions count as problems** for Unity: the softer levels never trigger
  Error Pause.
- **Readable logs everywhere**: colors and icons in the editor, plain text in a build's log file.
- **Clickable entries** that point to the object they came from.
- **The Beasty Console window**: filters by level, search, and stack traces that open your code at the
  right line.
- **No dependencies**, on Mono and IL2CPP. Works on its own or alongside Beasty Save System.
