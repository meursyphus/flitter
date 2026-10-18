import {
  Alignment, Border, BorderRadius, BoxDecoration, Column, Container,
  MainAxisSize, SizedBox, Text, TextStyle, type Widget,
} from "flitter-ui";
import { commandsToD, forceLayout, getStraightPath, type FlowEdge, type FlowNode } from "flitter-ui/diagram";
import { FlowDiagram, ShapePaint } from "@/components/diagram/flow-diagram";

const nodes: FlowNode[] = [
  ["gateway", "Gateway", "420 req/s", "#6366f1"],
  ["auth", "Auth", "18 ms", "#0d9488"],
  ["catalog", "Catalog", "42 ms", "#0d9488"],
  ["orders", "Orders", "180 ms", "#d97706"],
  ["db", "Database", "12 ms", "#2563eb"],
  ["cache", "Cache", "2 ms", "#2563eb"],
].map(([id, label, metric, color]) => ({ id, type: "service", position: { x: 0, y: 0 }, data: { label, metric, color } }));
const edges: FlowEdge[] = [
  ["gateway", "auth", 2], ["gateway", "catalog", 5], ["gateway", "orders", 3],
  ["auth", "db", 2], ["catalog", "cache", 5], ["orders", "db", 3], ["cache", "db", 1],
].map(([source, target, traffic]) => ({
  id: `${source}-${target}`, source: String(source), target: String(target),
  type: "traffic", data: { traffic },
}));

export default function ServiceMap(theme: "light" | "dark" = "light"): Widget {
  const dark = theme === "dark";
  return FlowDiagram({
    nodes,
    edges,
    layout: { algorithm: forceLayout, options: { seed: 7, nodeSpacing: 75 } },
    config: { colorMode: theme, controls: { visible: false }, minimap: { visible: false } },
    custom: { background: () => null },
    nodeTypes: {
      service: {
        build: ({ node, selected, hovered }) =>
          Container({
            width: 112,
            height: 112,
            alignment: Alignment.center,
            decoration: new BoxDecoration({
              color: dark ? "#20242e" : "#ffffff",
              border: Border.all({ color: String(node.data.color), width: selected || hovered ? 5 : 2 }),
              borderRadius: BorderRadius.circular(56),
            }),
            child: Column({
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(String(node.data.label), {
                  style: new TextStyle({
                    fontFamily: "system-ui, sans-serif",
                    color: dark ? "#f1f5f9" : "#172033",
                    fontSize: 13,
                    fontWeight: "bold",
                  }),
                }),
                SizedBox({ height: 8 }),
                Text(String(node.data.metric), {
                  style: new TextStyle({
                    fontFamily: "system-ui, sans-serif",
                    color: String(node.data.color),
                    fontSize: 11,
                  }),
                }),
              ],
            }),
          }),
        handles: [],
      },
    },
    edgeTypes: {
      traffic: {
        getPath: getStraightPath,
        build: ({ path, size, edge, selected, hovered }) =>
          ShapePaint({
            ...size,
            shapes: {
              traffic: {
                d: commandsToD(path.commands),
                stroke: selected || hovered ? "#f59e0b" : dark ? "#697893" : "#b5c2d6",
                strokeWidth: Number(edge.data?.traffic ?? 1),
              },
            },
          }),
      },
    },
    viewport: { minZoom: 0.15, fitView: { padding: 0.2, maxZoom: 1 } },
  });
}
