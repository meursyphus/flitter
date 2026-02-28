import type { StyleConfig } from "../bar-chart/plugin";
import { toastStyleConfig, type ToastStackedBarChartConfig } from "./styles/toast";

export type StackedBarChartStyleMap = {
  toast: ToastStackedBarChartConfig;
};

export const stackedBarChartStyleConfigs: { [S in keyof StackedBarChartStyleMap]: StyleConfig<StackedBarChartStyleMap[S]> } = {
  toast: toastStyleConfig,
};
