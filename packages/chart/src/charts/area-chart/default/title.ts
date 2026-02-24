import type { AreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Title(...args: Parameters<AreaChartCustom["title"]>) {
  return Cartesian.Title(args[0]);
}
