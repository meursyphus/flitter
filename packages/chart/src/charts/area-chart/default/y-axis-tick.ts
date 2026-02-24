import type { AreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisTick(...args: Parameters<AreaChartCustom["yAxisTick"]>) {
  return Cartesian.YAxisTick(args[0]);
}
