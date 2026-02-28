import { type ToastBaseConfig, defaultToastBaseConfig } from "@shared/styles/toast";

export type ToastBubbleChartConfig = ToastBaseConfig & {
  bubble: {
    minRadius: number;
    maxRadius: number;
    opacity: number;
  };
};

export const defaultToastConfig: ToastBubbleChartConfig = {
  ...defaultToastBaseConfig,
  bubble: { minRadius: 5, maxRadius: 25, opacity: 0.6 },
};
