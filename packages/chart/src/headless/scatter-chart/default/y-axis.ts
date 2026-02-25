import type { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxis(...args: Parameters<ScatterChartCustom["yAxis"]>) {
  return Cartesian.YAxis(args[0], {
    type: "value",
  });
}
