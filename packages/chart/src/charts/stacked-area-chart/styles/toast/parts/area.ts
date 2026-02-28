import type {
  StackedAreaChartCustom,
  StackedAreaChartScale,
} from "@headless/stacked-area-chart/types";
import { CustomPaint, Path } from "flitter-core";
import type { ToastStackedAreaChartConfig } from "../config";

export function createToastArea(vc: ToastStackedAreaChartConfig) {
  return function toastArea(
    ...[{ values, cumulativeValues, legend }, ctx]: Parameters<
      StackedAreaChartCustom["area"]
    >
  ) {
    const { scale, data } = ctx;
    const { colors, area: areaConfig } = vc;
    const legendIndex = data.datasets.findIndex((d) => d.legend === legend);
    const color = colors[legendIndex % colors.length];

    const previousCumulative = cumulativeValues.map(
      (cum, i) => cum - values[i],
    );

    return CustomPaint({
      painter: {
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
            });
            const linePath = createLinePath({
              values: cumulativeValues,
              scale,
              width,
              height,
            });
            area.setAttribute("fill", color);
            area.setAttribute("opacity", String(areaConfig.opacity));
            area.setAttribute("d", areaPath.getD());
            line.setAttribute("fill", "none");
            line.setAttribute("stroke", color);
            line.setAttribute("stroke-width", String(areaConfig.strokeWidth));
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
            });
            const linePath = createLinePath({
              values: cumulativeValues,
              scale,
              width,
              height,
            });
            context.canvas.globalAlpha = areaConfig.opacity;
            context.canvas.fillStyle = color;
            context.canvas.fill(areaPath.toCanvasPath());
            context.canvas.globalAlpha = 1;
            context.canvas.strokeStyle = color;
            context.canvas.lineWidth = areaConfig.strokeWidth;
            context.canvas.stroke(linePath.toCanvasPath());
          },
        },
      },
    });
  };
}

function createLinePath({
  values,
  scale,
  width,
  height,
}: {
  values: number[];
  scale: StackedAreaChartScale;
  width: number;
  height: number;
}) {
  const path = new Path();
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
}: {
  topValues: number[];
  bottomValues: number[];
  scale: StackedAreaChartScale;
  width: number;
  height: number;
}) {
  const path = new Path();
  const count = topValues.length;
  const range = scale.max - scale.min;

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

  if (topPoints.length === 0) return path;
  path.moveTo(topPoints[0]);
  topPoints.slice(1).forEach((point) => path.lineTo(point));
  bottomPoints.forEach((point) => path.lineTo(point));
  path.close();

  return path;
}
