import { TOAST_COLORS } from "./utils";

/**
 * Common config shape shared by all toast-style chart configs.
 * Individual chart configs extend this with chart-specific settings.
 */
export type ToastBaseConfig = {
  colors: string[];
  font: { family: string; size: number };
  title: {
    visible: boolean;
    color: string;
    fontSize: number;
    fontFamily?: string;
    fontWeight?: string;
    position: "top" | "bottom";
    alignment: "start" | "center" | "end";
  };
  legend: {
    visible: boolean;
    position: "top" | "bottom" | "right" | "right-top" | "right-center" | "right-bottom";
    gap: number;
  };
  axis: {
    color: string;
    thickness: number;
    label: {
      color: string;
      fontSize: number;
      gap: number;
      format: (name: string, index: number, axis: "x" | "y") => string;
    };
    tick: { size: number };
  };
  grid: { color: string; thickness: number };
  padding: { top: number; right: number; bottom: number; left: number };
  animation: { enabled: boolean; duration: number; staggerDelay: number };
  tooltip: {
    enabled: boolean;
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    padding: number;
  };
};

export const defaultToastBaseConfig: ToastBaseConfig = {
  colors: TOAST_COLORS,
  font: { family: "Noto Sans JP", size: 11 },
  title: { visible: true, color: "#000000", fontSize: 16, fontWeight: "bold", position: "top", alignment: "center" },
  legend: { visible: true, position: "bottom", gap: 12 },
  axis: {
    color: "#BBBBBB",
    thickness: 1,
    label: { color: "#666666", fontSize: 11, gap: 8, format: (name) => name },
    tick: { size: 6 },
  },
  grid: { color: "#EEEEEE", thickness: 1 },
  padding: { top: 30, right: 20, bottom: 40, left: 60 },
  animation: { enabled: true, duration: 300, staggerDelay: 60 },
  tooltip: {
    enabled: true,
    backgroundColor: "rgba(50,50,50,0.95)",
    textColor: "white",
    borderRadius: 0,
    padding: 12,
  },
};
