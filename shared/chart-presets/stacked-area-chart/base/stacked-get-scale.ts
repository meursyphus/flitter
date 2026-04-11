import type { LineChartData, LineChartScale, LineChartScaleOptions } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";

export function stackedGetScale(
  { datasets }: LineChartData,
  options?: LineChartScaleOptions,
): LineChartScale {
  const pointCount = datasets[0]?.values.length ?? 0;
  const stackedTotals: number[] = new Array(pointCount).fill(0);

  for (const dataset of datasets) {
    dataset.values.forEach((value, i) => {
      stackedTotals[i] += value;
    });
  }

  return Cartesian.getScale(
    { datasets: [{ legend: "", values: stackedTotals }] },
    options,
  );
}
