import type { SankeyChartCustom } from "@headless/sankey-chart/types";
import { AnimatedScale } from "flitter-core";
import type { SankeyChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Base from "../base";
import { toastTitle, tooltipContent } from "@styles/toast";
import type { SankeyChartContext } from "@headless/sankey-chart/types";
import type { Widget } from "flitter-core";
import { toastTooltipArea } from "./parts/tooltip-area";

export { type SankeyChartConfig } from "./config";

function toastTooltip(
  args: { label: string; items: { legend: string; color: string; value: number | string }[] },
  context: SankeyChartContext<SankeyChartConfig>,
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<SankeyChartCustom<SankeyChartConfig>> = {
  layout: Base.Layout,
  dataView: Base.DataView,
  node: (...args) => {
    const [nodeArgs, ctx] = args;
    return AnimatedScale({
      duration: ctx.config.animation.duration,
      scale:
        ctx.hoveredNodeId === nodeArgs.id
          ? 1.04
          : 1,
      child: Base.Node(nodeArgs, ctx),
    });
  },
  link: Base.Link,
  nodeLabel: Base.NodeLabel,
  linkLabel: Base.LinkLabel,
  title: (args, context) => toastTitle(args, context),
  tooltip: toastTooltip,
  tooltipArea: toastTooltipArea,
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<SankeyChartConfig>): SankeyChartConfig =>
    deepMerge(defaultToastConfig, config),
};
