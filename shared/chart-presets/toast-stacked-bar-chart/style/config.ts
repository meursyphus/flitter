import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

export type ToastStackedBarChartConfig = ToastBaseConfig & {
  bar: {
    gap: number;
  };
};

export const defaultToastConfig: ToastStackedBarChartConfig = {
  ...defaultToastBaseConfig,
  bar: { gap: 0 },
};
