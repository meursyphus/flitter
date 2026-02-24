import { StackedBarChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridXLine(..._: Parameters<StackedBarChartCustom["gridXLine"]>) {
  return Cartesian.GridXLine();
}
