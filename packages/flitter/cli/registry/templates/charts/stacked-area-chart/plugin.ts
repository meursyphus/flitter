import type { LineChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastStackedAreaChartConfig } from "./styles/toast";
import { agStyleConfig, type AgStackedAreaChartConfig } from "./styles/ag";
import type { DeepPartial } from "@utils/index";

export type StyleConfig<TConfig extends object> = {
  custom: Partial<LineChartCustom<TConfig>>;
  createConfig: (config?: DeepPartial<TConfig>) => TConfig;
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
