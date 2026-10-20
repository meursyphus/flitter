import {
  Opacity,
  Expanded,
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
  MainAxisSize,
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
} from "@flitterjs/diagram";
import FlowDiagram, {
  defaultEdge,
  defaultEdgeLabel,
} from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
const actions = [
  {
    label: "Send Slack message",
    icon: "#",
    detail: "#customer-success",
    color: "#7c3aed",
  },
  {
    label: "Create HubSpot contact",
    icon: "H",
    detail: "Upsert by email",
    color: "#ea580c",
  },
  {
    label: "Write to Postgres",
    icon: "DB",
    detail: "public.signup_events",
    color: "#2563eb",
  },
];
class Automation extends StatefulWidget {
  constructor(
    readonly theme: Theme,
    readonly presentation: "gallery" | "hero" = "gallery",
  ) {
    super(theme);
  }
  createState() {
    return new AutomationState();
  }
}
class AutomationState extends State<Automation> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  query = "";
  mode: "edit" | "review" = "review";
  decision: "yes" | "no" | null = null;
  running = false;
  timer?: ReturnType<typeof setTimeout>;
  search: { at: XYPosition; source: string; handle: string | null } | null =
    null;
  nodes: FlowNode[] = [
    {
      id: "webhook",
      position: { x: 0, y: 30 },
      data: {
        label: "New signup",
        detail: "POST /webhooks/signup",
        icon: "ϟ",
        color: "#d97706",
      },
    },
    {
      id: "enrich",
      position: { x: 0, y: 225 },
      data: {
        label: "Enrich company",
        detail: "Clearbit · company lookup",
        icon: "C",
        color: "#2563eb",
      },
    },
    {
      id: "qualified",
      type: "condition",
      position: { x: 310, y: 130 },
      data: {
        label: "Qualified lead?",
        detail: "employees ≥ 50",
        icon: "IF",
        color: "#16a34a",
      },
    },
    { id: "slack", position: { x: 620, y: 30 }, data: actions[0] },
    {
      id: "nurture",
      position: { x: 620, y: 270 },
      data: {
        label: "Add to nurture",
        detail: "Customer.io · welcome",
        icon: "M",
        color: "#db2777",
      },
    },
  ].map((n) => ({
    ...n,
    type: n.type ?? "action",
    width: 220,
    height: n.type === "condition" ? 154 : 96,
  }));
  edges: FlowEdge[] = [
    { id: "in", source: "webhook", target: "enrich" },
    { id: "check", source: "enrich", target: "qualified" },
    {
      id: "yes",
      source: "qualified",
      sourceHandle: "yes",
      target: "slack",
      label: "true",
    },
    {
      id: "no",
      source: "qualified",
      sourceHandle: "no",
      target: "nurture",
      label: "false",
    },
  ].map((e) => ({
    ...e,
    label: e.label ?? " ",
    type: "workflow",
    markerEnd: "arrowclosed",
  }));
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#18171f",
          card: "#252330",
          ink: "#f2edf9",
          mute: "#a89fb9",
          border: "#443c52",
        }
      : {
          bg: "#faf8fc",
          card: "#ffffff",
          ink: "#302540",
          mute: "#887a96",
          border: "#e8dfed",
        };
  }
  text(value: string, size = 12, color = this.c.ink) {
    return Text(value, {
      style: new TextStyle({
        fontFamily: "system-ui",
        color,
        fontSize: size,
      }),
    });
  }
  button(label: string, action: () => void, primary = false) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.stopPropagation();
        action();
      },
      child: Container({
        padding: EdgeInsets.symmetric({ horizontal: 11, vertical: 8 }),
        decoration: new BoxDecoration({
          color: primary ? "#e85d4a" : this.c.card,
          borderRadius: BorderRadius.circular(6),
        }),
        child: this.text(label, 14, primary ? "#fff" : this.c.ink),
      }),
    });
  }
  card(children: Widget[], width?: number) {
    return Container({
      width,
      padding: EdgeInsets.all(12),
      decoration: new BoxDecoration({
        color: this.c.card,
        border: Border.all({ color: this.c.border, width: 1 }),
        borderRadius: BorderRadius.circular(10),
      }),
      child: Column({
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children,
      }),
    });
  }
  addAction(index: number) {
    if (this.mode !== "edit" || this.running) return;
    const search = this.search;
    if (!search) return;
    const id = createId("action");
    this.flow.history.mark("Add connected action");
    this.flow.run(
      () => {
        this.flow.addNodes({
          id,
          type: "action",
          position: search.at,
          width: 205,
          height: 96,
          data: actions[index],
        });
        this.flow.addEdges({
          id: `edge-${id}`,
          source: search.source,
          sourceHandle: search.handle,
          target: id,
          type: "workflow",
        });
      },
      { history: "merge" },
    );
    this.setState(() => {
      this.search = null;
      this.query = "";
    });
  }
  insert(edgeId: string) {
    if (this.mode !== "edit" || this.running) return;
    const e = this.flow.getEdge(edgeId);
    if (!e) return;
    const source = this.flow.getNode(e.source)!,
      target = this.flow.getNode(e.target)!;
    const moving = new Set<string>(),
      queue = [target.id];
    for (let i = 0; i < queue.length; i++) {
      const id = queue[i];
      if (id === source.id || moving.has(id)) continue;
      moving.add(id);
      queue.push(...this.flow.getOutgoers({ id }).map((n) => n.id));
    }
    const id = createId("action");
    this.flow.history.mark("Insert action");
    // Make room downstream while preserving the reader's branch positions.
    this.flow.run(
      () => {
        moving.forEach((key) => {
          const n = this.flow.getNode(key)!;
          this.flow.updateNode(key, {
            position: { x: n.position.x + 270, y: n.position.y },
          });
        });
        this.flow.insertNodeOnEdge(e.id, {
          id,
          type: "action",
          position: { x: source.position.x + 270, y: target.position.y },
          width: 205,
          height: 96,
          data: actions[2],
        });
        this.flow.setEdges((es) =>
          es.map((edge) =>
            edge.source === id ? { ...edge, label: " " } : edge,
          ),
        );
      },
      { history: "merge" },
    );
    void this.flow.fitView({ padding: 0.12, minZoom: 0.15, maxZoom: 1 });
  }
  run() {
    if (this.running || this.mode !== "edit") return;
    this.setState(() => {
      this.running = true;
    });
    this.flow.run(
      () => this.flow.setEdges(es => es.map(edge => ({ ...edge, animated: true }))),
      { history: "ignore" },
    );
    let i = 0;
    const tick = () => {
      const n = this.flow.nodes[i++];
      if (n) {
        this.flow.run(
          () =>
            this.flow.updateNodeData(n.id, {
              items: n.id === "nurture" ? 3 : n.id === "slack" ? 9 : 12,
              done: true,
            }),
          { history: "ignore" },
        );
        this.setState();
        this.timer = setTimeout(tick, 450);
      } else {
        this.flow.run(
          () =>
            this.flow.setEdges((es) =>
              es.map((e) => ({ ...e, animated: false })),
            ),
          { history: "ignore" },
        );
        this.setState(() => {
          this.running = false;
        });
      }
    };
    tick();
  }
  // Product behavior is composed from widgets, controller commands, and policy.
  // Review mode keeps the graph selectable but protects its structure.
  setMode(mode: "edit" | "review") {
    clearTimeout(this.timer);
    this.clearResults();
    this.setState(() => {
      this.mode = mode;
      this.running = false;
      this.search = null;
      this.query = "";
      this.diagram = undefined;
    });
  }
  clearResults() {
    clearTimeout(this.timer);
    this.flow.run(
      () => {
        this.flow.nodes.forEach((node) =>
          this.flow.updateNodeData(node.id, {
            done: false,
            items: 0,
            skipped: false,
          }),
        );
        this.flow.setEdges((edges) =>
          edges.map((edge) => ({
            ...edge,
            animated: false,
            data: { ...edge.data, active: false, muted: false },
          })),
        );
      },
      { history: "ignore" },
    );
    this.setState(() => {
      this.decision = null;
    });
  }
  decide(route: "yes" | "no") {
    if (this.mode !== "review" || this.decision) return;
    const activeNodes = new Set<string>();
    const activeEdges = new Set<string>();
    const queue = ["webhook"];
    // Follow the edited graph, including actions inserted along either branch.
    for (let index = 0; index < queue.length; index++) {
      const id = queue[index];
      if (activeNodes.has(id) || !this.flow.getNode(id)) continue;
      activeNodes.add(id);
      for (const edge of this.flow.edges) {
        if (
          edge.source !== id ||
          (id === "qualified" && edge.sourceHandle !== route)
        )
          continue;
        activeEdges.add(edge.id);
        queue.push(edge.target);
      }
    }
    this.flow.run(
      () => {
        for (const node of this.flow.nodes) {
          const active = activeNodes.has(node.id);
          this.flow.updateNodeData(node.id, {
            done: active,
            items: active ? 1 : 0,
            skipped: !active,
          });
        }
        this.flow.setEdges((edges) =>
          edges.map((edge) => ({
            ...edge,
            animated: activeEdges.has(edge.id),
            data: {
              ...edge.data,
              active: activeEdges.has(edge.id),
              muted: !activeEdges.has(edge.id),
            },
          })),
        );
        this.flow.selectNodes(
          [route === "yes" ? "slack" : "nurture"].filter((id) =>
            activeNodes.has(id),
          ),
        );
      },
      { history: "ignore" },
    );
    this.setState(() => {
      this.decision = route;
    });
    this.timer = setTimeout(() => {
      this.flow.run(
        () =>
          this.flow.setEdges((edges) =>
            edges.map((edge) => ({ ...edge, animated: false })),
          ),
        { history: "ignore" },
      );
    }, 1200);
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      viewport: { minZoom: 0.15, fitView: { padding: 0.08, maxZoom: 1.1 } },
      interaction: this.mode === "edit" ? "editor" : "viewer",
      can: (gesture) => {
        if (["pan", "zoom", "select"].includes(gesture)) return true;
        return (
          this.mode === "edit" &&
          !this.running &&
          [
            "drag",
            "connect",
            "reconnect",
            "delete",
            "copy",
            "contextMenu",
          ].includes(gesture)
        );
      },
      config: {
        colorMode: this.widget.theme,
        colors: { background: c.bg },
        minimap: { visible: false },
        controls: { showInteractive: false },
        edge: { strokeWidth: 2 },
        edgeLabel: { fontSize: 13 },
      },
      on: {
        connectEnd: ({ state, dropPosition }) => {
          if (
            this.mode === "edit" &&
            !state.toNode &&
            !state.reconnectingEdge &&
            state.mode === "drag" &&
            state.fromHandle.type === "source"
          ) {
            this.setState(() => {
              this.search = {
                at: dropPosition,
                source: state.fromNode.id,
                handle: state.fromHandle.id,
              };
            });
          }
        },
      },
      custom: {
        controls: ({ zoomIn, zoomOut, fitView }) =>
          Row({
            mainAxisSize: MainAxisSize.min,
            children: [zoomOut, zoomIn, fitView],
          }),
        node: ({ node, isSelected }) =>
          Opacity({
            opacity: node.data.skipped ? 0.35 : 1,
            child: Container({
              padding: EdgeInsets.all(14),
              decoration: new BoxDecoration({
                color: c.card,
                borderRadius: BorderRadius.circular(12),
                border: Border.all({
                  color: node.data.done
                    ? "#22a06b"
                    : isSelected
                      ? "#e85d4a"
                      : c.border,
                  width: node.data.done || isSelected ? 2 : 1,
                }),
              }),
              child: Column({
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  this.text(String(node.data.label), 18),
                  SizedBox({ height: 8 }),
                  this.text(
                    node.data.done
                      ? `${node.data.items} ${node.data.items === 1 ? "lead" : "leads"} processed`
                      : String(node.data.detail),
                    13,
                    node.data.done ? "#22a06b" : c.mute,
                  ),
                  ...(node.type === "condition"
                    ? [
                        SizedBox({ height: 16 }),
                        this.mode === "review"
                          ? this.decision
                            ? this.text(
                                this.decision === "yes"
                                  ? "Approved"
                                  : "Sent to nurture",
                                16,
                                "#22a06b",
                              )
                            : Row({
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  this.button(
                                    "Approve",
                                    () => this.decide("yes"),
                                    true,
                                  ),
                                  SizedBox({ width: 4 }),
                                  this.button("Nurture", () =>
                                    this.decide("no"),
                                  ),
                                ],
                              })
                          : this.text("Route by company size", 13, c.mute),
                      ]
                    : []),
                ],
              }),
            }),
          }),
        edgeLabel: (args, context) =>
          this.mode === "edit" && args.isHovered
            ? this.button("+ Add step", () => this.insert(args.edge.id))
            : args.label.trim()
              ? defaultEdgeLabel(args, context)
              : SizedBox.shrink(),
        edge: (args, context) =>
          Opacity({
            opacity: args.edge.data?.muted ? 0.2 : 1,
            child: defaultEdge(
              {
                ...args,
                edge: {
                  ...args.edge,
                  style: {
                    stroke: args.edge.data?.active ? "#22a06b" : c.mute,
                    strokeWidth: args.edge.data?.active ? 3 : 1.5,
                  },
                },
              },
              context,
            ),
          }),
      },
      nodeOptions: {
        action: {
          handles: (node) => [
            { type: "target", position: node.id === "enrich" ? "top" : "left" },
            {
              type: "source",
              position: node.id === "webhook" ? "bottom" : "right",
            },
          ],
        },
        condition: {
          handles: [
            { type: "target", position: "left" },
            { id: "yes", type: "source", position: "right", align: 0.3 },
            { id: "no", type: "source", position: "right", align: 0.75 },
          ],
        },
      },
    });
  }
  build(): Widget {
    const popup = this.search && this.flow.flowToPanePosition(this.search.at);
    return LayoutBuilder({
      builder: (_context, size) =>
        Column({
          children: [
            Container({
              height: 58,
              color: this.c.card,
              padding: EdgeInsets.symmetric({ horizontal: 12 }),
              child: Row({
                children: [
                  Expanded({ child: SizedBox.shrink() }),
                  this.button(
                    "Edit",
                    () => this.setMode("edit"),
                    this.mode === "edit",
                  ),
                  SizedBox({ width: 4 }),
                  this.button(
                    "Review",
                    () => this.setMode("review"),
                    this.mode === "review",
                  ),
                  SizedBox({ width: 12 }),
                  ...(this.mode === "edit"
                    ? [
                        this.button("Undo", () => this.flow.history.undo()),
                        ...(size.maxWidth >= 540
                          ? [
                              this.button(
                                this.running ? "Running…" : "Run sample",
                                () => this.run(),
                              ),
                            ]
                          : []),
                      ]
                    : this.decision
                      ? [this.button("Review again", () => this.clearResults())]
                      : []),
                ],
              }),
            }),
            Expanded({
              child: Stack({
                fit: StackFit.expand,
                children: [
                  (this.diagram ??= this.createDiagram()),
                  ...(popup
                    ? [
                        Positioned({
                          left: Math.max(
                            10,
                            Math.min(popup.x, this.flow.paneSize.width - 260),
                          ),
                          top: Math.max(
                            10,
                            Math.min(popup.y, this.flow.paneSize.height - 245),
                          ),
                          child: this.card(
                            [
                              Row({
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  this.text("Add a step", 17),
                                  this.button("Close", () =>
                                    this.setState(() => {
                                      this.search = null;
                                    }),
                                  ),
                                ],
                              }),
                              SizedBox({ height: 10 }),
                              TextField("", {
                                key: "action-search",
                                ariaLabel: "Search actions",
                                width: 220,
                                height: 30,
                                decoration: new InputDecoration({
                                  hintText: "Search actions…",
                                  hintStyle: new TextStyle({
                                    color: this.c.mute,
                                    fontSize: 13,
                                  }),
                                  border: Border.all({
                                    color: this.c.border,
                                    width: 1,
                                  }),
                                  contentPadding: EdgeInsets.all(6),
                                }),
                                style: new TextStyle({
                                  color: this.c.ink,
                                  fontSize: 13,
                                }),
                                onChanged: (value) =>
                                  this.setState(() => {
                                    this.query = value;
                                  }),
                              }),
                              ...actions.flatMap((action, index) =>
                                action.label
                                  .toLowerCase()
                                  .includes(this.query.toLowerCase())
                                  ? [
                                      this.button(action.label, () =>
                                        this.addAction(index),
                                      ),
                                    ]
                                  : [],
                              ),
                            ],
                            250,
                          ),
                        }),
                      ]
                    : []),
                ],
              }),
            }),
          ],
        }),
    });
  }
  dispose() {
    clearTimeout(this.timer);
    this.flow.dispose();
    super.dispose();
  }
}
export default function AutomationWorkflow(
  theme: Theme = "light",
  options?: { presentation?: "gallery" | "hero" },
): Widget {
  return new Automation(theme, options?.presentation);
}
