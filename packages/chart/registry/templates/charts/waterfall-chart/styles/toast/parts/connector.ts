import {
  CustomPaint,
  Path,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { WaterfallChartContext } from "@headless/waterfall-chart/types";
import type { WaterfallChartConfig } from "../config";

function valueToY(value: number, min: number, max: number, height: number): number {
  const ratio = max === min ? 0 : (value - min) / (max - min);
  return height - ratio * height;
}

function createConnectorPath({
  x,
  y,
  halfSpan,
}: {
  x: number;
  y: number;
  halfSpan: number;
}): Path {
  const path = new Path();
  path.moveTo({ x: x - halfSpan, y });
  path.lineTo({ x: x + halfSpan, y });
  return path;
}

export function toastConnector(
  { fromCumulative, index }: { fromCumulative: number; toCumulative: number; index: number },
  ctx: WaterfallChartContext<WaterfallChartConfig>,
): Widget {
  const scale = ctx.scale;
  const nextType = ctx.types[index + 1];
  if (scale == null || nextType === "total") return SizedBox.shrink();

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => ({
          connector: context.createSvgEl("path"),
        }),
        paint: ({ connector }, { width, height }) => {
          const segmentWidth = width / Math.max(ctx.data.values.length, 1);
          const x = segmentWidth * (index + 1);
          const halfSpan = Math.min(
            segmentWidth * 0.18,
            Math.max(ctx.config.waterfall.barGap * 2.5, 14),
          );
          const y = valueToY(fromCumulative, scale.min, scale.max, height);
          const path = createConnectorPath({ x, y, halfSpan });

          connector.setAttribute("d", path.getD());
          connector.setAttribute("fill", "none");
          connector.setAttribute("stroke", "rgba(0,0,0,0.18)");
          connector.setAttribute("stroke-width", "1.5");
          connector.setAttribute("stroke-linecap", "round");
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const segmentWidth = width / Math.max(ctx.data.values.length, 1);
          const x = segmentWidth * (index + 1);
          const halfSpan = Math.min(
            segmentWidth * 0.18,
            Math.max(ctx.config.waterfall.barGap * 2.5, 14),
          );
          const y = valueToY(fromCumulative, scale.min, scale.max, height);
          const path = createConnectorPath({ x, y, halfSpan });
          const canvas = context.canvas;

          canvas.strokeStyle = "rgba(0,0,0,0.18)";
          canvas.lineWidth = 1.5;
          canvas.lineCap = "round";
          canvas.stroke(path.toCanvasPath());
        },
      },
    },
  });
}
