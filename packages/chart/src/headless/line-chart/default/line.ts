import type { LineChartCustom, LineChartScale } from "../types";
import { CustomPaint, Path, SizedBox } from "flitter-core";

export function Line(
  ...[{ values }, ctx]: Parameters<LineChartCustom["line"]>
) {
  const { scale } = ctx;
  if (scale == null) return SizedBox.shrink();

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          return {
            line: context.createSvgEl("path"),
          };
        },
        paint: ({ line }, { width, height }) => {
          const path = createLinePath({ values, scale, width, height });
          line.setAttribute("fill", "none");
          line.setAttribute("stroke", "black");
          line.setAttribute("stroke-width", "1");
          line.setAttribute("d", path.getD());
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const path = createLinePath({ values, scale, width, height });
          context.canvas.strokeStyle = "black";
          context.canvas.lineWidth = 1;
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
  const points = values.map((value, index) => {
    const y = height - (height * value) / (scale.max - scale.min);
    const x = (index * width) / (values.length - 1);
    return { x, y };
  });
  path.moveTo(points[0]);
  points.slice(1).forEach((point) => {
    path.lineTo(point);
  });
  return path;
}
