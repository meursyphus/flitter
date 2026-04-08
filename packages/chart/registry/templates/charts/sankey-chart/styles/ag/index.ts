import type { SankeyChartCustom } from "@headless/sankey-chart/types";
import type { SankeyChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Base from "../base";
import { agTitle, agTooltipContent } from "@styles/ag";
import type { SankeyChartContext } from "@headless/sankey-chart/types";
import type { Widget } from "flitter-core";
import { agTooltipArea } from "./parts/tooltip-area";

export { type SankeyChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number | string }[] },
  context: SankeyChartContext<SankeyChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<SankeyChartCustom<SankeyChartConfig>> = {
  layout: Base.Layout,
  dataView: Base.DataView,
  node: Base.Node,
  link: Base.Link,
  nodeLabel: Base.NodeLabel,
  linkLabel: Base.LinkLabel,
  title: agTitle as any,
  tooltip: agTooltip,
  tooltipArea: agTooltipArea,
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<SankeyChartConfig>): SankeyChartConfig =>
    deepMerge(defaultAgConfig, config),
};
