/**
 * One micro-demo per D and B row of todo/diagram.md §3.
 * Flip `ready` when the gesture lands; the live demo lives in
 * `_components/interaction-demos.ts` under the same id.
 */
export type CellId =
  | "pan-zoom" | "touch" | "drag" | "select" | "hover" | "front" | "connect"
  | "drop-connection" | "context-menu" | "delete" | "undo" | "clipboard"
  | "keyboard" | "groups" | "layout" | "read-only"
  | "text-edit" | "resize" | "waypoints" | "snap-guides" | "overlap"
  | "collapse" | "insert-on-edge" | "delete-reconnect" | "align";

export type InteractionCell = {
  id: CellId;
  title: string;
  /** D = on by default, B = one flag or helper away. */
  tier: "D" | "B";
  /** What the reader should do, in one line. */
  caption: string;
  /** ≤ 15 lines: the prop that enables or customises it. */
  snippet: string;
  /** `false` renders the snippet with a placeholder stage. */
  ready: boolean;
};

export const cells: InteractionCell[] = [
  {
    id: "pan-zoom",
    title: "Pan and zoom",
    tier: "D",
    caption: "Drag the pane to pan. Scroll or pinch to zoom.",
    snippet: `FlowDiagram({
  data: { nodes, edges },
  viewport: { fitView: true, minZoom: 0.5, maxZoom: 2 },
  interaction: {
    pane: {
      drag: "pan",         // or "select"
      scroll: "zoom",      // or "pan"
      doubleClick: "zoom", // or "none"
      autoPan: { speed: 15 },
    },
  },
});`,
    ready: true,
  },
  {
    id: "touch",
    title: "Touch",
    tier: "D",
    caption: "On a touch screen, drag with one finger and pinch with two.",
    snippet: `interaction: {
  touch: true,
  pane: { pinch: true },
  contextMenu: { longPress: 500 }, // ms
}`,
    ready: true,
  },
  {
    id: "drag",
    title: "Drag nodes",
    tier: "D",
    caption: "Drag a node. ⌘-click a second one, then drag both.",
    snippet: `interaction: {
  drag: { enabled: true, threshold: 1 },
},
on: {
  dragEnd: (_event, node, nodes) => save(nodes),
},

// Keep one node inside its parent
{ id: "a", parentId: "lane", extent: "parent", ... }`,
    ready: true,
  },
  {
    id: "select",
    title: "Select",
    tier: "D",
    caption: "Shift-drag on the pane to box-select. Press Esc to clear.",
    snippet: `interaction: {
  select: { box: true, mode: "partial" },
},
custom: {
  selectionBox: ({ rect }) => MySelectionBox(rect),
},
on: {
  selectionChange: ({ nodes }) => inspector.show(nodes),
},`,
    ready: true,
  },
  {
    id: "hover",
    title: "Hover neighbours",
    tier: "D",
    caption: "Hover a node. Its neighbours light up.",
    snippet: `nodeTypes: {
  default: ({ node, isHovered, isNeighbour }) =>
    Card(node.data.label, {
      highlight: isHovered || isNeighbour,
    }),
},`,
    ready: true,
  },
  {
    id: "front",
    title: "Bring to front",
    tier: "D",
    caption: "Click the card underneath. It rises above the others.",
    snippet: `interaction: {
  select: { elevate: true }, // the default
},

// Pin a layer yourself
{ id: "note", zIndex: 10, ... }`,
    ready: true,
  },
  {
    id: "connect",
    title: "Connect",
    tier: "D",
    caption: "Drag from a handle onto another node. Drag an edge end to reconnect.",
    snippet: `interaction: {
  connect: {
    mode: "strict",  // source → target only
    radius: 20,
    onClick: true,   // click two handles
    reconnect: true,
    validate: (c) => c.source !== c.target,
  },
},
on: { connect: (c) => console.log(c) },`,
    ready: true,
  },
  {
    id: "drop-connection",
    title: "Drop on the pane",
    tier: "D",
    caption: "Drag from a handle and release on empty space.",
    snippet: `const flow = new FlowDiagramController();

FlowDiagram({
  data: { nodes, edges }, controller: flow,
  on: {
    connectEnd: ({ state, dropPosition }) => {
      if (state.toNode) return;
      const id = crypto.randomUUID();
      flow.addNodes({ id, position: dropPosition, data: { label: "New" } });
      flow.addEdges({ id: \`e-\${id}\`, source: state.fromNode.id, target: id });
    },
  },
});`,
    ready: true,
  },
  {
    id: "context-menu",
    title: "Context menu",
    tier: "D",
    caption: "Right-click a node, an edge or the pane.",
    snippet: `interaction: { contextMenu: { enabled: true, longPress: 500 } },
custom: {
  contextMenu: ({ target, ids, position }, flow) =>
    Menu(position, [
      ["Duplicate", () => flow.duplicate(ids)],
      ["Delete", () => flow.deleteElements(ids)],
    ]),
},`,
    ready: true,
  },
  {
    id: "delete",
    title: "Delete",
    tier: "D",
    caption: "Select a node and press Backspace. Start refuses to go.",
    snippet: `interaction: {
  keys: { delete: ["Backspace", "Delete"] }, // null turns it off
},
on: {
  // false vetoes; a { nodes, edges } object patches
  beforeDelete: ({ nodes }) =>
    nodes.every((node) => node.id !== "start"),
},`,
    ready: true,
  },
  {
    id: "undo",
    title: "Undo and redo",
    tier: "D",
    caption: "Move or delete a node, then press ⌘Z. ⇧⌘Z redoes.",
    snippet: `interaction: { history: { enabled: true, limit: 100 } },
on: {
  historyChange: ({ canUndo, canRedo }) => toolbar.update(canUndo, canRedo),
},

// From your own buttons
flow.history.undo();
flow.run(() => flow.setNodes(tidy), { history: "merge" });`,
    ready: true,
  },
  {
    id: "clipboard",
    title: "Copy, paste, duplicate",
    tier: "D",
    caption: "Select a node. Press ⌘C then ⌘V, or ⌘D to duplicate.",
    snippet: `interaction: {
  clipboard: { offset: { x: 20, y: 20 }, system: false },
  keys: { duplicate: null }, // turn one shortcut off
},

// The same mutations without the keys
const content = flow.getContent(["a", "b"]);
flow.putContent(content, { at: flow.pointerFlowPosition });`,
    ready: true,
  },
  {
    id: "keyboard",
    title: "Keyboard",
    tier: "D",
    caption: "Click a node, then press the arrow keys. Shift moves ten times as far.",
    snippet: `interaction: {
  keys: {
    selectAll: "Meta+a",
    nudge: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
    fitView: "Shift+1",
    zoomIn: ["+", "="],
    zoomOut: "-",
    escape: "Escape",
    duplicate: null, // null disables a binding
  },
},`,
    ready: true,
  },
  {
    id: "groups",
    title: "Groups",
    tier: "D",
    caption: "Drag the loose step into the stage, then out again.",
    snippet: `const nodes = [
  { id: "stage", type: "group", width: 300, height: 180, position, data: {} },
  { id: "a", parentId: "stage", position: { x: 20, y: 50 }, data },
  { id: "loose", position: { x: 360, y: 60 }, data },
];

interaction: { drag: { dropIntoGroup: true } },
nodeTypes: {
  group: ({ isDropTarget }) => Frame({ glow: isDropTarget }),
},`,
    ready: true,
  },
  {
    id: "layout",
    title: "Layout",
    tier: "D",
    caption: "Pick an algorithm. Nodes move into place and stay draggable.",
    snippet: `import { layeredLayout } from "flitter-ui/diagram";

FlowDiagram({
  data: { nodes, edges },
  layout: {
    algorithm: layeredLayout, // tree, force, grid, circular
    options: { direction: "LR", rankSpacing: 80 },
    runOn: "mount",           // or "manual" + flow.layout()
  },
});`,
    ready: true,
  },
  {
    id: "read-only",
    title: "Read-only",
    tier: "D",
    caption: "Nodes stay put. Pan, zoom, hover and click still work.",
    snippet: `interaction: "viewer",

// Or keep the editor and lock one thing
can: (gesture, target) =>
  !(gesture === "drag" && target.id === "locked"),`,
    ready: true,
  },
  {
    id: "text-edit",
    title: "Inline text edit",
    tier: "B",
    caption: "Double-click a label. Enter commits, Esc cancels.",
    snippet: `import { EditableLabel } from "@/components/diagram/flow-diagram";

interaction: { edit: { text: true } }, // default nodes edit already
nodeTypes: {
  note: (args, flow) => Card({ child: EditableLabel(args, flow) }),
},
on: {
  editEnd: ({ node, committed }) => committed && save(node),
},`,
    ready: true,
  },
  {
    id: "resize",
    title: "Resize",
    tier: "B",
    caption: "Select the node, then drag a corner or a side.",
    snippet: `interaction: {
  edit: { resize: { minWidth: 80, minHeight: 40 } },
},

// Or per node
{ id: "a", resizable: true, resizeOptions: { keepAspectRatio: true }, ... }

on: {
  resizeEnd: (_event, node, { width, height }) => save(node.id, width, height),
},`,
    ready: true,
  },
  {
    id: "waypoints",
    title: "Edge waypoints",
    tier: "B",
    caption: "Click the edge, then drag a dot to bend it. Double-click a bend to remove it.",
    snippet: `interaction: { edit: { waypoints: true } },
edges: [
  { id: "e", source: "a", target: "b", waypoints: [{ x: 200, y: 40 }] },
],
custom: {
  edgeHandle: ({ kind, isActive }) =>
    Dot({ size: kind === "midpoint" ? 6 : 8, filled: isActive }),
},
on: { reshapeEnd: ({ edge }) => save(edge) },`,
    ready: true,
  },
  {
    id: "snap-guides",
    title: "Snap and guides",
    tier: "B",
    caption: "Drag a node level with another. It snaps and a guide appears.",
    snippet: `interaction: {
  drag: {
    snap: { grid: [20, 20], guides: true, radius: 5 },
  },
},
custom: {
  guides: ({ lines }) => GuideLines(lines, { color: "#e11d48" }),
},`,
    ready: true,
  },
  {
    id: "overlap",
    title: "Overlap policy",
    tier: "B",
    caption: "Drop a node onto another. It is pushed aside when you let go.",
    snippet: `interaction: {
  drag: { overlap: "push" }, // or "reject", default "allow"
},
nodeTypes: {
  default: ({ node, isOverlapping }) =>
    Card(node.data.label, { warn: isOverlapping }),
},

// After a paste or a layout
flow.resolveOverlaps();`,
    ready: true,
  },
  {
    id: "collapse",
    title: "Collapse and expand",
    tier: "B",
    caption: "Click the chevron on Lead. The team hides and a count appears.",
    snippet: `{ id: "lead", collapsible: true, position, data }

nodeTypes: {
  default: ({ node, isCollapsed, hiddenChildCount }, flow) =>
    Card(node.data.label, {
      badge: isCollapsed ? \`+\${hiddenChildCount}\` : null,
      chevron: Chevron({
        open: !isCollapsed,
        onClick: () => flow.toggleCollapsed(node.id),
      }),
    }),
},
// The default context menu adds Collapse / Expand too`,
    ready: true,
  },
  {
    id: "insert-on-edge",
    title: "Insert on edge",
    tier: "B",
    caption: "Hover the edge and click +. A step lands in between.",
    snippet: `edges: [{ id: "e", source: "a", target: "b", label: "+" }],
custom: {
  // The label slot sits on the edge and keeps its hover
  edgeLabel: ({ edge, isHovered, x, y }, flow) =>
    isHovered
      ? PlusButton(() =>
          flow.insertNodeOnEdge(edge.id, {
            id: crypto.randomUUID(),
            position: { x: x - 75, y: y - 18 },
            data: { label: "New step" },
          }))
      : SizedBox.shrink(),
},`,
    ready: true,
  },
  {
    id: "delete-reconnect",
    title: "Delete and reconnect",
    tier: "B",
    caption: "Click Remove review. Draft and Publish stay connected.",
    snippet: `GestureDetector({
  onClick: () =>
    flow.deleteElements(["review"], { reconnect: true }),
  child: Button("Remove review"),
})`,
    ready: true,
  },
  {
    id: "align",
    title: "Align and distribute",
    tier: "B",
    caption: "Shift-drag around the nodes, then click Align left or Distribute.",
    snippet: `const ids = flow.getSelectedNodes().map((node) => node.id);

flow.alignNodes(ids, "left"); // centerX, right, top, centerY, bottom
flow.distributeNodes(ids, "y"); // or "x"`,
    ready: true,
  },
];

export const cellById = Object.fromEntries(cells.map((cell) => [cell.id, cell])) as Record<CellId, InteractionCell>;
