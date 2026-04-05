import {
  Alignment,
  Container,
  FractionallySizedBox,
  Stack,
  StackFit,
  type Widget,
} from "flitter-core";
import type { CandlestickChartCustom } from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "../config";

export function agCandlestickBox(
  ...[{ candlestick, geometry, isHovered }]: Parameters<
    CandlestickChartCustom<CandlestickChartConfig>["candlestickBox"]
  >
): Widget {
  return Stack({
    fit: StackFit.expand,
    children: [
      ...(isHovered
        ? [
            Container({
              color: "rgba(91,132,196,0.08)",
            }),
          ]
        : []),
      FractionallySizedBox({
        alignment: geometry.boxAlignment,
        heightFactor: geometry.boxHeightFactor,
        child: Container({
          alignment: Alignment.center,
          child: FractionallySizedBox({
            widthFactor: isHovered ? 0.86 : 0.72,
            child: candlestick,
          }),
        }),
      }),
    ],
  });
}
