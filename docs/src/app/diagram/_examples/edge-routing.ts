import {
  Alignment,
  Border,
  BorderRadius,
  BoxDecoration,
  Center,
  Column,
  Container,
  CrossAxisAlignment,
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
  type FlowEdge,
  type FlowNode,
} from "@flitterjs/diagram";
import FlowDiagram, {
  ShapePaint,
  defaultEdge,
  rectPathD,
} from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Routing extends StatefulWidget {
  constructor(readonly theme: Theme) {
    super(theme);
  }
  createState() {
    return new RoutingState();
  }
}
class RoutingState extends State<Routing> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  nodes: FlowNode[] = [
    ["camera", "Camera", "HDMI", "video", 0, 40, "source", "#e9a44d"],
    ["microphone", "Microphone", "XLR", "audio", 0, 200, "source", "#44baa6"],
    ["console", "Console", "HDMI", "video", 0, 370, "source", "#a58aeb"],
    ["monitor", "Monitor", "HDMI", "video", 680, 40, "target", "#e9a44d"],
    ["recorder", "Recorder", "XLR", "audio", 680, 200, "target", "#44baa6"],
    ["encoder", "Encoder", "HDMI", "video", 680, 370, "target", "#a58aeb"],
  ].map(([id, label, port, signal, x, y, kind, color]) => ({
    id: String(id),
    type: String(kind),
    position: { x: Number(x), y: Number(y) },
    width: 150,
    height: 70,
    data: { label, port, signal, color },
  }));
  edges: FlowEdge[] = [
    {
      id: "video",
      source: "camera",
      target: "monitor",
      selected: true,
      data: { color: "#e9a44d" },
      waypoints: [
        { x: 245, y: 75 },
        { x: 245, y: 15 },
        { x: 610, y: 15 },
        { x: 610, y: 75 },
      ],
    },
    {
      id: "audio",
      source: "microphone",
      target: "recorder",
      data: { color: "#44baa6" },
      waypoints: [
        { x: 220, y: 235 },
        { x: 220, y: 355 },
        { x: 610, y: 355 },
        { x: 610, y: 235 },
      ],
    },
    {
      id: "console-video",
      source: "console",
      target: "encoder",
      data: { color: "#a58aeb" },
      waypoints: [
        { x: 190, y: 405 },
        { x: 190, y: 470 },
        { x: 650, y: 470 },
        { x: 650, y: 405 },
      ],
    },
  ].map((edge) => ({ ...edge, type: "step", adjusting: "ends" }));
  constructor() {
    super();
    this.nodes.unshift({
      id: "rack",
      type: "obstacle",
      position: { x: 300, y: 125 },
      width: 220,
      height: 200,
      data: { label: "Equipment\nrack" },
      draggable: false,
      selectable: false,
      zIndex: -1,
    });
  }
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#101b24",
          card: "#1d303c",
          ink: "#e8f0f6",
          mute: "#99afbd",
          line: "#426071",
        }
      : {
          bg: "#f4f8fb",
          card: "#e4edf3",
          ink: "#253d4b",
          mute: "#617c8e",
          line: "#9eb5c4",
        };
  }
  text(value: string, size = 16, color = this.c.ink) {
    return Text(value, {
      style: new TextStyle({ fontFamily: "system-ui", fontSize: size, color }),
    });
  }
  button(label: string, action: () => void, active = false) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.stopPropagation();
        action();
        this.setState();
      },
      child: Container({
        padding: EdgeInsets.symmetric({ horizontal: 12, vertical: 10 }),
        decoration: new BoxDecoration({
          color: active ? this.c.card : this.c.bg,
          borderRadius: BorderRadius.circular(6),
        }),
        child: this.text(label, 14),
      }),
    });
  }
  route(type: "step" | "bezier") {
    this.flow.history.mark("Change cable routing");
    this.flow.run(
      () =>
        this.flow.setEdges((edges) => edges.map((edge) => ({ ...edge, type }))),
      { history: "merge" },
    );
  }
  clearBends() {
    this.flow.history.mark("Clear cable bends");
    this.flow.run(
      () =>
        this.flow.setEdges((edges) =>
          edges.map((edge) => ({ ...edge, waypoints: [] })),
        ),
      { history: "merge" },
    );
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      viewport: { minZoom: 0.15, fitView: { padding: 0.14, maxZoom: 1 } },
      interaction: {
        edit: { waypoints: true },
        connect: {
          reconnect: true,
          reconnectRadius: 18,
          validate: (connection) =>
            this.flow.getNode(connection.source)?.data.signal ===
            this.flow.getNode(connection.target)?.data.signal,
        },
        drag: { snap: { grid: [10, 10] } },
      },
      config: {
        colorMode: this.widget.theme,
        colors: { background: c.bg, edgeStroke: c.line },
        edge: { strokeWidth: 4 },
        minimap: { visible: false },
        controls: { showInteractive: false },
      },
      nodeOptions: {
        source: {
          handles: [
            { type: "source", position: "right", width: 14, height: 14 },
          ],
        },
        target: {
          handles: [
            { type: "target", position: "left", width: 14, height: 14 },
          ],
        },
        obstacle: { handles: [] },
      },
      custom: {
        node: ({ node, isSelected }) =>
          node.type === "obstacle"
            ? Stack({
                fit: StackFit.expand,
                children: [
                  ShapePaint({
                    width: 220,
                    height: 200,
                    shapes: {
                      body: {
                        d: rectPathD(2, 2, 216, 196, 10),
                        fill: c.card,
                        stroke: c.line,
                        strokeWidth: 1.5,
                        dash: [7, 7],
                      },
                    },
                  }),
                  Center({ child: this.text("Equipment\nrack", 20, c.mute) }),
                ],
              })
            : Container({
                padding: EdgeInsets.symmetric({ horizontal: 16, vertical: 10 }),
                alignment: Alignment.centerLeft,
                decoration: new BoxDecoration({
                  color: c.card,
                  borderRadius: BorderRadius.circular(35),
                  border: Border.all({
                    color: isSelected ? String(node.data.color) : c.line,
                    width: isSelected ? 2 : 1,
                  }),
                }),
                child: Column({
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    this.text(String(node.data.label), 18),
                    SizedBox({ height: 5 }),
                    this.text(String(node.data.port), 13, c.mute),
                  ],
                }),
              }),
        handle: ({ node, isConnectionCandidate, isValidCandidate }) =>
          Container({
            width: 14,
            height: 14,
            decoration: new BoxDecoration({
              shape: "circle",
              color:
                isConnectionCandidate && !isValidCandidate
                  ? "#ef4444"
                  : String(node.data.color),
              border: Border.all({ color: c.bg, width: 2 }),
            }),
          }),
        edge: (args, context) =>
          defaultEdge(
            {
              ...args,
              edge: {
                ...args.edge,
                style: {
                  stroke: String(args.edge.data?.color ?? c.line),
                  strokeWidth: args.isSelected ? 5 : 3,
                },
              },
            },
            context,
          ),
        edgeHandle: ({ edge, kind, isActive }) =>
          ShapePaint({
            width: 14,
            height: 14,
            shapes: {
              grip: {
                d:
                  kind === "waypoint"
                    ? "M7 1L13 7L7 13L1 7Z"
                    : "M2 7A5 5 0 1 0 12 7A5 5 0 1 0 2 7",
                fill:
                  isActive || kind === "waypoint"
                    ? String(edge.data?.color ?? c.ink)
                    : c.bg,
                stroke: String(edge.data?.color ?? c.ink),
                strokeWidth: 2,
              },
            },
          }),
        reconnectHandle: ({ edge, size }) =>
          SizedBox({
            width: size,
            height: size,
            child: Center({
              child: Container({
                width: 26,
                height: 26,
                decoration: new BoxDecoration({
                  shape: "circle",
                  border: Border.all({
                    color: edge.selected
                      ? String(edge.data?.color ?? c.line)
                      : "transparent",
                    width: 2,
                  }),
                }),
              }),
            }),
          }),
        controls: ({ zoomIn, zoomOut, fitView }) =>
          Row({
            mainAxisSize: MainAxisSize.min,
            children: [zoomOut, zoomIn, fitView],
          }),
      },
    });
  }
  build(): Widget {
    const routing = this.flow.edges[0]?.type ?? "step";
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
                    ? [Expanded({ child: this.text("Cable routing", 18) })]
                    : []),
                  this.button(
                    "Elbow",
                    () => this.route("step"),
                    routing === "step",
                  ),
                  this.button(
                    "Curve",
                    () => this.route("bezier"),
                    routing === "bezier",
                  ),
                  this.button("Clear bends", () => this.clearBends()),
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
export default function EdgeRouting(theme: Theme = "light"): Widget {
  return new Routing(theme);
}
