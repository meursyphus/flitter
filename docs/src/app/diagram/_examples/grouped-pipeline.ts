import {
  Alignment, Border, BorderRadius, BoxDecoration, Container, EdgeInsets, Text, TextStyle, type Widget,
} from "flitter-ui";
import { type FlowEdge, type FlowNode } from "flitter-ui/diagram";
import { FlowDiagram } from "@/components/diagram/flow-diagram";

// Child coordinates are relative to their parent. Move a group to move its contents.
const nodes: FlowNode[] = [
  { id: "ingest", type: "stage", position: { x: 0, y: 0 }, width: 245, height: 275, data: { label: "01 / INGEST", color: "#6366f1" } },
  { id: "process", type: "stage", position: { x: 340, y: 0 }, width: 245, height: 275, data: { label: "02 / PROCESS", color: "#0d9488" } },
  { id: "events", parentId: "ingest", extent: "parent", position: { x: 32, y: 75 }, data: { label: "Event stream" } },
  { id: "files", parentId: "ingest", extent: "parent", position: { x: 32, y: 175 }, data: { label: "File upload" } },
  { id: "validate", parentId: "process", extent: "parent", position: { x: 32, y: 75 }, data: { label: "Validate records" } },
  { id: "store", parentId: "process", extent: "parent", position: { x: 32, y: 175 }, data: { label: "Store results" } },
];
const edges: FlowEdge[] = [
  { id: "a", source: "events", target: "validate" },
  { id: "b", source: "files", target: "store" },
].map((edge) => ({ ...edge, type: "smoothstep", markerEnd: "arrowclosed" }));

export default function GroupedPipeline(theme: "light" | "dark" = "light"): Widget {
  const dark = theme === "dark";
  return FlowDiagram({
    nodes, edges, fitView: true, minZoom: 0.15,
    fitViewOptions: { padding: 0.2, maxZoom: 1 },
    config: { colorMode: theme, colors: { edgeStroke: theme === "dark" ? "#71829c" : "#94a3b8" }, edge: { strokeWidth: 1.5 }, controls: { visible: false }, minimap: { visible: false } },
    nodeTypes: {
      stage: {
        build: ({ node, selected }) => Container({
          width: node.width, height: node.height, alignment: Alignment.topLeft,
          padding: EdgeInsets.all(20),
          decoration: new BoxDecoration({
            color: dark ? "rgba(29,38,53,0.6)" : "rgba(241,245,251,0.7)",
            border: Border.all({ color: selected ? String(node.data.color) : dark ? "#465066" : "#cbd5e1", width: 2 }),
            borderRadius: BorderRadius.circular(16),
          }),
          child: Text(String(node.data.label), { style: new TextStyle({ fontFamily: "system-ui, sans-serif", color: dark ? "#b5c7e3" : "#475569", fontSize: 12, fontWeight: "bold" }) }),
        }),
        handles: [],
      },
      default: {
        build: ({ node, selected }) => Container({
          width: 180, padding: EdgeInsets.all(16),
          decoration: new BoxDecoration({
            color: dark ? "#303b4f" : "#ffffff",
            border: Border.all({ color: selected ? "#0d9488" : dark ? "#697893" : "#cbd5e1" }),
            borderRadius: BorderRadius.circular(8),
          }),
          child: Text(String(node.data.label), { style: new TextStyle({ fontFamily: "system-ui, sans-serif", color: dark ? "#f1f5f9" : "#172033", fontSize: 12 }) }),
        }),
        handles: [{ type: "target", position: "left" }, { type: "source", position: "right" }],
      },
    },
  });
}
