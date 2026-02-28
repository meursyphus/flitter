import { ToastAreaChart, type ToastAreaChartConfig } from "./toast";

export type AreaChartStyleMap = {
  toast: ToastAreaChartConfig;
};

export const areaChartStyles = {
  toast: ToastAreaChart,
} as const;
