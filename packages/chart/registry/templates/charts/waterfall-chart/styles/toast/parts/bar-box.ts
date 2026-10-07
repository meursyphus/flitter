import {
  Alignment,
  AnimatedFractionallySizedBox,
  Container,
  FractionallySizedBox,
  type Widget,
} from "flitter-core";
import type { WaterfallChartCustom } from "@headless/waterfall-chart/types";
import type { WaterfallChartConfig } from "../config";

export function toastBarBox(
  ...[{ bar, geometry, isHovered }, ctx]: Parameters<
    WaterfallChartCustom<WaterfallChartConfig>["barBox"]
  >
) {
  return Container({
    width: Infinity,
    height: Infinity,
    child: AnimatedFractionallySizedBox({
      duration: ctx.config.animation.enabled
        ? ctx.config.animation.duration
        : 0,
      alignment: geometry.boxAlignment,
      heightFactor: geometry.boxHeightFactor,
      child: Container({
        alignment: Alignment.center,
        child: FractionallySizedBox({
          widthFactor: 0.72,
          child: bar,
        }),
      }),
    }),
  });
}
