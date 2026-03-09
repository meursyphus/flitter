import type { ToastPieChartConfig } from "../../toast-pie-chart/style/config";
import { defaultToastConfig as defaultToastPieConfig } from "../../toast-pie-chart/style/config";

export type PolarAreaChartConfig = ToastPieChartConfig;

export const defaultToastConfig: PolarAreaChartConfig = {
  ...defaultToastPieConfig,
  pie: { ...defaultToastPieConfig.pie, innerRadiusRatio: 0 },
};
