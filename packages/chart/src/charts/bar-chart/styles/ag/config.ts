import { type AgBaseConfig, defaultAgBaseConfig } from "@shared/styles/ag";

export type AgBarChartConfig = AgBaseConfig & {
  bar: {
    gap: number;
    cornerRadius: number;
  };
};

export const defaultAgConfig: AgBarChartConfig = {
  ...defaultAgBaseConfig,
  bar: { gap: 1, cornerRadius: 0 },
};
