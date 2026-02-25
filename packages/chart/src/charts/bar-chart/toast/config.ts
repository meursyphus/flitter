import { TOAST_COLORS } from "@utils/toast";

export type ToastBarChartConfig = {
  /** Color palette for data series */
  colors: string[];

  /** Base typography settings */
  font: {
    family: string;
    size: number;
  };

  /** Title area (e.g. branding text above chart) */
  title: {
    visible: boolean;
    color: string;
    fontSize: number;
  };

  /** Legend visibility */
  legend: {
    visible: boolean;
  };

  /** Axis styling (applies to both x and y axes) */
  axis: {
    color: string;
    thickness: number;
    label: {
      color: string;
      fontSize: number;
      gap: number;
    };
    tick: {
      size: number;
    };
  };

  /** Grid line styling */
  grid: {
    color: string;
    thickness: number;
  };

  /** Chart area padding */
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  /** Bar-specific styling */
  bar: {
    gap: number;
    cornerRadius: number;
  };

  /** Animation settings */
  animation: {
    enabled: boolean;
    duration: number;
    staggerDelay: number;
  };
};

export const defaultToastConfig: ToastBarChartConfig = {
  colors: TOAST_COLORS,
  font: { family: "Noto Sans JP", size: 11 },
  title: { visible: false, color: "#999999", fontSize: 13 },
  legend: { visible: false },
  axis: {
    color: "#BBBBBB",
    thickness: 1,
    label: { color: "#666666", fontSize: 11, gap: 8 },
    tick: { size: 6 },
  },
  grid: { color: "#EEEEEE", thickness: 1 },
  padding: { top: 30, right: 20, bottom: 40, left: 60 },
  bar: { gap: 1, cornerRadius: 0 },
  animation: { enabled: true, duration: 300, staggerDelay: 60 },
};
