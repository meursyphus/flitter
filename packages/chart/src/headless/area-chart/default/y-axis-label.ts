import type { AreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisLabel(...args: Parameters<AreaChartCustom["yAxisLabel"]>) {
  return Cartesian.YAxisLabel(args[0]);
}
