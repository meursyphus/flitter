import type { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisTick(...args: Parameters<BubbleChartCustom["yAxisTick"]>) {
  return Cartesian.YAxisTick(args[0]);
}
