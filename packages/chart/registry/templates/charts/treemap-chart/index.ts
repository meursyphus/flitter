import type { Widget } from "flitter-core";
import { TreemapChart as HeadlessTreemapChart } from "flitter-ui/chart";
import type { TreemapCustom, TreemapData } from "./types";
import { styleConfig, type TreemapChartConfig } from "./style";
import type { DeepPartial } from "@utils/index";

export type {
  TreemapContext,
  TreemapCustom,
  TreemapData,
  TreemapNode,
  TreemapLayout,
} from "./types";
export { TreemapController } from "./types";
export { type TreemapChartConfig } from "./style";

export default function TreemapChart({
  data,
  config,
  custom,
}: {
  custom?: Partial<TreemapCustom<TreemapChartConfig>>;
  data: TreemapData;
  config?: DeepPartial<TreemapChartConfig>;
}): Widget {
  return HeadlessTreemapChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as TreemapCustom<TreemapChartConfig>,
  });
}
