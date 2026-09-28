import type { LineChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastLineChartConfig } from "./styles/toast";
import { agStyleConfig, type AgLineChartConfig } from "./styles/ag";
import type { DeepPartial } from "@utils/index";

export type StyleConfig<TConfig extends object> = {
  custom: Partial<LineChartCustom<TConfig>>;
  createConfig: (config?: DeepPartial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type LineChartStyleMap = {
  toast: ToastLineChartConfig;
  ag: AgLineChartConfig;
};

export const lineChartStyleConfigs: { [S in keyof LineChartStyleMap]: StyleConfig<LineChartStyleMap[S]> } = {
  toast: toastStyleConfig,
  ag: agStyleConfig,
};
