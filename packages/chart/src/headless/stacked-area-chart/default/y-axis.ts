import type { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxis(...args: Parameters<StackedAreaChartCustom["yAxis"]>) {
  return Cartesian.YAxis(args[0], {
    type: "value",
  });
}
