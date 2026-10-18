# Diagram research digest (2026-10-18)

Three sweeps feed `todo/diagram.md`: React Flow / xyflow (docs, source 12.12 / system 0.0.83, issues), ~45 shipping products with canvases, and headless/editor APIs (xyflow system, tldraw, Rete v2, JointJS, GoJS, headless UI libraries). Only decisions-relevant facts are kept here.

## A. React Flow: what is default, what is Pro, what is missing

Default on: pan drag/Space, zoom wheel/pinch/dblclick (0.5–2), four auto-pan kinds, node drag (threshold 1 px, multi-drag, revert), click / Meta-toggle / Shift box select (full), selection rect with arrow nudge, Backspace delete with cascade + `onBeforeDelete`, connect by drag and click with 20 px radius snap, strict mode, reconnect (10 px), edge hit width 20, markers, animated edges, elevate on select, Tab focus, dark mode, `toObject`.
Components you must mount: MiniMap, Controls, Background, NodeResizer, NodeToolbar, EdgeToolbar (12.9), EdgeLabelRenderer, Panel, ViewportPortal.
Free examples only: context menu, drag handle, add node on edge drop, easy connect, proximity connect, floating edges, delete middle node, lasso, post-hoc node collisions, DnD sidebar, dagre/elk layouts, save/restore, download image.
Pro only (16): auto layout, collaborative, copy/paste, dynamic layouting, edge routing (libavoid), editable edge (waypoints), expand/collapse, force layout, freehand, helper lines, node position animation, parent-child by drag, selection grouping, server image, shapes, undo/redo.
Absent: overlap prevention (#1737, #2870), select-all, clipboard/history shortcuts, edge label editing, group auto-size, attach/detach by drag, built-in layout. Complaints: edge routing "won't provide" (#4766, #2806), undo/redo (#656, #1127, #3088), typing inside nodes needs `nodrag`/`nopan` (#4980, #2837, #3457), ~1,000-node DOM ceiling (#3003, #4975), layout sequencing (#2973, #4962).
Defaults worth copying: `nodeDragThreshold 1`, `connectionRadius 20`, `reconnectRadius 10`, `snapGrid [15,15]` off, `deleteKeyCode Backspace`, `multiSelectionKeyCode Meta/Ctrl`, `selectionKeyCode Shift`, `panActivationKeyCode Space`, `interactionWidth 20`, Background dots gap 20.
`@xyflow/system` = XYDrag, XYHandle, XYPanZoom, XYResizer, XYMinimap + pure graph/path utils; state, keyboard, box select and toolbars stay in the framework. Everything Pro sits outside system, which is exactly the layer our engine should own.

## B. Products: interaction frequency

| Interaction | Who has it | Verdict |
|---|---|---|
| Pan/zoom/fit | all 45 | default; pane drag meaning splits (n8n, whiteboards select; Langflow, Retool, ComfyUI, TouchDesigner pan; Dify toggles) |
| Node drag | all editors; off in Headlamp, Grafana, GitHub Actions, ChartHop | default, per-node off |
| Multi/box select | ~35 | default |
| Connect by dragging from port | every workflow builder except Zapier/Pipedream, all node editors, 5 schema tools | default |
| Drop connection on pane → add node | Blender, Unreal, ComfyUI, Retool, n8n, Langflow | hook default, UI recipe |
| Click-to-add (append from node / insert on edge) | n8n, Make, Dify, Zapier, FigJam, draw.io, Lucid, bpmn, Stately, org charts | hook default, UI recipe |
| Context menu | almost all; only bpmn.io (context pad) and BALKAN lack it | default trigger + slot |
| Delete key | all | default; delete-with-reconnect is Houdini default, Blender/Node-RED Ctrl-Del |
| Undo/redo | all editors; drawSQL 2024-09, Zapier 2025-02, Make ~2026 | built in, on |
| Copy/paste/duplicate | all editors, ⌘D universal | built in, on |
| Groups/frames, nesting | n8n, Dify, Langflow, Dagster, Railway, Cloudcraft, node editors, whiteboards, bpmn lanes, Stately | default |
| Collapse/expand | org charts (with counts), mind maps, k8s/Dagster, Railway, Zapier paths, node editors, ChartDB fields | built in, opt-in |
| Inline text edit | all whiteboards, bpmn, Stately, ComfyUI title, drawSQL, ChartDB; workflow builders use side panels | built in, opt-in |
| Snap to grid | on: TouchDesigner, ChartDB 20 px, bpmn, draw.io, Miro, FigJam, Lucid; off: tldraw, Excalidraw, Blender, ComfyUI | opt-in |
| Alignment guides | Miro, FigJam, draw.io, Lucid, bpmn on; Excalidraw, Langflow, tldraw opt-in | opt-in |
| Edge waypoints | whiteboards and modeling tools, dbdiagram, pgModeler; absent in every workflow builder and React-Flow schema tool; dataflow editors use reroute nodes | opt-in |
| Overlap handling | nobody auto-resolves on free canvases; ChartDB warns, n8n group expand pushes, Railway "stack → auto layout" | bring-to-front default, policy at drag end opt-in |
| Node resize | whiteboards, bpmn, ComfyUI, Blender, ChartDB width-only, n8n notes | opt-in |
| Neighbour highlight | Obsidian, Logseq, Kumu, Grafana, Headlamp, dbdiagram, ChartDB, drawSQL, Supabase | arg default |
| Minimap | Retool, Supabase, ChartDB, drawSQL, ComfyUI, Node-RED, Miro, Lucid | template panel |
| Auto layout | all viewers; command in n8n, Make, Dify, Retool, drawSQL, dbdiagram, Railway; always-on in mind maps/org charts | default adapters, run on command |
| Read-only | all viewers, lock modes everywhere | preset |
| Touch | n8n, ComfyUI, Miro, FigJam, tldraw; dbdiagram unsupported, bpmn removed in v17 (both regretted publicly) | default |
| Search-to-add | all node editors, n8n `N`, Dify ⌘K, Railway ⌘K | recipe |
| LOD by zoom, click-to-recentre, depth filter | ChartHop, Logseq, Kumu, Obsidian, family trees | recipe |

Product facts the examples should honour: Railway edges are variable references toggled in a sidebar, right-click pane creates a group, collapsed groups open a nested canvas, positions and groups persist per environment. Zapier is an auto-laid vertical tree with a bottom tray, drag only reorders. Make uses circular modules, right-click on the edge inserts a router, routes have an order and an auto-align to it. ChartDB shows per-field handles only on the focused table, picks the shortest of four side combinations for each edge, snaps 20 px, warns on overlap with a pulsing ring, truncates to 10 fields. bpmn.io's entire model is a context pad with autoPlace and no right-click menu. Observability canvases disable drag and degrade by size (Grafana caps at 200 nodes, Jaeger switches layout above 200 services).

## C. API patterns worth copying

- xyflow: `ConnectionInProgress | NoConnection` union as the complete connection-line contract; kernels read a store snapshot per tick.
- tldraw: interaction hooks on the shape definition return patches (`onTranslate(initial, current) => Partial<Shape>`); `markHistoryStoppingPoint` / `bailToMark` set undo granularity per gesture; `kickoutOccludedShapes` runs at gesture end.
- Rete: pre/post signal pairs (`nodecreate` cancels, `nodecreated` observes); reroute pins are data with `translate/remove/select` and the visual preset gets exactly those callbacks.
- JointJS: vertices are user data, router (points) and connector (path) are pure functions; `connectionStrategy` names what persists on drop; `interactive: (cellView, evt) => flags` is one permission function.
- GoJS: `Link.adjusting` decides what happens to edited points when ends move; three permission levels collapse to one predicate per gesture; layout is a property with invalidation rules.
- Headless UI libraries: flat state bag to the renderer, behaviour via handlers, `onXChange` for control, `stateReducer` for veto. Our `custom.*(args, ctx)` is the render prop; `FlowController` is the TanStack instance.
- Do not expose tool classes or a plugin bus; unanticipated gestures first arrive as new `custom.*` slots on engine-owned gestures.
