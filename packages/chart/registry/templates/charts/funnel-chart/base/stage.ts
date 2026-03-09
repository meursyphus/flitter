import type { FunnelChartCustom } from "../types";
import {
  Alignment,
  BorderRadius,
  BoxDecoration,
  Border,
  BoxShadow,
  Column,
  Container,
  EdgeInsets,
  LayoutBuilder,
  MainAxisSize,
  Opacity,
  Positioned,
  Radius,
  Row,
  SizedBox,
  Stack,
  CrossAxisAlignment,
  MainAxisAlignment,
  type Widget,
} from "flitter-core";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "@styles/ag";

export function Stage(
  ...args: Parameters<FunnelChartCustom["stage"]>
): Widget {
  const [{ index, label, value, ratio, color, stageLabel, dataLabel }, ctx] = args;
  const hoveredIndex = ctx.hoveredIndex;
  const isHovered = ctx.isStageHovered(index);
  const activeOpacity = hoveredIndex == null || isHovered ? 1 : 0.3;

  return SizedBox({
    width: Infinity,
    height: 40,
    child: new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label,
        items: { legend: `Stage ${index + 1}`, color, value },
        config: defaultAgCartesianBaseConfig,
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
                          ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 12 })]
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
                              ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 10 })]
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
}
