import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@shared/styles/ag";

export type AgBarChartConfig = AgCartesianBaseConfig & {
  bar: {
    gap: number;
    cornerRadius: number;
  };
};

export const defaultAgConfig: AgBarChartConfig = {
  ...defaultAgCartesianBaseConfig,
  bar: { gap: 1, cornerRadius: 0 },
};
