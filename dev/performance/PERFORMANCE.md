# Canvas engine performance, 2026-09-07

This work continues `84e6cb56`. It optimizes Canvas rendering, with SVG checks
for shared layout, text, reconciliation and scheduling changes. Results and raw
samples are in [canvas-2026-09-07.json](performance-history/canvas-2026-09-07.json).

## Changes

- **Linear text layout.** Paragraph lines accumulate width and maximum height
  as boxes are appended. Word wrapping and alignment no longer repeatedly sum
  a growing line. Long single lines change from quadratic to linear work.
- **Paint-only text updates.** Source-span indices connect measured boxes to
  resolved colors. Color changes reuse the paragraph, boxes, line breaks and
  positions; a conservative geometry check falls back to layout for custom spans.
  Canvas font/fill assignments are batched within a paragraph.
- **Bounded LRU measurement cache.** Evict the least recently used measurement
  instead of clearing all 8,192 entries. Frequently reused axis labels survive
  a stream of unique values. Font-load invalidation remains in place.
- **Tree-order Canvas traversal.** The z-order pass proves whether a subtree's
  paint order is monotone in tree order. Proven subtrees use a single DFS,
  avoiding painter sorting and ancestor replay on every repaint. Other trees
  retain the sorted path, with replay limited to ancestors that affect child state.
- **Retained effect layers.** Transform, clip and opacity effects survive
  repaint boundaries and recording changes. The sorted path also wraps retained
  pictures in ancestor effects. Custom painters save/restore their canvas state;
  decoration shadows no longer bleed into children. Flitter's existing per-draw
  opacity behavior is preserved, including when pictures overlap.
- **Resolved z-order comparison.** Numeric z-index changes only trigger picture
  re-recording when the final order changes. This matters for the ERD fixture,
  whose alignment guide increases its z-index on every rebuild.
- **Stable reconciliation.** Unchanged child identities/order retain the child
  array and render-child caches. Actual reorder/replacement invalidates layout
  and paint order, rather than silently retaining old pixels.
- **Transform caching.** Effective and inverse matrices are cached against
  transform/alignment geometry. Translation, rotation and scale changes invalidate
  paint instead of layout; singular matrices still reject hits.
- **Lifecycle correctness.** Dirty-list resorting revisits newly dirtied earlier
  elements, dirty descendants coalesce frame requests, dry/intrinsic caches
  invalidate even on already-dirty nodes, post-frame callbacks added during a
  flush survive, disposed runners cancel queued frames and remove hit listeners,
  and hover results invalidate after frame updates/scrolls. Trace measures remain
  available while private timing marks are released.

## Measurements

The grid benchmark uses 100 labels in ten independent row repaint boundaries.
Each scenario uses three fresh browser contexts, ten warmup frames, and 40
measured frames per context. Work counters run separately from timings.
Every tick must produce exactly one build, layout, paint, draw and finalization
measure. `total` means **engine CPU time** (build + drawFrame + finalizeTree),
not browser rasterization, GPU presentation or end-to-end FPS.

The machine was also doing other work. Small elapsed-time differences are not
reliable; deterministic work counts and pixels are the regression gates. Both
the earlier and final optimized text runs are retained in the results file.

| Workload | Before | After | Meaning |
| --- | ---: | ---: | --- |
| Long text, 1,500 repeated phrases | 389.3 ms | 9.6 ms earlier / 2.7 ms final | Quadratic reductions removed; timings vary with machine load |
| Grid, all text colors, paint visits/tick | 1,200 | 520 | 57% fewer visits |
| Grid, one text color, paint visits/tick | 120 | 52 | Only its retained row repaints |
| Grid, warm color update | repeated line breaking | zero line breaking/measureText | Existing geometry is reused |
| Grid, warm paint/transform/opacity | — | zero canvas allocation and zero layout | Tested after warmup |
| ERD Canvas, all table fields, frame median | 4.3 ms | 3.8 ms | Paired, same fixture and machine |
| ERD Canvas, all table fields, paint median | 2.1 ms | 1.6 ms | Paired paint phase |
| ERD Canvas, one table field, frame median | 2.75 ms | 2.5 ms | Paired engine frames |
| ERD Canvas, identity, frame median | 2.0 ms | 1.9 ms | Small difference; no repaint in the instrumented path |

The old synthetic reorder/transform/opacity cases failed to update the picture.
Their short timings are retained as diagnostic data, **not** as valid performance
baselines. New tests require a visible change, then compare updated pixels with
a fresh scene. The old ERD test also had a hydration race: a click could occur
before its Svelte handler attached. Its mount button now waits for hydration.

## Run the checks

```sh
# Strict core and benchmark type checks, unit tests, engine/browser regressions
pnpm test:engine

# Canvas timings and raw samples, one worker to avoid self-contention
pnpm perf:engine temp/perf-results/my-run

# Real ERD update benchmark, both renderers
pnpm perf:rerender --note 'describe the change' --workers=1

# All chart stories, both requested renderers, screenshots and runtime errors
pnpm --dir dev/performance exec playwright test --config playwright.chart-render.config.ts
```

For an A/B, archive/copy the baseline core to a separate directory and point
`FLITTER_PERF_CORE_SOURCE` at its absolute `src` path. The Vite benchmark then
compiles the **same current fixtures** against that core. Dependencies must be
resolvable from the archived core. This avoids checking out/stashing the user's
work. Do not run builds or concurrent benchmarks while collecting timings.

The browser regression suite covers identity, sparse/broad paint, text changes,
resize, keyed reorder, insertion/removal, transform, opacity, actual versus merely
numeric z-order changes, clips around retained pictures, custom paint isolation,
zero opacity, DPR 2, hover/click after reorder, decoration shadows and disposal.

## Visual review and existing suite limitations

Strict core/fixture type checks, 32 unit tests and 39 engine/interaction browser
tests passed. Re-running the new reorder, transform, opacity and shadow-state
tests against the archived baseline reproduced all four failures; the optimized
engine passes them. These are actual regression reproducers, not screenshot
baselines generated from the new implementation alone.

The chart sweep rendered 41 stories through SVG and Canvas (82 surfaces).
Chromatic [build 152](https://www.chromatic.com/build?appId=65f00810b3cff25c69b9afd3&number=152)
tested 119 stories and captured 118 snapshots. Its one reported change is
`AnimatedContainer / Basic`: the unwanted Canvas shadow on child text disappears,
matching SVG. The comparison was inspected in Chromatic and a dedicated regression
test now checks child canvas shadow state. The snapshot remains unaccepted;
Chromatic's nonzero exit for a visual change is preserved.

The full performance app type check includes unrelated broken fixtures and mixed
source/dist chart types (1,002 errors in the attempted full check). The old
theme-toggle browser test targets a button absent from the test app's current
home page. `test:engine` explicitly checks the engine and new fixture types plus
relevant interactions, without pretending those unrelated suites pass.

## Implementation references

- Flutter [TextPainter.layout](https://api.flutter.dev/flutter/painting/TextPainter/layout.html):
  preserve paragraph geometry and defer paint-only work.
- Flutter [PaintingContext.pushTransform](https://api.flutter.dev/flutter/rendering/PaintingContext/pushTransform.html),
  [pushOpacity](https://api.flutter.dev/flutter/rendering/PaintingContext/pushOpacity.html),
  and [pushClipPath](https://api.flutter.dev/flutter/rendering/PaintingContext/pushClipPath.html):
  separate canvas-state effects from retained pictures and reuse layer objects.
- Flutter [Element.updateChildren](https://api.flutter.dev/flutter/widgets/Element/updateChildren.html):
  match stable prefixes/suffixes and preserve child identity through reconciliation.
- Chrome [performance measurement reference](https://developer.chrome.com/docs/devtools/performance/reference/):
  distinguish engine instrumentation from the browser's full rendering pipeline.
