import type { CandlestickChartCandle, CandlestickChartScale } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function getScale(
	candles: CandlestickChartCandle[],
): CandlestickChartScale {
  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);

  return Cartesian.getScale({
    datasets: [{ legend: "high", values: highs }, { legend: "low", values: lows }],
  });
}
