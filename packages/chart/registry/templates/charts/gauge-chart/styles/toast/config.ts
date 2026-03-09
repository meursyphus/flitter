import { type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";

type ToastGaugeSharedConfig = Pick<
  ToastBaseConfig,
  "font" | "title" | "tooltip" | "animation"
>;

export type GaugeChartConfig = ToastGaugeSharedConfig & {
  gauge: {
    valueColor: string;
  };
};

export const defaultToastConfig: GaugeChartConfig = {
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
  gauge: {
    valueColor: "#333333",
  },
};
