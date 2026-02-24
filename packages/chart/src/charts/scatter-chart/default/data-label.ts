import type { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function DataLabel(
  ...args: Parameters<ScatterChartCustom["dataLabel"]>
) {
  return Cartesian.DataLabel(args[0]);
}
