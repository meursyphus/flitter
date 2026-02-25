import type {
  StackedAreaChartCustom,
  StackedAreaChartScale,
} from "../types";
import { CustomPaint, Path } from "flitter-core";

export function Area(
  ...[{ values, cumulativeValues, index }, { scale }]: Parameters<
    StackedAreaChartCustom["area"]
  >
) {
  // Bottom boundary: previous cumulative (current cumulative minus own values)
  const previousCumulative = cumulativeValues.map(
    (cum, i) => cum - values[i],
  );

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          return {
            area: context.createSvgEl("path"),
            line: context.createSvgEl("path"),
          };
        },
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
          area.setAttribute("fill", `rgba(0, 0, 0, ${0.1 + index * 0.1})`);
          area.setAttribute("d", areaPath.getD());
          line.setAttribute("fill", "none");
          line.setAttribute("stroke", "black");
          line.setAttribute("stroke-width", "1");
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
          context.canvas.fillStyle = `rgba(0, 0, 0, ${0.1 + index * 0.1})`;
          context.canvas.fill(areaPath.toCanvasPath());
          context.canvas.strokeStyle = "black";
          context.canvas.lineWidth = 1;
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
}: {
  values: number[];
  scale: StackedAreaChartScale;
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

  // Top boundary (left to right)
  const topPoints = topValues.map((value, index) => {
    const y = height - (height * value) / (scale.max - scale.min);
    const x = (index * width) / (count - 1);
    return { x, y };
  });

  // Bottom boundary (right to left)
  const bottomPoints = bottomValues
    .map((value, index) => {
      const y = height - (height * value) / (scale.max - scale.min);
      const x = (index * width) / (count - 1);
      return { x, y };
    })
    .reverse();

  path.moveTo(topPoints[0]);
  topPoints.slice(1).forEach((point) => {
    path.lineTo(point);
  });
  bottomPoints.forEach((point) => {
    path.lineTo(point);
  });
  path.close();

  return path;
}
