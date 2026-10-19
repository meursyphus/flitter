import { defaultNode } from "@/components/diagram/flow-diagram";
import {
  Alignment,
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
} from "flitter-ui";
import {
  FlowDiagramController,
  createId,
  layeredLayout,
  type FlowNode,
  type FlowEdge,
  type XYPosition,
} from "flitter-ui/diagram";
import FlowDiagram, { defaultEdge } from "@/components/diagram/flow-diagram";

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
  running = false;
  timer?: ReturnType<typeof setTimeout>;
  search: { at: XYPosition; source: string; handle: string | null } | null =
    null;
  nodes: FlowNode[] = [
    {
      id: "webhook",
      position: { x: 0, y: 100 },
      data: {
        label: "New signup",
        detail: "POST /webhooks/signup",
        icon: "ϟ",
        color: "#d97706",
      },
    },
    {
      id: "enrich",
      position: { x: 270, y: 100 },
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
      position: { x: 540, y: 100 },
      data: {
        label: "Qualified lead?",
        detail: "employees ≥ 50",
        icon: "IF",
        color: "#16a34a",
      },
    },
    { id: "slack", position: { x: 820, y: 10 }, data: actions[0] },
    {
      id: "nurture",
      position: { x: 820, y: 210 },
      data: {
        label: "Add to nurture",
        detail: "Customer.io · welcome",
        icon: "M",
        color: "#db2777",
      },
    },
  ].map((n) => ({ ...n, type: n.type ?? "action", width: 205, height: 82 }));
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
        fontSize: Math.max(13, size),
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
        child: this.text(label, 11, primary ? "#fff" : this.c.ink),
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
          height: 82,
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
          height: 82,
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
    void this.flow.fitView({ padding: 0.12, minZoom: 0.8, maxZoom: 1 });
  }
  run() {
    if (this.running) return;
    this.setState(() => {
      this.running = true;
    });
    this.flow.setEdges((es) => es.map((e) => ({ ...e, animated: true })));
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
          { history: "merge" },
        );
        this.timer = setTimeout(tick, 450);
      } else {
        this.flow.run(
          () =>
            this.flow.setEdges((es) =>
              es.map((e) => ({ ...e, animated: false })),
            ),
          { history: "merge" },
        );
        this.setState(() => {
          this.running = false;
        });
      }
    };
    tick();
  }
  createDiagram(): Widget {
    const c = this.c;
    const build = ({
      node,
      isSelected: selected,
    }: {
      node: FlowNode;
      isSelected: boolean;
    }) =>
      Container({
        alignment: Alignment.centerLeft,
        padding: EdgeInsets.all(14),
        decoration: new BoxDecoration({
          color: c.card,
          border: Border.all({
            color: selected ? "#e85d4a" : c.border,
            width: selected ? 2 : 1,
          }),
          borderRadius: BorderRadius.circular(12),
        }),
        child: Column({
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            this.text(
              `${node.data.icon}     ${node.data.done ? `✓ ${node.data.items} items` : "READY"}`,
              11,
              String(node.data.color),
            ),
            this.text(String(node.data.label), 15),
            this.text(String(node.data.detail), 11, c.mute),
          ],
        }),
      });
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      viewport: {
        minZoom: 0.15,
        fitView: {
          padding: 0.12,
          minZoom: this.widget.presentation === "hero" ? 1 : 0.15,
          maxZoom: 1,
          nodes:
            this.widget.presentation === "hero"
              ? [{ id: "qualified" }, { id: "slack" }, { id: "nurture" }]
              : undefined,
        },
      },
      config: {
        edgeLabel: { fontSize: 13 },
        colorMode: this.widget.theme,
        colors: { background: c.bg },
        minimap: { visible: false },
        edge: { strokeWidth: 2 },
      },
      on: {
        connectEnd: ({ state, dropPosition }) => {
          if (
            !state.toNode &&
            !state.reconnectingEdge &&
            state.mode === "drag" &&
            state.fromHandle.type === "source"
          )
            this.setState(() => {
              this.search = {
                at: dropPosition,
                source: state.fromNode.id,
                handle: state.fromHandle.id,
              };
            });
        },
      },
      custom: {
        edgeLabel: (args) =>
          args.isHovered
            ? Row({
                mainAxisSize: MainAxisSize.min,
                children: [
                  this.button("+", () => this.insert(args.edge.id)),
                  this.button(
                    "×",
                    () => void this.flow.deleteElements({ edges: [args.edge] }),
                  ),
                ],
              })
            : SizedBox.shrink(),
        node: (args, ctx) => {
          const views: Record<string, typeof defaultNode> = {
            action: build,
            condition: build,
          };
          return (
            views[args.node.type ?? "default"] ??
            views.default ??
            defaultNode
          )(args, ctx);
        },
        edge: (args, ctx) => {
          const views: Record<string, typeof defaultEdge> = {
            workflow: defaultEdge,
          };
          return (
            views[args.edge.type ?? "default"] ??
            views.default ??
            defaultEdge
          )(args, ctx);
        },
      },
      nodeOptions: {
        action: {
          handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right" },
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
    return Stack({
      fit: StackFit.expand,
      children: [
        (this.diagram ??= this.createDiagram()),
        Positioned({
          top: 12,
          left: 12,
          child: this.card([
            this.text("LEAD QUALIFICATION", 10, this.c.mute),
            Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                this.button(
                  this.running ? "Running…" : "▶ Run 12 signups",
                  () => this.run(),
                  true,
                ),
                this.button(
                  "Tidy up",
                  () =>
                    void this.flow.layout(layeredLayout, {
                      direction: "LR",
                      rankSpacing: 65,
                    }),
                ),
                this.button("Undo", () => this.flow.history.undo()),
              ],
            }),
          ]),
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
                      "Drag an output into empty space to add an action · hover a connection for + / ×",
                      11,
                      this.c.mute,
                    ),
                  }),
          }),
        }),
        ...(popup
          ? [
              Positioned({
                left: Math.max(
                  10,
                  Math.min(popup.x, this.flow.paneSize.width - 255),
                ),
                top: Math.max(
                  75,
                  Math.min(popup.y, this.flow.paneSize.height - 225),
                ),
                child: this.card(
                  [
                    Row({
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        this.text("ADD THE NEXT ACTION", 10, this.c.mute),
                        this.button("×", () =>
                          this.setState(() => {
                            this.search = null;
                          }),
                        ),
                      ],
                    }),
                    TextField("", {
                      key: "action-search",
                      ariaLabel: "Search actions",
                      decoration: new InputDecoration({
                        hintText: "Search actions…",
                        hintStyle: new TextStyle({
                          color: this.c.mute,
                          fontSize: 11,
                        }),
                        border: Border.all({ color: this.c.border, width: 1 }),
                        contentPadding: EdgeInsets.symmetric({
                          horizontal: 6,
                          vertical: 4,
                        }),
                      }),
                      width: 220,
                      height: 30,
                      style: new TextStyle({ color: this.c.ink }),
                      onChanged: (value) =>
                        this.setState(() => {
                          this.query = value;
                        }),
                    }),
                    ...actions.flatMap((a, i) =>
                      a.label.toLowerCase().includes(this.query.toLowerCase())
                        ? [
                            this.button(`${a.icon}  ${a.label}`, () =>
                              this.addAction(i),
                            ),
                          ]
                        : [],
                    ),
                  ],
                  245,
                ),
              }),
            ]
          : []),
      ],
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
