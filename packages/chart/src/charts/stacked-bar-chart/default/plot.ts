import type { StackedBarChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Plot(...args: Parameters<StackedBarChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
