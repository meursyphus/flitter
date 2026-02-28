import { toastCustom, toastGetScaleOptions, defaultToastConfig, type ToastBarChartConfig } from "./toast";

export type BarChartStyleMap = {
  toast: ToastBarChartConfig;
};

export const barChartStyleConfigs = {
  toast: {
    custom: toastCustom,
    defaults: defaultToastConfig,
    getScaleOptions: toastGetScaleOptions,
  },
} as const;
