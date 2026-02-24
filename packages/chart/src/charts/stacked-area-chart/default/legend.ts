import type { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Legend(...args: Parameters<StackedAreaChartCustom["legend"]>) {
  return Cartesian.Legend(args[0]);
}
