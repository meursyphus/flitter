import {
  ToastStackedAreaChart,
  type ToastStackedAreaChartConfig,
} from "./toast";

export type StackedAreaChartStyleMap = {
  toast: ToastStackedAreaChartConfig;
};

export const stackedAreaChartStyles = {
  toast: ToastStackedAreaChart,
} as const;
