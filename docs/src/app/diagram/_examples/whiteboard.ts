import { Alignment, Border, BorderRadius, BoxDecoration, Container, EdgeInsets, GestureDetector, MainAxisSize, Positioned, Row, Stack, StackFit, State, StatefulWidget, Text, TextStyle, type Widget } from "flitter-ui";
import { FlowController, type FlowNode, type FlowEdge } from "flitter-ui/diagram";
import { FlowDiagram, EditableLabel, ShapePaint, rectPathD } from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Board extends StatefulWidget { constructor(readonly theme: Theme) { super(theme); } createState() { return new BoardState(); } }
class BoardState extends State<Board> {
  flow = new FlowController();
  diagram?: Widget;
  shape = "rect";
  altHeld = false;
  nodes: FlowNode[] = [
    { id: "listen", position: { x: 30, y: 120 }, data: { label: "Customer\ninterviews", shape: "ellipse" } },
    { id: "prototype", position: { x: 310, y: 120 }, selected: true, data: { label: "Prototype the\nsmallest solution", shape: "rect" } },
    { id: "ship", position: { x: 590, y: 120 }, data: { label: "Ship an\nexperiment", shape: "rect" } },
    { id: "note", position: { x: 310, y: 300 }, data: { label: "What would make\nthis 10× simpler?", shape: "note" } }
  ].map((n) => ({ ...n, type: "shape", width: 190, height: 105 }));
  edges: FlowEdge[] = [{ id: "a", source: "listen", target: "prototype", type: "smoothstep", markerEnd: "arrowclosed" }, { id: "b", source: "prototype", target: "ship", type: "smoothstep", markerEnd: "arrowclosed" }];
  get c() { return this.widget.theme === "dark" ? { bg: "#202326", card: "#30383b", ink: "#e8efeb", line: "#9bb5a6", note: "#66572e" } : { bg: "#fbfaf5", card: "#fff", ink: "#354c42", line: "#86a495", note: "#fff0ae" }; }
  text(value: string, color = this.c.ink) { return Text(value, { style: new TextStyle({ fontFamily: "system-ui", fontSize: 11, color }) }); }
  button(label: string, fn: () => void, active = false) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => { e.stopPropagation(); fn(); },
      child: Container({ padding: EdgeInsets.all(10), decoration: new BoxDecoration({ color: active ? "#4a7461" : this.c.card, borderRadius: BorderRadius.circular(6) }), child: this.text(label, active ? "#fff" : this.c.ink) })
    });
  }
  add(dx = 260, dy = 0, connect = true) {
    const source = this.flow.getSelectedNodes()[0] ?? this.flow.nodes[0];
    if (!source) return;
    const at = { x: source.position.x + dx, y: source.position.y + dy };
    this.flow.history.mark("Quick add shape");
    this.flow.run(
      () => {
        const copy = this.flow.putContent(
          { nodes: [{...source, id: "new", parentId: undefined, position: { x: 0, y: 0 }, data: { label: this.shape === "note" ? "A new idea" : "Next step", shape: this.shape } }], edges: [] },
          { at }
        );
        if (connect && copy.nodes[0])
          this.flow.addEdges({ id: `link-${copy.nodes[0].id}`, source: source.id, target: copy.nodes[0].id, type: "smoothstep", markerEnd: "arrowclosed" });
      },
      { history: "merge" }
    );
  }
  keyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? "") || this.flow.editingId) return;
    this.setState(() => { this.altHeld = e.altKey; });
    if (!this.flow.isPointerInside || !(e.metaKey || e.ctrlKey)) return;
    const delta = ({ ArrowLeft: [-260, 0], ArrowRight: [260, 0], ArrowUp: [0, -180], ArrowDown: [0, 180] } as Record<string, number[]>)[e.key];
    if (delta) {
      e.preventDefault();
      this.add(delta[0], delta[1]);
    }
  };
  keyUp = (e: KeyboardEvent) => this.setState(() => { this.altHeld = e.altKey; });
  blur = () => this.setState(() => { this.altHeld = false; });
  initState(context: Parameters<State<Board>["initState"]>[0]) {
    super.initState(context);
    if (typeof document !== "undefined") {
      document.addEventListener("keydown", this.keyDown);
      document.addEventListener("keyup", this.keyUp);
      window.addEventListener("blur", this.blur);
    }
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      nodes: this.nodes,
      edges: this.edges,
      interaction: "whiteboard",
      viewport: { minZoom: 0.2, fitView: { padding: 0.4, maxZoom: 1 } },
      config: { colorMode: this.widget.theme, colors: { background: c.bg, nodeColor: c.ink, edgeStroke: c.line }, node: { padding: 14, fontSize: 14 }, minimap: { visible: false }, background: { variant: "dots", gap: 24 } },
      nodeTypes: {
        shape: {
          handles: [{ type: "target", position: "left" }, { type: "source", position: "right" }],
          build: (args, ctx) => {
            const w = args.node.width ?? 190,
              h = args.node.height ?? 105,
              shape = args.node.data.shape;
            const d =
              shape === "ellipse" ? `M2 ${h / 2} A${w / 2 - 2} ${h / 2 - 2} 0 1 0 ${w - 2} ${h / 2} A${w / 2 - 2} ${h / 2 - 2} 0 1 0 2 ${h / 2}` : rectPathD(2, 2, w - 4, h - 4, shape === "note" ? 2 : 12);
            return Stack({
              fit: StackFit.expand,
              children: [
                ShapePaint({ width: w, height: h, shapes: { body: { d, fill: shape === "note" ? c.note : c.card, stroke: args.selected ? "#4f9e77" : c.line, strokeWidth: args.selected ? 2.5 : 1.5 } } }),
                Container({ padding: EdgeInsets.all(14), alignment: Alignment.center, child: EditableLabel(args, ctx) })
              ]
            });
          }
        }
      },
      on: {
        dragStart: (event, _node, nodes) => {
          // The original moves; a zero-offset copy stays behind, in the same drag history mark.
          if (this.altHeld || event.altKey) this.flow.putContent(this.flow.getContent(nodes.map((n) => n.id)), { offset: { x: 0, y: 0 }, select: false });
        }
      }
    });
  }
  build(): Widget {
    return Stack({
      fit: StackFit.expand,
      children: [
        (this.diagram ??= this.createDiagram()),
        Positioned({ top: 14, left: 16, child: this.text("DISCOVERY BOARD / Sprint 24") }),
        Positioned({
          bottom: 14,
          left: 125,
          child: Container({
            padding: EdgeInsets.all(5),
            decoration: new BoxDecoration({ color: this.c.card, border: Border.all({ color: this.c.line, width: 1 }), borderRadius: BorderRadius.circular(10) }),
            child: Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                ...["rect", "ellipse", "note"].map((shape) =>
                  this.button(({ rect: "▭ Rectangle", ellipse: "◯ Ellipse", note: "▤ Sticky" } as Record<string, string>)[shape], () => this.setState(() => { this.shape = shape; }), this.shape === shape)
                ),
                this.button("+ Add", () => this.add(40, 160, false)),
                this.button("Undo", () => this.flow.history.undo())
              ]
            })
          })
        }),
        Positioned({ top: 38, left: 16, child: this.text("⌘/Ctrl + arrow: append · Alt-drag: copy · double-click: write") })
      ]
    });
  }
  dispose() {
    if (typeof document !== "undefined") {
      document.removeEventListener("keydown", this.keyDown);
      document.removeEventListener("keyup", this.keyUp);
      window.removeEventListener("blur", this.blur);
    }
    this.flow.dispose();
    super.dispose();
  }
}
export default function Whiteboard(theme: Theme = "light"): Widget { return new Board(theme); }
