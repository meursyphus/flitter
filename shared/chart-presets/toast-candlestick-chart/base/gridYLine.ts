import { CandlestickChartCustom } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function GridYLine(..._: Parameters<CandlestickChartCustom["gridYLine"]>) {
  return Cartesian.GridYLine();
}
