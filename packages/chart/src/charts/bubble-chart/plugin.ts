import type { BubbleChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastBubbleChartConfig } from "./styles/toast";
import { agStyleConfig, type AgBubbleChartConfig } from "./styles/ag";

export type StyleConfig<TConfig> = {
  custom: Partial<BubbleChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type BubbleChartStyleMap = {
  toast: ToastBubbleChartConfig;
  ag: AgBubbleChartConfig;
};

export const bubbleChartStyleConfigs: {
  [S in keyof BubbleChartStyleMap]: StyleConfig<BubbleChartStyleMap[S]>;
} = {
  toast: toastStyleConfig,
  ag: agStyleConfig,
};
