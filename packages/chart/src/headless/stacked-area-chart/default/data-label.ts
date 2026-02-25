import type { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function DataLabel(
  ...args: Parameters<StackedAreaChartCustom["dataLabel"]>
) {
  return Cartesian.DataLabel(args[0]);
}
