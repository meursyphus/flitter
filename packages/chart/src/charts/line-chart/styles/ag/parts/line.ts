import type { LineChartCustom, LineChartScale } from "@headless/line-chart/types";
import {
  CustomPaint,
  Path,
  SizedBox,
  type Widget,
} from "flitter-core";
import { drawSplineLine } from "@shared/styles/toast";
import type { AgLineChartConfig } from "../config";

export function agLine(
  ...[{ values, legend }, ctx]: Parameters<LineChartCustom<AgLineChartConfig>["line"]>
) {
  const { scale, config } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors, line: lineConfig } = config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors.fills[idx % colors.fills.length];

  return CustomPaint({
    key: legend,
    painter: {
      shouldRepaint: () => true,
      svg: {
        createDefaultSvgEl: (context) => ({
          line: context.createSvgEl("path"),
        }),
        paint: ({ line }, { width, height }) => {
          const path = createLinePath({ values, scale, width, height, spline: lineConfig.spline });
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
          const path = createLinePath({ values, scale, width, height, spline: lineConfig.spline });
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

export function computeDataPointPosition({
  index,
  value,
  numPoints,
  scale,
  width,
  height,
}: {
  index: number;
  value: number;
  numPoints: number;
  scale: LineChartScale;
  width: number;
  height: number;
}): { x: number; y: number } {
  const range = scale.max - scale.min;
  const x = numPoints > 1 ? (index * width) / (numPoints - 1) : width / 2;
  const y = height - (height * (value - scale.min)) / range;
  return { x, y };
}

function createLinePath({
  values,
  scale,
  width,
  height,
  spline,
}: {
  values: number[];
  scale: LineChartScale;
  width: number;
  height: number;
  spline: boolean;
}) {
  const path = new Path();

  if (spline) {
    drawSplineLine(path, {
      width,
      height,
      minValue: scale.min,
      maxValue: scale.max,
      values,
    });
    return path;
  }

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
