import { type AgBaseConfig, defaultAgBaseConfig } from "@shared/styles/ag";

export type AgStackedAreaChartConfig = AgBaseConfig & {
  area: {
    opacity: number;
    strokeWidth: number;
    spline: boolean;
  };
};

export const defaultAgConfig: AgStackedAreaChartConfig = {
  ...defaultAgBaseConfig,
  area: { opacity: 0.7, strokeWidth: 2, spline: false },
};
