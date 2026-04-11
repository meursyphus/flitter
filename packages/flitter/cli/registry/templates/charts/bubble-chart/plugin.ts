import type { BubbleChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastBubbleChartConfig } from "./styles/toast";
import { agStyleConfig, type AgBubbleChartConfig } from "./styles/ag";
import type { DeepPartial } from "@utils/index";

export type StyleConfig<TConfig> = {
  custom: Partial<BubbleChartCustom<TConfig>>;
  createConfig: (config?: DeepPartial<TConfig>) => TConfig;
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
