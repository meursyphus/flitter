import type { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisTick(...args: Parameters<LineChartCustom["xAxisTick"]>) {
  return Cartesian.XAxisTick(args[0]);
}
