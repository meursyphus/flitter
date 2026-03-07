# Cartesian Recipe

This is the shortest path for a runnable cartesian chart.

## Goal

Build a bar chart from:

- one headless primitive
- cartesian building blocks
- local structural helpers
- one chart-specific bar renderer

```ts
import { Headless, Cartesian } from "flitter-chart";
import {
  Axis,
  Container,
  EdgeInsets,
  Flex,
  Flexible,
  FractionallySizedBox,
  Padding,
} from "flitter-core";

function BarBox(...[{ bar, ratio, alignment }, { direction }]: Parameters<NonNullable<Parameters<typeof Headless.BarChart>[0]["custom"]>["barBox"]>) {
  const isVertical = direction === "vertical";
  return FractionallySizedBox({
    alignment,
    widthFactor: isVertical ? undefined : ratio,
    heightFactor: isVertical ? ratio : undefined,
    child: Padding({
      padding: EdgeInsets.symmetric(isVertical ? { horizontal: 2 } : { vertical: 2 }),
      child: bar,
    }),
  });
}

function DataView(...[{ barGroups }, { direction }]: Parameters<NonNullable<Parameters<typeof Headless.BarChart>[0]["custom"]>["dataView"]>) {
  return Container({
    width: Infinity,
    height: Infinity,
    child: Flex({
      direction: direction === "vertical" ? Axis.horizontal : Axis.vertical,
      children: barGroups.map((barGroup) => Flexible({ flex: 1, child: barGroup })),
    }),
  });
}

function Grid(...[{ xLine, yLine }, { direction, scale, data }]: Parameters<NonNullable<Parameters<typeof Headless.BarChart>[0]["custom"]>["grid"]>) {
  const valueCount = scale ? (scale.max - scale.min) / scale.step : 0;
  const labelCount = data.labels.length;
  return Cartesian.Grid({
    xLine,
    yLine,
    x: direction === "vertical" ? labelCount : valueCount,
    y: direction === "horizontal" ? labelCount : valueCount,
  });
}

const custom = {
  layout: ({ title, legends, plot }) => Cartesian.Layout({ title, legends, plot }),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  xAxis: ({ line, labels, tick }) => Cartesian.XAxis({ line, labels, tick }, { type: "label" }),
  yAxis: ({ line, labels, tick }) => Cartesian.YAxis({ line, labels, tick }, { type: "value" }),
  xAxisLabel: Cartesian.XAxisLabel,
  yAxisLabel: Cartesian.YAxisLabel,
  xAxisTick: Cartesian.XAxisTick,
  yAxisTick: Cartesian.YAxisTick,
  xAxisLine: Cartesian.XAxisLine,
  yAxisLine: Cartesian.YAxisLine,
  axisCorner: Cartesian.AxisCorner,
  gridXLine: Cartesian.GridXLine,
  gridYLine: Cartesian.GridYLine,
  grid: Grid,
  dataView: DataView,
  barGroup: ({ bars, index, label }) => bars[0].bar,
  barBox: BarBox,
  bar: ({ value }) => Container({ width: Infinity, height: Infinity, color: value >= 0 ? "#00a9ff" : "#ff5a46" }),
  legend: () => Container({ width: 0, height: 0 }),
  title: () => Container({ width: 0, height: 0 }),
  dataLabel: () => Container({ width: 0, height: 0 }),
};

Headless.BarChart({
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ legend: "Revenue", values: [12, 19, 16] }],
  },
  getScale: Cartesian.getScale,
  custom,
});
```
