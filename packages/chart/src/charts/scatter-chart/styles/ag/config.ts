import { type AgBaseConfig, defaultAgBaseConfig } from "@shared/styles/ag";

export type AgScatterChartConfig = AgBaseConfig & {
  scatter: {
    size: number;
    fill: boolean;
    strokeWidth: number;
  };
};

export const defaultAgConfig: AgScatterChartConfig = {
  ...defaultAgBaseConfig,
  scatter: { size: 10, fill: true, strokeWidth: 2 },
};
