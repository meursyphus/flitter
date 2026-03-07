import type { BoxPlotChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxis(...args: Parameters<BoxPlotChartCustom["xAxis"]>) {
  return Cartesian.XAxis(args[0], { type: "label" });
}
