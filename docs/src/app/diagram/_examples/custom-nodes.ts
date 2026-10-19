import {
  Border,
  BorderRadius,
  BoxDecoration,
  Container,
  EdgeInsets,
} from "flitterjs";
import type { FlowDiagramCustom } from "@flitterjs/diagram";
import FlowDiagram, {
  type DefaultFlowConfig,
} from "@/components/diagram/flow-diagram";

// The label is already built. Dragging, selection and hover are attached by the engine.
const cardNode: FlowDiagramCustom<DefaultFlowConfig>["node"] = (
  { label, isSelected, isHovered },
  { config },
) =>
  Container({
    width: 180,
    padding: EdgeInsets.symmetric({ horizontal: 20, vertical: 18 }),
    decoration: new BoxDecoration({
      color: config.colors.nodeBackground,
      borderRadius: BorderRadius.circular(16),
      border: Border.all({
        color: isSelected || isHovered ? "#8b5cf6" : config.colors.nodeBorder,
        width: 2,
      }),
    }),
    child: label,
  });

export default function CustomNodes(theme: "light" | "dark" = "light") {
  return FlowDiagram({
    data: {
      nodes: [
        {
          id: "a",
          type: "input",
          position: { x: 0, y: 0 },
          sourcePosition: "right",
          data: { label: "Design" },
        },
        {
          id: "b",
          type: "output",
          position: { x: 280, y: 100 },
          targetPosition: "left",
          data: { label: "Ship" },
        },
      ],
      edges: [{ id: "ab", source: "a", target: "b", markerEnd: "arrowclosed" }],
    },
    viewport: { fitView: { padding: 0.15, maxZoom: 1.2 } },
    config: { colorMode: theme,
      node: { fontSize: 14 }, minimap: { visible: false } },
    custom: { node: cardNode },
  });
}
