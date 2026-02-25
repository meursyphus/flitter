import type { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxis(...args: Parameters<BubbleChartCustom["xAxis"]>) {
  return Cartesian.XAxis(args[0], {
    type: "value",
  });
}
