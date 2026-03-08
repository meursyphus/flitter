import { CandlestickChartCustom } from "../types";
import * as Cartesian from "../../_flitter/shared/cartesian/index";

export function GridXLine(..._: Parameters<CandlestickChartCustom["gridXLine"]>) {
  return Cartesian.GridXLine();
}
