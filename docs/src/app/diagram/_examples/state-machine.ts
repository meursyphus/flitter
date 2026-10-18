import { SizedBox, LayoutBuilder, Alignment, Border, BorderRadius, BoxDecoration, Column, Container, CrossAxisAlignment, EdgeInsets, GestureDetector, MainAxisSize, Positioned, Row, Stack, StackFit, State, StatefulWidget, Text, TextStyle, type Widget } from "flitter-ui";
import { FlowDiagramController, getEdgePathByType, layeredLayout, type FlowNode, type FlowEdge } from "flitter-ui/diagram";
import FlowDiagram, { defaultHandle, defaultEdge } from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Machine extends StatefulWidget { constructor(readonly theme: Theme) { super(theme); } createState() { return new MachineState(); } }
class MachineState extends State<Machine> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  selected = "authorizing";
  serial = 1;
  nodes: FlowNode[] = [
    { id: "checkout", type: "compound", position: { x: 0, y: 0 }, width: 1090, height: 390, data: { label: "checkout", note: "Compound state" } },
    { id: "payment", type: "compound", parentId: "checkout", position: { x: 270, y: 55 }, width: 540, height: 285, data: { label: "payment", note: "Nested state · double-click empty space" } },
    { id: "initial", type: "initial", parentId: "checkout", position: { x: 25, y: 120 }, width: 16, height: 16, data: {} },
    { id: "draft", type: "state", parentId: "checkout", position: { x: 75, y: 95 }, width: 150, height: 64, data: { label: "draft", action: "entry: createCart" } },
    { id: "authorizing", type: "state", parentId: "payment", position: { x: 35, y: 65 }, width: 175, height: 64, data: { label: "authorizing", action: "invoke: authorizeCard" }, selected: true },
    { id: "capturing", type: "state", parentId: "payment", position: { x: 320, y: 65 }, width: 175, height: 64, data: { label: "capturing", action: "invoke: captureFunds" } },
    { id: "failed", type: "state", parentId: "payment", position: { x: 175, y: 195 }, width: 175, height: 64, data: { label: "failed", action: "entry: reportError" } },
    { id: "complete", type: "state", parentId: "checkout", position: { x: 880, y: 120 }, width: 175, height: 64, data: { label: "complete", action: "type: final" } }
  ];
  edges: FlowEdge[] = [
    { id: "initial-draft", source: "initial", target: "draft", label: "" },
    { id: "submit", source: "draft", target: "authorizing", label: "SUBMIT" },
    { id: "authorized", source: "authorizing", target: "capturing", label: "AUTHORIZED" },
    { id: "declined", source: "authorizing", sourceHandle: "decline", target: "failed", targetHandle: "incoming", label: "DECLINED", waypoints: [{ x: 392.5, y: 215 }, { x: 532.5, y: 215 }] },
    { id: "retry", source: "failed", sourceHandle: "retry", target: "authorizing", label: "RETRY", waypoints: [{ x: 280, y: 282 }, { x: 280, y: 152 }] },
    { id: "captured", source: "capturing", target: "complete", label: "CAPTURED" }
  ].map((e) => ({ ...e, type: "smoothstep", markerEnd: "arrowclosed" }));
  get c() { return this.widget.theme === "dark" ? { bg: "#181c2c", card: "#252d46", ink: "#e5eafa", muted: "#99a6ca", line: "#48577f" } : { bg: "#f5f7ff", card: "#fff", ink: "#2e416b", muted: "#8393b5", line: "#ccd6eb" }; }
  text(value: string, size = 11, color = this.c.ink) { return Text(value, { style: new TextStyle({ fontFamily: "ui-monospace, monospace", fontSize: Math.max(13, size), color }) }); }
  button(label: string, fn: () => void) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => { e.stopPropagation(); fn(); },
      child: Container({ padding: EdgeInsets.all(9), color: this.c.card, child: this.text(label, 10, "#7c8fe2") })
    });
  }
  add(parentId: string | undefined, at: { x: number; y: number }, source?: string) {
    const id = `state-${this.serial}`;
    this.setState(() => { this.serial++; this.selected = id; });
    this.flow.history.mark("Add state");
    this.flow.run(
      () => {
        this.flow.addNodes({ id, type: "state", parentId, position: at, width: 175, height: 64, data: { label: id, action: "entry: assignContext" } });
        // Grow enclosing frames instead of letting a newly appended state escape them.
        let child = this.flow.getNode(id);
        while (child?.parentId) {
          const parent = this.flow.getNode(child.parentId);
          if (!parent) break;
          this.flow.updateNode(parent.id, { width: Math.max(parent.width ?? 0, child.position.x + (child.width ?? 175) + 20), height: Math.max(parent.height ?? 0, child.position.y + (child.height ?? 64) + 20) });
          child = this.flow.getNode(parent.id);
        }
        this.flow.selectNodes([id]);
        if (source) this.flow.addEdges({ id: `transition-${id}`, source, target: id, label: "NEXT", type: "smoothstep", markerEnd: "arrowclosed" });
      },
      { history: "merge" }
    );
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      viewport: { minZoom: 0.15, fitView: { padding: 0.12, maxZoom: 1 } },
      config: { edgeLabel: { fontSize: 13 }, colorMode: this.widget.theme, colors: { background: c.bg, edgeStroke: "#8899d1" }, minimap: { visible: false } },
      nodeTypes: {
        compound: {
          group: true,
          handles: [],
          build: ({ node, isSelected: selected }) =>
            Container({
              padding: EdgeInsets.all(14),
              decoration: new BoxDecoration({ color: c.bg, border: Border.all({ color: selected ? "#8498ef" : c.line, width: 1 }), borderRadius: BorderRadius.circular(12) }),
              child: Column({ mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [this.text(String(node.data.label), 15), this.text(String(node.data.note), 9, c.muted)] })
            })
        },
        initial: { handles: [{ type: "source", position: "right" }], build: () => Container({ decoration: new BoxDecoration({ shape: "circle", color: c.ink }) }) },
        state: {
          handles: (node) => [
            { type: "target", position: "left" },
            { id: "add", type: "source", position: "right", width: 18, height: 18 },
            ...(node.id === "authorizing" ? [{ id: "decline", type: "source" as const, position: "bottom" as const }] : []),
            ...(node.id === "failed" ? [{ id: "retry", type: "source" as const, position: "left" as const }, { id: "incoming", type: "target" as const, position: "top" as const }] : [])
          ],
          build: ({ node, isSelected: selected }) =>
            Container({
              alignment: Alignment.center,
              padding: EdgeInsets.all(8),
              decoration: new BoxDecoration({ color: c.card, border: Border.all({ color: selected ? "#7c8fe2" : c.line, width: 2 }), borderRadius: BorderRadius.circular(9) }),
              child: Column({ mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [this.text(String(node.data.label), 13), this.text(String(node.data.action), 9, c.muted)] })
            })
        }
      },
      edgeTypes: { smoothstep: { build: defaultEdge, getPath: (params, edge) => {
        const path = getEdgePathByType("smoothstep", params, edge?.pathOptions);
        if (edge?.id === "retry") return { ...path, labelX: params.targetX - 60, labelY: params.sourceY - 35 };
        if (edge?.id === "submit") return { ...path, labelY: path.labelY - 20 };
        return path;
      } } },
      custom: {
        handle: (args, ctx) =>
          args.handle.id === "add"
            ? Container({ width: 18, height: 18, alignment: Alignment.center, decoration: new BoxDecoration({ shape: "circle", color: "#7c8fe2" }), child: this.text("+", 13, "#fff") })
            : defaultHandle(args, ctx)
      },
      on: {
        nodeClick: (_e, n) => this.setState(() => { this.selected = n.id; }),
        nodeDoubleClick: (event, n) => {
          if (n.type !== "compound") return;
          const p = this.flow.screenToFlowPosition({ x: event.clientX, y: event.clientY }),
            origin = this.flow.getNodePositionAbsolute(n);
          this.add(n.id, { x: p.x - origin.x, y: p.y - origin.y });
        },
        connectStart: (state) => {
          // Click on + is quick-add; dragging the same handle remains a normal connection.
          if (state.mode === "click" && state.fromHandle.id === "add") {
            this.flow.cancelConnection();
            const n = state.fromNode;
            this.add(n.parentId, { x: n.position.x + (n.width ?? 175) + 70, y: n.position.y + 90 }, n.id);
          }
        }
      }
    });
  }
  build(): Widget {
    const n = this.flow.getNode(this.selected) ?? this.nodes[4];
    return Stack({
      fit: StackFit.expand,
      children: [
        (this.diagram ??= this.createDiagram()),
        Positioned({
          top: 12,
          left: 12,
          child: Container({
            padding: EdgeInsets.all(10),
            color: this.c.card,
            child: Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                this.text("CHECKOUT MACHINE", 12),
                this.button("✦ Auto layout", () => void this.flow.layout(layeredLayout, { direction: "LR", rankSpacing: 100, childPadding: 40 })),
                this.button("Undo", () => this.flow.history.undo())
              ]
            })
          })
        }),
        Positioned({ bottom: 12, left: 125, right: 12, child: Column({
          mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            SizedBox({ key: "diagram-hint", child: LayoutBuilder({ builder: (_context, size) => size.maxWidth < 363 ? SizedBox.shrink() : Container({ padding: EdgeInsets.only({ bottom: 8 }), child: this.text("Double-click frame: add child · +: add transition", 10, this.c.muted) }) }) }),
            SizedBox({ key: "diagram-status", child: Container({ padding: EdgeInsets.all(12), color: this.c.card, child: this.text(`Selected: ${n.data.label ?? "initial"} · ${n.parentId ? `inside ${n.parentId}` : "root"}`, 11, this.c.muted) }) })
          ]
        }) })
      ]
    });
  }
  dispose() { this.flow.dispose(); super.dispose(); }
}
export default function StateMachine(theme: Theme = "light"): Widget { return new Machine(theme); }
