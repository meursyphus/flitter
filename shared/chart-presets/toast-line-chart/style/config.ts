import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_shared/toast/index";

export type ToastLineChartConfig = ToastBaseConfig & {
  line: {
    strokeWidth: number;
    spline: boolean;
  };
};

export const defaultToastConfig: ToastLineChartConfig = {
  ...defaultToastBaseConfig,
  line: { strokeWidth: 2, spline: false },
};
