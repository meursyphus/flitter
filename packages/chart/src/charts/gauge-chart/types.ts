import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (args: T, context: GaugeChartConfig) => Widget;

export type GaugeChartCustom = {
  layout: ConfigArgs<{ title: Widget; gauge: Widget; valueLabel: Widget }>;
  title: ConfigArgs<{ name: string }>;
  gauge: ConfigArgs<{ needle: Widget; scale: Widget }>;
  needle: ConfigArgs<{ value: number; ratio: number }>;
  valueLabel: ConfigArgs<{ value: number; min: number; max: number }>;
  scale: ConfigArgs<{ min: number; max: number; zones: GaugeChartZone[] }>;
};

export type GaugeChartZone = {
  min: number;
  max: number;
  color: string;
};

export type GaugeChartData = {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  zones?: GaugeChartZone[];
};

export type GaugeChartConfig = {
  custom: GaugeChartCustom;
  data: GaugeChartData;
  title: string;
  value: number;
  min: number;
  max: number;
  zones: GaugeChartZone[];
};
