import {
  Border, BorderRadius, BoxDecoration, Column, Container, CrossAxisAlignment,
  EdgeInsets, GestureDetector, MainAxisSize, SizedBox, Text, TextStyle, type Widget,
} from "flitter-ui";
import { layeredLayout, type FlowEdge, type FlowNode } from "flitter-ui/diagram";
import { FlowDiagram } from "@/components/diagram/flow-diagram";

const nodes: FlowNode[] = [
  { id: "push", data: { label: "Push to main", status: "TRIGGER", detail: "GitHub webhook", color: "#6366f1" } },
  { id: "test", data: { label: "Run tests", status: "PASSED", detail: "128 checks · 24s", color: "#16a34a" } },
  { id: "build", data: { label: "Build image", status: "PASSED", detail: "Container · 38s", color: "#16a34a" } },
  { id: "review", data: { label: "Review deploy", status: "WAITING", detail: "Needs one approval", color: "#d97706" } },
  { id: "ship", data: { label: "Production", status: "NEXT", detail: "ap-northeast-2", color: "#64748b" } },
].map((node) => ({ ...node, type: "task", position: { x: 0, y: 0 } }));

const edges: FlowEdge[] = [
  { id: "a", source: "push", target: "test" },
  { id: "b", source: "push", target: "build" },
  { id: "c", source: "test", target: "review" },
  { id: "d", source: "build", target: "review" },
  { id: "e", source: "review", target: "ship" },
].map((edge) => ({ ...edge, type: "smoothstep", markerEnd: "arrowclosed" }));

export default function Workflow(theme: "light" | "dark" = "light"): Widget {
  const dark = theme === "dark";
  return FlowDiagram({
    nodes,
    edges,
    layout: { algorithm: layeredLayout, options: { direction: "LR", rankSpacing: 70, nodeSpacing: 35 } },
    config: {
      colorMode: theme,
      colors: { edgeStroke: theme === "dark" ? "#71829c" : "#94a3b8" },
      edge: { strokeWidth: 1.5 },
      controls: { visible: false },
      minimap: { visible: false },
    },
    nodeTypes: {
      task: {
        // A product action uses the same controller as dragging and connecting.
        toolbar: ({ node }, flow) =>
          GestureDetector({
            onClick: () =>
              flow.updateNodeData(node.id, { status: "DONE", detail: "Approved just now", color: "#16a34a" }),
            child: Container({
              padding: EdgeInsets.symmetric({ horizontal: 12, vertical: 8 }),
              color: "#166534",
              child: Text("Mark complete", {
                style: new TextStyle({ fontFamily: "system-ui, sans-serif", color: "#ffffff", fontSize: 12 }),
              }),
            }),
          }),
        build: ({ node, selected, hovered }) =>
          Container({
            width: 180,
            padding: EdgeInsets.all(16),
            decoration: new BoxDecoration({
              color: dark ? "#20242e" : "#ffffff",
              border: Border.all({
                color: selected || hovered ? String(node.data.color) : dark ? "#3b4252" : "#e2e8f0",
                width: 2,
              }),
              borderRadius: BorderRadius.circular(12),
            }),
            child: Column({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(String(node.data.status), {
                  style: new TextStyle({
                    fontFamily: "system-ui, sans-serif",
                    color: String(node.data.color),
                    fontSize: 10,
                    fontWeight: "bold",
                  }),
                }),
                SizedBox({ height: 10 }),
                Text(String(node.data.label), {
                  style: new TextStyle({
                    fontFamily: "system-ui, sans-serif",
                    color: dark ? "#f1f5f9" : "#172033",
                    fontSize: 15,
                    fontWeight: "bold",
                  }),
                }),
                SizedBox({ height: 6 }),
                Text(String(node.data.detail), {
                  style: new TextStyle({
                    fontFamily: "system-ui, sans-serif",
                    color: dark ? "#aab6c8" : "#64748b",
                    fontSize: 11,
                  }),
                }),
              ],
            }),
          }),
        handles: [
          { type: "target", position: "left" },
          { type: "source", position: "right" },
        ],
      },
    },
    viewport: { minZoom: 0.15, fitView: { padding: 0.15, maxZoom: 1 } },
  });
}
