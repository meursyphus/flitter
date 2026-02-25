import type { GaugeChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Title(...args: Parameters<GaugeChartCustom["title"]>) {
  return Cartesian.Title(args[0]);
}
