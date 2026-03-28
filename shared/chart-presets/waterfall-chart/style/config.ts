import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgWaterfallSharedConfig = Pick<
  AgCartesianBaseConfig,
  "background" | "colors" | "font" | "title" | "subtitle" | "legend" | "padding" | "tooltip" | "axis" | "grid"
>;

export type WaterfallChartConfig = AgWaterfallSharedConfig & {
  waterfall: {
    barGap: number;
    dataLabel: {
      visible: boolean;
      fontSize: number;
      color: string;
      fontFamily?: string;
    };
  };
};

const semanticAgColors = {
  fills: ["#F3A261", "#5C8FD4", "#999999"],
  strokes: ["#F3A261", "#5C8FD4", "#999999"],
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
    dataLabel: {
      visible: true,
      fontSize: 11,
      color: "#585858",
    },
  },
};
