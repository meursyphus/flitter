import {
  Alignment,
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
import type { CandlestickChartCustom } from "flitter-ui/chart";
import type { CandlestickChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { HoverTooltip } from "flitter-ui/chart";
import { agLegend, agTitle, agTooltipContent, cartesian } from "../../_styles/ag/index";

export { type CandlestickChartConfig } from "./config";

const agCustom: Partial<CandlestickChartCustom<CandlestickChartConfig>> = {
  layout: ({ title, legends, plot }, ctx) =>
    cartesian.agLayout(
      {
        title,
        legends: ctx.data.datasets.length > 1 ? legends : [],
        plot,
      },
      ctx as any,
    ),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  dataView: ({ candlestickGroups }) =>
    Container({
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
    }),
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
    const activeOpacity = hoveredCandlestick == null || isHovered ? 1 : 0.3;

    return new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
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
              widthFactor: hovered ? 0.72 : 0.6,
              child: Container({
                decoration:
                  hovered
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
    });
  },
  xAxis: ({ line, labels, tick }, ctx) =>
    cartesian.agXAxis({ line, labels, tick } as any, { type: "label" }, ctx as any),
  yAxis: ({ line, labels, tick }, ctx) =>
    cartesian.agYAxis({ line, labels, tick } as any, { type: "value" }, ctx as any),
  xAxisLabel: cartesian.agXAxisLabel,
  yAxisLabel: cartesian.agYAxisLabel,
  xAxisTick: cartesian.agXAxisTick,
  yAxisTick: cartesian.agYAxisTick,
  xAxisLine: cartesian.agXAxisLine,
  yAxisLine: cartesian.agYAxisLine,
  grid: ({ xLine, yLine }, ctx) =>
    Cartesian.Grid({
      xLine,
      yLine,
      x: ctx.data.labels.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  axisCorner: cartesian.agAxisCorner,
  legend: ({ name, index }, ctx) =>
    agLegend(
      { name, index },
      {
        config: ctx.config as any,
        isSeriesVisible: ctx.isSeriesVisible.bind(ctx),
        toggleSeries: ctx.toggleSeries.bind(ctx),
      },
    ),
  title: agTitle as any,
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<CandlestickChartConfig>): CandlestickChartConfig =>
    deepMerge(defaultAgConfig, config),
};
