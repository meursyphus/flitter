import type { AgPieChartConfig } from "../../pie-chart/styles/ag/config";
import { defaultAgConfig as defaultAgPieConfig } from "../../pie-chart/styles/ag/config";

export type DonutChartConfig = AgPieChartConfig & {
  centerText?: string;
};

export const defaultAgConfig: DonutChartConfig = {
  ...defaultAgPieConfig,
  legend: { ...defaultAgPieConfig.legend, position: "bottom" },
  pie: { ...defaultAgPieConfig.pie, innerRadiusRatio: 0.6 },
};
