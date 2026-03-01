import { AG_FILLS, AG_STROKES } from "./utils";

/**
 * Common config shape shared by all ag-style chart configs.
 * Individual chart configs extend this with chart-specific settings.
 *
 * Modeled after AG Charts (ag-grid.com/charts) default theme.
 */
export type AgBaseConfig = {
  background: string;
  colors: { fills: string[]; strokes: string[] };
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
  subtitle: {
    visible: boolean;
    text: string;
    color: string;
    fontSize: number;
  };
  legend: {
    visible: boolean;
    position: "top" | "bottom" | "right" | "right-top" | "right-center" | "right-bottom";
    gap: number;
    color: string;
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
    tick: { enabled: boolean; size: number };
  };
  grid: { color: string; thickness: number; dash: number[] };
  padding: { top: number; right: number; bottom: number; left: number };
  animation: { enabled: boolean; duration: number; staggerDelay: number };
  tooltip: {
    enabled: boolean;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderRadius: number;
    padding: number;
  };
};

export const defaultAgBaseConfig: AgBaseConfig = {
  background: "#192232",
  colors: { fills: AG_FILLS, strokes: AG_STROKES },
  font: { family: "Verdana, sans-serif", size: 13 },
  title: {
    visible: true,
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    position: "top",
    alignment: "start",
  },
  subtitle: {
    visible: false,
    text: "",
    color: "#8d949a",
    fontSize: 14,
  },
  legend: { visible: true, position: "bottom", gap: 16, color: "#a0aab4" },
  axis: {
    color: "#586274",
    thickness: 1,
    label: { color: "#a0aab4", fontSize: 13, gap: 11, format: (name) => name },
    tick: { enabled: false, size: 6 },
  },
  grid: { color: "#2d3a4a", thickness: 1, dash: [4, 2] },
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
  animation: { enabled: true, duration: 400, staggerDelay: 40 },
  tooltip: {
    enabled: true,
    backgroundColor: "#28313e",
    textColor: "#ffffff",
    borderColor: "#3a4a5c",
    borderRadius: 4,
    padding: 12,
  },
};
