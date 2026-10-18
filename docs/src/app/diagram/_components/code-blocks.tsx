import { highlight } from "@/lib/highlight";
import CopyButton from "./copy-button";

/** The overview's quick start: install output plus one mounted diagram. */
export const OVERVIEW_CODE = `import Widget from "@flitterjs/react";
import { layeredLayout, type FlowEdge, type FlowNode } from "flitter-ui/diagram";
import FlowDiagram from "@/components/diagram/flow-diagram";

const nodes: FlowNode[] = [
  { id: "draft", type: "input", position: { x: 0, y: 0 }, data: { label: "Draft" } },
  { id: "review", position: { x: 0, y: 0 }, data: { label: "Review" } },
  { id: "publish", type: "output", position: { x: 0, y: 0 }, data: { label: "Publish" } },
];

const edges: FlowEdge[] = [
  { id: "a", source: "draft", target: "review" },
  { id: "b", source: "review", target: "publish" },
];

// Undo, copy/paste, context menu and box select are already on.
const diagram = FlowDiagram({
  data: { nodes, edges },
  layout: layeredLayout,
  viewport: { fitView: true },
});

export default function App() {
  return <Widget widget={diagram} width="100%" height="480px" />;
}`;

export async function HighlightedCode({ code, lang }: { code: string; lang: string }) {
  const html = await highlight(code, lang);
  return (
    <div className="code-surface relative overflow-x-auto rounded-lg text-[13px] leading-relaxed [&_pre]:px-5 [&_pre]:py-4">
      <CopyButton text={code} className="absolute right-2.5 top-2.5" />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
