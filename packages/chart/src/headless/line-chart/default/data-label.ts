import type { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function DataLabel(...args: Parameters<LineChartCustom["dataLabel"]>) {
  return Cartesian.DataLabel(args[0]);
}
