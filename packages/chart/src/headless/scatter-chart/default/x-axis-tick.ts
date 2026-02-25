import type { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisTick(
  ...args: Parameters<ScatterChartCustom["xAxisTick"]>
) {
  return Cartesian.XAxisTick(args[0]);
}
