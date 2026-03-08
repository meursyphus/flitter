import type { BoxPlotChartCustom } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function YAxis(...args: Parameters<BoxPlotChartCustom["yAxis"]>) {
  return Cartesian.YAxis(args[0], { type: "value" });
}
