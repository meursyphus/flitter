import type { Widget } from "flitter-core";
import { HistogramChart as HeadlessHistogramChart } from "flitter-ui/chart";
import type { HistogramChartCustom, HistogramChartData } from "./types";
import { styleConfig, type HistogramChartConfig } from "./style";
import type { DeepPartial } from "@utils/index";

export type {
  HistogramChartContext,
  HistogramBin,
  HistogramChartData,
  HistogramChartScale,
  HistogramChartCustom,
} from "./types";
export { HistogramChartController } from "./types";
export { type HistogramChartConfig } from "./style";

export default function HistogramChart({
  config,
  data,
  custom,
}: {
  config?: DeepPartial<HistogramChartConfig>;
  data: HistogramChartData;
  custom?: Partial<HistogramChartCustom<HistogramChartConfig>>;
}): Widget {
  return HeadlessHistogramChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as HistogramChartCustom<HistogramChartConfig>,
  });
}
