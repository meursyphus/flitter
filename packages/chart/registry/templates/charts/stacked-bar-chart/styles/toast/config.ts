import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

export type ToastStackedBarChartConfig = ToastBaseConfig & {
  bar: {
    gap: number;
  };
};

export const defaultToastConfig: ToastStackedBarChartConfig = {
  ...defaultToastBaseConfig,
  bar: { gap: 0 },
};
