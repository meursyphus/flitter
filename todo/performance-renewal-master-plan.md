# Performance Renewal Master Plan

## Goal

Make Flitter feel fast when the user changes state, rebuilds widgets, resizes the view, or animates structure.

This plan deliberately prioritizes:

1. `build -> reconcile -> layout -> paint` hot paths
2. large subtree updates and same-frame moves
3. invalidation isolation and retained rendering

This plan deliberately defers:

1. text engine deep optimization
2. paragraph caching / measurement algorithms
3. low-impact micro-optimizations that do not move user-visible latency

Text stays later on purpose. The current target is: "rebuild/change should feel obviously faster."

## Why batch instead of trickle

Recent history in this repo shows that the optimizations which helped most were not isolated micro-fixes but structural ones:

- PR #135: lazy element deactivation / GlobalKey reparenting
- PR #137: relayout boundaries
- PR #145: canvas repaint boundary compositing
- PR #140: restore baseline by reverting incorrect post-renewal changes

The lesson is straightforward:

- the good optimizations were real and materially helped
- they became hard to track because they were mixed with broader renewal changes
- re-landing them one by one is too weak for the intended impact

So this branch is the control plane for a **batched performance renewal**, not a one-issue-at-a-time cleanup.

## Flutter principles we should mirror

These are the Flutter-level mechanisms that directly matter for rebuild/change latency in Flitter:

1. Dirty element scheduling and scoped rebuilds in `BuildOwner.buildScope`
2. O(n) child reconciliation with keyed middle matching in `RenderObjectElement.updateChildren`
3. Lazy deactivation and same-frame element reuse via inactive pools and `GlobalKey` retake
4. Relayout boundaries that stop layout propagation
5. `sizedByParent`, `performResize`, and dry layout as layout fast paths
6. Repaint boundaries and retained layers for subtree paint isolation
7. Compositing bits updates so effects only pay layer cost when needed
8. Hit test result caching during active pointer sequences
9. Viewport/sliver virtualization so large trees are not fully built and laid out

Those are the "rendering engine people all know" optimizations that matter here.

## Existing Flitter issues mapped to the real engine work

### Core rebuild/change hot path

- #136 Recover cold mount performance after lazy deactivation / GlobalKey reparenting
- #125 Relayout Boundary & Layout Isolation
- #127 Opacity Peephole Optimization & Compositing Bits Update
- #123 Canvas Layer Compositing & Partial Repaint for Performance
- #128 Hit Test Result Caching & Gesture Arena

### Large tree scaling

- #130 Sliver & Viewport Virtualization for Large Lists

### Deferred for later

- #122 Text layout optimization: port pretext-style algorithms
- #129 Text Layout Caching & Paragraph Reuse

## What this branch is for

Branch: `perf-optimization-master-plan`

Purpose:

- hold the master plan
- be the merge target for larger performance batches
- avoid losing the thread again when an aggressive performance branch must be reverted or partially restored

Implementation should happen in dedicated worktree branches and merge back here first, not directly into `latest`.

## Delivery strategy

We should ship this in **two large waves** and **one deferred wave**, not in six tiny PRs.

### Wave 1: Framework Hot Path Renewal

This is the big batch that should immediately improve rebuild/change latency.

It should land together because the gains stack:

1. Build scheduling and rebuild scope tightening
2. O(n) child reconciliation
3. Lazy deactivation / inactive pool fast path fixes
4. Relayout boundary propagation stop
5. Dry layout and `sizedByParent` fast paths
6. Repaint boundary + retained layer correctness
7. Compositing bits / opacity peephole / layer-property-only updates
8. Hit test caching for active pointers

If only one or two of these land, the user still pays on the neighboring phase.

#### Wave 1 concrete work

##### A. Build / reconcile

- Narrow the GlobalKey reclaim path so non-keyed mounts stay cheap
- Keep same-frame reparenting, but make the fresh-mount path closer to Flutter's fast path
- Replace current quadratic-style child matching in `RenderObjectElement.updateChildren` with Flutter-style:
  - top sync
  - bottom sync
  - keyed middle reuse
  - forgotten child handling
- Avoid repeated `filter`, `includes`, and allocation churn in child diffing
- Preserve a stable slot model for moved children so render-object reattachment is shallow

Primary impact:

- lower cold mount cost
- lower update cost on large child lists
- more predictable rebuild time under reorder / keyed updates

##### B. Layout isolation

- Fully compute and honor relayout boundaries
- Stop `markNeedsLayout()` from propagating to root when the boundary should own the relayout
- Use `sizedByParent` and `performResize()` in all obvious candidates
- Push `computeDryLayout()` coverage through commonly reused layout render objects
- Add dry-layout cache invalidation rules that are explicit and cheap

Primary impact:

- much less ancestor relayout churn on local changes
- cheaper resize and box recomputation paths
- lower layout work after state toggles and animation changes

##### C. Paint / compositing

- Keep repaint boundaries as the unit of retained canvas repaint
- Finish the compositing-bits story so `Opacity`, `Transform`, `Clip*`, and future effects only composite when necessary
- Add peephole rules modeled after Flutter:
  - fully transparent: skip
  - fully opaque: direct paint
  - partial effect: layer path
- Support layer-property-only updates where subtree pixels do not need repaint
- Add picture/layer reuse rules and make detached-layer recovery robust

Primary impact:

- much faster animation and hover changes
- lower paint cost on unchanged siblings
- smaller frame spikes on structure-preserving updates

##### D. Interaction

- Cache hit test results for pointer-down sequences
- Reuse hit path during drag / active interaction
- Keep hover fresh, but avoid redundant work while pointer state is unchanged
- Leave full gesture arena design available, but prioritize hit test caching first

Primary impact:

- lower event handling overhead during interaction-heavy scenes
- less repeated tree walking under drag/hover patterns

#### Wave 1 acceptance criteria

- cold mount regains most or all of the regression described in #136
- local widget changes stop forcing obvious root-level relayout / repaint cascades
- animation-only changes show lower paint cost than current baseline
- no major visual regressions on Chromatic
- performance trace matrix becomes part of merge gating

### Wave 2: Large Tree Scaling

This wave is still important, but it is second because it helps "too many nodes" more than "every change feels slow."

#### Wave 2 concrete work

- Sliver constraints / sliver geometry protocol
- Viewport layout with remaining paint/cache extent
- `SliverList` / fixed-extent list
- on-demand child build
- scroll cache extent
- garbage collection / reuse of off-screen children

Primary impact:

- large lists stop paying full build/layout/paint for invisible content
- charts or inspector-like panels scale better with many children

### Wave 3: Deferred Text Engine Work

Keep deferred until the rest lands:

- paragraph reuse
- text measurement caches
- segment preparation
- intrinsic text caches

This work is real, but it should not block the "rebuild/change feels instant" renewal.

## Performance benchmark matrix

We should stop evaluating only one trace.

Every large performance branch should be tested against this matrix:

1. Cold mount benchmark
2. Warm rebuild benchmark with local subtree state change
3. Same-frame `GlobalKey` reparent benchmark
4. Resize benchmark
5. Hover / drag benchmark
6. Animation-only benchmark where structure is stable
7. Large-list / many-children benchmark

## Merge model

### Control branch

- `perf-optimization-master-plan`

### Execution branch for Wave 1

- `perf-renewal-wave-1`

### Worktree path

- `.worktree/perf-renewal-wave-1`

### Merge direction

1. plan and baseline live on `perf-optimization-master-plan`
2. implementation happens in `perf-renewal-wave-1` worktree
3. implementation merges into `perf-optimization-master-plan`
4. only after the batched branch is stable does it move toward `latest`

This prevents losing the performance thread again if part of the batch needs rollback.

## Recommended next move

Do **Wave 1** as a single performance renewal branch.

Not tiny issue-by-issue work.

Not text yet.

Not viewport first.

The correct next move is:

1. make `perf-optimization-master-plan` the integration target
2. spin `perf-renewal-wave-1` as a worktree branch
3. implement the framework/layout/paint invalidation stack together
4. compare against the benchmark matrix before proposing merge
