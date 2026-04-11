import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_shared/toast/index";

type ToastSankeySharedConfig = Pick<
  ToastBaseConfig,
  "colors" | "font" | "title" | "tooltip" | "animation"
>;

export type SankeyChartConfig = ToastSankeySharedConfig;

export const defaultToastConfig: SankeyChartConfig = {
  colors: defaultToastBaseConfig.colors,
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
};
