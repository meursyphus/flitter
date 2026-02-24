import type { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Legend(...args: Parameters<ScatterChartCustom["legend"]>) {
  return Cartesian.Legend(args[0]);
}
