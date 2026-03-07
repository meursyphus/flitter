import { CandlestickChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridYLine(..._: Parameters<CandlestickChartCustom["gridYLine"]>) {
  return Cartesian.GridYLine();
}
