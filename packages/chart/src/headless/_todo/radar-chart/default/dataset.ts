import type { RadarChartCustom } from "../types";
import { CustomPaint, Path } from "flitter-core";

const COLORS = [
  "rgba(54, 162, 235, 0.5)",
  "rgba(255, 99, 132, 0.5)",
  "rgba(75, 192, 192, 0.5)",
  "rgba(255, 206, 86, 0.5)",
  "rgba(153, 102, 255, 0.5)",
  "rgba(255, 159, 64, 0.5)",
];

const STROKE_COLORS = [
  "rgba(54, 162, 235, 1)",
  "rgba(255, 99, 132, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

export function Dataset(
  ...[_args, { data, scale }]: Parameters<RadarChartCustom["dataset"]>
) {
  const axisCount = data.labels.length;
  const datasets = data.datasets;

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          const els: Record<string, SVGElement> = {};
          for (let i = 0; i < datasets.length; i++) {
            els[`fill${i}`] = context.createSvgEl("path");
            els[`stroke${i}`] = context.createSvgEl("path");
          }
          return els;
        },
        paint: (els, { width, height }) => {
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = Math.min(cx, cy) * 0.8;

          for (let i = 0; i < datasets.length; i++) {
            const path = createDataPath(
              cx,
              cy,
              maxRadius,
              axisCount,
              datasets[i].values,
              scale.max
            );
            const d = path.getD();

            const fillEl = els[`fill${i}`];
            fillEl.setAttribute("d", d);
            fillEl.setAttribute("fill", COLORS[i % COLORS.length]);
            fillEl.setAttribute("stroke", "none");

            const strokeEl = els[`stroke${i}`];
            strokeEl.setAttribute("d", d);
            strokeEl.setAttribute("fill", "none");
            strokeEl.setAttribute(
              "stroke",
              STROKE_COLORS[i % STROKE_COLORS.length]
            );
            strokeEl.setAttribute("stroke-width", "2");
          }
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = Math.min(cx, cy) * 0.8;

          for (let i = 0; i < datasets.length; i++) {
            const path = createDataPath(
              cx,
              cy,
              maxRadius,
              axisCount,
              datasets[i].values,
              scale.max
            );
            const canvasPath = path.toCanvasPath();

            context.canvas.fillStyle = COLORS[i % COLORS.length];
            context.canvas.fill(canvasPath);

            context.canvas.strokeStyle =
              STROKE_COLORS[i % STROKE_COLORS.length];
            context.canvas.lineWidth = 2;
            context.canvas.stroke(canvasPath);
          }
        },
      },
    },
  });
}

function createDataPath(
  cx: number,
  cy: number,
  maxRadius: number,
  axisCount: number,
  values: number[],
  maxValue: number
): Path {
  const path = new Path();
  const angleStep = (2 * Math.PI) / axisCount;
  const startAngle = -Math.PI / 2;

  for (let i = 0; i <= axisCount; i++) {
    const idx = i % axisCount;
    const angle = startAngle + idx * angleStep;
    const ratio = Math.min(values[idx] / maxValue, 1);
    const radius = maxRadius * ratio;
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
