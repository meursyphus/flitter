import type { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisLabel(
  ...args: Parameters<StackedAreaChartCustom["yAxisLabel"]>
) {
  return Cartesian.YAxisLabel(args[0]);
}
