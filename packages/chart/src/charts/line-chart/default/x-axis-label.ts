import type { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisLabel(...args: Parameters<LineChartCustom["xAxisLabel"]>) {
  return Cartesian.XAxisLabel(args[0]);
}
