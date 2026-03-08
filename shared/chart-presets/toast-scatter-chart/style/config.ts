import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

export type ToastScatterChartConfig = ToastBaseConfig & {
  scatter: {
    size: number;
    fill: boolean;
    strokeWidth: number;
  };
};

export const defaultToastConfig: ToastScatterChartConfig = {
  ...defaultToastBaseConfig,
  scatter: { size: 10, fill: false, strokeWidth: 2 },
};
