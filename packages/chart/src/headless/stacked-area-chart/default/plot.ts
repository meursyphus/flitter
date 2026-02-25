import type { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Plot(...args: Parameters<StackedAreaChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
