import { Container } from "flitter-core";
import type { FunnelChartCustom } from "@headless/funnel-chart/types";
import { deepMerge, type DeepPartial } from "@utils/index";
import { agTitle, agLegend, agTooltipContent, cartesian } from "@styles/ag";
import { Layout } from "../../../../shared/pie-like/layout";
import { Plot } from "../../base/plot";
import { Stage, DataLabel } from "../../base/stage";
import { defaultConfig, type FunnelChartConfig } from "./config";

export type { FunnelChartConfig } from "./config";

const custom: FunnelChartCustom<FunnelChartConfig> = {
  layout: (args, ctx) =>
    Container({ color: ctx.config.background, child: Layout(args, ctx) }),
  title: agTitle,
  legend: agLegend,
  dataLabel: DataLabel,
  plot: (args) => Plot(args),
  stage: (args, ctx) =>
    Stage(args, ctx, {
      fill:
        ctx.config.colors.fills[args.index % ctx.config.colors.fills.length] ??
        "#888888",
      stroke: ctx.config.funnel.strokeColor,
      strokeWidth: ctx.config.funnel.strokeWidth,
      shadow: null,
      opacity:
        ctx.hoveredIndex != null && !args.isHovered
          ? ctx.config.funnel.dimOpacity
          : 1,
    }),
  tooltip: (stage, ctx) =>
    agTooltipContent({
      label: stage.label,
      items: [
        {
          legend: "Value",
          value: stage.value.toLocaleString("en-US"),
          color:
            ctx.config.colors.fills[
              stage.index % ctx.config.colors.fills.length
            ] ?? "#888888",
        },
        {
          legend: "Of first stage",
          value: `${stage.percentage.toFixed(1)}%`,
          color: "transparent",
        },
        ...(stage.conversion == null
          ? []
          : [
              {
                legend: "From previous",
                value: `${stage.conversion.toFixed(1)}%`,
                color: "transparent",
              },
            ]),
      ],
      config: ctx.config,
    }),
  tooltipArea: ({ tooltip }, ctx) =>
    cartesian.agMouseTooltipArea({
      tooltip,
      enabled: ctx.config.tooltip.enabled,
    }),
};

export const styleConfig = {
  custom,
  createConfig: (config?: DeepPartial<FunnelChartConfig>): FunnelChartConfig =>
    deepMerge(defaultConfig, config),
};
