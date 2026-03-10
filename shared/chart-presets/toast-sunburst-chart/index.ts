import type { Widget } from "flitter-core";
import { SunburstChart as HeadlessSunburstChart } from "flitter-ui/chart";
import type { SunburstChartCustom, SunburstChartData } from "./types";
import { styleConfig, type SunburstChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

export type {
  SunburstChartContext,
  SunburstChartNode,
  SunburstChartData,
  SunburstChartCustom,
  FlatSegment,
  SunburstNode,
  SunburstCustom,
} from "./types";
export { SunburstChartController } from "./types";
export { type SunburstChartConfig } from "./style";

export default function ToastSunburstChart({
  config,
  custom,
  ...rest
}: {
  config?: DeepPartial<SunburstChartConfig>;
  custom?: Partial<SunburstChartCustom<SunburstChartConfig>>;
  data: SunburstChartData;
}): Widget {
  return HeadlessSunburstChart({
    ...rest,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as SunburstChartCustom<SunburstChartConfig>,
  });
}
