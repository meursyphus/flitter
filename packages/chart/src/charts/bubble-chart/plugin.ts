import type { BubbleChartCustom, GetScaleOptionsFn } from "./headless";
import { toastStyleConfig, type ToastBubbleChartConfig } from "./toast";

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
  toast: toastStyleConfig,
};
