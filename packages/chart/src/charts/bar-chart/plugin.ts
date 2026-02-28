import type { BarChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastBarChartConfig } from "./styles/toast";

export type StyleConfig<TConfig> = {
  custom: Partial<BarChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type BarChartStyleMap = {
  toast: ToastBarChartConfig;
};

export const barChartStyleConfigs: { [S in keyof BarChartStyleMap]: StyleConfig<BarChartStyleMap[S]> } = {
  toast: toastStyleConfig,
};
