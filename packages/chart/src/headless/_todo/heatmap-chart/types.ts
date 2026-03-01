import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (args: T, context: HeatmapConfig) => Widget;

export type HeatmapCustom = {
  layout: ConfigArgs<{ title: Widget; plot: Widget }>;
  plot: ConfigArgs<{ xAxis: Widget; yAxis: Widget; heatmap: Widget; axisCorner: Widget }>;

  xAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
  yAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
  xAxisLabel: ConfigArgs<{ name: string; index: number }>;
  yAxisLabel: ConfigArgs<{ name: string; index: number }>;
  xAxisLine: ConfigArgs;
  yAxisLine: ConfigArgs;
  axisCorner: ConfigArgs;
  xAxisTick: ConfigArgs;
  yAxisTick: ConfigArgs;

  heatmap: ConfigArgs<{ segments: Widget[][] }>;
  segment: ConfigArgs<{ value: number; xIndex: number; yIndex: number }>;

  title: ConfigArgs<{ name: string }>;
};

export type HeatmapData = {
  xLabels: string[];
  yLabels: string[];
  // segments are 2-dimensional array [yIndex][xIndex]
  values: number[][];
};

export type HeatmapScale = {
  min: number;
  max: number;
};

export type HeatmapConfig = {
  custom: HeatmapCustom;
  data: HeatmapData;
  scale: HeatmapScale;
  title: string;
};

