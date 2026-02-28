import { ToastBubbleChart, type ToastBubbleChartConfig } from "./toast";

export type BubbleChartStyleMap = {
  toast: ToastBubbleChartConfig;
};

export const bubbleChartStyles = {
  toast: ToastBubbleChart,
} as const;
