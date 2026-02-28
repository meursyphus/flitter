import type { StyleConfig } from "../bar-chart/plugin";
import { deepMerge } from "@utils/index";
import { toastCustom, toastGetScaleOptions, defaultToastConfig, type ToastStackedBarChartConfig } from "./toast";

export type StackedBarChartStyleMap = {
  toast: ToastStackedBarChartConfig;
};

export const stackedBarChartStyleConfigs: { [S in keyof StackedBarChartStyleMap]: StyleConfig<StackedBarChartStyleMap[S]> } = {
  toast: {
    custom: toastCustom,
    createConfig: (config) => deepMerge(defaultToastConfig, config),
    getScaleOptions: toastGetScaleOptions,
  },
};
