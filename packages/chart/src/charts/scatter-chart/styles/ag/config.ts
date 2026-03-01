import { type AgBaseConfig, defaultAgBaseConfig } from "@shared/styles/ag";

export type AgScatterChartConfig = AgBaseConfig & {
  scatter: {
    size: number;
    strokeWidth: number;
  };
};

export const defaultAgConfig: AgScatterChartConfig = {
  ...defaultAgBaseConfig,
  axis: {
    ...defaultAgBaseConfig.axis,
    color: defaultAgBaseConfig.grid.color,
  },
  grid: {
    ...defaultAgBaseConfig.grid,
    xLine: { visible: true },
    yLine: { visible: true },
  },
  scatter: { size: 10, strokeWidth: 2 },
};
