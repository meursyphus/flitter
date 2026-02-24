import type { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function DataLabel(...args: Parameters<BubbleChartCustom["dataLabel"]>) {
  return Cartesian.DataLabel(args[0]);
}
