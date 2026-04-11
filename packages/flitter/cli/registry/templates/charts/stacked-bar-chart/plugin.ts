import type { BarChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastStackedBarChartConfig } from "./styles/toast";
import { agStyleConfig, type AgStackedBarChartConfig } from "./styles/ag";
import type { DeepPartial } from "@utils/index";

export type StyleConfig<TConfig> = {
  custom: Partial<BarChartCustom<TConfig>>;
  createConfig: (
    config?: DeepPartial<TConfig>,
    direction?: "vertical" | "horizontal",
  ) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type StackedBarChartStyleMap = {
  toast: ToastStackedBarChartConfig;
  ag: AgStackedBarChartConfig;
};

export const stackedBarChartStyleConfigs: { [S in keyof StackedBarChartStyleMap]: StyleConfig<StackedBarChartStyleMap[S]> } = {
  toast: toastStyleConfig,
  ag: agStyleConfig,
};
