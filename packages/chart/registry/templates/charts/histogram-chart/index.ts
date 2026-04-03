import type { Widget } from "flitter-core";
import { BaseHistogramChart } from "./base";
import type {
  HistogramChartCustom,
  HistogramChartData,
  HistogramChartTransform,
} from "./base";
import { styleConfig, type HistogramChartConfig } from "./style";
import type { DeepPartial } from "@utils/index";

export type {
  HistogramChartContext,
  HistogramAggregation,
  HistogramBin,
  HistogramChartData,
  HistogramChartTransform,
  HistogramChartScale,
  HistogramChartCustom,
} from "./base";
export { HistogramChartController } from "./types";
export { type HistogramChartConfig } from "./style";

export default function HistogramChart({
  config,
  data,
  transform,
  custom,
}: {
  config?: DeepPartial<HistogramChartConfig>;
  data: HistogramChartData;
  transform?: HistogramChartTransform;
  custom?: Partial<HistogramChartCustom<HistogramChartConfig>>;
}): Widget {
  return BaseHistogramChart({
    data,
    transform,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as HistogramChartCustom<HistogramChartConfig>,
  });
}
