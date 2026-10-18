import DiagramLanding from "./_components/diagram-landing";
import { MinimalCodeBlock } from "./_components/code-blocks";

export const metadata = {
  title: "Diagram",
  description:
    "A headless diagram engine with editable source, custom widget builders and live examples on SVG and Canvas.",
};

export default function DiagramHome() {
  return (
    <DiagramLanding
      minimalCodeBlock={<MinimalCodeBlock />}
    />
  );
}
