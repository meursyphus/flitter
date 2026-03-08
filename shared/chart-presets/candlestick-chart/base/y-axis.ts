import type { CandlestickChartCustom } from "../types";
import * as Cartesian from "../../_flitter/shared/cartesian/index";

export function YAxis(...args: Parameters<CandlestickChartCustom["yAxis"]>) {
  return Cartesian.YAxis(args[0], { type: "value" });
}
