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
  grid: {
    ...defaultAgCartesianBaseConfig.grid,
    xLine: { visible: true },
    dash: [4, 4],
  },
  candlestick: {
    upColor: "rgba(255,255,255,0.98)",
    downColor: "rgba(91,132,196,0.35)",
    wickColor: "#5b84c4",
  },
};
