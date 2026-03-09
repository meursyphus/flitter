import type { SankeyChartCustom } from "flitter-ui/chart";
import { AnimatedScale, SizedBox } from "flitter-core";
import type { SankeyChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Base from "../base";

export { type SankeyChartConfig } from "./config";

const toastCustom: Partial<SankeyChartCustom<SankeyChartConfig>> = {
  layout: Base.Layout,
  sankey: Base.Sankey,
  node: (...args) => {
    const [nodeArgs, ctx] = args;
    return AnimatedScale({
      duration: ctx.config.animation.duration,
      scale:
        ctx.hoveredNodeId === nodeArgs.id
          ? 1.04
          : 1,
      child: Base.Node(nodeArgs as any, ctx as any),
    });
  },
  link: Base.Link,
  nodeLabel: Base.NodeLabel,
  title: () => SizedBox.shrink(),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<SankeyChartConfig>): SankeyChartConfig =>
    deepMerge(defaultToastConfig, config),
};
