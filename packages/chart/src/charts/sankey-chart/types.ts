import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (args: T, context: SankeyChartConfig) => Widget;

export type SankeyChartCustom = {
  layout: ConfigArgs<{ title: Widget; sankey: Widget }>;
  sankey: ConfigArgs<{ nodes: Widget[]; links: Widget[]; nodeLabels: Widget[] }>;
  node: ConfigArgs<{
    id: string;
    label: string;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  link: ConfigArgs<{
    source: string;
    target: string;
    value: number;
    sourceX: number;
    sourceY: number;
    sourceHeight: number;
    targetX: number;
    targetY: number;
    targetHeight: number;
    color: string;
  }>;
  nodeLabel: ConfigArgs<{
    id: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    column: number;
    totalColumns: number;
  }>;
  title: ConfigArgs<{ name: string }>;
};

export type SankeyChartData = {
  nodes: { id: string; label: string; color?: string }[];
  links: { source: string; target: string; value: number }[];
  title?: string;
};

export type SankeyNodeLayout = {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
  totalValue: number;
};

export type SankeyLinkLayout = {
  source: string;
  target: string;
  value: number;
  sourceX: number;
  sourceY: number;
  sourceHeight: number;
  targetX: number;
  targetY: number;
  targetHeight: number;
  color: string;
};

export type SankeyLayout = {
  nodes: SankeyNodeLayout[];
  links: SankeyLinkLayout[];
  totalColumns: number;
};

export type SankeyChartConfig = {
  custom: SankeyChartCustom;
  data: SankeyChartData;
  layout: SankeyLayout;
  title: string;
};
