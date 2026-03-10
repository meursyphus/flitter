import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

type ToastNetworkSharedConfig = Pick<
  ToastBaseConfig,
  "font" | "title" | "tooltip" | "animation" | "colors"
>;

export type NetworkChartConfig = ToastNetworkSharedConfig & {
  network: {
    edgeColor: string;
    edgeWidth: number;
    labelOffset: number;
  };
};

export const defaultToastConfig: NetworkChartConfig = {
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
  colors: defaultToastBaseConfig.colors,
  network: {
    edgeColor: "rgba(0,0,0,0.18)",
    edgeWidth: 1.5,
    labelOffset: 18,
  },
};
