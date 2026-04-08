import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgSankeySharedConfig = Pick<
  AgCartesianBaseConfig,
  "colors" | "font" | "title" | "subtitle" | "tooltip"
>;

export type SankeyChartConfig = AgSankeySharedConfig;

export const defaultAgConfig: SankeyChartConfig = {
  colors: defaultAgCartesianBaseConfig.colors,
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
};
