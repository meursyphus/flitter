import type { SankeyChartCustom } from "@headless/sankey-chart/types";
import { SizedBox } from "flitter-core";
import type { SankeyChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Base from "../base";

export { type SankeyChartConfig } from "./config";

const agCustom: Partial<SankeyChartCustom<SankeyChartConfig>> = {
  layout: Base.Layout,
  dataView: Base.DataView,
  node: Base.Node,
  link: Base.Link,
  nodeLabel: Base.NodeLabel,
  title: Base.Title,
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<SankeyChartConfig>): SankeyChartConfig =>
    deepMerge(defaultAgConfig, config),
};
