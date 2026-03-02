import type { LineChartCustom, LineChartScale } from "@headless/line-chart/types";
import {
  CustomPaint,
  Opacity,
  Path,
  SizedBox,
  type Widget,
} from "flitter-core";
import { drawSplineLine } from "@shared/styles/toast";
import type { AgStackedAreaChartConfig } from "../config";

export function agArea(
  ...[{ values, legend, index }, ctx]: Parameters<LineChartCustom<AgStackedAreaChartConfig>["line"]>
) {
  const { scale, config, data } = ctx;
  if (scale == null) return SizedBox.shrink();

  // Compute cumulative values for stacking
  const datasets = data.datasets;
  const numPoints = values.length;
  const cumulativeValues: number[] = new Array(numPoints).fill(0);
  const previousCumulative: number[] = new Array(numPoints).fill(0);
  for (let d = 0; d <= index; d++) {
    for (let p = 0; p < numPoints; p++) {
      if (d < index) previousCumulative[p] += datasets[d].values[p];
      cumulativeValues[p] += datasets[d].values[p];
    }
  }

  const { colors, area: areaConfig } = config;
  const idx = ctx.legends.indexOf(legend);
  const fillColor = colors.fills[idx % colors.fills.length];
  const strokeColor = colors.strokes[idx % colors.strokes.length];

  // Hover opacity
  const { hoveredPoint } = ctx;
  let opacity = 1;
  if (hoveredPoint != null) {
    opacity = hoveredPoint.legend === legend ? 1 : 0.3;
  }

  const paint = CustomPaint({
    key: legend,
    painter: {
      shouldRepaint: () => true,
      svg: {
        createDefaultSvgEl: (context) => ({
          area: context.createSvgEl("path"),
          line: context.createSvgEl("path"),
        }),
        paint: ({ area, line }, { width, height }) => {
          const areaPath = createStackedAreaPath({
            topValues: cumulativeValues,
            bottomValues: previousCumulative,
            scale,
            width,
            height,
            spline: areaConfig.spline,
          });
          const linePath = createLinePath({
            values: cumulativeValues,
            scale,
            width,
            height,
            spline: areaConfig.spline,
          });

          area.setAttribute("fill", fillColor);
          area.setAttribute("opacity", String(areaConfig.opacity));
          area.setAttribute("d", areaPath.getD());

          line.setAttribute("fill", "none");
          line.setAttribute("stroke", strokeColor);
          line.setAttribute("stroke-width", String(areaConfig.strokeWidth));
          line.setAttribute("stroke-linecap", "round");
          line.setAttribute("stroke-linejoin", "round");
          line.setAttribute("d", linePath.getD());
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const areaPath = createStackedAreaPath({
            topValues: cumulativeValues,
            bottomValues: previousCumulative,
            scale,
            width,
            height,
            spline: areaConfig.spline,
          });
          const linePath = createLinePath({
            values: cumulativeValues,
            scale,
            width,
            height,
            spline: areaConfig.spline,
          });

          context.canvas.globalAlpha = areaConfig.opacity;
          context.canvas.fillStyle = fillColor;
          context.canvas.fill(areaPath.toCanvasPath());
          context.canvas.globalAlpha = 1;

          context.canvas.strokeStyle = strokeColor;
          context.canvas.lineWidth = areaConfig.strokeWidth;
          context.canvas.lineCap = "round";
          context.canvas.lineJoin = "round";
          context.canvas.stroke(linePath.toCanvasPath());
        },
      },
    },
  });

  return opacity < 1 ? Opacity({ opacity, child: paint }) : paint;
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
  const points = values.map((value, index) => ({
    x: values.length > 1 ? (index * width) / (values.length - 1) : width / 2,
    y: height - (height * (value - scale.min)) / range,
  }));
  if (points.length === 0) return path;
  path.moveTo(points[0]);
  points.slice(1).forEach((point) => path.lineTo(point));
  return path;
}

function createStackedAreaPath({
  topValues,
  bottomValues,
  scale,
  width,
  height,
  spline,
}: {
  topValues: number[];
  bottomValues: number[];
  scale: LineChartScale;
  width: number;
  height: number;
  spline: boolean;
}) {
  const path = new Path();
  const count = topValues.length;
  const range = scale.max - scale.min;

  if (count === 0) return path;

  if (spline) {
    // Draw top line with spline
    drawSplineLine(path, {
      width,
      height,
      minValue: scale.min,
      maxValue: scale.max,
      values: topValues,
    });

    // Connect top end to bottom end, then trace bottom reversed
    const bottomPoints = bottomValues
      .map((value, index) => ({
        x: count > 1 ? (index * width) / (count - 1) : width / 2,
        y: height - (height * (value - scale.min)) / range,
      }))
      .reverse();

    bottomPoints.forEach((point) => path.lineTo(point));
    path.close();
    return path;
  }

  const topPoints = topValues.map((value, index) => ({
    x: count > 1 ? (index * width) / (count - 1) : width / 2,
    y: height - (height * (value - scale.min)) / range,
  }));

  const bottomPoints = bottomValues
    .map((value, index) => ({
      x: count > 1 ? (index * width) / (count - 1) : width / 2,
      y: height - (height * (value - scale.min)) / range,
    }))
    .reverse();

  path.moveTo(topPoints[0]);
  topPoints.slice(1).forEach((point) => path.lineTo(point));
  bottomPoints.forEach((point) => path.lineTo(point));
  path.close();

  return path;
}
