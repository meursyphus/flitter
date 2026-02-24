import type { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Title(...args: Parameters<BubbleChartCustom["title"]>) {
  return Cartesian.Title(args[0]);
}
