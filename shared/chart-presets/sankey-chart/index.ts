import type { Widget } from "flitterjs";
import { SankeyChart as HeadlessSankeyChart } from "@flitterjs/chart";
import type { SankeyChartCustom, SankeyChartData } from "./types";
import { styleConfig, type SankeyChartConfig } from "./style";
import type { DeepPartial } from "@flitterjs/chart";

export type {
  SankeyChartContext,
  SankeyChartCustom,
  SankeyChartData,
  SankeyNodeLayout,
  SankeyLinkLayout,
  SankeyLayout,
} from "./types";
export { SankeyChartController } from "./types";
export { type SankeyChartConfig } from "./style";

export default function SankeyChart({
  data,
  config,
  custom,
}: {
  custom?: Partial<SankeyChartCustom<SankeyChartConfig>>;
  data: SankeyChartData;
  config?: DeepPartial<SankeyChartConfig>;
}): Widget {
  return HeadlessSankeyChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as SankeyChartCustom<SankeyChartConfig>,
  });
}
