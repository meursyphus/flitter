import type { FunnelChartCustom } from "@headless/funnel-chart/types";
import {
  Alignment,
  AnimatedScale,
  Border,
  BorderRadius,
  BoxDecoration,
  BoxShadow,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  LayoutBuilder,
  MainAxisAlignment,
  MainAxisSize,
  Opacity,
  Positioned,
  Radius,
  Row,
  SizedBox,
  Stack,
} from "flitter-core";
import type { FunnelChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Base from "../base";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { tooltipContent } from "@styles/toast";

export { type FunnelChartConfig } from "./config";

const toastCustom: Partial<FunnelChartCustom<FunnelChartConfig>> = {
  layout: Base.Layout,
  funnel: Base.Funnel,
  stage: (...args) => {
    const [{ index, label, value, ratio, color, stageLabel, dataLabel }, ctx] = args;
    const hoveredIndex = ctx.hoveredIndex;
    const isHovered = ctx.isStageHovered(index);
    const activeOpacity = hoveredIndex == null || isHovered ? 1 : 0.28;

    return SizedBox({
      width: Infinity,
      height: ctx.config.funnel.stageHeight,
      child: new HoverTooltip({
        position: "topCenter",
        tooltip: tooltipContent({
          label,
          items: { legend: `Stage ${index + 1}`, color, value },
          config: ctx.config as any,
        }),
        onMouseEnter: () => ctx.hoverStage(index),
        onMouseLeave: () => ctx.unhoverStage(),
        renderChild: (hovered) =>
          LayoutBuilder({
            builder: (_ctx, constraints) => {
              const fullWidth = constraints.maxWidth;
              const stageWidth = Math.max(fullWidth * Math.max(ratio, 0.05), 28);
              const compact = stageWidth < 180;
              const barLeft = (fullWidth - stageWidth) / 2;
              const chipWidth = Math.min(180, Math.max(120, fullWidth * 0.28));
              const chipLeft = Math.max(
                0,
                Math.min(fullWidth - chipWidth, barLeft + stageWidth + 8),
              );

              return Stack({
                children: [
                  Positioned({
                    left: barLeft,
                    top: 0,
                    child: Opacity({
                      opacity: activeOpacity,
                      child: AnimatedScale({
                        duration: ctx.config.animation.duration,
                        scale: hovered ? 1.02 : 1,
                        alignment: Alignment.center,
                        child: Container({
                          width: stageWidth,
                          height: constraints.maxHeight,
                          alignment: Alignment.center,
                          decoration: new BoxDecoration({
                            color,
                            borderRadius: BorderRadius.all(Radius.circular(4)),
                            border: hovered
                              ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                              : undefined,
                            boxShadow: hovered
                              ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 12 })]
                              : undefined,
                          }),
                          child: compact
                            ? undefined
                            : Row({
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container({
                                    margin: EdgeInsets.only({ right: 8 }),
                                    child: stageLabel,
                                  }),
                                  dataLabel,
                                ],
                              }),
                        }),
                      }),
                    }),
                  }),
                  compact
                    ? Positioned({
                        left: chipLeft,
                        top: 2,
                        child: Opacity({
                          opacity: activeOpacity,
                          child: Container({
                            width: chipWidth,
                            padding: EdgeInsets.symmetric({ horizontal: 10, vertical: 6 }),
                            decoration: new BoxDecoration({
                              color,
                              borderRadius: BorderRadius.all(Radius.circular(4)),
                              boxShadow: hovered
                                ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })]
                                : undefined,
                            }),
                            child: Column({
                              mainAxisSize: MainAxisSize.min,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                stageLabel,
                                dataLabel,
                              ],
                            }),
                          }),
                        }),
                      })
                    : SizedBox.shrink(),
                ],
              });
            },
          }),
      }),
    });
  },
  stageLabel: Base.StageLabel,
  dataLabel: Base.DataLabel,
  legend: () => SizedBox.shrink(),
  title: Base.Title,
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<FunnelChartConfig>): FunnelChartConfig =>
    deepMerge(defaultToastConfig, config),
};
