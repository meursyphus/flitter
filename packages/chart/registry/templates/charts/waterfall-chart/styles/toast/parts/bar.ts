import {
  Alignment,
  AnimatedScale,
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  EdgeInsets,
  FractionallySizedBox,
  Opacity,
  Padding,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { WaterfallBarType, WaterfallChartContext } from "@headless/waterfall-chart/types";
import type { WaterfallChartConfig } from "../config";

const TYPE_INDEX: Record<WaterfallBarType, number> = {
  increase: 0,
  decrease: 1,
  total: 2,
  subtotal: 2,
};

export function toastBar(
  { value, cumulative, type, isHovered }: {
    value: number;
    cumulative: number;
    index: number;
    label: string;
    type: WaterfallBarType;
    isHovered: boolean;
  },
  ctx: WaterfallChartContext<WaterfallChartConfig>,
): Widget {
  const scale = ctx.scale;
  if (scale == null) return SizedBox.shrink();

  const total = scale.max - scale.min || 1;
  const barBase =
    type === "total"
      ? 0
      : value >= 0
        ? cumulative - value
        : cumulative;
  const barTop = type === "total" ? cumulative : barBase + value;
  const minValue = Math.min(barBase, barTop);
  const maxValue = Math.max(barBase, barTop);
  const heightRatio = (maxValue - minValue) / total;
  const bottomRatio = (minValue - scale.min) / total;
  const outerHeightFactor = Math.max(0, Math.min(1, bottomRatio + heightRatio));
  const innerHeightFactor =
    outerHeightFactor > 0 ? Math.max(0, Math.min(1, heightRatio / outerHeightFactor)) : 0;
  const color = ctx.config.colors[TYPE_INDEX[type]] ?? ctx.config.colors[0];
  const hoveredBar = ctx.hoveredBar;
  const activeOpacity = hoveredBar == null || isHovered ? 1 : 0.28;

  return Opacity({
    opacity: activeOpacity,
    child: Container({
      width: Infinity,
      height: Infinity,
      alignment: Alignment.bottomCenter,
      child:
        outerHeightFactor <= 0
          ? SizedBox.shrink()
          : FractionallySizedBox({
              heightFactor: outerHeightFactor,
              alignment: Alignment.bottomCenter,
              child: Container({
                alignment: Alignment.topCenter,
                child: FractionallySizedBox({
                  heightFactor: innerHeightFactor,
                  alignment: Alignment.topCenter,
                  child: Padding({
                    padding: EdgeInsets.symmetric({
                      horizontal: Math.max(2, ctx.config.waterfall.barGap / 2),
                    }),
                    child: AnimatedScale({
                      duration: ctx.config.animation.duration,
                      scale: isHovered ? 1.02 : 1,
                      alignment: Alignment.center,
                      child: Container({
                        width: Infinity,
                        height: Infinity,
                        decoration: new BoxDecoration({
                          color,
                          border:
                            isHovered
                              ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                              : undefined,
                          boxShadow:
                            isHovered
                              ? [new BoxShadow({ color: "rgba(0,0,0,0.24)", blurRadius: 12 })]
                              : undefined,
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
    }),
  });
}
