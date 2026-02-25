import type { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Title(...args: Parameters<LineChartCustom["title"]>) {
  return Cartesian.Title(args[0]);
}
