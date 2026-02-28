import { toastCustom, toastGetScaleOptions, defaultToastConfig, type ToastStackedBarChartConfig } from "./toast";

export type StackedBarChartStyleMap = {
  toast: ToastStackedBarChartConfig;
};

export const stackedBarChartStyleConfigs = {
  toast: {
    custom: toastCustom,
    defaults: defaultToastConfig,
    getScaleOptions: toastGetScaleOptions,
  },
} as const;
