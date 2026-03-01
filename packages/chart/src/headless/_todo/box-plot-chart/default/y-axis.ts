import type { BoxPlotChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxis(...args: Parameters<BoxPlotChartCustom["yAxis"]>) {
  return Cartesian.YAxis(args[0], { type: "value" });
}
