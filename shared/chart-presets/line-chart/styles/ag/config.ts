import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../../ag-base/index";

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
