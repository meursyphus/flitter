import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgComboSharedConfig = Pick<
  AgCartesianBaseConfig,
  "colors" | "font" | "title" | "subtitle" | "tooltip"
>;

export type ComboChartConfig = AgComboSharedConfig & {
  combo: {
    barGap: number;
    areaOpacity: number;
    lineWidth: number;
    pointSize: number;
  };
};

export const defaultAgConfig: ComboChartConfig = {
  colors: defaultAgCartesianBaseConfig.colors,
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  combo: {
    barGap: 6,
    areaOpacity: 0.18,
    lineWidth: 2,
    pointSize: 10,
  },
};
