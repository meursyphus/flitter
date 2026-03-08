import type { Widget } from "flitter-core";
import {
  Container,
  Flexible,
  Flex,
  Axis,
  Alignment,
  FractionallySizedBox,
  BoxDecoration,
  Border,
  BoxShadow,
} from "flitter-core";
import HeadlessHistogramChart from "../_flitter/headless/histogram-chart";
import type { HistogramChartCustom, HistogramChartData } from "./types";
import * as Cartesian from "../_flitter/shared/cartesian/index";
import { HoverTooltip } from "../_flitter/shared/interaction/hover-tooltip";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "../ag-base/index";

export type {
  HistogramChartContext,
  HistogramBin,
  HistogramChartData,
  HistogramChartScale,
  HistogramChartCustom,
} from "./types";
export { HistogramChartController } from "./types";

const baseDefaults: Partial<HistogramChartCustom> = {
  layout: ({ title, plot }) => Cartesian.Layout({ title, legends: [], plot }),
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
    const color = defaultAgCartesianBaseConfig.colors.fills[0];

    return new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label: `${binMin} - ${binMax}`,
        items: { legend: "Count", color, value: count },
        config: defaultAgCartesianBaseConfig,
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
  xAxis: ({ line, labels, tick }) => Cartesian.XAxis({ line, labels, tick }, { type: "label" }),
  yAxis: ({ line, labels, tick }) => Cartesian.YAxis({ line, labels, tick }, { type: "value" }),
  xAxisLabel: (args) => Cartesian.XAxisLabel(args),
  yAxisLabel: (args) => Cartesian.YAxisLabel(args),
  xAxisTick: () => Cartesian.XAxisTick(undefined),
  yAxisTick: () => Cartesian.YAxisTick(undefined),
  xAxisLine: () => Cartesian.XAxisLine(),
  yAxisLine: () => Cartesian.YAxisLine(),
  grid: ({ xLine, yLine }, ctx) =>
    Cartesian.Grid({
      xLine,
      yLine,
      x: ctx.bins.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: () => Cartesian.GridXLine(),
  gridYLine: () => Cartesian.GridYLine(),
  axisCorner: () => Cartesian.AxisCorner(),
  title: () => Cartesian.Title(),
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export default function HistogramChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<HistogramChartCustom<TConfig>>;
  data: HistogramChartData;
  config?: TConfig;
}): Widget {
  return HeadlessHistogramChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as HistogramChartCustom<TConfig>,
  });
}
