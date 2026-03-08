import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../../ag-base/index";

export type AgStackedBarChartConfig = AgCartesianBaseConfig & {
  bar: {
    gap: number;
  };
};

export const defaultAgConfig: AgStackedBarChartConfig = {
  ...defaultAgCartesianBaseConfig,
  bar: { gap: 0 },
};
