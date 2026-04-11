import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_shared/toast/index";

export type ToastBarChartConfig = ToastBaseConfig & {
  bar: {
    gap: number;
    cornerRadius: number;
  };
};

export const defaultToastConfig: ToastBarChartConfig = {
  ...defaultToastBaseConfig,
  bar: { gap: 1, cornerRadius: 0 },
};
