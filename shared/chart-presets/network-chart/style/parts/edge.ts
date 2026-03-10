import {
  CustomPaint,
  Positioned,
  type Widget,
} from "flitter-core";
import type { NetworkChartCustom } from "flitter-ui/chart";
import type { NetworkChartConfig } from "../config";

export function agEdge(
  { x1, y1, x2, y2, weight }: Parameters<NetworkChartCustom<NetworkChartConfig>["edge"]>[0],
  ctx: Parameters<NetworkChartCustom<NetworkChartConfig>["edge"]>[1],
): Widget {
  return Positioned.fill({
    child: CustomPaint({
      painter: {
        svg: {
          createDefaultSvgEl: (context) => ({
            line: context.createSvgEl("line"),
          }),
          paint: ({ line }, size) => {
            line.setAttribute("x1", `${x1 * size.width}`);
            line.setAttribute("y1", `${y1 * size.height}`);
            line.setAttribute("x2", `${x2 * size.width}`);
            line.setAttribute("y2", `${y2 * size.height}`);
            line.setAttribute("stroke", ctx.config.network.edgeColor);
            line.setAttribute("stroke-width", `${ctx.config.network.edgeWidth + ((weight ?? 1) - 1) * 0.35}`);
            line.setAttribute("stroke-opacity", "0.9");
          },
        },
        canvas: {
          paint: (context, size) => {
            const canvas = context.canvas;
            canvas.strokeStyle = ctx.config.network.edgeColor;
            canvas.lineWidth = ctx.config.network.edgeWidth + ((weight ?? 1) - 1) * 0.35;
            canvas.globalAlpha = 0.9;
            canvas.beginPath();
            canvas.moveTo(x1 * size.width, y1 * size.height);
            canvas.lineTo(x2 * size.width, y2 * size.height);
            canvas.stroke();
            canvas.globalAlpha = 1;
          },
        },
      },
    }),
  });
}
