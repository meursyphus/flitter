import type { BarChartCustom } from "@headless/bar-chart/types";
import * as Cartesian from "@shared/cartesian/index";

export function Plot(...args: Parameters<BarChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
