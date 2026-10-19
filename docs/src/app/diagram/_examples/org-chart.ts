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
  GestureDetector,
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
  treeLayout,
  type FlowNode,
  type FlowEdge,
} from "flitter-ui/diagram";
import FlowDiagram from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Org extends StatefulWidget {
  constructor(readonly theme: Theme) {
    super(theme);
  }
  createState() {
    return new OrgState();
  }
}
class OrgState extends State<Org> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  query = "";
  path = new Set<string>();
  drop: string | null = null;
  nodes: FlowNode[] = [
    ["maya", "Maya Chen", "VP, Engineering", "MC", "#6366f1"],
    ["leo", "Leo Martinez", "Director, Platform", "LM", "#2563eb"],
    ["amina", "Amina Hassan", "Director, Product Eng.", "AH", "#0d9488"],
    ["sam", "Sam Rivera", "Staff engineer", "SR", "#2563eb"],
    ["ruth", "Ruth Okafor", "Engineering manager", "RO", "#2563eb"],
    ["jules", "Jules Park", "Senior engineer", "JP", "#0d9488"],
    ["noah", "Noah Wilson", "Product engineer", "NW", "#0d9488"],
  ].map(([id, label, title, initials, color]) => ({
    id,
    type: "person",
    position: { x: 0, y: 0 },
    width: 210,
    height: 92,
    collapsible: true,
    data: { label, title, initials, color },
  }));
  edges: FlowEdge[] = [
    ["maya", "leo"],
    ["maya", "amina"],
    ["leo", "sam"],
    ["leo", "ruth"],
    ["amina", "jules"],
    ["amina", "noah"],
  ].map(([source, target]) => ({
    id: `${source}-${target}`,
    source,
    target,
    type: "smoothstep",
  }));
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#161e27",
          card: "#24303e",
          ink: "#e7eff9",
          mute: "#9fb0c7",
          line: "#405269",
        }
      : {
          bg: "#f1f6fc",
          card: "#fff",
          ink: "#253e60",
          mute: "#8091aa",
          line: "#d3dfed",
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
        child: this.text(label, 11, "#5c8fe4"),
      }),
    });
  }
  descendants(id: string): Set<string> {
    const seen = new Set([id]),
      queue = [id];
    for (let i = 0; i < queue.length; i++)
      for (const child of this.flow.getOutgoers({ id: queue[i] }))
        if (!seen.has(child.id)) {
          seen.add(child.id);
          queue.push(child.id);
        }
    return seen;
  }
  target(n: FlowNode): FlowNode | undefined {
    const subtree = this.descendants(n.id);
    return this.flow
      .getIntersectingNodes(n)
      .find((other) => !subtree.has(other.id));
  }
  find(id: string) {
    const path = new Set([id]);
    let current = id;
    for (let guard = 0; guard < this.flow.nodes.length; guard++) {
      const manager = this.flow.getIncomers({ id: current })[0];
      if (!manager || path.has(manager.id)) break;
      path.add(manager.id);
      current = manager.id;
    }
    this.setState(() => {
      this.path = path;
    });
    path.forEach((person) => this.flow.expand(person));
    this.flow.selectNodes([id]);
    void this.flow.fitView({
      nodes: [{ id }],
      padding: 1,
      maxZoom: 1.1,
      duration: 200,
    });
  }
  tidy() {
    return this.flow.layout(treeLayout, {
      direction: "TB",
      rankSpacing: 65,
      nodeSpacing: 30,
    });
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      layout: {
        algorithm: treeLayout,
        options: { direction: "TB", rankSpacing: 65, nodeSpacing: 30 },
      },
      viewport: { minZoom: 0.2, fitView: { padding: 0.12, maxZoom: 1 } },
      config: {
        edgeLabel: { fontSize: 13 },
        colorMode: this.widget.theme,
        colors: { background: c.bg, edgeStroke: "#91a6c2" },
        minimap: { visible: false },
      },
      on: {
        drag: (_e, n) => {
          const next = this.target(n)?.id ?? null;
          if (next !== this.drop) {
            this.setState(() => {
              this.drop = next;
            });
          }
        },
        dragEnd: (_e, n) => {
          const manager = this.target(n);
          this.setState(() => {
            this.drop = null;
          });
          if (manager) {
            this.flow.run(
              () =>
                this.flow.setEdges((es) => [
                  ...es.filter((e) => e.target !== n.id),
                  {
                    id: `${manager.id}-${n.id}`,
                    source: manager.id,
                    target: n.id,
                    type: "smoothstep",
                  },
                ]),
              { history: "merge" },
            );
            void this.tidy();
          }
        },
      },
      custom: {
        node: (args, ctx) => {
          const views: Record<string, typeof defaultNode> = {
            person: (
              {
                node,
                isSelected: selected,
                isCollapsed: collapsed,
                hiddenChildCount,
              },
              ctx,
            ) =>
              Container({
                padding: EdgeInsets.all(12),
                decoration: new BoxDecoration({
                  color: c.card,
                  border: Border.all({
                    color:
                      this.drop === node.id
                        ? "#f59e0b"
                        : selected || this.path.has(node.id)
                          ? String(node.data.color)
                          : c.line,
                    width: 2,
                  }),
                  borderRadius: BorderRadius.circular(10),
                }),
                child:
                  ctx.zoom < 0.6
                    ? Container({
                        alignment: Alignment.center,
                        child: this.text(String(node.data.title), 16),
                      })
                    : Column({
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row({
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container({
                                width: 34,
                                height: 34,
                                alignment: Alignment.center,
                                decoration: new BoxDecoration({
                                  shape: "circle",
                                  color: String(node.data.color),
                                }),
                                child: this.text(
                                  String(node.data.initials),
                                  11,
                                  "#fff",
                                ),
                              }),
                              Container({
                                padding: EdgeInsets.only({ left: 8 }),
                                child: Column({
                                  mainAxisSize: MainAxisSize.min,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    this.text(String(node.data.label), 13),
                                    this.text(
                                      String(node.data.title),
                                      10,
                                      c.mute,
                                    ),
                                  ],
                                }),
                              }),
                            ],
                          }),
                          this.text(
                            collapsed
                              ? `▸ ${hiddenChildCount} people hidden`
                              : `▾ ${this.flow.getOutgoers(node).length} direct reports`,
                            10,
                            c.mute,
                          ),
                        ],
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
          > = {
            person: ({ node }) =>
              this.button(
                node.collapsed ? "Expand reports" : "Collapse reports",
                () => {
                  this.flow.toggleCollapsed(node.id);
                  void this.tidy();
                },
              ),
          };
          const view = views[args.node.type ?? "default"] ?? views.default;
          return view
            ? view(args as Parameters<typeof defaultNode>[0], ctx)
            : SizedBox.shrink();
        },
      },
      nodeOptions: { person: { lod: [0.6], handles: [] } },
    });
  }
  build(): Widget {
    return Stack({
      fit: StackFit.expand,
      children: [
        this.createDiagram(),
        Positioned({
          left: 12,
          top: 12,
          child: Container({
            width: 225,
            padding: EdgeInsets.all(12),
            decoration: new BoxDecoration({
              color: this.c.card,
              border: Border.all({ color: this.c.line, width: 1 }),
              borderRadius: BorderRadius.circular(10),
            }),
            child: Column({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                this.text("ENGINEERING / 7 PEOPLE", 10, this.c.mute),
                Stack({
                  children: [
                    TextField("", {
                      key: "org-chart-search",
                      ariaLabel: "Search people",
                      width: 200,
                      height: 20,
                      decoration: new BoxDecoration({
                        color: this.c.card,
                        border: Border.all({ color: this.c.line, width: 1 }),
                      }),
                      focusedBorder: Border.all({ color: "#488ccc", width: 2 }),
                      padding: EdgeInsets.all(8),
                      style: new TextStyle({
                        color: this.c.ink,
                        fontFamily: "system-ui",
                        fontSize: 12,
                      }),
                      onChanged: (value) =>
                        this.setState(() => {
                          this.query = value;
                        }),
                    }),
                    // A painted hint stays visible above the input's opaque themed surface.
                    ...(!this.query
                      ? [
                          Positioned({
                            left: 9,
                            top: 9,
                            child: this.text("Search people…", 12, this.c.mute),
                          }),
                        ]
                      : []),
                  ],
                }),
                ...this.nodes
                  .filter(
                    (n) =>
                      this.query &&
                      String(n.data.label)
                        .toLowerCase()
                        .includes(this.query.toLowerCase()),
                  )
                  .map((n) =>
                    this.button(String(n.data.label), () => this.find(n.id)),
                  ),
                this.button(
                  "Fit organization",
                  () =>
                    void this.flow.fitView({
                      padding: 0.12,
                      minZoom: 0.85,
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
                      "Select → collapse · drag onto a manager → re-parent · zoom out for compact cards",
                      10,
                      this.c.mute,
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
export default function OrgChart(theme: Theme = "light"): Widget {
  return new Org(theme);
}
