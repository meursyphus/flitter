import { type AgBaseConfig, defaultAgBaseConfig } from "@shared/styles/ag";

export type AgAreaChartConfig = AgBaseConfig & {
  area: {
    strokeWidth: number;
    opacity: number;
    spline: boolean;
  };
};

export const defaultAgConfig: AgAreaChartConfig = {
  ...defaultAgBaseConfig,
  axis: {
    ...defaultAgBaseConfig.axis,
    yLine: { visible: false },
  },
  area: { strokeWidth: 2, opacity: 0.3, spline: false },
};
