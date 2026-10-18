# Diagram: headless editor + gallery (work guide)

Owner/conductor: Fable. Engine + examples: Astra (Codex). Docs: Opus.
Status legend: `[ ]` todo, `[~]` in progress, `[x]` done, `[!]` blocked.
Research evidence lives in `todo/diagram-research.md`. Do not restate it; cite it.

## 0. Why we are redoing this

PR #169 only rewrote docs. The product shape it documents is still React Flow's:

- `FlowProps` = ~40 behaviour flags + ~40 callbacks flattened on one object. Chart's shape is `{ data, custom, config }`.
- The built-in interaction set equals React Flow core. Everything real products rely on and React Flow sells as Pro (undo/redo, copy/paste, context menu, helper lines, grouping by drag, waypoints, inline edit, collapse) is missing, so "we pre-plan the interactions, you own the pixels" is not true yet.
- Gallery pages carry five prose blocks each; chart gallery pages carry zero. Diagram API pages total ~17,000 words; chart's are data tables.
- A `--style xyflow` dimension exists although we want one default theme.

## 1. Goals (definition of done)

- G1 **Chart-shaped API.** `Flow({ nodes, edges, custom, config, layout, viewport, interaction, can, on })`. No flat flag soup. Interaction config is grouped, has presets, and every default is the "editor" behaviour below.
- G2 **Editor-grade interactions are engine defaults.** Every row marked D in §3 works with zero config; every B row works with one flag. Every visual those gestures need is a `custom.*` builder slot or a builder arg. No colours, fonts or shapes in `src/headless` or `src/shared`.
- G3 **One theme, copied source.** `flitter add flow-diagram` copies `styles/default` (no `--style`). Users edit the copy; the engine stays in `flitter-ui/diagram`.
- G4 **Practical gallery.** 12 examples (§5) that echo shipping products, each showcasing 2–3 built-in interactions. A gallery page = title, interaction chips, install command, live stage, code tabs, related. No paragraphs.
- G5 **Docs without reading.** Chart structure (§6). Whole diagram section ≤ 2,500 words of prose outside code and tables. Every interaction is shown by a live micro-demo plus the snippet that enables it, never by a paragraph.
- G6 **Green.** `pnpm diagram:typecheck`, `pnpm --dir packages/diagram lint`, `pnpm diagram:test` (vitest + Playwright, SVG and Canvas, mouse and touch), `pnpm --dir shared/diagram-presets run sync`, `pnpm --dir packages/flitter test:install`, `pnpm --dir docs build`. Drag still rebuilds one node (perf history in `dev/performance/performance-history`).

## 2. Design rules (decided)

1. Engine owns every gesture that needs hit testing, pointer capture or per-frame state. Builders receive that state as args. The data mutation behind each gesture is also a controller method so recipes reuse it without the gesture.
2. Visuals are never engine code: handles, guides, waypoint pins, context menus, selection boxes are all `custom.*` slots.
3. Interaction is declared, not wired: `interaction` object + `can()` predicate + `on` events. No tool classes, no plugin bus in the public API.
4. Undo granularity follows gesture boundaries (mark on drag/connect/resize/reconnect/waypoint/edit/delete start), snapshot `{ nodes, edges }`.
5. Edge waypoints are data (`edge.waypoints`), route = pure `router(waypoints, endpoints)`, path = pure `connector(points)`; `edge.adjusting: "none" | "ends" | "stretch"` says what happens to bends when nodes move.
6. Overlap is never auto-resolved during a drag tick. Bring-to-front on select/drag is default; `drag.overlap: "push" | "reject"` runs at drag end; `isOverlapping` is a builder arg.
7. One permission predicate `can(gesture, target)` beats per-node flag sprawl. Per-node flags (`draggable`, `deletable`, ...) stay for data-driven cases; `can` wins when provided.
8. Vetoes are `on.before*` hooks returning `false | patched`. Observers are `on.*`.
9. Pane-drag meaning is one option (`pane.drag: "pan" | "select"`) because products split 50/50 (n8n and whiteboards select, Langflow/Retool/ComfyUI pan).
10. Preset names: `"editor"` (default), `"viewer"` (pan/zoom/hover/click only), `"whiteboard"` (pane drag selects, guides on, text edit on, snapping off).

## 3. Interaction tiers

D = engine default ON. B = built in, one flag/field turns it on. R = recipe shown by a gallery example on top of controller methods. S = out of scope.

| Interaction | Tier | Engine piece | Builder surface |
|---|---|---|---|
| Pan (drag / Space / scroll mode), zoom (wheel, pinch, dblclick), fit, auto-pan, extents | D | `pane.*`, `viewport.*` | `background` args get `viewport` |
| Touch: one-finger drag, two-finger pan/pinch, long-press = context menu | D | core `HitTestDispatcher` (long-press added) | – |
| Node drag: threshold, multi-drag, parent-relative, extent, revert on cancel | D | `drag.*` | node args `dragging` |
| Select: click, toggle key, box select (full/partial), selection rect, Esc clears | D | `select.*` | `selectionBox`, `nodesSelectionRect`, args `selected` |
| Hover + neighbour state | D | controller computes `hoveredId` neighbours | args `hovered`, `isNeighbour` on node and edge |
| Bring to front on select/drag | D | paint order | – |
| Connect: drag from handle, radius snap, strict/loose, validate, click-to-connect, reconnect | D | `connect.*` | `handle`, `connectionLine`, `reconnectHandle` |
| Drop connection on empty pane → `on.connectEnd` with flow position | D | – | recipe renders search popover (gallery 3, 7) |
| Context menu: right-click / long-press on node, edge, pane, selection; closes on pane click or Esc | D | `contextMenu` state, core `onContextMenu` | `custom.contextMenu({ target, ids, position })` |
| Delete key with cascade + `on.beforeDelete` | D | `keys.delete` | – |
| Undo / redo | D | `history.*`, `controller.history` | – |
| Copy / paste / duplicate (`⌘C ⌘V ⌘D`), paste at pointer | D | `clipboard.*`, `getContent/putContent/duplicate` | – |
| Keyboard baseline: ⌘A, arrows nudge (Shift ×10), + / -, Shift+1 fit, Esc | D | `keys.*`, all rebindable, `null` disables | – |
| Groups: `parentId`, children follow, `extent: "parent"`, drop into / out of group by drag | D | `drag.dropIntoGroup`, `setParent()` | node args `isDropTarget` |
| Layout as a property: layered, tree, force, grid, circular; run on mount or command | D | `layout` | – |
| Read-only: preset `"viewer"` or `can: () => false` keeps pan/zoom/hover/click | D | – | – |
| Inline text edit: dblclick → `editing`, Enter commits, Esc cancels, blur commits, drag and shortcuts blocked while editing | B `edit.text` | `startEditing/stopEditing`, `editingId` | node arg `editing`; template ships `EditableLabel` part |
| Node resize | B `edit.resize` or per node | existing | `resizeControl` |
| Edge waypoints: drag midpoint handle to insert, drag pin to move, dblclick pin to remove | B `edit.waypoints` | `insertWaypoint/moveWaypoint/removeWaypoint`, router/connector | `custom.edgeHandle({ edge, kind: "waypoint" \| "midpoint", index, active })`, edge args `waypoints` |
| Snap to grid + alignment guides (snapping happens inside the drag/resize tick) | B `drag.snap` | `guides` getter | `custom.guides({ lines })` |
| Overlap policy at drag end | B `drag.overlap` | `resolveOverlaps()` | node arg `isOverlapping` |
| Collapse / expand: subtree (tree) and body (dataflow) | B per node `collapsible` | `collapse/expand/toggleCollapsed`, hidden flags | node arg `collapsed`, `hiddenChildCount` |
| Insert node on edge | B helper | `insertNodeOnEdge(edgeId, node)` | edge args `hovered` |
| Delete with reconnect | B helper | `deleteElements(ids, { reconnect: true })` | – |
| Align / distribute selection | B helper | `alignNodes`, `distributeNodes` | – |
| Minimap, controls | template panels | – | parts in `styles/default` |
| Node search popover, quick-add connected node, click-to-recentre, depth filter, LOD by zoom, reroute node, status badges, animated edges | R | controller + args (`zoom` in args) | gallery examples |
| Auto push-apart during drag, obstacle-avoiding routing, collaboration, freehand | S | – | – |

## 4. API (freeze for P1; Astra may rename fields with a reason in the PR)

```ts
Flow<TConfig>({
  nodes, edges,
  custom: FlowCustom<TConfig>,                 // 15 slots, see below
  config?: TConfig,
  nodeTypes?, edgeTypes?,
  layout?: LayoutAlgorithm | LayoutConfig,
  viewport?: { initial?; fitView?: boolean | FitViewOptions; minZoom?; maxZoom?; extent? },
  interaction?: "editor" | "viewer" | "whiteboard" | (DeepPartial<FlowInteraction> & { preset? }),
  can?: (gesture: Gesture, target: GestureTarget) => boolean,
  on?: FlowEvents,
  controller?, panels?, key?,
})

type FlowInteraction = {
  pane:        { drag: "pan" | "select"; scroll: "zoom" | "pan"; scrollSpeed; pinch; doubleClick: "zoom" | "none"; autoPan: boolean | { speed }; panKey; selectKey };
  select:      { enabled; mode: "full" | "partial"; toggleKey; elevate; edgeHitWidth };
  drag:        { enabled; threshold; snap: { grid: false | [x, y]; guides: boolean; radius }; overlap: "allow" | "push" | "reject"; dropIntoGroup };
  connect:     { enabled; mode: "strict" | "loose"; radius; onClick; reconnect; reconnectRadius; lineType; validate? };
  edit:        { text; waypoints; resize: boolean | NodeResizeOptions };
  history:     { enabled; limit };
  clipboard:   { enabled; offset; system };
  contextMenu: { enabled; longPress };
  keys:        { delete; undo; redo; copy; paste; duplicate; selectAll; fitView; zoomIn; zoomOut; nudge; escape };  // KeyCode | null
  touch:       boolean;
};

type Gesture = "pan" | "zoom" | "select" | "drag" | "connect" | "reconnect" | "resize" | "reshape" | "edit" | "delete" | "copy" | "contextMenu";
type GestureTarget = { kind: "node" | "edge" | "pane" | "selection"; id?: string };

type FlowEvents = {
  nodesChange; edgesChange; selectionChange; viewportChange /* { phase: "start" | "move" | "end", viewport } */;
  connectStart; connectEnd /* { state, dropPosition } */; beforeConnect /* veto | patch */; connect; reconnect;
  beforeDelete; delete;
  dragStart; drag; dragEnd; resizeStart; resize; resizeEnd; reshapeStart; reshape; reshapeEnd;
  editStart; editEnd /* { committed } */;
  nodeClick; nodeDoubleClick; edgeClick; edgeDoubleClick; paneClick; paneDoubleClick; contextMenu /* target */;
  historyChange; init; error;
};
```

`FlowCustom` = existing 12 (`node, edge, edgeLabel, handle, defaultHandles, connectionLine, background, selectionBox, nodesSelectionRect, edgePath, resizeControl, reconnectHandle`) + `contextMenu`, `guides`, `edgeHandle`.

New builder args: node `editing, isDropTarget, isOverlapping, collapsed, hiddenChildCount, isNeighbour, zoom`; edge `waypoints, activeHandle, isNeighbour`.

New controller surface: `history { undo, redo, canUndo, canRedo, mark, clear }`, `run(fn, { history: "ignore" | "merge" })`, `getContent(ids?)`, `putContent(content, { at?, offset? })`, `duplicate(ids?)`, `copy()`, `paste()`, `contextMenu`, `openContextMenu(target, position)`, `closeContextMenu()`, `editingId`, `startEditing(id)`, `stopEditing({ commit })`, `insertWaypoint`, `moveWaypoint`, `removeWaypoint`, `insertNodeOnEdge`, `deleteElements(ids, { reconnect })`, `resolveOverlaps(ids?)`, `setParent(id, parentId | null)`, `collapse`, `expand`, `toggleCollapsed`, `alignNodes`, `distributeNodes`, `getNeighbours(id)`, `pointerFlowPosition`, `guides`, `interaction`, `setInteraction(partial)`.

Core (`packages/core`): `HitTestDispatcher` gains `onContextMenu` (DOM `contextmenu` + touch long-press ≈ 500 ms, `preventDefault` when a detector handles it). Additive, defaults unchanged, like the touch emulation.

Removed from the public surface: the flat `FlowOptions`/`FlowCallbacks` props, `xyflow*` names, `--style`. Keep `shared/*` pure helpers.

## 5. Gallery (slugs are final; data is English; 1–8 first, 9–12 if time allows)

| # | slug | Title | Echoes | Lead interactions (chips) | Layout |
|---|---|---|---|---|---|
| 1 | `deployment-canvas` | Deployment canvas | Railway | click → side panel, right-click pane → group, nested group collapse, edge visibility toggle, live status | manual + layered command |
| 2 | `schema-visualizer` | Schema visualizer | ChartDB, Supabase, dbdiagram | per-field handles, nearest-side edges, select → highlight related, drag FK with compatible columns, search → zoom to table | dagre LR, persisted |
| 3 | `automation-workflow` | Automation workflow | n8n, Dify | drop connection → node search, hover edge → insert / delete, run mode (animated edges, count badges), tidy up, undo | manual LR + layered |
| 4 | `linear-steps` | Linear steps with paths | Zapier | layout owns positions, + between steps, reorder only, collapse path, side panel | tree TB auto |
| 5 | `scenario-router` | Scenario router | Make | circle modules, right-click edge → insert router, ordered routes auto-align, notes on edges | manual + layered |
| 6 | `pipeline-run` | Pipeline run | GitHub Actions, Dagster | viewer preset, collapse groups, hover → upstream/downstream chain, click → log panel, live status | layered LR, groups |
| 7 | `dataflow-graph` | Dataflow graph | ComfyUI, Blender | typed colour ports + validate, reroute node, collapse / bypass, paste keeps links, minimap | manual |
| 8 | `process-diagram` | Process diagram | bpmn.io, Lucidchart | context pad append, orthogonal connectors with waypoints, inline label edit, snapping + guides | manual + autoPlace |
| 9 | `whiteboard` | Whiteboard flowchart | Excalidraw, FigJam | ⌘+Arrow quick-add connected shape, resize, guides, Alt-drag duplicate, context menu | manual |
| 10 | `org-chart` | Org chart | Pingboard, ChartHop | expand/collapse with counts, drag card onto manager (reparent), search → focus path to root, LOD by zoom | tree TB |
| 11 | `knowledge-graph` | Knowledge graph | Obsidian, Logseq | neighbour highlight + fade rest, depth slider, click → recentre, label fade by zoom | force |
| 12 | `state-machine` | State machine | Stately | nested states, dblclick parent → child, handle click → new state + transition | layered + manual |

Example file rules: one `docs/src/app/diagram/_examples/<slug>.ts` exporting `default (theme) => Widget`, importing only `flitter-ui`, `flitter-ui/diagram` and the copied `@/components/diagram/flow-diagram`. Side panels and popovers are Flitter widgets inside the example (panels or overlays), not React. Every example must run on SVG and Canvas and in light/dark.

## 6. Docs (Opus)

Pages: `/diagram` overview (hero with live example, gallery grid, three bullets, 30-line quick start, ≤ 150 words) · `/diagram/installation` (commands only) · `/diagram/quick-start` (one example, ≤ 250 words) · `/diagram/gallery` + `/gallery/[slug]` · `/diagram/interactions` (grid of micro-demos, one per D/B row: caption line + the snippet that enables or customises it) · `/diagram/api` (data-driven, reuse chart's `ApiPage` components: Props, Interaction defaults, Custom parts → args, Controller, Types).

Delete as standalone prose pages: `customization`, `headless`, `api/controller`, `api/edges`, `api/nodes-and-handles`, `api/styling`, `api/layout`, `api/interaction`. Their content becomes table rows or micro-demos.

Rules: a gallery page has no "how it works" or "make it yours" sections. Chips replace categories. No sentence longer than 20 words. If a concept needs explaining, add a demo, not a paragraph. Keep `docs/scripts/check-diagram-gallery.mjs` and extend it for 12 slugs.

## 7. Orchestration

Roles: Fable researches, freezes the API, reviews every checkpoint and sends written feedback; Astra (Codex, background, write mode) implements engine, template, examples; Opus restructures docs and wires the gallery.

Branch: `codex/diagram-headless-gallery` (PR #169), edited in place per the user's call on 2026-10-18. Its seven example files are raw material for the new slugs (workflow → automation-workflow, database-schema → schema-visualizer, organization → org-chart); the rest are replaced.

| Phase | Owner | Box | Deliverable | Checkpoint rubric |
|---|---|---|---|---|
| P1 API | Astra | 60 min | §4 types, `interaction` presets, `can`, `on`, style `xyflow → default`, CLI without `--style`, core `onContextMenu`, presets synced, Storybook + existing tests green | types match §4 or carry a reason; no visual code in headless; `test:install` green |
| P2 Interactions | Astra | 90 min | every D row, every B row behind its flag, controller methods, 3 new slots, one Playwright test per row (mouse + touch where it applies), vitest for history/clipboard/waypoints/overlap/setParent/collapse | each row demonstrable in `dev/performance` route; drag rebuild locality unchanged |
| P2' Docs skeleton | Opus (parallel) | 60 min | §6 pages, `ApiPage` reuse with data generated from `types.ts`, gallery components with chips, micro-demo grid | word budget met; build green |
| P3 Examples | Astra | 60 min | slugs 1–8 (then 9–12) | each page shows ≥ 2 chips working live, SVG + Canvas, light + dark |
| P3' Gallery wiring | Opus (parallel) | 45 min | entries, sitemap, nav, check script for 12 slugs, prose cut | zero paragraphs on gallery pages |
| P4 Review | Fable | 30 min | browser walkthrough of all examples, perf compare, PR | G1–G6 |

Feedback loop: Astra runs via the Codex companion in the background; Fable polls `status` about every 10 minutes, reviews the diff against this file, and sends numbered feedback through `task --resume-last`. Opus is a single long-lived agent; feedback goes through its mailbox. Nothing merges without the P4 walkthrough.

Realistic wall clock: 3 hours if P2 lands clean, 4 if the waypoint router or history needs a second pass.

## 7b. Checkpoint notes

- P1 review: API matches §4. Follow-ups folded into P2: add `select.box` (viewer keeps click selection, loses box select); drop the stale node arg `zoom` in favour of `controller.zoom` plus per-node-type `lod: number[]` breakpoints that rebuild a node only when the zoom crosses one; remove `defaultDiagramStyle` from the CLI config/schema (single style).

- P2' review: docs API tables are generated from `types.ts`, `controller.ts` and `interaction.ts` by `docs/scripts/gen-diagram-api.mjs` (`--check` for staleness; re-run after engine changes). Prose counter: `docs/scripts/count-diagram-prose.mjs`. Before flipping cells: the insert-on-edge "+" lives in the `edgeLabel` slot (confirm label taps reach it) and the collapse demo toggles from `on.nodeClick` (switch to the collapse chevron once the node arg lands).

- P2 review (2026-10-18): all ten items landed; 187 vitest, 76/77 Playwright after Astra's fix pass. Fable fixed the last one: a drag attempt on a locked node (viewer preset) never set the movement flag, so the trailing browser click landed on an edge and replaced the selection; now any node press past the threshold counts as movement, and a locked node lets the press fall through so the pane pans or box-selects beneath it (React Flow parity). Storybook `Diagram/Interactions` checked by headless screenshots: context menu (SVG + Canvas), inline edit, waypoint drag, snap guides all behave. Template polish for P3: the context menu uses the browser serif font and has no radius or shadow; match the node font and the controls panel.

- P3 review (2026-10-18): 12 examples, 120–250 lines each, light and dark, no console errors. Engine defect found by screenshots: the scene painted all edges below all nodes, so edges inside filled group nodes (state machine transitions, BPMN cross-lane edge, pipeline stage edges) were hidden; fix = edge z = max(endpoint z), children above parents, one z-sorted list with edges before nodes at equal z.

## 8. Progress

- [x] P0 research (`todo/diagram-research.md`) and this guide
- [x] P1 API (Astra, 2026-10-18; Codex sandbox cannot commit or bind ports, so Fable commits and runs Playwright)
- [x] P2 interactions (Astra + one Fable fix, 2026-10-18) · [x] P2' docs skeleton (Opus, 2026-10-18: 218 budgeted words, 25 interaction cells of which 13 wait on P2, 12-slug catalog with 5 loaded from the old example files)
- [x] P3 examples 1–12 (Astra, 2026-10-18; polish pass running: scene z-order so edges paint above filled groups, knowledge-graph straight edges, pipeline-run legibility, hover-only edge slots, search placeholders) · [~] P3' gallery wiring and QA (Opus)
- [ ] P4 review + PR
