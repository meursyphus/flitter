import type { Widget } from "flitter-core";
import { DonutChart as HeadlessDonutChart } from "flitter-ui/chart";
import type { DonutChartCustom, DonutChartData } from "./types";
import { styleConfig, type DonutChartConfig } from "./style";
import type { DeepPartial } from "@utils/index";

export type {
  DonutChartContext,
  DonutChartData,
  DonutChartCustom,
} from "./types";
export { DonutChartController } from "./types";
export { type DonutChartConfig } from "./style";

export default function DonutChart({
  config,
  data,
  custom,
  innerRadiusRatio = 0.6,
}: {
  config?: DeepPartial<DonutChartConfig>;
  data: DonutChartData;
  custom?: Partial<DonutChartCustom<DonutChartConfig>>;
  innerRadiusRatio?: number;
}): Widget {
  return HeadlessDonutChart({
    data,
    innerRadiusRatio,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as DonutChartCustom<DonutChartConfig>,
  });
}
