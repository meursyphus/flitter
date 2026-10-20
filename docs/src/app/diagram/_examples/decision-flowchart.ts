import {
  Alignment,
  BorderRadius,
  BoxDecoration,
  Column,
  Container,
  EdgeInsets,
  Expanded,
  GestureDetector,
  LayoutBuilder,
  MainAxisSize,
  Row,
  SizedBox,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  Text,
  TextStyle,
  type Widget,
} from "flitterjs";
import {
  FlowDiagramController,
  createId,
  type FlowEdge,
  type FlowNode,
} from "@flitterjs/diagram";
import FlowDiagram, {
  EditableLabel,
  ShapePaint,
  rectPathD,
} from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Flowchart extends StatefulWidget {
  constructor(readonly theme: Theme) {
    super(theme);
  }
  createState() {
    return new FlowchartState();
  }
}
class FlowchartState extends State<Flowchart> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  selected = "inspect";
  nodes: FlowNode[] = [
    {
      id: "request",
      type: "terminal",
      position: { x: 350, y: 0 },
      width: 180,
      height: 56,
      data: { label: "Return requested" },
    },
    {
      id: "inspect",
      type: "process",
      position: { x: 350, y: 112 },
      width: 180,
      height: 64,
      data: { label: "Inspect item" },
    },
    {
      id: "eligible",
      type: "decision",
      position: { x: 350, y: 232 },
      width: 180,
      height: 112,
      data: { label: "Within\n30 days?" },
    },
    {
      id: "refund",
      type: "process",
      position: { x: 100, y: 394 },
      width: 180,
      height: 64,
      data: { label: "Issue refund" },
    },
    {
      id: "manual",
      type: "process",
      position: { x: 600, y: 394 },
      width: 180,
      height: 64,
      data: { label: "Manual review" },
    },
    {
      id: "paid",
      type: "terminal",
      position: { x: 100, y: 520 },
      width: 180,
      height: 56,
      data: { label: "Refunded", success: true },
    },
    {
      id: "queue",
      type: "terminal",
      position: { x: 600, y: 520 },
      width: 180,
      height: 56,
      data: { label: "Review queue" },
    },
  ];
  edges: FlowEdge[] = [
    { id: "request-inspect", source: "request", target: "inspect" },
    { id: "inspect-eligible", source: "inspect", target: "eligible" },
    {
      id: "eligible-refund",
      source: "eligible",
      sourceHandle: "left",
      target: "refund",
      label: "Yes",
    },
    {
      id: "eligible-manual",
      source: "eligible",
      sourceHandle: "right",
      target: "manual",
      label: "No",
    },
    { id: "refund-paid", source: "refund", target: "paid" },
    { id: "manual-queue", source: "manual", target: "queue" },
  ].map((edge) => ({
    ...edge,
    sourceHandle: edge.sourceHandle ?? "out",
    targetHandle: "in",
    type: "smoothstep",
    markerEnd: "arrowclosed",
  }));
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#191923",
          ink: "#f0edf7",
          edge: "#b6aecb",
          process: "#34304c",
          decision: "#574527",
          terminal: "#25463f",
          accent: "#b9a0ff",
        }
      : {
          bg: "#fcfaff",
          ink: "#342c4b",
          edge: "#9b8eb5",
          process: "#eae2fa",
          decision: "#fff0c2",
          terminal: "#d7f1e8",
          accent: "#7c4cbb",
        };
  }
  text(value: string, size = 16) {
    return Text(value, {
      style: new TextStyle({
        fontFamily: "system-ui",
        fontSize: size,
        color: this.c.ink,
      }),
    });
  }
  button(label: string, action: () => void) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.stopPropagation();
        action();
      },
      child: Container({
        padding: EdgeInsets.symmetric({ horizontal: 12, vertical: 10 }),
        decoration: new BoxDecoration({
          color: this.c.process,
          borderRadius: BorderRadius.circular(6),
        }),
        child: this.text(label, 14),
      }),
    });
  }
  append(type: "process" | "decision") {
    const parent =
      this.flow.getNode(this.selected) ?? this.flow.getNode("inspect");
    if (!parent) return;
    const id = createId(type);
    this.flow.history.mark("Append flowchart shape");
    this.flow.run(
      () => {
        const right = Math.max(
          ...this.flow.nodes.map(
            (node) => node.position.x + (node.width ?? 180),
          ),
        );
        this.flow.addNodes({
          id,
          type,
          position: { x: right + 90, y: parent.position.y },
          width: 180,
          height: type === "decision" ? 112 : 64,
          data: { label: type === "decision" ? "Condition?" : "New process" },
        });
        this.flow.addEdges({
          id: createId("transition"),
          source: parent.id,
          sourceHandle: "right",
          target: id,
          targetHandle: "side",
          type: "smoothstep",
          markerEnd: "arrowclosed",
        });
        this.flow.selectNodes([id]);
      },
      { history: "merge" },
    );
    this.setState(() => {
      this.selected = id;
    });
    void this.flow.fitView({ padding: 0.08, maxZoom: 1 });
  }
  createDiagram(): Widget {
    const c = this.c;
    const handles = [
      { id: "in", type: "target" as const, position: "top" as const },
      { id: "side", type: "target" as const, position: "left" as const },
      { id: "out", type: "source" as const, position: "bottom" as const },
      { id: "left", type: "source" as const, position: "left" as const },
      { id: "right", type: "source" as const, position: "right" as const },
    ];
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      viewport: { minZoom: 0.15, fitView: { padding: 0.06, maxZoom: 1 } },
      interaction: {
        edit: { text: true, waypoints: true },
        drag: { snap: { grid: [10, 10], guides: true } },
      },
      on: {
        nodeClick: (_event, node) =>
          this.setState(() => {
            this.selected = node.id;
          }),
      },
      config: {
        colorMode: this.widget.theme,
        node: { fontSize: 18, padding: 10 },
        colors: { background: c.bg, nodeColor: c.ink, edgeStroke: c.edge },
        edge: { strokeWidth: 2 },
        edgeLabel: { fontSize: 15 },
        minimap: { visible: false },
      },
      nodeOptions: {
        process: { handles, editable: true },
        decision: { handles, editable: true },
        terminal: { handles, editable: true },
      },
      custom: {
        background: () => Container({ color: c.bg }),
        node: (args, context) => {
          const { node, isSelected } = args,
            width = node.width ?? 180,
            height = node.height ?? 64;
          return Stack({
            fit: StackFit.expand,
            children: [
              ShapePaint({
                width,
                height,
                shapes: {
                  body: {
                    d:
                      node.type === "decision"
                        ? `M${width / 2} 2L${width - 2} ${height / 2}L${width / 2} ${height - 2}L2 ${height / 2}Z`
                        : rectPathD(
                            2,
                            2,
                            width - 4,
                            height - 4,
                            node.type === "terminal" ? height / 2 : 6,
                          ),
                    fill:
                      node.type === "decision"
                        ? c.decision
                        : node.type === "terminal"
                          ? c.terminal
                          : c.process,
                    stroke: isSelected ? c.accent : c.edge,
                    strokeWidth: isSelected ? 3 : 1.5,
                  },
                },
              }),
              Container({
                alignment: Alignment.center,
                padding: EdgeInsets.symmetric({
                  horizontal: node.type === "decision" ? 32 : 12,
                  vertical: 8,
                }),
                child: EditableLabel(args, context),
              }),
            ],
          });
        },
        handle: (args, context) =>
          args.node.selected || context.hoveredNodeId === args.node.id
            ? Container({
                width: 9,
                height: 9,
                decoration: new BoxDecoration({
                  shape: "circle",
                  color: c.accent,
                }),
              })
            : SizedBox({ width: 9, height: 9 }),
        controls: ({ zoomIn, zoomOut, fitView }) =>
          Row({
            mainAxisSize: MainAxisSize.min,
            children: [zoomOut, zoomIn, fitView],
          }),
      },
    });
  }
  build(): Widget {
    return LayoutBuilder({
      builder: (_context, size) =>
        Column({
          children: [
            Container({
              height: 54,
              color: this.c.bg,
              padding: EdgeInsets.symmetric({ horizontal: 12 }),
              child: Row({
                children: [
                  ...(size.maxWidth > 620
                    ? [Expanded({ child: this.text("Returns", 18) })]
                    : []),
                  this.button("+ Process", () => this.append("process")),
                  SizedBox({ width: 6 }),
                  this.button("+ Decision", () => this.append("decision")),
                  SizedBox({ width: 6 }),
                  this.button("Undo", () => this.flow.history.undo()),
                ],
              }),
            }),
            Expanded({ child: (this.diagram ??= this.createDiagram()) }),
          ],
        }),
    });
  }
  dispose() {
    this.flow.dispose();
    super.dispose();
  }
}
export default function DecisionFlowchart(theme: Theme = "light"): Widget {
  return new Flowchart(theme);
}
