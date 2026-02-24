import type { AreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisTick(...args: Parameters<AreaChartCustom["xAxisTick"]>) {
  return Cartesian.XAxisTick(args[0]);
}
