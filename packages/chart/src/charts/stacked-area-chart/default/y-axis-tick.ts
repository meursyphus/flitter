import type { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisTick(
  ...args: Parameters<StackedAreaChartCustom["yAxisTick"]>
) {
  return Cartesian.YAxisTick(args[0]);
}
