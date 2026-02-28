import type { StackedAreaChartCustom } from "./headless";
import { deepMerge } from "@utils/index";
import {
  createToastCustom,
  defaultToastConfig,
  type ToastStackedAreaChartConfig,
} from "./toast";

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
  toast: {
    custom: createToastCustom,
    createConfig: (config) => deepMerge(defaultToastConfig, config),
  },
};
