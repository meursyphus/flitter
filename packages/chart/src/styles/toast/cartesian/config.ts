import { TOAST_COLORS } from "../utils";

/**
 * Common config shape shared by all toast-style chart configs.
 * Individual chart configs extend this with chart-specific settings.
 */
export type ToastBaseConfig = {
  colors: string[];
  font: { family: string; size: number };
  title: {
    text: string;
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
  font: { family: "Arial", size: 11 },
  title: { text: "", visible: true, color: "#333333", fontSize: 18, fontWeight: "bold", position: "top", alignment: "start" },
  legend: { visible: true, position: "bottom", gap: 12 },
  axis: {
    color: "#333333",
    thickness: 1,
    label: { color: "#333333", fontSize: 11, gap: 8, format: (name) => name },
    tick: { size: 6 },
  },
  grid: { color: "rgba(0, 0, 0, 0.05)", thickness: 1 },
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
  animation: { enabled: true, duration: 300, staggerDelay: 60 },
  tooltip: {
    enabled: true,
    backgroundColor: "rgba(50,50,50,0.6)",
    textColor: "white",
    borderRadius: 4,
    padding: 14,
  },
};
