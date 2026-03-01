import type { RadarChartCustom } from "../types";
import { CustomPaint, Path } from "flitter-core";

export function Grid(
  ...[{ levels }, { data }]: Parameters<RadarChartCustom["grid"]>
) {
  const axisCount = data.labels.length;

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          const els: Record<string, SVGElement> = {};
          for (let i = 1; i <= levels; i++) {
            els[`level${i}`] = context.createSvgEl("path");
          }
          return els;
        },
        paint: (els, { width, height }) => {
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = Math.min(cx, cy) * 0.8;

          for (let level = 1; level <= levels; level++) {
            const radius = (maxRadius * level) / levels;
            const path = createPolygonPath(cx, cy, radius, axisCount);
            const el = els[`level${level}`];
            el.setAttribute("d", path.getD());
            el.setAttribute("fill", "none");
            el.setAttribute("stroke", "#e0e0e0");
            el.setAttribute("stroke-width", "1");
          }
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = Math.min(cx, cy) * 0.8;

          context.canvas.strokeStyle = "#e0e0e0";
          context.canvas.lineWidth = 1;

          for (let level = 1; level <= levels; level++) {
            const radius = (maxRadius * level) / levels;
            const path = createPolygonPath(cx, cy, radius, axisCount);
            context.canvas.stroke(path.toCanvasPath());
          }
        },
      },
    },
  });
}

function createPolygonPath(
  cx: number,
  cy: number,
  radius: number,
  sides: number
): Path {
  const path = new Path();
  const angleStep = (2 * Math.PI) / sides;
  const startAngle = -Math.PI / 2;

  for (let i = 0; i <= sides; i++) {
    const angle = startAngle + i * angleStep;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) {
      path.moveTo({ x, y });
    } else {
      path.lineTo({ x, y });
    }
  }

  return path;
}
