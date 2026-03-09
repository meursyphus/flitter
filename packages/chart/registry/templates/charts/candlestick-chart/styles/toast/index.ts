import {
  Alignment,
  AnimatedScale,
  Axis,
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  Column,
  CrossAxisAlignment,
  Expanded,
  Flex,
  Flexible,
  FractionallySizedBox,
  MainAxisAlignment,
  Opacity,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { CandlestickChartCustom } from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Cartesian from "@shared/cartesian";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { AnimatedDataView } from "@styles/toast/cartesian/animated-data-view";
import { cartesian, toastLegend, toastTitle, tooltipContent } from "@styles/toast";

export { type CandlestickChartConfig } from "./config";

const toastCustom: Partial<CandlestickChartCustom<CandlestickChartConfig>> = {
  layout: ({ title, legends, plot }, ctx) =>
    cartesian.toastLayout(
      {
        title,
        legends: ctx.data.datasets.length > 1 ? legends : [],
        plot,
      },
      ctx as any,
    ),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  dataView: ({ candlestickGroups }, ctx) => {
    const child = Container({
      width: Infinity,
      height: Infinity,
      child: Flex({
        direction: Axis.horizontal,
        children: candlestickGroups.map(({ candlesticks }) =>
          Flexible({
            flex: 1,
            child: Flex({
              direction: Axis.horizontal,
              children: candlesticks.map((candlestick) =>
                Flexible({
                  flex: 1,
                  child: candlestick,
                }),
              ),
            }),
          }),
        ),
      }),
    });

    const scale = ctx.scale;
    const baselineRatio =
      scale ? Math.max(0, Math.min(1, (0 - scale.min) / (scale.max - scale.min))) : 0;

    return new AnimatedDataView({
      child,
      duration: ctx.config.animation.duration,
      isVertical: true,
      baselineRatio,
    });
  },
  candlestick: ({ open, high, low, close, label, index, legend }, ctx) => {
    const scale = ctx.scale;
    if (scale == null) return SizedBox.shrink();

    const total = scale.max - scale.min || 1;
    const isUp = close >= open;
    const color = isUp ? ctx.config.candlestick.upColor : ctx.config.candlestick.downColor;
    const wickColor = ctx.config.candlestick.wickColor;
    const bodyTop = Math.max(open, close);
    const bodyBottom = Math.min(open, close);
    const topWickRatio = (high - bodyTop) / total;
    const bodyRatio = (bodyTop - bodyBottom) / total || 0.002;
    const bottomWickRatio = (bodyBottom - low) / total;
    const belowRatio = (low - scale.min) / total;
    const aboveRatio = (scale.max - high) / total;
    const hoveredCandlestick = ctx.hoveredCandlestick;
    const isHovered = ctx.isCandlestickHovered(index, legend);
    const activeOpacity = hoveredCandlestick == null || isHovered ? 1 : 0.28;

    return new HoverTooltip({
      position: "topCenter",
      tooltip: tooltipContent({
        label,
        items: [
          { legend: `${legend} open`, color, value: open },
          { legend: `${legend} high`, color: wickColor, value: high },
          { legend: `${legend} low`, color: wickColor, value: low },
          { legend: `${legend} close`, color, value: close },
        ],
        config: ctx.config as any,
      }),
      onMouseEnter: () => ctx.hoverCandlestick(index, legend),
      onMouseLeave: () => ctx.unhoverCandlestick(),
      renderChild: (hovered) =>
        Opacity({
          opacity: activeOpacity,
          child: Container({
            width: Infinity,
            height: Infinity,
            alignment: Alignment.center,
            child: FractionallySizedBox({
              widthFactor: 0.66,
              child: AnimatedScale({
                duration: ctx.config.animation.duration,
                scale: hovered ? 1.04 : 1,
                alignment: Alignment.center,
                child: Container({
                  decoration:
                    hovered
                      ? new BoxDecoration({
                          border: Border.all({ color: "white", width: 2, strokeAlign: 1 }),
                          boxShadow: [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })],
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
                                width: hovered ? 2 : 1,
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
                                width: hovered ? 2 : 1,
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
          }),
        }),
    });
  },
  xAxis: ({ line, labels, tick }, ctx) =>
    cartesian.toastXAxis({ line, labels, tick } as any, { type: "label" }, ctx as any),
  yAxis: ({ line, labels, tick }, ctx) =>
    cartesian.toastYAxis({ line, labels, tick } as any, { type: "value" }, ctx as any),
  xAxisLabel: cartesian.toastXAxisLabel,
  yAxisLabel: cartesian.toastYAxisLabel,
  xAxisTick: cartesian.toastXAxisTick,
  yAxisTick: cartesian.toastYAxisTick,
  xAxisLine: cartesian.toastXAxisLine,
  yAxisLine: cartesian.toastYAxisLine,
  grid: ({ xLine, yLine }, ctx) =>
    Cartesian.Grid({
      xLine,
      yLine,
      x: ctx.data.labels.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.toastGridXLine,
  gridYLine: cartesian.toastGridYLine,
  axisCorner: cartesian.toastAxisCorner,
  legend: ({ name, index }, ctx) =>
    toastLegend(
      { name, index },
      {
        config: ctx.config as any,
        isSeriesVisible: ctx.isSeriesVisible.bind(ctx),
        toggleSeries: ctx.toggleSeries.bind(ctx),
      },
      { markerShape: "circle" },
    ),
  title: toastTitle as any,
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<CandlestickChartConfig>): CandlestickChartConfig =>
    deepMerge(defaultToastConfig, config),
};
