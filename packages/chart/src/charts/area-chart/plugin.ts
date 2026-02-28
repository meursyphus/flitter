import type { LineChartCustom, GetScaleOptionsFn } from "./headless";
import { toastStyleConfig, type ToastAreaChartConfig } from "./toast";

export type StyleConfig<TConfig> = {
  custom: Partial<LineChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type AreaChartStyleMap = {
  toast: ToastAreaChartConfig;
};

export const areaChartStyleConfigs: { [S in keyof AreaChartStyleMap]: StyleConfig<AreaChartStyleMap[S]> } = {
  toast: toastStyleConfig,
};
