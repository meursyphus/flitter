import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

export type AgScatterChartConfig = AgCartesianBaseConfig & {
  scatter: {
    size: number;
    strokeWidth: number;
  };
};

export const defaultAgConfig: AgScatterChartConfig = {
  ...defaultAgCartesianBaseConfig,
  axis: {
    ...defaultAgCartesianBaseConfig.axis,
    color: defaultAgCartesianBaseConfig.grid.color,
  },
  grid: {
    ...defaultAgCartesianBaseConfig.grid,
    xLine: { visible: true },
    yLine: { visible: true },
  },
  scatter: { size: 10, strokeWidth: 2 },
};
