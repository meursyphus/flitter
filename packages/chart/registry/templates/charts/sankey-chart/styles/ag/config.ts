import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgSankeySharedConfig = Pick<
  AgCartesianBaseConfig,
  "colors" | "font" | "title" | "tooltip"
>;

export type SankeyChartConfig = AgSankeySharedConfig;

export const defaultAgConfig: SankeyChartConfig = {
  colors: defaultAgCartesianBaseConfig.colors,
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
};
