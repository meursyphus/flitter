import { type ToastBaseConfig, defaultToastBaseConfig } from "@shared/styles/toast";

export type ToastScatterChartConfig = ToastBaseConfig & {
  scatter: {
    size: number;
  };
};

export const defaultToastConfig: ToastScatterChartConfig = {
  ...defaultToastBaseConfig,
  scatter: { size: 10 },
};
