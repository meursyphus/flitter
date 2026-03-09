import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

type ToastComboSharedConfig = Pick<
  ToastBaseConfig,
  "colors" | "font" | "title" | "tooltip" | "animation"
>;

export type ComboChartConfig = ToastComboSharedConfig & {
  combo: {
    barGap: number;
    areaOpacity: number;
    lineWidth: number;
    pointSize: number;
  };
};

export const defaultToastConfig: ComboChartConfig = {
  colors: defaultToastBaseConfig.colors,
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  animation: defaultToastBaseConfig.animation,
  combo: {
    barGap: 6,
    areaOpacity: 0.18,
    lineWidth: 2,
    pointSize: 10,
  },
};
