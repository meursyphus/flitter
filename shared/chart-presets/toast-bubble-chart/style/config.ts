import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

export type ToastBubbleChartConfig = ToastBaseConfig & {
  bubble: {
    minRadius: number;
    maxRadius: number;
    opacity: number;
  };
};

export const defaultToastConfig: ToastBubbleChartConfig = {
  ...defaultToastBaseConfig,
  bubble: { minRadius: 5, maxRadius: 50, opacity: 0.6 },
};
