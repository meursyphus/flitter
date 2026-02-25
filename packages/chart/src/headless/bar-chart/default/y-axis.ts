import type { BarChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxis(...args: Parameters<BarChartCustom["yAxis"]>) {
  const { direction } = args[1];
  return Cartesian.YAxis(args[0], {
    type: direction === "horizontal" ? "label" : "value",
  });
}