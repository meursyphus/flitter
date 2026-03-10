import type { AgPieChartConfig } from "../../pie-chart/style/config";
import { defaultAgConfig as defaultAgPieConfig } from "../../pie-chart/style/config";

export type DonutChartConfig = AgPieChartConfig & {
  centerText?: string;
};

export const defaultAgConfig: DonutChartConfig = {
  ...defaultAgPieConfig,
  legend: { ...defaultAgPieConfig.legend, position: "bottom" },
  pie: { ...defaultAgPieConfig.pie, innerRadiusRatio: 0.6 },
};
