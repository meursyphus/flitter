import {
  Alignment,
  Border,
  BorderRadius,
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  Expanded,
  GestureDetector,
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
  createId,
  type FlowEdge,
  type FlowNode,
} from "@flitterjs/diagram";
import FlowDiagram from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
class Family extends StatefulWidget {
  constructor(readonly theme: Theme) {
    super(theme);
  }
  createState() {
    return new FamilyState();
  }
}
class FamilyState extends State<Family> {
  flow = new FlowDiagramController();
  diagram?: Widget;
  serial = 0;
  nodes: FlowNode[] = [
    ["thomas", "Thomas", "1948", 240, 0, "#638c7c"],
    ["eva", "Eva", "1951", 420, 0, "#b87a64"],
    ["noah", "Noah", "1975", 60, 210, "#638c7c"],
    ["mia", "Mia", "1978", 240, 210, "#a582ba"],
    ["leo", "Leo", "1980", 500, 210, "#b8914e"],
    ["anna", "Anna", "1982", 680, 210, "#6c8faa"],
    ["isla", "Isla", "2003", 0, 420, "#b87a64"],
    ["owen", "Owen", "2006", 160, 420, "#638c7c"],
    ["ella", "Ella", "2008", 550, 420, "#a582ba"],
    ["liam", "Liam", "2011", 710, 420, "#b8914e"],
  ].map(([id, label, year, x, y, color]) => ({
    id: String(id),
    type: "person",
    toolbar: { position: Number(y) === 0 ? "bottom" : "top", offset: 8 },
    width: 104,
    height: 124,
    position: { x: Number(x), y: Number(y) },
    data: { label, year, color },
  }));
  edges: FlowEdge[] = [];
  constructor() {
    super();
    for (const [id, first, second, x, y, children] of [
      ["grandparents", "thomas", "eva", 381, 37, ["noah", "leo"]],
      ["noah-family", "noah", "mia", 201, 247, ["isla", "owen"]],
      ["leo-family", "leo", "anna", 641, 247, ["ella", "liam"]],
    ] as const) {
      this.nodes.push({
        id,
        type: "union",
        width: 2,
        height: 2,
        position: { x, y },
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
          type: "smoothstep",
          selectable: false,
        })),
      );
    }
  }
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#191d1a",
          ink: "#f0eee6",
          muted: "#b7b8ac",
          branch: "#a39876",
          panel: "#242b25",
        }
      : {
          bg: "#fbf8ef",
          ink: "#33473b",
          muted: "#758172",
          branch: "#b0a382",
          panel: "#f0ecdf",
        };
  }
  text(value: string, size = 16, color = this.c.ink) {
    return Text(value, {
      style: new TextStyle({ fontFamily: "system-ui", fontSize: size, color }),
    });
  }
  button(label: string, action: () => void) {
    return GestureDetector({
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.stopPropagation();
        action();
      },
      child: Container({
        padding: EdgeInsets.symmetric({ horizontal: 13, vertical: 10 }),
        decoration: new BoxDecoration({
          color: this.c.panel,
          borderRadius: BorderRadius.circular(7),
        }),
        child: this.text(label, 14),
      }),
    });
  }
  familyOf(person: FlowNode) {
    return this.flow.getOutgoers(person).find((node) => node.type === "union");
  }
  syncHiddenBranches() {
    const hidden = new Set<string>();
    for (const family of this.flow.nodes.filter(
      (node) => node.type === "union" && node.data.folded,
    )) {
      const seen = new Set<string>();
      const queue = this.flow.getOutgoers(family).map((node) => node.id);
      for (let index = 0; index < queue.length; index++) {
        const id = queue[index];
        if (seen.has(id)) continue;
        seen.add(id);
        hidden.add(id);
        const node = this.flow.getNode(id);
        if (!node) continue;
        // Partners in descendant households fold together; the selected couple stays visible.
        if (node.type === "union")
          this.flow
            .getIncomers(node)
            .forEach((parent) => hidden.add(parent.id));
        queue.push(...this.flow.getOutgoers(node).map((child) => child.id));
      }
    }
    this.flow.setNodes((nodes) =>
      nodes.map((node) => ({ ...node, hidden: hidden.has(node.id) })),
    );
  }
  toggleBranch(person: FlowNode) {
    const family = this.familyOf(person);
    if (!family) return;
    this.flow.history.mark("Fold family branch");
    this.flow.run(
      () => {
        this.flow.updateNodeData(family.id, { folded: !family.data.folded });
        this.syncHiddenBranches();
      },
      { history: "merge" },
    );
  }
  addChild(parent: FlowNode) {
    const existing = this.flow
      .getOutgoers(parent)
      .find((node) => node.type === "union");
    const unionId = existing?.id ?? createId("family");
    const parentOrigin = existing?.position ?? {
      x: parent.position.x + 51,
      y: parent.position.y + 150,
    };
    const siblings = existing ? this.flow.getOutgoers(existing) : [];
    let x = siblings.length
      ? Math.max(...siblings.map((node) => node.position.x)) + 160
      : parent.position.x;
    const childY = parentOrigin.y + 173;
    while (
      this.flow.nodes.some(
        (node) =>
          node.type === "person" &&
          Math.abs(node.position.y - childY) < 124 &&
          Math.abs(node.position.x - x) < 120,
      )
    )
      x += 160;
    const id = createId("person");
    const label = ["Alex", "Robin", "Sam", "Charlie"][this.serial % 4];
    this.setState(() => {
      this.serial++;
    });
    this.flow.history.mark("Add child");
    this.flow.run(
      () => {
        if (!existing) {
          this.flow.addNodes({
            id: unionId,
            type: "union",
            position: parentOrigin,
            width: 2,
            height: 2,
            data: {},
            selectable: false,
            draggable: false,
          });
          this.flow.addEdges({
            id: createId("parent"),
            source: parent.id,
            sourceHandle: "child",
            target: unionId,
            targetHandle: "parent",
            type: "straight",
            selectable: false,
          });
        }
        this.flow.updateNodeData(unionId, { folded: false });
        this.flow.addNodes({
          id,
          type: "person",
          position: { x, y: childY },
          toolbar: { position: "top", offset: 8 },
          width: 104,
          height: 124,
          data: { label, year: "", color: parent.data.color },
        });
        this.flow.addEdges({
          id: createId("child"),
          source: unionId,
          sourceHandle: "child",
          target: id,
          targetHandle: "parent",
          type: "smoothstep",
          selectable: false,
        });
        this.syncHiddenBranches();
        this.flow.selectNodes([id]);
      },
      { history: "merge" },
    );
    void this.flow.fitView({ padding: 0.1, maxZoom: 1 });
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      viewport: { minZoom: 0.15, fitView: { padding: 0.08, maxZoom: 1 } },
      interaction: {
        connect: { enabled: false },
        keys: { delete: null },
        contextMenu: { enabled: false },
      },
      config: {
        colorMode: this.widget.theme,
        colors: { background: c.bg, edgeStroke: c.branch },
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
              x: 14,
              y: 38,
            },
            {
              id: "right",
              type: "source",
              position: "right",
              width: 0,
              height: 0,
              x: 90,
              y: 38,
            },
            {
              id: "parent",
              type: "target",
              position: "top",
              width: 0,
              height: 0,
            },
            {
              id: "child",
              type: "source",
              position: "bottom",
              width: 0,
              height: 0,
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
              id: "parent",
              type: "target",
              position: "top",
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
                  Container({
                    width: 76,
                    height: 76,
                    alignment: Alignment.center,
                    decoration: new BoxDecoration({
                      shape: "circle",
                      color: String(node.data.color),
                      border: Border.all({
                        color: isSelected ? c.ink : c.bg,
                        width: 3,
                      }),
                    }),
                    child: this.text(
                      String(node.data.label).slice(0, 1),
                      30,
                      "#ffffff",
                    ),
                  }),
                  SizedBox({ height: 8 }),
                  this.text(
                    `${node.data.label}${this.familyOf(node)?.data.folded ? " +" : ""}`,
                    17,
                  ),
                ],
              }),
        nodeToolbar: ({ node }) =>
          node.type === "person"
            ? Row({
                mainAxisSize: MainAxisSize.min,
                children: [
                  this.button("+ Child", () => this.addChild(node)),
                  ...(this.familyOf(node)
                    ? [
                        SizedBox({ width: 4 }),
                        this.button(
                          this.familyOf(node)?.data.folded
                            ? "Expand"
                            : "Collapse",
                          () => this.toggleBranch(node),
                        ),
                      ]
                    : []),
                ],
              })
            : SizedBox.shrink(),
        controls: ({ zoomIn, zoomOut, fitView }) =>
          Row({
            mainAxisSize: MainAxisSize.min,
            children: [zoomOut, zoomIn, fitView],
          }),
      },
    });
  }
  build(): Widget {
    return Column({
      children: [
        Container({
          height: 52,
          color: this.c.bg,
          padding: EdgeInsets.symmetric({ horizontal: 16 }),
          child: Row({
            children: [
              Expanded({ child: this.text("The Morgan family", 18) }),
              this.button("Undo", () => this.flow.history.undo()),
            ],
          }),
        }),
        Expanded({ child: (this.diagram ??= this.createDiagram()) }),
      ],
    });
  }
  dispose() {
    this.flow.dispose();
    super.dispose();
  }
}
export default function FamilyTree(theme: Theme = "light"): Widget {
  return new Family(theme);
}
