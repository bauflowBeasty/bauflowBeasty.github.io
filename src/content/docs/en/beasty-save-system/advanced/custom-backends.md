---
title: "Custom storage backends"
description: "Implement IBeastySaveStorage, register it in BeastySaveStorageRegistry, and the whole save pipeline — envelope, checksum, encryption — runs on your storage."
---

A storage backend moves envelope **text** in and out of slots — nothing more. Integrity is the pipeline's
job: by the time your backend sees a save it is already a finished envelope (checksum, versions, optional
encryption), and everything read back goes through the same validation a file gets. This page is the
contract for writing one: the interface, the registration, and the user-identity seam.

## The interface

```csharp
namespace Beasty_SaveSystemCore
{
    public interface IBeastySaveStorage
    {
        bool SupportsSynchronous { get; }

        // Sync — only called when SupportsSynchronous is true
        void Write(SlotRef slot, string text, bool rotateBackup);
        string Read(SlotRef slot);              // null = slot does not exist
        bool Exists(SlotRef slot);
        bool Delete(SlotRef slot);              // removes slot AND backup; true if the slot existed
        string[] ListSlots(SlotRef scope);      // scope carries user/location, Slot is null
        string ReadBackup(SlotRef slot);        // null = no backup
        bool BackupExists(SlotRef slot);

        // Async — every backend implements these
        Task WriteAsync(SlotRef slot, string text, bool rotateBackup);
        Task<string> ReadAsync(SlotRef slot);
        Task<bool> ExistsAsync(SlotRef slot);
        Task<bool> DeleteAsync(SlotRef slot);
        Task<string[]> ListSlotsAsync(SlotRef scope);
        Task<string> ReadBackupAsync(SlotRef slot);
        Task<bool> BackupExistsAsync(SlotRef slot);
    }
}
```

The rules a backend lives by:

- **`SupportsSynchronous` is the honesty flag.** Return `false` and the synchronous `BeastySave` API
  answers `BackendRequiresAsync` instead of calling your sync members — which may then simply throw
  `NotSupportedException`, because nothing will call them. The manager's Save Mode routing reads this flag
  to decide when a `Synchronous` Save Mode must be forced onto the asynchronous path.
- **A missing slot is `null`, not an error.** `Read` and `ReadBackup` return null when there is nothing
  there; the pipeline turns that into `FileNotFound`.
- **`rotateBackup` is your cue to keep the previous version.** When true, the text currently stored in the
  slot becomes the backup before the new text lands. `Delete` removes the slot **and** its backup.
- **Typed failures are thrown, once.** Throw `BeastySaveStorageException(code, message)` to surface a
  typed error — `AuthRequired`, `NetworkError`, whatever fits. Any **other** exception is treated as an
  `IoError` by the pipeline. Either way the caller gets a result, never an exception.

## SlotRef

Every member receives a `SlotRef` — where a save lives, backend-agnostic:

```csharp
public readonly struct SlotRef
{
    public string Slot      { get; }  // null in scope operations (ListSlots)
    public string UserId    { get; }  // null when unscoped
    public string Folder    { get; }
    public string Extension { get; }
    public string DataPath  { get; }
}
```

Your backend decides how to materialize it: the local backend builds a file path from `DataPath`, `Folder`
and `Extension` (one level deeper when `UserId` is set); the Firebase backends build a database path like
`users/{uid}/saves/{slot}` and ignore the file fields. Use what fits your storage and ignore the rest.

## Registration

```csharp
BeastySaveStorageRegistry.Register("my-backend", "My Backend",
    () => new MyBackendStorage());
```

- The id is what `BeastySaveSettings.StorageId` stores; the display name is what the **Storage** dropdown
  shows. Registration is idempotent — the last call for an id wins — and `"local"`
  (`BeastySaveStorageRegistry.LocalId`) is always present.
- Register from module initialization so the backend exists before anything saves, and survives domain
  reloads:

```csharp
internal static class MyBackendModule
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
#if UNITY_EDITOR
    [UnityEditor.InitializeOnLoadMethod]
#endif
    static void Init() =>
        BeastySaveStorageRegistry.Register("my-backend", "My Backend",
            () => new MyBackendStorage());
}
```

Once registered, the backend appears in the Storage dropdown automatically — the dropdown is driven by
the registry (`DescribeAll()`, "local" first, the rest ordered by id). A `StorageId` that is not
registered fails every call with `BackendUnavailable`, and the editor warns in the dropdown and the status
card.

For tests, skip the registry: assign an instance directly to `BeastySaveSettings.Storage`. It wins over
`StorageId` and is not serialized.

## Whose saves are these: the user seam

Per-user storage needs an identity source. That is `IBeastyUserProvider`:

```csharp
public interface IBeastyUserProvider
{
    // Ensures a session exists (e.g. anonymous sign-in) and returns the user id.
    // Throws BeastySaveStorageException(AuthRequired, ...) when a session cannot be established.
    Task<string> GetUserIdAsync();

    // The current user id, or null when no session exists yet. Never signs in.
    string CurrentUserId { get; }
}
```

`BeastySaveUsers` holds two layers, dev over module:

```csharp
BeastySaveUsers.Provider = new MyAccountProvider(); // dev override — wins, reset between Play sessions
BeastySaveUsers.SetDefault(provider);               // module default — persists, idempotent
```

How the pipeline uses it:

- The **async path on a remote backend** calls `GetUserIdAsync()` — this is where anonymous sign-in
  happens. No provider at all fails the call with `AuthRequired`.
- The **sync path** (local files with `ScopeByUser`) reads `CurrentUserId` only — it never signs anyone
  in, and a null id means the save is unscoped.

The Firebase Auth module is exactly this: a provider registered with `SetDefault` that reuses an existing
Firebase session or signs in anonymously. Your provider replaces it by assigning
`BeastySaveUsers.Provider`.

## What you do NOT implement

The pipeline keeps owning everything above the text: slot-name validation, the envelope, the SHA-256
checksum, encryption, `DataVersion` migrations, strict-versus-tolerant mapping, logging, and the typed
results every call returns. A backend cannot corrupt a save into loading — a bad read fails the same
checksum gate a tampered file would. Write the eight async members, be honest in `SupportsSynchronous`,
and the rest of the system — including the editor UI — works with your storage unchanged.

## See also

- [Storage backends](/docs/beasty-save-system/guides/storage-backends/) — the user-facing view of backends
- [Firebase](/docs/beasty-save-system/guides/firebase/) — the two backends that ship with the asset
- [Results and errors](/docs/beasty-save-system/reference/results-and-errors/) — the typed errors a backend surfaces
- [Save file format](/docs/beasty-save-system/reference/save-file-format/) — the envelope your backend stores
- [BeastySave API](/docs/beasty-save-system/reference/api-beastysave/) — the facade in front of all of it
