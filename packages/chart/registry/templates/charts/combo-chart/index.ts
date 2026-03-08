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
  BoxDecoration,
  Border,
  BoxShadow,
} from "flitter-core";
import HeadlessComboChart from "@headless/combo-chart";
import type { ComboChartCustom, ComboChartData } from "./types";
import * as Cartesian from "@shared/cartesian";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { agLegend, agTooltipContent, defaultAgCartesianBaseConfig } from "@styles/ag";

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
  bar: ({ value, label, yAxisId }, ctx) => {
    const scale = getAxisScale(ctx, yAxisId);
    const ratio =
      scale && scale.max > scale.min ? (value - scale.min) / (scale.max - scale.min) : 0;
    const color = defaultAgCartesianBaseConfig.colors.fills[0];

    return new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label,
        items: { legend: yAxisId, color, value },
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
                    ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                    : undefined,
                boxShadow: hovered
                  ? [new BoxShadow({ color: "rgba(0,0,0,0.16)", blurRadius: 10 })]
                  : undefined,
              }),
            }),
          }),
        }),
    });
  },
  line: ({ points }) =>
    Row({
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: points.map((point) => Expanded({ child: point })),
    }),
  linePoint: ({ value, label, legend, datasetIndex, yAxisId }, ctx) => {
    const scale = getAxisScale(ctx, yAxisId);
    const ratio =
      scale && scale.max > scale.min ? (value - scale.min) / (scale.max - scale.min) : 0;
    const color =
      defaultAgCartesianBaseConfig.colors.strokes[
        datasetIndex % defaultAgCartesianBaseConfig.colors.strokes.length
      ];

    return new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label,
        items: { legend, color, value },
        config: defaultAgCartesianBaseConfig,
      }),
      renderChild: (hovered) =>
        Container({
          width: Infinity,
          height: Infinity,
          child: Align({
            alignment: Alignment.bottomCenter,
            child: FractionallySizedBox({
              heightFactor: Math.max(0, Math.min(1, ratio)),
              alignment: Alignment.topCenter,
              child: Container({
                width: hovered ? 12 : 10,
                height: hovered ? 12 : 10,
                decoration: new BoxDecoration({
                  color,
                  shape: "circle",
                  border:
                    hovered
                      ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                      : undefined,
                  boxShadow: hovered
                    ? [new BoxShadow({ color: "rgba(0,0,0,0.16)", blurRadius: 10 })]
                    : undefined,
                }),
              }),
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
  legend: (args, ctx) =>
    agLegend(args, {
      config: defaultAgCartesianBaseConfig,
      isSeriesVisible: ctx.isSeriesVisible.bind(ctx),
      toggleSeries: ctx.toggleSeries.bind(ctx),
    }),
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
