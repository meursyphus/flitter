import type { Widget } from "flitter-core";
import { WaterfallChart as HeadlessWaterfallChart } from "flitter-ui/chart";
import type { WaterfallChartCustom, WaterfallChartData } from "./types";
import { styleConfig, type WaterfallChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

export type {
  WaterfallChartContext,
  WaterfallBarType,
  WaterfallChartCustom,
  WaterfallChartData,
  WaterfallChartScale,
} from "./types";
export { WaterfallChartController } from "./types";
export { type WaterfallChartConfig } from "./style";

export default function WaterfallChart({
  config,
  data,
  custom,
}: {
  config?: DeepPartial<WaterfallChartConfig>;
  data: WaterfallChartData;
  custom?: Partial<WaterfallChartCustom<WaterfallChartConfig>>;
}): Widget {
  return HeadlessWaterfallChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as WaterfallChartCustom<WaterfallChartConfig>,
  });
}
