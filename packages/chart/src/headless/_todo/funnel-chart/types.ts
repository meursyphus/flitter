import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (args: T, context: FunnelChartConfig) => Widget;

export type FunnelChartCustom = {
  layout: ConfigArgs<{ title: Widget; legends: Widget[]; funnel: Widget }>;
  funnel: ConfigArgs<{ stages: Widget[] }>;
  stage: ConfigArgs<{
    index: number;
    label: string;
    value: number;
    ratio: number;
    color: string;
    stageLabel: Widget;
    dataLabel: Widget;
  }>;
  stageLabel: ConfigArgs<{ label: string; index: number }>;
  dataLabel: ConfigArgs<{
    value: number;
    percentage: number;
    label: string;
    index: number;
  }>;
  legend: ConfigArgs<{ label: string; color: string; index: number }>;
  title: ConfigArgs<{ name: string }>;
};

export type FunnelChartData = {
  stages: { label: string; value: number; color?: string }[];
  title?: string;
};

export type FunnelChartConfig = {
  custom: FunnelChartCustom;
  data: FunnelChartData;
  title: string;
};
