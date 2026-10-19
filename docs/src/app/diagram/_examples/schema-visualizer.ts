import { defaultNode } from "@/components/diagram/flow-diagram";
import {
  LayoutBuilder,
  Expanded,
  Border,
  BorderRadius,
  BoxDecoration,
  Center,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  GestureDetector,
  MainAxisSize,
  Opacity,
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
} from "flitter-ui";
import {
  FlowDiagramController,
  layeredLayout,
  type FlowNode,
  type FlowEdge,
  type HandleSpec,
  type Connection,
} from "flitter-ui/diagram";
import FlowDiagram, { defaultEdge } from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
type Field = { name: string; type: string; badge?: "PK" | "FK" };
const tables: Record<string, Field[]> = {
  customers: [
    { name: "id", type: "uuid", badge: "PK" },
    { name: "email", type: "text" },
    { name: "created_at", type: "timestamp" },
  ],
  orders: [
    { name: "id", type: "uuid", badge: "PK" },
    { name: "customer_id", type: "uuid", badge: "FK" },
    { name: "total", type: "numeric" },
    { name: "status", type: "text" },
  ],
  order_items: [
    { name: "id", type: "uuid", badge: "PK" },
    { name: "order_id", type: "uuid", badge: "FK" },
    { name: "product_id", type: "uuid", badge: "FK" },
    { name: "quantity", type: "integer" },
  ],
  products: [
    { name: "id", type: "uuid", badge: "PK" },
    { name: "sku", type: "text" },
    { name: "price", type: "numeric" },
  ],
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
  diagram?: Widget;
  query = "";
  nodes: FlowNode[] = Object.entries(tables).map(([id, fields]) => ({
    id,
    type: "table",
    position: { x: 0, y: 0 },
    width: 250,
    height: 43 + fields.length * 32,
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
  ].map((e) => ({ ...e, type: "relation", markerEnd: "arrowclosed" }));
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#12191c",
          card: "#1b262b",
          ink: "#e4f2ed",
          mute: "#8da9a0",
          border: "#344b43",
        }
      : {
          bg: "#f3f8f5",
          card: "#ffffff",
          ink: "#153b2e",
          mute: "#6c8178",
          border: "#d3e2da",
        };
  }
  text(value: string, color = this.c.ink, size = 12) {
    return Text(value, {
      style: new TextStyle({
        fontFamily: "ui-monospace, monospace",
        fontSize: Math.max(13, size),
        height: 1.2,
        color,
      }),
    });
  }
  focus(id: string) {
    this.flow.selectNodes([id]);
    void this.flow.fitView({
      nodes: [{ id }],
      padding: 1,
      maxZoom: 1.2,
      duration: 200,
    });
  }
  compatible = (c: Connection) => {
    const a = tables[c.source]?.find((f) => f.name === c.sourceHandle),
      b = tables[c.target]?.find((f) => f.name === c.targetHandle);
    return c.source !== c.target && !!a && !!b && a.type === b.type;
  };
  handles(node: FlowNode): HandleSpec[] {
    return (tables[node.id] ?? []).flatMap((field) =>
      (["target", "source"] as const).map((type) => {
        return {
          id: field.name,
          type,
          position: type === "source" ? "right" : "left",
          placement: "inline",
          width: 8,
          height: 8,
          connectable: type === "target" || field.badge === "FK",
        };
      }),
    );
  }
  createDiagram(): Widget {
    const c = this.c;
    return FlowDiagram({
      controller: this.flow,
      highlightConnected: true,
      data: { nodes: this.nodes, edges: this.edges },
      layout: {
        algorithm: layeredLayout,
        options: { direction: "LR", rankSpacing: 55, nodeSpacing: 70 },
      },
      viewport: { fitView: { padding: 0.08, maxZoom: 1 }, minZoom: 0.15 },
      interaction: {
        drag: { snap: { grid: [20, 20] } },
        connect: { validate: this.compatible },
      },
      config: {
        edgeLabel: { fontSize: 13 },
        colorMode: this.widget.theme,
        colors: {
          background: c.bg,
          edgeStroke: "#49a184",
          edgeStrokeSelected: "#a78bfa",
        },
        minimap: { visible: false },
      },
      custom: {
        handle: (a, ctx) => {
          if (
            !a.node.selected &&
            ctx.hoveredNodeId !== a.node.id &&
            !a.isConnectionCandidate
          )
            return SizedBox({ width: 16, height: 16 });
          const color = a.isConnectionCandidate
            ? a.isValidCandidate
              ? "#22c55e"
              : "#ef4444"
            : a.handle.type === "source" && a.isConnectable
              ? "#8b5cf6"
              : "#49a184";
          return SizedBox({
            width: 16,
            height: 16,
            child: Center({
              child: Container({
                width: 8,
                height: 8,
                decoration: new BoxDecoration({
                  shape: "circle",
                  color,
                  border: Border.all({ color: c.card, width: 1 }),
                }),
              }),
            }),
          });
        },
        node: (args, ctx) => {
          const views: Record<string, typeof defaultNode> = {
            table: (
              {
                node,
                handles,
                isSelected: selected,
                isHovered: hovered,
                isNeighbour,
              },
              ctx,
            ) => {
              const active = ctx.hoveredNodeId ?? ctx.getSelectedNodes()[0]?.id;
              const related = !active || node.id === active || isNeighbour;
              return Opacity({
                opacity: related ? 1 : 0.32,
                child: Container({
                  decoration: new BoxDecoration({
                    color: c.card,
                    border: Border.all({
                      color: selected || hovered ? "#8b5cf6" : c.border,
                      width: 2,
                    }),
                    borderRadius: BorderRadius.circular(8),
                  }),
                  child: Column({
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Container({
                        height: 41,
                        padding: EdgeInsets.all(12),
                        color:
                          this.widget.theme === "dark" ? "#243a32" : "#e7f2eb",
                        child: this.text(`▦  public.${node.id}`, c.ink, 13),
                      }),
                      ...tables[node.id].map((field) =>
                        Container({
                          height: 32,
                          padding: EdgeInsets.symmetric({
                            horizontal: 6,
                            vertical: 6,
                          }),
                          child: Row({
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              handles.find(
                                (h) =>
                                  h.id === field.name && h.type === "target",
                              )!.handle,
                              Container({
                                width: 25,
                                child: this.text(
                                  field.badge ?? "·",
                                  field.badge === "FK" ? "#8b5cf6" : c.mute,
                                  9,
                                ),
                              }),
                              Expanded({
                                child: this.text(field.name, c.ink, 11),
                              }),
                              this.text(field.type, c.mute, 10),
                              handles.find(
                                (h) =>
                                  h.id === field.name && h.type === "source",
                              )!.handle,
                            ],
                          }),
                        }),
                      ),
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
            relation: (args, ctx) =>
              Opacity({
                opacity:
                  (!ctx.hoveredNodeId && !ctx.getSelectedNodes().length) ||
                  args.isNeighbour ||
                  args.isSelected
                    ? 1
                    : 0.2,
                child: defaultEdge(
                  {
                    ...args,
                    edge: {
                      ...args.edge,
                      style: {
                        stroke: args.isNeighbour ? "#8b5cf6" : "#60a58e",
                        strokeWidth: args.isNeighbour ? 2 : 1,
                      },
                    },
                  },
                  ctx,
                ),
              }),
          };
          return (
            views[args.edge.type ?? "default"] ??
            views.default ??
            defaultEdge
          )(args, ctx);
        },
      },
      nodeOptions: { table: { handles: (n) => this.handles(n) } },
    });
  }
  build(): Widget {
    const c = this.c;
    // Like ChartDB, the table list is a column beside the canvas on wide stages.
    return LayoutBuilder({
      builder: (_context, size) =>
        Stack({
          fit: StackFit.expand,
          children: [
            Positioned({
              left: size.maxWidth >= 700 ? 229 : 0,
              top: 0,
              right: 0,
              bottom: 0,
              child: (this.diagram ??= this.createDiagram()),
            }),
            Positioned({
              left: 12,
              top: 12,
              child: Container({
                width: 205,
                padding: EdgeInsets.all(12),
                decoration: new BoxDecoration({
                  color: c.card,
                  border: Border.all({ color: c.border, width: 1 }),
                  borderRadius: BorderRadius.circular(10),
                }),
                child: Column({
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    this.text("COMMERCE / PUBLIC", c.mute, 10),
                    Stack({
                      children: [
                        TextField("", {
                          key: "schema-visualizer-search",
                          ariaLabel: "Search tables",
                          width: 180,
                          height: 20,
                          decoration: new BoxDecoration({
                            color: c.card,
                            border: Border.all({ color: c.border, width: 1 }),
                          }),
                          focusedBorder: Border.all({
                            color: "#488ccc",
                            width: 2,
                          }),
                          padding: EdgeInsets.all(8),
                          style: new TextStyle({
                            color: c.ink,
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
                                child: this.text("Search tables…", c.mute, 12),
                              }),
                            ]
                          : []),
                      ],
                    }),
                    ...Object.keys(tables)
                      .filter((id) => id.includes(this.query.toLowerCase()))
                      .map((id) =>
                        GestureDetector({
                          onClick: () => this.focus(id),
                          child: Container({
                            padding: EdgeInsets.symmetric({ vertical: 6 }),
                            child: this.text(`⌕  ${id}`, "#38a17d", 11),
                          }),
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
                        padding: EdgeInsets.only({
                          left: size.maxWidth >= 700 ? 280 : 125,
                          right: 16,
                        }),
                        child: this.text(
                          "Drag a violet FK port to a matching type · 20px grid",
                          c.mute,
                          10,
                        ),
                      }),
              }),
            }),
          ],
        }),
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
