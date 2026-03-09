import { CandlestickChartCustom } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function GridXLine(..._: Parameters<CandlestickChartCustom["gridXLine"]>) {
  return Cartesian.GridXLine();
}
