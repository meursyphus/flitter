import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgHistogramSharedConfig = Pick<
  AgCartesianBaseConfig,
  "background" | "colors" | "font" | "title" | "subtitle" | "legend" | "padding" | "tooltip" | "axis" | "grid"
>;

export type HistogramChartConfig = AgHistogramSharedConfig & {
  histogram: {
    barGap: number;
  };
};

export const defaultAgConfig: HistogramChartConfig = {
  background: defaultAgCartesianBaseConfig.background,
  colors: defaultAgCartesianBaseConfig.colors,
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  legend: { ...defaultAgCartesianBaseConfig.legend, visible: false },
  padding: defaultAgCartesianBaseConfig.padding,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  axis: defaultAgCartesianBaseConfig.axis,
  grid: defaultAgCartesianBaseConfig.grid,
  histogram: {
    barGap: 0,
  },
};
