import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_shared/toast/index";

export type ToastStackedBarChartConfig = ToastBaseConfig & {
  bar: {
    gap: number;
  };
};

export const defaultToastConfig: ToastStackedBarChartConfig = {
  ...defaultToastBaseConfig,
  bar: { gap: 0 },
};
