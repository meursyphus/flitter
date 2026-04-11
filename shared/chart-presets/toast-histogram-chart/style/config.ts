import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_shared/toast/index";

export type HistogramChartConfig = ToastBaseConfig & {
  histogram: {
    barGap: number;
  };
};

export const defaultToastConfig: HistogramChartConfig = {
  ...defaultToastBaseConfig,
  legend: { ...defaultToastBaseConfig.legend, visible: false },
  histogram: {
    barGap: 0,
  },
};
