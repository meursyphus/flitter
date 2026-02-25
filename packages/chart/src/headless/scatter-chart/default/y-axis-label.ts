import type { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisLabel(
  ...args: Parameters<ScatterChartCustom["yAxisLabel"]>
) {
  return Cartesian.YAxisLabel(args[0]);
}
