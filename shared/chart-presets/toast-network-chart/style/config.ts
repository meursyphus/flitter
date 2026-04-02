import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

type ToastNetworkSharedConfig = Pick<
  ToastBaseConfig,
  "font" | "title" | "tooltip" | "animation" | "colors"
>;

export type NetworkChartConfig = ToastNetworkSharedConfig;

export const defaultToastConfig: NetworkChartConfig = {
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
  colors: defaultToastBaseConfig.colors,
};
