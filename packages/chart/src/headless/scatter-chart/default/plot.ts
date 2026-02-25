import type { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Plot(...args: Parameters<ScatterChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
