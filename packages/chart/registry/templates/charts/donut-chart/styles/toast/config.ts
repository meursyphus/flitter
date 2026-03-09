import type { ToastPieChartConfig } from "../../toast-pie-chart/style/config";
import { defaultToastConfig as defaultToastPieConfig } from "../../toast-pie-chart/style/config";

export type DonutChartConfig = ToastPieChartConfig & {
  centerText?: string;
};

export const defaultToastConfig: DonutChartConfig = {
  ...defaultToastPieConfig,
  pie: { ...defaultToastPieConfig.pie, innerRadiusRatio: 0.6 },
};
