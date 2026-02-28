import { type ToastBaseConfig, defaultToastBaseConfig } from "@shared/styles/toast";

export type ToastLineChartConfig = ToastBaseConfig & {
  line: {
    strokeWidth: number;
  };
};

export const defaultToastConfig: ToastLineChartConfig = {
  ...defaultToastBaseConfig,
  line: { strokeWidth: 2 },
};
