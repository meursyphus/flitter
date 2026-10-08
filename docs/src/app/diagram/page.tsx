import DiagramLanding from "./_components/diagram-landing";
import { CustomNodeCodeBlock, MinimalCodeBlock } from "./_components/code-blocks";

export const metadata = {
  title: "Diagram",
  description:
    "Node and edge editors with React Flow's interactions, drawn by Flitter on SVG or Canvas.",
};

export default function DiagramHome() {
  return (
    <DiagramLanding
      minimalCodeBlock={<MinimalCodeBlock />}
      customNodeCodeBlock={<CustomNodeCodeBlock />}
    />
  );
}
