import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgGaugeSharedConfig = Pick<
  AgCartesianBaseConfig,
  "font" | "title" | "subtitle" | "tooltip"
>;

export type GaugeChartConfig = AgGaugeSharedConfig & {
  gauge: {
    valueColor: string;
  };
};

export const defaultAgConfig: GaugeChartConfig = {
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  gauge: {
    valueColor: "#333333",
  },
};
