import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

export type AgStackedBarChartConfig = AgCartesianBaseConfig & {
  bar: {
    gap: number;
  };
};

export const defaultAgConfig: AgStackedBarChartConfig = {
  ...defaultAgCartesianBaseConfig,
  bar: { gap: 0 },
};
