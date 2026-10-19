import { Alignment, Border, BorderRadius, BoxDecoration, Column, Container, CrossAxisAlignment, EdgeInsets, GestureDetector, MainAxisSize, Opacity, Positioned, Row, Stack, StackFit, State, StatefulWidget, Text, TextStyle, type Widget } from "flitter-ui";
import { FlowDiagramController, forceLayout, getStraightPath, type FlowNode, type FlowEdge } from "flitter-ui/diagram";
import FlowDiagram, { defaultEdge } from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Knowledge extends StatefulWidget { constructor(readonly theme: Theme) { super(theme); } createState() { return new KnowledgeState(); } }
class KnowledgeState extends State<Knowledge> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  focused = "incident";
  hovered: string | null = null;
  depth = 2;
  sliderStart = 0;
  sliderValue = 2;
  sliderMoved = false;
  nodes: FlowNode[] = [
    ["incident", "Incident #1842", "I", "#e07157", "Duplicate charges after a webhook retry."],
    ["retries", "Retry policy", "R", "#9273c9", "Exponential backoff with jitter; max 5 attempts."],
    ["keys", "Idempotency keys", "K", "#9273c9", "Use the payment intent ID as the operation key."],
    ["payments", "Payment service", "P", "#4d91ae", "Owner: Revenue Platform · SLO 99.95%."],
    ["runbook", "On-call runbook", "O", "#6aa58c", "Pause retries, reconcile intents, then replay."],
    ["webhook", "Stripe webhooks", "W", "#4d91ae", "Events may arrive out of order or more than once."],
    ["slo", "Error budget", "B", "#6aa58c", "42% remaining in the rolling 30-day window."],
    ["postmortem", "Postmortem", "M", "#e07157", "Action: atomic deduplication before charging."]
  ].map(([id, label, icon, color, note]) => ({ id, type: "note", position: { x: 0, y: 0 }, width: 150, height: 94, selected: id === "incident", data: { label, icon, color, note } }));
  edges: FlowEdge[] = [
    ["incident", "retries"],
    ["incident", "payments"],
    ["incident", "postmortem"],
    ["retries", "keys"],
    ["payments", "webhook"],
    ["payments", "slo"],
    ["webhook", "keys"],
    ["runbook", "retries"],
    ["runbook", "slo"],
    ["postmortem", "runbook"]
  ].map(([source, target]) => ({ id: `${source}-${target}`, source, target, type: "link" }));
  get c() { return this.widget.theme === "dark" ? { bg: "#191a22", card: "#252733", ink: "#e6e6f1", muted: "#9799b0", line: "#494c63" } : { bg: "#f7f6fb", card: "#fff", ink: "#3c3c59", muted: "#85849b", line: "#d4d1e3" }; }
  text(value: string, size = 11, color = this.c.ink) { return Text(value, { style: new TextStyle({ fontFamily: "system-ui", fontSize: Math.max(13, size), color }) }); }
  button(label: string, fn: () => void) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => { e.stopPropagation(); fn(); },
      child: Container({ padding: EdgeInsets.all(8), color: this.c.card, child: this.text(label, 10, "#9273c9") })
    });
  }
  hover = () => {
    const id = this.flow.hoveredNodeId;
    if (id === this.hovered) return;
    this.setState(() => { this.hovered = id; });
    this.flow.nodes.forEach((n) => this.flow.nodeSignal(n.id).notifyListeners());
    this.flow.edges.forEach((e) => this.flow.edgeSignal(e.id).notifyListeners());
  };
  filter(depth: number) {
    this.setState(() => { this.depth = depth; });
    const seen = new Set([this.focused]);
    let frontier = [this.focused];
    for (let i = 0; i < depth; i++) {
      const next: string[] = [];
      frontier.forEach((id) => this.flow.getNeighbours(id).nodes.forEach((n) => { if (!seen.has(n.id)) { seen.add(n.id); next.push(n.id); } }));
      frontier = next;
    }
    this.flow.run(() => this.flow.setNodes((ns) => ns.map((n) => ({ ...n, hidden: !seen.has(n.id) }))), { history: "ignore" });
  }
  async reflow() {
    const pinned = new Map(this.flow.nodes.filter((n) => n.data.pinned).map((n) => [n.id, n.position]));
    await this.flow.layout(forceLayout, { seed: 11, nodeSpacing: 20, fitView: false });
    // Layout is a command; positions explicitly pinned by the reader win afterwards.
    this.flow.run(() => this.flow.setNodes((ns) => ns.map((n) => (pinned.has(n.id) ? { ...n, position: pinned.get(n.id)! } : n))), { history: "merge" });
    await this.flow.fitView({ padding: 0.12, maxZoom: 1 });
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      layout: { algorithm: forceLayout, options: { seed: 11, nodeSpacing: 20 } },
      viewport: { minZoom: 0.15, fitView: { padding: 0.12, maxZoom: 1 } },
      config: { edgeLabel: { fontSize: 13 }, colorMode: this.widget.theme, colors: { background: c.bg, edgeStroke: c.line }, minimap: { visible: false } },
      nodeTypes: {
        note: {
          handles: [],
          lod: [0.45, 0.8],
          build: ({ node, isSelected: selected, isHovered: hovered, isNeighbour }, ctx) =>
            Opacity({
              opacity: !this.hovered || hovered || isNeighbour ? 1 : 0.2,
              child: Column({
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container({
                    width: 48,
                    height: 48,
                    alignment: Alignment.center,
                    decoration: new BoxDecoration({ shape: "circle", color: String(node.data.color), border: Border.all({ color: selected ? c.ink : c.card, width: selected ? 3 : 1 }) }),
                    child: this.text(String(node.data.icon), 18, "#fff")
                  }),
                  Opacity({ opacity: ctx.zoom < 0.45 ? 0 : ctx.zoom < 0.8 ? 0.65 : 1, child: Container({ margin: EdgeInsets.only({ top: 6 }), padding: EdgeInsets.symmetric({ horizontal: 4, vertical: 2 }), color: c.bg, child: this.text(`${node.data.pinned ? "◆ " : ""}${node.data.label}`, 15) }) })
                ]
              })
            })
        }
      },
      edgeTypes: {
        link: {
          getPath: (params, edge) => {
            if (!edge) return getStraightPath(params);
            const a = this.flow.getNodeRect(edge.source)!,
              b = this.flow.getNodeRect(edge.target)!;
            // The 48px circle sits above the label, centred horizontally in the node.
            const ax = a.x + a.width / 2,
              ay = a.y + 24,
              bx = b.x + b.width / 2,
              by = b.y + 24;
            const length = Math.hypot(bx - ax, by - ay) || 1,
              dx = ((bx - ax) / length) * 24,
              dy = ((by - ay) / length) * 24;
            return getStraightPath({ sourceX: ax + dx, sourceY: ay + dy, targetX: bx - dx, targetY: by - dy });
          },
          build: (args, ctx) => defaultEdge({...args, edge: {...args.edge, style: { stroke: args.isNeighbour ? "#9273c9" : c.line, strokeWidth: args.isNeighbour ? 2 : 1 } } }, ctx)
        }
      },
      on: {
        init: (f) => { f.nodes.forEach((n) => f.nodeSignal(n.id).addListener(this.hover)); this.filter(this.depth); },
        nodeClick: (_e, n) => {
          this.setState(() => { this.focused = n.id; });
          this.filter(this.depth);
          const r = this.flow.getNodeRect(n)!;
          void this.flow.setCenter(r.x + r.width / 2, r.y + r.height / 2, { zoom: this.flow.zoom, duration: 200 });
        },
        dragEnd: (_e, n) => { this.flow.run(() => this.flow.updateNodeData(n.id, { pinned: true }), { history: "merge" }); this.setState(); }
      }
    });
  }
  build(): Widget {
    const n = this.flow.getNode(this.focused) ?? this.nodes[0];
    return Stack({
      fit: StackFit.expand,
      children: [
        (this.diagram ??= this.createDiagram()),
        Positioned({
          top: 12,
          left: 12,
          child: Container({
            width: 215,
            padding: EdgeInsets.all(12),
            decoration: new BoxDecoration({ color: this.c.card, border: Border.all({ color: this.c.line, width: 1 }), borderRadius: BorderRadius.circular(10) }),
            child: Column({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                this.text("PAYMENTS / KNOWLEDGE GRAPH", 10, this.c.muted),
                this.text(`Depth: ${this.depth} hops`, 12),
                GestureDetector({
                  onDragStart: (e) => { e.stopPropagation(); this.setState(() => { this.sliderStart = e.clientX; this.sliderValue = this.depth; this.sliderMoved = false; }); },
                  onDragMove: (e) => { this.setState(() => { this.sliderMoved = true; }); this.filter(Math.max(1, Math.min(3, Math.round(this.sliderValue + (e.clientX - this.sliderStart) / 50)))); },
                  child: Row({
                    mainAxisSize: MainAxisSize.min,
                    children: [1, 2, 3].map((value) =>
                      GestureDetector({
                        onClick: (e) => { e.stopPropagation(); if (!this.sliderMoved) this.filter(value); },
                        child: Container({
                          width: 55,
                          height: 25,
                          alignment: Alignment.center,
                          color: value <= this.depth ? "#9273c9" : this.c.bg,
                          child: this.text(String(value), 11, value <= this.depth ? "#fff" : this.c.ink)
                        })
                      })
                    )
                  })
                }),
                this.button("Reflow unpinned notes", () => void this.reflow()),
                this.text(`${this.flow.nodes.filter((n) => n.data.pinned).length} pinned · drag a note to pin`, 10, this.c.muted)
              ]
            })
          })
        }),
        Positioned({
          key: "diagram-status",
          right: 12,
          bottom: 12,
          child: Container({
            width: 230,
            padding: EdgeInsets.all(14),
            decoration: new BoxDecoration({ color: this.c.card, border: Border.all({ color: this.c.line, width: 1 }), borderRadius: BorderRadius.circular(10) }),
            child: Column({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [this.text(String(n.data.label), 14), this.text(String(n.data.note), 11, this.c.muted), this.text("Click any note to recentre", 10, "#9273c9")]
            })
          })
        })
      ]
    });
  }
  dispose() { this.flow.nodes.forEach((n) => this.flow.nodeSignal(n.id).removeListener(this.hover)); this.flow.dispose(); super.dispose(); }
}
export default function KnowledgeGraph(theme: Theme = "light"): Widget { return new Knowledge(theme); }
