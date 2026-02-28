import { ToastLineChart, type ToastLineChartConfig } from "./toast";

export type LineChartStyleMap = {
  toast: ToastLineChartConfig;
};

export const lineChartStyles = {
  toast: ToastLineChart,
} as const;
