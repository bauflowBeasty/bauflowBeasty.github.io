# Actualizaciones pendientes de documentación — Save System Logging (1.0.0)

**Para quién es esto:** cualquiera que edite la documentación pública del Beasty Save System desde otro
proyecto/repositorio, sin acceso a esta conversación ni a este árbol de trabajo. Todo lo necesario está en
este documento: qué añadir, en qué fichero, en qué punto exacto, y el texto final listo para pegar.

**Contexto en dos líneas:** en la versión 1.0.0 (aún sin publicar) el save system ganó un sistema de
logging: un dropdown **Logging** (`Auto / On / Verbose / Off`) en el inspector de `BeastySaveManager`,
líneas de log con tag `[BeastySave]` para cada save/load/delete/restore/migración (con tamaño y timing),
y dos campos nuevos en los resultados (`SaveResult.BytesWritten`, `LoadResult.MigratedFrom`). La
documentación principal de esa feature **ya existe** (`guides/logging.md`, referencia de API, changelog
sección *Logging*). Lo que sigue son los 4 huecos que quedaron: dos enlaces cruzados incompletos, dos
entradas menores de changelog y una captura opcional.

**Convenciones de la doc** (aplican a todo lo de abajo):

- La documentación vive en `Documentation/beasty-save-system/` y es **markdown en bruto, en inglés, sin
  frontmatter** (la web la monta otro sistema).
- Los bloques "TEXTO A PEGAR" van tal cual, sin traducir ni reformatear.
- Los anclajes se dan por **texto literal del fichero**, no por número de línea (los números caducan).

---

## Cambio 1 — `MigratedFrom` en la guía de migraciones (IMPORTANTE: enlace roto en la práctica)

**Fichero:** `Documentation/beasty-save-system/guides/versioning-and-migrations.md`

**Por qué:** `reference/results-and-errors.md` documenta `LoadResult.MigratedFrom` con un "See
versioning-and-migrations.md", pero esa guía no menciona el campo ni la línea de log de migración. El
lector sigue el enlace y no encuentra nada.

**Dónde:** en la sección `## Practical advice`, después del último párrafo (el que empieza por
`**Test the chain.**`) y antes de `## See also`.

**TEXTO A PEGAR:**

````markdown
**You can tell when a migration ran.** With logging on (the default in the editor — see
[Logging](logging.md)), a load that migrated a file says so:

```
[BeastySave] Migrated 'slot1' data v1 → v2
```

Code gets the same fact: `LoadResult.MigratedFrom` is the data version the file was migrated **from**,
or 0 when no migration ran. Use it to tell the player the truth — "your save was updated from an older
version of the game" — instead of migrating silently.
````

**Además**, en la lista `## See also` del mismo fichero, añadir esta entrada al final:

```markdown
- [Logging](logging.md) — the migration line above, and everything else the save system prints
```

---

## Cambio 2 — El warning del checksum en la guía de backups (IMPORTANTE: enlace de vuelta que falta)

**Fichero:** `Documentation/beasty-save-system/guides/backups-and-corruption.md`

**Por qué:** la sección "A damaged slot is never rotated into the backup" describe exactamente el
comportamiento que ahora avisa por consola, pero no menciona la línea de log. `guides/logging.md` enlaza a
esta guía; el camino inverso no existe.

**Dónde:** dentro de `### Two behaviours that surprise people`, justo después del párrafo que termina en
`…and the good `.bak` underneath stays good.` (y antes del párrafo que empieza por `` `Delete` is the
exception``).

**TEXTO A PEGAR:**

````markdown
It does not happen silently, either. The moment the system refuses the rotation, it warns:

```
[BeastySave] 'slot1' failed its checksum; backup NOT rotated (any existing .bak is left untouched).
```

That line in a log means the slot on disk is damaged and the `.bak` may be the only good copy left.
````

> ⚠️ El string del warning de arriba es el **literal exacto** que emite `SavePipeline` en 1.0.0. Si se
> reescribe esta cita, verificarla contra el código antes de publicar (hubo una versión anterior del
> wording — "the existing .bak stays as the last good copy" — que ya NO es la real).

**Además**, en la lista `## See also` del mismo fichero, añadir esta entrada (por ejemplo tras la de
*Results and errors*):

```markdown
- [Logging](logging.md) — the checksum warning above, and everything else the save system prints
```

---

## Cambio 3 — Dos cambios de comportamiento en el changelog (consistencia)

**Fichero:** `Assets/BeastyComponents/BeastySaveSystem/BeastySaveSystem_CHANGELOG.md`
(en el paquete exportado, el changelog viaja junto al asset; es el mismo fichero).

**Por qué:** la sección `### Pre-release changes` de `## 1.0.0 — unreleased` existe precisamente para
cambios de comportamiento hechos antes de publicar la 1.0.0, y el trabajo de logging trajo dos que no
están listados. La sección `### Logging` ya cubre la feature en sí; esto es solo lo que **cambió**
respecto a builds anteriores del asset.

**Dónde:** al final de la lista de viñetas de `### Pre-release changes` (tras la viñeta de
`**Removed** \`PasswordGenerator\`…`).

**TEXTO A PEGAR:**

```markdown
- **Logging got quieter by default.** The file-path dumps (`File Path: …`, `Folder Path …`) that used to
  print on every file operation in the editor are now Verbose-only. And probing a slot that does not
  exist — what a save-slot screen does for every empty slot each time it opens — no longer logs a
  warning per slot; a real `Load` of a missing slot still warns.
```

---

## Cambio 4 — Captura del dropdown Logging (OPCIONAL)

**Ficheros:** `Documentation/SCREENSHOTS.md` y `Documentation/beasty-save-system/guides/logging.md`

**Por qué:** las capturas pendientes del save system no incluyen el dropdown **Logging** nuevo. La guía se
sostiene sin imagen (muestra la salida de consola como bloques de texto), así que esto es opcional; si se
decide añadirla, hay que tocar **los dos** ficheros, porque la convención de `SCREENSHOTS.md` es que las
páginas ya enlazan a la ruta de la imagen antes de que exista.

**4a.** En `SCREENSHOTS.md`, tabla `## beasty-save-system/images/`, añadir la fila:

```markdown
| `save-manager-logging.png` | The BeastySaveManager inspector with the **Logging** dropdown open, showing Auto / On / Verbose / Off. |
```

y actualizar el recuento de la introducción del fichero ("Eleven places" pasa a "Twelve places").

**4b.** En `guides/logging.md`, justo después de la línea
`Select your \`BeastySaveManager\` and look at **Logging**.`, añadir:

```markdown
![The Logging dropdown](../images/save-manager-logging.png)
```

---

## Checklist de aplicación

- [ ] Cambio 1: párrafo + See also en `versioning-and-migrations.md`
- [ ] Cambio 2: warning citado + See also en `backups-and-corruption.md`
- [ ] Cambio 3: viñeta en `### Pre-release changes` del changelog
- [ ] Cambio 4 (opcional): fila en `SCREENSHOTS.md` + imagen enlazada en `logging.md` + recuento actualizado
- [ ] Los enlaces relativos (`logging.md`, `../images/…`) resuelven en el sistema que monta la web
