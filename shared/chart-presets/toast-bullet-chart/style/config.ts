import { type ToastBaseConfig, defaultToastBaseConfig } from "../../_styles/toast/index";

export type ToastBulletChartConfig = ToastBaseConfig & {
  bullet: {
    rangeColors: string[];
    valueBarColor: string;
    valueBarHeightRatio: number;
    targetMarkerColor: string;
    targetMarkerWidth: number;
    targetMarkerHeightRatio: number;
    gap: number;
  };
};

export const defaultToastConfig: ToastBulletChartConfig = {
  ...defaultToastBaseConfig,
  legend: {
    ...defaultToastBaseConfig.legend,
    visible: false,
  },
  bullet: {
    rangeColors: ["#e0e0e0", "#cccccc", "#b0b0b0", "#999999", "#808080"],
    valueBarColor: "#444444",
    valueBarHeightRatio: 0.4,
    targetMarkerColor: "#222222",
    targetMarkerWidth: 2.5,
    targetMarkerHeightRatio: 0.7,
    gap: 4,
  },
};
