import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgWaterfallSharedConfig = Pick<
  AgCartesianBaseConfig,
  "background" | "colors" | "font" | "title" | "subtitle" | "legend" | "padding" | "tooltip" | "axis" | "grid"
>;

export type WaterfallChartConfig = AgWaterfallSharedConfig & {
  waterfall: {
    barGap: number;
  };
};

const semanticAgColors = {
  fills: ["#5A8FD3", "#F28B44", "#51A95B"],
  strokes: ["#5A8FD3", "#F28B44", "#51A95B"],
};

export const defaultAgConfig: WaterfallChartConfig = {
  background: defaultAgCartesianBaseConfig.background,
  colors: semanticAgColors,
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  legend: defaultAgCartesianBaseConfig.legend,
  padding: defaultAgCartesianBaseConfig.padding,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  axis: defaultAgCartesianBaseConfig.axis,
  grid: defaultAgCartesianBaseConfig.grid,
  waterfall: {
    barGap: 8,
  },
};
