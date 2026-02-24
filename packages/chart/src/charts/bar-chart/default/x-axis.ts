import type { BarChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxis(...args: Parameters<BarChartCustom["xAxis"]>) {
  const { direction } = args[1];
  return Cartesian.XAxis(args[0], {
    type: direction === "vertical" ? "label" : "value",
  });
}
