import { LayoutBuilder, SizedBox, Border, BorderRadius, BoxDecoration, Column, Container, CrossAxisAlignment, EdgeInsets, GestureDetector, MainAxisSize, Positioned, Stack, StackFit, State, StatefulWidget, Text, TextStyle, type Widget } from "flitter-ui";
import { FlowDiagramController, createId, treeLayout, toLayoutGraph, type FlowNode, type FlowEdge } from "flitter-ui/diagram";
import FlowDiagram from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Steps extends StatefulWidget { constructor(readonly theme: Theme) { super(theme); } createState() { return new StepsState(); } }
class StepsState extends State<Steps> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  selected = "paths";
  initialPositioned = false;
  nodes: FlowNode[] = [
    { id: "trigger", data: { label: "New paid order", app: "Shopify", detail: "Store: acme-supply.myshopify.com", step: "1" } },
    { id: "format", data: { label: "Normalize address", app: "Formatter", detail: "Format shipping address as US postal", step: "2" } },
    { id: "paths", data: { label: "Paths", app: "Rules", detail: "Choose a route by order value", step: "3" } },
    { id: "vip", data: { label: "High-value order", app: "Path A", detail: "Total is greater than $500", step: "A" }, collapsible: true },
    { id: "regular", data: { label: "Standard order", app: "Path B", detail: "All other paid orders", step: "B" }, collapsible: true },
    { id: "notify", data: { label: "Notify account manager", app: "Slack", detail: "Send to #priority-orders", step: "4A" } },
    { id: "email", data: { label: "Send receipt", app: "Gmail", detail: "Template: order-confirmation", step: "4B" } }
  ].map((n) => ({ ...n, type: "step", position: { x: 0, y: 0 }, width: 250, height: 96 }));
  edges: FlowEdge[] = [["trigger", "format"], ["format", "paths"], ["paths", "vip"], ["paths", "regular"], ["vip", "notify"], ["regular", "email"]].map(([source, target]) => ({ id: `${source}-${target}`, source, target, type: "smoothstep", label: "+" }));
  get c() {
    return this.widget.theme === "dark" ? { bg: "#1e1a16", card: "#2b251e", ink: "#f6eee3", mute: "#b4a48e", border: "#554938" } : { bg: "#fffaf2", card: "#ffffff", ink: "#3d2d1d", mute: "#91765b", border: "#eedbc4" };
  }
  text(value: string, size = 12, color = this.c.ink) { return Text(value, { style: new TextStyle({ fontFamily: "system-ui", fontSize: Math.max(13, size), color }) }); }
  button(label: string, action: () => void) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => { e.stopPropagation(); action(); },
      child: Container({ padding: EdgeInsets.all(8), color: this.c.card, child: this.text(label, 11, "#e66c13") })
    });
  }
  box(children: Widget[], width?: number) {
    return Container({
      width,
      padding: EdgeInsets.all(12),
      decoration: new BoxDecoration({ color: this.c.card, border: Border.all({ color: this.c.border, width: 1 }), borderRadius: BorderRadius.circular(10) }),
      child: Column({ mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children })
    });
  }
  async fitStart() {
    const first = this.flow.getNodeRect("trigger");
    if (!first) return;
    const zoom = Math.min(0.85, (this.flow.paneSize.width - 32) / first.width);
    // A tall tree starts below the header; pan down to explore the later branches.
    await this.flow.setViewport({ zoom, x: (this.flow.paneSize.width - first.width * zoom) / 2 - first.x * zoom, y: 112 - first.y * zoom });
  }
  async tidy() {
    const result = await treeLayout.compute(toLayoutGraph(this.flow.getVisibleNodes(), this.flow.edges, { direction: "TB", rankSpacing: 50, nodeSpacing: 65 }));
    // Merge layout positions into the insertion/reorder/collapse that requested them.
    this.flow.run(() => this.flow.setNodes((ns) => ns.map((n) => (result.positions[n.id] ? {...n, position: result.positions[n.id] } : n))), { history: "merge" });
    await this.fitStart();
  }
  insert(edge: FlowEdge) {
    const id = createId("step");
    this.flow.history.mark("Insert step");
    this.flow.run(
      () => {
        this.flow.insertNodeOnEdge(edge.id, { id, type: "step", position: { x: 0, y: 0 }, width: 250, height: 96, data: { label: "Log order in a sheet", app: "Google Sheets", detail: "Append to Orders · Sheet1", step: "+" } });
        this.flow.setEdges((es) => es.map((e) => ({ ...e, label: "+" })));
        this.flow.selectNodes([id]);
      },
      { history: "merge" }
    );
    this.setState(() => { this.selected = id; });
    void this.tidy();
  }
  reorder(up: boolean) {
    const selected = this.flow.getNode(this.selected);
    if (!selected) return;
    const link = this.flow.edges.find((e) => (up ? e.target === selected.id : e.source === selected.id));
    if (!link) return;
    const a = this.flow.getNode(link.source)!,
      b = this.flow.getNode(link.target)!;
    if ([a, b].some((n) => n.id === "trigger" || n.id === "paths" || n.collapsible)) return;
    const before = this.flow.edges.filter((e) => e.target === a.id),
      after = this.flow.edges.filter((e) => e.source === b.id);
    if (before.length !== 1 || after.length > 1 || this.flow.getOutgoers(a).length !== 1 || this.flow.getIncomers(b).length !== 1) return;
    this.flow.setEdges((es) => es.map((e) => e.id === before[0].id ? {...e, target: b.id } : e.id === link.id ? {...e, source: b.id, target: a.id } : e.source === b.id ? {...e, source: a.id } : e));
    void this.tidy();
  }

  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      layout: { algorithm: treeLayout, fitView: false, options: { direction: "TB", rankSpacing: 50, nodeSpacing: 65 } },
      viewport: { minZoom: 0.2 },
      // The layout owns position; dragging a locked card falls through to pane pan.
      can: (gesture) => ["pan", "zoom", "select", "connect", "delete", "copy", "contextMenu"].includes(gesture),
      interaction: { drag: { enabled: false }, connect: { enabled: false } },
      config: { edgeLabel: { fontSize: 13 }, colorMode: this.widget.theme, colors: { background: c.bg, edgeStroke: "#bc9d79" }, minimap: { visible: false } },
      nodeTypes: {
        step: {
          handles: [],
          build: ({ node, isSelected: selected, isCollapsed: collapsed, hiddenChildCount }) =>
            Container({
              padding: EdgeInsets.all(12),
              decoration: new BoxDecoration({ color: c.card, border: Border.all({ color: selected ? "#ed7922" : c.border, width: selected ? 2 : 1 }), borderRadius: BorderRadius.circular(10) }),
              child: Column({
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  this.text(`${node.data.step}  ${node.data.app}`, 10, "#d96a14"),
                  this.text(String(node.data.label), 14),
                  this.text(collapsed ? `${hiddenChildCount} steps collapsed` : String(node.data.detail), 10, c.mute)
                ]
              })
            }),
          toolbar: ({ node }) => node.collapsible ? this.box([this.button(node.collapsed ? "Expand branch" : "Collapse branch", () => { this.flow.toggleCollapsed(node.id); void this.tidy(); })]) : SizedBox.shrink()
        }
      },
      custom: { edgeLabel: ({ edge }) => this.button("+", () => this.insert(edge)) },
      on: {
        nodesChange: changes => { if (!this.initialPositioned && changes.some(change => change.type === "position")) { this.initialPositioned = true; void this.fitStart(); } },
        nodeClick: (_e, n) => this.setState(() => { this.selected = n.id; })
      }
    });
  }
  build(): Widget {
    const n = this.flow.getNode(this.selected) ?? this.nodes[2];
    return LayoutBuilder({ builder: (_context, size) => Stack({
      fit: StackFit.expand,
      children: [
        (this.diagram ??= this.createDiagram()),
        Positioned({ key: "diagram-header", top: 12, left: 12, child: this.box([this.text("ORDER FULFILLMENT", 10, this.c.mute), this.text("Layout owns positions", 13), this.text("Click + to insert · select a path to collapse", 10, this.c.mute)]) }),
        ...(size.maxWidth >= 700 ? [Positioned({
          top: 12,
          right: 12,
          child: this.box(
            [
              this.text("CONFIGURE STEP", 10, this.c.mute),
              this.text(String(n.data.label), 14),
              this.text(String(n.data.app), 12, "#e66c13"),
              this.text(String(n.data.detail), 11),
              this.button("Test this step", () => { this.flow.updateNodeData(n.id, { detail: "✓ Test passed · sample order #10482" }); this.setState(); }),
              this.button("Move earlier ↑", () => this.reorder(true)),
              this.button("Move later ↓", () => this.reorder(false)),
              this.button("Undo", () => this.flow.history.undo())
            ],
            200
          )
        })] : [])
      ]
    }) });
  }
  dispose() { this.flow.dispose(); super.dispose(); }
}
export default function LinearSteps(theme: Theme = "light"): Widget { return new Steps(theme); }
