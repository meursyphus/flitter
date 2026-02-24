import type { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisTick(
  ...args: Parameters<ScatterChartCustom["yAxisTick"]>
) {
  return Cartesian.YAxisTick(args[0]);
}
