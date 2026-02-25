import { ToastBarChart, type ToastBarChartConfig } from "./toast";

export type BarChartStyleMap = {
  toast: ToastBarChartConfig;
};

export const barChartStyles = {
  toast: ToastBarChart,
} as const;
