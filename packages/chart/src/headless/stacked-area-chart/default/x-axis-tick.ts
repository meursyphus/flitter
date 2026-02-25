import type { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisTick(
  ...args: Parameters<StackedAreaChartCustom["xAxisTick"]>
) {
  return Cartesian.XAxisTick(args[0]);
}
