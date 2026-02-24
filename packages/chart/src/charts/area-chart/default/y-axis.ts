import type { AreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxis(...args: Parameters<AreaChartCustom["yAxis"]>) {
  return Cartesian.YAxis(args[0], {
    type: "value",
  });
}
