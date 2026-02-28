import type { LineChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastLineChartConfig } from "./styles/toast";

export type StyleConfig<TConfig> = {
  custom: Partial<LineChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type LineChartStyleMap = {
  toast: ToastLineChartConfig;
};

export const lineChartStyleConfigs: { [S in keyof LineChartStyleMap]: StyleConfig<LineChartStyleMap[S]> } = {
  toast: toastStyleConfig,
};
