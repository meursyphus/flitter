/**
 * Live diagrams shown on the diagram docs. Every factory is module-scope so
 * `LiveDiagram` can keep it referentially stable; it only rebuilds when the
 * site theme flips.
 */
import {
  Container,
  EdgeInsets,
  GestureDetector,
  MainAxisSize,
  Row,
  SizedBox,
  Text,
  TextStyle,
  type Widget,
} from "flitter-core";
import {
  type DeepPartial,
  type FlowEdge,
  type FlowNode,
  type HandleSpec,
  type LayoutAlgorithm,
  type LayoutOptions,
  type NodeToolbarBuilder,
  type DefaultFlowConfig,
  FlowDiagram,
  circularLayout,
  forceLayout,
  gridLayout,
  layeredLayout,
  treeLayout,
  defaultNode,
  defaultNodeTypes,
} from "flitter-diagram";
import type { Theme } from "@/lib/theme";

/** React Flow colours for the theme, on the same surface as `--chart-bg`. */
function siteConfig(theme: Theme, extra: DeepPartial<DefaultFlowConfig> = {}): DeepPartial<DefaultFlowConfig> {
  return {
    ...extra,
    colorMode: theme,
    colors: { background: theme === "dark" ? "#14171c" : "#ffffff", ...extra.colors },
  };
}

/* ── Layout switcher: a service dependency graph ─────────── */

const services = [
  "Gateway", "Auth", "Catalog", "Orders", "Search",
  "Inventory", "Payments", "Users DB", "Warehouse", "Ledger",
];

const serviceLinks: [string, string][] = [
  ["Gateway", "Auth"],
  ["Gateway", "Catalog"],
  ["Gateway", "Orders"],
  ["Auth", "Users DB"],
  ["Catalog", "Search"],
  ["Catalog", "Inventory"],
  ["Orders", "Inventory"],
  ["Orders", "Payments"],
  ["Inventory", "Warehouse"],
  ["Payments", "Ledger"],
];

const id = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

// Every node starts at the origin; the layout algorithm places it after measurement.
const serviceNodes: FlowNode[] = services.map((name) => ({
  id: id(name),
  position: { x: 0, y: 0 },
  data: { label: name },
}));

const serviceEdges: FlowEdge[] = serviceLinks.map(([s, t]) => ({
  id: `${id(s)}-${id(t)}`,
  source: id(s),
  target: id(t),
  markerEnd: "arrowclosed",
}));

const sideHandles: HandleSpec[] = [
  { type: "target", position: "left" },
  { type: "source", position: "right" },
];

function layoutDiagram(
  algorithm: LayoutAlgorithm,
  options: LayoutOptions = {},
  horizontal = false,
) {
  return (theme: Theme): Widget =>
    FlowDiagram({
      nodes: serviceNodes,
      edges: serviceEdges,
      layout: { algorithm, options },
      nodeTypes: horizontal ? { default: { build: defaultNode, handles: sideHandles } } : undefined,
      config: siteConfig(theme, { minimap: { visible: false } }),
      viewport: { minZoom: 0.1, fitView: { padding: 0.15 } },
    });
}

export const layoutDemos = [
  { id: "layered", label: "Layered", create: layoutDiagram(layeredLayout) },
  {
    id: "tree",
    label: "Tree (LR)",
    create: layoutDiagram(treeLayout, { direction: "LR", rankSpacing: 80 }, true),
  },
  { id: "force", label: "Force", create: layoutDiagram(forceLayout) },
  { id: "grid", label: "Grid", create: layoutDiagram(gridLayout, { columns: 4 }) },
  { id: "circular", label: "Circular", create: layoutDiagram(circularLayout) },
] as const;

/* ── Quick start: the guide's editor, live ───────────────── */

const quickStartNodes: FlowNode[] = [
  { id: "draft", type: "input", position: { x: 0, y: 0 }, data: { label: "Draft" } },
  { id: "review", position: { x: 0, y: 120 }, data: { label: "Review" } },
  { id: "publish", type: "output", position: { x: 0, y: 240 }, data: { label: "Publish" } },
];

const quickStartEdges: FlowEdge[] = [
  { id: "a", source: "draft", target: "review" },
  { id: "b", source: "review", target: "publish" },
];

export function createQuickStartDiagram(theme: Theme): Widget {
  return FlowDiagram({
    nodes: quickStartNodes,
    edges: quickStartEdges,
    config: siteConfig(theme),
    viewport: { fitView: true },
  });
}

/* ── Interaction: resize, toolbar, reconnect ─────────────── */

const interactionNodes: FlowNode[] = [
  {
    id: "resize",
    type: "input",
    position: { x: 0, y: 0 },
    data: { label: "Drag a blue corner" },
    resizable: true,
    resizeOptions: { minWidth: 120, minHeight: 36 },
    selected: true,
  },
  { id: "tools", position: { x: 260, y: 10 }, data: { label: "Select me" } },
  { id: "target", type: "output", position: { x: 40, y: 200 }, data: { label: "Output" } },
  { id: "spare", type: "output", position: { x: 280, y: 200 }, data: { label: "Drop the edge end here" } },
];

const interactionEdges: FlowEdge[] = [
  { id: "resize-tools", source: "resize", target: "tools", type: "smoothstep" },
  { id: "resize-target", source: "resize", target: "target", label: "drag my lower end" },
];

function toolbarButton(label: string, onClick: () => void): Widget {
  return GestureDetector({
    onClick,
    cursor: "pointer",
    child: Container({
      padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 4 }),
      color: "#3367d9",
      child: Text(label, { style: new TextStyle({ color: "#ffffff", fontSize: 12 }) }),
    }),
  });
}

const interactionToolbar: NodeToolbarBuilder<DefaultFlowConfig> = ({ node }, flow) =>
  Row({
    mainAxisSize: MainAxisSize.min,
    children: [
      toolbarButton("Duplicate", () =>
        flow.addNodes({
          id: crypto.randomUUID(),
          type: node.type,
          data: node.data,
          position: { x: node.position.x + 40, y: node.position.y + 60 },
        }),
      ),
      SizedBox({ width: 4 }),
      toolbarButton("Delete", () => void flow.deleteElements({ nodes: [node] })),
    ],
  });

export function createInteractionDiagram(theme: Theme): Widget {
  return FlowDiagram({
    nodes: interactionNodes,
    edges: interactionEdges,
    nodeTypes: Object.fromEntries(
      Object.entries(defaultNodeTypes).map(([name, definition]) => [
        name,
        { ...definition, toolbar: interactionToolbar },
      ]),
    ),
    config: siteConfig(theme, { minimap: { visible: false } }),
    viewport: { fitView: { padding: 0.3 } },
  });
}
