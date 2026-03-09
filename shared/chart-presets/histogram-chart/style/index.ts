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
import type { HistogramChartCustom } from "flitter-ui/chart";
import type { HistogramChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { agTitle, agTooltipContent, cartesian } from "../../_styles/ag/index";
import { HoverTooltip } from "flitter-ui/chart";

export { type HistogramChartConfig } from "./config";

const agCustom: Partial<HistogramChartCustom<HistogramChartConfig>> = {
  layout: ({ title, plot }, ctx) =>
    cartesian.agLayout({ title, legends: [], plot }, ctx as any),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  dataView: ({ bars }) =>
    Container({
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
    }),
  bar: ({ binMin, binMax, count }, ctx) => {
    const scale = ctx.scale;
    const ratio =
      scale && scale.max > scale.min ? (count - scale.min) / (scale.max - scale.min) : 0;
    const color = ctx.config.colors.fills[0];

    return new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
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
                  ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 12 })]
                  : undefined,
              }),
            }),
          }),
        }),
    });
  },
  xAxis: ({ line, labels, tick }, ctx) => cartesian.agXAxis({ line, labels, tick } as any, { type: "label" }, ctx as any),
  yAxis: ({ line, labels, tick }, ctx) => cartesian.agYAxis({ line, labels, tick } as any, { type: "value" }, ctx as any),
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
      x: ctx.bins.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  axisCorner: cartesian.agAxisCorner,
  title: agTitle as any,
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<HistogramChartConfig>): HistogramChartConfig =>
    deepMerge(defaultAgConfig, config),
};
