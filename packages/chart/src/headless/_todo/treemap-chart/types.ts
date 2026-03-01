import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (args: T, context: TreemapConfig) => Widget;

export type TreemapCustom = {
  layout: ConfigArgs<{ title: Widget; legend: Widget; treemap: Widget }>;
  title: ConfigArgs<{ name: string }>;
  legend: ConfigArgs<{ items: Widget[] }>;
  legendItem: ConfigArgs<{ label: string; color: string; index: number }>;
  treemap: ConfigArgs<{ nodes: Widget[] }>;
  node: ConfigArgs<{
    label: string;
    value: number;
    color: string;
    index: number;
    ratio: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
};

export type TreemapNode = {
  label: string;
  value: number;
  color?: string;
};

export type TreemapData = {
  nodes: TreemapNode[];
  title?: string;
};

export type TreemapLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TreemapConfig = {
  custom: TreemapCustom;
  data: TreemapData;
  title: string;
  colors: string[];
  layouts: TreemapLayout[];
};
