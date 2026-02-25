import type { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisLabel(
  ...args: Parameters<ScatterChartCustom["xAxisLabel"]>
) {
  return Cartesian.XAxisLabel(args[0]);
}
