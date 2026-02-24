import type { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxis(...args: Parameters<LineChartCustom["yAxis"]>) {
  return Cartesian.YAxis(args[0], {
    type: "value",
  });
}
