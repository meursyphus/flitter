import type { Widget } from "flitter-core";
import type { SankeyChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
  args: T,
  context: SankeyChartContext<TConfig>,
) => Widget;

export type SankeyChartContext<TConfig = {}> = SankeyChartController & {
  config: TConfig;
};

export type SankeyChartData = { from: string; to: string; value: number }[];

export type SankeyPoint = {
  x: number;
  y: number;
};

export type SankeyRibbon = {
  startTop: SankeyPoint;
  startBottom: SankeyPoint;
  endTop: SankeyPoint;
  endBottom: SankeyPoint;
};

export type SankeyNodeLayout = {
  id: string;
  label: string;
  color: string;
  x: number;
  width: number;
  top: number;
  height: number;
  column: number;
  totalValue: number;
};

export type SankeyLinkLayout = SankeyRibbon & {
  source: string;
  target: string;
  value: number;
  color: string;
  anchorX: number;
  anchorY: number;
  anchorWidth: number;
  anchorHeight: number;
};

export type SankeyLayout = {
  nodes: SankeyNodeLayout[];
  links: SankeyLinkLayout[];
  totalColumns: number;
};

export type SankeyPlacedNode = {
  id: string;
  column: number;
  x: number;
  width: number;
  top: number;
  height: number;
  widget: Widget;
};

export type SankeyTooltipItem = {
  legend: string;
  color: string;
  value: number | string;
};

export type SankeyHoveredNodeRect = {
  kind: "node";
  id: string;
  label: string;
  color: string;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SankeyHoveredLinkRect = {
  kind: "link";
  source: string;
  target: string;
  color: string;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SankeyHoveredRect = SankeyHoveredNodeRect | SankeyHoveredLinkRect;

export type SankeyChartCustom<TConfig = {}> = {
  layout: CustomArgs<{ title: Widget; dataView: Widget; tooltipArea: Widget }, TConfig>;
  dataView: CustomArgs<{ nodes: SankeyPlacedNode[]; links: Widget[] }, TConfig>;
  node: CustomArgs<
    {
      id: string;
      label: string;
      color: string;
      value: number;
      column: number;
      totalColumns: number;
      labelWidget: Widget | null;
      isHovered: boolean;
      isActive: boolean;
      isDimmed: boolean;
    },
    TConfig
  >;
  nodeLabel: CustomArgs<
    {
      id: string;
      label: string;
      color: string;
      value: number;
      isHovered: boolean;
      isActive: boolean;
      isDimmed: boolean;
    },
    TConfig
  >;
  link: CustomArgs<
    {
      source: string;
      target: string;
      value: number;
      color: string;
      ribbon: SankeyRibbon;
      labelAnchor: SankeyPoint;
      labelWidget: Widget | null;
      isHovered: boolean;
      isActive: boolean;
      isDimmed: boolean;
    },
    TConfig
  >;
  linkLabel: CustomArgs<
    {
      source: string;
      target: string;
      value: number;
      color: string;
      isHovered: boolean;
      isActive: boolean;
      isDimmed: boolean;
    },
    TConfig
  >;
  title: CustomArgs<undefined, TConfig>;
  tooltip: CustomArgs<{ label: string; items: SankeyTooltipItem[] }, TConfig>;
  tooltipArea: CustomArgs<
    {
      tooltip: Widget | null;
      hovered: SankeyHoveredRect | null;
    },
    TConfig
  >;
};
