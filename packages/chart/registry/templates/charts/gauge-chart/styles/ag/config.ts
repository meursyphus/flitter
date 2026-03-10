import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgGaugeSharedConfig = Pick<
  AgCartesianBaseConfig,
  "font" | "title" | "subtitle" | "tooltip"
>;

export type GaugeChartConfig = AgGaugeSharedConfig & {
  gauge: {
    valueColor: string;
    trackColor: string;
    tickColor: string;
    needleColor: string;
    showNeedle: boolean;
    tickCount: number;
  };
};

export const defaultAgConfig: GaugeChartConfig = {
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  gauge: {
    valueColor: "#3c4043",
    trackColor: "#dde3ea",
    tickColor: "#6b7280",
    needleColor: "#3c4043",
    showNeedle: false,
    tickCount: 6,
  },
};
