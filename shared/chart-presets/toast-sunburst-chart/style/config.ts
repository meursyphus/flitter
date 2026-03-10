import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

type ToastSunburstSharedConfig = Pick<
  ToastBaseConfig,
  "font" | "title" | "tooltip" | "legend" | "animation"
>;

export type SunburstChartConfig = ToastSunburstSharedConfig & {
  sunburst: {
    padding: number;
    innerRadiusRatio: number;
    inactiveOpacity: number;
  };
};

export const defaultToastConfig: SunburstChartConfig = {
  font: defaultToastBaseConfig.font,
  title: defaultToastBaseConfig.title,
  tooltip: defaultToastBaseConfig.tooltip,
  legend: defaultToastBaseConfig.legend,
  animation: defaultToastBaseConfig.animation,
  sunburst: {
    padding: 20,
    innerRadiusRatio: 0.12,
    inactiveOpacity: 0.28,
  },
};
