import { type AgBaseConfig, defaultAgBaseConfig } from "@shared/styles/ag";

export type AgBubbleChartConfig = AgBaseConfig & {
  bubble: {
    minRadius: number;
    maxRadius: number;
    opacity: number;
  };
};

export const defaultAgConfig: AgBubbleChartConfig = {
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
  bubble: { minRadius: 3, maxRadius: 25, opacity: 0.7 },
};
