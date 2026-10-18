import type { Meta, StoryObj } from "@storybook/react";
import DualRenderer from "../../components/DualRenderer";
import {
  Container,
  EdgeInsets,
  GestureDetector,
  MainAxisSize,
  Row,
  StatelessWidget,
  Text,
  TextStyle,
  type BuildContext,
  type Widget,
} from "flitter-core";
import {
  FlowDiagram,
  FlowProvider,
  defaultNode,
  type FlowController,
  type FlowDiagramProps,
  type FlowNode,
} from "flitter-diagram";

const meta = {
  title: "Diagram/Interactions",
  component: DualRenderer,
  parameters: { chromatic: { delay: 500 } },
} satisfies Meta<typeof DualRenderer>;
export default meta;
type Story = StoryObj<typeof meta>;
type Action = { label: string; run: (flow: FlowController) => void };
class Actions extends StatelessWidget {
  constructor(readonly actions: Action[]) {
    super();
  }
  override build(context: BuildContext): Widget {
    const flow = FlowProvider.of(context);
    return Row({
      mainAxisSize: MainAxisSize.min,
      children: this.actions.map((action) =>
        GestureDetector({
          onMouseDown: (event) => event.stopPropagation(),
          onClick: (event) => {
            event.stopPropagation();
            action.run(flow);
          },
          child: Container({
            margin: EdgeInsets.only({ right: 4 }),
            padding: EdgeInsets.all(7),
            color: "#e8edf6",
            child: Text(action.label, {
              style: new TextStyle({ fontSize: 11, color: "#24334a" }),
            }),
          }),
        }),
      ),
    });
  }
}
const nodes: FlowNode[] = [
  {
    id: "a",
    position: { x: 40, y: 70 },
    data: { label: "Start" },
    width: 140,
    height: 50,
    selected: true,
    collapsible: true,
  },
  {
    id: "b",
    position: { x: 270, y: 120 },
    data: { label: "Review" },
    width: 140,
    height: 50,
  },
  {
    id: "c",
    position: { x: 270, y: 270 },
    data: { label: "Ship" },
    width: 140,
    height: 50,
  },
];
const edges = [
  { id: "ab", source: "a", target: "b" },
  { id: "bc", source: "b", target: "c" },
];
function story(
  description: string,
  props: Partial<FlowDiagramProps> = {},
  actions: Action[] = [],
): Story {
  return {
    args: {
      width: "640px",
      height: "440px",
      description,
      widget: FlowDiagram({
        nodes,
        edges,
        viewport: { initial: { x: 0, y: 0, zoom: 1 } },
        config: { minimap: { visible: false } },
        ...props,
        panels: actions.length
          ? [{ position: "top-left", child: new Actions(actions) }]
          : undefined,
      }),
    },
  };
}
export const FollowUps = story(
  "Viewer allows click selection. Zoom across 0.9 to change the LOD label; other nodes do not rebuild.",
  {
    interaction: "viewer",
    nodeTypes: {
      default: {
        lod: [0.9],
        build: (args, ctx) =>
          defaultNode(
            {
              ...args,
              node: {
                ...args.node,
                data: {
                  label:
                    ctx.zoom < 0.9
                      ? args.node.id
                      : `${args.node.data.label} — detail`,
                },
              },
            },
            ctx,
          ),
      },
    },
  },
);
export const ContextMenu = story(
  "Right-click or long-press a node, selection, edge, or empty pane. Menu actions use controller methods.",
);
export const History = story(
  "Drag, resize, connect, or delete; undo restores one complete gesture.",
  { interaction: { edit: { resize: true } } },
  [
    { label: "Undo", run: (f) => f.history.undo() },
    { label: "Redo", run: (f) => f.history.redo() },
  ],
);
export const Clipboard = story(
  "Select nodes, then copy and paste. Paste follows the pointer; duplicate uses an offset.",
  {},
  [
    { label: "Copy", run: (f) => void f.copy() },
    { label: "Paste", run: (f) => void f.paste() },
    {
      label: "Duplicate",
      run: (f) => {
        f.duplicate();
      },
    },
  ],
);
export const Keyboard = story(
  "⌘/Ctrl+A selects all. Arrows nudge; Shift multiplies by 10. +/− zoom, Shift+1 fits, Escape clears.",
  {},
  [
    { label: "Select all", run: (f) => f.selectAll() },
    { label: "Nudge →", run: (f) => f.nudge("right") },
  ],
);
export const GroupsAndOverlap = story(
  "Drop a card into the group or drag it out. Overlaps push apart only at drop.",
  {
    nodes: [
      {
        id: "group",
        type: "group",
        position: { x: 260, y: 80 },
        width: 300,
        height: 270,
        data: {},
      },
      ...nodes.map((n, i) => ({
        ...n,
        position: { x: i ? 290 : 40, y: 100 + i * 80 },
      })),
    ],
    interaction: { drag: { overlap: "push" } },
  },
);
export const InlineEdit = story(
  "Double-click a label. Enter or blur commits; Escape cancels; undo restores the label.",
  { interaction: { edit: { text: true, resize: true } } },
);
export const SnapGuides = story(
  "Drag or resize near another card's edges or centre. Dashed guide lines have an independent rebuild signal.",
  {
    interaction: {
      drag: { snap: { guides: true, radius: 8 } },
      edit: { resize: true },
    },
  },
);
export const Waypoints = story(
  "Drag a midpoint to insert a bend; drag a pin to move it; double-click a pin to remove it. Escape cancels.",
  {
    edges: [
      {
        ...edges[0],
        type: "smoothstep",
        selected: true,
        waypoints: [{ x: 220, y: 230 }],
      },
      edges[1],
    ],
    interaction: { edit: { waypoints: true } },
  },
);
export const Helpers = story(
  "Collapse/expand Start, split its edge, delete a middle node with reconnect, or align/distribute the selection.",
  {},
  [
    { label: "Collapse", run: (f) => f.toggleCollapsed("a") },
    {
      label: "Split",
      run: (f) =>
        f.insertNodeOnEdge("ab", {
          id: `new-${Date.now()}`,
          position: { x: 180, y: 220 },
          data: { label: "Inserted" },
        }),
    },
    {
      label: "Remove middle",
      run: (f) => void f.deleteElements(["b"], { reconnect: true }),
    },
    {
      label: "Align",
      run: (f) =>
        f.alignNodes(
          f.getSelectedNodes().map((n) => n.id),
          "top",
        ),
    },
    {
      label: "Distribute",
      run: (f) =>
        f.distributeNodes(
          f.getSelectedNodes().map((n) => n.id),
          "x",
        ),
    },
  ],
);
