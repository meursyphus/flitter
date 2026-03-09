import type { GaugeChartCustom } from "@headless/gauge-chart/types";
import { Text, TextStyle } from "flitter-core";
import * as Base from "../base";
import type { GaugeChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { agTooltipContent, agTitle } from "@styles/ag";

export { type GaugeChartConfig } from "./config";

const agCustom: Partial<GaugeChartCustom<GaugeChartConfig>> = {
  layout: Base.Layout,
  title: agTitle as any,
  gauge: (args, ctx) =>
    new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label: "Gauge",
        items: { legend: "Value", color: "#5A8FD3", value: ctx.data.value },
        config: ctx.config as any,
      }),
      renderChild: () => Base.Gauge(args, ctx),
    }),
  needle: Base.Needle,
  valueLabel: ({ value }, ctx) =>
    Text(value.toString(), {
      style: new TextStyle({
        fontFamily: ctx.config.font.family,
        fontSize: 24,
        fontWeight: "bold",
        color: ctx.config.gauge.valueColor,
      }),
    }),
  scale: Base.Scale,
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<GaugeChartConfig>): GaugeChartConfig =>
    deepMerge(defaultAgConfig, config),
};
