import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

type ToastTreemapSharedConfig = Pick<
  ToastBaseConfig,
  "font" | "title" | "tooltip" | "animation"
>;

export type TreemapChartConfig = ToastTreemapSharedConfig & {
  treemap: {
    padding: number;
  };
};

export const defaultToastConfig: TreemapChartConfig = {
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
  treemap: {
    padding: 20,
  },
};
