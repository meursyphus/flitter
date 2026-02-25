import type { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxis(...args: Parameters<BubbleChartCustom["yAxis"]>) {
  return Cartesian.YAxis(args[0], {
    type: "value",
  });
}
