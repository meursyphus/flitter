import {
  Border, BorderRadius, BoxDecoration, Column, Container, CrossAxisAlignment,
  EdgeInsets, MainAxisSize, SizedBox, Text, TextStyle, type Widget,
} from "flitter-ui";
import { gridLayout, type FlowNode } from "flitter-ui/diagram";
import { FlowDiagram } from "@/components/diagram/flow-diagram";

const nodes: FlowNode[] = [
  ["api", "API gateway", "SERVICE", "99.98% uptime", "#6366f1"],
  ["worker", "Job workers", "COMPUTE", "12 active workers", "#0d9488"],
  ["storage", "Object storage", "STORAGE", "2.4 TB stored", "#2563eb"],
  ["queue", "Event queue", "MESSAGING", "842 events / min", "#d97706"],
  ["search", "Search index", "SERVICE", "18 ms latency", "#6366f1"],
  ["db", "Primary database", "STORAGE", "64 connections", "#2563eb"],
].map(([id, label, category, detail, color]) => ({
  id, type: "resource", position: { x: 0, y: 0 }, data: { label, category, detail, color },
}));

export default function CardGrid(theme: "light" | "dark" = "light"): Widget {
  const dark = theme === "dark";
  return FlowDiagram({
    nodes, edges: [], minZoom: 0.15,
    fitViewOptions: { padding: 0.15, maxZoom: 1 },
    layout: { algorithm: gridLayout, options: { columns: 3, nodeSpacing: 24, rankSpacing: 24 } },
    config: { colorMode: theme, controls: { visible: false }, minimap: { visible: false } },
    custom: { background: () => null },
    nodeTypes: {
      resource: {
        handles: [],
        build: ({ node, selected, hovered }) => Container({
          width: 190,
          padding: EdgeInsets.all(18),
          decoration: new BoxDecoration({
            color: selected ? dark ? "#283953" : "#eaf2ff" : dark ? "#20242e" : "#ffffff",
            border: Border.all({ color: selected || hovered ? String(node.data.color) : dark ? "#465066" : "#dbe3ed", width: 2 }),
            borderRadius: BorderRadius.circular(12),
          }),
          child: Column({ mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container({ width: 28, height: 5, color: String(node.data.color) }),
            SizedBox({ height: 16 }),
            Text(String(node.data.category), { style: new TextStyle({ fontFamily: "system-ui, sans-serif", color: dark ? "#aab6c8" : "#64748b", fontSize: 10 }) }),
            SizedBox({ height: 6 }),
            Text(String(node.data.label), { style: new TextStyle({ fontFamily: "system-ui, sans-serif", color: dark ? "#f1f5f9" : "#172033", fontSize: 14, fontWeight: "bold" }) }),
            SizedBox({ height: 14 }),
            Text(String(node.data.detail), { style: new TextStyle({ fontFamily: "system-ui, sans-serif", color: String(node.data.color), fontSize: 11 }) }),
          ] }),
        }),
      },
    },
  });
}
