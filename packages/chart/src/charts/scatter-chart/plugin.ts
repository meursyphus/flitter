import type { ScatterChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastScatterChartConfig } from "./styles/toast";

export type StyleConfig<TConfig> = {
  custom: Partial<ScatterChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type ScatterChartStyleMap = {
  toast: ToastScatterChartConfig;
};

export const scatterChartStyleConfigs: { [S in keyof ScatterChartStyleMap]: StyleConfig<ScatterChartStyleMap[S]> } = {
  toast: toastStyleConfig,
};
