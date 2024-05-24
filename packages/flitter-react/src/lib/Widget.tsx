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
  renderer?: "canvas" | "svg";
};

function WidgetComponent({
  width = "100%",
  height = "300px",
  renderer = "svg",
  widget = Container({
    width: Infinity,
    height: Infinity,
    alignment: Alignment.center,
    child: Text("Hello World"),
  }),
}: WidgetComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<SVGSVGElement | HTMLCanvasElement | null>(null);

  useEffect(() => {
    const runner = new AppRunner({
      view: ref.current!,
      window: window,
      document: document,
    });
    runner.runApp(widget);
    runner.onMount({
      resizeTarget: containerRef.current!,
    });

    return () => {
      runner.dispose();
    };
  }, [widget, renderer]);

  return (
    <div style={{ width, height }} ref={containerRef}>
      {renderer === "canvas" ? (
        <canvas
          style={{ width: "100%", height: "100%" }}
          ref={ref as React.RefObject<HTMLCanvasElement>}
        />
      ) : (
        <svg
          style={{ width: "100%", height: "100%" }}
          ref={ref as React.RefObject<SVGSVGElement>}
        />
      )}
    </div>
  );
}

export default WidgetComponent;
