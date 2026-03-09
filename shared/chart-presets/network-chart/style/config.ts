import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgNetworkSharedConfig = Pick<
  AgCartesianBaseConfig,
  "font" | "title" | "tooltip" | "colors"
>;

export type NetworkChartConfig = AgNetworkSharedConfig;

export const defaultAgConfig: NetworkChartConfig = {
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  colors: defaultAgCartesianBaseConfig.colors,
};
