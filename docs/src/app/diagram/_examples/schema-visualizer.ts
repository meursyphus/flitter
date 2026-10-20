import {
  Border,
  BorderRadius,
  BoxDecoration,
  Center,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  Expanded,
  GestureDetector,
  LayoutBuilder,
  InputDecoration,
  MainAxisSize,
  Positioned,
  Row,
  SizedBox,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  Text,
  TextField,
  TextStyle,
  type Widget,
} from "flitterjs";
import {
  FlowDiagramController,
  type Connection,
  type FlowEdge,
  type FlowNode,
  type HandleSpec,
} from "@flitterjs/diagram";
import FlowDiagram, { defaultEdge } from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
type Field = { name: string; type: string; badge?: "PK" | "FK" };
const tables: Record<string, Field[]> = {
  customers: [
    { name: "id", type: "uuid", badge: "PK" },
    { name: "email", type: "text" },
    { name: "name", type: "text" },
    { name: "created_at", type: "timestamp" },
  ],
  orders: [
    { name: "id", type: "uuid", badge: "PK" },
    { name: "customer_id", type: "uuid", badge: "FK" },
    { name: "total", type: "numeric" },
    { name: "status", type: "text" },
  ],
  products: [
    { name: "id", type: "uuid", badge: "PK" },
    { name: "sku", type: "text" },
    { name: "name", type: "text" },
    { name: "price", type: "numeric" },
  ],
  order_items: [
    { name: "id", type: "uuid", badge: "PK" },
    { name: "order_id", type: "uuid", badge: "FK" },
    { name: "product_id", type: "uuid", badge: "FK" },
    { name: "quantity", type: "integer" },
  ],
};
const accents: Record<string, string> = {
  customers: "#6b9df5",
  orders: "#41b59a",
  products: "#bb91ec",
  order_items: "#dcab56",
};

class Schema extends StatefulWidget {
  constructor(readonly theme: Theme) {
    super(theme);
  }
  createState() {
    return new SchemaState();
  }
}
class SchemaState extends State<Schema> {
  flow = new FlowDiagramController();
  query = "";
  selected = "orders";
  nodes: FlowNode[] = Object.keys(tables).map((id, i) => ({
    id,
    type: "table",
    position: { x: (i % 2) * 360, y: Math.floor(i / 2) * 245 },
    width: 280,
    height: 174,
    data: { label: id },
    selected: id === "orders",
  }));
  edges: FlowEdge[] = [
    {
      id: "orders_customer",
      source: "orders",
      sourceHandle: "customer_id",
      target: "customers",
      targetHandle: "id",
    },
    {
      id: "items_order",
      source: "order_items",
      sourceHandle: "order_id",
      target: "orders",
      targetHandle: "id",
    },
    {
      id: "items_product",
      source: "order_items",
      sourceHandle: "product_id",
      target: "products",
      targetHandle: "id",
    },
  ].map((e) => ({ ...e, type: "smoothstep", label: "N : 1" }));
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#141719",
          card: "#1c2023",
          inset: "#252a2e",
          ink: "#edf0f2",
          mute: "#a0a8b1",
          line: "#33393e",
          accent: "#5dd6b6",
        }
      : {
          bg: "#f4f6f8",
          card: "#ffffff",
          inset: "#eef2f5",
          ink: "#202b35",
          mute: "#647381",
          line: "#dce2e8",
          accent: "#167e68",
        };
  }
  text(value: string, size = 12, color = this.c.ink, mono = false) {
    return Text(value, {
      style: new TextStyle({
        fontFamily: mono ? "ui-monospace, monospace" : "system-ui",
        fontSize: Math.max(13, size),
        height: 1.25,
        color,
      }),
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
        padding: EdgeInsets.symmetric({ horizontal: 12, vertical: 9 }),
        decoration: new BoxDecoration({
          color: active ? this.c.inset : this.c.card,
          borderRadius: BorderRadius.circular(5),
        }),
        child: this.text(label, 14, active ? this.c.accent : this.c.ink),
      }),
    });
  }
  focus(id: string) {
    this.flow.selectNodes([id]);
    this.setState(() => {
      this.selected = id;
    });
    void this.flow.fitView({
      nodes: [
        { id },
        ...this.flow.getIncomers({ id }),
        ...this.flow.getOutgoers({ id }),
      ],
      padding: 0.18,
      maxZoom: 1,
      duration: 200,
    });
  }
  handles(node: FlowNode): HandleSpec[] {
    return tables[node.id].flatMap((field) =>
      (["target", "source"] as const).map((type) => ({
        id: field.name,
        type,
        position: type === "source" ? "left" : "right",
        placement: "inline",
        width: 12,
        height: 12,
        connectable:
          type === "target" ? field.badge === "PK" : field.badge === "FK",
      })),
    );
  }
  compatible = (connection: Connection) => {
    const source = tables[connection.source]?.find(
      (f) => f.name === connection.sourceHandle,
    );
    const target = tables[connection.target]?.find(
      (f) => f.name === connection.targetHandle,
    );
    return (
      connection.source !== connection.target &&
      source?.badge === "FK" &&
      target?.badge === "PK" &&
      source.type === target.type
    );
  };
  sidebar(): Widget {
    const matches = Object.keys(tables).filter((id) =>
      id.includes(this.query.toLowerCase()),
    );
    return Container({
      width: 184,
      color: this.c.card,
      padding: EdgeInsets.all(14),
      child: Column({
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(this.query, {
            key: "schema-search",
            ariaLabel: "Search tables",
            width: 156,
            height: 32,
            decoration: new InputDecoration({
              hintText: "Search tables",
              hintStyle: new TextStyle({ color: this.c.mute, fontSize: 14 }),
              border: Border.all({ color: this.c.line, width: 1 }),
              contentPadding: EdgeInsets.all(8),
            }),
            style: new TextStyle({
              fontFamily: "system-ui",
              color: this.c.ink,
              fontSize: 14,
            }),
            onChanged: (value) =>
              this.setState(() => {
                this.query = value;
              }),
          }),
          SizedBox({ height: 20 }),
          ...matches.map((id) =>
            this.button(id, () => this.focus(id), this.selected === id),
          ),
          ...(matches.length
            ? []
            : [this.text("No tables found", 12, this.c.mute)]),
        ],
      }),
    });
  }
  build(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      viewport: { minZoom: 0.15, fitView: { padding: 0.12, maxZoom: 1 } },
      interaction: {
        drag: { snap: { grid: [10, 10] } },
        connect: { validate: this.compatible },
      },
      can: (gesture) => gesture !== "delete",
      on: {
        nodeClick: (_event, node) =>
          this.setState(() => {
            this.selected = node.id;
          }),
      },
      config: {
        colorMode: this.widget.theme,
        colors: { background: c.bg, edgeStroke: c.mute },
        edge: { strokeWidth: 1.5 },
        edgeLabel: { fontSize: 13 },
        minimap: { visible: false },
      },
      nodeOptions: { table: { handles: (node) => this.handles(node) } },
      custom: {
        // The complete editor shell is a widget, including the explorer and footer.
        layout: ({
          background,
          viewport,
          selectionBox,
          toolbars,
          contextMenu,
          controls,
        }) =>
          LayoutBuilder({
            builder: (_context, size) =>
              Column({
                children: [
                  Container({
                    height: 46,
                    color: c.card,
                    padding: EdgeInsets.symmetric({ horizontal: 16 }),
                    child: Row({
                      children: [
                        Expanded({ child: this.text("Commerce / Schema", 16) }),
                      ],
                    }),
                  }),
                  Expanded({
                    child: Row({
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        ...(size.maxWidth >= 760
                          ? [
                              this.sidebar(),
                              Container({ width: 1, color: c.line }),
                            ]
                          : []),
                        Expanded({
                          child: Stack({
                            fit: StackFit.expand,
                            children: [
                              background,
                              viewport,
                              selectionBox,
                              toolbars,
                              contextMenu,
                            ],
                          }),
                        }),
                      ],
                    }),
                  }),
                  Container({
                    height: 42,
                    color: c.card,
                    padding: EdgeInsets.symmetric({ horizontal: 12 }),
                    child: Row({
                      children: [
                        Expanded({ child: SizedBox.shrink() }),
                        controls,
                      ],
                    }),
                  }),
                ],
              }),
          }),
        controls: ({ zoomIn, zoomOut, fitView }) =>
          Row({
            mainAxisSize: MainAxisSize.min,
            children: [zoomOut, zoomIn, fitView],
          }),
        handle: ({
          handle,
          isConnectable,
          isConnectionCandidate,
          isValidCandidate,
        }) =>
          SizedBox({
            width: 12,
            height: 12,
            child: Center({
              child: Container({
                width: isConnectable ? 6 : 3,
                height: isConnectable ? 6 : 3,
                decoration: new BoxDecoration({
                  shape: "circle",
                  color: isConnectionCandidate
                    ? isValidCandidate
                      ? "#22c55e"
                      : "#ef4444"
                    : isConnectable
                      ? c.accent
                      : c.line,
                }),
              }),
            }),
          }),
        node: ({ node, handles, isSelected }) =>
          Container({
            decoration: new BoxDecoration({
              color: c.card,
              borderRadius: BorderRadius.circular(7),
              border: Border.all({
                color: isSelected ? c.accent : c.line,
                width: isSelected ? 2 : 1,
              }),
            }),
            child: Column({
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container({ height: 3, color: accents[node.id] }),
                Container({
                  height: 47,
                  padding: EdgeInsets.symmetric({ horizontal: 14 }),
                  child: Row({
                    children: [
                      Expanded({ child: this.text(node.id, 14, c.ink, true) }),
                      this.text("public", 11, c.mute),
                    ],
                  }),
                }),
                ...tables[node.id].map((field) =>
                  Container({
                    height: 30,
                    padding: EdgeInsets.symmetric({ horizontal: 6 }),
                    child: Row({
                      children: [
                        handles.find(
                          (h) => h.id === field.name && h.type === "source",
                        )!.handle,
                        SizedBox({
                          width: 27,
                          child: this.text(
                            field.badge ?? "",
                            10,
                            field.badge === "PK" ? c.accent : c.mute,
                          ),
                        }),
                        Expanded({
                          child: this.text(field.name, 12, c.ink, true),
                        }),
                        this.text(field.type, 11, c.mute, true),
                        SizedBox({ width: 7 }),
                        handles.find(
                          (h) => h.id === field.name && h.type === "target",
                        )!.handle,
                      ],
                    }),
                  }),
                ),
              ],
            }),
          }),
        edge: (args, context) =>
          defaultEdge(
            {
              ...args,
              edge: {
                ...args.edge,
                style: {
                  stroke: args.isSelected ? c.accent : c.mute,
                  strokeWidth: args.isSelected ? 2 : 1.2,
                },
              },
            },
            context,
          ),
      },
    });
  }
  dispose() {
    this.flow.dispose();
    super.dispose();
  }
}
export default function SchemaVisualizer(theme: Theme = "light"): Widget {
  return new Schema(theme);
}
