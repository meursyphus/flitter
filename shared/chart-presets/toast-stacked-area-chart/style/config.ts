import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

export type ToastStackedAreaChartConfig = ToastBaseConfig & {
  area: {
    opacity: number;
    strokeWidth: number;
    spline: boolean;
  };
};

export const defaultToastConfig: ToastStackedAreaChartConfig = {
  ...defaultToastBaseConfig,
  area: { opacity: 0.6, strokeWidth: 2, spline: false },
};
