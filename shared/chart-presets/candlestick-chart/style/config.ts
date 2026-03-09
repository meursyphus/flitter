import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgCandlestickSharedConfig = Pick<
  AgCartesianBaseConfig,
  "background" | "colors" | "font" | "title" | "subtitle" | "legend" | "padding" | "tooltip" | "axis" | "grid"
>;

export type CandlestickChartConfig = AgCandlestickSharedConfig & {
  candlestick: {
    upColor: string;
    downColor: string;
    wickColor: string;
  };
};

export const defaultAgConfig: CandlestickChartConfig = {
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
  candlestick: {
    upColor: "#4CAF50",
    downColor: "#F44336",
    wickColor: "#333333",
  },
};
