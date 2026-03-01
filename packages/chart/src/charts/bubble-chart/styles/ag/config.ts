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
  bubble: { minRadius: 5, maxRadius: 50, opacity: 0.7 },
};
