import type { RadarChartCustom } from "../types";
import { CustomPaint } from "flitter-core";

export function AxisLabel(
  ...[_args, { data }]: Parameters<RadarChartCustom["axisLabel"]>
) {
  const labels = data.labels;
  const axisCount = labels.length;

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          const els: Record<string, SVGElement> = {};
          for (let i = 0; i < axisCount; i++) {
            els[`label${i}`] = context.createSvgEl("text");
          }
          return els;
        },
        paint: (els, { width, height }) => {
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = Math.min(cx, cy) * 0.8;
          const labelRadius = maxRadius + 15;
          const angleStep = (2 * Math.PI) / axisCount;
          const startAngle = -Math.PI / 2;

          for (let i = 0; i < axisCount; i++) {
            const angle = startAngle + i * angleStep;
            const x = cx + labelRadius * Math.cos(angle);
            const y = cy + labelRadius * Math.sin(angle);

            const el = els[`label${i}`];
            el.setAttribute("x", x.toString());
            el.setAttribute("y", y.toString());
            el.setAttribute("font-size", "11");
            el.setAttribute("fill", "#666");
            el.setAttribute("dominant-baseline", "middle");

            const cos = Math.cos(angle);
            if (Math.abs(cos) < 0.01) {
              el.setAttribute("text-anchor", "middle");
            } else if (cos > 0) {
              el.setAttribute("text-anchor", "start");
            } else {
              el.setAttribute("text-anchor", "end");
            }

            el.textContent = labels[i];
          }
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = Math.min(cx, cy) * 0.8;
          const labelRadius = maxRadius + 15;
          const angleStep = (2 * Math.PI) / axisCount;
          const startAngle = -Math.PI / 2;

          context.canvas.font = "11px sans-serif";
          context.canvas.fillStyle = "#666";

          for (let i = 0; i < axisCount; i++) {
            const angle = startAngle + i * angleStep;
            const x = cx + labelRadius * Math.cos(angle);
            const y = cy + labelRadius * Math.sin(angle);

            const cos = Math.cos(angle);
            if (Math.abs(cos) < 0.01) {
              context.canvas.textAlign = "center";
            } else if (cos > 0) {
              context.canvas.textAlign = "left";
            } else {
              context.canvas.textAlign = "right";
            }
            context.canvas.textBaseline = "middle";
            context.canvas.fillText(labels[i], x, y);
          }
        },
      },
    },
  });
}
