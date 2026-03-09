import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

type ToastProgressSharedConfig = Pick<
  ToastBaseConfig,
  "font" | "title" | "tooltip" | "animation" | "colors"
>;

export type ProgressChartConfig = ToastProgressSharedConfig & {
  progress: {
    trackColor: string;
    trackHeight: number;
    cornerRadius: number;
    labelColor: string;
  };
};

export const defaultToastConfig: ProgressChartConfig = {
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
  colors: defaultToastBaseConfig.colors,
  progress: {
    trackColor: "#eef2f5",
    trackHeight: 18,
    cornerRadius: 8,
    labelColor: "#333333",
  },
};
