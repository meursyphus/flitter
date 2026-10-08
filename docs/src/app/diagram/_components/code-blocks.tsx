import { highlight } from "@/lib/highlight";
import CopyButton from "./copy-button";

export const MINIMAL_CODE = `import Widget from "@flitterjs/react";
import type { FlowEdge, FlowNode } from "flitter-ui/diagram";
import { FlowDiagram } from "@/components/diagram/flow-diagram";

const nodes: FlowNode[] = [
  { id: "1", type: "input", position: { x: 0, y: 0 }, data: { label: "Input" } },
  { id: "2", position: { x: 0, y: 120 }, data: { label: "Default" } },
  { id: "3", type: "output", position: { x: 0, y: 240 }, data: { label: "Output" } },
];

const edges: FlowEdge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", markerEnd: "arrowclosed" },
];

// Create the widget once. A new instance remounts the editor.
const diagram = FlowDiagram({ nodes, edges, fitView: true });

export default function App() {
  return <Widget widget={diagram} width="100%" height="480px" renderer="canvas" />;
}`;

const CUSTOM_NODE_CODE = `FlowDiagram({
  nodes,
  edges,
  nodeTypes: {
    // Any Flitter widget, plus the handles it exposes
    task: {
      build: ({ node, selected }) =>
        Container({
          width: 180,
          padding: EdgeInsets.all(12),
          decoration: new BoxDecoration({
            color: selected ? "#fff7e6" : "#ffffff",
            border: Border.all({ color: "#f59e0b" }),
            borderRadius: BorderRadius.circular(8),
          }),
          child: Text(String(node.data.label)),
        }),
      handles: [
        { type: "target", position: "left" },
        { type: "source", position: "right" },
      ],
    },
  },
  layout: { algorithm: layeredLayout, options: { direction: "LR" } },
});`;

async function HighlightedCode({ code, lang }: { code: string; lang: string }) {
  const html = await highlight(code, lang);
  return (
    <div className="code-surface relative overflow-hidden rounded-lg text-[13px] leading-relaxed [&_pre]:px-5 [&_pre]:py-4">
      <CopyButton text={code} className="absolute right-2.5 top-2.5" />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export function MinimalCodeBlock() {
  return <HighlightedCode code={MINIMAL_CODE} lang="tsx" />;
}

export function CustomNodeCodeBlock() {
  return <HighlightedCode code={CUSTOM_NODE_CODE} lang="typescript" />;
}
