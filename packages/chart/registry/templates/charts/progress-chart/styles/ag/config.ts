import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgProgressSharedConfig = Pick<
  AgCartesianBaseConfig,
  "font" | "title" | "subtitle" | "tooltip"
>;

export type ProgressChartConfig = AgProgressSharedConfig & {
  progress: {
    trackColor: string;
    trackHeight: number;
    cornerRadius: number;
    labelColor: string;
  };
};

export const defaultAgConfig: ProgressChartConfig = {
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  progress: {
    trackColor: "#f2f4f6",
    trackHeight: 18,
    cornerRadius: 8,
    labelColor: "#333333",
  },
};
