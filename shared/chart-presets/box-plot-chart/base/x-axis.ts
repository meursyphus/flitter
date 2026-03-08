import type { BoxPlotChartCustom } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function XAxis(...args: Parameters<BoxPlotChartCustom["xAxis"]>) {
  return Cartesian.XAxis(args[0], { type: "label" });
}
