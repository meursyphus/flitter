import { TOAST_COLORS } from "@shared/styles/toast/utils";
import type { ToastBaseConfig } from "@shared/toast";

export type ToastStackedAreaChartConfig = ToastBaseConfig & {
  /** Stacked-area-specific styling */
  area: {
    opacity: number;
    strokeWidth: number;
  };
};

export const defaultToastConfig: ToastStackedAreaChartConfig = {
  colors: TOAST_COLORS,
  font: { family: "Noto Sans JP", size: 11 },
  title: {
    visible: true,
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    position: "top",
    alignment: "center",
  },
  legend: { visible: true, position: "bottom" },
  axis: {
    color: "#BBBBBB",
    thickness: 1,
    label: { color: "#666666", fontSize: 11, gap: 8 },
    tick: { size: 6 },
  },
  grid: { color: "#EEEEEE", thickness: 1 },
  padding: { top: 30, right: 20, bottom: 40, left: 60 },
  area: { opacity: 0.6, strokeWidth: 2 },
  animation: { enabled: true, duration: 300, staggerDelay: 60 },
};
