import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgSankeySharedConfig = Pick<
  AgCartesianBaseConfig,
  "font" | "title" | "tooltip"
>;

export type SankeyChartConfig = AgSankeySharedConfig;

export const defaultAgConfig: SankeyChartConfig = {
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
};
