import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgPieSharedConfig = Pick<
  AgCartesianBaseConfig,
  "background" | "colors" | "font" | "title" | "subtitle" | "legend" | "padding" | "tooltip"
>;

export type AgPieChartConfig = AgPieSharedConfig & {
  pie: {
    strokeColor: string;
    strokeWidth: number;
    innerRadiusRatio: number;
  };
};

export const defaultAgConfig: AgPieChartConfig = {
  background: defaultAgCartesianBaseConfig.background,
  colors: defaultAgCartesianBaseConfig.colors,
  font: defaultAgCartesianBaseConfig.font,
  title: {
    ...defaultAgCartesianBaseConfig.title,
    alignment: "center" as const,
  },
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  legend: { ...defaultAgCartesianBaseConfig.legend, visible: false, position: "right-top" },
  padding: defaultAgCartesianBaseConfig.padding,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  pie: {
    strokeColor: "white",
    strokeWidth: 2,
    innerRadiusRatio: 0,
  },
};
