import {
  Alignment,
  AnimatedFractionallySizedBox,
  Container,
  FractionallySizedBox,
  type Widget,
} from "flitter-core";
import type { CandlestickChartCustom } from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "../config";

export function toastCandlestickBox(
  ...[{ candlestick, geometry, isHovered }, ctx]: Parameters<
    CandlestickChartCustom<CandlestickChartConfig>["candlestickBox"]
  >
): Widget {
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
          widthFactor: isHovered ? 0.8 : 0.68,
          child: candlestick,
        }),
      }),
    }),
  });
}
