import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

export type WaterfallChartConfig = ToastBaseConfig & {
  waterfall: {
    barGap: number;
  };
};

const semanticToastColors = ["#1aa3f0", "#f2b544", "#22b07d"];

export const defaultToastConfig: WaterfallChartConfig = {
  ...defaultToastBaseConfig,
  colors: semanticToastColors,
  waterfall: {
    barGap: 10,
  },
};
