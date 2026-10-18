import {
  Border, BorderRadius, BoxDecoration, Column, Container, CrossAxisAlignment,
  EdgeInsets, MainAxisSize, Text, TextStyle, type Widget,
} from "flitter-ui";
import { type FlowContext, type FlowEdge, type FlowNode, type HandleSpec, type NodeBuilderArgs } from "flitter-ui/diagram";
import { FlowDiagram, type DefaultFlowConfig } from "@/components/diagram/flow-diagram";

type TableData = { label: string; fields: { name: string; type: string }[] };

const HEADER_HEIGHT = 36;
const ROW_HEIGHT = 28;

function tableNode({ node, selected }: NodeBuilderArgs, context: FlowContext<DefaultFlowConfig>): Widget {
  const table = node.data as TableData;
  const { colors } = context.config;
  return Container({
    width: 200,
    decoration: new BoxDecoration({
      color: colors.nodeBackground,
      border: Border.all({ color: selected ? "#3367d9" : colors.nodeBorder }),
      borderRadius: BorderRadius.circular(4),
    }),
    child: Column({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container({
          height: HEADER_HEIGHT,
          color: "#4338ca",
          padding: EdgeInsets.symmetric({ horizontal: 10, vertical: 7 }),
          child: Text(table.label, {
            style: new TextStyle({ fontFamily: "system-ui, sans-serif", fontSize: 12, fontWeight: "700", color: "#ffffff" }),
          }),
        }),
        ...table.fields.map((field) =>
          Container({
            height: ROW_HEIGHT,
            padding: EdgeInsets.symmetric({ horizontal: 10, vertical: 4 }),
            child: Text(`${field.name}  ${field.type}`, {
              style: new TextStyle({ fontFamily: "system-ui, sans-serif", fontSize: 11, color: colors.nodeColor }),
            }),
          }),
        ),
      ],
    }),
  });
}

function tableHandles(node: FlowNode): HandleSpec[] {
  const table = node.data as TableData;
  return table.fields.flatMap((field, index): HandleSpec[] => {
    const y = HEADER_HEIGHT + ROW_HEIGHT * index + ROW_HEIGHT / 2;
    return [
      { id: field.name, type: "target", position: "left", y },
      { id: field.name, type: "source", position: "right", y },
    ];
  });
}

const tables: FlowNode[] = [
  {
    id: "posts",
    type: "table",
    position: { x: 0, y: 0 },
    data: { label: "posts", fields: [{ name: "id", type: "int" }, { name: "author_id", type: "int" }, { name: "title", type: "text" }] },
  },
  {
    id: "users",
    type: "table",
    position: { x: 300, y: 150 },
    data: { label: "users", fields: [{ name: "id", type: "int" }, { name: "team_id", type: "int" }, { name: "email", type: "text" }] },
  },
  {
    id: "teams",
    type: "table",
    position: { x: 0, y: 300 },
    data: { label: "teams", fields: [{ name: "id", type: "int" }, { name: "name", type: "text" }] },
  },
];

const relations: FlowEdge[] = [
  { id: "posts-users", source: "posts", sourceHandle: "author_id", target: "users", targetHandle: "id", type: "smoothstep", markerEnd: "arrowclosed" },
  { id: "users-teams", source: "users", sourceHandle: "team_id", target: "teams", targetHandle: "id", type: "smoothstep", markerEnd: "arrowclosed" },
];

export default function DatabaseSchema(theme: "light" | "dark" = "light"): Widget {
  return FlowDiagram({
    nodes: tables,
    edges: relations,
    nodeTypes: { table: { build: tableNode, handles: tableHandles } },
    config: {
      colorMode: theme,
      colors: { edgeStroke: theme === "dark" ? "#71829c" : "#94a3b8" },
      edge: { strokeWidth: 1.5 },
      controls: { visible: false },
      minimap: { visible: false },
    },
    viewport: { fitView: { padding: 0.15, maxZoom: 1 }, minZoom: 0.15 },
  });
}
