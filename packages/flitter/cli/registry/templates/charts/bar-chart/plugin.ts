import type { BarChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastBarChartConfig } from "./styles/toast";
import { agStyleConfig, type AgBarChartConfig } from "./styles/ag";
import type { DeepPartial } from "@utils/index";

export type StyleConfig<TConfig extends object> = {
  custom: Partial<BarChartCustom<TConfig>>;
  createConfig: (
    config?: DeepPartial<TConfig>,
    direction?: "vertical" | "horizontal",
  ) => TConfig;
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
