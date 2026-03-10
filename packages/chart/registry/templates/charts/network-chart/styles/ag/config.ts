import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgNetworkSharedConfig = Pick<
  AgCartesianBaseConfig,
  "font" | "title" | "tooltip" | "colors"
>;

export type NetworkChartConfig = AgNetworkSharedConfig & {
  network: {
    edgeColor: string;
    edgeWidth: number;
    labelOffset: number;
  };
};

export const defaultAgConfig: NetworkChartConfig = {
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  colors: defaultAgCartesianBaseConfig.colors,
  network: {
    edgeColor: "#b8c0cc",
    edgeWidth: 1.5,
    labelOffset: 18,
  },
};
