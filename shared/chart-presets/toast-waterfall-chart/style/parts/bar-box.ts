import {
  Alignment,
  AnimatedFractionallySizedBox,
  Container,
  FractionallySizedBox,
  type Widget,
} from "flitter-ui";
import type { WaterfallChartCustom } from "flitter-ui/chart";
import type { WaterfallChartConfig } from "../config";

export function toastBarBox(
  ...[{ bar, geometry, isHovered }, ctx]: Parameters<WaterfallChartCustom<WaterfallChartConfig>["barBox"]>
) {
  return Container({
    width: Infinity,
    height: Infinity,
    child: AnimatedFractionallySizedBox({
      duration: ctx.config.animation.duration,
      alignment: geometry.boxAlignment,
      heightFactor: geometry.boxHeightFactor,
      child: Container({
        alignment: Alignment.center,
        child: FractionallySizedBox({
          widthFactor: isHovered ? 0.82 : 0.72,
          child: bar,
        }),
      }),
    }),
  });
}
