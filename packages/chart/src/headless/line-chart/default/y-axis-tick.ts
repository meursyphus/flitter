import type { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisTick(...args: Parameters<LineChartCustom["yAxisTick"]>) {
  return Cartesian.YAxisTick(args[0]);
}
