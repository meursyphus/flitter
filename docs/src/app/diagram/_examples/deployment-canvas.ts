import { Border, BorderRadius, BoxDecoration, Column, Container, CrossAxisAlignment, EdgeInsets, GestureDetector, MainAxisSize, Positioned, Row, Stack, StackFit, State, StatefulWidget, Text, TextStyle, type Widget } from "flitter-ui";
import { FlowController, createId, layeredLayout, type FlowNode, type FlowEdge } from "flitter-ui/diagram";
import { FlowDiagram } from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Deployment extends StatefulWidget { constructor(readonly theme: Theme) { super(theme); } createState() { return new DeploymentState(); } }
class DeploymentState extends State<Deployment> {
  flow = new FlowController();
  diagram?: Widget;
  references = false;
  selected = "api";
  nodes: FlowNode[] = [
    { id: "production", type: "frame", position: { x: 20, y: 50 }, width: 650, height: 340, data: { label: "Production", size: [650, 340] }, collapsible: true },
    {
      id: "api",
      parentId: "production",
      position: { x: 25, y: 60 },
      data: { label: "checkout-api", kind: "SERVICE", status: "Healthy", region: "us-east-1", deploy: "2m ago · 8f3a921", detail: "3 replicas · 42 req/s", color: "#16a34a" }
    },
    {
      id: "worker",
      parentId: "production",
      position: { x: 25, y: 205 },
      data: { label: "receipt-worker", kind: "SERVICE", status: "Degraded", region: "us-east-1", deploy: "6m ago · 72b0f19", detail: "SMTP timeout · 12 retries", color: "#dc2626" }
    },
    { id: "storage", type: "frame", parentId: "production", position: { x: 270, y: 45 }, width: 350, height: 270, data: { label: "Managed storage", size: [350, 270] }, collapsible: true },
    {
      id: "db",
      parentId: "storage",
      position: { x: 25, y: 45 },
      data: { label: "postgres-primary", kind: "DATABASE", status: "Healthy", region: "us-east-1", deploy: "PostgreSQL 16.3", detail: "18 GB / 50 GB", color: "#2563eb" }
    },
    {
      id: "assets",
      parentId: "storage",
      position: { x: 25, y: 155 },
      data: { label: "invoice-exports", kind: "BUCKET", status: "Healthy", region: "us-east-1", deploy: "Private · encrypted", detail: "4,218 objects", color: "#7c3aed" }
    }
  ].map((n) => (n.type === "frame" ? n : { ...n, type: "service", width: 225, height: 90 }));
  edges: FlowEdge[] = [
    { id: "database-url", source: "api", target: "db", label: "DATABASE_URL" },
    { id: "queue-db", source: "worker", target: "db", label: "DATABASE_URL" },
    { id: "bucket-url", source: "worker", target: "assets", label: "EXPORT_BUCKET" }
  ].map((e) => ({ ...e, type: "smoothstep", hidden: true, markerEnd: "arrowclosed" }));
  get colors() {
    return this.widget.theme === "dark" ? { bg: "#131720", card: "#202633", ink: "#e7edf8", muted: "#94a3b8", line: "#384255" } : { bg: "#f6f8fc", card: "#ffffff", ink: "#202b40", muted: "#64748b", line: "#dbe2ed" };
  }
  text(value: string, size = 12, color = this.colors.ink) { return Text(value, { style: new TextStyle({ fontFamily: "system-ui", fontSize: size, color }) }); }
  button(label: string, action: () => void) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => { e.stopPropagation(); action(); },
      child: Container({ padding: EdgeInsets.symmetric({ horizontal: 10, vertical: 8 }), child: this.text(label, 11, "#6366f1") })
    });
  }
  box(children: Widget[], width?: number): Widget {
    return Container({
      width,
      padding: EdgeInsets.all(12),
      decoration: new BoxDecoration({ color: this.colors.card, border: Border.all({ color: this.colors.line, width: 1 }), borderRadius: BorderRadius.circular(10) }),
      child: Column({ mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children })
    });
  }
  status(n: FlowNode) {
    return Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        this.text(String(n.data.kind), 9, this.colors.muted),
        Container({
          margin: EdgeInsets.only({ left: 8 }),
          padding: EdgeInsets.symmetric({ horizontal: 6, vertical: 2 }),
          decoration: new BoxDecoration({ color: this.colors.bg, borderRadius: BorderRadius.circular(20) }),
          child: this.text(`● ${n.data.status}`, 9, String(n.data.color))
        })
      ]
    });
  }
  fold(id: string) {
    const n = this.flow.getNode(id)!;
    const descendants = this.flow.nodes.filter((child) => { let p = child.parentId; while (p) { if (p === id) return true; p = this.flow.getNode(p)?.parentId; } return false; });
    this.flow.history.mark("Fold group");
    this.flow.run(
      () => {
        // Body collapse is one level deep; remember which nested frames were open.
        if (!n.collapsed) {
          const open = descendants.filter((c) => c.type === "frame" && !c.collapsed).map((c) => c.id);
          this.flow.updateNodeData(id, { reopen: open, size: [n.width, n.height] });
          open.forEach((child) => this.flow.collapse(child));
          this.flow.collapse(id);
          this.flow.updateNode(id, { width: 225, height: 50 });
        } else {
          this.flow.expand(id);
          ((n.data.reopen as string[]) ?? []).forEach((child) => this.flow.expand(child));
          const [width, height] = n.data.size as number[];
          this.flow.updateNode(id, { width, height });
        }
      },
      { history: "merge" }
    );
    this.setState();
  }
  newGroup(position: { x: number; y: number }) {
    const picked = this.flow.getSelectedNodes(),
      ids = new Set(picked.map((n) => n.id));
    const selected = picked.filter((n) => { let p = n.parentId; while (p) { if (ids.has(p)) return false; p = this.flow.getNode(p)?.parentId; } return true; });
    const bounds = selected.length ? this.flow.getNodesBounds(selected) : { ...position, width: 280, height: 160 };
    const id = createId("group");
    this.flow.history.mark("Group services");
    this.flow.run(
      () => {
        this.flow.addNodes({
          id,
          type: "frame",
          position: { x: bounds.x - 20, y: bounds.y - 45 },
          width: bounds.width + 40,
          height: bounds.height + 65,
          data: { label: "New environment", size: [bounds.width + 40, bounds.height + 65] },
          collapsible: true
        });
        selected.forEach((n) => this.flow.setParent(n.id, id));
      },
      { history: "merge" }
    );
  }
  createDiagram(): Widget {
    const c = this.colors;
    return FlowDiagram({
      controller: this.flow,
      nodes: this.nodes,
      edges: this.edges,
      viewport: { fitView: { padding: 0.35, maxZoom: 1 }, minZoom: 0.2 },
      config: {
        colorMode: this.widget.theme,
        colors: { background: c.bg },
        controls: { position: "bottom-left" },
        minimap: { visible: false },
        contextMenu: { items: (args) => [{ label: "New group from selection", onSelect: () => this.newGroup(args.position) }, { label: "Undo", onSelect: () => this.flow.history.undo() }] }
      },
      nodeTypes: {
        frame: {
          group: true,
          handles: [],
          toolbar: ({ node }) => this.box([this.button(node.collapsed ? "Expand group" : "Collapse group", () => this.fold(node.id))]),
          build: ({ node, collapsed, hiddenChildCount }) =>
            Container({
              padding: EdgeInsets.all(12),
              decoration: new BoxDecoration({ color: c.bg, border: Border.all({ color: "#8895ae", width: 1 }), borderRadius: BorderRadius.circular(12) }),
              child: this.text(`${collapsed ? "▸" : "▾"} ${node.data.label}${collapsed ? ` · ${hiddenChildCount} items` : ""}`, 12, c.muted)
            })
        },
        service: {
          handles: [{ type: "target", position: "left" }, { type: "source", position: "right" }],
          build: ({ node, selected }) =>
            Container({
              padding: EdgeInsets.all(13),
              decoration: new BoxDecoration({ color: c.card, border: Border.all({ color: selected ? "#6366f1" : c.line, width: selected ? 2 : 1 }), borderRadius: BorderRadius.circular(10) }),
              child: Column({
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [this.status(node), this.text(String(node.data.label), 15), this.text(String(node.data.detail), 11, node.data.status === "Degraded" ? "#dc2626" : c.muted)]
              })
            })
        }
      },
      on: { nodeClick: (_e, n) => { if (n.type !== "frame") this.setState(() => { this.selected = n.id; }); } }
    });
  }
  build(): Widget {
    const n = this.flow.getNode(this.selected) ?? this.nodes[1];
    return Stack({
      fit: StackFit.expand,
      children: [
        (this.diagram ??= this.createDiagram()),
        Positioned({
          top: 12,
          left: 12,
          child: this.box([
            this.text("ACME / COMMERCE", 10, this.colors.muted),
            Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                this.button(this.references ? "✓ References visible" : "Show references", () => {
                  this.setState(() => { this.references = !this.references; });
                  this.flow.setEdges((es) => es.map((e) => ({ ...e, hidden: !this.references })));
                }),
                this.button("Tidy up", () => void this.flow.layout(layeredLayout, { direction: "LR", childPadding: 35, rankSpacing: 65 })),
                this.button("Fold storage", () => this.fold("storage"))
              ]
            })
          ])
        }),
        Positioned({
          right: 12,
          top: 110,
          child: this.box(
            [
              this.text("SERVICE DETAILS", 10, this.colors.muted),
              this.text(String(n.data.label), 15),
              this.text(`● ${n.data.status}`, 12, String(n.data.color)),
              this.text(String(n.data.region)),
              this.text(String(n.data.deploy), 11, this.colors.muted),
              this.button("Redeploy", () => { this.flow.updateNodeData(n.id, { status: "Healthy", detail: "Deployment complete", color: "#16a34a", deploy: "Just now · 91a3c72" }); this.setState(); })
            ],
            205
          )
        }),
        Positioned({ bottom: 14, left: 125, child: this.text("Select services · right-click empty space to group", 11, this.colors.muted) })
      ]
    });
  }
  dispose() { this.flow.dispose(); super.dispose(); }
}
export default function DeploymentCanvas(theme: Theme = "light"): Widget { return new Deployment(theme); }
