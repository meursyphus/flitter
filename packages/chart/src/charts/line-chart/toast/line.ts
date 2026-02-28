import type { LineChartCustom, LineChartScale } from "@headless/line-chart/types";
import { CustomPaint, Path, SizedBox } from "flitter-core";
import type { ToastLineChartConfig } from "./config";

export function toastLine(
  ...[{ values, legend }, ctx]: Parameters<LineChartCustom<ToastLineChartConfig>["line"]>
) {
  const { scale, config } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors, line: lineConfig } = config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => ({
          line: context.createSvgEl("path"),
        }),
        paint: ({ line }, { width, height }) => {
          const path = createLinePath({ values, scale, width, height });
          line.setAttribute("fill", "none");
          line.setAttribute("stroke", color);
          line.setAttribute("stroke-width", String(lineConfig.strokeWidth));
          line.setAttribute("stroke-linecap", "round");
          line.setAttribute("stroke-linejoin", "round");
          line.setAttribute("d", path.getD());
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const path = createLinePath({ values, scale, width, height });
          context.canvas.strokeStyle = color;
          context.canvas.lineWidth = lineConfig.strokeWidth;
          context.canvas.lineCap = "round";
          context.canvas.lineJoin = "round";
          context.canvas.stroke(path.toCanvasPath());
        },
      },
    },
  });
}

function createLinePath({
  values,
  scale,
  width,
  height,
}: {
  values: number[];
  scale: LineChartScale;
  width: number;
  height: number;
}) {
  const path = new Path();
  const range = scale.max - scale.min;
  const points = values.map((value, index) => {
    const y = height - (height * (value - scale.min)) / range;
    const x = values.length > 1 ? (index * width) / (values.length - 1) : width / 2;
    return { x, y };
  });
  if (points.length === 0) return path;
  path.moveTo(points[0]);
  points.slice(1).forEach((point) => path.lineTo(point));
  return path;
}
