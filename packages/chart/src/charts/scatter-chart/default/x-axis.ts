import type { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxis(...args: Parameters<ScatterChartCustom["xAxis"]>) {
  return Cartesian.XAxis(args[0], {
    type: "value",
  });
}
