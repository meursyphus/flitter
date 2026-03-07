import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

export type AgStackedAreaChartConfig = AgCartesianBaseConfig & {
  area: {
    opacity: number;
    strokeWidth: number;
    spline: boolean;
  };
};

export const defaultAgConfig: AgStackedAreaChartConfig = {
  ...defaultAgCartesianBaseConfig,
  axis: {
    ...defaultAgCartesianBaseConfig.axis,
    yLine: { visible: false },
  },
  area: { opacity: 0.7, strokeWidth: 2, spline: false },
};
