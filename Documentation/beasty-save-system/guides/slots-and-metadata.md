# Slots and metadata

A slot is one save file. This page covers how slots are named, listed and deleted, and how to attach a
small block of metadata to each one so you can build a save-slot screen without loading the saves.

## What a slot is

A slot is a name, not a path. The save system turns it into a file:

```text
{DataPath or Application.persistentDataPath}/{Folder}/{slot}.{Extension}
```

`DataPath`, `Folder` and `Extension` come from [BeastySaveSettings](settings.md). With the defaults, the
slot `slot1` on Windows becomes something like:

```text
C:/Users/<you>/AppData/LocalLow/<Company>/<Game>/Saves/slot1.save
```

You never write that path yourself. You pass `"slot1"` and the system resolves the rest. If you need the
real path (to show it in a support screen, or to open the folder), ask for it:

```csharp
string folder = BeastySave.GetFolderPath(settings);
string file   = BeastySave.GetSlotPath("slot1", settings);
```

## Naming rules

A slot name must be a bare file name. It is rejected if it:

- is empty or only whitespace,
- contains `/` or `\`,
- contains `..`,
- is a rooted path (`C:\saves\x`, `/saves/x`),
- contains a character that is not valid in a file name,
- is a Windows reserved device name: `CON`, `PRN`, `AUX`, `NUL`, `COM1`-`COM9`, `LPT1`-`LPT9`.

The device names are rejected on every platform, not just Windows, so a save folder written on macOS or
Linux stays usable when the same player moves to a Windows machine.

A rejected name never touches the disk. The call comes back as a failed result with the error
`InvalidArgument` and a message that says why:

```text
Invalid slot name '../hack': it contains '..'.
```

Anything else is fine: `slot1`, `autosave`, `quicksave`, `Chapter 2 - the well`. If you let the player
type the slot name, check it before you use it, or just show the message the result gives you. See
[Results and errors](../reference/results-and-errors.md).

## Exists, Delete, ListSlots

| Call | What it does |
|---|---|
| `BeastySave.Exists(slot, settings)` | True when the slot's file is on disk. |
| `BeastySave.Delete(slot, settings)` | Deletes the slot **and its backup**. Returns true if the slot file was there. |
| `BeastySave.ListSlots(settings)` | The names of every slot in the folder. |

Two things to know about `Delete`. It removes the `.bak` file as well, so a deleted slot is gone for good;
there is nothing left to restore. And it returns `false` when there was no slot file to begin with, which
is not an error.

`ListSlots` returns the slot names only, with the extension stripped, and it excludes `.bak` backups and
any leftover `.tmp` files. The list is sorted in **ordinal** order, which is character-by-character, not
human-friendly: `slot10` sorts before `slot2`. If that matters to you, either zero-pad your names
(`slot01`, `slot02`, `slot10`) or sort the list yourself once you have read the metadata — which is the
next section, and the reason this page exists.

## Metadata: what a slot list actually needs

To draw a save-slot screen you need the chapter name, the playtime, the level, the date. You do not need
the player's full inventory. Loading twelve complete saves to print twelve lines of text is wasteful, and
if the saves are encrypted it is worse: you would have to decrypt all of them.

So `Save` takes an optional dictionary of strings. It is written into the save file next to the data, and
it can be read back on its own.

```csharp
using System;
using System.Collections.Generic;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;

var meta = new Dictionary<string, string>
{
    { "chapter",  "The Long Winter" },
    { "playtime", "01:22:40" },
    { "level",    "7" },
    { "savedAt",  DateTime.UtcNow.ToString("o") },
};

SaveResult result = BeastySave.Save(playerData, "slot1", settings, meta);
```

Keys and values are both strings. Numbers, dates and anything else go in as text, and come back out as
text; converting them back is your job.

The same parameter exists on the scene-save path:

```csharp
BeastySaveManager.Instance.SaveAllNow("slot1", meta);
```

To read it back, without loading the save:

```csharp
LoadResult<Dictionary<string, string>> meta = BeastySave.ReadMeta("slot1", settings);
if (meta.Success)
{
    string chapter = meta.Value["chapter"];
}
```

`ReadMeta` reads the file's envelope and stops. It does not touch the data payload, it does not verify the
checksum, and it does not need the encryption key.

## Metadata is plain text, even when the save is encrypted

This is the deliberate trade-off that makes a slot list cheap, and you must know about it.

The data in a save can be encrypted. The metadata never is. It sits in plain text in the file, so
`ReadMeta` can build your slot list on an encrypted game without decrypting anything, and so the
[Save Manager window](save-manager-window.md) can show you a summary of a slot it has no key for.

Two consequences:

> **Warning**
> Metadata is display data. Do not trust it for gameplay decisions. It is readable and editable by
> anyone with a text editor, and `ReadMeta` returns it without checking the file's checksum. Put the
> chapter name in the metadata. Do not put the player's gold there and then read it back as the truth.
> The truth lives in the data payload, which is checksummed on load.

Do not put anything private in it either. If a value should not be visible in a text editor, it belongs in
the data, not in the meta. See [Encryption](encryption.md).

## A worked example: slot summaries for a UI

This method returns one summary per slot, ready to bind to a list of buttons. It never loads a save.

```csharp
using System;
using System.Collections.Generic;
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;

public sealed class SlotSummary
{
    public string Slot;
    public string Chapter;
    public string Playtime;
    public int Level;
    public DateTime SavedAt;
    public bool Unreadable;   // the file is there, but its envelope could not be read
}

public static class SaveSlots
{
    public static List<SlotSummary> List(BeastySaveSettings settings)
    {
        var summaries = new List<SlotSummary>();

        foreach (string slot in BeastySave.ListSlots(settings))
        {
            var summary = new SlotSummary { Slot = slot };

            LoadResult<Dictionary<string, string>> meta = BeastySave.ReadMeta(slot, settings);
            if (!meta.Success)
            {
                // Corrupt or unreadable envelope. Still list the slot: the player must be able to
                // select it, see that it is damaged, and restore its backup.
                summary.Unreadable = true;
                summaries.Add(summary);
                continue;
            }

            summary.Chapter  = Text(meta.Value, "chapter", "Unknown chapter");
            summary.Playtime = Text(meta.Value, "playtime", "--:--");

            if (int.TryParse(Text(meta.Value, "level", "0"), out int level))
                summary.Level = level;

            if (DateTime.TryParse(Text(meta.Value, "savedAt", null), out DateTime savedAt))
                summary.SavedAt = savedAt;

            summaries.Add(summary);
        }

        // ListSlots sorts ordinally. Most recent first is usually what a player wants.
        summaries.Sort((a, b) => b.SavedAt.CompareTo(a.SavedAt));
        return summaries;
    }

    private static string Text(IDictionary<string, string> meta, string key, string fallback) =>
        meta.TryGetValue(key, out string value) && !string.IsNullOrEmpty(value) ? value : fallback;
}
```

Note what happens to a damaged slot: it is still in the list, marked `Unreadable`. That is on purpose. A
slot the player cannot see is a slot the player cannot repair, and every save has a backup waiting.
[Backups and corruption](backups-and-corruption.md) shows the rest of that flow.

## See also

- [Backups and corruption](backups-and-corruption.md) — restoring a damaged slot
- [Settings](settings.md) — `Folder`, `Extension`, `DataPath`
- [Encryption](encryption.md) — what encryption does and does not cover
- [The Save Manager window](save-manager-window.md) — the same slot list, in the editor
- [BeastySave API](../reference/api-beastysave.md) — every method on the facade
- [The save file format](../reference/save-file-format.md) — where `meta` sits in the file
