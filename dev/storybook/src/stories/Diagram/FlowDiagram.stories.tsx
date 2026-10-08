import type { Meta, StoryObj } from "@storybook/react";
import DualRenderer from "../../components/DualRenderer";
import {
  Border,
  BorderRadius,
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  GestureDetector,
  MainAxisSize,
  Padding,
  Row,
  Text,
  TextStyle,
  type Widget,
} from "flitter-core";
import {
  FlowDiagram,
  type FlowEdge,
  type FlowNode,
  type NodeBuilderArgs,
  forceLayout,
  layeredLayout,
  treeLayout,
} from "flitter-diagram";

declare global {
  interface Window {
    __flows?: unknown[];
  }
}

/** Exposes controllers on `window.__flows` so browser tests can inspect state. */
const expose = {
  onInit: (controller: unknown) => {
    if (typeof window === "undefined") return;
    (window.__flows ??= []).push(controller);
  },
};

const meta = {
  title: "Diagram/FlowDiagram",
  component: DualRenderer,
  // fitView and layout land a couple of frames after mount.
  parameters: { chromatic: { delay: 500 } },
} satisfies Meta<typeof DualRenderer>;

/** Stories with `animated` edges change every frame; keep them out of Chromatic. */
const noSnapshot = { chromatic: { disableSnapshot: true } };
export default meta;
type Story = StoryObj<typeof meta>;

const basicNodes: FlowNode[] = [
  { id: "1", type: "input", position: { x: 100, y: 50 }, data: { label: "Input Node" } },
  { id: "2", position: { x: 100, y: 180 }, data: { label: "Default Node" } },
  { id: "3", type: "output", position: { x: 320, y: 180 }, data: { label: "Output Node" } },
];

const basicEdges: FlowEdge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", label: "edge label" },
];

export const Basic: Story = {
  parameters: noSnapshot,
  args: {
    width: "560px",
    height: "400px",
    widget: FlowDiagram({ ...expose, nodes: basicNodes, edges: basicEdges, fitView: true }),
    description:
      "React Flow's default example. Drag nodes, wheel to zoom, drag the pane to pan, shift+drag to box select, drag from a handle to connect, Backspace to delete.",
  },
};

const edgeTypeNodes: FlowNode[] = [
  { id: "a", position: { x: 0, y: 0 }, data: { label: "A" } },
  { id: "b", position: { x: 300, y: 0 }, data: { label: "B" } },
  { id: "c", position: { x: 0, y: 200 }, data: { label: "C" } },
  { id: "d", position: { x: 300, y: 200 }, data: { label: "D" } },
  { id: "e", position: { x: 150, y: 350 }, data: { label: "E" } },
];

const edgeTypeEdges: FlowEdge[] = [
  { id: "ab", source: "a", target: "b", type: "straight", label: "straight", markerEnd: "arrowclosed" },
  { id: "ac", source: "a", target: "c", type: "step", label: "step" },
  { id: "bd", source: "b", target: "d", type: "smoothstep", label: "smoothstep", markerEnd: "arrow" },
  { id: "cd", source: "c", target: "d", type: "simplebezier", label: "simplebezier" },
  { id: "ce", source: "c", target: "e", label: "bezier", animated: true, markerEnd: "arrowclosed" },
  { id: "de", source: "d", target: "e", label: "selected", selected: true },
];

export const EdgeTypes: Story = {
  parameters: noSnapshot,
  args: {
    width: "560px",
    height: "440px",
    widget: FlowDiagram({ ...expose, nodes: edgeTypeNodes, edges: edgeTypeEdges, fitView: true }),
    description: "Every built-in edge type with labels and markers.",
  },
};

export const DarkMode: Story = {
  parameters: noSnapshot,
  args: {
    width: "560px",
    height: "400px",
    widget: FlowDiagram({
      nodes: basicNodes,
      edges: basicEdges,
      fitView: true,
      config: { colorMode: "dark", background: { variant: "lines" } },
    }),
    description: "Dark colour mode with the line background variant.",
  },
};

function chain(count: number): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({ id: `n${i}`, position: { x: 0, y: 0 }, data: { label: `Node ${i}` } });
  }
  const links: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [5, 7], [4, 8], [6, 8], [7, 9], [8, 9],
  ];
  for (const [s, t] of links) {
    if (s < count && t < count) edges.push({ id: `e${s}-${t}`, source: `n${s}`, target: `n${t}`, markerEnd: "arrowclosed" });
  }
  return { nodes, edges };
}

export const LayeredLayout: Story = {
  args: {
    width: "640px",
    height: "460px",
    widget: FlowDiagram({ ...expose, ...chain(10), layout: layeredLayout }),
    description: "Nodes start at (0,0); the layered (Sugiyama) algorithm positions them after measurement and fits the view.",
  },
};

export const TreeLayoutLeftRight: Story = {
  args: {
    width: "640px",
    height: "460px",
    widget: FlowDiagram({
      ...chain(10),
      layout: { algorithm: treeLayout, options: { direction: "LR", rankSpacing: 80 } },
      nodeTypes: {
        default: {
          build: (args, ctx) => ctx.custom.node(args, ctx),
          handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right" },
          ],
        },
      },
    }),
    description: "Tree layout flowing left to right with handles moved to the sides.",
  },
};

export const ForceLayout: Story = {
  args: {
    width: "640px",
    height: "460px",
    widget: FlowDiagram({ ...chain(10), layout: forceLayout, config: { background: { variant: "cross" } } }),
    description: "Force-directed layout (Fruchterman-Reingold), deterministic seed.",
  },
};

type TableData = { label: string; fields: { name: string; type: string; pk?: boolean }[] };

const ROW_HEIGHT = 22;
const HEADER_HEIGHT = 28;

function tableNode(args: NodeBuilderArgs, ctx: any): Widget {
  const data = args.node.data as TableData;
  const { colors, node } = ctx.config;
  const rows = data.fields.map((field) =>
    Container({
      height: ROW_HEIGHT,
      padding: EdgeInsets.symmetric({ horizontal: 10 }),
      alignment: undefined,
      child: Text(`${field.pk ? "🔑 " : ""}${field.name}  ${field.type}`, {
        style: new TextStyle({ fontSize: 11, color: colors.nodeColor, fontFamily: node.fontFamily }),
      }),
    }),
  );
  return Container({
    width: 200,
    decoration: new BoxDecoration({
      color: colors.nodeBackground,
      border: Border.all({ color: args.selected ? "#3367d9" : colors.nodeBorder, width: args.selected ? 1.5 : 1 }),
      borderRadius: BorderRadius.circular(4),
    }),
    child: Column({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container({
          height: HEADER_HEIGHT,
          color: args.selected ? "#3367d9" : "#1a192b",
          padding: EdgeInsets.symmetric({ horizontal: 10 }),
          child: Padding({
            padding: EdgeInsets.only({ top: 7 }),
            child: Text(data.label, {
              style: new TextStyle({ fontSize: 12, color: "#ffffff", fontWeight: "700", fontFamily: node.fontFamily }),
            }),
          }),
        }),
        ...rows,
      ],
    }),
  });
}

const erdNodes: FlowNode[] = [
  {
    id: "users",
    type: "table",
    position: { x: 40, y: 60 },
    data: {
      label: "users",
      fields: [
        { name: "id", type: "int", pk: true },
        { name: "email", type: "varchar" },
        { name: "team_id", type: "int" },
      ],
    },
  },
  {
    id: "teams",
    type: "table",
    position: { x: 360, y: 40 },
    data: {
      label: "teams",
      fields: [
        { name: "id", type: "int", pk: true },
        { name: "name", type: "varchar" },
      ],
    },
  },
  {
    id: "posts",
    type: "table",
    position: { x: 360, y: 220 },
    data: {
      label: "posts",
      fields: [
        { name: "id", type: "int", pk: true },
        { name: "author_id", type: "int" },
        { name: "title", type: "varchar" },
      ],
    },
  },
];

const erdEdges: FlowEdge[] = [
  { id: "users-teams", source: "users", sourceHandle: "team_id", target: "teams", targetHandle: "id", type: "smoothstep" },
  { id: "posts-users", source: "posts", sourceHandle: "author_id", target: "users", targetHandle: "id", type: "smoothstep", markerEnd: "arrowclosed" },
];

export const CustomNodesERD: Story = {
  args: {
    width: "640px",
    height: "440px",
    widget: FlowDiagram({
      ...expose,
      nodes: erdNodes,
      edges: erdEdges,
      fitView: true,
      connectionMode: "loose",
      nodeTypes: {
        table: {
          build: tableNode,
          // one handle pair per field, pinned to the row centre on each side
          handles: (node) =>
            (node.data as TableData).fields.flatMap((field, index) => {
              const y = HEADER_HEIGHT + ROW_HEIGHT * index + ROW_HEIGHT / 2;
              return [
                { id: field.name, type: "target" as const, position: "left" as const, y },
                { id: field.name, type: "source" as const, position: "right" as const, y },
              ];
            }),
        },
      },
      config: { minimap: { visible: false } },
    }),
    description: "Custom table nodes with declared per-row handles (an ERD). Loose connection mode lets any handle connect to any other.",
  },
};

export const ReadOnly: Story = {
  args: {
    width: "560px",
    height: "400px",
    widget: FlowDiagram({
      nodes: basicNodes,
      edges: basicEdges,
      fitView: true,
      nodesDraggable: false,
      nodesConnectable: false,
      elementsSelectable: false,
      zoomOnDoubleClick: false,
      config: { controls: { showInteractive: false }, minimap: { visible: false } },
    }),
    description: "Pan and zoom only: nodes cannot be dragged, selected or connected.",
  },
};

export const PanOnScroll: Story = {
  parameters: noSnapshot,
  args: {
    width: "560px",
    height: "400px",
    widget: FlowDiagram({
      ...expose,
      nodes: basicNodes,
      edges: basicEdges,
      fitView: true,
      panOnScroll: true,
      selectionOnDrag: true,
      snapToGrid: true,
    }),
    description: "Figma-style controls: wheel pans, pinch (ctrl+wheel) zooms, dragging the pane box-selects, hold Space to pan; snap to a 15px grid.",
  },
};

function toolbarButton(label: string, onClick: () => void): Widget {
  return GestureDetector({
    onClick,
    child: Container({
      padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 4 }),
      color: "#3367d9",
      child: Text(label, { style: new TextStyle({ color: "#ffffff", fontSize: 12 }) }),
    }),
  });
}

export const ResizeToolbarReconnect: Story = {
  args: {
    width: "620px",
    height: "420px",
    widget: FlowDiagram({
      ...expose,
      nodes: [
        { id: "a", type: "input", position: { x: 60, y: 40 }, data: { label: "Select me, then resize" }, resizable: true },
        { id: "b", position: { x: 320, y: 60 }, data: { label: "Toolbar on the right" }, toolbar: { position: "right", align: "start" } },
        { id: "c", type: "output", position: { x: 180, y: 240 }, data: { label: "Drag an edge end here" } },
      ],
      edges: [
        { id: "ab", source: "a", target: "b", markerEnd: "arrowclosed" },
        { id: "ac", source: "a", target: "c", label: "reconnectable", reconnectable: "target" },
      ],
      fitView: true,
      nodeResizeOptions: { minWidth: 120, minHeight: 30, keepAspectRatio: false },
      nodeToolbar: ({ node }, ctx) =>
        Row({
          mainAxisSize: MainAxisSize.min,
          children: [
            toolbarButton("duplicate", () =>
              ctx.addNodes({ ...node, id: `${node.id}-copy-${Date.now() % 1000}`, position: { x: node.position.x + 40, y: node.position.y + 40 }, selected: false }),
            ),
            Container({ width: 2 }),
            toolbarButton("delete", () => void ctx.deleteElements({ nodes: [node] })),
          ],
        }),
      config: { minimap: { visible: false } },
    }),
    description:
      "Node a shows resize lines and corner handles while selected; the selected node gets a screen-space toolbar (duplicate/delete); edge a→c can be re-targeted by dragging its arrow end onto another handle.",
  },
};

export const TranslateExtent: Story = {
  args: {
    width: "560px",
    height: "400px",
    widget: FlowDiagram({
      ...expose,
      nodes: basicNodes,
      edges: basicEdges,
      translateExtent: [
        [0, 0],
        [600, 400],
      ],
      minZoom: 1,
      config: { background: { variant: "lines" }, minimap: { visible: false } },
    }),
    description: "The viewport cannot be panned outside the 600×400 flow region; the lines background shows the clamp.",
  },
};
