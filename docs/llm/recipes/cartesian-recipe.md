# Cartesian Recipe

This is the shortest path for a runnable cartesian chart.

## Goal

Build a bar chart from:

- one headless primitive
- cartesian building blocks
- one chart-specific bar renderer

```ts
import { Headless, Cartesian, BarLike } from "flitter-chart";
import { Container } from "flitter-core";

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
  grid: BarLike.Grid,
  dataView: BarLike.DataView,
  barGroup: ({ bars, index, label }) => bars[0].bar,
  barBox: BarLike.BarBox,
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
