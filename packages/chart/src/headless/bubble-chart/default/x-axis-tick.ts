import type { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisTick(...args: Parameters<BubbleChartCustom["xAxisTick"]>) {
  return Cartesian.XAxisTick(args[0]);
}
