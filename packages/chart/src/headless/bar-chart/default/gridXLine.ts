import { BarChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridXLine(..._: Parameters<BarChartCustom["gridXLine"]>) {
  return Cartesian.GridXLine();
}
