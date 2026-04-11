import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_shared/toast/index";

export type ToastBoxPlotChartConfig = ToastBaseConfig & {
  boxPlot: {
    boxWidth: number;
    whiskerWidth: number;
    gap: number;
  };
};

export const defaultToastConfig: ToastBoxPlotChartConfig = {
  ...defaultToastBaseConfig,
  boxPlot: {
    boxWidth: 24,
    whiskerWidth: 14,
    gap: 2,
  },
};
