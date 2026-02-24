import type { StackedBarChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxis(...args: Parameters<StackedBarChartCustom["yAxis"]>) {
  const { direction } = args[1];
  return Cartesian.YAxis(args[0], {
    type: direction === "horizontal" ? "label" : "value",
  });
}