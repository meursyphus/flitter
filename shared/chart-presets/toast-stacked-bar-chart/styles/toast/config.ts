import { type ToastBaseConfig, defaultToastBaseConfig } from "../../../toast-base/index";

export type ToastStackedBarChartConfig = ToastBaseConfig & {
  bar: {
    gap: number;
  };
};

export const defaultToastConfig: ToastStackedBarChartConfig = {
  ...defaultToastBaseConfig,
  bar: { gap: 0 },
};
