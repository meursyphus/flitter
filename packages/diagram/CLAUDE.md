# Diagram Package Guidelines

`flitter-diagram` is a node/edge editor with React Flow's interaction model,
built on `flitter-core`. Keep these layers separate:

```
src/headless/flow/   Pure behaviour: FlowController state machine, scene render
                     objects, gesture wiring. No colours, fonts or shapes.
src/shared/          Geometry, edge path math, change helpers, layout algorithms.
                     Plain functions with no widget imports except `Path`.
src/styles/default/   React Flow look. Everything visual lives here as `custom`
                     builders; it must only use the headless public API.
```

## Headless rules

- Interaction wiring (GestureDetector) lives in `flow.ts`; style parts never add
  their own hover/click handlers for nodes, edges or handles. Use the args
  (`selected`, `hovered`, `dragging`, `isConnectionCandidate`, ...) instead.
- The controller never notifies during `configure()` or `setPaneSize()`
  because they run inside a build/layout. Everything else notifies once per
  change.
- Node sizes are measured by `RenderFlowScene` and reported post-frame through
  `setNodeDimensions`; never read render objects from builders.
- Handles are declared (`HandleSpec`), not measured. Edge anchors are derived
  from the declared handle geometry.
- Scene items are built in paint order and hit tested in reverse; never use
  `ZIndex` inside the scene.
- Rebuild locality: node/edge widgets are cached per id in `flow.ts` and rebuild
  from `controller.nodeSignal(id)` / `edgeSignal(id)` / `connectionSignal`. Only
  structural or global changes may call `notifyListeners()`; per-item changes
  must notify their signal. `styleVersion` invalidates every cached widget.
- Overlays that hang outside their anchor (toolbars) go through `FlowSceneGroup`
  + `FlowSceneItem` fractional anchors; a `Positioned` wrapper gates hit tests by
  its own bounds.

## Distribution

- `src/engine.ts` is the public engine surface re-exported as `flitter-ui/diagram`.
- `registry/index.mjs` exposes `src/styles/<style>` to the CLI; style files may
  import the engine only through relative paths (rewritten to `flitter-ui/diagram`
  on install) and `flitter-core` (rewritten to `flitter-ui`).
- After changing a style, run `pnpm --dir shared/diagram-presets run sync` and
  `pnpm --dir packages/flitter test:install`.

## Style rules

- Colour/size tokens belong in `config.ts`; parts read them from `context.config`.
- Visual numbers copy React Flow's `style.css` unless a comment says otherwise.
- Draw with `ShapePaint`/`IconPaint` so both renderers stay in sync.

## Verification

```bash
pnpm --dir packages/diagram typecheck
pnpm --dir dev/performance exec vitest run src/diagram
pnpm story:dev     # Diagram/* stories render SVG and Canvas side by side
```

## Interaction surface

`Flow({ nodes, edges, custom, config, viewport, interaction, can, on, ... })`
groups settings and events; presets are `editor`, `viewer`, and `whiteboard`.
Viewer permits click selection; `select.box` gates box/selection-rect dragging.
`controller.zoom` is current; `nodeTypes.*.lod` opts nodes into breakpoint-only
zoom notifications. No LOD means no node rebuild on zoom.

Controller owns history, clipboard, context menus, editing, groups, guides,
waypoints, collapse and arrangement helpers. History marks gesture boundaries;
`run(..., { history: "ignore" | "merge" })` controls programmatic grouping.
Guide overlays use `guidesSignal`; node/edge state uses per-item signals.
`contextMenu` renders above panels in screen space; guides and edge handles
stay in flow space. Guide builder coordinates are local to their overlay;
`controller.guides` remains in flow coordinates. Toolbars use `nodeTypes.*.toolbar`.
`EditableLabel` binds the core TextField to label data; the engine owns no text.

`FlowDiagram` supplies `defaultCustom` and `DefaultFlowConfig`.
Install with `flitter add flow-diagram`; sync generated presets after style edits.
