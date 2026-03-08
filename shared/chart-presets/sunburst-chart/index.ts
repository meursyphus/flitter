import type { Widget } from "flitter-core";
import HeadlessSunburstChart from "../_flitter/headless/sunburst-chart";
import type { SunburstChartCustom, SunburstChartData } from "./types";
import * as Base from "./base";

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

const baseDefaults: Partial<SunburstChartCustom> = {
  layout: Base.Layout,
  title: Base.Title,
  legend: Base.Legend,
  legendItem: Base.LegendItem,
  sunburst: Base.Sunburst,
  segment: Base.Segment,
};

export default function SunburstChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<SunburstChartCustom<TConfig>>;
  data: SunburstChartData;
  config?: TConfig;
}): Widget {
  return HeadlessSunburstChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as SunburstChartCustom<TConfig>,
  });
}
