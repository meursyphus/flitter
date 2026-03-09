import type { Widget } from "flitter-core";
import { PolarAreaChart as HeadlessPolarAreaChart } from "flitter-ui/chart";
import type { PolarAreaChartCustom, PolarAreaChartData } from "./types";
import { styleConfig, type PolarAreaChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

export type {
  PolarAreaChartContext,
  PolarAreaChartData,
  PolarAreaChartCustom,
} from "./types";
export { PolarAreaChartController } from "./types";
export { type PolarAreaChartConfig } from "./style";

export default function PolarAreaChart({
  config,
  data,
  custom,
}: {
  config?: DeepPartial<PolarAreaChartConfig>;
  data: PolarAreaChartData;
  custom?: Partial<PolarAreaChartCustom<PolarAreaChartConfig>>;
}): Widget {
  return HeadlessPolarAreaChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as PolarAreaChartCustom<PolarAreaChartConfig>,
  });
}
