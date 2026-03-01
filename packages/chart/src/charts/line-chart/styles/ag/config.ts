import { type AgBaseConfig, defaultAgBaseConfig } from "@shared/styles/ag";

export type AgLineChartConfig = AgBaseConfig & {
  line: {
    strokeWidth: number;
    spline: boolean;
  };
};

export const defaultAgConfig: AgLineChartConfig = {
  ...defaultAgBaseConfig,
  line: { strokeWidth: 2, spline: false },
};
