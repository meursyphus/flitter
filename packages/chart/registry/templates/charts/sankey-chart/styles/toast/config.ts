import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

type ToastSankeySharedConfig = Pick<
  ToastBaseConfig,
  "font" | "title" | "tooltip" | "animation"
>;

export type SankeyChartConfig = ToastSankeySharedConfig;

export const defaultToastConfig: SankeyChartConfig = {
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
};
