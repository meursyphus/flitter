import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@shared/styles/ag";

export type AgAreaChartConfig = AgCartesianBaseConfig & {
  area: {
    strokeWidth: number;
    opacity: number;
    spline: boolean;
  };
};

export const defaultAgConfig: AgAreaChartConfig = {
  ...defaultAgCartesianBaseConfig,
  axis: {
    ...defaultAgCartesianBaseConfig.axis,
    yLine: { visible: false },
  },
  area: { strokeWidth: 2, opacity: 0.3, spline: false },
};
