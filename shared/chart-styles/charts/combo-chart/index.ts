import type { Widget } from "flitter-core";
import {
  Container,
  Stack,
  Align,
  Alignment,
  FractionallySizedBox,
  Row,
  Expanded,
  MainAxisAlignment,
} from "flitter-core";
import HeadlessComboChart from "@headless/combo-chart";
import type { ComboChartCustom, ComboChartData } from "./types";
import * as Cartesian from "@shared/cartesian";

export type {
  ComboChartContext,
  ComboDataset,
  ComboChartData,
  ComboAxisScale,
  ComboChartScale,
  ComboChartCustom,
} from "./types";
export { ComboChartController } from "./types";

function getAxisScale(ctx: any, axisId: "primary" | "secondary") {
  return axisId === "secondary" ? ctx.scale?.secondary ?? ctx.scale?.primary : ctx.scale?.primary;
}

const baseDefaults: Partial<ComboChartCustom> = {
  layout: ({ title, legends, plot }) => Cartesian.Layout({ title, legends, plot }),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  dataView: ({ areas, bars, lines }) =>
    Stack({
      children: [...areas, ...bars, ...lines],
    }),
  bar: ({ value, yAxisId }, ctx) => {
    const scale = getAxisScale(ctx, yAxisId);
    const ratio =
      scale && scale.max > scale.min ? (value - scale.min) / (scale.max - scale.min) : 0;

    return Container({
      width: Infinity,
      height: Infinity,
      alignment: Alignment.bottomCenter,
      child: FractionallySizedBox({
        heightFactor: Math.max(0, Math.min(1, ratio)),
        child: Container({
          width: Infinity,
          height: Infinity,
          color: "#00a9ff",
        }),
      }),
    });
  },
  line: ({ points }) =>
    Row({
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: points.map((point) => Expanded({ child: point })),
    }),
  linePoint: ({ value, yAxisId }, ctx) => {
    const scale = getAxisScale(ctx, yAxisId);
    const ratio =
      scale && scale.max > scale.min ? (value - scale.min) / (scale.max - scale.min) : 0;

    return Container({
      width: Infinity,
      height: Infinity,
      child: Align({
        alignment: Alignment.bottomCenter,
        child: FractionallySizedBox({
          heightFactor: Math.max(0, Math.min(1, ratio)),
          alignment: Alignment.topCenter,
          child: Container({
            width: 10,
            height: 10,
            color: "#ff5a46",
          }),
        }),
      }),
    });
  },
  area: ({ points }) =>
    Row({
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: points.map((point) => Expanded({ child: point })),
    }),
  xAxis: ({ line, labels, tick }) => Cartesian.XAxis({ line, labels, tick }, { type: "label" }),
  yAxis: ({ line, labels, tick }) => Cartesian.YAxis({ line, labels, tick }, { type: "value" }),
  yAxis2: ({ labels, tick }) => Cartesian.YAxis({ line: Container({ width: 0, height: 0 }), labels, tick }, { type: "value" }),
  xAxisLabel: (args) => Cartesian.XAxisLabel(args),
  yAxisLabel: (args) => Cartesian.YAxisLabel(args),
  yAxis2Label: (args) => Cartesian.YAxisLabel(args),
  xAxisTick: () => Cartesian.XAxisTick(undefined),
  yAxisTick: () => Cartesian.YAxisTick(undefined),
  xAxisLine: () => Cartesian.XAxisLine(),
  yAxisLine: () => Cartesian.YAxisLine(),
  grid: ({ xLine, yLine }, ctx) =>
    Cartesian.Grid({
      xLine,
      yLine,
      x: ctx.data.labels.length,
      y: ctx.scale ? (ctx.scale.primary.max - ctx.scale.primary.min) / ctx.scale.primary.step : 0,
    }),
  gridXLine: () => Cartesian.GridXLine(),
  gridYLine: () => Cartesian.GridYLine(),
  axisCorner: () => Cartesian.AxisCorner(),
  legend: ({ name }) => Container({ width: 0, height: 0, child: undefined }),
  title: () => Cartesian.Title(),
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export default function ComboChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<ComboChartCustom<TConfig>>;
  data: ComboChartData;
  config?: TConfig;
}): Widget {
  return HeadlessComboChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as ComboChartCustom<TConfig>,
  });
}
