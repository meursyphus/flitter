import type { SankeyChartCustom } from "@headless/sankey-chart/types";
import { AnimatedScale, SizedBox } from "flitter-core";
import type { SankeyChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Base from "../base";

export { type SankeyChartConfig } from "./config";

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
