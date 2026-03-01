import type { StackedAreaChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastStackedAreaChartConfig } from "./styles/toast";
import { agStyleConfig, type AgStackedAreaChartConfig } from "./styles/ag";

export type StyleConfig<TConfig> = {
  custom: Partial<StackedAreaChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type StackedAreaChartStyleMap = {
  toast: ToastStackedAreaChartConfig;
  ag: AgStackedAreaChartConfig;
};

export const stackedAreaChartStyleConfigs: {
  [S in keyof StackedAreaChartStyleMap]: StyleConfig<StackedAreaChartStyleMap[S]>;
} = {
  toast: toastStyleConfig,
  ag: agStyleConfig,
};
