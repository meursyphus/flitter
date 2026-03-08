import type { Widget } from "flitter-core";
import HeadlessGaugeChart from "../_flitter/headless/gauge-chart";
import type { GaugeChartCustom, GaugeChartData } from "./types";
import * as Base from "./base";
import { HoverTooltip } from "../_flitter/shared/interaction/hover-tooltip";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "../ag-base/index";

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
  gauge: (args, ctx) =>
    new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label: "Gauge",
        items: { legend: "Value", color: "#00a9ff", value: ctx.data.value },
        config: defaultAgCartesianBaseConfig,
      }),
      renderChild: () => Base.Gauge(args, ctx),
    }),
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
