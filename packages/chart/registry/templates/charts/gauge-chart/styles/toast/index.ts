import type { GaugeChartCustom } from "@headless/gauge-chart/types";
import { Text, TextStyle } from "flitter-core";
import * as Base from "../base";
import type { GaugeChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { toastTitle, tooltipContent } from "@styles/toast";

export { type GaugeChartConfig } from "./config";

const toastCustom: Partial<GaugeChartCustom<GaugeChartConfig>> = {
  layout: Base.Layout,
  title: toastTitle as any,
  gauge: (args, ctx) =>
    new HoverTooltip({
      position: "topCenter",
      tooltip: tooltipContent({
        label: "Gauge",
        items: { legend: "Value", color: "#17a2e6", value: ctx.data.value },
        config: {
          ...defaultToastConfig,
          tooltip: ctx.config.tooltip,
          font: ctx.config.font,
        } as any,
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
  custom: toastCustom,
  createConfig: (config?: DeepPartial<GaugeChartConfig>): GaugeChartConfig =>
    deepMerge(defaultToastConfig, config),
};
