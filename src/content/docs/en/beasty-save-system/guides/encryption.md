---
title: "Encryption"
description: "Turn on AES-256 encryption so players cannot edit their saves in a text editor, and an honest note on what that protection is worth."
---

The save system can encrypt the contents of a save file so a player cannot open it in a text editor and
change their gold to 999999. This page shows how to turn it on, and is honest about what it is worth.

## Read this first

> **Warning**
> This is obfuscation against casual save editing. **It is not security.** The key that encrypts the save
> ships inside your game, and anyone determined enough can extract it from the build. Treat an encrypted
> save as a locked door with the key under the mat: it stops the curious, not the motivated.
>
> Never rely on it to protect anything that matters. In particular, do not treat an encrypted save as an
> anti-cheat measure in a multiplayer game — if a value must be trustworthy, it has to be validated on a
> server you control, not stored on the player's disk.

That is the whole caveat, and it applies to every save-encryption feature in every asset, not only this
one. It is a property of shipping the key to the attacker. With that understood, encryption is still
worth turning on: it makes casual save editing an inconvenience instead of a five-second job, and it stops
your save file from being a spoiler-filled plain-text list of every chapter in your game.

## Turning it on

Two fields on [BeastySaveSettings](/docs/beasty-save-system/guides/settings/):

| Field | Set it to |
|---|---|
| `Encrypted` | `true` |
| `EncryptionKey` | A string of your own |

In the inspector, they are on the `BeastySaveManager` component. In code:

```csharp
using Beasty_SaveSystemCore;

var settings = new BeastySaveSettings
{
    Encrypted     = true,
    EncryptionKey = "the-brass-lantern-hums-at-dusk",
};
```

That is all. `Save`, `Load`, `SaveAll` and `LoadAll` behave exactly as before.

## What it does

The payload is encrypted with AES-256 (CBC). The key can be **any non-empty string** — it does not have
to be 32 characters, or hex, or anything else. Whatever you type is hashed with SHA-256 to produce the
256-bit key.

![An encrypted save opened in a text editor: the payload is unreadable, the meta is not](/docs-images/beasty-save-system/save-encrypted-file.png)

A fresh random 16-byte initialisation vector is generated for every save and stored with the ciphertext.
The practical consequence: saving the same data twice produces two different files. This is correct and
intended. Do not compare save files byte-for-byte to decide whether something changed.

What is **not** encrypted:

- The envelope — the container version, the data version, the type name, the checksum.
- The `meta` dictionary.

The metadata stays in plain text on purpose, so a save-slot screen can show the chapter and playtime of
every slot without decrypting a thing. That trade-off is explained in
[Slots and metadata](/docs/beasty-save-system/guides/slots-and-metadata/). It also means metadata is the wrong place for anything you
would rather the player not read.

## If you leave the key empty

You get encryption, and you get a warning:

```text
Encryption is on but EncryptionKey is the shared default that ships with Beasty Save System:
every copy of the asset holds the same key, so anyone can decrypt your players' saves. Set
BeastySaveSettings.EncryptionKey (on the BeastySaveManager, or on the settings you pass to
BeastySave) to a string of your own before shipping.
```

An empty `EncryptionKey` falls back to a default key that is a public constant in the package. Every
copy of the asset contains the same string. Encryption still works, but any other owner of the asset can
decrypt your players' saves without any effort at all.

The warning appears once per session, in the editor and in development builds only. It is compiled out of
release builds — a player reading their own log file should not be told that the lock on their saves is
public.

Set your own key. Any string will do. Do it before you ship, not after: see the next section for why.

## The Encrypted flag must match the file

A save file does not announce whether it is encrypted. The `Encrypted` setting decides how the file is
read, and the two must agree.

- A game with `Encrypted = true` **refuses to load a plain-text save**. It fails with `DecryptFailed` and
  the message "This save is not encrypted, but this game only loads encrypted saves."
- A game with `Encrypted = false` cannot read an encrypted save either. The load fails as `Corrupt`,
  because the checksum cannot match.

The refusal is deliberate, not an oversight. If an encrypted game happily accepted plain-text saves, then
anyone could hand-write a plain-text save and the game would load it — and encryption would protect
nothing at all.

The same applies to the key itself: change the key and the old saves fail with `DecryptFailed`, exactly as
if they had been written by another game.

> **Warning**
> Turning encryption on (or changing the key) in the middle of production invalidates every existing save.
> Players who already own your game will find their saves refused. Decide before you ship.

## If you have to switch anyway

You have two options.

**Migrate on load.** Try the current settings first. If the load fails with `DecryptFailed`, try again with
a plain-text copy of the settings, and if that works, write it straight back out encrypted. The player
loads an old save once, and from then on it is a new save.

```csharp
using Beasty_SaveSystem;
using Beasty_SaveSystemCore;

public sealed class SaveGateway
{
    private readonly BeastySaveSettings _encrypted = new BeastySaveSettings
    {
        Encrypted     = true,
        EncryptionKey = "the-brass-lantern-hums-at-dusk",
        DataVersion   = 2,
    };

    public LoadResult<PlayerData> Load(string slot)
    {
        LoadResult<PlayerData> result = BeastySave.Load<PlayerData>(slot, _encrypted);
        if (result.Success || result.Error != BeastySaveError.DecryptFailed)
            return result;

        // The file predates encryption. Read it as plain text, with settings that match it in
        // every other respect.
        var legacy = new BeastySaveSettings
        {
            Encrypted   = false,
            DataVersion = _encrypted.DataVersion,
        };

        LoadResult<PlayerData> plain = BeastySave.Load<PlayerData>(slot, legacy);
        if (!plain.Success)
            return plain;

        // Rewrite the slot encrypted. The plain-text file rotates into the .bak, so nothing is lost
        // if this build turns out to be the one with the bug.
        BeastySave.Save(plain.Value, slot, _encrypted);
        return plain;
    }
}
```

Keep `Folder`, `Extension`, `DataPath` and `DataVersion` identical between the two settings objects.
Only `Encrypted` and `EncryptionKey` differ. Otherwise you are not reading the same file.

Note that `DecryptFailed` is also the code for "wrong key", so this fallback covers a key change as well
as switching encryption on. If you are rotating a key, the fallback settings need the **old** key, not
`Encrypted = false`.

**Or keep both.** Ship the update with `Encrypted = false` for old saves and encrypt only new ones, using
two settings objects and a marker in the metadata to tell them apart. This is more code and more ways to
get it wrong. Prefer the migration.

## See also

- [Settings](/docs/beasty-save-system/guides/settings/) — every field, including `Encrypted` and `EncryptionKey`
- [Slots and metadata](/docs/beasty-save-system/guides/slots-and-metadata/) — why `meta` stays in plain text
- [Backups and corruption](/docs/beasty-save-system/guides/backups-and-corruption/) — what a `Corrupt` result means
- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/) — `DecryptFailed` and the rest
- [The save file format](/docs/beasty-save-system/reference/save-file-format/) — where the ciphertext sits in the file
