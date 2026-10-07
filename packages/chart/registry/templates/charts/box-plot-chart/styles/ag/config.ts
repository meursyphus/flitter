import {
  type AgCartesianBaseConfig,
  defaultAgCartesianBaseConfig,
} from "@styles/ag";

export type AgBoxPlotChartConfig = AgCartesianBaseConfig & {
  boxPlot: {
    whiskerColor: string;
    medianColor: string;
    boxWidth: number;
    whiskerWidth: number;
    gap: number;
  };
};

export const defaultAgConfig: AgBoxPlotChartConfig = {
  ...defaultAgCartesianBaseConfig,
  boxPlot: {
    whiskerColor: "#585858",
    medianColor: "#E74C3C",
    boxWidth: 20,
    whiskerWidth: 12,
    gap: 2,
  },
};
