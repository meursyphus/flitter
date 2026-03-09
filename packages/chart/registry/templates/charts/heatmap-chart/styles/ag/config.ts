import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgHeatmapSharedConfig = Pick<
  AgCartesianBaseConfig,
  "background" | "colors" | "font" | "title" | "subtitle" | "legend" | "padding" | "tooltip" | "axis"
>;

export type AgHeatmapChartConfig = AgHeatmapSharedConfig & {
  heatmap: {
    colorRange: [string, string, string];
    segment: { gap: number };
  };
};

export const defaultAgConfig: AgHeatmapChartConfig = {
  background: defaultAgCartesianBaseConfig.background,
  colors: defaultAgCartesianBaseConfig.colors,
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  legend: { ...defaultAgCartesianBaseConfig.legend, position: "bottom" },
  padding: { top: 30, right: 20, bottom: 20, left: 60 },
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  axis: {
    ...defaultAgCartesianBaseConfig.axis,
    color: defaultAgCartesianBaseConfig.grid.color,
  },
  heatmap: {
    colorRange: ["#F8E59A", "#F1993A", "#B42318"],
    segment: { gap: 0 },
  },
};
