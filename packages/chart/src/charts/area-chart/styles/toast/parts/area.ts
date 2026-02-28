import type { LineChartCustom, LineChartScale } from "@headless/line-chart/types";
import { CustomPaint, Path, SizedBox } from "flitter-core";
import { drawSplineLine } from "@shared/styles/toast";
import type { ToastAreaChartConfig } from "../config";

export function toastArea(
  ...[{ values, legend }, ctx]: Parameters<LineChartCustom<ToastAreaChartConfig>["line"]>
) {
  const { scale, config } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors, area: areaConfig } = config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => ({
          area: context.createSvgEl("path"),
          line: context.createSvgEl("path"),
        }),
        paint: ({ area, line }, { width, height }) => {
          const linePath = createLinePath({ values, scale, width, height, spline: areaConfig.spline });
          const areaPath = createAreaPath({ values, scale, width, height, spline: areaConfig.spline });

          area.setAttribute("fill", color);
          area.setAttribute("opacity", String(areaConfig.opacity));
          area.setAttribute("d", areaPath.getD());

          line.setAttribute("fill", "none");
          line.setAttribute("stroke", color);
          line.setAttribute("stroke-width", String(areaConfig.strokeWidth));
          line.setAttribute("stroke-linecap", "round");
          line.setAttribute("stroke-linejoin", "round");
          line.setAttribute("d", linePath.getD());
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const linePath = createLinePath({ values, scale, width, height, spline: areaConfig.spline });
          const areaPath = createAreaPath({ values, scale, width, height, spline: areaConfig.spline });

          context.canvas.globalAlpha = areaConfig.opacity;
          context.canvas.fillStyle = color;
          context.canvas.fill(areaPath.toCanvasPath());
          context.canvas.globalAlpha = 1;

          context.canvas.strokeStyle = color;
          context.canvas.lineWidth = areaConfig.strokeWidth;
          context.canvas.lineCap = "round";
          context.canvas.lineJoin = "round";
          context.canvas.stroke(linePath.toCanvasPath());
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

function createAreaPath({
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
  const range = scale.max - scale.min;
  const points = values.map((value, index) => {
    const y = height - (height * (value - scale.min)) / range;
    const x = values.length > 1 ? (index * width) / (values.length - 1) : width / 2;
    return { x, y };
  });
  if (points.length === 0) return path;

  // Top line (left to right)
  if (spline) {
    drawSplineLine(path, {
      width,
      height,
      minValue: scale.min,
      maxValue: scale.max,
      values,
    });
  } else {
    path.moveTo(points[0]);
    points.slice(1).forEach((point) => path.lineTo(point));
  }

  // Bottom line (right to left along baseline)
  const baseline = height - (height * (0 - scale.min)) / range;
  const clampedBaseline = Math.min(height, Math.max(0, baseline));
  path.lineTo({ x: points[points.length - 1].x, y: clampedBaseline });
  path.lineTo({ x: points[0].x, y: clampedBaseline });
  path.close();

  return path;
}
