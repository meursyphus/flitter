//xAxis, yAxis, series,

import type { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Plot(...args: Parameters<LineChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
