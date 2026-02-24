import type { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxis(...args: Parameters<LineChartCustom["xAxis"]>) {
  return Cartesian.XAxis(args[0], {
    type: "value",
  });
}
