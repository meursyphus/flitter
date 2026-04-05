import {
  BoxDecoration,
  Border,
  Container,
  Column,
  CrossAxisAlignment,
  Expanded,
  MainAxisAlignment,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { CandlestickChartCustom } from "flitter-ui/chart";
import type { CandlestickChartConfig } from "../config";

export function agCandlestick(
  ...[{ candle, geometry, isHovered }, context]: Parameters<
    CandlestickChartCustom<CandlestickChartConfig>["candlestick"]
  >
): Widget {
  const strokeColor = context.config.candlestick.wickColor;
  const fillColor =
    candle.isUp
      ? context.config.candlestick.upColor
      : candle.isDown
        ? context.config.candlestick.downColor
        : "rgba(91,132,196,0.18)";

  return SizedBox.expand({
    child: Column({
      mainAxisAlignment: MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded({
          flex: Math.max(geometry.topWickRatio, 0.001),
          child: Container({
            width: isHovered ? 2 : 1,
            color: strokeColor,
          }),
        }),
        Expanded({
          flex: Math.max(geometry.bodyRatio, 0.001),
          child: Container({
            width: Infinity,
            decoration: new BoxDecoration({
              color: fillColor,
              border: Border.all({ color: strokeColor, width: isHovered ? 2 : 1 }),
            }),
          }),
        }),
        Expanded({
          flex: Math.max(geometry.bottomWickRatio, 0.001),
          child: Container({
            width: isHovered ? 2 : 1,
            color: strokeColor,
          }),
        }),
      ],
    }),
  });
}
