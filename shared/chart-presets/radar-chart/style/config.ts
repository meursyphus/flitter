import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgRadarSharedConfig = Pick<
  AgCartesianBaseConfig,
  "background" | "colors" | "font" | "title" | "subtitle" | "legend" | "padding" | "tooltip" | "axis"
>;

export type AgRadarChartConfig = AgRadarSharedConfig & {
  radar: {
    fillOpacity: number;
    strokeWidth: number;
    gridColor: string;
    gridWidth: number;
    axisColor: string;
    axisWidth: number;
    labelMargin: number;
  };
};

export const defaultAgConfig: AgRadarChartConfig = {
  background: defaultAgCartesianBaseConfig.background,
  colors: defaultAgCartesianBaseConfig.colors,
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  legend: { ...defaultAgCartesianBaseConfig.legend, position: "right-top" },
  padding: { ...defaultAgCartesianBaseConfig.padding, top: 36 },
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  axis: defaultAgCartesianBaseConfig.axis,
  radar: {
    fillOpacity: 0.3,
    strokeWidth: 2,
    gridColor: defaultAgCartesianBaseConfig.grid.color,
    gridWidth: defaultAgCartesianBaseConfig.grid.thickness,
    axisColor: defaultAgCartesianBaseConfig.axis.color,
    axisWidth: defaultAgCartesianBaseConfig.axis.thickness,
    labelMargin: 24,
  },
};
