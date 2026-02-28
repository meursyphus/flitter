import { ToastStackedBarChart, type ToastStackedBarChartConfig } from "./toast";

export type StackedBarChartStyleMap = {
  toast: ToastStackedBarChartConfig;
};

export const stackedBarChartStyles = {
  toast: ToastStackedBarChart,
} as const;
