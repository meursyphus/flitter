import { type AgBaseConfig, defaultAgBaseConfig } from "@shared/styles/ag";

export type AgStackedBarChartConfig = AgBaseConfig & {
  bar: {
    gap: number;
  };
};

export const defaultAgConfig: AgStackedBarChartConfig = {
  ...defaultAgBaseConfig,
  bar: { gap: 0 },
};
