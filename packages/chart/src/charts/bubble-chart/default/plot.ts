import type { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Plot(...args: Parameters<BubbleChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
