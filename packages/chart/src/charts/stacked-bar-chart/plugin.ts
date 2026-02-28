import type { BarChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastStackedBarChartConfig } from "./styles/toast";

export type StyleConfig<TConfig> = {
  custom: Partial<BarChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type StackedBarChartStyleMap = {
  toast: ToastStackedBarChartConfig;
};

export const stackedBarChartStyleConfigs: { [S in keyof StackedBarChartStyleMap]: StyleConfig<StackedBarChartStyleMap[S]> } = {
  toast: toastStyleConfig,
};
