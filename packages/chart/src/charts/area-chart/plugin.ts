import type { LineChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastAreaChartConfig } from "./styles/toast";
import { agStyleConfig, type AgAreaChartConfig } from "./styles/ag";

export type StyleConfig<TConfig> = {
  custom: Partial<LineChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type AreaChartStyleMap = {
  toast: ToastAreaChartConfig;
  ag: AgAreaChartConfig;
};

export const areaChartStyleConfigs: { [S in keyof AreaChartStyleMap]: StyleConfig<AreaChartStyleMap[S]> } = {
  toast: toastStyleConfig,
  ag: agStyleConfig,
};
