import {
  CustomPaint,
  Offset,
  Path,
  type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { AgRadarChartConfig } from "../config";

export function agRadialAxisLine(
  ...[_args, ctx]: Parameters<RadarChartCustom<AgRadarChartConfig>["radialLine"]>
): Widget {
  const { radar: radarConfig } = ctx.config;

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => ({
          gridLines: context.createSvgEl("path"),
        }),
        paint: ({ gridLines }, size) => {
          const cx = size.width / 2;
          const cy = size.height / 2;
          const gridPath = createSpokePath(cx, cy);
          gridLines.setAttribute("d", gridPath.getD());
          gridLines.setAttribute("fill", "none");
          gridLines.setAttribute("stroke", radarConfig.axisColor);
          gridLines.setAttribute("stroke-width", String(radarConfig.axisWidth));
        },
      },
      canvas: {
        paint: (context, size) => {
          const cx = size.width / 2;
          const cy = size.height / 2;
          const gridPath = createSpokePath(cx, cy);
          context.canvas.strokeStyle = radarConfig.axisColor;
          context.canvas.lineWidth = radarConfig.axisWidth;
          context.canvas.stroke(gridPath.toCanvasPath());
        },
      },
    },
  });
}

function createSpokePath(
  cx: number,
  cy: number,
): Path {
  const path = new Path();
  path.moveTo(new Offset({ x: cx, y: cy }));
  path.lineTo(new Offset({ x: cx, y: 0 }));
  return path;
}
