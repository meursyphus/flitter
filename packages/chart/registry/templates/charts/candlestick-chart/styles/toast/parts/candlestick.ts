import {
  AnimatedScale,
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  Column,
  CrossAxisAlignment,
  Expanded,
  MainAxisAlignment,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { CandlestickChartCustom } from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "../config";

export function toastCandlestick(
  ...[{ candle, geometry, isHovered }, context]: Parameters<
    CandlestickChartCustom<CandlestickChartConfig>["candlestick"]
  >
): Widget {
  const color =
    candle.isUp
      ? context.config.candlestick.upColor
      : candle.isDown
        ? context.config.candlestick.downColor
        : "#64748b";
  const wickColor = context.config.candlestick.wickColor;

  return AnimatedScale({
    duration: context.config.animation.duration,
    scale: isHovered ? 1.03 : 1,
    child: SizedBox.expand({
      child: Container({
        decoration:
          isHovered
            ? new BoxDecoration({
                border: Border.all({ color: "white", width: 2, strokeAlign: 1 }),
                boxShadow: [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })],
              })
            : undefined,
        child: Column({
          mainAxisAlignment: MainAxisAlignment.end,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded({
              flex: Math.max(geometry.topWickRatio, 0.001),
              child: Container({
                width: isHovered ? 2 : 1,
                color: wickColor,
              }),
            }),
            Expanded({
              flex: Math.max(geometry.bodyRatio, 0.001),
              child: Container({
                width: Infinity,
                color,
              }),
            }),
            Expanded({
              flex: Math.max(geometry.bottomWickRatio, 0.001),
              child: Container({
                width: isHovered ? 2 : 1,
                color: wickColor,
              }),
            }),
          ],
        }),
      }),
    }),
  });
}
