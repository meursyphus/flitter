import { type ToastBaseConfig, defaultToastBaseConfig } from "@shared/styles/toast";

export type ToastStackedAreaChartConfig = ToastBaseConfig & {
  area: {
    opacity: number;
    strokeWidth: number;
  };
};

export const defaultToastConfig: ToastStackedAreaChartConfig = {
  ...defaultToastBaseConfig,
  area: { opacity: 0.6, strokeWidth: 2 },
};
