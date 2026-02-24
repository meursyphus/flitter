import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (args: T, context: LineChartConfig) => Widget;

export type LineChartCustom = {
  xAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
  yAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
  xAxisLabel: ConfigArgs<{ name: string; index: number }>;
  yAxisLabel: ConfigArgs<{ name: string; index: number }>;
  xAxisTick: ConfigArgs;
  yAxisTick: ConfigArgs;
  series: ConfigArgs<{ lines: Widget[] }>;
  line: ConfigArgs<{ values: number[]; legend: string; index: number }>;
  layout: ConfigArgs<{ title: Widget; legends: Widget[]; plot: Widget }>;
  plot: ConfigArgs<{ xAxis: Widget; yAxis: Widget; series: Widget; grid: Widget }>;
  legend: ConfigArgs<{ name: string; index: number }>;
  title: ConfigArgs<{ name: string }>;
  dataLabel: ConfigArgs<{ value: number; label: string; legend: string }>;
  xAxisLine: ConfigArgs;
  yAxisLine: ConfigArgs;
	grid: ConfigArgs<{ xLine: Widget; yLine: Widget }>;
	gridXLine: ConfigArgs;
	gridYLine: ConfigArgs;
};

export type LineChartData = {
  labels: string[];
  datasets: { legend: string; values: number[] }[];
};

export type LineChartScale = {
  min: number;
  max: number;
  step: number;
};

export type LineChartConfig = {
  custom: LineChartCustom;
  data: LineChartData;
  scale: LineChartScale;
  title: string;
};
