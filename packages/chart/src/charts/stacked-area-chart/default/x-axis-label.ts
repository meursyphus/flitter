import type { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisLabel(
  ...args: Parameters<StackedAreaChartCustom["xAxisLabel"]>
) {
  return Cartesian.XAxisLabel(args[0]);
}
