import { defaultNode } from "@/components/diagram/flow-diagram";
import { Stack as DiagramStack, StackFit as DiagramStackFit } from "flitter-ui";
import {
  layout as baseLayout,
  positionOverlay,
} from "@/components/diagram/flow-diagram";
/**
 * Live micro-demos for /diagram/interactions, keyed by cell id
 * (`_data/interactions/cells.ts`). Factories sit at module scope so
 * `LiveDiagram` keeps them stable; each rebuilds only on a theme flip.
 */
import {
  Alignment,
  Border,
  BorderRadius,
  BoxDecoration,
  Container,
  EdgeInsets,
  GestureDetector,
  MainAxisSize,
  Row,
  SizedBox,
  Text,
  TextStyle,
  type Widget,
} from "flitter-ui";
import {
  FlowDiagramController,
  circularLayout,
  deepMerge,
  forceLayout,
  gridLayout,
  layeredLayout,
  treeLayout,
  type DeepPartial,
  type FlowEdge,
  type FlowNode,
  type LayoutAlgorithm,
  type NodeCustom,
  type NodeCustomArgs,
} from "flitter-ui/diagram";
import FlowDiagram, {
  type DefaultFlowConfig,
  type FlowDiagramProps,
} from "@/components/diagram/flow-diagram";
import type { Theme } from "@/lib/theme";
import type { CellId } from "../_data/interactions/cells";

const ACCENT = "#3367d9";
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";

function siteConfig(
  theme: Theme,
  extra: DeepPartial<DefaultFlowConfig> = {},
): DeepPartial<DefaultFlowConfig> {
  return deepMerge(
    {
      colorMode: theme,
      colors: { background: theme === "dark" ? "#14171c" : "#ffffff" },
      controls: { visible: false },
      minimap: { visible: false },
    } as DeepPartial<DefaultFlowConfig>,
    extra,
  );
}

const node = (
  id: string,
  x: number,
  y: number,
  label: string,
  extra: Partial<FlowNode> = {},
): FlowNode => ({
  id,
  position: { x, y },
  data: { label },
  ...extra,
});
const edge = (
  source: string,
  target: string,
  extra: Partial<FlowEdge> = {},
): FlowEdge => ({
  id: `${source}-${target}`,
  source,
  target,
  ...extra,
});

type Extra = Omit<FlowDiagramProps, "data" | "config">;

/** A module-scope factory for a small graph. */
function demo(
  nodes: FlowNode[],
  edges: FlowEdge[],
  extra: Extra | (() => Extra) = {},
  config: DeepPartial<DefaultFlowConfig> = {},
) {
  return (theme: Theme): Widget =>
    FlowDiagram({
      data: { nodes, edges },

      viewport: { fitView: { padding: 0.35, maxZoom: 1 } },
      ...(typeof extra === "function" ? extra() : extra),
      config: siteConfig(theme, config),
    });
}

function button(label: string, onClick: () => void): Widget {
  return GestureDetector({
    onClick,
    cursor: "pointer",
    child: Container({
      padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 4 }),
      decoration: new BoxDecoration({
        color: ACCENT,
        borderRadius: BorderRadius.circular(4),
      }),
      child: Text(label, {
        style: new TextStyle({
          color: "#ffffff",
          fontSize: 11,
          fontFamily: FONT,
        }),
      }),
    }),
  });
}

function buttons(items: [string, () => void][]): Widget {
  return Row({
    mainAxisSize: MainAxisSize.min,
    children: items.flatMap(([label, onClick], i) =>
      i === 0
        ? [button(label, onClick)]
        : [SizedBox({ width: 4 }), button(label, onClick)],
    ),
  });
}

/** A plain card whose border turns accent when `lit` says so. */
function tile(
  lit: (args: NodeCustomArgs) => boolean,
  badge?: (args: NodeCustomArgs) => string | null,
): NodeCustom<DefaultFlowConfig> {
  return (args, context) => {
    const { colors } = context.config;
    const on = lit(args);
    const extra = badge?.(args);
    return Container({
      width: 130,
      padding: EdgeInsets.all(10),
      alignment: Alignment.center,
      decoration: new BoxDecoration({
        color: colors.nodeBackground,
        border: Border.all({
          color: on ? ACCENT : colors.nodeBorder,
          width: on ? 2 : 1,
        }),
        borderRadius: BorderRadius.circular(4),
      }),
      child: Text(
        `${String(args.node.data.label)}${extra ? `  ${extra}` : ""}`,
        {
          style: new TextStyle({
            color: colors.nodeColor,
            fontSize: 12,
            fontFamily: FONT,
          }),
        },
      ),
    });
  };
}

/* ── Shared graphs ───────────────────────────────────────── */

const chainNodes = [
  node("a", 0, 0, "Draft", { type: "input" }),
  node("b", 0, 110, "Review"),
  node("c", 0, 220, "Publish", { type: "output" }),
];
const chainEdges = [edge("a", "b"), edge("b", "c")];
const chain = demo(chainNodes, chainEdges);

const rowNodes = [
  node("a", 0, 0, "Fetch", { type: "input" }),
  node("b", 200, 0, "Parse"),
  node("c", 400, 0, "Store", { type: "output" }),
];

/* ── Cells ───────────────────────────────────────────────── */

const hover = demo(
  [
    node("hub", 160, 0, "Hub"),
    node("x", 0, 130, "Left"),
    node("y", 160, 130, "Middle"),
    node("z", 320, 130, "Right"),
    node("far", 320, 0, "Unrelated"),
  ],
  [edge("hub", "x"), edge("hub", "y"), edge("hub", "z")],
  {
    custom: {
      node: (args, ctx) => {
        const views: Record<string, typeof defaultNode> = {
          default: tile(
            ({ isHovered: hovered, isNeighbour }) => hovered || isNeighbour,
          ),
        };
        return (
          views[args.node.type ?? "default"] ??
          views.default ??
          defaultNode
        )(args, ctx);
      },
    },
  },
);

const front = demo(
  [
    node("a", 0, 0, "Bottom card"),
    node("b", 50, 22, "Middle card"),
    node("c", 100, 44, "Top card"),
  ],
  [],
);

const connect = demo(
  [
    node("a", 0, 0, "Source", { type: "input" }),
    node("b", 220, 0, "Source", { type: "input" }),
    node("c", 0, 150, "Target", { type: "output" }),
    node("d", 220, 150, "Target", { type: "output" }),
  ],
  [edge("a", "c")],
);

function dropConnection(theme: Theme): Widget {
  const flow = new FlowDiagramController();
  return demo([node("a", 0, 0, "Drag from my handle", { type: "input" })], [], {
    controller: flow,
    viewport: { fitView: { padding: 1.2, maxZoom: 1 } },
    on: {
      connectEnd: ({ state, dropPosition }) => {
        if (state.toNode) return;
        const id = `n${flow.getNodes().length}`;
        flow.addNodes(
          node(id, dropPosition.x - 75, dropPosition.y, "New node"),
        );
        flow.addEdges(edge(state.fromNode.id, id));
      },
    },
  })(theme);
}

const deleteVeto = demo(
  [
    node("start", 0, 0, "Start (kept)", { type: "input" }),
    node("b", 0, 110, "Delete me"),
    node("c", 200, 110, "Or me", { type: "output" }),
  ],
  [edge("start", "b"), edge("start", "c")],
  { on: { beforeDelete: ({ nodes }) => nodes.every((n) => n.id !== "start") } },
);

const groups = demo(
  [
    node("stage", 0, 0, "Stage", { type: "group", width: 300, height: 180 }),
    node("in", 20, 50, "Inside", { parentId: "stage" }),
    node("loose", 360, 60, "Drag me in"),
  ],
  [],
  {
    interaction: { drag: { dropIntoGroup: true } },
    custom: {
      node: (args, ctx) => {
        const views: Record<string, typeof defaultNode> = {
          group: tile(({ isDropTarget }) => isDropTarget),
        };
        return (
          views[args.node.type ?? "default"] ??
          views.default ??
          defaultNode
        )(args, ctx);
      },
    },
  },
);

const layouts: [string, LayoutAlgorithm][] = [
  ["Layered", layeredLayout],
  ["Tree", treeLayout],
  ["Force", forceLayout],
  ["Grid", gridLayout],
  ["Circular", circularLayout],
];

function layout(theme: Theme): Widget {
  const flow = new FlowDiagramController();
  const ids = ["Gateway", "Auth", "Orders", "Users", "Stock"];
  return demo(
    ids.map((id) => node(id, 0, 0, id)),
    [
      edge("Gateway", "Auth"),
      edge("Gateway", "Orders"),
      edge("Auth", "Users"),
      edge("Orders", "Stock"),
    ],
    {
      controller: flow,
      layout: { algorithm: layeredLayout, options: { rankSpacing: 70 } },
      custom: {
        layout: (args, ctx) =>
          DiagramStack({
            fit: DiagramStackFit.expand,
            children: [
              baseLayout(args, ctx),
              ...[
                {
                  position: "top-left",
                  child: buttons(
                    layouts.map(([label, algorithm]) => [
                      label,
                      () => void flow.layout(algorithm, { fitView: true }),
                    ]),
                  ),
                },
              ].map(({ position, child }) =>
                positionOverlay(
                  position as import("flitter-ui/diagram").PanelPosition,
                  child,
                ),
              ),
            ],
          }),
      },
    },
  )(theme);
}

const readOnly = demo(chainNodes, chainEdges, { interaction: "viewer" });

const resize = demo(
  [
    node("a", 0, 0, "Resize me", { selected: true }),
    node("b", 0, 140, "Neighbour", { type: "output" }),
  ],
  [edge("a", "b")],
  { interaction: { edit: { resize: { minWidth: 80, minHeight: 36 } } } },
);

const waypoints = demo(
  [
    node("a", 0, 0, "From", { type: "input" }),
    node("b", 260, 160, "To", { type: "output" }),
  ],
  [edge("a", "b", { waypoints: [{ x: 75, y: 110 }] })],
  { interaction: { edit: { waypoints: true } } },
);

const snapGuides = demo(
  [node("a", 0, 0, "Anchor"), node("b", 220, 70, "Drag me level")],
  [],
  { interaction: { drag: { snap: { grid: [20, 20], guides: true } } } },
);

const overlap = demo(
  [node("a", 0, 0, "Drop onto me"), node("b", 220, 90, "Drag me")],
  [],
  {
    interaction: { drag: { overlap: "push" } },
    custom: {
      node: (args, ctx) => {
        const views: Record<string, typeof defaultNode> = {
          default: tile(({ isOverlapping }) => isOverlapping),
        };
        return (
          views[args.node.type ?? "default"] ??
          views.default ??
          defaultNode
        )(args, ctx);
      },
    },
  },
);

/** A card whose own chevron folds the subtree below it. */
const teamCard: NodeCustom<DefaultFlowConfig> = (
  { node: n, isCollapsed: collapsed, hiddenChildCount },
  context,
) => {
  const { colors } = context.config;
  const style = new TextStyle({
    color: colors.nodeColor,
    fontSize: 12,
    fontFamily: FONT,
  });
  const chevron = GestureDetector({
    cursor: "pointer",
    onMouseDown: (event) => event.stopPropagation(),
    onClick: (event) => {
      event.stopPropagation();
      context.toggleCollapsed(n.id);
    },
    child: Container({
      padding: EdgeInsets.symmetric({ horizontal: 4 }),
      child: Text(collapsed ? "▸" : "▾", {
        style: new TextStyle({ color: ACCENT, fontSize: 16, fontFamily: FONT }),
      }),
    }),
  });
  return Container({
    width: 130,
    padding: EdgeInsets.all(10),
    alignment: Alignment.center,
    decoration: new BoxDecoration({
      color: colors.nodeBackground,
      border: Border.all({
        color: collapsed ? ACCENT : colors.nodeBorder,
        width: collapsed ? 2 : 1,
      }),
      borderRadius: BorderRadius.circular(4),
    }),
    child: Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(String(n.data.label), { style }),
        ...(collapsed
          ? [
              SizedBox({ width: 6 }),
              Text(`+${hiddenChildCount}`, {
                style: new TextStyle({
                  color: ACCENT,
                  fontSize: 12,
                  fontFamily: FONT,
                }),
              }),
            ]
          : []),
        ...(n.collapsible ? [SizedBox({ width: 4 }), chevron] : []),
      ],
    }),
  });
};

const collapse = demo(
  [
    node("lead", 110, 0, "Lead", { collapsible: true }),
    node("x", 0, 120, "Engineer"),
    node("y", 220, 120, "Designer"),
  ],
  [edge("lead", "x"), edge("lead", "y")],
  {
    custom: {
      node: (args, ctx) => {
        const views: Record<string, typeof defaultNode> = { default: teamCard };
        return (
          views[args.node.type ?? "default"] ??
          views.default ??
          defaultNode
        )(args, ctx);
      },
    },
  },
);

const insertOnEdge = demo(
  [
    node("a", 0, 0, "Trigger", { type: "input" }),
    node("b", 0, 200, "Action", { type: "output" }),
  ],
  [edge("a", "b", { label: "+" })],
  {
    custom: {
      edgeLabel: ({ edge: e, isHovered: hovered, x, y }, flow) =>
        hovered
          ? button("+", () => {
              // Make room below the new step, then drop it on the label anchor.
              for (const other of flow.getNodes()) {
                if (other.position.y > y)
                  flow.updateNode(other.id, {
                    position: { x: other.position.x, y: other.position.y + 90 },
                  });
              }
              flow.insertNodeOnEdge(
                e.id,
                node(`n${flow.getNodes().length}`, x - 75, y - 18, "New step"),
              );
              void flow.fitView({ padding: 0.35, maxZoom: 1, duration: 200 });
            })
          : SizedBox.shrink(),
    },
  },
);

function deleteReconnect(theme: Theme): Widget {
  const flow = new FlowDiagramController();
  return demo(chainNodes, chainEdges, {
    controller: flow,
    custom: {
      layout: (args, ctx) =>
        DiagramStack({
          fit: DiagramStackFit.expand,
          children: [
            baseLayout(args, ctx),
            ...[
              {
                position: "top-left",
                child: button(
                  "Remove review",
                  () => void flow.deleteElements(["b"], { reconnect: true }),
                ),
              },
            ].map(({ position, child }) =>
              positionOverlay(
                position as import("flitter-ui/diagram").PanelPosition,
                child,
              ),
            ),
          ],
        }),
    },
  })(theme);
}

function align(theme: Theme): Widget {
  const flow = new FlowDiagramController();
  const selected = () => flow.getSelectedNodes().map((n) => n.id);
  return demo(
    [
      node("a", 0, 0, "One"),
      node("b", 60, 90, "Two"),
      node("c", 20, 200, "Three"),
    ],
    [],
    {
      controller: flow,
      custom: {
        layout: (args, ctx) =>
          DiagramStack({
            fit: DiagramStackFit.expand,
            children: [
              baseLayout(args, ctx),
              ...[
                {
                  position: "top-left",
                  child: buttons([
                    ["Align left", () => flow.alignNodes(selected(), "left")],
                    ["Distribute", () => flow.distributeNodes(selected(), "y")],
                  ]),
                },
              ].map(({ position, child }) =>
                positionOverlay(
                  position as import("flitter-ui/diagram").PanelPosition,
                  child,
                ),
              ),
            ],
          }),
      },
    },
  )(theme);
}

export const interactionDemos: Record<CellId, (theme: Theme) => Widget> = {
  "pan-zoom": chain,
  touch: chain,
  drag: demo(rowNodes, []),
  select: demo(
    [
      node("a", 0, 0, "One"),
      node("b", 200, 0, "Two"),
      node("c", 0, 110, "Three"),
      node("d", 200, 110, "Four"),
    ],
    [],
  ),
  hover,
  front,
  connect,
  "drop-connection": dropConnection,
  "context-menu": chain,
  delete: deleteVeto,
  undo: chain,
  clipboard: demo(rowNodes, [edge("a", "b")]),
  keyboard: demo(rowNodes, []),
  groups,
  layout,
  "read-only": readOnly,
  "text-edit": demo(chainNodes, chainEdges, {
    interaction: { edit: { text: true } },
  }),
  resize,
  waypoints,
  "snap-guides": snapGuides,
  overlap,
  collapse,
  "insert-on-edge": insertOnEdge,
  "delete-reconnect": deleteReconnect,
  align,
};
