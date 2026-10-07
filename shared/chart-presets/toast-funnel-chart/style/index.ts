import { LayoutBuilder } from "flitter-ui";
import type { FunnelChartCustom } from "flitter-ui/chart";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import {
  toastTitle,
  toastLegend,
  tooltipContent,
  cartesian,
} from "../../_shared/toast/index";
import { Layout } from "../../_shared/toast/pie-like/layout";
import { Plot } from "../base/plot";
import { Stage, DataLabel } from "../base/stage";
import { stageGeometry } from "../base/geometry";
import { defaultConfig, type FunnelChartConfig } from "./config";
import { AnimatedDataView } from "../../_shared/toast/cartesian/animated-data-view";

export type { FunnelChartConfig } from "./config";

const custom: FunnelChartCustom<FunnelChartConfig> = {
  layout: Layout,
  title: toastTitle,
  legend: toastLegend,
  dataLabel: DataLabel,
  plot: (args, ctx) =>
    Plot(args, (child) =>
      ctx.config.animation.enabled
        ? new AnimatedDataView({
            child,
            duration: ctx.config.animation.duration,
            isVertical: true,
            baselineRatio: 1,
          })
        : child,
    ),
  stage: (args, ctx) =>
    Stage(args, ctx, {
      fill:
        ctx.config.colors[args.index % ctx.config.colors.length] ?? "#888888",
      stroke: args.isHovered
        ? ctx.config.funnel.hoverBorderColor
        : ctx.config.funnel.strokeColor,
      strokeWidth: args.isHovered
        ? ctx.config.funnel.hoverBorderWidth
        : ctx.config.funnel.strokeWidth,
      shadow: args.isHovered ? ctx.config.funnel.hoverShadowColor : null,
      opacity: 1,
    }),
  tooltip: (stage, ctx) =>
    tooltipContent({
      label: stage.label,
      items: [
        {
          legend: "Value",
          value: stage.value.toLocaleString("en-US"),
          color:
            ctx.config.colors[stage.index % ctx.config.colors.length] ??
            "#888888",
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
  tooltipArea: ({ stage, tooltip }, ctx) =>
    LayoutBuilder({
      builder: (_, constraints) => {
        const geometry =
          stage == null
            ? null
            : stageGeometry(
                stage,
                constraints.maxWidth,
                stage.height * constraints.maxHeight,
                ctx.config,
              );
        const stageWidth =
          geometry == null
            ? 0
            : Math.max(geometry.topWidth, geometry.bottomWidth);
        return cartesian.toastRectTooltipArea({
          tooltip,
          enabled: ctx.config.tooltip.enabled,
          anchorRect:
            stage == null || geometry == null
              ? null
              : {
                  x: geometry.center - stageWidth / 2,
                  y: stage.top * constraints.maxHeight + geometry.top,
                  width: stageWidth,
                  height: geometry.bottom - geometry.top,
                },
          mode: { variant: "heatmap" },
          estimatedTooltipSize: { width: 230, height: 125 },
        });
      },
    }),
};

export const styleConfig = {
  custom,
  createConfig: (config?: DeepPartial<FunnelChartConfig>): FunnelChartConfig =>
    deepMerge(defaultConfig, config),
};
