import { layeredLayout, type FlowDiagramData } from "@flitterjs/diagram";
import FlowDiagram from "@/components/diagram/flow-diagram";

const data: FlowDiagramData = {
  nodes: [
    {
      id: "draft",
      type: "input",
      position: { x: 0, y: 0 },
      data: { label: "Draft" },
    },
    { id: "review", position: { x: 0, y: 0 }, data: { label: "Review" } },
    {
      id: "publish",
      type: "output",
      position: { x: 0, y: 0 },
      data: { label: "Publish" },
    },
  ],
  edges: [
    { id: "a", source: "draft", target: "review" },
    { id: "b", source: "review", target: "publish", markerEnd: "arrowclosed" },
  ],
};

export default function BasicFlow(theme: "light" | "dark" = "light") {
  return FlowDiagram({
    data,
    layout: {
      algorithm: layeredLayout,
      options: { direction: "LR", rankSpacing: 80 },
    },
    viewport: { fitView: { padding: 0.2, maxZoom: 1.25 } },
    config: { colorMode: theme,
      node: { fontSize: 14 }, minimap: { visible: false } },
  });
}
