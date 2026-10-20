import { defaultNode } from "@/components/diagram/flow-diagram";
import {
  SizedBox,
  Expanded,
  LayoutBuilder,
  Alignment,
  AnimatedRotation,
  Border,
  BorderRadius,
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  GestureDetector,
  MainAxisSize,
  Opacity,
  Positioned,
  Row,
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
  layeredLayout,
  type FlowNode,
  type FlowEdge,
} from "@flitterjs/diagram";
import FlowDiagram, { defaultEdge } from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Pipeline extends StatefulWidget {
  constructor(readonly theme: Theme) {
    super(theme);
  }
  createState() {
    return new PipelineState();
  }
}
class PipelineState extends State<Pipeline> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  selected = "integration";
  running = false;
  clock?: ReturnType<typeof setInterval>;
  progress?: ReturnType<typeof setInterval>;
  nodes: FlowNode[] = [
    {
      id: "validate",
      type: "stage",
      position: { x: 0, y: 0 },
      width: 230,
      height: 178,
      data: { label: "VALIDATE", width: 230, height: 178 },
      collapsible: true,
    },
    {
      id: "build",
      type: "stage",
      position: { x: 266, y: 0 },
      width: 230,
      height: 178,
      data: { label: "BUILD", width: 230, height: 178 },
      collapsible: true,
    },
    {
      id: "deploy",
      type: "stage",
      position: { x: 532, y: 0 },
      width: 230,
      height: 178,
      data: { label: "DEPLOY", width: 230, height: 178 },
      collapsible: true,
    },
    ...[
      ["lint", "validate", "Lint & typecheck", "success", "18s"],
      ["unit", "validate", "Unit tests", "success", "41s"],
      ["integration", "build", "Integration tests", "failed", "1m 12s"],
      ["image", "build", "Container image", "running", "38s"],
      ["staging", "deploy", "Deploy staging", "queued", "Waiting"],
      ["smoke", "deploy", "Smoke checks", "queued", "Waiting"],
    ].map(([id, parentId, label, status, time], i) => ({
      id,
      parentId,
      type: "job",
      position: { x: 12, y: 40 + (i % 2) * 64 },
      width: 206,
      height: 52,
      // Jobs stacked in one stage connect top to bottom; stages connect left to right.
      sourcePosition: (id === "staging" ? "bottom" : "right") as
        | "bottom"
        | "right",
      targetPosition: (id === "smoke" ? "top" : "left") as "top" | "left",
      data: { label, status, time },
    })),
  ];
  edges: FlowEdge[] = [
    ["lint", "integration"],
    ["unit", "integration"],
    ["unit", "image"],
    ["integration", "staging"],
    ["image", "staging"],
    ["staging", "smoke"],
  ].map(([source, target]) => ({
    id: `${source}-${target}`,
    source,
    target,
    type: "run",
    markerEnd: "arrowclosed",
  }));
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#101820",
          card: "#1b2733",
          ink: "#e5eff8",
          mute: "#90a3b6",
          line: "#344759",
        }
      : {
          bg: "#f4f7fb",
          card: "#fff",
          ink: "#24374a",
          mute: "#73859a",
          line: "#d8e2ed",
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
        padding: EdgeInsets.all(9),
        color: this.c.card,
        child: this.text(label, 10, "#4aa3e8"),
      }),
    });
  }
  initState(context: Parameters<State<Pipeline>["initState"]>[0]) {
    super.initState(context);
    this.clock = setInterval(() => {
      this.flow.run(
        () => {
          for (const node of this.flow.nodes.filter(
            (n) => n.data.status === "running",
          )) {
            this.flow.updateNodeData(node.id, {
              turn: Number(node.data.turn ?? 0) + 0.5,
            });
          }
        },
        { history: "ignore" },
      );
    }, 500);
  }
  get hovered() {
    const id = this.flow.hoveredNodeId;
    return id && this.flow.getNode(id)?.type === "job" ? id : null;
  }
  get chain(): Set<string> {
    const id = this.hovered,
      chain = new Set(id ? [id] : []);
    for (const direction of ["source", "target"] as const) {
      const queue = id ? [id] : [],
        seen = new Set(queue);
      for (let i = 0; i < queue.length; i++) {
        for (const edge of this.flow.getNeighbours(queue[i]).edges) {
          const next =
            direction === "source" && edge.target === queue[i]
              ? edge.source
              : direction === "target" && edge.source === queue[i]
                ? edge.target
                : null;
          if (next && !seen.has(next)) {
            seen.add(next);
            chain.add(next);
            queue.push(next);
          }
        }
      }
    }
    return chain;
  }
  fold(id: string) {
    const n = this.flow.getNode(id)!;
    if (!n.collapsed)
      this.flow.updateNodeData(id, { width: n.width, height: n.height });
    this.flow.toggleCollapsed(id);
    this.flow.updateNode(id, {
      width: n.collapsed ? Number(n.data.width) : 220,
      height: n.collapsed ? Number(n.data.height) : 48,
    });
    this.setState();
  }
  simulate() {
    clearInterval(this.progress);
    this.setState(() => {
      this.running = true;
    });
    const jobs = this.flow.nodes.filter((n) => n.type === "job");
    this.flow.run(
      () =>
        jobs.forEach((n) =>
          this.flow.updateNodeData(n.id, { status: "queued", time: "Waiting" }),
        ),
      { history: "ignore" },
    );
    let step = 0;
    this.progress = setInterval(() => {
      this.flow.run(
        () => {
          if (step > 0)
            this.flow.updateNodeData(jobs[step - 1].id, {
              status: "success",
              time: "42s",
            });
          if (step < jobs.length)
            this.flow.updateNodeData(jobs[step].id, {
              status: "running",
              time: "Running…",
            });
        },
        { history: "ignore" },
      );
      this.setState();
      if (step++ >= jobs.length) {
        clearInterval(this.progress);
        this.setState(() => {
          this.running = false;
        });
      }
    }, 700);
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      highlightConnected: true,
      data: { nodes: this.nodes, edges: this.edges },
      interaction: "viewer",
      layout: {
        algorithm: {
          name: "stage-rows",
          compute: (graph) =>
            graph.nodes[0]?.parentId
              ? {
                  positions: Object.fromEntries(
                    graph.nodes.map((n, i) => [
                      n.id,
                      { x: 12, y: 40 + i * 64 },
                    ]),
                  ),
                }
              : layeredLayout.compute(graph),
        },
        options: { direction: "LR", childPadding: 12, rankSpacing: 36 },
      },
      viewport: { minZoom: 0.15, fitView: { padding: 0.12, maxZoom: 1 } },
      config: {
        edgeLabel: { fontSize: 13 },
        colorMode: this.widget.theme,
        colors: { background: c.bg },
        minimap: { visible: false },
        controls: { showInteractive: false },
      },
      on: {
        nodeClick: (_e, n) => {
          if (n.type === "stage") this.fold(n.id);
          else
            this.setState(() => {
              this.selected = n.id;
            });
        },
      },
      custom: {
        controls: ({ zoomIn, zoomOut, fitView }) =>
          Row({
            mainAxisSize: MainAxisSize.min,
            children: [zoomOut, zoomIn, fitView],
          }),
        node: (args, ctx) => {
          const views: Record<string, typeof defaultNode> = {
            stage: ({ node, isCollapsed: collapsed, hiddenChildCount }) =>
              Container({
                padding: EdgeInsets.all(12),
                decoration: new BoxDecoration({
                  color: c.bg,
                  border: Border.all({ color: c.line, width: 1 }),
                  borderRadius: BorderRadius.circular(12),
                }),
                child: this.text(
                  `${collapsed ? "▸" : "▾"} ${node.data.label}${collapsed ? ` · ${hiddenChildCount} jobs` : ""}`,
                  11,
                  c.mute,
                ),
              }),
            job: ({ node, isSelected: selected }) => {
              const status = String(node.data.status),
                color = (
                  {
                    success: "#22a06b",
                    failed: "#e44855",
                    running: "#dba22b",
                    queued: c.mute,
                  } as Record<string, string>
                )[status];
              const icon = Container({
                width: 22,
                height: 22,
                alignment: Alignment.center,
                decoration: new BoxDecoration({
                  shape: "circle",
                  border: Border.all({ color, width: 2 }),
                }),
                child: this.text(
                  (
                    {
                      success: "✓",
                      failed: "×",
                      running: "◔",
                      queued: "·",
                    } as Record<string, string>
                  )[status],
                  13,
                  color,
                ),
              });
              return Opacity({
                opacity: !this.hovered || this.chain.has(node.id) ? 1 : 0.25,
                child: Container({
                  padding: EdgeInsets.all(6),
                  decoration: new BoxDecoration({
                    color: c.card,
                    border: Border.all({
                      color: selected ? "#4aa3e8" : c.line,
                      width: 1,
                    }),
                    borderRadius: BorderRadius.circular(8),
                  }),
                  child: Row({
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      status === "running"
                        ? AnimatedRotation({
                            turns: Number(node.data.turn ?? 0),
                            duration: 500,
                            child: icon,
                          })
                        : icon,
                      Container({
                        padding: EdgeInsets.only({ left: 10 }),
                        child: Column({
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            this.text(String(node.data.label), 12),
                            this.text(String(node.data.time), 10, c.mute),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
              });
            },
          };
          return (
            views[args.node.type ?? "default"] ??
            views.default ??
            defaultNode
          )(args, ctx);
        },
        edge: (args, ctx) => {
          const views: Record<string, typeof defaultEdge> = {
            run: (args, ctx) =>
              defaultEdge(
                {
                  ...args,
                  edge: {
                    ...args.edge,
                    style: {
                      stroke:
                        !this.hovered ||
                        (this.chain.has(args.edge.source) &&
                          this.chain.has(args.edge.target))
                          ? "#4c8ab7"
                          : c.line,
                    },
                  },
                },
                ctx,
              ),
          };
          return (
            views[args.edge.type ?? "default"] ??
            views.default ??
            defaultEdge
          )(args, ctx);
        },
      },
      nodeOptions: {
        stage: { group: true, handles: [] },
        job: { handles: [] },
      },
    });
  }
  build(): Widget {
    const n = this.flow.getNode(this.selected) ?? this.nodes[5];
    const failed = n.data.status === "failed";
    return LayoutBuilder({
      builder: (_context, size) =>
        Column({
          children: [
            Container({
              height: 56,
              color: this.c.card,
              padding: EdgeInsets.symmetric({ horizontal: 14 }),
              child: Row({
                children: [
                  Expanded({
                    child: Column({
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        this.text("checkout / CI #1842", 13),
                        SizedBox({ height: 4 }),
                        this.text("main · 8f3a921 · push", 11, this.c.mute),
                      ],
                    }),
                  }),
                  this.button(
                    this.running ? "Running…" : "▶ Simulate run",
                    () => this.simulate(),
                  ),
                ],
              }),
            }),
            Expanded({ child: (this.diagram ??= this.createDiagram()) }),
            Container({
              key: "diagram-status",
              height: size.maxWidth < 540 ? 84 : 146,
              color: this.c.card,
              padding: EdgeInsets.all(16),
              child: Column({
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row({
                    children: [
                      Expanded({
                        child: this.text(`JOB LOG / ${n.data.label}`, 12),
                      }),
                      this.text(
                        String(n.data.status).toUpperCase(),
                        10,
                        failed ? "#ed6973" : "#22a06b",
                      ),
                    ],
                  }),
                  SizedBox({ height: 12 }),
                  this.text(
                    failed
                      ? "FAIL  payment retries › idempotency"
                      : `Runner ubuntu-22.04 · ${n.data.status}`,
                    12,
                    failed ? "#ed6973" : this.c.ink,
                  ),
                  ...(size.maxWidth >= 540
                    ? [
                        SizedBox({ height: 8 }),
                        this.text(
                          failed
                            ? "Expected 1 request, received 2"
                            : `Duration: ${n.data.time}`,
                          12,
                          this.c.mute,
                        ),
                        SizedBox({ height: 6 }),
                        this.text(
                          failed
                            ? "api/payments.test.ts:148  ·  Exit code 1"
                            : "Node.js 22 · Artifacts retained for 7 days",
                          11,
                          this.c.mute,
                        ),
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
    clearInterval(this.clock);
    clearInterval(this.progress);
    this.flow.dispose();
    super.dispose();
  }
}
export default function PipelineRun(theme: Theme = "light"): Widget {
  return new Pipeline(theme);
}
