import { ToastScatterChart, type ToastScatterChartConfig } from "./toast";

export type ScatterChartStyleMap = {
  toast: ToastScatterChartConfig;
};

export const scatterChartStyles = {
  toast: ToastScatterChart,
} as const;
