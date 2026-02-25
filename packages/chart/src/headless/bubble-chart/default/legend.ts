import type { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Legend(...args: Parameters<BubbleChartCustom["legend"]>) {
  return Cartesian.Legend(args[0]);
}
