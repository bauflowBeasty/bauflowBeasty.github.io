---
title: "Cloud saves with Firebase"
description: "Import the Firebase SDK and pick a backend: Firestore or Realtime Database, per-user saves with anonymous sign-in, and no other setup."
---

The asset ships two cloud backends built on Firebase: **Firestore** and **Realtime Database**. Both store
each player's saves under their own user id, sign players in anonymously when nothing else has, and need
no setup beyond importing the Firebase SDK. This page walks the setup, shows where the data lives, and
gives the security rules the layout expects.

## What you need

1. A Firebase project, and the **Firebase SDK for Unity** set up in your Unity project the way Google's
   own guide describes (the SDK ships as `.unitypackage` files or UPM packages, plus your project's
   Firebase config file).
2. The **Firebase Auth** package — both backends need it for the per-user layout.
3. **Firestore** or **Realtime Database** — whichever backend you plan to use.

That is the whole list. The asset's Firebase modules compile themselves when the SDK is present and stay
out of the build when it is not: a project without Firebase compiles, runs and saves locally exactly as
before.

## The modules compile themselves

Three scripting defines gate the modules, and the editor manages them for you:

| Define | Gates | Watches for |
|---|---|---|
| `BEASTY_HAS_FIREBASE_AUTH` | The Auth module (anonymous sign-in) | `Firebase.Auth` |
| `BEASTY_HAS_FIRESTORE` | The Firestore backend | `Firebase.Firestore` |
| `BEASTY_HAS_FIREBASE_RTDB` | The Realtime Database backend | `Firebase.Database` |

For a UPM install the modules detect the packages directly. For a `.unitypackage` install, a detector
(`FirebaseSdkDetector`) adds and removes the defines per build target as the SDK appears or disappears
from the project — you never edit Player Settings by hand, and removing the SDK cleans them up again. When
it changes anything it says so in the console: "Firebase SDK detection updated the scripting defines."

## Pick the backend

Open your `BeastySaveManager` and set **Storage** to **Firebase Firestore** (`firestore`) or
**Firebase Realtime Database** (`realtime-db`). That is the only decision:

- The save/load calls now go to the cloud, per user, asynchronously. Save Mode locks to `Asynchronous`.
- Local files stop being written; `Folder`, `Extension` and `DataPath` are disabled in the editor.
- Nothing else in your scene changes — buttons wired to `SaveAll`/`LoadAll` keep working.

Which of the two? **Firestore** if you are starting fresh — its layout (documents and subcollections)
matches the save structure naturally. **Realtime Database** if your project already lives there. The save
system behaves identically on both.

## Who is signed in

The Auth module registers a user provider that resolves identity in this order:

1. **A user your game already signed in** — email, Google, anything Firebase Auth supports — is used
   untouched. The save system never signs a user out or changes their session.
2. Otherwise, the first save **signs in anonymously** and that uid owns the saves from then on.

Anonymous sign-in must be enabled in the Firebase console (Authentication ▸ Sign-in method). If it is
not, saves fail with the typed error `AuthRequired` and the message "Anonymous sign-in did not produce a
user. Is Anonymous auth enabled in the Firebase console?".

To control identity yourself, assign `BeastySaveUsers.Provider` — see
[custom-backends.md](/docs/beasty-save-system/advanced/custom-backends/).

## Where the data lives

![The Firestore console showing a save: the head document and its chunks subcollection](/docs-images/beasty-save-system/save-firebase-console-data.png)

Both backends store the same envelope text a file save would write — checksum, versions, metadata,
optional encryption — under the signed-in user:

**Firestore.** One *head* document per slot at `users/{uid}/saves/{slot}`, holding the chunk count and a
server timestamp. The envelope text lives in a `chunks` subcollection, split into pieces of up to 500,000
characters, because Firestore caps a document at 1 MiB. Backups mirror the same layout under
`users/{uid}/backups/{slot}`. Writes are batched, so a save replaces its chunks atomically.

**Realtime Database.** The envelope lives as a plain string at `users/{uid}/saves/{slot}` (with the slot
name escaped for the characters Realtime Database forbids in keys), next to a server timestamp. A small
name index under `users/{uid}/slots` keeps `ListSlotsAsync` cheap, and backups mirror the save node under
`users/{uid}/backups`.

## Security rules

The layout is per-user on purpose: write rules so **each uid can only read and write its own subtree**.
For Firestore:

```text
match /users/{uid}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

For Realtime Database:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

Without rules like these, any signed-in player can read — or overwrite — any other player's saves.

## When something goes wrong

The cloud failure modes are typed, like every other error:

- **`AuthRequired`** — no user could be resolved. Check that Anonymous auth is enabled, or that your own
  sign-in ran.
- **`NetworkError`** — the operation failed in transit, or a stored save is missing a chunk. Let the
  player retry.
- **`Corrupt`** — a Firestore head document without a valid chunk count. The stored data is incomplete or
  was written by something else.
- **`BackendUnavailable`** — the module did not compile. The SDK is missing, or the defines have not
  caught up yet (check the console for the detector's message).

At the **Verbose** logging level, every cloud operation logs the resolved user id, and Firestore reads say
whether the snapshot came from the server or from the SDK's **offline cache** — the first thing to check
when a device shows stale data. See [logging.md](/docs/beasty-save-system/guides/logging/).

## Testing against a real project

A live test suite (`BeastySaveSystem.Firebase.Tests`) ships with the asset and compiles only when the
Firebase SDK is installed **and** the `BEASTY_DEV_TOOLS` scripting define is set, like the rest of the
internal tests. It runs real Firestore round-trips — save, double-read freshness, anonymous sign-in,
corrupt-head detection — against the Firebase project your Unity project is configured for. Every awaited
step has a hard timeout that names the stalled step instead of hanging the Test Runner.

## See also

- [storage-backends.md](/docs/beasty-save-system/guides/storage-backends/) — the Storage dropdown, Save Mode and user identity
- [async-saving.md](/docs/beasty-save-system/guides/async-saving/) — the async API cloud backends require
- [results-and-errors.md](/docs/beasty-save-system/reference/results-and-errors/) — `AuthRequired`, `NetworkError` and the rest
- [logging.md](/docs/beasty-save-system/guides/logging/) — the Verbose diagnostics for cloud operations
- [encryption.md](/docs/beasty-save-system/guides/encryption/) — the envelope in the cloud is the same envelope
