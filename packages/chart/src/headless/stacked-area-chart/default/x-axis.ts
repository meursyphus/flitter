import type { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxis(...args: Parameters<StackedAreaChartCustom["xAxis"]>) {
  return Cartesian.XAxis(args[0], {
    type: "value",
  });
}
