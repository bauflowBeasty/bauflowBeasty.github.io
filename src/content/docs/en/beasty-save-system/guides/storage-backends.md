---
title: "Storage backends"
description: "Where saves go: local files by default, a cloud database when you pick one, and per-user saves either way. The Storage dropdown and Save Mode, explained."
---

Every save call goes through a **storage backend**: the thing that actually keeps the text. By default
that is the local file system — the folder, the `.bak` files, everything the other guides describe. Pick a
different backend and the same calls, the same buttons and the same slot screen write to a database in the
cloud instead. This page explains how to pick one, what changes when you do, and whose saves they become.

## The Storage dropdown

![The Storage dropdown on the Beasty Save Manager, listing the registered backends](/docs-images/beasty-save-system/save-storage-dropdown.png)

Select your `BeastySaveManager` (or open the Save Manager window) and look at **Storage**. It lists every
backend registered in the project:

| Entry | Id | Ships with |
|---|---|---|
| **Local file** | `local` (stored as an empty `StorageId`) | The asset. Always present. |
| **Firebase Firestore** | `firestore` | The asset, compiled when the Firebase SDK is present. |
| **Firebase Realtime Database** | `realtime-db` | The asset, compiled when the Firebase SDK is present. |

With no Firebase SDK in the project the dropdown shows only **Local file** — the cloud entries appear by
themselves once the SDK is imported. See [firebase.md](/docs/beasty-save-system/guides/firebase/) for that
setup, and [custom-backends.md](/docs/beasty-save-system/advanced/custom-backends/) for registering a
backend of your own.

If the stored id names a backend that is **not** available — the SDK was removed, the module did not
compile — the dropdown shows it as `<id> (not available)` with a warning, and every save and load fails
with the typed error `BackendUnavailable` until you fix the module or pick another backend. Nothing fails
silently.

From code, the choice is a field on the settings:

```csharp
var settings = new BeastySaveSettings { StorageId = "firestore" };
```

There is also `BeastySaveSettings.Storage` — a backend **instance** assigned from code, not serialized —
which wins over `StorageId` when set. Use it for tests and for backends you construct yourself.

## What changes with a cloud backend

The API does not change. What changes is underneath:

- **Saves are stored per user**, not per machine. A player signs in (anonymously by default, with
  Firebase) and their saves live under their user id — on any device.
- **Everything is asynchronous.** A database round-trip cannot block the main thread, so the synchronous
  API refuses with `BackendRequiresAsync` and the async twins do the work. The manager's UnityEvent entry
  points route themselves — see Save Mode below.
- **The file fields stop applying.** `Folder`, `Extension` and `DataPath` describe local files; the editor
  disables them and says so. `BeastySave.GetFolderPath`/`GetSlotPath` keep describing the local layout
  only.
- **Slot browsing in the Save Manager window is local-only.** A cloud slot list depends on who is signed
  in; inspect cloud saves in the backend's own console.

Backups still exist — a cloud backend keeps the previous version of each slot in its own storage, and
`RestoreBackupAsync` restores it — and the envelope is byte-for-byte the same one a file save writes:
checksum, versions, optional encryption, migrations on load.

## Save Mode

The manager's UnityEvent-friendly entry points — `SaveAll`, `LoadAll`, `DeleteSlot`, the ones a uGUI
button calls — need a policy, because a button cannot `await`. That policy is **Save Mode**, next to the
Storage dropdown:

| Mode | What it does |
|---|---|
| `Synchronous` (default) | Blocks until done, exactly as before. |
| `Asynchronous` | Runs in the background; the outcome arrives via `SaveCompleted`/`LoadCompleted` and `LastSaveResult`. |

Cloud backends are asynchronous by nature, so with one active the dropdown is locked to `Asynchronous`.
If a scene configured for local files switches to a cloud backend while Save Mode still says
`Synchronous`, the operation is routed asynchronously anyway — nothing is ever lost — and a warning is
logged once per session:

> Save Mode is Synchronous but the active storage backend is asynchronous-only; routing through the
> asynchronous path so the operation is not lost (results arrive via SaveCompleted/LoadCompleted). Set
> Save Mode to Asynchronous to acknowledge this.

Code callers are not affected by Save Mode: `SaveAllNow`/`LoadAllNow` and their `*NowAsync` twins choose
explicitly. See [async-saving.md](/docs/beasty-save-system/guides/async-saving/).

## Whose saves are these

A per-user backend needs to know who the user is. That is a **user provider** — a small object answering
one question, "what is the current user's id?".

- With the Firebase modules in the project, a provider registers itself: an already signed-in Firebase
  user is used untouched, and otherwise the first save signs in **anonymously**. Zero configuration.
- From code, assign `BeastySaveUsers.Provider` to control identity yourself — your own account system,
  a platform id. A dev-assigned provider wins over the module default.
- With no provider at all, a cloud save fails with the typed error `AuthRequired` — a remote backend
  refuses to guess whose save it is writing.

The manager's inspector shows the resolved provider and the current user in its status card, so you can
see at a glance who the saves will belong to.

**Local files can be per-user too.** Turn on `ScopeByUser` and local saves land in a per-user subfolder —
`<Folder>/<userId>/` — whenever a provider is registered. Useful for shared machines, and for keeping the
local layout consistent with the cloud one.

## The errors this page adds

Four typed errors exist because backends do:

| Error | When |
|---|---|
| `BackendRequiresAsync` | A synchronous call reached an asynchronous-only backend. Use the async twin. |
| `BackendUnavailable` | `StorageId` names a backend whose module did not compile. |
| `AuthRequired` | A remote backend could not resolve a user. |
| `NetworkError` | The cloud operation failed in transit. |

Each is diagnosed in [results-and-errors.md](/docs/beasty-save-system/reference/results-and-errors/).

## See also

- [firebase.md](/docs/beasty-save-system/guides/firebase/) — setting up the two cloud backends
- [async-saving.md](/docs/beasty-save-system/guides/async-saving/) — the async API a cloud backend requires
- [settings.md](/docs/beasty-save-system/guides/settings/) — `StorageId` and `ScopeByUser` among the rest
- [custom-backends.md](/docs/beasty-save-system/advanced/custom-backends/) — writing a backend of your own
- [results-and-errors.md](/docs/beasty-save-system/reference/results-and-errors/) — the four backend errors
