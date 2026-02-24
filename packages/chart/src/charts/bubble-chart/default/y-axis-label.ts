import type { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisLabel(...args: Parameters<BubbleChartCustom["yAxisLabel"]>) {
  return Cartesian.YAxisLabel(args[0]);
}
