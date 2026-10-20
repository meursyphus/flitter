import type { BoxPlotChartCustom } from "../types";
import * as Cartesian from "@flitterjs/chart";

export function YAxis(...args: Parameters<BoxPlotChartCustom["yAxis"]>) {
  return Cartesian.YAxis(args[0], { type: "value" });
}
