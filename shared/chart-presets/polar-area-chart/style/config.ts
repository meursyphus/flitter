import type { AgPieChartConfig } from "../../pie-chart/style/config";
import { defaultAgConfig as defaultAgPieConfig } from "../../pie-chart/style/config";

export type PolarAreaChartConfig = AgPieChartConfig;

export const defaultAgConfig: PolarAreaChartConfig = {
  ...defaultAgPieConfig,
  pie: { ...defaultAgPieConfig.pie, innerRadiusRatio: 0 },
};
