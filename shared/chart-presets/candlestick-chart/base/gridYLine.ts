import { CandlestickChartCustom } from "../types";
import * as Cartesian from "../../_flitter/shared/cartesian/index";

export function GridYLine(..._: Parameters<CandlestickChartCustom["gridYLine"]>) {
  return Cartesian.GridYLine();
}
