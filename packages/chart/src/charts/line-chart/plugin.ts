import type { LineChartCustom, GetScaleOptionsFn } from "./headless";
import { deepMerge } from "@utils/index";
import { toastCustom, toastGetScaleOptions, defaultToastConfig, type ToastLineChartConfig } from "./toast";

export type StyleConfig<TConfig> = {
  custom: Partial<LineChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type LineChartStyleMap = {
  toast: ToastLineChartConfig;
};

export const lineChartStyleConfigs: { [S in keyof LineChartStyleMap]: StyleConfig<LineChartStyleMap[S]> } = {
  toast: {
    custom: toastCustom,
    createConfig: (config) => deepMerge(defaultToastConfig, config),
    getScaleOptions: toastGetScaleOptions,
  },
};
