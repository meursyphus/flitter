import {
  Alignment, Border, BorderRadius, BoxDecoration, Column, Container,
  CrossAxisAlignment, EdgeInsets, MainAxisSize, Row, SizedBox, Text, TextStyle, type Widget,
} from "flitter-ui";
import { treeLayout, type FlowEdge, type FlowNode } from "flitter-ui/diagram";
import { FlowDiagram } from "@/components/diagram/flow-diagram";

const people = [
  ["mina", "Mina Kim", "Engineering", "MK", "#7c3aed"],
  ["leo", "Leo Park", "Platform", "LP", "#2563eb"],
  ["sara", "Sara Lee", "Product", "SL", "#0d9488"],
  ["jin", "Jin Moon", "Infrastructure", "JM", "#2563eb"],
  ["ava", "Ava Han", "Developer tools", "AH", "#2563eb"],
  ["noah", "Noah Choi", "Experience", "NC", "#0d9488"],
];
const nodes: FlowNode[] = people.map(([id, label, role, initials, color]) => ({
  id, type: "person", position: { x: 0, y: 0 }, data: { label, role, initials, color },
}));
const edges: FlowEdge[] = [["mina", "leo"], ["mina", "sara"], ["leo", "jin"], ["leo", "ava"], ["sara", "noah"]]
  .map(([source, target]) => ({ id: `${source}-${target}`, source, target, type: "smoothstep" }));

export default function Organization(theme: "light" | "dark" = "light"): Widget {
  const dark = theme === "dark";
  return FlowDiagram({
    nodes, edges, minZoom: 0.15,
    fitViewOptions: { padding: 0.2, maxZoom: 1 },
    layout: { algorithm: treeLayout, options: { direction: "TB", nodeSpacing: 30, rankSpacing: 65 } },
    config: { colorMode: theme, colors: { edgeStroke: theme === "dark" ? "#71829c" : "#94a3b8" }, edge: { strokeWidth: 1.5 }, controls: { visible: false }, minimap: { visible: false } },
    custom: { background: () => null },
    nodeTypes: {
      person: {
        build: ({ node, selected }) => Container({
          padding: EdgeInsets.all(14),
          decoration: new BoxDecoration({
            color: dark ? "#20242e" : "#ffffff",
            border: Border.all({ color: selected ? String(node.data.color) : dark ? "#465066" : "#dbe3ed", width: 2 }),
            borderRadius: BorderRadius.circular(40),
          }),
          child: Row({ mainAxisSize: MainAxisSize.min, children: [
            Container({
              width: 40, height: 40, alignment: Alignment.center,
              decoration: new BoxDecoration({ color: String(node.data.color), borderRadius: BorderRadius.circular(20) }),
              child: Text(String(node.data.initials), { style: new TextStyle({ fontFamily: "system-ui, sans-serif", color: "#ffffff", fontSize: 13, fontWeight: "bold" }) }),
            }),
            SizedBox({ width: 12 }),
            Column({ mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(String(node.data.label), { style: new TextStyle({ fontFamily: "system-ui, sans-serif", color: dark ? "#f1f5f9" : "#172033", fontSize: 14, fontWeight: "bold" }) }),
              SizedBox({ height: 4 }),
              Text(String(node.data.role), { style: new TextStyle({ fontFamily: "system-ui, sans-serif", color: dark ? "#aab6c8" : "#64748b", fontSize: 11 }) }),
            ] }),
          ] }),
        }),
        handles: [{ type: "target", position: "top" }, { type: "source", position: "bottom" }],
      },
    },
  });
}
