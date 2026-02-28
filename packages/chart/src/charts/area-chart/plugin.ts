import type { LineChartCustom, GetScaleOptionsFn } from "./headless";
import { deepMerge } from "@utils/index";
import { toastCustom, toastGetScaleOptions, defaultToastConfig, type ToastAreaChartConfig } from "./toast";

export type StyleConfig<TConfig> = {
  custom: Partial<LineChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type AreaChartStyleMap = {
  toast: ToastAreaChartConfig;
};

export const areaChartStyleConfigs: { [S in keyof AreaChartStyleMap]: StyleConfig<AreaChartStyleMap[S]> } = {
  toast: {
    custom: toastCustom,
    createConfig: (config) => deepMerge(defaultToastConfig, config),
    getScaleOptions: toastGetScaleOptions,
  },
};
