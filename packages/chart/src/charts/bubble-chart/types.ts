import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (args: T, context: BubbleChartConfig) => Widget;

export type BubbleChartData = {
  datasets: {
    legend: string;
    data: {
      x: number;
      y: number;
      value: number;
      label: string;
    }[];
  }[];
};

export type BubbleScale = {
  min: number;
  max: number;
  step: number;
}

export type BubbleChartScale = {
  x: BubbleScale;
  y: BubbleScale;
  value: BubbleScale;
};

export type BubbleChartCustom = {
  xAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
  yAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
  xAxisLabel: ConfigArgs<{ name: string; index: number }>;
  yAxisLabel: ConfigArgs<{ name: string; index: number }>;
  xAxisTick: ConfigArgs;
  yAxisTick: ConfigArgs;
  series: ConfigArgs<{ points: {x:number; y:number; value:number; label:string; legend:string; index:number}[]; scale: BubbleChartScale }>;
  bubble: ConfigArgs<{ value:number; label:string; legend:string; index:number }>;
  layout: ConfigArgs<{ title: Widget; legends: Widget[]; plot: Widget }>;
  plot: ConfigArgs<{ xAxis: Widget; yAxis: Widget; series: Widget; grid: Widget }>;
  legend: ConfigArgs<{ name: string; index: number }>;
  title: ConfigArgs<{ name: string }>;
  dataLabel: ConfigArgs<{ x:number; y:number; value: number; label: string; legend: string }>;
  xAxisLine: ConfigArgs;
  yAxisLine: ConfigArgs;
  grid: ConfigArgs<{ xLine: Widget; yLine: Widget }>;
  gridXLine: ConfigArgs;
  gridYLine: ConfigArgs;
};

export type BubbleChartConfig = {
  custom: BubbleChartCustom;
  data: BubbleChartData;
  scale: BubbleChartScale;
  title: string;
};
