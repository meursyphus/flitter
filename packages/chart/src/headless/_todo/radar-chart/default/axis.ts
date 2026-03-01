import type { RadarChartCustom } from "../types";
import { CustomPaint, Path } from "flitter-core";

export function Axis(
  ...[_args, { data }]: Parameters<RadarChartCustom["axis"]>
) {
  const axisCount = data.labels.length;

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          const els: Record<string, SVGElement> = {};
          for (let i = 0; i < axisCount; i++) {
            els[`axis${i}`] = context.createSvgEl("path");
          }
          return els;
        },
        paint: (els, { width, height }) => {
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = Math.min(cx, cy) * 0.8;
          const angleStep = (2 * Math.PI) / axisCount;
          const startAngle = -Math.PI / 2;

          for (let i = 0; i < axisCount; i++) {
            const angle = startAngle + i * angleStep;
            const path = new Path();
            path.moveTo({ x: cx, y: cy });
            path.lineTo({
              x: cx + maxRadius * Math.cos(angle),
              y: cy + maxRadius * Math.sin(angle),
            });
            const el = els[`axis${i}`];
            el.setAttribute("d", path.getD());
            el.setAttribute("fill", "none");
            el.setAttribute("stroke", "#ccc");
            el.setAttribute("stroke-width", "1");
          }
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = Math.min(cx, cy) * 0.8;
          const angleStep = (2 * Math.PI) / axisCount;
          const startAngle = -Math.PI / 2;

          context.canvas.strokeStyle = "#ccc";
          context.canvas.lineWidth = 1;

          for (let i = 0; i < axisCount; i++) {
            const angle = startAngle + i * angleStep;
            const path = new Path();
            path.moveTo({ x: cx, y: cy });
            path.lineTo({
              x: cx + maxRadius * Math.cos(angle),
              y: cy + maxRadius * Math.sin(angle),
            });
            context.canvas.stroke(path.toCanvasPath());
          }
        },
      },
    },
  });
}
