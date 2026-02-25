import type { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisLabel(...args: Parameters<BubbleChartCustom["xAxisLabel"]>) {
  return Cartesian.XAxisLabel(args[0]);
}
