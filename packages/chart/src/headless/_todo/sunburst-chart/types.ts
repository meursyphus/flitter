import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (args: T, context: SunburstConfig) => Widget;

export type SunburstNode = {
  label: string;
  value?: number;
  color?: string;
  children?: SunburstNode[];
};

export type SunburstChartData = {
  root: SunburstNode;
  title?: string;
};

export type FlatSegment = {
  node: SunburstNode;
  depth: number;
  startAngle: number;
  endAngle: number;
  color: string;
};

export type SunburstCustom = {
  layout: ConfigArgs<{ title: Widget; sunburst: Widget; legend: Widget }>;
  title: ConfigArgs<{ name: string }>;
  legend: ConfigArgs<{ items: Widget[] }>;
  legendItem: ConfigArgs<{ label: string; color: string }>;
  sunburst: ConfigArgs<{ segments: FlatSegment[] }>;
  segment: ConfigArgs<{ segment: FlatSegment }>;
};

export type SunburstConfig = {
  custom: SunburstCustom;
  data: SunburstChartData;
  title: string;
  segments: FlatSegment[];
};
