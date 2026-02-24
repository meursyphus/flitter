import type { AreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function DataLabel(...args: Parameters<AreaChartCustom["dataLabel"]>) {
  return Cartesian.DataLabel(args[0]);
}
