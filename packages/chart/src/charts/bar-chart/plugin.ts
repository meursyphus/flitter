import type { BarChartCustom, GetScaleOptionsFn } from "./headless";
import { deepMerge } from "@utils/index";
import { toastCustom, toastGetScaleOptions, defaultToastConfig, type ToastBarChartConfig } from "./toast";

export type StyleConfig<TConfig> = {
  custom: Partial<BarChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type BarChartStyleMap = {
  toast: ToastBarChartConfig;
};

export const barChartStyleConfigs: { [S in keyof BarChartStyleMap]: StyleConfig<BarChartStyleMap[S]> } = {
  toast: {
    custom: toastCustom,
    createConfig: (config) => deepMerge(defaultToastConfig, config),
    getScaleOptions: toastGetScaleOptions,
  },
};
