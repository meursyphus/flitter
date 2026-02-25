import type { CandlestickChartData, CandlestickChartScale } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function getScale({
  datasets,
}: Omit<CandlestickChartData, "labels">): CandlestickChartScale {
  const highs = datasets.map((d) => d.high);
  const lows = datasets.map((d) => d.low);

  return Cartesian.getScale({
    datasets: [{ legend: "high", values: highs }, { legend: "low", values: lows }],
  });
}
