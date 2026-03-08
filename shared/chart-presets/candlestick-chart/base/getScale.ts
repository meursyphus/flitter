import type { CandlestickChartData, CandlestickChartScale } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function getScale({
  datasets,
}: Omit<CandlestickChartData, "labels">): CandlestickChartScale {
  const highs = datasets.flatMap((dataset) => dataset.data.map((point) => point.high));
  const lows = datasets.flatMap((dataset) => dataset.data.map((point) => point.low));

  return Cartesian.getScale({
    datasets: [{ legend: "high", values: highs }, { legend: "low", values: lows }],
  });
}
