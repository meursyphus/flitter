import {
  Alignment,
  Axis,
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  Flex,
  Flexible,
  FractionallySizedBox,
  type Widget,
} from "flitter-core";
import type { HistogramChartCustom } from "@headless/histogram-chart/types";
import type { HistogramChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Cartesian from "@shared/cartesian";
import { toastTitle, tooltipContent, cartesian } from "@styles/toast";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { AnimatedDataView } from "@styles/toast/cartesian/animated-data-view";

export { type HistogramChartConfig } from "./config";

const toastCustom: Partial<HistogramChartCustom<HistogramChartConfig>> = {
  layout: ({ title, plot }, ctx) =>
    cartesian.toastLayout({ title, legends: [], plot }, ctx as any),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  dataView: ({ bars }, ctx) => {
    const child = Container({
      width: Infinity,
      height: Infinity,
      child: Flex({
        direction: Axis.horizontal,
        children: bars.map((bar) =>
          Flexible({
            flex: 1,
            child: bar,
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
  bar: ({ binMin, binMax, count }, ctx) => {
    const scale = ctx.scale;
    const ratio =
      scale && scale.max > scale.min ? (count - scale.min) / (scale.max - scale.min) : 0;
    const color = ctx.config.colors[0];

    return new HoverTooltip({
      position: "topCenter",
      tooltip: tooltipContent({
        label: `${binMin} - ${binMax}`,
        items: { legend: "Count", color, value: count },
        config: ctx.config as any,
      }),
      renderChild: (hovered) =>
        Container({
          width: Infinity,
          height: Infinity,
          alignment: Alignment.bottomCenter,
          child: FractionallySizedBox({
            heightFactor: Math.max(0, Math.min(1, ratio)),
            child: Container({
              width: Infinity,
              height: Infinity,
              decoration: new BoxDecoration({
                color,
                border:
                  hovered
                    ? Border.all({ color: "white", width: 3, strokeAlign: 1 })
                    : undefined,
                boxShadow: hovered
                  ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })]
                  : undefined,
              }),
            }),
          }),
        }),
    });
  },
  xAxis: ({ line, labels, tick }, ctx) => cartesian.toastXAxis({ line, labels, tick } as any, { type: "label" }, ctx as any),
  yAxis: ({ line, labels, tick }, ctx) => cartesian.toastYAxis({ line, labels, tick } as any, { type: "value" }, ctx as any),
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
      x: ctx.bins.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.toastGridXLine,
  gridYLine: cartesian.toastGridYLine,
  axisCorner: cartesian.toastAxisCorner,
  title: toastTitle as any,
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<HistogramChartConfig>): HistogramChartConfig =>
    deepMerge(defaultToastConfig, config),
};
