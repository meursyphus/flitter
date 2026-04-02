import {
  Alignment,
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  Column,
  CrossAxisAlignment,
  Expanded,
  FractionallySizedBox,
  MainAxisAlignment,
  Opacity,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { CandlestickChartContext } from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "../config";

export function agCandlestick(
  {
    open,
    high,
    low,
    close,
    index,
    legend,
    isHovered,
  }: {
    open: number;
    high: number;
    low: number;
    close: number;
    label: string;
    index: number;
    legend: string;
    datasetIndex: number;
    isHovered: boolean;
  },
  context: CandlestickChartContext<CandlestickChartConfig>,
): Widget {
  const scale = context.scale;
  if (scale == null) return SizedBox.shrink();

  const total = scale.max - scale.min || 1;
  const isUp = close >= open;
  const color = isUp ? context.config.candlestick.upColor : context.config.candlestick.downColor;
  const wickColor = context.config.candlestick.wickColor;
  const bodyTop = Math.max(open, close);
  const bodyBottom = Math.min(open, close);
  const topWickRatio = (high - bodyTop) / total;
  const bodyRatio = (bodyTop - bodyBottom) / total || 0.002;
  const bottomWickRatio = (bodyBottom - low) / total;
  const belowRatio = (low - scale.min) / total;
  const aboveRatio = (scale.max - high) / total;
  const hoveredCandlestick = context.hoveredCandlestick;
  const activeOpacity = hoveredCandlestick == null || isHovered ? 1 : 0.3;

  const candlestickWidget = Opacity({
    opacity: activeOpacity,
    child: Container({
      width: Infinity,
      height: Infinity,
      alignment: Alignment.center,
      child: FractionallySizedBox({
        widthFactor: isHovered ? 0.72 : 0.6,
        child: Container({
          decoration:
            isHovered
              ? new BoxDecoration({
                  border: Border.all({ color: "rgba(255,255,255,0.35)", width: 1 }),
                  boxShadow: [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 10 })],
                })
              : undefined,
          child: Column({
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              ...(aboveRatio > 0
                ? [Expanded({ flex: Math.max(aboveRatio, 0.001), child: Container({}) })]
                : []),
              ...(topWickRatio > 0
                ? [
                    Expanded({
                      flex: Math.max(topWickRatio, 0.001),
                      child: Container({
                        width: isHovered ? 2 : 1,
                        color: wickColor,
                      }),
                    }),
                  ]
                : []),
              Expanded({
                flex: Math.max(bodyRatio, 0.001),
                child: Container({
                  width: Infinity,
                  color,
                }),
              }),
              ...(bottomWickRatio > 0
                ? [
                    Expanded({
                      flex: Math.max(bottomWickRatio, 0.001),
                      child: Container({
                        width: isHovered ? 2 : 1,
                        color: wickColor,
                      }),
                    }),
                  ]
                : []),
              ...(belowRatio > 0
                ? [Expanded({ flex: Math.max(belowRatio, 0.001), child: Container({}) })]
                : []),
            ],
          }),
        }),
      }),
    }),
  });

  return candlestickWidget;
}
