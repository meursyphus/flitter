import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

export type AgStackedBarChartConfig = AgCartesianBaseConfig & {
  bar: {
    gap: number;
  };
};

export const defaultAgConfig: AgStackedBarChartConfig = {
  ...defaultAgCartesianBaseConfig,
  bar: { gap: 0 },
};
