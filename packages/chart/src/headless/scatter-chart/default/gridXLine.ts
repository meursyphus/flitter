import { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridXLine(..._: Parameters<ScatterChartCustom["gridXLine"]>) {
  return Cartesian.GridXLine();
}
