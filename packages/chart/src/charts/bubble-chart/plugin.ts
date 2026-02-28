import type { BubbleChartCustom, GetScaleOptionsFn } from "./headless";
import { deepMerge } from "@utils/index";
import {
  toastCustom,
  toastGetScaleOptions,
  defaultToastConfig,
  type ToastBubbleChartConfig,
} from "./toast";

export type StyleConfig<TConfig> = {
  custom: Partial<BubbleChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type BubbleChartStyleMap = {
  toast: ToastBubbleChartConfig;
};

export const bubbleChartStyleConfigs: {
  [S in keyof BubbleChartStyleMap]: StyleConfig<BubbleChartStyleMap[S]>;
} = {
  toast: {
    custom: toastCustom,
    createConfig: (config) => deepMerge(defaultToastConfig, config),
    getScaleOptions: toastGetScaleOptions,
  },
};
