import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

export type ToastAreaChartConfig = ToastBaseConfig & {
  area: {
    strokeWidth: number;
    opacity: number;
    spline: boolean;
  };
};

export const defaultToastConfig: ToastAreaChartConfig = {
  ...defaultToastBaseConfig,
  area: { strokeWidth: 2, opacity: 0.3, spline: false },
};
