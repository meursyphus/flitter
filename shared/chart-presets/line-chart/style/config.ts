import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

export type AgLineChartConfig = AgCartesianBaseConfig & {
  line: {
    strokeWidth: number;
    spline: boolean;
  };
};

export const defaultAgConfig: AgLineChartConfig = {
  ...defaultAgCartesianBaseConfig,
  axis: {
    ...defaultAgCartesianBaseConfig.axis,
    yLine: { visible: false },
  },
  line: { strokeWidth: 2, spline: false },
};
