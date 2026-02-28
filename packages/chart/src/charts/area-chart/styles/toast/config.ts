import { type ToastBaseConfig, defaultToastBaseConfig } from "@shared/styles/toast";

export type ToastAreaChartConfig = ToastBaseConfig & {
  area: {
    strokeWidth: number;
    opacity: number;
  };
};

export const defaultToastConfig: ToastAreaChartConfig = {
  ...defaultToastBaseConfig,
  area: { strokeWidth: 2, opacity: 0.3 },
};
