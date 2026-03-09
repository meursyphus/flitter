import type { Widget } from "flitter-core";
import { ProgressChart as HeadlessProgressChart } from "flitter-ui/chart";
import type { ProgressChartCustom, ProgressChartData } from "./types";
import { styleConfig, type ProgressChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

export type {
  ProgressChartContext,
  ProgressChartData,
  ProgressSegment,
  ProgressChartCustom,
} from "./types";
export { ProgressChartController } from "./types";
export { type ProgressChartConfig } from "./style";

export default function ProgressChart({
  config,
  data,
  custom,
}: {
  config?: DeepPartial<ProgressChartConfig>;
  data: ProgressChartData;
  custom?: Partial<ProgressChartCustom<ProgressChartConfig>>;
}): Widget {
  return HeadlessProgressChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as ProgressChartCustom<ProgressChartConfig>,
  });
}
