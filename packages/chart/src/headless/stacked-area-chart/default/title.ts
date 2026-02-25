import type { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Title(...args: Parameters<StackedAreaChartCustom["title"]>) {
  return Cartesian.Title(args[0]);
}
