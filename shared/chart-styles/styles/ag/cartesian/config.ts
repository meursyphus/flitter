import { AG_FILLS, AG_STROKES } from "../utils";

/**
 * Common config shape shared by all ag-style chart configs.
 * Individual chart configs extend this with chart-specific settings.
 *
 * Modeled after AG Charts (ag-grid.com/charts) default theme.
 */
export type AgCartesianBaseConfig = {
  background: string;
  colors: { fills: string[]; strokes: string[] };
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
  subtitle: {
    visible: boolean;
    text: string;
    color: string;
    fontSize: number;
    fontFamily?: string;
    fontWeight?: string;
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
    xLine: { visible: boolean };
    yLine: { visible: boolean };
  };
  grid: {
    color: string;
    thickness: number;
    dash: number[];
    xLine: { visible: boolean };
    yLine: { visible: boolean };
  };
  padding: { top: number; right: number; bottom: number; left: number };
  tooltip: {
    enabled: boolean;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderRadius: number;
    padding: number;
  };
};

export const defaultAgCartesianBaseConfig: AgCartesianBaseConfig = {
  background: "white",
  colors: { fills: AG_FILLS, strokes: AG_STROKES },
  font: { family: "Verdana, sans-serif", size: 13 },
  title: {
    text: "",
    visible: true,
    color: "#181d1f",
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
  legend: { visible: true, position: "bottom", gap: 16, color: "#585858" },
  axis: {
    color: "#8a8c8c",
    thickness: 1,
    label: { color: "#585858", fontSize: 13, gap: 11, format: (name) => name },
    tick: { enabled: false, size: 6 },
    xLine: { visible: true },
    yLine: { visible: true },
  },
  grid: {
    color: "#e2e2e2",
    thickness: 1,
    dash: [],
    xLine: { visible: false },
    yLine: { visible: true },
  },
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
  tooltip: {
    enabled: true,
    backgroundColor: "white",
    textColor: "#181d1f",
    borderColor: "#e2e2e2",
    borderRadius: 4,
    padding: 12,
  },
};
