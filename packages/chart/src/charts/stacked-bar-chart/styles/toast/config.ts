import { type ToastBaseConfig, defaultToastBaseConfig } from "@shared/styles/toast";

export type ToastStackedBarChartConfig = ToastBaseConfig & {
  bar: {
    gap: number;
  };
};

export const defaultToastConfig: ToastStackedBarChartConfig = {
  ...defaultToastBaseConfig,
  bar: { gap: 0 },
};
