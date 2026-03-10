import type { GaugeChartCustom } from "@headless/gauge-chart/types";
import { type Widget } from "flitter-core";
import * as Base from "../base";
import type { GaugeChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { agTooltipContent } from "@styles/ag";
import { agGaugeLayout } from "./parts/layout";
import { agGaugeTitle } from "./parts/title";
import { agNeedle } from "./parts/needle";
import { agScale } from "./parts/scale";
import { agValueLabel } from "./parts/value-label";

export { type GaugeChartConfig } from "./config";

const agCustom: Partial<GaugeChartCustom<GaugeChartConfig>> = {
  layout: agGaugeLayout,
  title: agGaugeTitle,
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
  needle: agNeedle,
  valueLabel: agValueLabel,
  scale: agScale,
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<GaugeChartConfig>): GaugeChartConfig =>
    deepMerge(defaultAgConfig, config),
};
