---
title: "FAQ"
description: "No. The Beasty Console listens alongside Unity's Console, on the same log stream. Both windows show the same entries; the Beasty one classifies them by level"
---

## Does it replace Unity's Console?

No. The Beasty Console listens alongside Unity's Console, on the same log stream. Both windows show the
same entries; the Beasty one classifies them by level and lets you filter and search. Keep Unity's Console
open if you like it — nothing conflicts.

## Does it write a log file?

No. It calls `UnityEngine.Debug` and nothing else. Persistence is whatever Unity already gives you, which
on a desktop build is `Player.log`. If you need your own file, write it from your own code.

## Does it cost performance in a release build?

Yes, unless you take steps. The logging methods are not stripped: the call is made and the message is built
even when `IsEnabled` is false. This is the sharp edge of the package and it is documented in full on
[Release builds](/docs/beasty-console/guides/release-builds/). Read that page before you scatter log calls through a hot loop.

## Do I need the other Beasty packages?

No. The logger references nothing and works on its own. If you also own Beasty Visual Novel or Beasty Save
System, see [Working with the other Beasty packages](/docs/beasty-console/guides/beasty-integration/).

## Can I add my own level?

Not as a new level. The eleven levels are fixed: each has a tag, a colour and a filter toggle in the
console, and they are matched by the classifier.

What you can do instead:

- use the `LogColor` overload of `Log` to colour a message without a level's tag;
- write a thin static facade over the API that prefixes your own tag and holds your own switches, and log
  through that. Beasty Visual Novel does exactly this. See
  [Logging](/docs/beasty-console/guides/logging/) and [Working with the other Beasty packages](/docs/beasty-console/guides/beasty-integration/).

## Why is my message missing a piece?

Because it contained angle brackets. The console strips everything between `<` and `>` from the display, so
that rich-text colour markup does not show up as literal text. A message like
`Deprecated call: GetComponent<Rigidbody2D>` appears in the row as `Deprecated call: GetComponent`.

The message reached Unity intact — only the display is affected. If the brackets matter, write the message
without them. See [The Beasty Console window](/docs/beasty-console/guides/console-window/).

## Why did my logs disappear?

Most likely a script recompile. A domain reload clears the console's list, so everything logged before the
compile is gone.

The other two candidates: Clear on Play is enabled, and you entered Play Mode; or the level's filter toggle
is off, so the entries are there but hidden. The counter on the toggle keeps counting either way.

## Why is the window under the Beasty VN menu?

`Tools > Beasty VN > Diagnostics > Console` is a shared menu path, not a dependency. The logger does not
reference Beasty Visual Novel and works without it.
