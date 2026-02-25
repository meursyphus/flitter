import type { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Title(...args: Parameters<ScatterChartCustom["title"]>) {
  return Cartesian.Title(args[0]);
}
