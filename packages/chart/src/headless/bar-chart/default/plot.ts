//xAxis, yAxis, series,

import type { BarChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Plot(...args: Parameters<BarChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
