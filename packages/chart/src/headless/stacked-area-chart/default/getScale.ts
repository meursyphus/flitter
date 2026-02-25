import type { StackedAreaChartData, StackedAreaChartScale } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function getScale({
  datasets,
}: Omit<StackedAreaChartData, "labels">): StackedAreaChartScale {
  // Calculate stacked totals per data point
  const pointCount = datasets[0]?.values.length ?? 0;
  const stackedTotals: number[] = new Array(pointCount).fill(0);

  for (const dataset of datasets) {
    dataset.values.forEach((value, i) => {
      stackedTotals[i] += value;
    });
  }

  return Cartesian.getScale({
    datasets: [{ legend: "", values: stackedTotals }],
  });
}
