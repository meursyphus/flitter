import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

export type AgBulletChartConfig = AgCartesianBaseConfig & {
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

export const defaultAgConfig: AgBulletChartConfig = {
  ...defaultAgCartesianBaseConfig,
  // Bullet chart defaults: horizontal bars, X-axis visible, Y-axis line hidden
  axis: {
    ...defaultAgCartesianBaseConfig.axis,
    xLine: { visible: true },
    yLine: { visible: false },
  },
  grid: {
    ...defaultAgCartesianBaseConfig.grid,
    xLine: { visible: false },
    yLine: { visible: true },
  },
  legend: {
    ...defaultAgCartesianBaseConfig.legend,
    visible: false,
  },
  bullet: {
    rangeColors: ["#ddd", "#ccc", "#bbb", "#aaa", "#999"],
    valueBarColor: "#333",
    valueBarHeightRatio: 0.4,
    targetMarkerColor: "#222",
    targetMarkerWidth: 2.5,
    targetMarkerHeightRatio: 0.7,
    gap: 4,
  },
};
