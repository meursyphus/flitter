import { defaultNode } from "@/components/diagram/flow-diagram";
import {
  SizedBox,
  LayoutBuilder,
  Border,
  BorderRadius,
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  GestureDetector,
  InputDecoration,
  MainAxisAlignment,
  MainAxisSize,
  Opacity,
  Positioned,
  Row,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  Text,
  TextField,
  TextStyle,
  type Widget,
} from "flitterjs";
import {
  FlowDiagramController,
  createId,
  type FlowNode,
  type FlowEdge,
  type XYPosition,
  type HandleSpec,
} from "@flitterjs/diagram";
import FlowDiagram, { defaultEdge } from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
type Port = { id: string; type: string };

const kinds: Record<
  string,
  { label: string; inputs: Port[]; outputs: Port[]; detail: string }
> = {
  prompt: {
    label: "Text Encode",
    inputs: [],
    outputs: [{ id: "text", type: "text" }],
    detail: "A studio product photo, soft light",
  },
  image: {
    label: "Load Image",
    inputs: [],
    outputs: [{ id: "image", type: "image" }],
    detail: "sneaker-reference.png · 1024 × 1024",
  },
  mask: {
    label: "Remove Background",
    inputs: [{ id: "image", type: "image" }],
    outputs: [{ id: "mask", type: "mask" }],
    detail: "Subject segmentation · 0.85",
  },
  number: {
    label: "Seed",
    inputs: [],
    outputs: [{ id: "seed", type: "number" }],
    detail: "42 · fixed across runs",
  },
  sampler: {
    label: "Product Sampler",
    inputs: [
      { id: "prompt", type: "text" },
      { id: "image", type: "image" },
      { id: "mask", type: "mask" },
      { id: "seed", type: "number" },
    ],
    outputs: [{ id: "image", type: "image" }],
    detail: "Euler · 24 steps · CFG 7.5",
  },
  save: {
    label: "Save Image",
    inputs: [{ id: "image", type: "image" }],
    outputs: [],
    detail: "exports/product_00042.png",
  },
};
class Dataflow extends StatefulWidget {
  constructor(readonly theme: Theme) {
    super(theme);
  }
  createState() {
    return new DataflowState();
  }
}
class DataflowState extends State<Dataflow> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  query = "";
  search: {
    at: XYPosition;
    node: string;
    handle: string | null;
    direction: "source" | "target";
    type: string;
  } | null = null;
  make(kind: string, id: string, x: number, y: number): FlowNode {
    return {
      id,
      type: "processor",
      position: { x, y },
      width: 245,
      height:
        87 +
        Math.max(kinds[kind].inputs.length, kinds[kind].outputs.length) * 25,
      data: { kind, label: kinds[kind].label },
    };
  }
  nodes: FlowNode[] = [
    this.make("prompt", "prompt", 0, 0),
    this.make("image", "image", 0, 160),
    this.make("number", "seed", 0, 320),
    { ...this.make("sampler", "sampler", 370, 80), selected: true },
    this.make("save", "save", 740, 110),
  ];
  edges: FlowEdge[] = [
    {
      id: "text",
      source: "prompt",
      sourceHandle: "text",
      target: "sampler",
      targetHandle: "prompt",
    },
    {
      id: "pixels",
      source: "image",
      sourceHandle: "image",
      target: "sampler",
      targetHandle: "image",
    },
    {
      id: "noise",
      source: "seed",
      sourceHandle: "seed",
      target: "sampler",
      targetHandle: "seed",
    },
    {
      id: "output",
      source: "sampler",
      sourceHandle: "image",
      target: "save",
      targetHandle: "image",
    },
  ];
  get portColors(): Record<string, string> {
    return this.widget.theme === "dark"
      ? {
          image: "#60a5fa",
          mask: "#a78bfa",
          number: "#fbbf24",
          text: "#4ade80",
        }
      : {
          image: "#1d4ed8",
          mask: "#6d28d9",
          number: "#92400e",
          text: "#15803d",
        };
  }
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#11141a",
          card: "#202630",
          ink: "#e2eaf4",
          mute: "#8d9aaf",
          line: "#3b4556",
        }
      : {
          bg: "#edf1f6",
          card: "#fff",
          ink: "#233248",
          mute: "#72849d",
          line: "#cad5e3",
        };
  }
  text(value: string, size = 11, color = this.c.ink) {
    return Text(value, {
      style: new TextStyle({
        fontFamily: "ui-monospace, monospace",
        fontSize: Math.max(13, size),
        height: 1.2,
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
        padding: EdgeInsets.all(8),
        color: this.c.card,
        child: this.text(label, 10, "#60a5fa"),
      }),
    });
  }
  box(children: Widget[], width?: number) {
    return Container({
      width,
      padding: EdgeInsets.all(12),
      decoration: new BoxDecoration({
        color: this.c.card,
        border: Border.all({ color: this.c.line, width: 1 }),
        borderRadius: BorderRadius.circular(8),
      }),
      child: Column({
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children,
      }),
    });
  }
  portRow(input?: Port, output?: Port) {
    return Container({
      width: 217,
      height: 25,
      child: Row({
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          this.text(
            input?.id ?? "",
            10,
            this.portColors[input?.type ?? ""] ?? this.c.mute,
          ),
          this.text(
            output?.id ?? "",
            10,
            this.portColors[output?.type ?? ""] ?? this.c.mute,
          ),
        ],
      }),
    });
  }
  ports(n: FlowNode) {
    return n.type === "reroute"
      ? {
          inputs: [{ id: "in", type: String(n.data.portType) }],
          outputs: [{ id: "out", type: String(n.data.portType) }],
        }
      : kinds[String(n.data.kind)];
  }
  type(
    id: string,
    handle: string | null | undefined,
    direction: "source" | "target",
  ) {
    const n = this.flow.getNode(id);
    if (!n) return "";
    const ports =
      direction === "source" ? this.ports(n).outputs : this.ports(n).inputs;
    return (handle ? ports.find((p) => p.id === handle) : ports[0])?.type ?? "";
  }
  wire(e: FlowEdge) {
    return this.portColors[this.type(e.source, e.sourceHandle, "source")];
  }
  handles(n: FlowNode): HandleSpec[] {
    const p = this.ports(n);
    return (["target", "source"] as const).flatMap((t) =>
      (t === "source" ? p.outputs : p.inputs).map((port, i) => ({
        id: port.id,
        type: t,
        position: t === "source" ? "right" : "left",
        y: n.data.compact ? 12 + i * 8 : 57 + i * 25,
        data: port.type,
      })),
    );
  }
  compact(n: FlowNode) {
    // This folds the node's form, not the downstream graph; links remain live.
    this.flow.history.mark("Fold processor");
    this.flow.run(
      () => {
        this.flow.updateNodeData(n.id, { compact: !n.data.compact });
        this.flow.updateNode(n.id, {
          height: n.data.compact
            ? this.make(String(n.data.kind), n.id, 0, 0).height
            : 44,
        });
      },
      { history: "merge" },
    );
  }
  pasteWithLinks() {
    const content = this.flow.getContent(),
      ids = new Set(content.nodes.map((n) => n.id));
    // Clipboard omits external edges; explicitly keep these incoming dependencies.
    const incoming = this.flow.edges.filter(
      (e) => !ids.has(e.source) && ids.has(e.target),
    );
    this.flow.history.mark("Paste linked");
    this.flow.run(
      () => {
        const copy = this.flow.putContent(content, {
          offset: { x: 70, y: 220 },
        });
        const remap = new Map(
          content.nodes.map((n, i) => [n.id, copy.nodes[i]?.id]),
        );
        this.flow.addEdges(
          incoming.flatMap((e) =>
            remap.get(e.target)
              ? [{ ...e, id: createId("wire"), target: remap.get(e.target)! }]
              : [],
          ),
        );
      },
      { history: "merge" },
    );
  }
  add(kind: string) {
    const s = this.search;
    if (!s) return;
    const id = createId(kind),
      candidate = kinds[kind];
    const port = (
      s.direction === "source" ? candidate.inputs : candidate.outputs
    ).find((p) => p.type === s.type)!;
    this.flow.history.mark("Add compatible processor");
    this.flow.run(
      () => {
        this.flow.addNodes(this.make(kind, id, s.at.x, s.at.y));
        this.flow.addEdges({
          id: `wire-${id}`,
          source: s.direction === "source" ? s.node : id,
          sourceHandle: s.direction === "source" ? s.handle : port.id,
          target: s.direction === "source" ? id : s.node,
          targetHandle: s.direction === "source" ? port.id : s.handle,
          style: { stroke: this.portColors[s.type], strokeWidth: 2 },
        });
      },
      { history: "merge" },
    );
    this.setState(() => {
      this.search = null;
      this.query = "";
    });
  }
  reroute() {
    const e = this.flow.getSelectedEdges()[0] ?? this.flow.getEdge("pixels");
    if (!e) return;
    const a = this.flow.getNodePositionAbsolute(this.flow.getNode(e.source)!);
    this.flow.insertNodeOnEdge(e.id, {
      id: createId("reroute"),
      type: "reroute",
      position: { x: a.x + 280, y: a.y + 60 },
      width: 20,
      height: 20,
      data: { portType: this.type(e.source, e.sourceHandle, "source") },
    });
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      viewport: { minZoom: 0.15, fitView: { padding: 0.12, maxZoom: 1 } },
      config: {
        edgeLabel: { fontSize: 13 },
        colorMode: this.widget.theme,
        colors: { background: c.bg },
        minimap: { visible: true, width: 150, height: 100 },
      },
      interaction: {
        connect: {
          validate: (e) =>
            e.source !== e.target &&
            !!this.type(e.source, e.sourceHandle, "source") &&
            this.type(e.source, e.sourceHandle, "source") ===
              this.type(e.target, e.targetHandle, "target"),
        },
      },
      on: {
        connectEnd: ({ state, dropPosition }) => {
          const h = state.fromHandle;
          if (!state.toNode && state.mode === "drag" && !state.reconnectingEdge)
            this.setState(() => {
              this.search = {
                at: dropPosition,
                node: h.nodeId,
                handle: h.id,
                direction: h.type,
                type: this.type(h.nodeId, h.id, h.type),
              };
            });
        },
      },
      custom: {
        edge: (a, ctx) =>
          Opacity({
            opacity: a.sourceNode.data.bypass ? 0.35 : 1,
            child: defaultEdge(
              {
                ...a,
                edge: {
                  ...a.edge,
                  style: { stroke: this.wire(a.edge), strokeWidth: 2 },
                },
              },
              ctx,
            ),
          }),
        handle: (args) => {
          const color = args.isConnectionCandidate
            ? args.isValidCandidate
              ? "#4ade80"
              : "#f87171"
            : this.portColors[String(args.handle.data)];
          return Container({
            width: 10,
            height: 10,
            decoration: new BoxDecoration({
              shape: "circle",
              color,
              border: Border.all({ color: c.card, width: 1 }),
            }),
          });
        },
        node: (args, ctx) => {
          const views: Record<string, typeof defaultNode> = {
            processor: ({ node, isSelected: selected }) => {
              const spec = kinds[String(node.data.kind)],
                rows = Math.max(spec.inputs.length, spec.outputs.length);
              return Container({
                padding: EdgeInsets.all(12),
                decoration: new BoxDecoration({
                  color: c.card,
                  border: Border.all({
                    color: node.data.bypass
                      ? "#a78bfa"
                      : selected
                        ? "#60a5fa"
                        : c.line,
                    width: 2,
                  }),
                  borderRadius: BorderRadius.circular(8),
                }),
                child: Column({
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    this.text(
                      `${node.data.bypass ? "↷ BYPASSED · " : ""}${spec.label}`,
                      13,
                    ),
                    ...(!node.data.compact
                      ? [
                          Container({ height: 15 }),
                          ...Array.from({ length: rows }, (_, i) =>
                            this.portRow(spec.inputs[i], spec.outputs[i]),
                          ),
                          this.text(spec.detail, 9, c.mute),
                        ]
                      : []),
                  ],
                }),
              });
            },
            reroute: ({ node }) =>
              Container({
                decoration: new BoxDecoration({
                  shape: "circle",
                  color: this.portColors[String(node.data.portType)],
                  border: Border.all({ color: c.card, width: 3 }),
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
            ) => import("flitterjs").Widget
          > = {
            processor: ({ node }) =>
              Row({
                mainAxisSize: MainAxisSize.min,
                children: [
                  this.button(
                    node.data.compact ? "Expand body" : "Collapse body",
                    () => this.compact(node),
                  ),
                  this.button(node.data.bypass ? "Enable" : "Bypass", () =>
                    this.flow.updateNodeData(node.id, {
                      bypass: !node.data.bypass,
                    }),
                  ),
                ],
              }),
          };
          const view = views[args.node.type ?? "default"] ?? views.default;
          return view
            ? view(args as Parameters<typeof defaultNode>[0], ctx)
            : SizedBox.shrink();
        },
      },
      nodeOptions: {
        processor: { handles: (n) => this.handles(n) },
        reroute: {
          handles: (n) => [
            {
              id: "in",
              type: "target",
              position: "left",
              data: n.data.portType,
            },
            {
              id: "out",
              type: "source",
              position: "right",
              data: n.data.portType,
            },
          ],
        },
      },
    });
  }
  build(): Widget {
    const point = this.search && this.flow.flowToPanePosition(this.search.at);
    return Stack({
      fit: StackFit.expand,
      children: [
        (this.diagram ??= this.createDiagram()),
        Positioned({
          top: 12,
          left: 12,
          child: this.box([
            this.text("Image studio", 16, this.c.mute),
            Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                this.button("Paste linked", () => this.pasteWithLinks()),
                this.button("Reroute", () => this.reroute()),
                this.button("Undo", () => this.flow.history.undo()),
              ],
            }),
          ]),
        }),
        ...(point
          ? [
              Positioned({
                left: Math.max(
                  10,
                  Math.min(point.x, this.flow.paneSize.width - 260),
                ),
                top: Math.max(
                  70,
                  Math.min(point.y, this.flow.paneSize.height - 235),
                ),
                child: this.box(
                  [
                    this.text(
                      `COMPATIBLE ${this.search!.type.toUpperCase()} PORTS`,
                      10,
                      this.portColors[this.search!.type],
                    ),
                    TextField("", {
                      ariaLabel: "Search compatible processors",
                      decoration: new InputDecoration({
                        hintText: "Search compatible processors…",
                        hintStyle: new TextStyle({
                          color: this.c.mute,
                          fontSize: 11,
                        }),
                        border: Border.all({ color: this.c.line, width: 1 }),
                        contentPadding: EdgeInsets.symmetric({
                          horizontal: 6,
                          vertical: 4,
                        }),
                      }),
                      width: 225,
                      height: 30,
                      style: new TextStyle({ color: this.c.ink }),
                      onChanged: (value) =>
                        this.setState(() => {
                          this.query = value;
                        }),
                    }),
                    ...Object.entries(kinds)
                      .filter(
                        ([, k]) =>
                          k.label
                            .toLowerCase()
                            .includes(this.query.toLowerCase()) &&
                          (this.search!.direction === "source"
                            ? k.inputs
                            : k.outputs
                          ).some((p) => p.type === this.search!.type),
                      )
                      .map(([kind, k]) =>
                        this.button(k.label, () => this.add(kind)),
                      ),
                    this.button("Cancel", () =>
                      this.setState(() => {
                        this.search = null;
                      }),
                    ),
                  ],
                  250,
                ),
              }),
            ]
          : []),
      ],
    });
  }
  dispose() {
    this.flow.dispose();
    super.dispose();
  }
}
export default function DataflowGraph(theme: Theme = "light"): Widget {
  return new Dataflow(theme);
}
