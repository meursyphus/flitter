import { defaultNode } from "@/components/diagram/flow-diagram";
import {
  SizedBox,
  LayoutBuilder,
  Alignment,
  Border,
  BorderRadius,
  BoxDecoration,
  Container,
  EdgeInsets,
  GestureDetector,
  MainAxisSize,
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
  type FlowNode,
  type FlowEdge,
} from "flitter-ui/diagram";
import FlowDiagram, {
  EditableLabel,
  ShapePaint,
} from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Process extends StatefulWidget {
  constructor(readonly theme: Theme) {
    super(theme);
  }
  createState() {
    return new ProcessState();
  }
}
class ProcessState extends State<Process> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  nodes: FlowNode[] = [
    {
      id: "pool",
      type: "lane",
      position: { x: 0, y: 0 },
      width: 1050,
      height: 500,
      data: { label: "ACME PROCUREMENT" },
      draggable: false,
    },
    {
      id: "sales",
      type: "lane",
      parentId: "pool",
      position: { x: 30, y: 45 },
      width: 990,
      height: 230,
      data: { label: "SALES OPERATIONS" },
      draggable: false,
    },
    {
      id: "finance",
      type: "lane",
      parentId: "pool",
      position: { x: 30, y: 295 },
      width: 990,
      height: 190,
      data: { label: "FINANCE" },
      draggable: false,
    },
    {
      id: "start",
      type: "event",
      parentId: "sales",
      position: { x: 45, y: 95 },
      width: 46,
      height: 46,
      data: { label: "", end: false },
    },
    {
      id: "review",
      type: "task",
      parentId: "sales",
      position: { x: 155, y: 75 },
      width: 165,
      height: 84,
      selected: true,
      data: { label: "Review purchase\nrequest" },
    },
    {
      id: "decision",
      type: "gateway",
      parentId: "sales",
      position: { x: 390, y: 75 },
      width: 84,
      height: 84,
      data: { label: "Approved?" },
    },
    {
      id: "order",
      type: "task",
      parentId: "sales",
      position: { x: 555, y: 75 },
      width: 165,
      height: 84,
      data: { label: "Create purchase\norder" },
    },
    {
      id: "end",
      type: "event",
      parentId: "sales",
      position: { x: 830, y: 95 },
      width: 46,
      height: 46,
      data: { label: "", end: true },
    },
    {
      id: "budget",
      type: "task",
      parentId: "finance",
      position: { x: 390, y: 55 },
      width: 165,
      height: 84,
      data: { label: "Request budget\nrevision" },
    },
  ];
  edges: FlowEdge[] = [
    { id: "s-r", source: "start", target: "review" },
    { id: "r-d", source: "review", target: "decision" },
    { id: "d-o", source: "decision", target: "order", label: "Yes" },
    { id: "o-e", source: "order", target: "end" },
    {
      id: "d-b",
      source: "decision",
      sourceHandle: "bottom",
      target: "budget",
      label: "No",
      waypoints: [
        { x: 462, y: 295 },
        { x: 385, y: 295 },
        { x: 385, y: 392 },
      ],
    },
  ].map((e) => ({
    ...e,
    type: "smoothstep",
    markerEnd: "arrowclosed",
    adjusting: "ends",
  }));
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#171d22",
          card: "#26343d",
          ink: "#e3f0f5",
          line: "#496575",
          muted: "#8ba8b8",
        }
      : {
          bg: "#f7fafc",
          card: "#ffffff",
          ink: "#254557",
          line: "#bed1dc",
          muted: "#7893a3",
        };
  }
  text(value: string, size = 11, color = this.c.ink) {
    return Text(value, {
      style: new TextStyle({
        fontFamily: "system-ui",
        fontSize: Math.max(13, size),
        color,
      }),
    });
  }
  button(label: string, fn: (event: MouseEvent) => void) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.stopPropagation();
        fn(e);
      },
      child: Container({
        padding: EdgeInsets.all(8),
        color: this.c.card,
        child: this.text(label, 10, "#228ab1"),
      }),
    });
  }
  append(source: FlowNode, type: "task" | "gateway" | "event") {
    const size =
      type === "task"
        ? { width: 165, height: 84 }
        : type === "gateway"
          ? { width: 84, height: 84 }
          : { width: 46, height: 46 };
    const id = createId(type);
    this.flow.history.mark("Append process element");
    this.flow.run(
      () => {
        this.flow.addNodes({
          id,
          type,
          parentId: source.parentId,
          position: {
            x: source.position.x + (source.width ?? 165) + 70,
            y: source.position.y,
          },
          ...size,
          data: {
            label:
              type === "task"
                ? "New task"
                : type === "gateway"
                  ? "Condition?"
                  : "",
            end: type === "event",
          },
          selected: false,
        });
        this.flow.addEdges({
          id: `edge-${id}`,
          source: source.id,
          target: id,
          type: "smoothstep",
          markerEnd: "arrowclosed",
        });
        this.flow.selectNodes([id]);
      },
      { history: "merge" },
    );
  }
  createDiagram(): Widget {
    const c = this.c;
    const ports = [
      { type: "target" as const, position: "left" as const },
      { type: "source" as const, position: "right" as const },
      { id: "bottom", type: "source" as const, position: "bottom" as const },
    ];
    const toolbar = ({ node }: { node: FlowNode }) =>
      Container({
        padding: EdgeInsets.all(4),
        decoration: new BoxDecoration({
          color: c.card,
          border: Border.all({ color: c.line, width: 1 }),
          borderRadius: BorderRadius.circular(6),
        }),
        child: Row({
          mainAxisSize: MainAxisSize.min,
          children: [
            this.button("+ Task", () => this.append(node, "task")),
            this.button("◇", () => this.append(node, "gateway")),
            this.button("◎", () => this.append(node, "event")),
            this.button("Connect →", (event) =>
              this.flow.handleHandleClick(node.id, null, "source", event),
            ),
            this.button(
              "Delete",
              () => void this.flow.deleteElements({ nodes: [node] }),
            ),
          ],
        }),
      });
    return FlowDiagram({
      controller: this.flow,
      data: {
        nodes: this.nodes.map((node) => ({
          ...node,
          toolbar: { position: "top", align: "start", offset: 4 },
        })),
        edges: this.edges,
      },
      viewport: { minZoom: 0.2, fitView: { padding: 0.12, maxZoom: 1 } },
      interaction: {
        edit: { text: true, waypoints: true },
        drag: { snap: { grid: [10, 10], guides: true } },
        contextMenu: { enabled: false },
      },
      config: {
        edgeLabel: { fontSize: 13 },
        colorMode: this.widget.theme,
        colors: { background: c.bg, edgeStroke: "#688fa2" },
        node: { fontSize: 14 },
        minimap: { visible: false },
        edge: { strokeWidth: 1.5 },
      },
      custom: {
        node: (args, ctx) => {
          const views: Record<string, typeof defaultNode> = {
            lane: ({ node }) =>
              Container({
                padding: EdgeInsets.all(12),
                decoration: new BoxDecoration({
                  color: c.bg,
                  border: Border.all({ color: c.line, width: 1 }),
                }),
                child: this.text(String(node.data.label), 10, c.muted),
              }),
            task: (args, ctx) =>
              Container({
                alignment: Alignment.center,
                padding: EdgeInsets.all(10),
                decoration: new BoxDecoration({
                  color: c.card,
                  border: Border.all({
                    color: args.isSelected ? "#228ab1" : c.line,
                    width: 2,
                  }),
                  borderRadius: BorderRadius.circular(10),
                }),
                child: EditableLabel(args, ctx),
              }),
            gateway: (args, ctx) =>
              Stack({
                fit: StackFit.expand,
                children: [
                  ShapePaint({
                    width: 84,
                    height: 84,
                    shapes: {
                      diamond: {
                        d: "M42 2 L82 42 L42 82 L2 42 Z",
                        fill: c.card,
                        stroke: args.isSelected ? "#228ab1" : c.line,
                        strokeWidth: 2,
                      },
                    },
                  }),
                  Container({
                    alignment: Alignment.center,
                    padding: EdgeInsets.all(12),
                    child: args.isEditing
                      ? EditableLabel(args, ctx)
                      : this.text(String(args.node.data.label), 10),
                  }),
                ],
              }),
            event: ({ node, isSelected: selected }) =>
              Container({
                decoration: new BoxDecoration({
                  shape: "circle",
                  color: c.card,
                  border: Border.all({
                    color: selected ? "#228ab1" : c.ink,
                    width: node.data.end ? 4 : 2,
                  }),
                }),
              }),
          };
          return (
            views[args.node.type ?? "default"] ??
            views.default ??
            defaultNode
          )(args, ctx);
        },
        nodeToolbar: (args, ctx) => {
          const views: Record<
            string,
            (
              args: Parameters<typeof defaultNode>[0],
              ctx: Parameters<typeof defaultNode>[1],
            ) => import("flitter-ui").Widget
          > = { task: toolbar, gateway: toolbar, event: toolbar };
          const view = views[args.node.type ?? "default"] ?? views.default;
          return view
            ? view(args as Parameters<typeof defaultNode>[0], ctx)
            : SizedBox.shrink();
        },
      },
      nodeOptions: {
        lane: { group: true, handles: [] },
        task: { handles: ports },
        gateway: { handles: ports },
        event: { handles: ports },
      },
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
            child: Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                this.text("PURCHASE APPROVAL", 12),
                this.button("Undo", () => this.flow.history.undo()),
                this.button(
                  "Fit process",
                  () =>
                    void this.flow.fitView({
                      padding: 0.12,
                      minZoom: 0.8,
                      maxZoom: 1,
                    }),
                ),
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
                      "Select → append · double-click → rename · select an edge → drag its bend pins",
                      10,
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
export default function ProcessDiagram(theme: Theme = "light"): Widget {
  return new Process(theme);
}
