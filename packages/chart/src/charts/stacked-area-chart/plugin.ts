import type { StackedAreaChartCustom } from "./headless";
import { toastStyleConfig, type ToastStackedAreaChartConfig } from "./toast";

export type StyleConfig<TConfig> = {
  custom: (config: TConfig) => Partial<StackedAreaChartCustom>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
};

export type StackedAreaChartStyleMap = {
  toast: ToastStackedAreaChartConfig;
};

export const stackedAreaChartStyleConfigs: {
  [S in keyof StackedAreaChartStyleMap]: StyleConfig<StackedAreaChartStyleMap[S]>;
} = {
  toast: toastStyleConfig,
};
