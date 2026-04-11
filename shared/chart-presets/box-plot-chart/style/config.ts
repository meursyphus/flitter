import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_shared/ag/index";

export type AgBoxPlotChartConfig = AgCartesianBaseConfig & {
  boxPlot: {
    boxWidth: number;
    whiskerWidth: number;
    gap: number;
  };
};

export const defaultAgConfig: AgBoxPlotChartConfig = {
  ...defaultAgCartesianBaseConfig,
  boxPlot: {
    boxWidth: 20,
    whiskerWidth: 12,
    gap: 2,
  },
};
