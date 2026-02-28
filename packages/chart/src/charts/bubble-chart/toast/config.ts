import { TOAST_COLORS } from "@shared/styles/toast/utils";
import type { ToastBaseConfig } from "@shared/toast";

export type ToastBubbleChartConfig = ToastBaseConfig & {
  bubble: {
    minRadius: number;
    maxRadius: number;
    opacity: number;
  };
};

export const defaultToastConfig: ToastBubbleChartConfig = {
  colors: TOAST_COLORS,
  font: { family: "Noto Sans JP", size: 11 },
  title: { visible: true, color: "#000000", fontSize: 16, fontWeight: "bold", position: "top", alignment: "center" },
  legend: { visible: true, position: "bottom" },
  axis: {
    color: "#BBBBBB",
    thickness: 1,
    label: { color: "#666666", fontSize: 11, gap: 8 },
    tick: { size: 6 },
  },
  grid: { color: "#EEEEEE", thickness: 1 },
  padding: { top: 30, right: 20, bottom: 40, left: 60 },
  bubble: { minRadius: 5, maxRadius: 25, opacity: 0.6 },
  animation: { enabled: true, duration: 300, staggerDelay: 60 },
};
