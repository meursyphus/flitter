import {
  BorderRadius,
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  Expanded,
  GestureDetector,
  LayoutBuilder,
  MainAxisSize,
  Row,
  SizedBox,
  State,
  StatefulWidget,
  Text,
  TextStyle,
  type Widget,
} from "flitterjs";
import {
  FlowDiagramController,
  type FlowEdge,
  type FlowNode,
} from "@flitterjs/diagram";
import FlowDiagram, { ShapePaint } from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
type Mode = "select" | "trait" | "deceased";
class Pedigree extends StatefulWidget {
  constructor(readonly theme: Theme) {
    super(theme);
  }
  createState() {
    return new PedigreeState();
  }
}
class PedigreeState extends State<Pedigree> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  mode: Mode = "trait";
  nodes: FlowNode[] = [
    ["I-1", "male", 240, 0, false],
    ["I-2", "female", 400, 0, true],
    ["II-1", "male", 60, 190, true],
    ["II-2", "female", 240, 190, false],
    ["II-3", "male", 440, 190, false],
    ["II-4", "female", 600, 190, true],
    ["III-1", "female", 370, 380, false],
    ["III-2", "male", 530, 380, true],
    ["III-3", "unknown", 690, 380, false],
  ].map(([id, symbol, x, y, affected]) => ({
    id: String(id),
    type: "person",
    position: { x: Number(x), y: Number(y) },
    width: 64,
    height: 88,
    draggable: false,
    data: { label: id, symbol, affected, deceased: false },
  }));
  edges: FlowEdge[] = [];
  constructor() {
    super();
    for (const [id, first, second, x, y, children] of [
      ["union-I", "I-1", "I-2", 351, 25, ["II-1", "II-2", "II-3"]],
      ["union-II", "II-3", "II-4", 551, 215, ["III-1", "III-2", "III-3"]],
    ] as const) {
      this.nodes.push({
        id,
        type: "union",
        position: { x, y },
        width: 2,
        height: 2,
        data: {},
        selectable: false,
        draggable: false,
      });
      this.edges.push(
        {
          id: `${id}-a`,
          source: first,
          sourceHandle: "right",
          target: id,
          targetHandle: "left",
          type: "straight",
          selectable: false,
        },
        {
          id: `${id}-b`,
          source: second,
          sourceHandle: "left",
          target: id,
          targetHandle: "right",
          type: "straight",
          selectable: false,
        },
        ...children.map((child) => ({
          id: `${id}-${child}`,
          source: id,
          sourceHandle: "child",
          target: child,
          targetHandle: "parent",
          type: "step",
          selectable: false,
        })),
      );
    }
  }
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#131a24",
          ink: "#e5eef8",
          line: "#a2b3c9",
          accent: "#73aaff",
          panel: "#25354b",
        }
      : {
          bg: "#fcfdff",
          ink: "#26364c",
          line: "#5b6b82",
          accent: "#2563eb",
          panel: "#e7effc",
        };
  }
  text(value: string, size = 16, color = this.c.ink) {
    return Text(value, {
      style: new TextStyle({ fontFamily: "system-ui", fontSize: size, color }),
    });
  }
  button(label: string, action: () => void, active = false) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.stopPropagation();
        action();
      },
      child: Container({
        padding: EdgeInsets.symmetric({ horizontal: 12, vertical: 10 }),
        decoration: new BoxDecoration({
          color: active ? this.c.panel : this.c.bg,
          borderRadius: BorderRadius.circular(6),
        }),
        child: this.text(label, 14, active ? this.c.accent : this.c.ink),
      }),
    });
  }
  mark(node: FlowNode) {
    if (node.type !== "person" || this.mode === "select") return;
    const field = this.mode === "trait" ? "affected" : "deceased";
    this.flow.history.mark(`Toggle ${field}`);
    this.flow.run(
      () => this.flow.updateNodeData(node.id, { [field]: !node.data[field] }),
      { history: "merge" },
    );
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      interaction: {
        preset: "viewer",
        history: { enabled: true },
        keys: { undo: "Mod+z", redo: "Mod+Shift+z" },
      },
      viewport: { minZoom: 0.2, fitView: { padding: 0.1, maxZoom: 1.15 } },
      on: { nodeClick: (_event, node) => this.mark(node) },
      config: {
        colorMode: this.widget.theme,
        colors: { background: c.bg, edgeStroke: c.line },
        edge: { strokeWidth: 2 },
        minimap: { visible: false },
        controls: { showInteractive: false },
      },
      nodeOptions: {
        person: {
          handles: [
            {
              id: "left",
              type: "source",
              position: "left",
              width: 0,
              height: 0,
              x: 10,
              y: 26,
            },
            {
              id: "right",
              type: "source",
              position: "right",
              width: 0,
              height: 0,
              x: 54,
              y: 26,
            },
            {
              id: "parent",
              type: "target",
              position: "top",
              width: 0,
              height: 0,
              x: 32,
              y: 4,
            },
          ],
        },
        union: {
          handles: [
            {
              id: "left",
              type: "target",
              position: "left",
              x: 1,
              y: 1,
              width: 0,
              height: 0,
            },
            {
              id: "right",
              type: "target",
              position: "right",
              x: 1,
              y: 1,
              width: 0,
              height: 0,
            },
            {
              id: "child",
              type: "source",
              position: "bottom",
              x: 1,
              y: 1,
              width: 0,
              height: 0,
            },
          ],
        },
      },
      custom: {
        background: () => Container({ color: c.bg }),
        handle: () => SizedBox.shrink(),
        node: ({ node, isSelected }) =>
          node.type === "union"
            ? SizedBox.shrink()
            : Column({
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  ShapePaint({
                    width: 64,
                    height: 60,
                    shapes: {
                      symbol: {
                        d:
                          node.data.symbol === "male"
                            ? "M10 4H54V48H10Z"
                            : node.data.symbol === "female"
                              ? "M10 26A22 22 0 1 0 54 26A22 22 0 1 0 10 26"
                              : "M32 2L58 26L32 50L6 26Z",
                        fill: node.data.affected ? c.ink : c.bg,
                        stroke: isSelected ? c.accent : c.ink,
                        strokeWidth: isSelected ? 3 : 2,
                      },
                      deceased: node.data.deceased
                        ? { d: "M3 56L61 0", stroke: c.ink, strokeWidth: 3 }
                        : null,
                    },
                  }),
                  SizedBox({ height: 4 }),
                  this.text(node.id, 16),
                ],
              }),
        controls: ({ zoomIn, zoomOut, fitView }) =>
          Row({
            mainAxisSize: MainAxisSize.min,
            children: [zoomOut, zoomIn, fitView],
          }),
      },
    });
  }
  build(): Widget {
    return LayoutBuilder({
      builder: (_context, size) =>
        Column({
          children: [
            Container({
              height: 54,
              color: this.c.bg,
              padding: EdgeInsets.symmetric({ horizontal: 12 }),
              child: Row({
                children: [
                  ...(size.maxWidth > 600
                    ? [Expanded({ child: this.text("Pedigree", 18) })]
                    : []),
                  this.button(
                    "Select",
                    () =>
                      this.setState(() => {
                        this.mode = "select";
                      }),
                    this.mode === "select",
                  ),
                  this.button(
                    "Trait",
                    () =>
                      this.setState(() => {
                        this.mode = "trait";
                      }),
                    this.mode === "trait",
                  ),
                  this.button(
                    "Deceased",
                    () =>
                      this.setState(() => {
                        this.mode = "deceased";
                      }),
                    this.mode === "deceased",
                  ),
                  this.button("Undo", () => this.flow.history.undo()),
                ],
              }),
            }),
            Expanded({ child: (this.diagram ??= this.createDiagram()) }),
          ],
        }),
    });
  }
  dispose() {
    this.flow.dispose();
    super.dispose();
  }
}
export default function GeneticPedigree(theme: Theme = "light"): Widget {
  return new Pedigree(theme);
}
