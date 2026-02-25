import type { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisLabel(...args: Parameters<LineChartCustom["yAxisLabel"]>) {
  return Cartesian.YAxisLabel(args[0]);
}
