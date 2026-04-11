import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_shared/ag/index";

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
