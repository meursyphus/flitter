"use client";

import type { Widget } from "flitter-ui";
import { layeredLayout, type FlowEdge, type FlowNode } from "flitter-ui/diagram";
import FlowDiagram from "@/components/diagram/flow-diagram";
import LiveDiagram from "@/components/live-diagram";
import type { Theme } from "@/lib/theme";

// Mirrors the Quick Start code block.
const nodes: FlowNode[] = [
  { id: "draft", type: "input", position: { x: 0, y: 0 }, data: { label: "Draft" } },
  { id: "review", position: { x: 0, y: 0 }, data: { label: "Review" } },
  { id: "publish", type: "output", position: { x: 0, y: 0 }, data: { label: "Publish" } },
];
const edges: FlowEdge[] = [
  { id: "a", source: "draft", target: "review" },
  { id: "b", source: "review", target: "publish", markerEnd: "arrowclosed" },
];

function create(theme: Theme): Widget {
  return FlowDiagram({
    data: { nodes, edges },

    layout: { algorithm: layeredLayout, options: { direction: "TB", rankSpacing: 80 } },
    viewport: { fitView: { padding: 0.3 } },
    interaction: { drag: { snap: { grid: [20, 20] } } },
    config: {
      colorMode: theme,
      colors: { background: theme === "dark" ? "#14171c" : "#ffffff" },
      minimap: { visible: false },
    },
  });
}

export default function QuickStartDemo() {
  return (
    <div className="not-prose my-6 h-[360px] overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)]">
      <LiveDiagram create={create} lazy />
    </div>
  );
}
