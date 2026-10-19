import { defaultEdgePath } from "@/components/diagram/flow-diagram";
import { defaultNode } from "@/components/diagram/flow-diagram";
import {
  SizedBox,
  LayoutBuilder,
  Alignment,
  Border,
  BorderRadius,
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisSize,
  GestureDetector,
  Positioned,
  Row,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  Text,
  TextStyle,
  type Widget,
} from "flitter-ui";
import {
  FlowDiagramController,
  createId,
  getBezierPath,
  layeredLayout,
  type FlowNode,
  type FlowEdge,
} from "flitter-ui/diagram";
import FlowDiagram, { defaultEdge } from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Scenario extends StatefulWidget {
  constructor(readonly theme: Theme) {
    super(theme);
  }
  createState() {
    return new ScenarioState();
  }
}
class ScenarioState extends State<Scenario> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  nodes: FlowNode[] = [
    {
      id: "stripe",
      position: { x: 0, y: 150 },
      data: {
        label: "Watch payments",
        app: "Stripe",
        icon: "S",
        color: "#7c3aed",
        note: "Every 15 minutes",
      },
    },
    {
      id: "router",
      position: { x: 280, y: 150 },
      data: {
        label: "Route payment",
        app: "Router",
        icon: "↗",
        color: "#609b22",
        note: "First matching route wins",
      },
    },
    {
      id: "sales",
      position: { x: 800, y: 0 },
      data: {
        label: "Create deal",
        app: "HubSpot",
        icon: "H",
        color: "#ea580c",
        note: "$1,000+ · sales pipeline",
      },
    },
    {
      id: "billing",
      position: { x: 800, y: 170 },
      data: {
        label: "Send invoice",
        app: "Gmail",
        icon: "M",
        color: "#dc2626",
        note: "Paid · receipt attached",
      },
    },
    {
      id: "review",
      position: { x: 800, y: 340 },
      data: {
        label: "Manual review",
        app: "Notion",
        icon: "N",
        color: "#596579",
        note: "Never drop a payment",
      },
    },
  ].map((n) => ({ ...n, type: "module", width: 190, height: 155 }));
  edges: FlowEdge[] = [
    {
      id: "trigger",
      source: "stripe",
      target: "router",
      label: "Payment received",
    },
    {
      id: "priority",
      source: "router",
      target: "sales",
      label: "1 · amount ≥ $1,000",
      data: { order: 1, note: "Enterprise customers" },
    },
    {
      id: "paid",
      source: "router",
      target: "billing",
      label: "2 · status = paid",
      data: { order: 2, note: "Email the billing contact" },
    },
    {
      id: "fallback",
      source: "router",
      target: "review",
      label: "Fallback",
      data: { order: 3, note: "Review unmatched events" },
    },
  ];
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#1b1526",
          card: "#2a2138",
          ink: "#f4eafa",
          muted: "#b3a1c4",
          border: "#4b3b5f",
        }
      : {
          bg: "#faf6ff",
          card: "#ffffff",
          ink: "#392847",
          muted: "#927a9f",
          border: "#e7daf1",
        };
  }
  text(value: string, size = 12, color = this.c.ink) {
    return Text(value, {
      style: new TextStyle({
        fontFamily: "system-ui",
        fontSize: Math.max(13, size),
        color,
      }),
    });
  }
  button(label: string, fn: () => void) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.stopPropagation();
        fn();
      },
      child: Container({
        padding: EdgeInsets.all(10),
        child: this.text(label, 11, "#a86aef"),
      }),
    });
  }
  async order() {
    const sorted = [...this.flow.edges].sort(
      (a, b) => Number(a.data?.order ?? 0) - Number(b.data?.order ?? 0),
    );
    this.flow.setEdges(sorted);
    // Stable target order becomes the cross-axis order used by the layered layout.
    const ids = [...new Set(sorted.flatMap((e) => [e.source, e.target]))];
    this.flow.setNodes((ns) => [
      ...ids.flatMap((id) => ns.filter((n) => n.id === id)),
      ...ns.filter((n) => !ids.includes(n.id)),
    ]);
    await this.flow.layout(layeredLayout, {
      direction: "LR",
      nodeSpacing: 40,
      rankSpacing: 340,
    });
  }
  insertRouter(edgeId: string) {
    const edge = this.flow.getEdge(edgeId);
    if (!edge) return;
    const a = this.flow.getNodePositionAbsolute(
        this.flow.getNode(edge.source)!,
      ),
      b = this.flow.getNodePositionAbsolute(this.flow.getNode(edge.target)!);
    this.flow.insertNodeOnEdge(edgeId, {
      id: createId("router"),
      type: "module",
      position: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + 110 },
      width: 190,
      height: 155,
      data: {
        label: "New router",
        app: "Router",
        icon: "↗",
        color: "#609b22",
        note: "Add a filter to each route",
      },
    });
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      viewport: { minZoom: 0.2, fitView: { padding: 0.12, maxZoom: 1 } },
      config: {
        edgeLabel: { fontSize: 13 },
        colorMode: this.widget.theme,
        colors: { background: c.bg, edgeStroke: "#b9a0cc" },
        edge: { strokeWidth: 2 },
        minimap: { visible: false },
        contextMenu: {},
      },
      custom: {
        edgeLabel: ({ edge, label, isHovered: hovered }) =>
          Container({
            width: 155,
            padding: EdgeInsets.all(6),
            decoration: new BoxDecoration({
              color: c.card,
              border: Border.all({
                color: hovered ? "#a86aef" : c.border,
                width: 1,
              }),
              borderRadius: BorderRadius.circular(5),
            }),
            child: Column({
              mainAxisSize: MainAxisSize.min,
              children: [
                this.text(label, 10),
                ...(edge.data?.note
                  ? [this.text(String(edge.data.note), 9, c.muted)]
                  : []),
              ],
            }),
          }),
        node: (args, ctx) => {
          const views: Record<string, typeof defaultNode> = {
            module: ({ node, isSelected: selected }) =>
              Column({
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container({
                    width: 88,
                    height: 88,
                    alignment: Alignment.center,
                    decoration: new BoxDecoration({
                      shape: "circle",
                      color: String(node.data.color),
                      border: Border.all({
                        color: selected ? "#d3a7ff" : c.card,
                        width: selected ? 5 : 3,
                      }),
                    }),
                    child: this.text(String(node.data.icon), 28, "#fff"),
                  }),
                  this.text(String(node.data.label), 13),
                  this.text(String(node.data.app), 10, c.muted),
                  this.text(String(node.data.note), 9, c.muted),
                ],
              }),
          };
          return (
            views[args.node.type ?? "default"] ??
            views.default ??
            defaultNode
          )(args, ctx);
        },
        edge: (args, ctx) => {
          const views: Record<string, typeof defaultEdge> = {
            default: defaultEdge,
          };
          return (
            views[args.edge.type ?? "default"] ??
            views.default ??
            defaultEdge
          )(args, ctx);
        },
      },
      nodeOptions: {
        module: {
          handles: [
            { type: "target", position: "left", x: 51, y: 44 },
            { type: "source", position: "right", x: 139, y: 44 },
          ],
        },
      },
      getEdgePath: (args, ctx) => {
        const paths: Record<
          string,
          (
            params: Parameters<typeof defaultEdgePath>[0]["params"],
            edge: Parameters<typeof defaultEdgePath>[0]["edge"],
          ) => ReturnType<typeof defaultEdgePath>
        > = {
          default: (params, edge) => {
            const path = getBezierPath(params);
            return {
              ...path,
              labelX:
                edge?.source === "router" ? params.targetX - 130 : path.labelX,
              labelY:
                edge?.source === "router"
                  ? params.targetY + 42
                  : path.labelY - 38,
            };
          },
        };
        const getPath = paths[args.type];
        return getPath
          ? getPath(args.params, args.edge)
          : defaultEdgePath(args, ctx);
      },
      getContextMenuItems: (args) => [
        {
          label: "Insert router",
          disabled: !this.flow.getEdge(args.ids[0]),
          onSelect: () => this.insertRouter(args.ids[0]),
        },
        {
          label: "Order routes → auto-align",
          onSelect: () => void this.order(),
        },
      ],
    });
  }
  build(): Widget {
    return Stack({
      fit: StackFit.expand,
      children: [
        (this.diagram ??= this.createDiagram()),
        Positioned({
          top: 12,
          left: 12,
          child: Container({
            padding: EdgeInsets.all(10),
            color: this.c.card,
            child: Column({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                this.text("PAYMENT OPERATIONS", 10, this.c.muted),
                Row({
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    this.button(
                      "Order routes → auto-align",
                      () => void this.order(),
                    ),
                    this.button("Undo", () => this.flow.history.undo()),
                  ],
                }),
              ],
            }),
          }),
        }),
        Positioned({
          key: "diagram-hint",
          bottom: 14,
          left: 0,
          right: 0,
          child: LayoutBuilder({
            builder: (_context, size) =>
              size.maxWidth < 500
                ? SizedBox.shrink()
                : Container({
                    padding: EdgeInsets.only({ left: 125, right: 16 }),
                    child: this.text(
                      "Right-click a connection → Insert router",
                      11,
                      this.c.muted,
                    ),
                  }),
          }),
        }),
      ],
    });
  }
  dispose() {
    this.flow.dispose();
    super.dispose();
  }
}
export default function ScenarioRouter(theme: Theme = "light"): Widget {
  return new Scenario(theme);
}
