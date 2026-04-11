import type { ScatterChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastScatterChartConfig } from "./styles/toast";
import { agStyleConfig, type AgScatterChartConfig } from "./styles/ag";
import type { DeepPartial } from "@utils/index";

export type StyleConfig<TConfig extends object> = {
  custom: Partial<ScatterChartCustom<TConfig>>;
  createConfig: (config?: DeepPartial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type ScatterChartStyleMap = {
  toast: ToastScatterChartConfig;
  ag: AgScatterChartConfig;
};

export const scatterChartStyleConfigs: { [S in keyof ScatterChartStyleMap]: StyleConfig<ScatterChartStyleMap[S]> } = {
  toast: toastStyleConfig,
  ag: agStyleConfig,
};
