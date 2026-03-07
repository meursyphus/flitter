import type { Widget } from "flitter-core";
import HeadlessSankeyChart from "@headless/sankey-chart";
import type { SankeyChartCustom, SankeyChartData } from "./types";
import * as Base from "./base";

export type {
  SankeyChartContext,
  SankeyChartCustom,
  SankeyChartData,
  SankeyNodeLayout,
  SankeyLinkLayout,
  SankeyLayout,
} from "./types";
export { SankeyChartController } from "./types";

const baseDefaults: Partial<SankeyChartCustom> = {
  layout: Base.Layout,
  sankey: Base.Sankey,
  node: Base.Node,
  link: Base.Link,
  nodeLabel: Base.NodeLabel,
  title: Base.Title,
};

export default function SankeyChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<SankeyChartCustom<TConfig>>;
  data: SankeyChartData;
  config?: TConfig;
}): Widget {
  return HeadlessSankeyChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as SankeyChartCustom<TConfig>,
  });
}
