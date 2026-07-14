# Subgraphs

A subgraph is a graph inside a node. You use it to fold a stretch of story into a single box on the parent
canvas, and to call that stretch from more than one place.

## Why

Three cases keep coming up:

- **A reusable encounter.** The bandit ambush happens on three different roads. Write it once. Each of the
  three roads has a SubGraph Node that calls it, and each routes the outcome its own way.
- **A chapter.** Chapter 2 is forty nodes. It does not belong on the same canvas as chapters 1 and 3. Make it
  a subgraph and the top-level graph becomes readable: five boxes and the wires between them.
- **A self-contained scene with a result.** A combat, a negotiation, an exam. The scene decides something —
  won, lost, fled — and the story outside needs to know which, without caring how.

The thing a subgraph gives you that a plain group of nodes does not is the **outcome**: a single word handed
back to the caller, which the caller routes on.

## Creating a subgraph

Right-click a node in the graph and choose **`Create Subgraph`**. The node now owns a nested graph, and the
menu item on it becomes **`Open Subgraph`**.

You will normally do this on a **SubGraph Node**, because that is the node type that knows how to route an
outcome. (Any node can carry a nested graph, but only a SubGraph Node calls one and branches on what comes
back.)

## Navigating in and out

- **Open the subgraph**: right-click the node and choose `Open Subgraph`, or press the `open subgraph` button
  on the node itself.
- **Know where you are**: a breadcrumb appears in the Story tab toolbar showing the path you drilled down.
- **Go back up**: the **`↥ Up`** button next to the breadcrumb.

Inside, it is the same canvas with the same seven node types and the same rules. It has its own entry node,
and playback of the subgraph starts there.

## The Return node

A subgraph ends at a **Return Node**. It is a terminator: it has no output port, because control goes back to
the caller.

It has two fields:

| Field | What it does |
|---|---|
| **Outcome key** | The word handed back to the caller: `win`, `refused`, `fled`. You choose it. |
| **Effects** | Variable changes applied on the way out — the same `variable, operation, value` rows as a choice option. |

The effects are how a subgraph reports *what changed*; the outcome is how it reports *what happened*. A
combat subgraph might return the outcome `win` and, in its effects, add 20 gold and set `bandits_beaten` to
true.

A subgraph can have as many Return nodes as it has endings. They can all return different outcomes, or two
can return the same one.

## Routing the outcome

Back in the parent graph, select the SubGraph Node. It has:

- A list of **outcome routes**, added with the `+ outcome` button. Each is an outcome key plus a port. Type
  the key exactly as the Return node spells it, then wire the port to where that outcome should continue.
- A **`fallback →`** port, taken for any outcome you did not route — including an empty one.

> **Warning**
> The fallback is not optional. If a Return node returns `fled` and you only routed `win` and `lost`, the
> story goes to the fallback. If the fallback is unwired, the story stops. Wire it, even if it just leads to
> the same node as the most likely outcome.

## A worked example

The player can be ambushed on the north road, the south road, and outside the mill. All three are the same
fight.

**1. Build the fight once.**

On the parent canvas, create a SubGraph Node and name it `Ambush`. Right-click it, `Create Subgraph`, then
`Open Subgraph`.

Inside, build the fight as normal nodes: a Dialogue Node that sets the scene, a Choice Node with "Fight",
"Talk your way out" and "Run", and the dialogue nodes each leads to.

**2. End each path with a Return node.**

Three Return nodes:

| Return node | Outcome key | Effects |
|---|---|---|
| After winning | `win` | `gold += 20`, `toggle bandits_beaten` |
| After talking them down | `talked` | `maya.trust += 1` |
| After running | `fled` | `toggle coward` |

Wire the last dialogue node of each path into its Return node.

**3. Come back up and route.**

Press `↥ Up`. Select the `Ambush` node and add two outcome routes:

- `win` -> the node where the road continues, with the loot.
- `talked` -> the node where the road continues, and the bandits wave.

Leave `fled` unrouted. Wire `fallback →` to the node where the player wakes up back at the previous village.
Now `fled` — and any outcome you add later and forget to route — lands somewhere sane.

**4. Call it from the other two places.**

On the south road and outside the mill, create a SubGraph Node each, and point each one's `subGraph` at the
same graph asset. Each of the three callers routes `win` and `talked` to *its own* continuation, because the
routes live on the caller, not on the subgraph. The fight is written once; the aftermath is local.

The variables the fight changed — the gold, the flags, the trust — are in the one shared store, so they are
visible to every condition everywhere afterwards, and they are saved and rewound with everything else.

## See also

- [The story graph](story-graph.md) — the SubGraph Node and the Return Node in the node reference.
- [Choices and decisions](choices-and-decisions.md) — conditions and effects, which Return nodes reuse.
- [Transitions](transitions.md) — leaving the novel entirely, which is a different thing from a subgraph.
- [Variables and conditions](../world/variables-and-conditions.md) — the store a subgraph's effects write to.
