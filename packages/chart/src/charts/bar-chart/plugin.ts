import type { BarChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastBarChartConfig } from "./styles/toast";
import { agStyleConfig, type AgBarChartConfig } from "./styles/ag";

export type StyleConfig<TConfig> = {
  custom: Partial<BarChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>, direction?: "vertical" | "horizontal") => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type BarChartStyleMap = {
  toast: ToastBarChartConfig;
  ag: AgBarChartConfig;
};

export const barChartStyleConfigs: { [S in keyof BarChartStyleMap]: StyleConfig<BarChartStyleMap[S]> } = {
  toast: toastStyleConfig,
  ag: agStyleConfig,
};
