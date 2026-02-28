import type { ScatterChartCustom, GetScaleOptionsFn } from "./headless";
import { deepMerge } from "@utils/index";
import { toastCustom, toastGetScaleOptions, defaultToastConfig, type ToastScatterChartConfig } from "./toast";

export type StyleConfig<TConfig> = {
  custom: Partial<ScatterChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type ScatterChartStyleMap = {
  toast: ToastScatterChartConfig;
};

export const scatterChartStyleConfigs: { [S in keyof ScatterChartStyleMap]: StyleConfig<ScatterChartStyleMap[S]> } = {
  toast: {
    custom: toastCustom,
    createConfig: (config) => deepMerge(defaultToastConfig, config),
    getScaleOptions: toastGetScaleOptions,
  },
};
