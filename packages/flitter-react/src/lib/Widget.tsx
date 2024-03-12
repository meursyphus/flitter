import { useEffect, useRef } from "react";
import {
  type Widget,
  Alignment,
  AppRunner,
  Container,
  Text,
} from "@meursyphus/flitter";

type WidgetComponentProps = {
  widget?: Widget;
  width?: string;
  height?: string;
};

function WidgetComponent({
  width = "100%",
  height = "300px",
  widget = Container({
    width: Infinity,
    height: Infinity,
    alignment: Alignment.center,
    child: Text("Hello World"),
  }),
}: WidgetComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const runner = new AppRunner({
      view: svgRef.current!,
      window: window,
      document: document,
    });
    runner.runApp(widget);
    runner.onMount({
      resizeTarget: containerRef.current!,
    });
  }, []);

  return (
    <div style={{ width, height }} ref={containerRef}>
      <svg ref={svgRef} />
    </div>
  );
}

export default WidgetComponent;
