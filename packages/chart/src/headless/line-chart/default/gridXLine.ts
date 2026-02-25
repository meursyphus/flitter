import { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridXLine(..._: Parameters<LineChartCustom["gridXLine"]>) {
  return Cartesian.GridXLine();
}
