import type { StackedBarChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxis(...args: Parameters<StackedBarChartCustom["xAxis"]>) {
  const { direction } = args[1];
  return Cartesian.XAxis(args[0], {
    type: direction === "vertical" ? "label" : "value",
  });
}
