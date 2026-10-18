import type { Widget } from "flitter-ui";
import { layeredLayout, type FlowEdge, type FlowNode, type HandleSpec } from "flitter-ui/diagram";
import FlowDiagram from "@/components/diagram/flow-diagram";
import type { Theme } from "@/lib/theme";

/** Left-to-right handles, matching the LR layout. */
const lr: HandleSpec[] = [
  { type: "target", position: "left" },
  { type: "source", position: "right" },
];

/** Small editable flow for the landing card: drag, connect, undo all work. */
const nodes: FlowNode[] = [
  { id: "signup", position: { x: 0, y: 0 }, handles: [lr[1]], data: { label: "New signup" } },
  { id: "enrich", position: { x: 0, y: 0 }, handles: lr, data: { label: "Enrich company" } },
  { id: "slack", position: { x: 0, y: 0 }, handles: lr, data: { label: "Notify sales" } },
  { id: "nurture", position: { x: 0, y: 0 }, handles: [lr[0]], data: { label: "Add to nurture" } },
];
const edges: FlowEdge[] = [
  { id: "a", source: "signup", target: "enrich", markerEnd: "arrowclosed" },
  { id: "b", source: "enrich", target: "slack", markerEnd: "arrowclosed", animated: true },
  { id: "c", source: "enrich", target: "nurture", markerEnd: "arrowclosed" },
];

export function createLandingDiagram(theme: Theme): Widget {
  return FlowDiagram({
    data: { nodes, edges },
    layout: { algorithm: layeredLayout, options: { direction: "LR", rankSpacing: 56, nodeSpacing: 40 } },
    viewport: { fitView: { padding: 0.12 } },
    config: {
      colorMode: theme,
      colors: { background: theme === "dark" ? "#14171c" : "#ffffff" },
      controls: { visible: false },
      minimap: { visible: false },
    },
  });
}
