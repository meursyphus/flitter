import type { AreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisLabel(...args: Parameters<AreaChartCustom["xAxisLabel"]>) {
  return Cartesian.XAxisLabel(args[0]);
}
