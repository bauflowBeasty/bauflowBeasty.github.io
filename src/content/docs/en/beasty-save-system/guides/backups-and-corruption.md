---
title: "Backups and corruption"
description: "How atomic writes and .bak backups protect saves from crashes and corruption, and how to offer the player a restore when a load fails."
---

A save file is the player's time. This page explains what the package does to make sure a crash, a power
cut or a damaged file does not take that time away, and how to offer the player a way back when it
happens anyway.

## Two defences

1. **Atomic writes.** A save is never written on top of itself. It is written elsewhere and swapped in.
2. **Backups.** The previous good version of the slot is kept as a `.bak` file.

Both are on by default. The first cannot be turned off. The second is the `Backup` field in
[BeastySaveSettings](/docs/beasty-save-system/guides/settings/), which defaults to `true`.

## Atomic writes: a half-written save cannot exist

When you save to `slot1`, the system:

1. Builds the complete file contents in memory.
2. Writes them to a temporary file next to the slot, with a unique name (`slot1.save.<guid>.tmp`).
3. Replaces the slot file with the temp file in one operation.

The slot file therefore only ever contains a complete save. If the game crashes, the player pulls the
power cable, or the disk fills up halfway through step 2, the temp file is the casualty. The real save is
untouched: it is still the last save that finished.

You do not have to do anything to get this. There is no "safe save" option to enable.

> **Note**
> This is one of the reasons WebGL is not supported: the browser build has no atomic file replace. See
> [Platforms and limits](/docs/beasty-save-system/advanced/platforms-and-limits/).

## Backups: the previous version, kept

The replace step in an atomic write is what produces the backup. The file that was in the slot does not
get thrown away; it is moved to:

```text
{Folder}/{slot}.{Extension}.bak
```

With the defaults, saving over `slot1` leaves `slot1.save` (the new save) and `slot1.save.bak` (the one
before it) side by side.

![A slot file and its .bak sitting side by side in the save folder](/docs-images/beasty-save-system/save-backup-files.png)

The backup holds **one** version: the immediately previous save, not a history. Each save rotates the
current file into the `.bak` and overwrites whatever `.bak` was there. If your game autosaves every
minute, the backup is a minute old. That is the intended behaviour — it is a repair mechanism, not a
version-control system. If you want the player to be able to go back further, use more slots.

### Two behaviours that surprise people

**The first save of a slot creates no backup.** There was nothing in the slot to rotate. A brand-new
`slot1.save` has no `slot1.save.bak` next to it, and it will not have one until the second time you save
to that slot. So do not write a UI that assumes a backup exists. Check `BackupAvailable` (below).

**A damaged slot is never rotated into the backup.** Before a save overwrites a slot, the system checks
whether the file currently in that slot passes its own checksum. If it does not — the file is corrupt —
it is discarded rather than promoted to `.bak`. This matters more than it sounds. It means that saving on
top of a broken file does not destroy the last working copy. The player can hit "Save" on a corrupted
slot as many times as they like, and the good `.bak` underneath stays good.

It does not happen silently, either. The moment the system refuses the rotation, it warns:

```
[BeastySave] 'slot1' failed its checksum; backup NOT rotated (any existing .bak is left untouched).
```

That line in a log means the slot on disk is damaged and the `.bak` may be the only good copy left.

`Delete` is the exception, and it is deliberate: deleting a slot deletes its backup as well. When the
player says "delete this save", they mean it.

## Recovery: what to do when a load fails

A failed load tells you whether there is a way back. Every `LoadResult` has a `BackupAvailable` flag, and
when a load fails — from `Load`, `LoadInto`, `ReadMeta` or `LoadAllNow` — it is set to say whether a
`.bak` file exists for that slot. You do not have to go looking on disk yourself.

That gives you the honest UI flow. When a load fails and a backup exists, tell the player the truth and
offer the repair:

> This save file is damaged and cannot be loaded. Restore the last working version?

`BeastySave.RestoreBackup(slot, settings)` performs the repair. It copies the `.bak` over the slot, using
the same atomic write, and it **leaves the `.bak` in place**. If the restore itself is interrupted, the
backup is still there and the player can try again. If there is no backup, it fails with `FileNotFound`.

```csharp
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;
using UnityEngine;

public sealed class SaveLoader : MonoBehaviour
{
    [SerializeField] private ConfirmDialog _dialog;   // your own UI
    private BeastySaveSettings _settings;

    public void LoadSlot(string slot)
    {
        LoadResult<PlayerData> result = BeastySave.Load<PlayerData>(slot, _settings);

        if (result.Success)
        {
            Apply(result.Value);
            return;
        }

        if (result.BackupAvailable)
        {
            _dialog.Ask(
                title:   "This save is damaged",
                message: "The save file could not be read. Restore the last working version?",
                onYes:   () => RestoreAndLoad(slot),
                onNo:    () => { });
            return;
        }

        // Nothing to fall back on. Say so plainly; do not pretend the save loaded.
        _dialog.Tell("This save could not be loaded and has no backup.", result.Message);
    }

    private void RestoreAndLoad(string slot)
    {
        SaveResult restored = BeastySave.RestoreBackup(slot, _settings);
        if (!restored.Success)
        {
            _dialog.Tell("The backup could not be restored.", restored.Message);
            return;
        }

        LoadResult<PlayerData> retry = BeastySave.Load<PlayerData>(slot, _settings);
        if (retry.Success)
            Apply(retry.Value);
        else
            _dialog.Tell("The backup could not be loaded either.", retry.Message);
    }

    private void Apply(PlayerData data) { /* … */ }
}
```

Two details in that code are worth copying.

It checks `BackupAvailable` rather than the error code. A save can fail to load for many reasons —
`Corrupt`, `ParseError`, `IoError`, `FieldMapFailed` — and for most of them the backup is a reasonable
thing to try. See [Results and errors](/docs/beasty-save-system/reference/results-and-errors/) for the full list.

It reloads after restoring, and it handles the reload failing too. A backup is a save like any other; it
can be damaged as well. Restoring it does not guarantee it opens.

## Corruption you can see coming

A `Corrupt` result means the file's checksum does not match its contents. Something changed the file
after the game wrote it: a player editing it by hand, a bad disk, a sync service resolving a conflict
badly, a partial copy to a USB stick.

The checksum is not a security feature — a determined editor can recompute it — but it does reliably
catch accidental damage, which is what actually destroys saves in the wild.

Two failures are not corruption and no backup will fix them:

- `VersionTooNew` — the save was written by a newer build of your game. See
  [Versioning and migrations](/docs/beasty-save-system/guides/versioning-and-migrations/).
- `DecryptFailed` — the save and the game disagree about encryption. See [Encryption](/docs/beasty-save-system/guides/encryption/).

## Doing it from the editor

The [Save Manager window](/docs/beasty-save-system/guides/save-manager-window/) lists every slot on disk with a **Restore Backup**
button (disabled when no `.bak` exists) and a **Delete** button, both asking for confirmation. Use it to
test the flow above: save twice, corrupt the slot file in a text editor, load, restore.

![The Restore Backup confirmation in the Save Manager window](/docs-images/beasty-save-system/save-restore-backup.png)

## See also

- [Slots and metadata](/docs/beasty-save-system/guides/slots-and-metadata/) — listing slots, and showing a damaged one in the UI
- [Settings](/docs/beasty-save-system/guides/settings/) — the `Backup` field
- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/) — every error code and what causes it
- [Logging](/docs/beasty-save-system/guides/logging/) — the checksum warning above, and everything else the save system prints
- [The save file format](/docs/beasty-save-system/reference/save-file-format/) — the envelope and the checksum
- [Troubleshooting](/docs/beasty-save-system/troubleshooting/)
