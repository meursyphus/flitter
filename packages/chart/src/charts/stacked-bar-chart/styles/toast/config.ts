import { type ToastBaseConfig, defaultToastBaseConfig } from "@shared/styles/toast";

export type ToastStackedBarChartConfig = ToastBaseConfig & {
  bar: {
    gap: number;
    cornerRadius: number;
  };
};

export const defaultToastConfig: ToastStackedBarChartConfig = {
  ...defaultToastBaseConfig,
  bar: { gap: 0, cornerRadius: 0 },
};
