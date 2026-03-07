import type { Widget } from "flitter-core";
import HeadlessGaugeChart from "@headless/gauge-chart";
import type { GaugeChartCustom, GaugeChartData } from "./types";
import * as Base from "./base";

export type {
  GaugeChartContext,
  GaugeChartZone,
  GaugeChartData,
  GaugeChartCustom,
} from "./types";
export { GaugeChartController } from "./types";

const baseDefaults: Partial<GaugeChartCustom> = {
  layout: Base.Layout,
  title: Base.Title,
  gauge: Base.Gauge,
  needle: Base.Needle,
  valueLabel: Base.ValueLabel,
  scale: Base.Scale,
};

export default function GaugeChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<GaugeChartCustom<TConfig>>;
  data: GaugeChartData;
  config?: TConfig;
}): Widget {
  return HeadlessGaugeChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as GaugeChartCustom<TConfig>,
  });
}
