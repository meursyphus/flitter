import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@shared/styles/ag";

export type AgBubbleChartConfig = AgCartesianBaseConfig & {
  bubble: {
    minRadius: number;
    maxRadius: number;
    opacity: number;
  };
};

export const defaultAgConfig: AgBubbleChartConfig = {
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
  bubble: { minRadius: 3, maxRadius: 25, opacity: 0.7 },
};
