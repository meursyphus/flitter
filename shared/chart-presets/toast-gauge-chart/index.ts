import type { Widget } from "flitter-core";
import { GaugeChart as HeadlessGaugeChart } from "flitter-ui/chart";
import type { GaugeChartCustom, GaugeChartData } from "./types";
import { styleConfig, type GaugeChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

export type {
  GaugeChartContext,
  GaugeChartZone,
  GaugeChartData,
  GaugeChartCustom,
} from "./types";
export { GaugeChartController } from "./types";
export { type GaugeChartConfig } from "./style";

export default function GaugeChart({
  config,
  data,
  custom,
}: {
  config?: DeepPartial<GaugeChartConfig>;
  data: GaugeChartData;
  custom?: Partial<GaugeChartCustom<GaugeChartConfig>>;
}): Widget {
  return HeadlessGaugeChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as GaugeChartCustom<GaugeChartConfig>,
  });
}
