import { CandlestickChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridXLine(..._: Parameters<CandlestickChartCustom["gridXLine"]>) {
  return Cartesian.GridXLine();
}
