import {
  CustomPaint,
  Path,
  SizedBox,
  type Widget,
} from "flitter-ui";
import type { WaterfallChartContext } from "flitter-ui/chart";
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

export function agConnector(
  { from, index }: { from: { end: number }; to: { start: number }; index: number },
  ctx: WaterfallChartContext<WaterfallChartConfig>,
): Widget {
  const scale = ctx.scale;
  if (scale == null || !ctx.config.waterfall.line.enabled) return SizedBox.shrink();

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => ({
          connector: context.createSvgEl("path"),
        }),
        paint: ({ connector }, { width, height }) => {
          const segmentWidth = width / Math.max(ctx.items.length, 1);
          const x = segmentWidth * (index + 1);
          const halfSpan = Math.min(
            segmentWidth * 0.18,
            Math.max(ctx.config.waterfall.barGap * 2.5, 12),
          );
          const y = valueToY(from.end, scale.min, scale.max, height);
          const path = createConnectorPath({ x, y, halfSpan });

          connector.setAttribute("d", path.getD());
          connector.setAttribute("fill", "none");
          connector.setAttribute("stroke", ctx.config.waterfall.line.color);
          connector.setAttribute("stroke-width", `${ctx.config.waterfall.line.width}`);
          connector.setAttribute("stroke-dasharray", ctx.config.waterfall.line.dash.join(" "));
          connector.setAttribute("stroke-linecap", "round");
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const segmentWidth = width / Math.max(ctx.items.length, 1);
          const x = segmentWidth * (index + 1);
          const halfSpan = Math.min(
            segmentWidth * 0.18,
            Math.max(ctx.config.waterfall.barGap * 2.5, 12),
          );
          const y = valueToY(from.end, scale.min, scale.max, height);
          const path = createConnectorPath({ x, y, halfSpan });
          const canvas = context.canvas;

          canvas.strokeStyle = ctx.config.waterfall.line.color;
          canvas.lineWidth = ctx.config.waterfall.line.width;
          canvas.setLineDash(ctx.config.waterfall.line.dash);
          canvas.lineCap = "round";
          canvas.stroke(path.toCanvasPath());
          canvas.setLineDash([]);
        },
      },
    },
  });
}
