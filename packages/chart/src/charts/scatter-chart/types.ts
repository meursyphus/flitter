import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (
  args: T,
  context: ScatterChartConfig,
) => Widget;

export type ScatterChartData = {
  datasets: {
    legend: string;
    data: {
      x: number;
      y: number;
      label: string;
    }[];
  }[];
};

export type ScatterScale = {
  min: number;
  max: number;
  step: number;
};

export type ScatterChartScale = {
  x: ScatterScale;
  y: ScatterScale;
};

export type ScatterChartCustom = {
  xAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
  yAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
  xAxisLabel: ConfigArgs<{ name: string; index: number }>;
  yAxisLabel: ConfigArgs<{ name: string; index: number }>;
  xAxisTick: ConfigArgs;
  yAxisTick: ConfigArgs;
  series: ConfigArgs<{
    points: {
      x: number;
      y: number;
      label: string;
      legend: string;
      index: number;
    }[];
    scale: ScatterChartScale;
  }>;
  scatter: ConfigArgs<{
    label: string;
    legend: string;
    index: number;
  }>;
  layout: ConfigArgs<{ title: Widget; legends: Widget[]; plot: Widget }>;
  plot: ConfigArgs<{
    xAxis: Widget;
    yAxis: Widget;
    series: Widget;
    grid: Widget;
  }>;
  legend: ConfigArgs<{ name: string; index: number }>;
  title: ConfigArgs<{ name: string }>;
  dataLabel: ConfigArgs<{
    x: number;
    y: number;
    value: number;
    label: string;
    legend: string;
  }>;
  xAxisLine: ConfigArgs;
  yAxisLine: ConfigArgs;
  grid: ConfigArgs<{ xLine: Widget; yLine: Widget }>;
  gridXLine: ConfigArgs;
  gridYLine: ConfigArgs;
};

export type ScatterChartConfig = {
  custom: ScatterChartCustom;
  data: ScatterChartData;
  scale: ScatterChartScale;
  title: string;
};
